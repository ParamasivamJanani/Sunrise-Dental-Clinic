package com.sunrise.dental.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class AppointmentNotFoundException extends RuntimeException {
    public AppointmentNotFoundException(String appointmentNumber) {
        super("Appointment not found with number: " + appointmentNumber);
    }
}
