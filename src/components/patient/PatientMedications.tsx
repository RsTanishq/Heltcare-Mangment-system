import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  Pill,
  Calendar,
  Info
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Medication {
  id: string;
  name: string;
  category: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  prescribedBy: string;
  instructions: string;
  status: "Active" | "Completed" | "Upcoming";
}

const PatientMedications: React.FC = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Default medications data
  const defaultMedications: Medication[] = [
    {
      id: "med1",
      name: "Amoxicillin",
      category: "Antibiotic",
      dosage: "500mg",
      frequency: "3 times daily",
      startDate: "2023-04-10",
      endDate: "2023-04-17",
      prescribedBy: "Dr. Sarah Johnson",
      instructions: "Take with food to avoid stomach upset. Complete full course even if symptoms improve.",
      status: "Completed"
    },
    {
      id: "med2",
      name: "Ibuprofen",
      category: "Pain Relief",
      dosage: "400mg",
      frequency: "As needed",
      startDate: "2023-04-15",
      endDate: "2023-05-15",
      prescribedBy: "Dr. Michael Chen",
      instructions: "Take for pain relief. Do not exceed 3 tablets in 24 hours.",
      status: "Active"
    },
    {
      id: "med3",
      name: "Lisinopril",
      category: "Cardiac",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: "2023-04-20",
      endDate: "2023-10-20",
      prescribedBy: "Dr. Emily Davis",
      instructions: "Take in the morning. Monitor blood pressure regularly.",
      status: "Active"
    },
    {
      id: "med4",
      name: "Vitamin D3",
      category: "Supplement",
      dosage: "1000 IU",
      frequency: "Once daily",
      startDate: "2023-05-01",
      endDate: "2023-11-01",
      prescribedBy: "Dr. Robert Brown",
      instructions: "Take with a meal for better absorption.",
      status: "Upcoming"
    }
  ];
  
  // Initialize medications from localStorage or use default
  const [medications, setMedications] = useState<Medication[]>(() => {
    // Try to get medications from localStorage
    const savedMedications = localStorage.getItem('patientMedications');
    if (savedMedications) {
      try {
        return JSON.parse(savedMedications);
      } catch (error) {
        console.error('Error parsing saved medications:', error);
        return defaultMedications;
      }
    }
    return defaultMedications;
  });
  
  // Save medications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('patientMedications', JSON.stringify(medications));
  }, [medications]);
  
  // Filter medications based on search term
  const filteredMedications = medications.filter(
    (medication) =>
      medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: Medication['status']) => {
    switch (status) {
      case 'Active':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Active
          </Badge>
        );
      case 'Upcoming':
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Upcoming
          </Badge>
        );
      case 'Completed':
        return (
          <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Completed
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const handleViewDetails = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsDetailsOpen(true);
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center">
        <div className="flex-grow">
          <CardTitle className="text-base font-medium">My Medications</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
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
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Prescribed By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedications.map((medication) => (
                <TableRow key={medication.id}>
                  <TableCell className="font-medium">{medication.name}</TableCell>
                  <TableCell>{medication.dosage}</TableCell>
                  <TableCell>{medication.frequency}</TableCell>
                  <TableCell>{medication.prescribedBy}</TableCell>
                  <TableCell>{getStatusBadge(medication.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(medication)}
                    >
                      View Details
                    </Button>
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
      </CardContent>
      
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Medication Details</DialogTitle>
          </DialogHeader>
          {selectedMedication && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-medium">{selectedMedication.name}</h3>
                {getStatusBadge(selectedMedication.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{selectedMedication.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dosage</p>
                  <p className="font-medium">{selectedMedication.dosage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Frequency</p>
                  <p className="font-medium">{selectedMedication.frequency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prescribed By</p>
                  <p className="font-medium">{selectedMedication.prescribedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{new Date(selectedMedication.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium">{new Date(selectedMedication.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Instructions</p>
                <div className="p-3 bg-gray-50 rounded-md mt-1">
                  <p className="text-sm">{selectedMedication.instructions}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md text-blue-800">
                <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  Always follow your doctor's instructions. Contact your healthcare provider if you experience any side effects.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PatientMedications;
