package com.sunrise.dental.service;

import com.sunrise.dental.dto.AppointmentRequest;
import com.sunrise.dental.dto.AppointmentResponse;
import com.sunrise.dental.exception.AppointmentNotFoundException;
import com.sunrise.dental.exception.DuplicateAppointmentException;
import com.sunrise.dental.model.Appointment;
import com.sunrise.dental.model.Dentist;
import com.sunrise.dental.model.Patient;
import com.sunrise.dental.repository.AppointmentRepository;
import com.sunrise.dental.repository.DentistRepository;
import com.sunrise.dental.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * TC-01: Register with duplicate appointment number → throws DuplicateAppointmentException
 * TC-02: Search non-existent appointment → throws AppointmentNotFoundException
 * TC-03: Successful registration → returns correct AppointmentResponse
 * TC-04: listToday → returns only today's appointments
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AppointmentService Unit Tests")
class AppointmentServiceTest {

    @Mock private AppointmentRepository appointmentRepository;
    @Mock private PatientRepository patientRepository;
    @Mock private DentistRepository dentistRepository;

    @InjectMocks private AppointmentService appointmentService;

    private Dentist testDentist;
    private Patient testPatient;
    private Appointment testAppointment;

    @BeforeEach
    void setUp() {
        testDentist = Dentist.builder()
                .id(1L).name("Dr. Priya Perera")
                .specialization("General Dentist")
                .consultationFee(1500.0).build();

        testPatient = Patient.builder()
                .id(1L).name("Nimal Perera")
                .address("123 Galle Road, Colombo").contactNumber("0771234567").build();

        testAppointment = Appointment.builder()
                .id(1L).appointmentNumber("SDC-20260903-0001")
                .patient(testPatient).dentist(testDentist)
                .treatmentType("TOOTH_FILLING")
                .appointmentDate(LocalDate.now()).appointmentTime(LocalTime.of(10, 0))
                .status(Appointment.Status.SCHEDULED)
                .createdAt(LocalDateTime.now()).build();
    }

    // ─── TC-01 ───────────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-01: Register appointment with duplicate number should throw DuplicateAppointmentException")
    void tc01_registerDuplicateAppointment_shouldThrow() {
        when(appointmentRepository.existsByAppointmentNumber(anyString())).thenReturn(true);

        AppointmentRequest request = buildRequest();

        assertThatThrownBy(() -> appointmentService.registerAppointment(request))
                .isInstanceOf(DuplicateAppointmentException.class)
                .hasMessageContaining("Appointment already exists");
    }

    // ─── TC-02 ───────────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-02: Search non-existent appointment should throw AppointmentNotFoundException")
    void tc02_searchNonExistentAppointment_shouldThrow() {
        when(appointmentRepository.findByAppointmentNumber("SDC-INVALID-9999"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> appointmentService.findByAppointmentNumber("SDC-INVALID-9999"))
                .isInstanceOf(AppointmentNotFoundException.class)
                .hasMessageContaining("SDC-INVALID-9999");
    }

    // ─── TC-03 ───────────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-03: Successful appointment registration should return correct response")
    void tc03_registerAppointment_shouldReturnCorrectResponse() {
        when(appointmentRepository.existsByAppointmentNumber(anyString())).thenReturn(false);
        when(dentistRepository.findById(1L)).thenReturn(Optional.of(testDentist));
        when(patientRepository.save(any(Patient.class))).thenReturn(testPatient);
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(testAppointment);

        AppointmentResponse response = appointmentService.registerAppointment(buildRequest());

        assertThat(response).isNotNull();
        assertThat(response.getPatientName()).isEqualTo("Nimal Perera");
        assertThat(response.getDentistName()).isEqualTo("Dr. Priya Perera");
        assertThat(response.getTreatmentType()).isEqualTo("TOOTH_FILLING");
        assertThat(response.getStatus()).isEqualTo("SCHEDULED");

        verify(patientRepository, times(1)).save(any(Patient.class));
        verify(appointmentRepository, times(1)).save(any(Appointment.class));
    }

    // ─── TC-04 ───────────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-04: listToday should return today's appointments")
    void tc04_listToday_shouldReturnTodayAppointments() {
        when(appointmentRepository.findByAppointmentDate(LocalDate.now()))
                .thenReturn(List.of(testAppointment));

        List<AppointmentResponse> responses = appointmentService.listToday();

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getAppointmentNumber()).isEqualTo("SDC-20260903-0001");
    }

    // ─── Helper ──────────────────────────────────────────────────────────────
    private AppointmentRequest buildRequest() {
        AppointmentRequest req = new AppointmentRequest();
        req.setPatientName("Nimal Perera");
        req.setAddress("123 Galle Road, Colombo");
        req.setContactNumber("0771234567");
        req.setDentistId(1L);
        req.setTreatmentType("TOOTH_FILLING");
        req.setAppointmentDate(LocalDate.now().toString());
        req.setAppointmentTime("10:00");
        return req;
    }
}
