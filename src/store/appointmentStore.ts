import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppointmentRequest {
  id: string;
  patientName: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  condition: string;
  status: "pending" | "accepted" | "rejected";
  visitMode?: "online" | "offline";
  urgency?: "low" | "medium" | "high";
  symptoms?: string;
  paymentType?: string;
  transactionHash?: string;
}

interface AppointmentStore {
  appointments: AppointmentRequest[];
  addAppointment: (appointment: Omit<AppointmentRequest, "id">) => void;
  updateAppointmentStatus: (
    id: string,
    status: "accepted" | "rejected"
  ) => void;
  getDoctorAppointments: (doctorId: string) => AppointmentRequest[];
  getPatientAppointments: (patientId: string) => AppointmentRequest[];
  clearAppointments: () => void; // Add a method to clear all appointments
}

const useAppointmentStore = create(
  persist<AppointmentStore>(
    (set, get) => ({
      appointments: [],
      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [
            ...state.appointments,
            {
              ...appointment,
              id: Math.random().toString(36).substr(2, 9),
            },
          ],
        })),
      updateAppointmentStatus: (id, status) =>
        set((state) => ({
          appointments: state.appointments.map((app) =>
            app.id === id ? { ...app, status } : app
          ),
        })),
      getDoctorAppointments: (doctorId) => {
        return get().appointments.filter((app) => app.doctorId === doctorId);
      },
      getPatientAppointments: (patientId) => {
        return get().appointments.filter((app) => app.patientId === patientId);
      },
      clearAppointments: () => set({ appointments: [] }),
    }),
    {
      name: "appointment-storage", // name of the item in localStorage
      version: 1, // version number
    }
  )
);

export default useAppointmentStore;
