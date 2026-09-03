package com.sunrise.dental.service.strategy;

/**
 * Strategy Pattern — defines the contract for treatment pricing.
 * Each treatment type implements this interface, allowing BillService
 * to look up pricing without any if/else chains (Open/Closed Principle).
 */
public interface TreatmentPricingStrategy {
    double getPrice();
    String getTreatmentName();
    String getDescription();
}
