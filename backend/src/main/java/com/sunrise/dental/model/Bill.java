package com.sunrise.dental.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    @Column(nullable = false)
    private double treatmentCost;

    @Column(nullable = false)
    private double consultationFee;

    @Column(nullable = false)
    private double discount = 0.0;

    @Column(nullable = false)
    private double totalAmount;

    @Column(updatable = false)
    private LocalDateTime generatedAt = LocalDateTime.now();

    @Column(nullable = false)
    private boolean isPaid = false;

    public Bill() {}

    public double calculateTotal() {
        return (treatmentCost + consultationFee) - discount;
    }

    // Getters
    public Long getId() { return id; }
    public Appointment getAppointment() { return appointment; }
    public double getTreatmentCost() { return treatmentCost; }
    public double getConsultationFee() { return consultationFee; }
    public double getDiscount() { return discount; }
    public double getTotalAmount() { return totalAmount; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public boolean isPaid() { return isPaid; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }
    public void setTreatmentCost(double treatmentCost) { this.treatmentCost = treatmentCost; }
    public void setConsultationFee(double consultationFee) { this.consultationFee = consultationFee; }
    public void setDiscount(double discount) { this.discount = discount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
    public void setPaid(boolean paid) { isPaid = paid; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private Appointment appointment; private double treatmentCost;
        private double consultationFee; private double discount = 0.0; private double totalAmount;
        private LocalDateTime generatedAt = LocalDateTime.now(); private boolean isPaid = false;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder appointment(Appointment a) { this.appointment = a; return this; }
        public Builder treatmentCost(double t) { this.treatmentCost = t; return this; }
        public Builder consultationFee(double c) { this.consultationFee = c; return this; }
        public Builder discount(double d) { this.discount = d; return this; }
        public Builder totalAmount(double t) { this.totalAmount = t; return this; }
        public Builder generatedAt(LocalDateTime g) { this.generatedAt = g; return this; }
        public Builder isPaid(boolean p) { this.isPaid = p; return this; }

        public Bill build() {
            Bill b = new Bill();
            b.id = id; b.appointment = appointment; b.treatmentCost = treatmentCost;
            b.consultationFee = consultationFee; b.discount = discount; b.totalAmount = totalAmount;
            b.generatedAt = generatedAt; b.isPaid = isPaid;
            return b;
        }
    }
}
