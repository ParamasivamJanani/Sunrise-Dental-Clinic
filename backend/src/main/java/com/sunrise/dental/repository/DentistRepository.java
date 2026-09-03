package com.sunrise.dental.repository;

import com.sunrise.dental.model.Dentist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DentistRepository extends JpaRepository<Dentist, Long> {
    List<Dentist> findByIsAvailableTrue();
}
