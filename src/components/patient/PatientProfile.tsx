
import { User, Mail, Phone, MapPin, AlertCircle } from "lucide-react";

interface PatientProfileProps {
  patient: {
    patientId: string;
    name: string;
    age: number;
    gender: string;
    walletAddress: string;
    bloodGroup: string;
    contactInfo: {
      email: string;
      phone: string;
      address: string;
    };
    allergies: string[];
  };
}

const PatientProfile: React.FC<PatientProfileProps> = ({ patient }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <User size={32} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{patient.name}</h2>
            <p className="text-sm text-gray-500">
              {patient.age} years • {patient.gender} • {patient.bloodGroup}
            </p>
            <p className="text-xs text-gray-400 mt-1">ID: {patient.patientId}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Mail size={18} className="text-gray-400 mr-3" />
            <span>{patient.contactInfo.email}</span>
          </div>
          <div className="flex items-center">
            <Phone size={18} className="text-gray-400 mr-3" />
            <span>{patient.contactInfo.phone}</span>
          </div>
          <div className="flex items-start">
            <MapPin size={18} className="text-gray-400 mr-3 mt-1" />
            <span>{patient.contactInfo.address}</span>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Blockchain Details</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600 font-medium">Wallet Address</p>
            <p className="font-mono text-sm break-all">{patient.walletAddress}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Allergies</h3>
          {patient.allergies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((allergy, index) => (
                <div key={index} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {allergy}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No known allergies</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
