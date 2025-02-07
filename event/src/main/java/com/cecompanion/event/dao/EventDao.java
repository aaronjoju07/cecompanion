package com.cecompanion.event.dao;

import org.springframework.stereotype.Repository;
import com.cecompanion.event.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface EventDao extends JpaRepository<Event, Integer> {
    
    

}
