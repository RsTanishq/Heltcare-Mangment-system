// Types and mock data for patients

export interface PatientMedicalHistory {
  condition: string;
  diagnosedDate: string;
  medications?: string[];
  notes?: string;
}

export interface PatientAllergy {
  allergen: string;
  severity: "Mild" | "Moderate" | "Severe";
  diagnosed: string;
}

export interface PatientVaccination {
  name: string;
  date: string;
  dueDate?: string;
  provider?: string;
}

export interface BloodPressureReading {
  date: string;
  value: number;
}

export interface Appointment {
  id: string;
  time: string;
  title: string;
  doctor: string;
  type: string;
  date: string;
  htpiScore: number;
  status: "upcoming" | "finished" | "cancelled";
  paymentStatus: "pending" | "completed";
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory: PatientMedicalHistory[];
  allergies: PatientAllergy[];
  vaccinations: PatientVaccination[];
  weight: number; // in kg
  height: number; // in cm
  profileImage?: string; // URL or base64 string for the image
  createdAt: string;
  lastVisit?: string;
  bloodPressureHistory: BloodPressureReading[];
  recentBloodPressure: string;
  highestBloodPressure: string;
  lowestBloodPressure: string;
  appointments: Appointment[];
  recentAppointments: Appointment[];
  walletAddress?: string; // Ethereum wallet address
  lastLogin?: string; // Last login timestamp
}

export const mockPatients: Patient[] = [
  {
    id: "P001",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    bloodGroup: "B+",
    address: "123 Park Street, Mumbai, Maharashtra",
    emergencyContact: {
      name: "Priya Sharma",
      relationship: "Spouse",
      phone: "+91 98765 43211",
    },
    medicalHistory: [
      {
        condition: "Type 2 Diabetes",
        diagnosedDate: "2019-03-10",
        medications: ["Metformin", "Glimepiride"],
        notes: "Well controlled with medication and diet",
      },
    ],
    allergies: [
      {
        allergen: "Penicillin",
        severity: "Moderate",
        diagnosed: "2015-08-22",
      },
    ],
    vaccinations: [
      {
        name: "COVID-19",
        date: "2021-06-15",
        provider: "City Hospital",
      },
      {
        name: "Flu Shot",
        date: "2023-10-01",
        dueDate: "2024-10-01",
      },
    ],
    weight: 75,
    height: 175,
    profileImage: "/patients/1.jpg",
    createdAt: "2023-01-15",
    lastVisit: "2024-02-20",
    bloodPressureHistory: [
      { date: "Sunday", value: 122 },
      { date: "Monday", value: 128 },
      { date: "Tuesday", value: 125 },
      { date: "Wednesday", value: 130 },
      { date: "Thursday", value: 126 },
      { date: "Friday", value: 124 },
      { date: "Saturday", value: 127 },
    ],
    recentBloodPressure: "126/82",
    highestBloodPressure: "130/85",
    lowestBloodPressure: "122/78",
    appointments: [
      {
        id: "APP001",
        time: "10:30 AM",
        title: "Regular Checkup",
        doctor: "Dr. Amit Patel",
        type: "checkup",
        date: "2024-03-25",
        htpiScore: 0.75,
        status: "upcoming",
        paymentStatus: "pending",
      },
    ],
    recentAppointments: [
      {
        id: "APP002",
        time: "02:15 PM",
        title: "Diabetes Review",
        doctor: "Dr. Priya Mehta",
        type: "followup",
        date: "2024-02-20",
        htpiScore: 0.82,
        status: "finished",
        paymentStatus: "completed",
      },
    ],
  },
  {
    id: "P002",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 87654 32109",
    dateOfBirth: "1995-08-22",
    gender: "Female",
    bloodGroup: "O+",
    address: "456 Lake View, Bangalore, Karnataka",
    emergencyContact: {
      name: "Raj Patel",
      relationship: "Brother",
      phone: "+91 87654 32108",
    },
    medicalHistory: [
      {
        condition: "Asthma",
        diagnosedDate: "2010-06-15",
        medications: ["Albuterol Inhaler"],
        notes: "Mild asthma, triggered by dust and cold weather",
      },
    ],
    allergies: [
      {
        allergen: "Dust Mites",
        severity: "Moderate",
        diagnosed: "2010-06-15",
      },
      {
        allergen: "Pollen",
        severity: "Mild",
        diagnosed: "2010-06-15",
      },
    ],
    vaccinations: [
      {
        name: "COVID-19",
        date: "2021-07-01",
        provider: "Apollo Hospital",
      },
    ],
    weight: 58,
    height: 162,
    profileImage: "/patients/2.jpg",
    createdAt: "2023-03-10",
    lastVisit: "2024-01-15",
    bloodPressureHistory: [
      { date: "Sunday", value: 118 },
      { date: "Monday", value: 120 },
      { date: "Tuesday", value: 119 },
      { date: "Wednesday", value: 121 },
      { date: "Thursday", value: 118 },
      { date: "Friday", value: 120 },
      { date: "Saturday", value: 119 },
    ],
    recentBloodPressure: "120/80",
    highestBloodPressure: "121/82",
    lowestBloodPressure: "118/78",
    appointments: [
      {
        id: "APP003",
        time: "11:00 AM",
        title: "Asthma Review",
        doctor: "Dr. Suresh Kumar",
        type: "checkup",
        date: "2024-03-28",
        htpiScore: 0.68,
        status: "upcoming",
        paymentStatus: "pending",
      },
    ],
    recentAppointments: [
      {
        id: "APP004",
        time: "03:30 PM",
        title: "General Checkup",
        doctor: "Dr. Meera Shah",
        type: "general",
        date: "2024-01-15",
        htpiScore: 0.71,
        status: "finished",
        paymentStatus: "completed",
      },
    ],
  },
  {
    id: "P003",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    phone: "+91 98765 12345",
    dateOfBirth: "1988-12-10",
    gender: "Male",
    bloodGroup: "A+",
    address: "789 Green Park, Delhi, India",
    emergencyContact: {
      name: "Neha Kumar",
      relationship: "Wife",
      phone: "+91 98765 12346",
    },
    medicalHistory: [
      {
        condition: "Hypertension",
        diagnosedDate: "2020-05-15",
        medications: ["Amlodipine", "Telmisartan"],
        notes: "Blood pressure under control with medication",
      },
      {
        condition: "High Cholesterol",
        diagnosedDate: "2021-03-20",
        medications: ["Atorvastatin"],
        notes: "Regular monitoring required",
      },
    ],
    allergies: [],
    vaccinations: [
      {
        name: "COVID-19",
        date: "2021-06-30",
        provider: "AIIMS Delhi",
      },
    ],
    weight: 82,
    height: 178,
    profileImage: "/patients/3.jpg",
    createdAt: "2022-08-15",
    lastVisit: "2024-02-15",
    bloodPressureHistory: [
      { date: "Sunday", value: 135 },
      { date: "Monday", value: 132 },
      { date: "Tuesday", value: 128 },
      { date: "Wednesday", value: 130 },
      { date: "Thursday", value: 134 },
      { date: "Friday", value: 129 },
      { date: "Saturday", value: 131 },
    ],
    recentBloodPressure: "132/85",
    highestBloodPressure: "135/88",
    lowestBloodPressure: "128/82",
    appointments: [],
    recentAppointments: [],
  },
  {
    id: "P004",
    name: "Meera Patel",
    email: "meera.patel@example.com",
    phone: "+91 87654 98765",
    dateOfBirth: "1992-03-25",
    gender: "Female",
    bloodGroup: "B-",
    address: "456 Andheri West, Mumbai, India",
    emergencyContact: {
      name: "Rajesh Patel",
      relationship: "Father",
      phone: "+91 87654 98766",
    },
    medicalHistory: [
      {
        condition: "Migraine",
        diagnosedDate: "2019-08-12",
        medications: ["Sumatriptan"],
        notes: "Triggered by stress and lack of sleep",
      },
    ],
    allergies: [
      {
        allergen: "Shellfish",
        severity: "Severe",
        diagnosed: "2018-05-10",
      },
    ],
    vaccinations: [
      {
        name: "COVID-19",
        date: "2021-07-15",
        provider: "Lilavati Hospital",
      },
    ],
    weight: 55,
    height: 160,
    profileImage: "/patients/4.jpg",
    createdAt: "2023-01-10",
    lastVisit: "2024-03-01",
    bloodPressureHistory: [
      { date: "Sunday", value: 118 },
      { date: "Monday", value: 120 },
      { date: "Tuesday", value: 119 },
      { date: "Wednesday", value: 117 },
      { date: "Thursday", value: 121 },
      { date: "Friday", value: 118 },
      { date: "Saturday", value: 120 },
    ],
    recentBloodPressure: "118/75",
    highestBloodPressure: "121/78",
    lowestBloodPressure: "117/72",
    appointments: [],
    recentAppointments: [],
  },
  {
    id: "P005",
    name: "Arjun Singh",
    email: "arjun.singh@example.com",
    phone: "+91 76543 21098",
    dateOfBirth: "1985-07-18",
    gender: "Male",
    bloodGroup: "O-",
    address: "234 Koramangala, Bangalore, India",
    emergencyContact: {
      name: "Priya Singh",
      relationship: "Sister",
      phone: "+91 76543 21099",
    },
    medicalHistory: [
      {
        condition: "Lower Back Pain",
        diagnosedDate: "2022-01-05",
        medications: ["Diclofenac", "Muscle Relaxants"],
        notes: "Physiotherapy recommended",
      },
    ],
    allergies: [
      {
        allergen: "Peanuts",
        severity: "Moderate",
        diagnosed: "2010-03-15",
      },
    ],
    vaccinations: [
      {
        name: "COVID-19",
        date: "2021-08-01",
        provider: "Manipal Hospital",
      },
    ],
    weight: 75,
    height: 172,
    profileImage: "/patients/5.jpg",
    createdAt: "2022-12-20",
    lastVisit: "2024-02-28",
    bloodPressureHistory: [
      { date: "Sunday", value: 125 },
      { date: "Monday", value: 128 },
      { date: "Tuesday", value: 126 },
      { date: "Wednesday", value: 124 },
      { date: "Thursday", value: 127 },
      { date: "Friday", value: 125 },
      { date: "Saturday", value: 126 },
    ],
    recentBloodPressure: "126/82",
    highestBloodPressure: "128/84",
    lowestBloodPressure: "124/80",
    appointments: [],
    recentAppointments: [],
  },
];

// Function to add a new patient to the mock data
export const addNewPatient = (patient: Patient) => {
  mockPatients.push(patient);
  return patient;
};

// Function to get a patient by ID
export const getPatientById = (id: string): Patient | undefined => {
  return mockPatients.find((patient) => patient.id === id);
};

// Function to get all patients
export const getAllPatients = (): Patient[] => {
  return mockPatients;
};

// Function to generate a new patient ID
export const generatePatientId = (): string => {
  const lastId = mockPatients[mockPatients.length - 1]?.id || "P000";
  const numericPart = parseInt(lastId.substring(1)) + 1;
  return `P${numericPart.toString().padStart(3, "0")}`;
};
