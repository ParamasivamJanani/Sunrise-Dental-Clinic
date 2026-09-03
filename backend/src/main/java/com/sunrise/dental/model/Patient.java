package com.sunrise.dental.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, length = 20)
    private String contactNumber;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Patient() {}

    public Patient(Long id, String name, String address, String contactNumber) {
        this.id = id; this.name = name; this.address = address; this.contactNumber = contactNumber;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getContactNumber() { return contactNumber; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setAddress(String address) { this.address = address; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private String name; private String address; private String contactNumber;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder contactNumber(String c) { this.contactNumber = c; return this; }
        public Patient build() { return new Patient(id, name, address, contactNumber); }
    }
}
