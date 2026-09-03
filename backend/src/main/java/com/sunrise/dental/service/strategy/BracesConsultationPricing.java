package com.sunrise.dental.service.strategy;
import org.springframework.stereotype.Component;
@Component("BRACES_CONSULTATION")
public class BracesConsultationPricing implements TreatmentPricingStrategy {
    @Override public double getPrice() { return 2000.0; }
    @Override public String getTreatmentName() { return "Braces Consultation"; }
    @Override public String getDescription() { return "Orthodontic assessment and treatment planning for braces"; }
}
