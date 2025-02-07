package com.cecompanion.schedule_service.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import com.cecompanion.schedule_service.model.User;


public interface UserRepository extends JpaRepository<User, Long> {
}

