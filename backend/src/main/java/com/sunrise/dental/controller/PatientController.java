package com.sunrise.dental.controller;

import com.sunrise.dental.dto.AppointmentResponse;
import com.sunrise.dental.dto.PatientResponse;
import com.sunrise.dental.dto.PatientUpdateRequest;
import com.sunrise.dental.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DENTIST')")
    @GetMapping
    public ResponseEntity<List<PatientResponse>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DENTIST')")
    @GetMapping("/{patientId}/appointments")
    public ResponseEntity<List<AppointmentResponse>> getPatientHistory(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getPatientHistory(patientId));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @PutMapping("/{patientId}")
    public ResponseEntity<PatientResponse> updatePatient(
            @PathVariable Long patientId,
            @RequestBody PatientUpdateRequest request) {
        return ResponseEntity.ok(patientService.updatePatient(patientId, request));
    }
}
