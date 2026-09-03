package com.sunrise.dental.service;

import com.sunrise.dental.dto.AppointmentRequest;
import com.sunrise.dental.dto.AppointmentResponse;
import com.sunrise.dental.exception.AppointmentNotFoundException;
import com.sunrise.dental.exception.DuplicateAppointmentException;
import com.sunrise.dental.model.Appointment;
import com.sunrise.dental.model.Patient;
import com.sunrise.dental.repository.AppointmentRepository;
import com.sunrise.dental.repository.DentistRepository;
import com.sunrise.dental.repository.PatientRepository;
import com.sunrise.dental.repository.UserRepository;
import com.sunrise.dental.model.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DentistRepository dentistRepository;
    private final UserRepository userRepository;

    private final AtomicInteger dailyCounter = new AtomicInteger(0);
    private volatile LocalDate counterDate = LocalDate.now();

    public AppointmentService(AppointmentRepository appointmentRepository,
                              PatientRepository patientRepository,
                              DentistRepository dentistRepository,
                              UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.dentistRepository = dentistRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public AppointmentResponse registerAppointment(AppointmentRequest request) {
        String appointmentNumber = generateAppointmentNumber();

        if (appointmentRepository.existsByAppointmentNumber(appointmentNumber)) {
            throw new DuplicateAppointmentException(appointmentNumber);
        }

        var dentist = dentistRepository.findById(request.getDentistId())
                .orElseThrow(() -> new EntityNotFoundException("Dentist not found with ID: " + request.getDentistId()));

        Patient patient = patientRepository.findByContactNumber(request.getContactNumber())
                .orElseGet(() -> patientRepository.save(Patient.builder()
                        .name(request.getPatientName())
                        .address(request.getAddress())
                        .contactNumber(request.getContactNumber())
                        .build()));

        Appointment appointment = appointmentRepository.save(Appointment.builder()
                .appointmentNumber(appointmentNumber)
                .patient(patient)
                .dentist(dentist)
                .treatmentType(request.getTreatmentType().toUpperCase().replace(" ", "_"))
                .appointmentDate(LocalDate.parse(request.getAppointmentDate()))
                .appointmentTime(LocalTime.parse(request.getAppointmentTime()))
                .status(Appointment.Status.SCHEDULED)
                .build());

        return mapToResponse(appointment);
    }

    public AppointmentResponse findByAppointmentNumber(String appointmentNumber) {
        return appointmentRepository.findByAppointmentNumber(appointmentNumber)
                .map(this::mapToResponse)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentNumber));
    }

    public List<AppointmentResponse> listAll() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> listToday() {
        return appointmentRepository.findByAppointmentDate(LocalDate.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> listMyAppointments(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return appointmentRepository.findByPatient_ContactNumber(user.getContactNumber()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelMyAppointment(String username, String appointmentNumber) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Appointment appointment = appointmentRepository.findByAppointmentNumber(appointmentNumber)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentNumber));

        // Ownership check
        if (!appointment.getPatient().getContactNumber().equals(user.getContactNumber())) {
            throw new SecurityException("You are not authorized to cancel this appointment.");
        }

        if (appointment.getStatus() != Appointment.Status.SCHEDULED) {
            throw new IllegalStateException("Only SCHEDULED appointments can be cancelled.");
        }

        appointment.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(appointment);
    }

    @Transactional
    public AppointmentResponse updateStatus(String appointmentNumber, String status) {
        Appointment appointment = appointmentRepository.findByAppointmentNumber(appointmentNumber)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentNumber));
        appointment.setStatus(Appointment.Status.valueOf(status.toUpperCase()));
        return mapToResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentResponse updateNotes(String appointmentNumber, String notes) {
        Appointment appointment = appointmentRepository.findByAppointmentNumber(appointmentNumber)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentNumber));
        appointment.setNotes(notes);
        return mapToResponse(appointmentRepository.save(appointment));
    }

    private synchronized String generateAppointmentNumber() {
        LocalDate today = LocalDate.now();
        if (!today.equals(counterDate)) {
            counterDate = today;
            dailyCounter.set(0);
        }
        int count = dailyCounter.incrementAndGet();
        String dateStr = today.format(DateTimeFormatter.BASIC_ISO_DATE);
        return String.format("SDC-%s-%04d", dateStr, count);
    }

    public AppointmentResponse mapToResponse(Appointment a) {
        return AppointmentResponse.builder()
                .id(a.getId())
                .appointmentNumber(a.getAppointmentNumber())
                .patientName(a.getPatient().getName())
                .address(a.getPatient().getAddress())
                .contactNumber(a.getPatient().getContactNumber())
                .dentistName(a.getDentist().getName())
                .dentistSpecialization(a.getDentist().getSpecialization())
                .treatmentType(a.getTreatmentType())
                .appointmentDate(a.getAppointmentDate().toString())
                .appointmentTime(a.getAppointmentTime().toString())
                .status(a.getStatus().name())
                .notes(a.getNotes())
                .createdAt(a.getCreatedAt().toString())
                .build();
    }
}
