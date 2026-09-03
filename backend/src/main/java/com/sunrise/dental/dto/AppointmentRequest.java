package com.sunrise.dental.dto;

import jakarta.validation.constraints.*;

public class AppointmentRequest {
    @NotBlank(message = "Patient name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String patientName;

    @NotBlank(message = "Address is required")
    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^(\\+94|0)[0-9]{9}$", message = "Enter a valid Sri Lankan phone number")
    private String contactNumber;

    @NotNull(message = "Dentist ID is required")
    @Positive(message = "Dentist ID must be a positive number")
    private Long dentistId;

    @NotBlank(message = "Treatment type is required")
    private String treatmentType;

    @NotBlank(message = "Appointment date is required")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Date must be in YYYY-MM-DD format")
    private String appointmentDate;

    @NotBlank(message = "Appointment time is required")
    @Pattern(regexp = "^([0-1]\\d|2[0-3]):[0-5]\\d$", message = "Time must be in HH:MM format")
    private String appointmentTime;

    public AppointmentRequest() {}

    public String getPatientName() { return patientName; }
    public String getAddress() { return address; }
    public String getContactNumber() { return contactNumber; }
    public Long getDentistId() { return dentistId; }
    public String getTreatmentType() { return treatmentType; }
    public String getAppointmentDate() { return appointmentDate; }
    public String getAppointmentTime() { return appointmentTime; }

    public void setPatientName(String patientName) { this.patientName = patientName; }
    public void setAddress(String address) { this.address = address; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public void setDentistId(Long dentistId) { this.dentistId = dentistId; }
    public void setTreatmentType(String treatmentType) { this.treatmentType = treatmentType; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }
    public void setAppointmentTime(String appointmentTime) { this.appointmentTime = appointmentTime; }
}
