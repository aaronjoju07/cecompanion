const { Event } = require('../models/Event');

class EventSchedulingAlgorithm {
  /**
   * Optimize event scheduling based on multiple criteria
   * @param {Array} events - List of events to schedule
   * @returns {Array} Optimized event schedule
   */
  static optimizeEventScheduling(events) {
    // Sort events by priority
    const sortedEvents = this.prioritizeEvents(events);

    // Detect and resolve scheduling conflicts
    const scheduledEvents = this.resolveSchedulingConflicts(sortedEvents);

    return scheduledEvents;
  }

  /**
   * Prioritize events based on multiple factors
   * @param {Array} events - List of events to prioritize
   * @returns {Array} Prioritized events
   */
  static prioritizeEvents(events) {
    return events.sort((a, b) => {
      // Priority factors:
      // 1. Number of interested departments
      // 2. Maximum student participation
      // 3. Event complexity (number of sub-events)
      const aDepartmentPriority = a.targetedAudience.departments.length;
      const bDepartmentPriority = b.targetedAudience.departments.length;

      const aStudentPriority = a.maximumStudents;
      const bStudentPriority = b.maximumStudents;

      const aSubEventPriority = a.subEvents.length;
      const bSubEventPriority = b.subEvents.length;

      // Complex scoring mechanism
      const aScore = 
        aDepartmentPriority * 0.4 + 
        aStudentPriority * 0.3 + 
        aSubEventPriority * 0.3;
      
      const bScore = 
        bDepartmentPriority * 0.4 + 
        bStudentPriority * 0.3 + 
        bSubEventPriority * 0.3;

      return bScore - aScore;
    });
  }

  /**
   * Resolve scheduling conflicts between events
   * @param {Array} events - Prioritized events
   * @returns {Array} Events with resolved scheduling conflicts
   */
  static resolveSchedulingConflicts(events) {
    const scheduledEvents = [];
    const usedTimeSlots = new Set();

    for (const event of events) {
      const potentialTimeSlots = this.generatePotentialTimeSlots(event);
      
      const availableSlot = potentialTimeSlots.find(slot => 
        !this.isTimeSlotOverlapping(slot, usedTimeSlots)
      );

      if (availableSlot) {
        event.scheduledTimeSlot = availableSlot;
        scheduledEvents.push(event);
        usedTimeSlots.add(availableSlot);
      }
    }

    return scheduledEvents;
  }

  /**
   * Generate potential time slots for an event
   * @param {Object} event - Event to generate time slots for
   * @returns {Array} Potential time slots
   **/
  static generatePotentialTimeSlots(event) {
    const startDate = new Date(event.conductedDates.start);
    const endDate = new Date(event.conductedDates.end);
    const duration = endDate.getTime() - startDate.getTime();

    // Generate multiple potential time slots
    return [
      { start: startDate, end: new Date(startDate.getTime() + duration) },
      // Additional slot generation logic can be added here
    ];
  }

  /**
   * Check if a time slot overlaps with existing slots
   * @param {Object} newSlot - New time slot to check
   * @param {Set} existingSlots - Set of existing time slots
   * @returns {boolean} Whether the slot overlaps
   */
  static isTimeSlotOverlapping(newSlot, existingSlots) {
    for (const slot of existingSlots) {
      if (
        (newSlot.start >= slot.start && newSlot.start < slot.end) ||
        (newSlot.end > slot.start && newSlot.end <= slot.end)
      ) {
        return true;
      }
    }
    return false;
  }
}

module.exports = EventSchedulingAlgorithm;