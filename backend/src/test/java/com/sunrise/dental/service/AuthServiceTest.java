package com.sunrise.dental.service;

import com.sunrise.dental.config.JwtUtil;
import com.sunrise.dental.dto.LoginRequest;
import com.sunrise.dental.dto.LoginResponse;
import com.sunrise.dental.model.User;
import com.sunrise.dental.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * TC-09: Login with wrong password → throws BadCredentialsException
 * TC-10: Login with correct credentials → returns valid LoginResponse with token
 * TC-11: Login with non-existent user → throws BadCredentialsException
 * TC-12: Login with inactive account → throws BadCredentialsException
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks private AuthService authService;

    private User activeUser;

    @BeforeEach
    void setUp() {
        activeUser = User.builder()
                .id(1L).username("staff")
                .password("$2a$12$hashedpassword")
                .fullName("Clinic Receptionist")
                .role(User.Role.RECEPTIONIST)
                .isActive(true).build();
    }

    // ─── TC-09 ───────────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-09: Login with wrong password → throws BadCredentialsException")
    void tc09_wrongPassword_shouldThrow() {
        when(userRepository.findByUsername("staff")).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("wrongpass", activeUser.getPassword())).thenReturn(false);

        LoginRequest request = new LoginRequest();
        request.setUsername("staff");
        request.setPassword("wrongpass");

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("Invalid username or password");
    }

    // ─── TC-10 ───────────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-10: Correct credentials → returns LoginResponse with token")
    void tc10_correctCredentials_shouldReturnToken() {
        when(userRepository.findByUsername("staff")).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("staff123", activeUser.getPassword())).thenReturn(true);
        when(jwtUtil.generateToken("staff", "RECEPTIONIST")).thenReturn("mock.jwt.token");

        LoginRequest request = new LoginRequest();
        request.setUsername("staff");
        request.setPassword("staff123");

        LoginResponse response = authService.login(request);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("mock.jwt.token");
        assertThat(response.getRole()).isEqualTo("RECEPTIONIST");
        assertThat(response.getFullName()).isEqualTo("Clinic Receptionist");
    }

    // ─── TC-11 ───────────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-11: Non-existent username → throws BadCredentialsException")
    void tc11_nonExistentUser_shouldThrow() {
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        LoginRequest request = new LoginRequest();
        request.setUsername("ghost");
        request.setPassword("anypass");

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);
    }

    // ─── TC-12 ───────────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-12: Inactive account → throws BadCredentialsException")
    void tc12_inactiveAccount_shouldThrow() {
        User inactiveUser = User.builder()
                .id(2L).username("inactive").password("pass")
                .fullName("Old Staff").role(User.Role.RECEPTIONIST)
                .isActive(false).build();

        when(userRepository.findByUsername("inactive")).thenReturn(Optional.of(inactiveUser));

        LoginRequest request = new LoginRequest();
        request.setUsername("inactive");
        request.setPassword("pass");

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("disabled");
    }
}
