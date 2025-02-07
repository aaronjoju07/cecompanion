package com.cecompanion.schedule_service.model;

import java.util.List;

import lombok.Data;

@Data
public class SuggestionRequest {
    private List<Event> events;
    private List<User> users;
}