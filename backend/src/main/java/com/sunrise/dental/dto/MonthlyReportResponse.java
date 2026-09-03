package com.sunrise.dental.dto;

import java.util.List;

public class MonthlyReportResponse {
    private int year;
    private List<MonthData> months;

    public MonthlyReportResponse() {}
    public MonthlyReportResponse(int year, List<MonthData> months) {
        this.year = year; this.months = months;
    }

    public int getYear() { return year; }
    public List<MonthData> getMonths() { return months; }
    public void setYear(int year) { this.year = year; }
    public void setMonths(List<MonthData> months) { this.months = months; }

    public static class MonthData {
        private String month;
        private int monthNumber;
        private int totalAppointments;
        private int completedAppointments;
        private double totalRevenue;

        public MonthData() {}
        public MonthData(String month, int monthNumber, int totalAppointments, int completedAppointments, double totalRevenue) {
            this.month = month; this.monthNumber = monthNumber;
            this.totalAppointments = totalAppointments;
            this.completedAppointments = completedAppointments;
            this.totalRevenue = totalRevenue;
        }

        public String getMonth() { return month; }
        public int getMonthNumber() { return monthNumber; }
        public int getTotalAppointments() { return totalAppointments; }
        public int getCompletedAppointments() { return completedAppointments; }
        public double getTotalRevenue() { return totalRevenue; }
    }
}
