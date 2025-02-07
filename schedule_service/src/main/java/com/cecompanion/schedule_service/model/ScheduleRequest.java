package com.cecompanion.schedule_service.model;

import java.util.List;

import lombok.Data;

@Data
public class ScheduleRequest {
    private List<Room> rooms;
    private List<Event> events;
}