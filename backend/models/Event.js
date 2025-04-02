// /model/Event.js
const mongoose = require('mongoose');

// Schema for a Round within a SubEvent
const RoundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Round name is required']
  },
  scoringCategories: [{
    type: String // e.g., "Technical", "Presentation", "Creativity"
  }]
});

// Schema for a Participant's Score in a Round
const ScoreSchema = new mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Participant ID is required']
  },
  round: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Round',
    required: [true, 'Round ID is required']
  },
  scores: {
    type: Map,
    of: Number // e.g., { "Technical": 85, "Presentation": 90 }
  },
  totalScore: {
    type: Number,
    default: 0 // Sum of scores for this round
  }
});

// Updated SubEvent Schema
const SubEventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sub-event name is required']
  },
  overview: String,
  rules: [String],
  venue: String,
  targetedDepartments: [String],
  targetedCourses: [String],
  prizePools: [{
    rank: Number,
    amount: Number
  }],
  rounds: [RoundSchema], // Array of rounds
  scores: [ScoreSchema]  // Array of scores for participants
});

// Existing Event Schema (unchanged except for subEvents reference)
const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  conductedDates: {
    start: { type: Date, required: [true, 'Start date is required'] },
    end: { type: Date, required: [true, 'End date is required'] }
  },
  targetedAudience: {
    departments: [String],
    courses: [String]
  },
  organizingInstitution: String,
  maximumStudents: { type: Number, default: 100 },
  maxEventsPerStudent: { type: Number, default: 3 },
  organizingCollege: String,
  generalRules: [String],
  contactInfo: { email: String, phone: String },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer ID is required']
  },
  subEvents: [SubEventSchema],
  registeredStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  }
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);
const SubEvent = mongoose.model('SubEvent', SubEventSchema);

module.exports = { Event, SubEvent };