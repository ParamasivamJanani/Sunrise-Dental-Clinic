package com.sunrise.dental.service.strategy;
import org.springframework.stereotype.Component;
@Component("CONSULTATION")
public class ConsultationPricing implements TreatmentPricingStrategy {
    @Override public double getPrice() { return 1500.0; }
    @Override public String getTreatmentName() { return "Consultation"; }
    @Override public String getDescription() { return "General dental consultation and examination"; }
}
