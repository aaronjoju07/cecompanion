package com.cecompanion.schedule_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cecompanion.schedule_service.model.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
}
