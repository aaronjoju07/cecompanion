const { Event } = require('../models/Event');
const EventSchedulingAlgorithm = require('../utils/eventSchedulingAlgorithm');

exports.optimizeEventSchedule = async (req, res) => {
  try {
    // Fetch upcoming events
    const events = await Event.find({ 
      status: 'upcoming',
      'conductedDates.start': { $gte: new Date() }
    });

    // Optimize scheduling
    const optimizedSchedule = EventSchedulingAlgorithm.optimizeEventScheduling(events);

    // Update events with new scheduling information
    const bulkUpdateOperations = optimizedSchedule.map(event => ({
      updateOne: {
        filter: { _id: event._id },
        update: { 
          $set: { 
            scheduledTimeSlot: event.scheduledTimeSlot,
            status: 'scheduled' 
          }
        }
      }
    }));

    await Event.bulkWrite(bulkUpdateOperations);

    res.json({
      message: 'Event schedule optimized successfully',
      schedule: optimizedSchedule
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to optimize event schedule', 
      error: error.message 
    });
  }
};

exports.getEventSchedule = async (req, res) => {
  try {
    const { startDate, endDate, department, course } = req.query;

    let query = { 
      status: { $in: ['upcoming', 'ongoing'] }
    };

    // Add date range filter if provided
    if (startDate && endDate) {
      query['conductedDates.start'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Add department filter if provided
    if (department) {
      query['targetedAudience.departments'] = department;
    }

    // Add course filter if provided
    if (course) {
      query['targetedAudience.courses'] = course;
    }

    const events = await Event.find(query)
      .sort({ 'conductedDates.start': 1 })
      .select('name description conductedDates targetedAudience');

    res.json({
      totalEvents: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to retrieve event schedule', 
      error: error.message 
    });
  }
};

exports.rescheduleEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { newStartDate, newEndDate } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update event dates
    event.conductedDates = {
      start: new Date(newStartDate),
      end: new Date(newEndDate)
    };

    // Re-run scheduling optimization for this event
    const optimizedSchedule = EventSchedulingAlgorithm.optimizeEventScheduling([event]);

    // Update event with new scheduling
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId, 
      { 
        conductedDates: event.conductedDates,
        scheduledTimeSlot: optimizedSchedule[0].scheduledTimeSlot
      }, 
      { new: true }
    );

    res.json({
      message: 'Event rescheduled successfully',
      event: updatedEvent
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to reschedule event', 
      error: error.message 
    });
  }
};