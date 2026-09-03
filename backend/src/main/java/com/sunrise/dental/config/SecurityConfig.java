package com.sunrise.dental.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login", "/api/auth/forgot-password", "/api/auth/register-patient").permitAll()
                .requestMatchers("/api/appointments/public", "/api/dentists/public").permitAll()
                // Patient-only endpoints
                .requestMatchers(HttpMethod.GET,    "/api/auth/me").hasRole("PATIENT")
                .requestMatchers(HttpMethod.PUT,    "/api/auth/me").hasRole("PATIENT")
                .requestMatchers(HttpMethod.PUT,    "/api/auth/me/password").hasRole("PATIENT")
                .requestMatchers(HttpMethod.GET,    "/api/appointments/me").hasRole("PATIENT")
                .requestMatchers(HttpMethod.DELETE, "/api/appointments/me/**").hasRole("PATIENT")
                .requestMatchers(HttpMethod.GET,    "/api/bills/me").hasRole("PATIENT")
                // Staff / admin endpoints
                .requestMatchers("/api/appointments/**").hasAnyRole("ADMIN", "RECEPTIONIST", "DENTIST")
                .requestMatchers(HttpMethod.POST, "/api/dentists/register").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/dentists/**").authenticated()
                .requestMatchers("/api/reports/**").hasAnyRole("ADMIN", "RECEPTIONIST", "DENTIST")
                .requestMatchers("/api/bills/**").hasAnyRole("ADMIN", "RECEPTIONIST")
                .requestMatchers(HttpMethod.GET, "/api/patients/**").hasAnyRole("ADMIN", "RECEPTIONIST", "DENTIST")
                .requestMatchers(HttpMethod.PUT, "/api/patients/**").hasAnyRole("ADMIN", "RECEPTIONIST")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
