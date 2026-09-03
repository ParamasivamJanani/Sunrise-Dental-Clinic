package com.sunrise.dental.service.strategy;
import org.springframework.stereotype.Component;
@Component("TEETH_WHITENING")
public class TeethWhiteningPricing implements TreatmentPricingStrategy {
    @Override public double getPrice() { return 15000.0; }
    @Override public String getTreatmentName() { return "Teeth Whitening"; }
    @Override public String getDescription() { return "Professional in-office teeth whitening treatment"; }
}
