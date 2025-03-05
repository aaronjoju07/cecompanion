const { Event, SubEvent } = require('../models/Event');
const EventSchedulingAlgorithm = require('../utils/eventSchedulingAlgorithm');

exports.createEvent = async (req, res) => {
  try {
    const {
      name, description, conductedDates,
      targetedAudience, organizingInstitution,
      maximumStudents, maxEventsPerStudent,
      organizingCollege, generalRules,
      contactInfo, subEvents
    } = req.body;

    // Create sub-events first
    const createdSubEvents = await SubEvent.create(subEvents || []);

    // Create main event
    const newEvent = new Event({
      name,
      description,
      conductedDates,
      targetedAudience,
      organizingInstitution,
      maximumStudents,
      maxEventsPerStudent,
      organizingCollege,
      generalRules,
      contactInfo,
      subEvents: createdSubEvents.map(se => se._id)
    });

    await newEvent.save();

    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating event', 
      error: error.message 
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
      .populate('registeredStudents', 'username email');

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

exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

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
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

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