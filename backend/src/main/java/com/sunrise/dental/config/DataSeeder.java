package com.sunrise.dental.config;

import com.sunrise.dental.model.Dentist;
import com.sunrise.dental.model.User;
import com.sunrise.dental.repository.DentistRepository;
import com.sunrise.dental.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final DentistRepository dentistRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, DentistRepository dentistRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.dentistRepository = dentistRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedDentists();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            userRepository.save(User.builder().username("admin").email("admin@sunrise.com").password(passwordEncoder.encode("admin123"))
                    .fullName("System Administrator").role(User.Role.ADMIN).build());
            userRepository.save(User.builder().username("staff").email("staff@sunrise.com").password(passwordEncoder.encode("staff123"))
                    .fullName("Clinic Receptionist").role(User.Role.RECEPTIONIST).build());
            userRepository.save(User.builder().username("drpriya").email("drpriya@sunrise.com").password(passwordEncoder.encode("dentist123"))
                    .fullName("Dr. Priya Perera").role(User.Role.DENTIST).build());
            log.info("Default users seeded: admin / staff / drpriya");
        }
    }

    private void seedDentists() {
        if (dentistRepository.count() == 0) {
            dentistRepository.save(Dentist.builder().name("Dr. Priya Perera").specialization("General Dentist").consultationFee(1500.0).build());
            dentistRepository.save(Dentist.builder().name("Dr. Kasun Silva").specialization("Orthodontist").consultationFee(2000.0).build());
            dentistRepository.save(Dentist.builder().name("Dr. Amali Fernando").specialization("Endodontist").consultationFee(2500.0).build());
            log.info("Dentists seeded: Dr. Priya Perera, Dr. Kasun Silva, Dr. Amali Fernando");
        }
    }
}
