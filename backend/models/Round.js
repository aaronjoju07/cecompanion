// /model/Round.js
const mongoose = require('mongoose');

const RoundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Round name is required'],
  },
  scoringCategories: [{
    type: String,
  }],
  startDate: {
    type: Date,
    required: [true, 'Start date and time are required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date and time are required'],
    validate: {
      validator: function (value) {
        return this.startDate < value;
      },
      message: 'End date must be after start date',
    },
  },
  subEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubEvent',
    required: [true, 'Sub-event reference is required'],
  },
});

const Round = mongoose.model('Round', RoundSchema);
module.exports = Round;