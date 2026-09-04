package com.sunrise.dental.controller;

import com.sunrise.dental.dto.BillResponse;
import com.sunrise.dental.service.BillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PostMapping("/generate/{appointmentNumber}")
    public ResponseEntity<BillResponse> generateBill(@PathVariable String appointmentNumber) {
        return ResponseEntity.ok(billService.generateBill(appointmentNumber));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @GetMapping("/{appointmentNumber}")
    public ResponseEntity<BillResponse> getBill(@PathVariable String appointmentNumber) {
        return ResponseEntity.ok(billService.getBill(appointmentNumber));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PatchMapping("/{billId}/pay")
    public ResponseEntity<BillResponse> markPaid(@PathVariable Long billId) {
        return ResponseEntity.ok(billService.markAsPaid(billId));
    }

}

