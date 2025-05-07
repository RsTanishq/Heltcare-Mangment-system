
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Patient {
  id: string;
  name: string;
  image?: string;
  gender: "Male" | "Female" | "Other";
  weight: string;
  disease: string;
  age: string;
  heartRate: string;
  bloodType: string;
  status: "Outpatient" | "Inpatient";
}

const patients: Patient[] = [
  {
    id: "pat1",
    name: "Daniel Smith",
    image: "/placeholder.svg",
    gender: "Male",
    weight: "79 kg",
    disease: "Cancer",
    age: "35 yrs",
    heartRate: "88 bpm",
    bloodType: "AB",
    status: "Outpatient"
  }
];

const DoctorRecentPatients: React.FC = () => {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Recent Patients</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-xs text-left text-gray-500">
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Gender</th>
                <th className="py-3 px-4 font-medium">Weight</th>
                <th className="py-3 px-4 font-medium">Disease</th>
                <th className="py-3 px-4 font-medium">Age</th>
                <th className="py-3 px-4 font-medium">Heart Rate</th>
                <th className="py-3 px-4 font-medium">Blood Type</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={patient.image} />
                        <AvatarFallback>{patient.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{patient.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{patient.gender}</td>
                  <td className="py-3 px-4 text-sm">{patient.weight}</td>
                  <td className="py-3 px-4 text-sm">{patient.disease}</td>
                  <td className="py-3 px-4 text-sm">{patient.age}</td>
                  <td className="py-3 px-4 text-sm">{patient.heartRate}</td>
                  <td className="py-3 px-4 text-sm">{patient.bloodType}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      patient.status === "Outpatient" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorRecentPatients;
