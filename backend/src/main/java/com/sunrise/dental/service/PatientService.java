package com.sunrise.dental.service;

import com.sunrise.dental.dto.AppointmentResponse;
import com.sunrise.dental.dto.PatientResponse;
import com.sunrise.dental.dto.PatientUpdateRequest;
import com.sunrise.dental.model.Patient;
import com.sunrise.dental.repository.AppointmentRepository;
import com.sunrise.dental.repository.PatientRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final AppointmentService appointmentService;

    public PatientService(PatientRepository patientRepository,
                          AppointmentRepository appointmentRepository,
                          AppointmentService appointmentService) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.appointmentService = appointmentService;
    }

    public List<PatientResponse> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(p -> {
                    int count = appointmentRepository.findByPatient_IdOrderByAppointmentDateDesc(p.getId()).size();
                    return mapToResponse(p, count);
                })
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getPatientHistory(Long patientId) {
        return appointmentRepository.findByPatient_IdOrderByAppointmentDateDesc(patientId)
                .stream()
                .map(appointmentService::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PatientResponse updatePatient(Long patientId, PatientUpdateRequest request) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + patientId));
        if (request.getName() != null && !request.getName().isBlank()) patient.setName(request.getName());
        if (request.getAddress() != null && !request.getAddress().isBlank()) patient.setAddress(request.getAddress());
        if (request.getContactNumber() != null && !request.getContactNumber().isBlank()) patient.setContactNumber(request.getContactNumber());
        patientRepository.save(patient);
        int count = appointmentRepository.findByPatient_IdOrderByAppointmentDateDesc(patientId).size();
        return mapToResponse(patient, count);
    }

    private PatientResponse mapToResponse(Patient p, int count) {
        PatientResponse r = new PatientResponse();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setAddress(p.getAddress());
        r.setContactNumber(p.getContactNumber());
        r.setTotalAppointments(count);
        r.setRegisteredAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : "");
        return r;
    }
}
