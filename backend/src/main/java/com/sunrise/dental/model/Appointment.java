package com.sunrise.dental.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 30)
    private String appointmentNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dentist_id", nullable = false)
    private Dentist dentist;

    @Column(nullable = false, length = 50)
    private String treatmentType;

    @Column(nullable = false)
    private LocalDate appointmentDate;

    @Column(nullable = false)
    private LocalTime appointmentTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.SCHEDULED;

    @Column(nullable = true, length = 1000)
    private String notes;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status { SCHEDULED, COMPLETED, CANCELLED }

    public Appointment() {}

    // Getters
    public Long getId() { return id; }
    public String getAppointmentNumber() { return appointmentNumber; }
    public Patient getPatient() { return patient; }
    public Dentist getDentist() { return dentist; }
    public String getTreatmentType() { return treatmentType; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public LocalTime getAppointmentTime() { return appointmentTime; }
    public Status getStatus() { return status; }
    public String getNotes() { return notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setAppointmentNumber(String appointmentNumber) { this.appointmentNumber = appointmentNumber; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public void setDentist(Dentist dentist) { this.dentist = dentist; }
    public void setTreatmentType(String treatmentType) { this.treatmentType = treatmentType; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
    public void setAppointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }
    public void setStatus(Status status) { this.status = status; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private String appointmentNumber; private Patient patient;
        private Dentist dentist; private String treatmentType; private LocalDate appointmentDate;
        private LocalTime appointmentTime; private Status status = Status.SCHEDULED;
        private String notes;
        private LocalDateTime createdAt = LocalDateTime.now();

        public Builder id(Long id) { this.id = id; return this; }
        public Builder appointmentNumber(String n) { this.appointmentNumber = n; return this; }
        public Builder patient(Patient p) { this.patient = p; return this; }
        public Builder dentist(Dentist d) { this.dentist = d; return this; }
        public Builder treatmentType(String t) { this.treatmentType = t; return this; }
        public Builder appointmentDate(LocalDate d) { this.appointmentDate = d; return this; }
        public Builder appointmentTime(LocalTime t) { this.appointmentTime = t; return this; }
        public Builder status(Status s) { this.status = s; return this; }
        public Builder notes(String n) { this.notes = n; return this; }
        public Builder createdAt(LocalDateTime c) { this.createdAt = c; return this; }

        public Appointment build() {
            Appointment a = new Appointment();
            a.id = id; a.appointmentNumber = appointmentNumber; a.patient = patient;
            a.dentist = dentist; a.treatmentType = treatmentType; a.appointmentDate = appointmentDate;
            a.appointmentTime = appointmentTime; a.status = status; a.notes = notes; a.createdAt = createdAt;
            return a;
        }
    }
}
