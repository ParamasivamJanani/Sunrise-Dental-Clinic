package com.sunrise.dental.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sunrise.dental.dto.AppointmentRequest;
import com.sunrise.dental.dto.AppointmentResponse;
import com.sunrise.dental.service.AppointmentService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AppointmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AppointmentService appointmentService;


    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "RECEPTIONIST")
    public void registerAppointment_ShouldReturn201_WhenValid() throws Exception {
        AppointmentRequest req = new AppointmentRequest();
        req.setPatientName("John Doe");
        req.setAddress("Colombo");
        req.setContactNumber("0771234567");
        req.setDentistId(1L);
        req.setTreatmentType("CONSULTATION");
        req.setAppointmentDate(LocalDate.now().plusDays(1).toString());
        req.setAppointmentTime("10:00");

        AppointmentResponse res = AppointmentResponse.builder()
                .id(1L)
                .appointmentNumber("SDC-20260903-0001")
                .patientName("John Doe")
                .status("SCHEDULED")
                .build();

        Mockito.when(appointmentService.registerAppointment(Mockito.any())).thenReturn(res);

        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.appointmentNumber").value("SDC-20260903-0001"))
                .andExpect(jsonPath("$.patientName").value("John Doe"));
    }

    @Test
    @WithMockUser(roles = "RECEPTIONIST")
    public void getAppointment_ShouldReturn200_WhenExists() throws Exception {
        AppointmentResponse res = AppointmentResponse.builder()
                .id(1L)
                .appointmentNumber("SDC-20260903-0001")
                .patientName("John Doe")
                .build();

        Mockito.when(appointmentService.findByAppointmentNumber("SDC-20260903-0001")).thenReturn(res);

        mockMvc.perform(get("/api/appointments/SDC-20260903-0001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.appointmentNumber").value("SDC-20260903-0001"));
    }
}
