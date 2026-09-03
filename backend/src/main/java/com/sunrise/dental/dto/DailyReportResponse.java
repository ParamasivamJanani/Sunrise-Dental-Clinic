package com.sunrise.dental.dto;

import java.util.List;

public class DailyReportResponse {
    private String reportDate; private long totalAppointments; private long completedAppointments;
    private long scheduledAppointments; private long cancelledAppointments;
    private double totalRevenue; private List<AppointmentResponse> appointments;

    public DailyReportResponse() {}

    public String getReportDate() { return reportDate; }
    public long getTotalAppointments() { return totalAppointments; }
    public long getCompletedAppointments() { return completedAppointments; }
    public long getScheduledAppointments() { return scheduledAppointments; }
    public long getCancelledAppointments() { return cancelledAppointments; }
    public double getTotalRevenue() { return totalRevenue; }
    public List<AppointmentResponse> getAppointments() { return appointments; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String reportDate; private long totalAppointments; private long completedAppointments;
        private long scheduledAppointments; private long cancelledAppointments;
        private double totalRevenue; private List<AppointmentResponse> appointments;

        public Builder reportDate(String v) { this.reportDate = v; return this; }
        public Builder totalAppointments(long v) { this.totalAppointments = v; return this; }
        public Builder completedAppointments(long v) { this.completedAppointments = v; return this; }
        public Builder scheduledAppointments(long v) { this.scheduledAppointments = v; return this; }
        public Builder cancelledAppointments(long v) { this.cancelledAppointments = v; return this; }
        public Builder totalRevenue(double v) { this.totalRevenue = v; return this; }
        public Builder appointments(List<AppointmentResponse> v) { this.appointments = v; return this; }

        public DailyReportResponse build() {
            DailyReportResponse r = new DailyReportResponse();
            r.reportDate = reportDate; r.totalAppointments = totalAppointments;
            r.completedAppointments = completedAppointments; r.scheduledAppointments = scheduledAppointments;
            r.cancelledAppointments = cancelledAppointments; r.totalRevenue = totalRevenue;
            r.appointments = appointments;
            return r;
        }
    }
}
