package com.sunrise.dental.dto;

public class PatientResponse {
    private Long id;
    private String name;
    private String address;
    private String contactNumber;
    private int totalAppointments;
    private String registeredAt;

    public PatientResponse() {}

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getContactNumber() { return contactNumber; }
    public int getTotalAppointments() { return totalAppointments; }
    public String getRegisteredAt() { return registeredAt; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setAddress(String address) { this.address = address; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public void setTotalAppointments(int totalAppointments) { this.totalAppointments = totalAppointments; }
    public void setRegisteredAt(String registeredAt) { this.registeredAt = registeredAt; }
}
