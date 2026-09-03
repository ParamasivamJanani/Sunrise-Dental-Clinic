package com.sunrise.dental.service.strategy;
import org.springframework.stereotype.Component;
@Component("TOOTH_FILLING")
public class ToothFillingPricing implements TreatmentPricingStrategy {
    @Override public double getPrice() { return 5000.0; }
    @Override public String getTreatmentName() { return "Tooth Filling"; }
    @Override public String getDescription() { return "Composite or amalgam tooth filling procedure"; }
}
