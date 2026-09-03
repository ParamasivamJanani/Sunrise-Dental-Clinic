package com.sunrise.dental.service;

import com.sunrise.dental.dto.BillResponse;
import com.sunrise.dental.exception.AppointmentNotFoundException;
import com.sunrise.dental.exception.BillAlreadyExistsException;
import com.sunrise.dental.exception.InvalidTreatmentTypeException;
import com.sunrise.dental.model.Bill;
import com.sunrise.dental.repository.AppointmentRepository;
import com.sunrise.dental.repository.BillRepository;
import com.sunrise.dental.service.strategy.TreatmentPricingStrategy;
import com.sunrise.dental.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final AppointmentRepository appointmentRepository;
    private final Map<String, TreatmentPricingStrategy> pricingStrategies;
    private final UserRepository userRepository;

    public BillService(BillRepository billRepository,
                       AppointmentRepository appointmentRepository,
                       Map<String, TreatmentPricingStrategy> pricingStrategies,
                       UserRepository userRepository) {
        this.billRepository = billRepository;
        this.appointmentRepository = appointmentRepository;
        this.pricingStrategies = pricingStrategies;
        this.userRepository = userRepository;
    }

    @Transactional
    public BillResponse generateBill(String appointmentNumber) {
        if (billRepository.existsByAppointmentAppointmentNumber(appointmentNumber)) {
            throw new BillAlreadyExistsException(appointmentNumber);
        }

        var appointment = appointmentRepository.findByAppointmentNumber(appointmentNumber)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentNumber));

        TreatmentPricingStrategy strategy = resolveStrategy(appointment.getTreatmentType());
        double treatmentCost = strategy.getPrice();
        double consultationFee = appointment.getDentist().getConsultationFee();
        double total = treatmentCost + consultationFee;

        Bill bill = billRepository.save(Bill.builder()
                .appointment(appointment)
                .treatmentCost(treatmentCost)
                .consultationFee(consultationFee)
                .discount(0.0)
                .totalAmount(total)
                .isPaid(false)
                .build());

        return mapToResponse(bill);
    }

    public BillResponse getBill(String appointmentNumber) {
        return billRepository.findByAppointmentAppointmentNumber(appointmentNumber)
                .map(this::mapToResponse)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentNumber));
    }

    @Transactional
    public BillResponse markAsPaid(Long billId) {
        var bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found: " + billId));
        bill.setPaid(true);
        return mapToResponse(billRepository.save(bill));
    }

    public double getTodayRevenue() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(23, 59, 59);
        return billRepository.sumRevenueByDateRange(start, end);
    }

    public List<BillResponse> getMyBills(String username) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return billRepository.findByAppointment_Patient_ContactNumber(user.getContactNumber())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    TreatmentPricingStrategy resolveStrategy(String treatmentType) {
        TreatmentPricingStrategy strategy = pricingStrategies.get(treatmentType.toUpperCase());
        if (strategy == null) {
            throw new InvalidTreatmentTypeException(treatmentType);
        }
        return strategy;
    }

    private BillResponse mapToResponse(Bill bill) {
        var appt = bill.getAppointment();
        return BillResponse.builder()
                .billId(bill.getId())
                .appointmentNumber(appt.getAppointmentNumber())
                .patientName(appt.getPatient().getName())
                .contactNumber(appt.getPatient().getContactNumber())
                .dentistName(appt.getDentist().getName())
                .treatmentType(appt.getTreatmentType())
                .appointmentDate(appt.getAppointmentDate().toString())
                .appointmentTime(appt.getAppointmentTime().toString())
                .treatmentCost(bill.getTreatmentCost())
                .consultationFee(bill.getConsultationFee())
                .discount(bill.getDiscount())
                .totalAmount(bill.getTotalAmount())
                .generatedAt(bill.getGeneratedAt().toString())
                .isPaid(bill.isPaid())
                .build();
    }
}
