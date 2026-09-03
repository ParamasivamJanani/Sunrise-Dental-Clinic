// Shared TypeScript interfaces mirroring backend DTOs

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  fullName: string;
  username: string;
}

export interface AppointmentRequest {
  patientName: string;
  address: string;
  contactNumber: string;
  dentistId: number;
  treatmentType: string;
  appointmentDate: string;
  appointmentTime: string;
}

export interface AppointmentResponse {
  id: number;
  appointmentNumber: string;
  patientName: string;
  address: string;
  contactNumber: string;
  dentistName: string;
  dentistSpecialization: string;
  treatmentType: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  createdAt: string;
}

export interface BillResponse {
  billId: number;
  appointmentNumber: string;
  patientName: string;
  contactNumber: string;
  dentistName: string;
  treatmentType: string;
  appointmentDate: string;
  appointmentTime: string;
  treatmentCost: number;
  consultationFee: number;
  discount: number;
  totalAmount: number;
  generatedAt: string;
  paid: boolean;
}

export interface DentistResponse {
  id: number;
  name: string;
  specialization: string;
  consultationFee: number;
  available: boolean;
}

export interface DailyReportResponse {
  reportDate: string;
  totalAppointments: number;
  completedAppointments: number;
  scheduledAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  appointments: AppointmentResponse[];
}

export type UserRole = 'ADMIN' | 'RECEPTIONIST' | 'DENTIST';

export interface AuthUser {
  token: string;
  role: UserRole;
  fullName: string;
  username: string;
}
