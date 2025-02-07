package com.cecompanion.event.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cecompanion.event.model.Event;
import com.cecompanion.event.service.EventService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/event")
public class EventColtroller {

    @Autowired
    EventService eventService;
    @Autowired
    Event event;

    @PostMapping("/register")
    public ResponseEntity<Event> Register(@RequestBody Event event) {
        ResponseEntity<Event> responseEntity = eventService.registerEvent(event);
        Event registeredEvent = responseEntity.getBody();
        return ResponseEntity.ok(registeredEvent);
    }

    @PostMapping("/update")
    public ResponseEntity<Event> updateEvent(@RequestBody Event event) {
        ResponseEntity<Event> responseEntity = eventService.updateEvent(event);
        Event updatedEvent = responseEntity.getBody();
        return ResponseEntity.ok(updatedEvent);
    }

    // get event by id
    @GetMapping("/get-all")
    public ResponseEntity<List<Event>> getAllEvents() {
        ResponseEntity<List<Event>> responseEntity = eventService.getAllEvents();
        List<Event> events = responseEntity.getBody();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Integer id) {
        ResponseEntity<Event> responseEntity = eventService.getEventById(id);
        Event event = responseEntity.getBody();
        if (event != null) {
            return ResponseEntity.ok(event);
        }
        return ResponseEntity.notFound().build();
    }

}