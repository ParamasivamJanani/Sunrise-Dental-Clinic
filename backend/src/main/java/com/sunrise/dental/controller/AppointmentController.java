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
    public ResponseEntity<List<AppointmentResponse>> listMyAppointments(Principal principal) {
        return ResponseEntity.ok(appointmentService.listMyAppointments(principal.getName()));
    }

    @DeleteMapping("/me/{appointmentNumber}")
    public ResponseEntity<?> cancelMyAppointment(@PathVariable String appointmentNumber, Principal principal) {
        try {
            appointmentService.cancelMyAppointment(principal.getName(), appointmentNumber);
            return ResponseEntity.ok(Map.of("message", "Appointment cancelled successfully."));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{appointmentNumber}/status")
    public ResponseEntity<AppointmentResponse> updateStatus(
            @PathVariable String appointmentNumber,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(appointmentService.updateStatus(appointmentNumber, body.get("status")));
    }

    @PatchMapping("/{appointmentNumber}/notes")
    public ResponseEntity<AppointmentResponse> updateNotes(
            @PathVariable String appointmentNumber,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(appointmentService.updateNotes(appointmentNumber, body.get("notes")));
    }
}
