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
    private final com.sunrise.dental.repository.PatientRepository patientRepository;
    private final com.sunrise.dental.repository.AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, DentistRepository dentistRepository, 
                      com.sunrise.dental.repository.PatientRepository patientRepository,
                      com.sunrise.dental.repository.AppointmentRepository appointmentRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.dentistRepository = dentistRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedDentists();
        seedPatientsAndAppointments();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            userRepository.save(User.builder().username("admin").email("janani199805@gmail.com").password(passwordEncoder.encode("admin123"))
                    .fullName("System Administrator").role(User.Role.ADMIN).build());
            userRepository.save(User.builder().username("staff").email("infovista67@gmail.com").password(passwordEncoder.encode("staff123"))
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

    private void seedPatientsAndAppointments() {
        if (patientRepository.count() == 0) {
            com.sunrise.dental.model.Patient p1 = patientRepository.save(com.sunrise.dental.model.Patient.builder()
                    .name("Kamal Perera").address("123 Main St, Colombo").contactNumber("0712345678").build());
            com.sunrise.dental.model.Patient p2 = patientRepository.save(com.sunrise.dental.model.Patient.builder()
                    .name("Nimali Silva").address("45 Kandy Rd, Kandy").contactNumber("0776543210").build());
            
            Dentist d1 = dentistRepository.findAll().get(0);
            
            appointmentRepository.save(com.sunrise.dental.model.Appointment.builder()
                    .appointmentNumber("SDC-" + java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.BASIC_ISO_DATE) + "-0001")
                    .patient(p1)
                    .dentist(d1)
                    .treatmentType("CLEANING")
                    .appointmentDate(java.time.LocalDate.now())
                    .appointmentTime(java.time.LocalTime.of(10, 0))
                    .status(com.sunrise.dental.model.Appointment.Status.SCHEDULED)
                    .build());
            
            log.info("Mock patients and appointments seeded");
        }
    }
}
