package com.sunrise.dental.service;

import com.sunrise.dental.dto.DentistRegistrationRequest;
import com.sunrise.dental.dto.DentistResponse;
import com.sunrise.dental.model.Dentist;
import com.sunrise.dental.repository.DentistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DentistService {

    private final DentistRepository dentistRepository;

    public DentistService(DentistRepository dentistRepository) {
        this.dentistRepository = dentistRepository;
    }

    @Transactional
    public DentistResponse registerDentist(DentistRegistrationRequest request) {
        Dentist dentist = Dentist.builder()
                .name(request.getFullName())
                .specialization(request.getSpecialization())
                .consultationFee(request.getConsultationFee())
                .isAvailable(true)
                .build();
        dentistRepository.save(dentist);

        return DentistResponse.builder()
                .id(dentist.getId())
                .name(dentist.getName())
                .specialization(dentist.getSpecialization())
                .consultationFee(dentist.getConsultationFee())
                .isAvailable(dentist.isAvailable())
                .build();
    }
}
