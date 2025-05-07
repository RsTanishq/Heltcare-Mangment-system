
import React, { useState } from "react";
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
  TableRow 
} from "@/components/ui/table";
import { 
  Search,
  Plus,
  Edit,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle
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

interface Medication {
  id: string;
  name: string;
  category: "Antibiotic" | "Pain Relief" | "Cardiac" | "Psychiatric" | "Other";
  dosage: string;
  frequency: string;
  status: "Active" | "Low Stock" | "Discontinued";
}

interface Patient {
  id: string;
  name: string;
  image?: string;
  medications: {
    medicationId: string;
    prescribed: string;
    notes: string;
  }[];
}

const DoctorMedications: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"medications" | "patients">("medications");
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isPrescribingOpen, setIsPrescribingOpen] = useState(false);
  
  // Sample medications data
  const [medications] = useState<Medication[]>([
    {
      id: "med1",
      name: "Amoxicillin",
      category: "Antibiotic",
      dosage: "500mg",
      frequency: "3 times daily",
      status: "Active"
    },
    {
      id: "med2",
      name: "Ibuprofen",
      category: "Pain Relief",
      dosage: "400mg",
      frequency: "As needed",
      status: "Active"
    },
    {
      id: "med3",
      name: "Lisinopril",
      category: "Cardiac",
      dosage: "10mg",
      frequency: "Once daily",
      status: "Low Stock"
    },
    {
      id: "med4",
      name: "Fluoxetine",
      category: "Psychiatric",
      dosage: "20mg",
      frequency: "Once daily",
      status: "Active"
    },
    {
      id: "med5",
      name: "Metformin",
      category: "Other",
      dosage: "500mg",
      frequency: "Twice daily",
      status: "Discontinued"
    }
  ]);
  
  // Sample patients data
  const [patients] = useState<Patient[]>([
    {
      id: "p1",
      name: "Sarah Johnson",
      image: "/placeholder.svg",
      medications: [
        {
          medicationId: "med2",
          prescribed: "2023-04-10",
          notes: "Take with food to avoid stomach upset. Continue for 7 days."
        },
        {
          medicationId: "med4",
          prescribed: "2023-04-10",
          notes: "Take in the morning. Follow up in 30 days to assess effectiveness."
        }
      ]
    },
    {
      id: "p2",
      name: "Robert Brown",
      image: "/placeholder.svg",
      medications: [
        {
          medicationId: "med3",
          prescribed: "2023-04-05",
          notes: "Monitor blood pressure regularly."
        }
      ]
    },
    {
      id: "p3",
      name: "Emily Davis",
      image: "/placeholder.svg",
      medications: [
        {
          medicationId: "med1",
          prescribed: "2023-04-15",
          notes: "Complete full course. Report any adverse reactions immediately."
        }
      ]
    }
  ]);
  
  // Filter medications based on search term
  const filteredMedications = medications.filter(
    (medication) =>
      medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get medication name by ID
  const getMedicationName = (id: string) => {
    const medication = medications.find(med => med.id === id);
    return medication ? medication.name : "Unknown Medication";
  };
  
  const getStatusBadge = (status: Medication['status']) => {
    switch (status) {
      case 'Active':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Active
          </Badge>
        );
      case 'Low Stock':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Low Stock
          </Badge>
        );
      case 'Discontinued':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Discontinued
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const handlePrescribe = () => {
    toast({
      title: "Prescription Added",
      description: "The medication has been prescribed successfully.",
    });
    setIsPrescribingOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center">
          <div className="flex-grow">
            <CardTitle className="text-base font-medium">Medications Management</CardTitle>
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
                <Button className="bg-indigo-600 hover:bg-indigo-700">
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
                        <TableCell className="font-medium">{medication.name}</TableCell>
                        <TableCell>{medication.category}</TableCell>
                        <TableCell>{medication.dosage}</TableCell>
                        <TableCell>{medication.frequency}</TableCell>
                        <TableCell>{getStatusBadge(medication.status)}</TableCell>
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
                    <p className="text-gray-500">No medications found matching "{searchTerm}"</p>
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
                      <AvatarImage src={patient.image} />
                      <AvatarFallback>{patient.name.substring(0, 2)}</AvatarFallback>
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
                          <h4 className="font-medium">{getMedicationName(med.medicationId)}</h4>
                          <p className="text-xs text-gray-500">
                            Prescribed: {new Date(med.prescribed).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{med.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
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
                <Input id="duration" type="number" placeholder="Duration" className="flex-grow" />
                <select
                  className="w-1/3 rounded-md border border-input bg-background px-3 py-2 text-sm"
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
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPrescribingOpen(false)}>Cancel</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handlePrescribe}>
              Confirm Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorMedications;
