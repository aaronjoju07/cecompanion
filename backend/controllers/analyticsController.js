const AnalyticsHelper = require('../utils/analyticsHelper');
const { Event } = require('../models/Event');
const User = require('../models/User');
const Registration = require('../models/Registration');

exports.getTopPerformingStudents = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const topStudents = await AnalyticsHelper.getTopPerformingStudents(Number(limit));
    
    res.json({
      message: 'Top performing students retrieved',
      topStudents
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to retrieve top students', 
      error: error.message 
    });
  }
};

exports.getEventParticipationAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;
    const analytics = await AnalyticsHelper.getEventParticipationAnalytics(eventId);
    
    res.json({
      message: 'Event participation analytics retrieved',
      analytics
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to retrieve event analytics', 
      error: error.message 
    });
  }
};

exports.generateOverallEventInsights = async (req, res) => {
  try {
    // Total events
    const totalEvents = await Event.countDocuments();
    
    // Total registrations
    const totalRegistrations = await Registration.countDocuments();
    
    // Events by status
    const eventStatusBreakdown = await Event.aggregate([
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);
    
    // Department participation
    const departmentParticipation = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: {
        _id: '$department',
        studentCount: { $sum: 1 }
      }},
      { $sort: { studentCount: -1 } }
    ]);

    res.json({
      message: 'Overall event insights generated',
      insights: {
        totalEvents,
        totalRegistrations,
        eventStatusBreakdown,
        departmentParticipation
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to generate event insights', 
      error: error.message 
    });
  }
};