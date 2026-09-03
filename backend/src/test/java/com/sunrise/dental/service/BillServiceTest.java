package com.sunrise.dental.service;

import com.sunrise.dental.dto.BillResponse;
import com.sunrise.dental.exception.BillAlreadyExistsException;
import com.sunrise.dental.exception.InvalidTreatmentTypeException;
import com.sunrise.dental.model.Appointment;
import com.sunrise.dental.model.Bill;
import com.sunrise.dental.model.Dentist;
import com.sunrise.dental.model.Patient;
import com.sunrise.dental.repository.AppointmentRepository;
import com.sunrise.dental.repository.BillRepository;
import com.sunrise.dental.service.strategy.*;
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
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * TC-05: Generate bill for Tooth Extraction → correct total (treatment + consultation)
 * TC-06: Generate bill with 0% discount → total = treatment + consultation fee
 * TC-07: Generate bill when bill already exists → throws BillAlreadyExistsException
 * TC-08: Invalid treatment type → throws InvalidTreatmentTypeException
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("BillService Unit Tests")
class BillServiceTest {

    @Mock private BillRepository billRepository;
    @Mock private AppointmentRepository appointmentRepository;

    @InjectMocks private BillService billService;

    private Appointment testAppointment;

    @BeforeEach
    void setUp() {
        // Inject strategy map manually (Spring won't be running)
        Map<String, TreatmentPricingStrategy> strategies = Map.of(
                "CONSULTATION", new ConsultationPricing(),
                "TEETH_CLEANING", new TeethCleaningPricing(),
                "TOOTH_FILLING", new ToothFillingPricing(),
                "TOOTH_EXTRACTION", new ToothExtractionPricing(),
                "ROOT_CANAL", new RootCanalPricing(),
                "TEETH_WHITENING", new TeethWhiteningPricing(),
                "BRACES_CONSULTATION", new BracesConsultationPricing()
        );

        // Use reflection to inject the strategies map
        try {
            var field = BillService.class.getDeclaredField("pricingStrategies");
            field.setAccessible(true);
            field.set(billService, strategies);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        Dentist dentist = Dentist.builder()
                .id(1L).name("Dr. Priya Perera")
                .consultationFee(1500.0).build();

        Patient patient = Patient.builder()
                .id(1L).name("Nimal Perera")
                .contactNumber("0771234567").build();

        testAppointment = Appointment.builder()
                .id(1L).appointmentNumber("SDC-20260903-0001")
                .patient(patient).dentist(dentist)
                .treatmentType("TOOTH_EXTRACTION")
                .appointmentDate(LocalDate.now())
                .appointmentTime(LocalTime.of(10, 0))
                .status(Appointment.Status.SCHEDULED)
                .createdAt(LocalDateTime.now()).build();
    }

    // ─── TC-05 ───────────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-05: Generate bill for Tooth Extraction → total = 7000 + 1500 = 8500")
    void tc05_generateBillToothExtraction_correctTotal() {
        when(billRepository.existsByAppointmentAppointmentNumber("SDC-20260903-0001")).thenReturn(false);
        when(appointmentRepository.findByAppointmentNumber("SDC-20260903-0001"))
                .thenReturn(Optional.of(testAppointment));

        Bill savedBill = Bill.builder()
                .id(1L).appointment(testAppointment)
                .treatmentCost(7000.0).consultationFee(1500.0)
                .discount(0.0).totalAmount(8500.0)
                .generatedAt(LocalDateTime.now()).isPaid(false).build();
        when(billRepository.save(any(Bill.class))).thenReturn(savedBill);

        BillResponse response = billService.generateBill("SDC-20260903-0001");

        assertThat(response.getTreatmentCost()).isEqualTo(7000.0);
        assertThat(response.getConsultationFee()).isEqualTo(1500.0);
        assertThat(response.getTotalAmount()).isEqualTo(8500.0);
        assertThat(response.getDiscount()).isEqualTo(0.0);
    }

    // ─── TC-06 ───────────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-06: Bill with 0% discount → total equals treatment + consultation fee")
    void tc06_billNoDiscount_totalEqualsSum() {
        when(billRepository.existsByAppointmentAppointmentNumber("SDC-20260903-0001")).thenReturn(false);
        when(appointmentRepository.findByAppointmentNumber("SDC-20260903-0001"))
                .thenReturn(Optional.of(testAppointment));
        when(billRepository.save(any(Bill.class))).thenAnswer(inv -> {
            Bill b = inv.getArgument(0);
            b.setId(1L);
            b.setGeneratedAt(LocalDateTime.now());
            return b;
        });

        BillResponse response = billService.generateBill("SDC-20260903-0001");

        assertThat(response.getTotalAmount())
                .isEqualTo(response.getTreatmentCost() + response.getConsultationFee() - response.getDiscount());
    }

    // ─── TC-07 ───────────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-07: Generate bill when already exists → throws BillAlreadyExistsException")
    void tc07_generateBillAlreadyExists_shouldThrow() {
        when(billRepository.existsByAppointmentAppointmentNumber("SDC-20260903-0001")).thenReturn(true);

        assertThatThrownBy(() -> billService.generateBill("SDC-20260903-0001"))
                .isInstanceOf(BillAlreadyExistsException.class)
                .hasMessageContaining("SDC-20260903-0001");
    }

    // ─── TC-08 ───────────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-08: Invalid treatment type → throws InvalidTreatmentTypeException")
    void tc08_invalidTreatmentType_shouldThrow() {
        assertThatThrownBy(() -> billService.resolveStrategy("UNKNOWN_TREATMENT"))
                .isInstanceOf(InvalidTreatmentTypeException.class)
                .hasMessageContaining("UNKNOWN_TREATMENT");
    }
}
