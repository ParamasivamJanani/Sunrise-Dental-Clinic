package com.sunrise.dental.service.strategy;
import org.springframework.stereotype.Component;
@Component("ROOT_CANAL")
public class RootCanalPricing implements TreatmentPricingStrategy {
    @Override public double getPrice() { return 25000.0; }
    @Override public String getTreatmentName() { return "Root Canal"; }
    @Override public String getDescription() { return "Endodontic root canal treatment"; }
}
