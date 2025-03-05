const mongoose = require('mongoose');

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
  }]
});

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
    start: {
      type: Date,
      required: [true, 'Start date is required']
    },
    end: {
      type: Date,
      required: [true, 'End date is required']
    }
  },
  targetedAudience: {
    departments: [String],
    courses: [String]
  },
  organizingInstitution: String,
  maximumStudents: {
    type: Number,
    default: 100
  },
  maxEventsPerStudent: {
    type: Number,
    default: 3
  },
  organizingCollege: String,
  generalRules: [String],
  contactInfo: {
    email: String,
    phone: String
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
}, {
  timestamps: true
});

const Event = mongoose.model('Event', EventSchema);
const SubEvent = mongoose.model('SubEvent', SubEventSchema);

module.exports = { Event, SubEvent };