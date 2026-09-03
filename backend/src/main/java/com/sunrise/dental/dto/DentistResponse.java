package com.sunrise.dental.dto;

public class DentistResponse {
    private Long id;
    private String name;
    private String specialization;
    private double consultationFee;
    private boolean isAvailable;

    public DentistResponse() {}

    public DentistResponse(Long id, String name, String specialization, double consultationFee, boolean isAvailable) {
        this.id = id; this.name = name; this.specialization = specialization;
        this.consultationFee = consultationFee; this.isAvailable = isAvailable;
    }

    public static Builder builder() { return new Builder(); }
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSpecialization() { return specialization; }
    public double getConsultationFee() { return consultationFee; }
    public boolean isAvailable() { return isAvailable; }

    public static class Builder {
        private Long id; private String name; private String specialization;
        private double consultationFee; private boolean isAvailable;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder specialization(String s) { this.specialization = s; return this; }
        public Builder consultationFee(double f) { this.consultationFee = f; return this; }
        public Builder isAvailable(boolean a) { this.isAvailable = a; return this; }
        public DentistResponse build() { return new DentistResponse(id, name, specialization, consultationFee, isAvailable); }
    }
}
