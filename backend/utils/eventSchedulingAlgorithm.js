const { Event } = require('../models/Event');
const SubEventSchedule = require('../models/SubEventSchedule');

class EventSchedulingAlgorithm {
  static async scheduleSubEvents(eventId, dailyHours = 8) {
    const event = await Event.findById(eventId).populate('registeredStudents');
    if (!event) throw new Error('Event not found');

    const { conductedDates, subEvents, registeredStudents } = event;
    const eventStart = new Date(conductedDates.start);
    const eventEnd = new Date(conductedDates.end);
    const totalDays = Math.ceil((eventEnd - eventStart) / (1000 * 60 * 60 * 24)) || 1;
    const totalHours = totalDays * dailyHours;

    // Fetch existing schedules or organizer priorities (if stored)
    const existingSchedules = await SubEventSchedule.find({ eventId });

    // Prioritize sub-events
    const prioritizedSubEvents = this.prioritizeSubEvents(subEvents, existingSchedules);

    // Generate time slots
    const timeSlots = this.generateTimeSlots(eventStart, totalHours, dailyHours);

    // Assign schedules while minimizing clashes
    const scheduledSubEvents = await this.assignSchedules(
      prioritizedSubEvents,
      timeSlots,
      registeredStudents,
      eventId,
      eventStart
    );

    return scheduledSubEvents;
  }

  static prioritizeSubEvents(subEvents, existingSchedules) {
    return subEvents
      .map(subEvent => {
        const schedule = existingSchedules.find(s => s.subEventId.toString() === subEvent._id.toString());
        return {
          ...subEvent.toObject(),
          priority: schedule ? schedule.priority : subEvent.rounds.length // Default priority by round count
        };
      })
      .sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
  }

  static generateTimeSlots(startDate, totalHours, dailyHours) {
    const slots = [];
    let currentTime = new Date(startDate);
    const endTime = new Date(startDate.getTime() + totalHours * 60 * 60 * 1000);

    while (currentTime < endTime) {
      const dayStart = new Date(currentTime.setHours(9, 0, 0, 0)); // Start at 9 AM
      const dayEnd = new Date(dayStart.getTime() + dailyHours * 60 * 60 * 1000);
      let slotStart = new Date(dayStart);

      while (slotStart < dayEnd) {
        const slotEnd = new Date(slotStart.getTime() + 2 * 60 * 60 * 1000); // 2-hour slots
        if (slotEnd <= dayEnd) {
          slots.push({ start: new Date(slotStart), end: new Date(slotEnd) });
        }
        slotStart = slotEnd;
      }
      currentTime.setDate(currentTime.getDate() + 1);
    }
    return slots;
  }

  static async assignSchedules(subEvents, timeSlots, registeredStudents, eventId, eventStart) {
    const scheduled = [];
    const usedSlots = new Set();
    const studentSchedules = new Map(); // Track student schedules to avoid clashes

    for (const subEvent of subEvents) {
      const rounds = subEvent.rounds.length > 0 ? subEvent.rounds : [{ _id: subEvent._id, name: 'Default Round' }];
      const roundSchedules = [];

      // Sort rounds hierarchically (assuming name indicates order, e.g., "Round 1")
      rounds.sort((a, b) => {
        const aNum = parseInt(a.name.match(/\d+/)?.[0] || 0);
        const bNum = parseInt(b.name.match(/\d+/)?.[0] || 0);
        return aNum - bNum;
      });

      for (const round of rounds) {
        let assignedSlot = null;
        for (const slot of timeSlots) {
          if (!this.isSlotUsed(slot, usedSlots) && !this.causesClash(slot, studentSchedules, registeredStudents)) {
            assignedSlot = slot;
            usedSlots.add(JSON.stringify(slot));
            this.updateStudentSchedules(studentSchedules, registeredStudents, slot);
            break;
          }
        }

        if (!assignedSlot) {
          assignedSlot = this.findNextAvailableSlot(timeSlots, usedSlots, eventStart);
          usedSlots.add(JSON.stringify(assignedSlot));
        }

        roundSchedules.push({
          roundId: round._id,
          name: round.name,
          timeSlot: assignedSlot,
          venue: subEvent.venue || 'TBD'
        });
      }

      const schedule = new SubEventSchedule({
        eventId,
        subEventId: subEvent._id,
        priority: subEvent.priority,
        rounds: roundSchedules,
        dailyHours: timeSlots.length / (timeSlots[timeSlots.length - 1].end - eventStart) / (1000 * 60 * 60)
      });
      await schedule.save();
      scheduled.push(schedule);
    }
    return scheduled;
  }

  static isSlotUsed(slot, usedSlots) {
    return usedSlots.has(JSON.stringify(slot));
  }

  static causesClash(slot, studentSchedules, registeredStudents) {
    return registeredStudents.some(student => {
      const schedule = studentSchedules.get(student._id.toString());
      return schedule?.some(s => 
        (slot.start < s.end && slot.end > s.start)
      );
    });
  }

  static updateStudentSchedules(studentSchedules, registeredStudents, slot) {
    registeredStudents.forEach(student => {
      const id = student._id.toString();
      if (!studentSchedules.has(id)) studentSchedules.set(id, []);
      studentSchedules.get(id).push(slot);
    });
  }

  static findNextAvailableSlot(timeSlots, usedSlots, startDate) {
    return timeSlots.find(slot => !usedSlots.has(JSON.stringify(slot))) || {
      start: new Date(startDate.getTime() + usedSlots.size * 2 * 60 * 60 * 1000),
      end: new Date(startDate.getTime() + (usedSlots.size + 1) * 2 * 60 * 60 * 1000)
    };
  }
}

module.exports = EventSchedulingAlgorithm;