package com.sunrise.dental.controller;

import com.sunrise.dental.dto.DailyReportResponse;
import com.sunrise.dental.dto.MonthlyReportResponse;
import com.sunrise.dental.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/daily")
    public ResponseEntity<DailyReportResponse> dailyReport(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(reportService.getDailyReport(date != null ? date : LocalDate.now()));
    }

    @GetMapping("/monthly")
    public ResponseEntity<MonthlyReportResponse> monthlyReport(
            @RequestParam(required = false) Integer year) {
        int y = (year != null) ? year : LocalDate.now().getYear();
        return ResponseEntity.ok(reportService.getMonthlyReport(y));
    }
}
