package com.sunrise.dental.controller;

import com.sunrise.dental.dto.AppointmentResponse;
import com.sunrise.dental.dto.PatientResponse;
import com.sunrise.dental.dto.PatientUpdateRequest;
import com.sunrise.dental.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public ResponseEntity<List<PatientResponse>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/{patientId}/appointments")
    public ResponseEntity<List<AppointmentResponse>> getPatientHistory(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getPatientHistory(patientId));
    }

    @PutMapping("/{patientId}")
    public ResponseEntity<PatientResponse> updatePatient(
            @PathVariable Long patientId,
            @RequestBody PatientUpdateRequest request) {
        return ResponseEntity.ok(patientService.updatePatient(patientId, request));
    }
}
