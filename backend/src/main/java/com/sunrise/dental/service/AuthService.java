package com.sunrise.dental.service;

import com.sunrise.dental.config.JwtUtil;
import com.sunrise.dental.dto.LoginRequest;
import com.sunrise.dental.dto.LoginResponse;
import com.sunrise.dental.dto.PatientSignupRequest;
import com.sunrise.dental.dto.ProfileUpdateRequest;
import com.sunrise.dental.dto.ProfileResponse;
import com.sunrise.dental.dto.ChangePasswordRequest;
import com.sunrise.dental.model.User;
import com.sunrise.dental.model.Patient;
import com.sunrise.dental.repository.UserRepository;
import com.sunrise.dental.repository.PatientRepository;
import org.springframework.security.authentication.BadCredentialsException;
import com.sunrise.dental.util.PasswordUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, PatientRepository patientRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, EmailService emailService) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    public LoginResponse login(LoginRequest request) {
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!user.isActive()) {
            throw new BadCredentialsException("Account is disabled. Please contact the administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name(), user.isActive());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

        return LoginResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .build();
    }

    public void resetPassword(String username) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("No email address is associated with this account.");
        }

        String newPassword = PasswordUtils.generateRandomPassword();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), newPassword);
    }

    public LoginResponse registerPatient(PatientSignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken.");
        }
        
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .fullName(request.getFullName())
                .contactNumber(request.getContactNumber())
                .role(User.Role.PATIENT)
                .isActive(true)
                .build();
                
        userRepository.save(user);
        
        patientRepository.findByContactNumber(request.getContactNumber())
                .orElseGet(() -> patientRepository.save(Patient.builder()
                        .name(request.getFullName())
                        .contactNumber(request.getContactNumber())
                        .address(request.getAddress())
                        .build()));
                        
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name(), user.isActive());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
        
        return LoginResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .build();
    }

    public LoginResponse refreshToken(String refreshToken) {
        jwtUtil.validateToken(refreshToken);
        String username = jwtUtil.extractUsername(refreshToken);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("User not found"));
                
        if (!user.isActive()) {
            throw new BadCredentialsException("Account is disabled.");
        }
        
        String newToken = jwtUtil.generateToken(user.getUsername(), user.getRole().name(), user.isActive());
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getUsername());
        
        return LoginResponse.builder()
                .token(newToken)
                .refreshToken(newRefreshToken)
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .build();
    }

    public ProfileResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String address = patientRepository.findByContactNumber(user.getContactNumber())
                .map(Patient::getAddress)
                .orElse("");

        return ProfileResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .contactNumber(user.getContactNumber())
                .address(address)
                .role(user.getRole().name())
                .build();
    }

    public ProfileResponse updateProfile(String username, ProfileUpdateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String oldContact = user.getContactNumber();
        user.setFullName(request.getFullName());
        user.setContactNumber(request.getContactNumber());
        userRepository.save(user);

        // Also sync the Patient record
        patientRepository.findByContactNumber(oldContact).ifPresent(patient -> {
            patient.setName(request.getFullName());
            patient.setContactNumber(request.getContactNumber());
            patient.setAddress(request.getAddress());
            patientRepository.save(patient);
        });

        return getProfile(username);
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect.");
        }
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
