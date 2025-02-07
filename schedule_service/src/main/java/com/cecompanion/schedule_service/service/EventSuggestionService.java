package com.cecompanion.schedule_service.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.cecompanion.schedule_service.model.Event;
import com.cecompanion.schedule_service.model.User;


@Service
public class EventSuggestionService {
    public List<List<Event>> suggestOptimalPaths(List<Event> events, List<User> users) {
        if (events == null || users == null) {
            throw new IllegalArgumentException("Events and users must not be null");
        }

        List<List<Event>> paths = new ArrayList<>();
        for (User user : users) {
            List<Event> path = new ArrayList<>();
            if (user.getRegisteredEvents() != null) {
                List<Long> registeredEventIds = new ArrayList<>();
                for (Event event : user.getRegisteredEvents()) {
                    registeredEventIds.add(event.getId());
                }
                dfs(events, registeredEventIds, path, paths);
            }
        }
        return paths;
    }

    private void dfs(List<Event> events, List<Long> registeredEventIds, List<Event> path, List<List<Event>> paths) {
        if (path.size() > 0) paths.add(new ArrayList<>(path));

        for (Event event : events) {
            if (registeredEventIds != null && !registeredEventIds.contains(event.getId())) {
                path.add(event);
                dfs(events, registeredEventIds, path, paths);
                path.remove(path.size() - 1);
            }
        }
    }
}
