package com.sunrise.dental.service;

import com.sunrise.dental.dto.DailyReportResponse;
import com.sunrise.dental.model.Appointment;
import com.sunrise.dental.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final AppointmentRepository appointmentRepository;
    private final BillService billService;
    private final AppointmentService appointmentService;

    public ReportService(AppointmentRepository appointmentRepository,
                         BillService billService,
                         AppointmentService appointmentService) {
        this.appointmentRepository = appointmentRepository;
        this.billService = billService;
        this.appointmentService = appointmentService;
    }

    public DailyReportResponse getDailyReport(LocalDate date) {
        List<Appointment> appointments = appointmentRepository.findByAppointmentDate(date);
        double revenue = billService.getTodayRevenue();

        return DailyReportResponse.builder()
                .reportDate(date.toString())
                .totalAppointments(appointments.size())
                .completedAppointments(appointments.stream().filter(a -> a.getStatus() == Appointment.Status.COMPLETED).count())
                .scheduledAppointments(appointments.stream().filter(a -> a.getStatus() == Appointment.Status.SCHEDULED).count())
                .cancelledAppointments(appointments.stream().filter(a -> a.getStatus() == Appointment.Status.CANCELLED).count())
                .totalRevenue(revenue)
                .appointments(appointments.stream().map(appointmentService::mapToResponse).collect(Collectors.toList()))
                .build();
    }
}
