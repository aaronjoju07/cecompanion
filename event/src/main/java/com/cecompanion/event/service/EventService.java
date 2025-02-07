package com.cecompanion.event.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cecompanion.event.dao.EventDao;
import org.springframework.http.ResponseEntity;
import com.cecompanion.event.model.Event;

@Service
public class EventService {
    @Autowired
    EventDao eventDao;

    public ResponseEntity<Event> registerEvent(Event event) {
        try {
            Event savedEvent = eventDao.save(event);
            return ResponseEntity.ok(savedEvent);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    public ResponseEntity<Event> updateEvent(Event event) {
        try {
            Event updatedEvent = eventDao.save(event);
            return ResponseEntity.ok(updatedEvent);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    public ResponseEntity<Event> getEventById(Integer id) {
        try {
            Event event = eventDao.findById(id).orElse(null);
            if (event == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    public ResponseEntity<List<Event>> getAllEvents() {
        try {
            List<Event> events = eventDao.findAll();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
