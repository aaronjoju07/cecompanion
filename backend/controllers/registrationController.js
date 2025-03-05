const { Event } = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');
const QRCodeGenerator = require('../utils/qrCodeGenerator');

exports.registerForEvent = async (req, res) => {
  try {
    const { eventId, subEventIds } = req.body;
    const userId = req.user._id;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user has reached max event registration limit
    const existingRegistrations = await Registration.countDocuments({ 
      user: userId, 
      'event.status': 'upcoming' 
    });

    if (existingRegistrations >= event.maxEventsPerStudent) {
      return res.status(400).json({ 
        message: `You can only register for ${event.maxEventsPerStudent} events` 
      });
    }

    // Check event capacity
    const currentRegistrations = await Registration.countDocuments({ event: eventId });
    if (currentRegistrations >= event.maximumStudents) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Create registration
    const registration = new Registration({
      user: userId,
      event: eventId,
      subEvents: subEventIds || []
    });

    await registration.save();

    // Generate QR Code for registration
    const qrCodePath = await QRCodeGenerator.generateEventRegistrationQR(
      { registrationId: registration._id },
      eventId,
      userId
    );

    // Update user's registered events
    await User.findByIdAndUpdate(userId, {
      $addToSet: { registeredEvents: eventId }
    });

    // Update event's registered students
    await Event.findByIdAndUpdate(eventId, {
      $addToSet: { registeredStudents: userId }
    });

    res.status(201).json({
      message: 'Successfully registered for the event',
      registration,
      qrCodePath
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};

exports.getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event')
      .populate('subEvents')
      .sort({ 'event.conductedDates.start': 1 });

    // Separate upcoming and past events
    const upcomingEvents = registrations.filter(
      reg => new Date(reg.event.conductedDates.start) > new Date()
    );
    const pastEvents = registrations.filter(
      reg => new Date(reg.event.conductedDates.start) <= new Date()
    );

    res.json({
      upcomingEvents,
      pastEvents
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch registrations', 
      error: error.message 
    });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const userId = req.user._id;

    const registration = await Registration.findOneAndDelete({ 
      _id: registrationId, 
      user: userId 
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Remove from user's registered events
    await User.findByIdAndUpdate(userId, {
      $pull: { registeredEvents: registration.event }
    });

    // Remove from event's registered students
    await Event.findByIdAndUpdate(registration.event, {
      $pull: { registeredStudents: userId }
    });

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to cancel registration', 
      error: error.message 
    });
  }
};