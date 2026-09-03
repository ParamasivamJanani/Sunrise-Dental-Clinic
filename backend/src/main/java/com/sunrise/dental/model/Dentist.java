package com.sunrise.dental.model;

import jakarta.persistence.*;

@Entity
@Table(name = "dentists")
public class Dentist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String specialization;

    @Column(nullable = false)
    private double consultationFee;

    @Column(nullable = false)
    private boolean isAvailable = true;

    public Dentist() {}

    public Dentist(Long id, String name, String specialization, double consultationFee, boolean isAvailable) {
        this.id = id; this.name = name; this.specialization = specialization;
        this.consultationFee = consultationFee; this.isAvailable = isAvailable;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSpecialization() { return specialization; }
    public double getConsultationFee() { return consultationFee; }
    public boolean isAvailable() { return isAvailable; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public void setConsultationFee(double consultationFee) { this.consultationFee = consultationFee; }
    public void setAvailable(boolean available) { isAvailable = available; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private String name; private String specialization;
        private double consultationFee; private boolean isAvailable = true;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder specialization(String s) { this.specialization = s; return this; }
        public Builder consultationFee(double f) { this.consultationFee = f; return this; }
        public Builder isAvailable(boolean a) { this.isAvailable = a; return this; }
        public Dentist build() { return new Dentist(id, name, specialization, consultationFee, isAvailable); }
    }
}
