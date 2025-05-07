import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, MessageSquare, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { mockPatients, getAllPatients } from "@/data/mockPatients";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DoctorPatientsList: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<
    (typeof mockPatients)[0] | null
  >(null);
  const [showMedicalRecord, setShowMedicalRecord] = useState(false);
  const [patients, setPatients] = useState(getAllPatients());

  // Update patients list whenever component mounts or re-renders
  useEffect(() => {
    // Function to refresh the patient list
    const refreshPatientList = () => {
      const latestPatients = getAllPatients();
      console.log("Latest patients in DoctorPatientsList:", latestPatients);

      // Check if any patient names have changed
      const hasNameChanges = latestPatients.some((patient, index) => {
        return patients[index]?.name !== patient.name;
      });

      // Update the patient list if there are changes
      if (hasNameChanges || latestPatients.length !== patients.length) {
        console.log("Patient list updated, refreshing...");
        setPatients(latestPatients);
      }
    };

    // Initial refresh
    refreshPatientList();

    // Set up an interval to refresh the patient list every 2 seconds
    // This ensures that new patients are displayed without requiring a page refresh
    const intervalId = setInterval(refreshPatientList, 2000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [patients]); // Add patients as a dependency to avoid ESLint warnings

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.medicalHistory.some((history) =>
        history.condition.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewMedicalRecord = (patient: (typeof mockPatients)[0]) => {
    setSelectedPatient(patient);
    setShowMedicalRecord(true);
  };

  const handleSendMessage = (patientId: string) => {
    navigate(`/chat?patientId=${patientId}`);
  };

  const getStatusBadge = (lastVisit: string) => {
    const lastVisitDate = new Date(lastVisit);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastVisitDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 30) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (diffDays <= 90) {
      return <Badge className="bg-blue-100 text-blue-800">Regular</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Patient Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search patients by name, condition or email..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Patient</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={patient.profileImage} />
                          <AvatarFallback>
                            {patient.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-xs text-gray-500">
                            {patient.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{calculateAge(patient.dateOfBirth)}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>
                      {patient.medicalHistory.length > 0
                        ? patient.medicalHistory[0].condition
                        : "No diagnosis"}
                    </TableCell>
                    <TableCell>
                      {new Date(patient.lastVisit || "").toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(patient.lastVisit || "")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewMedicalRecord(patient)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSendMessage(patient.id)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredPatients.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-gray-500">
                  No patients found matching "{searchTerm}"
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showMedicalRecord} onOpenChange={setShowMedicalRecord}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Medical Record - {selectedPatient?.name}</DialogTitle>
          </DialogHeader>

          {selectedPatient && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Date of Birth:</span>{" "}
                      {selectedPatient.dateOfBirth}
                    </p>
                    <p>
                      <span className="font-medium">Gender:</span>{" "}
                      {selectedPatient.gender}
                    </p>
                    <p>
                      <span className="font-medium">Blood Group:</span>{" "}
                      {selectedPatient.bloodGroup}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedPatient.phone}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {selectedPatient.address}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Emergency Contact</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedPatient.emergencyContact.name}
                    </p>
                    <p>
                      <span className="font-medium">Relationship:</span>{" "}
                      {selectedPatient.emergencyContact.relationship}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedPatient.emergencyContact.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Medical History</h3>
                <div className="space-y-4">
                  {selectedPatient.medicalHistory.map((history, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{history.condition}</p>
                      <p className="text-sm text-gray-600">
                        Diagnosed: {history.diagnosedDate}
                      </p>
                      {history.medications && (
                        <p className="text-sm">
                          Medications: {history.medications.join(", ")}
                        </p>
                      )}
                      {history.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          {history.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Allergies</h3>
                <div className="space-y-2">
                  {selectedPatient.allergies.length > 0 ? (
                    selectedPatient.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge
                          variant={
                            allergy.severity === "Severe"
                              ? "destructive"
                              : allergy.severity === "Moderate"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {allergy.severity}
                        </Badge>
                        <span>{allergy.allergen}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No known allergies</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Vital Signs</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <span className="font-medium">Height:</span>{" "}
                      {selectedPatient.height} cm
                    </p>
                    <p>
                      <span className="font-medium">Weight:</span>{" "}
                      {selectedPatient.weight} kg
                    </p>
                    <p>
                      <span className="font-medium">Recent BP:</span>{" "}
                      {selectedPatient.recentBloodPressure}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">Highest BP:</span>{" "}
                      {selectedPatient.highestBloodPressure}
                    </p>
                    <p>
                      <span className="font-medium">Lowest BP:</span>{" "}
                      {selectedPatient.lowestBloodPressure}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DoctorPatientsList;
