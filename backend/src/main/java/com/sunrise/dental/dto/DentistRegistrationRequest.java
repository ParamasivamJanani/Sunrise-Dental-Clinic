package com.sunrise.dental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public class DentistRegistrationRequest {

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @PositiveOrZero(message = "Consultation fee must be positive or zero")
    private double consultationFee;

    public DentistRegistrationRequest() {}

    public DentistRegistrationRequest(String fullName, String specialization, double consultationFee) {
        this.fullName = fullName;
        this.specialization = specialization;
        this.consultationFee = consultationFee;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(double consultationFee) { this.consultationFee = consultationFee; }
}
