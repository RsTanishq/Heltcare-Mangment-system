export type AppointmentStatus = "upcoming" | "finished" | "cancelled";
export type PaymentStatus = "pending" | "completed" | "refunded";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientImage: string;
  date: string;
  time: string;
  type: string;
  condition: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  prescription?: string;
  followUpDate?: string;
  medicalRecords?: string[];
}

export interface NewAppointment {
  patientName: string;
  condition: string;
  date: string;
  time: string;
  amount: number;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
} 