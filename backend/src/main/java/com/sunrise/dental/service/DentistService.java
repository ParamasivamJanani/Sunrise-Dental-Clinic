package com.sunrise.dental.service;

import com.sunrise.dental.dto.DentistRegistrationRequest;
import com.sunrise.dental.dto.DentistResponse;
import com.sunrise.dental.model.Dentist;
import com.sunrise.dental.model.User;
import com.sunrise.dental.repository.DentistRepository;
import com.sunrise.dental.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.sunrise.dental.util.PasswordUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DentistService {

    private final DentistRepository dentistRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public DentistService(DentistRepository dentistRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.dentistRepository = dentistRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public DentistResponse registerDentist(DentistRegistrationRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username is already taken");
        }

        String tempPassword = PasswordUtils.generateRandomPassword();

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(tempPassword))
                .fullName(request.getFullName())
                .role(User.Role.DENTIST)
                .isActive(true)
                .build();
        userRepository.save(user);

        Dentist dentist = Dentist.builder()
                .name(request.getFullName())
                .specialization("General Dentist")
                .consultationFee(request.getConsultationFee())
                .isAvailable(true)
                .build();
        dentistRepository.save(dentist);

        emailService.sendTemporaryPassword(request.getEmail(), request.getUsername(), tempPassword);

        return DentistResponse.builder()
                .id(dentist.getId())
                .name(dentist.getName())
                .specialization(dentist.getSpecialization())
                .consultationFee(dentist.getConsultationFee())
                .isAvailable(dentist.isAvailable())
                .build();
    }
}
