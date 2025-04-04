const { Event } = require('../models/Event');
const SubEventSchedule = require('../models/SubEventSchedule');
const EventSchedulingAlgorithm = require('../utils/eventSchedulingAlgorithm');

exports.optimizeEventSchedule = async (req, res) => {
  try {
    const { eventId, dailyHours } = req.body;
    if (!eventId) return res.status(400).json({ message: 'Event ID required' });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const totalDays = Math.ceil(
      (new Date(event.conductedDates.end) - new Date(event.conductedDates.start)) / (1000 * 60 * 60 * 24)
    );
    const hours = dailyHours || (totalDays > 1 ? 8 : Math.min(24, totalDays * 8));

    const schedules = await EventSchedulingAlgorithm.scheduleSubEvents(eventId, hours);
    res.json({ message: 'Sub-event schedule optimized successfully', schedule: schedules });
  } catch (error) {
    res.status(500).json({ message: 'Failed to optimize schedule', error: error.message });
  }
};

exports.getEventSchedule = async (req, res) => {
  try {
    const { eventId } = req.query;
    const schedules = await SubEventSchedule.find({ eventId })
      .populate('eventId', 'name conductedDates')
      .lean();

    // Fetch the event once
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');

    // Map schedules using the single event object
    const enrichedSchedules = schedules.map((s) => ({
      ...s,
      subEventName: event.subEvents.id(s.subEventId)?.name || 'Unknown'
    }));

    res.json({
      totalSubEvents: schedules.length,
      schedules: enrichedSchedules
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve schedule', error: error.message });
  }
};

exports.editSubEventSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { priority, rounds, dailyHours } = req.body;

    const schedule = await SubEventSchedule.findById(scheduleId);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

    const event = await Event.findById(schedule.eventId);
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (priority !== undefined) schedule.priority = priority;
    if (rounds) schedule.rounds = rounds; // Validate time slots client-side or here
    if (dailyHours) schedule.dailyHours = dailyHours;

    await schedule.save();
    res.json({ message: 'Schedule updated successfully', schedule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to edit schedule', error: error.message });
  }
};

// Assuming rescheduleEvent exists; if not, add a placeholder or remove the route
exports.rescheduleEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    // Placeholder logic for rescheduling; implement as needed
    res.json({ message: `Event ${eventId} rescheduled (placeholder)` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reschedule event', error: error.message });
  }
};