const { Event, SubEvent } = require('../models/Event');
const User = require('../models/User');
const Registration = require('../models/Registration');

class AnalyticsHelper {
  /**
   * Get top-performing students across all events
   * @param {number} limit - Number of top students to retrieve
   * @returns {Array} Top students with their performance metrics
   */
  static async getTopPerformingStudents(limit = 10) {
    try {
      const students = await User.aggregate([
        { $match: { role: 'student' } },
        { $unwind: '$performanceMetrics' },
        {
          $group: {
            _id: '$_id',
            username: { $first: '$username' },
            totalScore: { $sum: '$performanceMetrics.subEventPerformance.score' },
            eventCount: { $sum: 1 }
          }
        },
        { $sort: { totalScore: -1 } },
        { $limit: limit }
      ]);

      return students;
    } catch (error) {
      console.error('Analytics Error:', error);
      throw new Error('Failed to retrieve top-performing students');
    }
  }

  /**
   * Generate event participation analytics
   * @param {string} eventId - Event ID to analyze
   * @returns {Object} Comprehensive event analytics
   */
  static async getEventParticipationAnalytics(eventId) {
    try {
      const event = await Event.findById(eventId)
        .populate('registeredStudents')
        .populate('subEvents');

      const registrations = await Registration.find({ event: eventId });

      const departmentBreakdown = this.analyzeDepartmentParticipation(
        event.registeredStudents, 
        event.targetedAudience.departments
      );

      const subEventPerformance = await this.analyzeSubEventPerformance(event.subEvents);

      return {
        totalRegistrations: registrations.length,
        departmentBreakdown,
        subEventPerformance,
        registeredStudents: event.registeredStudents.length,
        maximumCapacity: event.maximumStudents
      };
    } catch (error) {
      console.error('Event Analytics Error:', error);
      throw new Error('Failed to generate event analytics');
    }
  }

  /**
   * Analyze department participation
   * @param {Array} registeredStudents - List of registered students
   * @param {Array} targetDepartments - Target departments
   * @returns {Object} Department participation breakdown
   */
  static analyzeDepartmentParticipation(registeredStudents, targetDepartments) {
    const departmentCounts = {};

    targetDepartments.forEach(dept => {
      departmentCounts[dept] = registeredStudents.filter(
        student => student.department === dept
      ).length;
    });

    return departmentCounts;
  }

  /**
   * Analyze sub-event performance
   * @param {Array} subEvents - List of sub-events
   * @returns {Array} Sub-event performance metrics
   */
  static async analyzeSubEventPerformance(subEvents) {
    const performanceMetrics = [];

    for (const subEvent of subEvents) {
      const registrations = await Registration.find({
        'subEvents': subEvent._id
      });

      performanceMetrics.push({
        name: subEvent.name,
        registrations: registrations.length,
        prizePools: subEvent.prizePools
      });
    }

    return performanceMetrics;
  }
}

module.exports = AnalyticsHelper;