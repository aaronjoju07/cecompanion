package com.cecompanion.schedule_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cecompanion.schedule_service.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}
