import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription  
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { MedicalRecord } from "../../pages/MedicalRecords";
import {
  CalendarRange,
  FileText,
  Building2,
  Pill,
  CreditCard,
  Phone,
  Video,
  MapPin,
  FileIcon,
  ClipboardList,
  FileImage,
  AlertCircle,
  ExternalLink as ExternalLinkIcon
} from "lucide-react";

interface MedicalRecordDetailProps {
  record: MedicalRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MedicalRecordDetail: React.FC<MedicalRecordDetailProps> = ({
  record,
  open,
  onOpenChange,
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not discharged";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="text-blue-600" size={16} />
            </div>
            {record.diagnosis}
            {record.urgencyLevel > 0 && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2">
                Emergency
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            Record ID: {record.id} • Created: {formatDate(record.date)}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="problems">Medical Problems</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <Building2 className="mr-2" size={16} />
                    Hospital Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Hospital</p>
                    <p className="text-sm text-gray-500">{record.hospital}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Appointment Type</p>
                    <p className="text-sm text-gray-500">{record.appointmentType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Consultation</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      {record.consultationType === "online" ? (
                        <>
                          <Video className="mr-1" size={14} />
                          Online Consultation
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-1" size={14} />
                          In-person Visit
                        </>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <CalendarRange className="mr-2" size={16} />
                    Visit Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Admission Date</p>
                    <p className="text-sm text-gray-500">{formatDate(record.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Discharge Date</p>
                    <p className="text-sm text-gray-500">{formatDate(record.dischargeDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Current Condition</p>
                    <p className="text-sm text-gray-500">{record.condition}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <CreditCard className="mr-2" size={16} />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Payment Type</p>
                      <p className="text-sm text-gray-500">{record.paymentType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Transaction Hash</p>
                      <p className="text-sm text-gray-500 font-mono break-all">{record.transactionHash}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">H-TPI Score</p>
                      <p className={`text-sm ${record.htpiScore >= 5 ? 'text-green-600' : record.htpiScore >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {record.htpiScore.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Record Hash</p>
                      <p className="text-sm text-gray-500 font-mono break-all">{record.recordHash}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <Pill className="mr-2" size={16} />
                  Prescribed Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Medication</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {record.prescribedMedications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-gray-500">No medications prescribed</TableCell>
                      </TableRow>
                    ) : (
                      record.prescribedMedications.map((medication, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{medication}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <AlertCircle className="mr-2" size={16} />
                  Patient and Doctor Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Patient</h4>
                    <p className="text-sm text-gray-700">{record.patientName}</p>
                    <p className="text-sm text-gray-500">ID: {record.patientId}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Doctor</h4>
                    <p className="text-sm text-gray-700">{record.doctorName}</p>
                    <p className="text-sm text-gray-500">ID: {record.doctorId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <FileImage className="mr-2" size={16} />
                  Attached Files
                </CardTitle>
                <CardDescription>All medical files attached to this record</CardDescription>
              </CardHeader>
              <CardContent>
                {record.attachedFiles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No files attached to this record
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {record.attachedFiles.map((file, index) => (
                      <div key={index} className="border rounded-md p-4 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          {file.type === 'xray' && <FileIcon className="text-blue-500" size={20} />}
                          {file.type === 'lab' && <ClipboardList className="text-green-500" size={20} />}
                          {file.type === 'prescription' && <FileText className="text-yellow-500" size={20} />}
                          {file.type === 'other' && <FileImage className="text-gray-500" size={20} />}
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                            {file.type}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-2">{file.name}</p>
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 text-xs flex items-center mt-auto"
                        >
                          View File <ExternalLinkIcon size={12} className="ml-1" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problems">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <ClipboardList className="mr-2" size={16} />
                  Medical Problems
                </CardTitle>
                <CardDescription>Issues reported during consultation</CardDescription>
              </CardHeader>
              <CardContent>
                {record.problems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No problems reported
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-2">
                    {record.problems.map((problem, index) => (
                      <li key={index} className="text-gray-700">{problem}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordDetail;
