// /contoroller/eventController.js
const { Event, SubEvent } = require('../models/Event');
const EventSchedulingAlgorithm = require('../utils/eventSchedulingAlgorithm');

// In /controller/eventController.js (or wherever your controller is)
exports.createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      conductedDates,
      targetedAudience = {},
      organizingInstitution = '',
      maximumStudents = 100,
      maxEventsPerStudent = 3,
      organizingCollege = '',
      generalRules = [],
      contactInfo = {},
      subEvents = [],
    } = req.body;

    // Validate required fields
    if (!name || !description || !conductedDates?.start || !conductedDates?.end) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new event object
    const newEvent = new Event({
      name,
      description,
      conductedDates: {
        start: new Date(conductedDates.start),
        end: new Date(conductedDates.end),
      },
      targetedAudience,
      organizingInstitution,
      maximumStudents: parseInt(maximumStudents),
      maxEventsPerStudent: parseInt(maxEventsPerStudent),
      organizingCollege,
      generalRules,
      contactInfo,
      subEvents,
      organizer: req.user._id, // Assuming user ID comes from auth middleware
    });

    // Save to database
    await newEvent.save();

    // Return success response with event details
    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent,
    });
  } catch (error) {
    console.error('Create Event Error:', error.message);
    res.status(500).json({
      message: 'Error creating event',
      error: error.message,
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const { department, course } = req.query;

    let query = {};
    if (department) {
      query['targetedAudience.departments'] = department;
    }
    if (course) {
      query['targetedAudience.courses'] = course;
    }

    const events = await Event.find(query)
      .populate('subEvents')
      .populate('organizer', 'username email')
      .sort({ 'conductedDates.start': 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching events',
      error: error.message
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('subEvents')
      .populate('registeredStudents', 'username email')
      .populate('organizer', 'username email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching event',
      error: error.message
    });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id })
      .populate('subEvents')
      .populate('registeredStudents', 'username email')
      .sort({ 'conductedDates.start': 1 });

    res.json({
      count: events.length,
      events: events
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching your events',
      error: error.message
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    // First check if the user is the organizer of this event
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to update this event'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating event',
      error: error.message
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    // First check if the user is the organizer of this event
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to delete this event'
      });
    }

    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    // Optional: Delete associated sub-events
    await SubEvent.deleteMany({ _id: { $in: deletedEvent.subEvents } });

    res.json({
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting event',
      error: error.message
    });
  }
};

exports.optimizeEventScheduling = async (req, res) => {
  try {
    const events = await Event.find({
      status: 'upcoming'
    });

    const optimizedSchedule = EventSchedulingAlgorithm.optimizeEventScheduling(events);

    res.json({
      message: 'Events optimally scheduled',
      schedule: optimizedSchedule
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error optimizing event scheduling',
      error: error.message
    });
  }
};