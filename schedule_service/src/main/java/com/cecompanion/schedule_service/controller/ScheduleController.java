package com.cecompanion.schedule_service.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cecompanion.schedule_service.model.Event;
import com.cecompanion.schedule_service.model.Room;
import com.cecompanion.schedule_service.model.ScheduleRequest;
import com.cecompanion.schedule_service.model.SuggestionRequest;
import com.cecompanion.schedule_service.service.EventSuggestionService;
import com.cecompanion.schedule_service.service.SchedulingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class ScheduleController {
    private final SchedulingService schedulingService;
    private final EventSuggestionService eventSuggestionService;

    @PostMapping("/events") 
    public ResponseEntity<?> generateSchedule(@RequestBody ScheduleRequest request) {
        if (request.getRooms() == null || request.getEvents() == null) {
            return ResponseEntity.badRequest().body("Rooms and events must be provided");
        }
        return ResponseEntity.ok(schedulingService.scheduleEvents(request.getRooms(), request.getEvents()));
    }

    @PostMapping("/suggest") 
    public ResponseEntity<?> suggestEvents(@RequestBody SuggestionRequest request) {
        if (request.getEvents() == null || request.getUsers() == null) {
            return ResponseEntity.badRequest().body("Events and users must be provided");
        }
        return ResponseEntity.ok(eventSuggestionService.suggestOptimalPaths(request.getEvents(), request.getUsers()));
    }
}
