package com.sunrise.dental.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateAppointmentException extends RuntimeException {
    public DuplicateAppointmentException(String appointmentNumber) {
        super("Appointment already exists with number: " + appointmentNumber);
    }
}
