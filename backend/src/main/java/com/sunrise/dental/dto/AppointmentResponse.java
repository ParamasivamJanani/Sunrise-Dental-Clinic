package com.sunrise.dental.dto;

public class AppointmentResponse {
    private Long id; private String appointmentNumber; private String patientName;
    private String address; private String contactNumber; private String dentistName;
    private String dentistSpecialization; private String treatmentType;
    private String appointmentDate; private String appointmentTime;
    private String status; private String createdAt;

    public AppointmentResponse() {}

    public Long getId() { return id; }
    public String getAppointmentNumber() { return appointmentNumber; }
    public String getPatientName() { return patientName; }
    public String getAddress() { return address; }
    public String getContactNumber() { return contactNumber; }
    public String getDentistName() { return dentistName; }
    public String getDentistSpecialization() { return dentistSpecialization; }
    public String getTreatmentType() { return treatmentType; }
    public String getAppointmentDate() { return appointmentDate; }
    public String getAppointmentTime() { return appointmentTime; }
    public String getStatus() { return status; }
    public String getCreatedAt() { return createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private String appointmentNumber; private String patientName;
        private String address; private String contactNumber; private String dentistName;
        private String dentistSpecialization; private String treatmentType;
        private String appointmentDate; private String appointmentTime;
        private String status; private String createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder appointmentNumber(String s) { this.appointmentNumber = s; return this; }
        public Builder patientName(String s) { this.patientName = s; return this; }
        public Builder address(String s) { this.address = s; return this; }
        public Builder contactNumber(String s) { this.contactNumber = s; return this; }
        public Builder dentistName(String s) { this.dentistName = s; return this; }
        public Builder dentistSpecialization(String s) { this.dentistSpecialization = s; return this; }
        public Builder treatmentType(String s) { this.treatmentType = s; return this; }
        public Builder appointmentDate(String s) { this.appointmentDate = s; return this; }
        public Builder appointmentTime(String s) { this.appointmentTime = s; return this; }
        public Builder status(String s) { this.status = s; return this; }
        public Builder createdAt(String s) { this.createdAt = s; return this; }

        public AppointmentResponse build() {
            AppointmentResponse r = new AppointmentResponse();
            r.id = id; r.appointmentNumber = appointmentNumber; r.patientName = patientName;
            r.address = address; r.contactNumber = contactNumber; r.dentistName = dentistName;
            r.dentistSpecialization = dentistSpecialization; r.treatmentType = treatmentType;
            r.appointmentDate = appointmentDate; r.appointmentTime = appointmentTime;
            r.status = status; r.createdAt = createdAt;
            return r;
        }
    }
}
