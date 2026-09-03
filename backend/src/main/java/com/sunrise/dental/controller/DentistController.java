package com.sunrise.dental.controller;

import com.sunrise.dental.dto.DentistResponse;
import com.sunrise.dental.repository.DentistRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dentists")
public class DentistController {

    private final DentistRepository dentistRepository;

    public DentistController(DentistRepository dentistRepository) {
        this.dentistRepository = dentistRepository;
    }

    @GetMapping
    public ResponseEntity<List<DentistResponse>> listDentists() {
        List<DentistResponse> dentists = dentistRepository.findByIsAvailableTrue().stream()
                .map(d -> DentistResponse.builder()
                        .id(d.getId())
                        .name(d.getName())
                        .specialization(d.getSpecialization())
                        .consultationFee(d.getConsultationFee())
                        .isAvailable(d.isAvailable())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(dentists);
    }
}
