package com.sunrise.dental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class DentistRegistrationRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 4, message = "Username must be at least 4 characters")
    private String username;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @PositiveOrZero(message = "Consultation fee must be positive or zero")
    private double consultationFee;

    public DentistRegistrationRequest() {}

    public DentistRegistrationRequest(String username, String email, String fullName, double consultationFee) {
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.consultationFee = consultationFee;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(double consultationFee) { this.consultationFee = consultationFee; }
}
