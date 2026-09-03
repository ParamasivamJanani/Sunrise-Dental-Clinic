package com.sunrise.dental.controller;

import com.sunrise.dental.dto.DentistRegistrationRequest;
import com.sunrise.dental.dto.DentistResponse;
import com.sunrise.dental.repository.DentistRepository;
import com.sunrise.dental.service.DentistService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dentists")
public class DentistController {

    private final DentistRepository dentistRepository;
    private final DentistService dentistService;

    public DentistController(DentistRepository dentistRepository, DentistService dentistService) {
        this.dentistRepository = dentistRepository;
        this.dentistService = dentistService;
    }

    @GetMapping
    public ResponseEntity<List<DentistResponse>> listDentists() {
        return ResponseEntity.ok(getAvailableDentists());
    }

    @GetMapping("/public")
    public ResponseEntity<List<DentistResponse>> listPublicDentists() {
        return ResponseEntity.ok(getAvailableDentists());
    }

    private List<DentistResponse> getAvailableDentists() {
        return dentistRepository.findByIsAvailableTrue().stream()
                .map(d -> DentistResponse.builder()
                        .id(d.getId())
                        .name(d.getName())
                        .specialization(d.getSpecialization())
                        .consultationFee(d.getConsultationFee())
                        .isAvailable(d.isAvailable())
                        .build())
                .collect(Collectors.toList());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerDentist(@Valid @RequestBody DentistRegistrationRequest request) {
        try {
            DentistResponse response = dentistService.registerDentist(request);
            return ResponseEntity.status(201).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
