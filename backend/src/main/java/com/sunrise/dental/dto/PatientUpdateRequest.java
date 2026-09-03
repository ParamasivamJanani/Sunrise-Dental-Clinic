package com.sunrise.dental.dto;

public class PatientUpdateRequest {
    private String name;
    private String address;
    private String contactNumber;

    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getContactNumber() { return contactNumber; }
    public void setName(String name) { this.name = name; }
    public void setAddress(String address) { this.address = address; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
}
