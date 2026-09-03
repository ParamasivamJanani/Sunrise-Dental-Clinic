package com.sunrise.dental.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidTreatmentTypeException extends RuntimeException {
    public InvalidTreatmentTypeException(String treatmentType) {
        super("Unknown treatment type: " + treatmentType + ". Valid types: CONSULTATION, TEETH_CLEANING, TOOTH_FILLING, TOOTH_EXTRACTION, ROOT_CANAL, TEETH_WHITENING, BRACES_CONSULTATION");
    }
}
