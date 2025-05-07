import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const PatientMedicalRecords = () => {
  // This is a placeholder. You'll want to fetch real records from your blockchain
  const records = [
    {
      id: 1,
      doctorName: "Dr. Smith",
      date: "2024-03-15",
      type: "General Checkup",
      ipfsHash: ""
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Medical Records</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {records.length > 0 ? (
          <div className="space-y-4">
            {records.map((record) => (
              <div 
                key={record.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{record.type}</p>
                  <p className="text-sm text-gray-500">
                    By {record.doctorName} on {record.date}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Record
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No medical records found
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientMedicalRecords; 