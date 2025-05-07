
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import MedicalRecordCard from "../components/medical-records/MedicalRecordCard";
import MedicalRecordDetail from "../components/medical-records/MedicalRecordDetail";
import { FileText, Filter } from "lucide-react";

interface MedicalRecordsProps {
  role: "patient" | "doctor" | "admin";
}

export interface MedicalRecord {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  diagnosis: string;
  date: string;
  accessGranted: boolean;
  urgencyLevel: number;
  recordHash: string;
  transactionHash: string;
  htpiScore: number;
  // New fields
  hospital: string;
  appointmentType: string;
  condition: string;
  dischargeDate: string | null;
  consultationType: "online" | "offline";
  prescribedMedications: string[];
  problems: string[];
  paymentType: string;
  attachedFiles: {
    type: "xray" | "lab" | "prescription" | "other";
    name: string;
    url: string;
  }[];
}

const MedicalRecords: React.FC<MedicalRecordsProps> = ({ role }) => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filter, setFilter] = useState("all"); // all, accessible, emergency
  const patientId = "pat123456789"; // This would come from authentication in a real app
  const patientName = "John Doe"; // This would come from authentication in a real app
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
  // Simulated data loading
  useEffect(() => {
    // In a real app, fetch data from API
    setTimeout(() => {
      const sampleRecords: MedicalRecord[] = [
        {
          id: "rec123456789",
          patientName: "John Doe",
          patientId: "pat123456789",
          doctorName: "Dr. Emma Smith",
          doctorId: "doc123456789",
          diagnosis: "Hypertension",
          date: new Date().toISOString(),
          accessGranted: true,
          urgencyLevel: 0,
          recordHash: "QmTKZgRNwDNZwHtJSjCp6r7FcP2xGM7qZy1vYNLPv73G9n",
          transactionHash: "0x3a4b5c6d7e8f90a1b2c3d4e5f6a7b8c9d0e1f2a3",
          htpiScore: 4.5,
          hospital: "General Hospital",
          appointmentType: "Regular Checkup",
          condition: "Stable",
          dischargeDate: new Date().toISOString(),
          consultationType: "offline",
          prescribedMedications: ["Lisinopril 10mg", "Aspirin 81mg"],
          problems: ["High blood pressure", "Family history of heart disease"],
          paymentType: "Cryptocurrency",
          attachedFiles: [
            {
              type: "lab",
              name: "Blood Test Results",
              url: "/files/blood-test.pdf"
            }
          ]
        },
        {
          id: "rec234567890",
          patientName: "Jane Smith",
          patientId: "pat234567890",
          doctorName: "Dr. James Wilson",
          doctorId: "doc234567890",
          diagnosis: "Diabetes Mellitus Type 2",
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
          accessGranted: true,
          urgencyLevel: 0,
          recordHash: "QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTp",
          transactionHash: "0x1a2b3c4d5e6f70a8b9c0d1e2f3a4b5c6d7e8f9a0",
          htpiScore: 3.2,
          hospital: "Diabetes Care Center",
          appointmentType: "Follow-up",
          condition: "Manageable",
          dischargeDate: null,
          consultationType: "online",
          prescribedMedications: ["Metformin 500mg", "Glipizide 5mg"],
          problems: ["Hyperglycemia", "Fatigue", "Blurred vision"],
          paymentType: "Cash",
          attachedFiles: []
        },
        {
          id: "rec345678901",
          patientName: "Robert Johnson",
          patientId: "pat345678901",
          doctorName: "Dr. Sarah Lee",
          doctorId: "doc345678901",
          diagnosis: "Acute Myocardial Infarction",
          date: new Date(Date.now() - 86400000 * 7).toISOString(),
          accessGranted: true,
          urgencyLevel: 1,
          recordHash: "QmT8CUvZLrPcpKY9XrWGi2yCTUKQ6YHnQYpHiLH2rYvLps",
          transactionHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6",
          htpiScore: 9.8,
          hospital: "Cardiac Emergency Center",
          appointmentType: "Emergency",
          condition: "Critical",
          dischargeDate: new Date(Date.now() - 86400000 * 3).toISOString(),
          consultationType: "offline",
          prescribedMedications: ["Aspirin 325mg", "Clopidogrel 75mg", "Atorvastatin 40mg"],
          problems: ["Chest pain", "Shortness of breath", "History of CAD"],
          paymentType: "Insurance",
          attachedFiles: [
            {
              type: "xray",
              name: "Chest X-ray",
              url: "/files/chest-xray.jpg"
            },
            {
              type: "lab",
              name: "Cardiac Enzymes",
              url: "/files/cardiac-enzymes.pdf"
            }
          ]
        },
        {
          id: "rec456789012",
          patientName: "John Doe",
          patientId: "pat123456789",
          doctorName: "Dr. Michael Brown",
          doctorId: "doc456789012",
          diagnosis: "Bronchitis",
          date: new Date(Date.now() - 86400000 * 14).toISOString(),
          accessGranted: true,
          urgencyLevel: 0,
          recordHash: "QmPChd2hVbrJ6bfo3WBcTW83Xg3QXPM3vfvkBwUZH8W1UA",
          transactionHash: "0xb1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0",
          htpiScore: 1.7,
          hospital: "Respiratory Clinic",
          appointmentType: "Sick Visit",
          condition: "Improving",
          dischargeDate: null,
          consultationType: "online",
          prescribedMedications: ["Amoxicillin 500mg", "Guaifenesin"],
          problems: ["Cough", "Fever", "Chest discomfort"],
          paymentType: "Cryptocurrency",
          attachedFiles: [
            {
              type: "prescription",
              name: "Prescription",
              url: "/files/bronchitis-prescription.pdf"
            }
          ]
        }
      ];
      
      // Filter records based on the role
      const filteredByRole = role === "patient" 
        ? sampleRecords.filter(record => record.patientId === patientId)
        : sampleRecords;
      
      setRecords(filteredByRole);
      setLoading(false);
    }, 1000);
  }, [role]);
  
  const filteredRecords = records.filter(record => {
    if (filter === "all") return true;
    if (filter === "accessible") return record.accessGranted;
    if (filter === "emergency") return record.urgencyLevel > 0;
    return true;
  });
  
  const handleRecordClick = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setDetailOpen(true);
  };

  return (
    <Layout role={role}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {role === "patient" ? "My Medical Records" : "All Patient Records"}
        </h1>
        
        <div className="flex items-center">
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Records</option>
              <option value="accessible">Accessible Only</option>
              <option value="emergency">Emergency Only</option>
            </select>
          </div>
          
          {role === "doctor" && (
            <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
              <FileText size={18} className="mr-2" />
              New Record
            </button>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <MedicalRecordCard 
                key={record.id}
                {...record}
                onClick={() => handleRecordClick(record)}
              />
            ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
              <FileText size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600">No medical records found</h3>
              <p className="text-gray-500">
                {filter !== "all" 
                  ? `No records match your filter criteria. Try adjusting your filters.` 
                  : role === "patient"
                    ? "You don't have any medical records yet."
                    : "There are no medical records available."}
              </p>
            </div>
          )}
        </div>
      )}
      
      {selectedRecord && (
        <MedicalRecordDetail
          record={selectedRecord}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      )}
    </Layout>
  );
};

export default MedicalRecords;
