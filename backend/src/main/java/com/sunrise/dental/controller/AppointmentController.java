package com.sunrise.dental.controller;

import com.sunrise.dental.dto.AppointmentRequest;
import com.sunrise.dental.dto.AppointmentResponse;
import com.sunrise.dental.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> register(@Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.registerAppointment(request));
    }

    @PostMapping("/public")
    public ResponseEntity<AppointmentResponse> registerPublic(@Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.registerAppointment(request));
    }

    @GetMapping("/{appointmentNumber}")
    public ResponseEntity<AppointmentResponse> getByNumber(@PathVariable String appointmentNumber) {
        return ResponseEntity.ok(appointmentService.findByAppointmentNumber(appointmentNumber));
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> listAll() {
        return ResponseEntity.ok(appointmentService.listAll());
    }

    @GetMapping("/today")
    public ResponseEntity<List<AppointmentResponse>> listToday() {
        return ResponseEntity.ok(appointmentService.listToday());
    }

    @GetMapping("/me")
    public ResponseEntity<List<AppointmentResponse>> listMyAppointments(java.security.Principal principal) {
        return ResponseEntity.ok(appointmentService.listMyAppointments(principal.getName()));
    }

    @PatchMapping("/{appointmentNumber}/status")
    public ResponseEntity<AppointmentResponse> updateStatus(
            @PathVariable String appointmentNumber,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(appointmentService.updateStatus(appointmentNumber, body.get("status")));
    }
}
