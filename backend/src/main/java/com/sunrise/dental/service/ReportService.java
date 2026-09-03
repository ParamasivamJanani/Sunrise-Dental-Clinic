package com.sunrise.dental.service;

import com.sunrise.dental.dto.DailyReportResponse;
import com.sunrise.dental.dto.MonthlyReportResponse;
import com.sunrise.dental.model.Appointment;
import com.sunrise.dental.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
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

    public MonthlyReportResponse getMonthlyReport(int year) {
        List<MonthlyReportResponse.MonthData> months = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            LocalDate start = LocalDate.of(year, m, 1);
            LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
            List<Appointment> appts = appointmentRepository.findByDateRange(start, end);
            int total = appts.size();
            int completed = (int) appts.stream().filter(a -> a.getStatus() == Appointment.Status.COMPLETED).count();
            double revenue = billService.getRevenueByRange(
                    start.atStartOfDay(), end.atTime(23, 59, 59));
            String monthName = Month.of(m).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            months.add(new MonthlyReportResponse.MonthData(monthName, m, total, completed, revenue));
        }
        return new MonthlyReportResponse(year, months);
    }
}
