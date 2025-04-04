const { Event } = require('../models/Event');

// Create a new round for a SubEvent
exports.createRound = async (req, res) => {
  const { eventId, subEventId, name, scoringCategories, timeSlot } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const subEvent = event.subEvents.id(subEventId);
    if (!subEvent) return res.status(404).json({ message: 'SubEvent not found' });

    const newRound = { name, scoringCategories };
    subEvent.rounds.push(newRound);
    await event.save();

    // Create or update SubEventSchedule with timeSlot
    let schedule = await SubEventSchedule.findOne({ eventId, subEventId });
    if (!schedule) {
      schedule = new SubEventSchedule({
        eventId,
        subEventId,
        rounds: [],
      });
    }

    schedule.rounds.push({
      roundId: newRound._id,
      name,
      timeSlot: {
        start: new Date(timeSlot.start),
        end: new Date(timeSlot.end),
      },
      venue: subEvent.venue || 'TBD',
    });

    await schedule.save();

    res.status(201).json({ round: newRound, schedule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit scores for a participant in a round
exports.submitScores = async (req, res) => {
  const { eventId, subEventId, roundId, participantId, scores } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const subEvent = event.subEvents.id(subEventId);
    if (!subEvent) return res.status(404).json({ message: 'SubEvent not found' });
    const round = subEvent.rounds.id(roundId);
    if (!round) return res.status(404).json({ message: 'Round not found' });

    const scoreEntry = {
      participant: participantId,
      round: roundId,
      scores: new Map(Object.entries(scores)),
      totalScore: Object.values(scores).reduce((a, b) => a + b, 0)
    };
    subEvent.scores.push(scoreEntry);
    await event.save();
    res.status(201).json(scoreEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate final result for a SubEvent
exports.calculateFinalResult = async (req, res) => {
  const { eventId, subEventId } = req.params;
  try {
    const event = await Event.findById(eventId).populate('subEvents.scores.participant');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const subEvent = event.subEvents.id(subEventId);
    if (!subEvent) return res.status(404).json({ message: 'SubEvent not found' });

    const participantScores = {};
    subEvent.scores.forEach(score => {
      const participantId = score.participant._id.toString();
      if (!participantScores[participantId]) {
        participantScores[participantId] = { total: 0, participant: score.participant };
      }
      participantScores[participantId].total += score.totalScore;
    });

    const sortedParticipants = Object.values(participantScores).sort((a, b) => b.total - a.total);
    res.status(200).json(sortedParticipants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};