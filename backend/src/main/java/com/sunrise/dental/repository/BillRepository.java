package com.sunrise.dental.repository;

import com.sunrise.dental.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    Optional<Bill> findByAppointmentAppointmentNumber(String appointmentNumber);

    boolean existsByAppointmentAppointmentNumber(String appointmentNumber);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Bill b WHERE b.generatedAt BETWEEN :start AND :end AND b.isPaid = true")
    double sumRevenueByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
