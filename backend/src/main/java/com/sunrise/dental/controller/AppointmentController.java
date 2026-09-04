package com.sunrise.dental.controller;

import com.sunrise.dental.dto.AppointmentRequest;
import com.sunrise.dental.dto.AppointmentResponse;
import com.sunrise.dental.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PostMapping
    public ResponseEntity<AppointmentResponse> register(@Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.registerAppointment(request));
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @GetMapping("/{appointmentNumber}")
    public ResponseEntity<AppointmentResponse> getByNumber(@PathVariable String appointmentNumber) {
        return ResponseEntity.ok(appointmentService.findByAppointmentNumber(appointmentNumber));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> listAll() {
        return ResponseEntity.ok(appointmentService.listAll());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @GetMapping("/today")
    public ResponseEntity<List<AppointmentResponse>> listToday() {
        return ResponseEntity.ok(appointmentService.listToday());
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PatchMapping("/{appointmentNumber}/status")
    public ResponseEntity<AppointmentResponse> updateStatus(
            @PathVariable String appointmentNumber,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(appointmentService.updateStatus(appointmentNumber, body.get("status")));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PatchMapping("/{appointmentNumber}/notes")
    public ResponseEntity<AppointmentResponse> updateNotes(
            @PathVariable String appointmentNumber,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(appointmentService.updateNotes(appointmentNumber, body.get("notes")));
    }
}
