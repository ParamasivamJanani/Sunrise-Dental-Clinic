package com.sunrise.dental.service.strategy;
import org.springframework.stereotype.Component;
@Component("TOOTH_EXTRACTION")
public class ToothExtractionPricing implements TreatmentPricingStrategy {
    @Override public double getPrice() { return 7000.0; }
    @Override public String getTreatmentName() { return "Tooth Extraction"; }
    @Override public String getDescription() { return "Simple or surgical tooth extraction procedure"; }
}
