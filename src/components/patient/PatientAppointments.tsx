import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import useAppointmentStore from "@/store/appointmentStore";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import HTPIScoreDisplay from "@/components/algorithms/HTPIScoreDisplay";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card as UICard,
  CardHeader as UICardHeader,
  CardTitle as UICardTitle,
  CardContent as UICardContent,
} from "@/components/ui/card";
import { CreditCard, UploadCloud } from "lucide-react";

const PatientAppointments = () => {
  const { currentUser } = useAuth();
  const { getPatientAppointments } = useAppointmentStore();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    console.log("Current User:", currentUser);
    console.log("User ID:", currentUser?.data?.id);
  }, [currentUser]);

  // Get appointments for current user
  const appointments = currentUser?.data?.id
    ? getPatientAppointments(currentUser.data.id)
    : [];

  useEffect(() => {
    console.log("All Appointments:", appointments);
  }, [appointments]);

  // Filter only upcoming and pending appointments
  const upcomingAppointments = appointments.filter(
    (app) => app.status === "accepted" || app.status === "pending"
  );

  useEffect(() => {
    console.log("Filtered Appointments:", upcomingAppointments);
  }, [upcomingAppointments]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          Upcoming Appointments
        </CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    Dr. {appointment.doctorName || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appointment.date} at {appointment.time}
                  </p>
                  <p className="text-xs text-gray-500">
                    {appointment.condition}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setIsDialogOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                  {appointment.status === "pending" && (
                    <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                      Awaiting Confirmation
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No upcoming appointments
          </p>
        )}
      </CardContent>

      {/* Appointment Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-2xl font-bold">
              Appointment Details
            </DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6 flex flex-wrap gap-2 bg-gray-50 p-3 rounded-md">
                <TabsTrigger value="overview" className="text-base">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="mode" className="text-base">
                  Payment Details
                </TabsTrigger>
                <TabsTrigger value="files" className="text-base">
                  Medical Records
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <UICard className="shadow-sm">
                    <UICardHeader className="bg-gray-50 rounded-t-lg">
                      <UICardTitle className="flex items-center gap-2 text-lg">
                        <CreditCard className="mr-2" size={20} /> Payment
                        Information
                      </UICardTitle>
                    </UICardHeader>
                    <UICardContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                        <span className="font-medium text-gray-600">
                          Amount:
                        </span>
                        <span>
                          ₹
                          {selectedAppointment.amount?.toLocaleString(
                            "en-IN"
                          ) || "0"}
                        </span>
                      </div>
                      <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                        <span className="font-medium text-gray-600">
                          Payment Type:
                        </span>
                        <span>{selectedAppointment.paymentType || "-"}</span>
                      </div>
                      <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                        <span className="font-medium text-gray-600">
                          Status:
                        </span>
                        <span
                          className={
                            selectedAppointment.paymentStatus === "completed"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }
                        >
                          {selectedAppointment.paymentStatus || "Pending"}
                        </span>
                      </div>
                      {selectedAppointment.transactionHash && (
                        <div className="mt-2 space-y-1">
                          <span className="font-medium text-gray-600">
                            Transaction Hash:
                          </span>
                          <div className="font-mono text-xs break-all bg-gray-50 p-2 rounded-md">
                            {selectedAppointment.transactionHash}
                          </div>
                        </div>
                      )}
                    </UICardContent>
                  </UICard>

                  <UICard className="shadow-sm">
                    <UICardHeader className="bg-gray-50 rounded-t-lg">
                      <UICardTitle className="text-lg">
                        Appointment Info
                      </UICardTitle>
                    </UICardHeader>
                    <UICardContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                        <span className="font-medium text-gray-600">
                          Doctor:
                        </span>
                        <span>
                          Dr. {selectedAppointment.doctorName || "Unknown"}
                        </span>
                      </div>
                      <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                        <span className="font-medium text-gray-600">
                          Date & Time:
                        </span>
                        <span>
                          {selectedAppointment.date} at{" "}
                          {selectedAppointment.time}
                        </span>
                      </div>
                      <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                        <span className="font-medium text-gray-600">
                          Condition:
                        </span>
                        <span>{selectedAppointment.condition}</span>
                      </div>
                      {selectedAppointment.urgency && (
                        <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                          <span className="font-medium text-gray-600">
                            Urgency:
                          </span>
                          <span
                            className={`capitalize ${
                              selectedAppointment.urgency === "high"
                                ? "text-red-600"
                                : selectedAppointment.urgency === "medium"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {selectedAppointment.urgency}
                          </span>
                        </div>
                      )}
                      {selectedAppointment.visitMode && (
                        <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                          <span className="font-medium text-gray-600">
                            Visit Mode:
                          </span>
                          <span className="capitalize">
                            {selectedAppointment.visitMode}
                          </span>
                        </div>
                      )}
                      {selectedAppointment.symptoms && (
                        <div className="mt-2 space-y-1">
                          <span className="font-medium text-gray-600">
                            Symptoms:
                          </span>
                          <p className="text-sm bg-gray-50 p-2 rounded-md">
                            {selectedAppointment.symptoms}
                          </p>
                        </div>
                      )}
                    </UICardContent>
                  </UICard>
                </div>

                {selectedAppointment.htpiScore !== undefined && (
                  <UICard className="mb-6 shadow-sm">
                    <UICardHeader className="bg-gray-50 rounded-t-lg">
                      <UICardTitle className="text-lg">
                        HTPI Score Analysis
                      </UICardTitle>
                    </UICardHeader>
                    <UICardContent className="pt-4">
                      <HTPIScoreDisplay score={selectedAppointment.htpiScore} />
                    </UICardContent>
                  </UICard>
                )}
              </TabsContent>

              <TabsContent value="mode">
                <UICard className="shadow-sm">
                  <UICardHeader className="bg-gray-50 rounded-t-lg">
                    <UICardTitle className="flex items-center gap-2 text-lg">
                      <CreditCard className="mr-2" size={20} /> Payment Details
                    </UICardTitle>
                  </UICardHeader>
                  <UICardContent className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-600">
                          Payment Method
                        </h4>
                        <p className="bg-gray-50 p-2 rounded-md">
                          {selectedAppointment.paymentType || "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-600">Amount</h4>
                        <p className="bg-gray-50 p-2 rounded-md">
                          ₹
                          {selectedAppointment.amount?.toLocaleString(
                            "en-IN"
                          ) || "0"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-600">
                          Payment Status
                        </h4>
                        <p
                          className={`bg-gray-50 p-2 rounded-md ${
                            selectedAppointment.paymentStatus === "completed"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {selectedAppointment.paymentStatus || "Pending"}
                        </p>
                      </div>
                    </div>
                    {selectedAppointment.transactionHash && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-600">
                          Transaction Details
                        </h4>
                        <div className="font-mono text-xs break-all bg-gray-50 p-3 rounded-md border">
                          {selectedAppointment.transactionHash}
                        </div>
                      </div>
                    )}
                  </UICardContent>
                </UICard>
              </TabsContent>

              <TabsContent value="files">
                <UICard className="shadow-sm">
                  <UICardHeader className="bg-gray-50 rounded-t-lg">
                    <UICardTitle className="flex items-center gap-2 text-lg">
                      <UploadCloud className="mr-2" size={20} /> Medical Records
                    </UICardTitle>
                  </UICardHeader>
                  <UICardContent className="pt-4">
                    <FileUploadSection appointmentId={selectedAppointment.id} />
                  </UICardContent>
                </UICard>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter className="border-t pt-4 mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// File upload section for IPFS (Piñata)
function FileUploadSection({ appointmentId }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    // TODO: Integrate with Piñata/IPFS upload API here
    // Simulate upload and IPFS hash
    setTimeout(() => {
      const fakeHash = `QmFakeHash${Math.random().toString(36).substr(2, 8)}`;
      setUploadedFiles((prev) => [
        ...prev,
        { name: file.name, hash: fakeHash },
      ]);
      setUploading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-600">
            Upload Medical Record
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        {uploading && (
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-blue-600"></div>
            <span>Uploading to IPFS...</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-600">Uploaded Records</h3>
        {uploadedFiles.length === 0 ? (
          <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md text-center">
            No medical records uploaded yet
          </div>
        ) : (
          <div className="space-y-2">
            {uploadedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-green-700 bg-green-50 px-2 py-1 rounded">
                    {file.hash}
                  </span>
                  <Button variant="outline" size="sm" className="h-8">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientAppointments;
