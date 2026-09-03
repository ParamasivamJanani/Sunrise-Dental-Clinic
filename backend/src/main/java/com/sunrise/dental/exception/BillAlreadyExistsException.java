package com.sunrise.dental.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class BillAlreadyExistsException extends RuntimeException {
    public BillAlreadyExistsException(String appointmentNumber) {
        super("Bill already exists for appointment: " + appointmentNumber);
    }
}
