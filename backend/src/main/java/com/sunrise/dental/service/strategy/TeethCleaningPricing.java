package com.sunrise.dental.service.strategy;
import org.springframework.stereotype.Component;
@Component("TEETH_CLEANING")
public class TeethCleaningPricing implements TreatmentPricingStrategy {
    @Override public double getPrice() { return 3500.0; }
    @Override public String getTreatmentName() { return "Teeth Cleaning"; }
    @Override public String getDescription() { return "Professional dental scaling and polishing"; }
}
