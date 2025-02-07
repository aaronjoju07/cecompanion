package com.cecompanion.schedule_service.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.cecompanion.schedule_service.model.Event;
import com.cecompanion.schedule_service.model.Room;

@Service
public class SchedulingService {
    public Map<Room, List<Event>> scheduleEvents(List<Room> rooms, List<Event> events) {
        Map<Room, List<Event>> schedule = new HashMap<>();
        backtrackSchedule(schedule, rooms, events, 0);
        return schedule;
    }

    private boolean backtrackSchedule(Map<Room, List<Event>> schedule, List<Room> rooms, List<Event> events, int index) {
        if (index == events.size()) return true;

        Event event = events.get(index);
        for (Room room : rooms) {
            schedule.putIfAbsent(room, new ArrayList<>());
            schedule.get(room).add(event);

            if (backtrackSchedule(schedule, rooms, events, index + 1)) return true;

            schedule.get(room).remove(event);
        }
        return false;
    }
}