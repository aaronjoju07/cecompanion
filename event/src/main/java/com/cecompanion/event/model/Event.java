package com.cecompanion.event.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String name;
    private String email;
    private byte[] file;
    private Integer maxStudents;
    private String department;
    private String collegeName;
    private Integer maxEvents;
    private String rules;
    private String overview;
    private String agenda;
    private String venue;
    private String targetAudience;
    private String courses;
    private String contact1;
    private String contact2;
    private String website;
    private String startDate;
    private String endDate;
}
