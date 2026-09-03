package com.sunrise.dental.dto;

public class BillResponse {
    private Long billId; private String appointmentNumber; private String patientName;
    private String contactNumber; private String dentistName; private String treatmentType;
    private String appointmentDate; private String appointmentTime;
    private double treatmentCost; private double consultationFee; private double discount;
    private double totalAmount; private String generatedAt; private boolean isPaid;

    public BillResponse() {}

    public Long getBillId() { return billId; }
    public String getAppointmentNumber() { return appointmentNumber; }
    public String getPatientName() { return patientName; }
    public String getContactNumber() { return contactNumber; }
    public String getDentistName() { return dentistName; }
    public String getTreatmentType() { return treatmentType; }
    public String getAppointmentDate() { return appointmentDate; }
    public String getAppointmentTime() { return appointmentTime; }
    public double getTreatmentCost() { return treatmentCost; }
    public double getConsultationFee() { return consultationFee; }
    public double getDiscount() { return discount; }
    public double getTotalAmount() { return totalAmount; }
    public String getGeneratedAt() { return generatedAt; }
    public boolean isPaid() { return isPaid; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long billId; private String appointmentNumber; private String patientName;
        private String contactNumber; private String dentistName; private String treatmentType;
        private String appointmentDate; private String appointmentTime;
        private double treatmentCost; private double consultationFee; private double discount;
        private double totalAmount; private String generatedAt; private boolean isPaid;

        public Builder billId(Long v) { this.billId = v; return this; }
        public Builder appointmentNumber(String v) { this.appointmentNumber = v; return this; }
        public Builder patientName(String v) { this.patientName = v; return this; }
        public Builder contactNumber(String v) { this.contactNumber = v; return this; }
        public Builder dentistName(String v) { this.dentistName = v; return this; }
        public Builder treatmentType(String v) { this.treatmentType = v; return this; }
        public Builder appointmentDate(String v) { this.appointmentDate = v; return this; }
        public Builder appointmentTime(String v) { this.appointmentTime = v; return this; }
        public Builder treatmentCost(double v) { this.treatmentCost = v; return this; }
        public Builder consultationFee(double v) { this.consultationFee = v; return this; }
        public Builder discount(double v) { this.discount = v; return this; }
        public Builder totalAmount(double v) { this.totalAmount = v; return this; }
        public Builder generatedAt(String v) { this.generatedAt = v; return this; }
        public Builder isPaid(boolean v) { this.isPaid = v; return this; }

        public BillResponse build() {
            BillResponse r = new BillResponse();
            r.billId = billId; r.appointmentNumber = appointmentNumber; r.patientName = patientName;
            r.contactNumber = contactNumber; r.dentistName = dentistName; r.treatmentType = treatmentType;
            r.appointmentDate = appointmentDate; r.appointmentTime = appointmentTime;
            r.treatmentCost = treatmentCost; r.consultationFee = consultationFee; r.discount = discount;
            r.totalAmount = totalAmount; r.generatedAt = generatedAt; r.isPaid = isPaid;
            return r;
        }
    }
}
