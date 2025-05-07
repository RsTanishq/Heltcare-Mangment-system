import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import mockDoctors from '../data/mockDoctors';
import { API_CONFIG } from '../config/api';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  availability: boolean;
  email: string;
  phone: string;
  address: string;
  education: string[];
  experience: number;
  rating: number;
  consultationFee: number;
  workingHours: {
    start: string;
    end: string;
    days: string[];
  };
  about: string;
  languages: string[];
  certifications: string[];
}

interface DoctorStore {
  doctors: Doctor[];
  currentDoctor: Doctor | null;
  loading: boolean;
  error: string | null;
  isOfflineMode: boolean;
  
  // Actions
  setDoctors: (doctors: Doctor[]) => void;
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  getDoctorById: (id: string) => Doctor | undefined;
  setCurrentDoctor: (doctor: Doctor | null) => void;
  updateDoctorAvailability: (id: string, availability: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOfflineMode: (isOffline: boolean) => void;

  // API Integration Functions
  fetchDoctors: () => Promise<void>;
  fetchDoctorById: (id: string) => Promise<void>;
  createDoctor: (doctor: Omit<Doctor, 'id'>) => Promise<void>;
  updateDoctorInAPI: (id: string, updates: Partial<Doctor>) => Promise<void>;
  deleteDoctorFromAPI: (id: string) => Promise<void>;
}

export const useDoctorStore = create<DoctorStore>()(
  persist(
    (set, get) => ({
      doctors: mockDoctors,
      currentDoctor: null,
      loading: false,
      error: null,
      isOfflineMode: true, // Start in offline mode by default

      setDoctors: (doctors) => set({ doctors }),
      
      addDoctor: (doctor) => {
        const { doctors } = get();
        set({ doctors: [...doctors, doctor] });
      },
      
      updateDoctor: (id, updates) => {
        const { doctors } = get();
        set({
          doctors: doctors.map((doc) =>
            doc.id === id ? { ...doc, ...updates } : doc
          ),
        });
      },
      
      deleteDoctor: (id) => {
        const { doctors } = get();
        set({ doctors: doctors.filter((doc) => doc.id !== id) });
      },
      
      getDoctorById: (id) => {
        const { doctors } = get();
        return doctors.find((doc) => doc.id === id);
      },
      
      setCurrentDoctor: (doctor) => set({ currentDoctor: doctor }),
      
      updateDoctorAvailability: (id, availability) => {
        const { doctors } = get();
        set({
          doctors: doctors.map((doc) =>
            doc.id === id ? { ...doc, availability } : doc
          ),
        });
      },
      
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setOfflineMode: (isOffline) => set({ isOfflineMode: isOffline }),

      // Updated API Integration Functions with offline fallback
      fetchDoctors: async () => {
        const { isOfflineMode } = get();
        if (isOfflineMode) {
          set({ doctors: mockDoctors, loading: false, error: null });
          return;
        }

        try {
          set({ loading: true, error: null });
          const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS}`, {
            headers: API_CONFIG.HEADERS
          });
          if (!response.ok) throw new Error('Failed to fetch doctors');
          const data = await response.json();
          set({ doctors: data, loading: false });
        } catch (error) {
          console.warn('API not available, falling back to mock data');
          set({ 
            doctors: mockDoctors, 
            loading: false,
            isOfflineMode: true, // Switch to offline mode
            error: null 
          });
        }
      },

      fetchDoctorById: async (id: string) => {
        const { isOfflineMode } = get();
        if (isOfflineMode) {
          const doctor = mockDoctors.find(doc => doc.id === id);
          set({ currentDoctor: doctor || null, loading: false, error: null });
          return;
        }

        try {
          set({ loading: true, error: null });
          const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS}/${id}`, {
            headers: API_CONFIG.HEADERS
          });
          if (!response.ok) throw new Error('Failed to fetch doctor');
          const data = await response.json();
          set({ currentDoctor: data, loading: false });
        } catch (error) {
          const doctor = mockDoctors.find(doc => doc.id === id);
          set({ 
            currentDoctor: doctor || null, 
            loading: false,
            isOfflineMode: true,
            error: null 
          });
        }
      },

      createDoctor: async (doctor: Omit<Doctor, 'id'>) => {
        const { isOfflineMode } = get();
        if (isOfflineMode) {
          const newDoctor = {
            ...doctor,
            id: `doc${mockDoctors.length + 1}`
          } as Doctor;
          set(state => ({ 
            doctors: [...state.doctors, newDoctor],
            loading: false,
            error: null
          }));
          return;
        }

        try {
          set({ loading: true, error: null });
          const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS}`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(doctor),
          });
          if (!response.ok) throw new Error('Failed to create doctor');
          const newDoctor = await response.json();
          set(state => ({ 
            doctors: [...state.doctors, newDoctor],
            loading: false 
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false, isOfflineMode: true });
        }
      },

      updateDoctorInAPI: async (id: string, updates: Partial<Doctor>) => {
        const { isOfflineMode } = get();
        if (isOfflineMode) {
          set(state => ({
            doctors: state.doctors.map(doc =>
              doc.id === id ? { ...doc, ...updates } : doc
            ),
            loading: false,
            error: null
          }));
          return;
        }

        try {
          set({ loading: true, error: null });
          const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS}/${id}`, {
            method: 'PATCH',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(updates),
          });
          if (!response.ok) throw new Error('Failed to update doctor');
          const updatedDoctor = await response.json();
          set(state => ({
            doctors: state.doctors.map(doc =>
              doc.id === id ? updatedDoctor : doc
            ),
            loading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false, isOfflineMode: true });
        }
      },

      deleteDoctorFromAPI: async (id: string) => {
        const { isOfflineMode } = get();
        if (isOfflineMode) {
          set(state => ({
            doctors: state.doctors.filter(doc => doc.id !== id),
            loading: false,
            error: null
          }));
          return;
        }

        try {
          set({ loading: true, error: null });
          const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS}/${id}`, {
            method: 'DELETE',
            headers: API_CONFIG.HEADERS
          });
          if (!response.ok) throw new Error('Failed to delete doctor');
          set(state => ({
            doctors: state.doctors.filter(doc => doc.id !== id),
            loading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false, isOfflineMode: true });
        }
      },
    }),
    {
      name: 'doctor-storage',
      partialize: (state) => ({
        doctors: state.doctors,
        currentDoctor: state.currentDoctor,
        isOfflineMode: state.isOfflineMode
      }),
    }
  )
); 