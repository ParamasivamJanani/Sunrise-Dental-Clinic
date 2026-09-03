package com.sunrise.dental.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendTemporaryPassword(String to, String username, String tempPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Welcome to Sunrise Dental Clinic");
        message.setText("Dear Dr.,\n\n" +
                "Your account has been created successfully.\n\n" +
                "Username: " + username + "\n" +
                "Temporary Password: " + tempPassword + "\n\n" +
                "Please login and change your password as soon as possible.\n\n" +
                "Best Regards,\nSunrise Dental Clinic Team");

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String newPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Sunrise Dental Clinic - Password Reset");
        message.setText("Hello,\n\n" +
                "Your password has been reset successfully.\n\n" +
                "New Password: " + newPassword + "\n\n" +
                "Please login and change your password as soon as possible.\n\n" +
                "Best Regards,\nSunrise Dental Clinic Team");

        mailSender.send(message);
    }
}
