const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true }
});

const RoundScheduleSchema = new mongoose.Schema({
  roundId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  timeSlot: TimeSlotSchema,
  venue: { type: String } // Optional, can be inherited from sub-event
});

const SubEventScheduleSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  subEventId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  priority: { type: Number, default: 0 }, // Higher number = higher priority
  rounds: [RoundScheduleSchema],
  dailyHours: { type: Number } // Hours per day for multi-day events
}, { timestamps: true });

const SubEventSchedule = mongoose.model('SubEventSchedule', SubEventScheduleSchema);
module.exports = SubEventSchedule;