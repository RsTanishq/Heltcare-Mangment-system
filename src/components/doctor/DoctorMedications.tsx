import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Edit,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockPatients } from "@/data/mockPatients";

interface Medication {
  id: string;
  name: string;
  category: "Antibiotic" | "Pain Relief" | "Cardiac" | "Psychiatric" | "Other";
  dosage: string;
  frequency: string;
  status: "Active" | "Low Stock" | "Discontinued";
}

// Define a simplified patient interface for medications
interface Patient {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  medications: {
    medicationId: string;
    prescribed: string;
    notes: string;
  }[];
}

const DoctorMedications: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"medications" | "patients">(
    "medications"
  );
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [isPrescribingOpen, setIsPrescribingOpen] = useState(false);
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);
  const [newMedication, setNewMedication] = useState<{
    name: string;
    category:
      | "Antibiotic"
      | "Pain Relief"
      | "Cardiac"
      | "Psychiatric"
      | "Other";
    dosage: string;
    frequency: string;
    status: "Active" | "Low Stock" | "Discontinued";
  }>({
    name: "",
    category: "Other",
    dosage: "",
    frequency: "",
    status: "Active",
  });

  // Default medications data
  const defaultMedications: Medication[] = [
    {
      id: "med1",
      name: "Amoxicillin",
      category: "Antibiotic",
      dosage: "500mg",
      frequency: "3 times daily",
      status: "Active",
    },
    {
      id: "med2",
      name: "Ibuprofen",
      category: "Pain Relief",
      dosage: "400mg",
      frequency: "As needed",
      status: "Active",
    },
    {
      id: "med3",
      name: "Lisinopril",
      category: "Cardiac",
      dosage: "10mg",
      frequency: "Once daily",
      status: "Low Stock",
    },
    {
      id: "med4",
      name: "Fluoxetine",
      category: "Psychiatric",
      dosage: "20mg",
      frequency: "Once daily",
      status: "Active",
    },
    {
      id: "med5",
      name: "Metformin",
      category: "Other",
      dosage: "500mg",
      frequency: "Twice daily",
      status: "Discontinued",
    },
  ];

  // Initialize medications from localStorage or use default
  const [medications, setMedications] = useState<Medication[]>(() => {
    // Force refresh with the latest medications data
    localStorage.removeItem("doctorMedications");
    return defaultMedications;
  });

  // Create medication data for each patient from mockPatients
  const defaultPatients: Patient[] = mockPatients.map((patient) => {
    // Create medication data based on patient's medical conditions
    const patientMedications = [];

    // Add medications based on patient's medical history
    if (patient.medicalHistory && patient.medicalHistory.length > 0) {
      patient.medicalHistory.forEach((condition) => {
        // Map condition to a medication ID
        let medicationId = "med1"; // Default to Amoxicillin

        if (condition.condition.toLowerCase().includes("diabetes")) {
          medicationId = "med5"; // Metformin
        } else if (condition.condition.toLowerCase().includes("hypertension")) {
          medicationId = "med3"; // Lisinopril
        } else if (condition.condition.toLowerCase().includes("pain")) {
          medicationId = "med2"; // Ibuprofen
        } else if (condition.condition.toLowerCase().includes("migraine")) {
          medicationId = "med2"; // Ibuprofen
        } else if (condition.condition.toLowerCase().includes("asthma")) {
          medicationId = "med1"; // Amoxicillin (not ideal but for demo)
        }

        patientMedications.push({
          medicationId,
          prescribed:
            patient.lastVisit || new Date().toISOString().split("T")[0],
          notes:
            condition.notes ||
            `Take as prescribed for ${condition.condition}. Follow up in 30 days.`,
        });
      });
    }

    // If no medications were added, add a default one
    if (patientMedications.length === 0) {
      patientMedications.push({
        medicationId: "med1",
        prescribed: patient.lastVisit || new Date().toISOString().split("T")[0],
        notes: "General prescription. Take as directed.",
      });
    }

    return {
      id: patient.id,
      name: patient.name,
      email: patient.email,
      profileImage: patient.profileImage || "/placeholder.svg",
      medications: patientMedications,
    };
  });

  // Initialize patients from localStorage or use default
  const [patients, setPatients] = useState<Patient[]>(() => {
    // Try to get patients from localStorage first
    try {
      const savedPatients = localStorage.getItem("savedPatients");
      if (savedPatients) {
        // If we have saved patients, use them to create medication data
        const parsedPatients = JSON.parse(savedPatients);
        console.log(
          `Using ${parsedPatients.length} patients from localStorage for medications`
        );

        // Map the saved patients to the simplified Patient interface for medications
        return parsedPatients.map((patient: any) => {
          // Create medication data based on patient's medical conditions
          const patientMedications = [];

          // Add medications based on patient's medical history
          if (patient.medicalHistory && patient.medicalHistory.length > 0) {
            patient.medicalHistory.forEach((condition: any) => {
              // Map condition to a medication ID (same logic as in defaultPatients)
              let medicationId = "med1"; // Default to Amoxicillin

              if (condition.condition.toLowerCase().includes("diabetes")) {
                medicationId = "med5"; // Metformin
              } else if (
                condition.condition.toLowerCase().includes("hypertension")
              ) {
                medicationId = "med3"; // Lisinopril
              } else if (condition.condition.toLowerCase().includes("pain")) {
                medicationId = "med2"; // Ibuprofen
              } else if (
                condition.condition.toLowerCase().includes("migraine")
              ) {
                medicationId = "med2"; // Ibuprofen
              } else if (condition.condition.toLowerCase().includes("asthma")) {
                medicationId = "med1"; // Amoxicillin (not ideal but for demo)
              }

              patientMedications.push({
                medicationId,
                prescribed:
                  patient.lastVisit || new Date().toISOString().split("T")[0],
                notes:
                  condition.notes ||
                  `Take as prescribed for ${condition.condition}. Follow up in 30 days.`,
              });
            });
          }

          // If no medications were added, add a default one
          if (patientMedications.length === 0) {
            patientMedications.push({
              medicationId: "med1",
              prescribed:
                patient.lastVisit || new Date().toISOString().split("T")[0],
              notes: "General prescription. Take as directed.",
            });
          }

          return {
            id: patient.id,
            name: patient.name,
            email: patient.email,
            profileImage: patient.profileImage || "/placeholder.svg",
            medications: patientMedications,
          };
        });
      }
    } catch (error) {
      console.error("Error loading patients for medications:", error);
    }

    // If no saved patients or error, use default patients
    console.log("Using default patients for medications");
    return defaultPatients;
  });

  // Save medications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("doctorMedications", JSON.stringify(medications));
  }, [medications]);

  // Save patients to localStorage whenever they change
  useEffect(() => {
    // We now use the 'savedPatients' key for consistency across the application
    localStorage.setItem("savedPatients", JSON.stringify(patients));
    console.log(
      `Saved ${patients.length} patients from medications component to localStorage`
    );
  }, [patients]);

  // Filter medications based on search term
  const filteredMedications = medications.filter(
    (medication) =>
      medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get medication name by ID
  const getMedicationName = (id: string) => {
    const medication = medications.find((med) => med.id === id);
    return medication ? medication.name : "Unknown Medication";
  };

  const getStatusBadge = (status: Medication["status"]) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Active
          </Badge>
        );
      case "Low Stock":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Low Stock
          </Badge>
        );
      case "Discontinued":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Discontinued
          </Badge>
        );
      default:
        return null;
    }
  };

  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [prescriptionDuration, setPrescriptionDuration] = useState<number>(0);
  const [prescriptionDurationType, setPrescriptionDurationType] =
    useState<string>("days");
  const [prescriptionNotes, setPrescriptionNotes] = useState<string>("");

  const handleAddMedication = () => {
    if (
      !newMedication.name ||
      !newMedication.dosage ||
      !newMedication.frequency
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create a new medication with a unique ID
    const newMedicationWithId: Medication = {
      id: `med${medications.length + 1}`,
      ...newMedication,
    };

    // Add to medications list
    const updatedMedications = [...medications, newMedicationWithId];
    setMedications(updatedMedications);

    toast({
      title: "Medication Added",
      description: "The medication has been added successfully.",
    });

    // Reset form
    setNewMedication({
      name: "",
      category: "Other",
      dosage: "",
      frequency: "",
      status: "Active",
    });
    setIsAddMedicationOpen(false);
  };

  const handlePrescribe = () => {
    if (!selectedMedication || !selectedPatient || prescriptionDuration <= 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Find the patient to update
    const updatedPatients = patients.map((patient) => {
      if (patient.id === selectedPatient) {
        // Create a new medication entry
        const newMedicationEntry = {
          medicationId: selectedMedication.id,
          prescribed: new Date().toISOString().split("T")[0], // Today's date
          notes: prescriptionNotes,
        };

        // Add to patient's medications
        return {
          ...patient,
          medications: [...patient.medications, newMedicationEntry],
        };
      }
      return patient;
    });

    // Update patients state
    setPatients(updatedPatients);

    // Save to localStorage
    localStorage.setItem("doctorPatients", JSON.stringify(updatedPatients));

    toast({
      title: "Prescription Added",
      description: "The medication has been prescribed successfully.",
    });

    // Reset form
    setSelectedPatient("");
    setPrescriptionDuration(0);
    setPrescriptionDurationType("days");
    setPrescriptionNotes("");
    setIsPrescribingOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center">
          <div className="flex-grow">
            <CardTitle className="text-base font-medium">
              Medications Management
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={activeTab === "medications" ? "bg-indigo-50" : ""}
              onClick={() => setActiveTab("medications")}
            >
              Medications
            </Button>
            <Button
              variant="outline"
              className={activeTab === "patients" ? "bg-indigo-50" : ""}
              onClick={() => setActiveTab("patients")}
            >
              Patient Prescriptions
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "medications" ? (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search medications..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setIsAddMedicationOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Medication
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedications.map((medication) => (
                      <TableRow key={medication.id}>
                        <TableCell className="font-medium">
                          {medication.name}
                        </TableCell>
                        <TableCell>{medication.category}</TableCell>
                        <TableCell>{medication.dosage}</TableCell>
                        <TableCell>{medication.frequency}</TableCell>
                        <TableCell>
                          {getStatusBadge(medication.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedMedication(medication);
                                setIsPrescribingOpen(true);
                              }}
                            >
                              Prescribe
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredMedications.length === 0 && (
                  <div className="py-10 text-center">
                    <p className="text-gray-500">
                      No medications found matching "{searchTerm}"
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {patients.map((patient) => (
                <div key={patient.id} className="rounded-md border p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={patient.profileImage} />
                      <AvatarFallback>
                        {patient.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{patient.name}</h3>
                      <p className="text-xs text-gray-500">
                        {patient.medications.length} active medications
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {patient.medications.map((med, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between">
                          <h4 className="font-medium">
                            {getMedicationName(med.medicationId)}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Prescribed:{" "}
                            {new Date(med.prescribed).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                          {med.notes}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prescribe Medication Dialog */}
      <Dialog open={isPrescribingOpen} onOpenChange={setIsPrescribingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prescribe Medication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Medication</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{selectedMedication?.name}</p>
                <div className="flex flex-wrap text-xs text-gray-500 gap-x-4 mt-1">
                  <p>Dosage: {selectedMedication?.dosage}</p>
                  <p>Frequency: {selectedMedication?.frequency}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient">Select Patient</Label>
              <select
                id="patient"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <div className="flex gap-2">
                <Input
                  id="duration"
                  type="number"
                  placeholder="Duration"
                  className="flex-grow"
                  value={prescriptionDuration || ""}
                  onChange={(e) =>
                    setPrescriptionDuration(parseInt(e.target.value) || 0)
                  }
                />
                <select
                  className="w-1/3 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={prescriptionDurationType}
                  onChange={(e) => setPrescriptionDurationType(e.target.value)}
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes & Instructions</Label>
              <Textarea
                id="notes"
                placeholder="Enter prescription notes and instructions for the patient..."
                className="min-h-[100px]"
                value={prescriptionNotes}
                onChange={(e) => setPrescriptionNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPrescribingOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handlePrescribe}
            >
              Confirm Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Medication Dialog */}
      <Dialog open={isAddMedicationOpen} onOpenChange={setIsAddMedicationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Medication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="med-name">Medication Name</Label>
              <Input
                id="med-name"
                placeholder="Enter medication name"
                value={newMedication.name}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="med-category">Category</Label>
              <select
                id="med-category"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={newMedication.category}
                onChange={(e) =>
                  setNewMedication({
                    ...newMedication,
                    category: e.target.value as
                      | "Antibiotic"
                      | "Pain Relief"
                      | "Cardiac"
                      | "Psychiatric"
                      | "Other",
                  })
                }
              >
                <option value="Antibiotic">Antibiotic</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Cardiac">Cardiac</option>
                <option value="Psychiatric">Psychiatric</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="med-dosage">Dosage</Label>
              <Input
                id="med-dosage"
                placeholder="e.g., 500mg"
                value={newMedication.dosage}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, dosage: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="med-frequency">Frequency</Label>
              <Input
                id="med-frequency"
                placeholder="e.g., Once daily"
                value={newMedication.frequency}
                onChange={(e) =>
                  setNewMedication({
                    ...newMedication,
                    frequency: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="med-status">Status</Label>
              <select
                id="med-status"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={newMedication.status}
                onChange={(e) =>
                  setNewMedication({
                    ...newMedication,
                    status: e.target.value as
                      | "Active"
                      | "Low Stock"
                      | "Discontinued",
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddMedicationOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleAddMedication}
            >
              Add Medication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorMedications;
