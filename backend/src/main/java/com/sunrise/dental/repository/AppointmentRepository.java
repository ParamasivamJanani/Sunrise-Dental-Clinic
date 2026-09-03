package com.sunrise.dental.repository;

import com.sunrise.dental.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    Optional<Appointment> findByAppointmentNumber(String appointmentNumber);

    List<Appointment> findByPatient_ContactNumber(String contactNumber);

    boolean existsByAppointmentNumber(String appointmentNumber);

    List<Appointment> findByAppointmentDate(LocalDate date);

    List<Appointment> findByDentistIdOrderByAppointmentDateDescAppointmentTimeAsc(Long dentistId);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentDate = :date")
    long countByDate(@Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :start AND :end ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findByDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
