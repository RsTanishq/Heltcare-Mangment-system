import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  FileText, 
  FilePlus, 
  Folder, 
  Star, 
  Download, 
  Share2, 
  MoreHorizontal,
  Image,
  FileSpreadsheet,
  Mail,
  ChevronLeft
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Document {
  id: string;
  name: string;
  type: "file" | "folder" | "email";
  format?: "pdf" | "image" | "spreadsheet" | "document" | "email";
  size?: string;
  lastModified: string;
  from?: string;
  subject?: string;
  starred: boolean;
  path: string[];
  content?: string;
  patientId?: string;
}

const DoctorDocuments: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Sample documents data with nested structure
  const [documents] = useState<Document[]>([
    {
      id: "patients",
      name: "Patients",
      type: "folder",
      lastModified: "2023-04-15",
      starred: true,
      path: []
    },
    {
      id: "research",
      name: "Research Papers",
      type: "folder",
      lastModified: "2023-04-10",
      starred: false,
      path: []
    },
    {
      id: "conference",
      name: "Medical Conference",
      type: "folder",
      lastModified: "2023-03-22",
      starred: false,
      path: []
    },
    // Patient Records
    {
      id: "patient1",
      name: "Rajesh Kumar",
      type: "folder",
      lastModified: "2023-04-12",
      starred: true,
      path: ["patients"],
      patientId: "P001"
    },
    {
      id: "patient2",
      name: "Priya Sharma",
      type: "folder",
      lastModified: "2023-04-10",
      starred: false,
      path: ["patients"],
      patientId: "P002"
    },
    {
      id: "patient3",
      name: "Amit Patel",
      type: "folder",
      lastModified: "2023-04-08",
      starred: false,
      path: ["patients"],
      patientId: "P003"
    },
    // Patient 1 Documents
    {
      id: "p1_mri",
      name: "MRI Scan Results",
      type: "file",
      format: "image",
      size: "8.7 MB",
      lastModified: "2023-04-08",
      starred: false,
      path: ["patients", "patient1"],
      content: "/public/patients/p1_mri.jpg"
    },
    {
      id: "p1_lab",
      name: "Lab Test Results",
      type: "file",
      format: "pdf",
      size: "2.1 MB",
      lastModified: "2023-04-05",
      starred: true,
      path: ["patients", "patient1"],
      content: "/public/patients/p1_lab.pdf"
    },
    {
      id: "p1_prescription",
      name: "Prescription",
      type: "file",
      format: "document",
      size: "215 KB",
      lastModified: "2023-04-03",
      starred: false,
      path: ["patients", "patient1"],
      content: "/public/patients/p1_prescription.docx"
    },
    // Patient 2 Documents
    {
      id: "p2_xray",
      name: "X-Ray Results",
      type: "file",
      format: "image",
      size: "5.2 MB",
      lastModified: "2023-04-09",
      starred: false,
      path: ["patients", "patient2"],
      content: "/public/patients/p2_xray.jpg"
    },
    {
      id: "p2_ecg",
      name: "ECG Report",
      type: "file",
      format: "pdf",
      size: "1.8 MB",
      lastModified: "2023-04-07",
      starred: true,
      path: ["patients", "patient2"],
      content: "/public/patients/p2_ecg.pdf"
    },
    // Research Papers
    {
      id: "research1",
      name: "Cardiology Study 2023",
      type: "file",
      format: "pdf",
      size: "4.2 MB",
      lastModified: "2023-04-12",
      starred: true,
      path: ["research"],
      content: "/public/research/cardiology_study.pdf"
    },
    {
      id: "research2",
      name: "Clinical Trials Data",
      type: "file",
      format: "spreadsheet",
      size: "1.8 MB",
      lastModified: "2023-03-30",
      starred: false,
      path: ["research"],
      content: "/public/research/trials_data.xlsx"
    },
    // Conference Materials
    {
      id: "conf1",
      name: "Presentation Slides",
      type: "file",
      format: "document",
      size: "3.5 MB",
      lastModified: "2023-03-20",
      starred: false,
      path: ["conference"],
      content: "/public/conference/presentation.pptx"
    },
    {
      id: "conf2",
      name: "Conference Schedule",
      type: "file",
      format: "document",
      size: "512 KB",
      lastModified: "2023-03-18",
      starred: true,
      path: ["conference"],
      content: "/public/conference/schedule.docx"
    },
    // Emails
    {
      id: "email1",
      name: "Conference Registration",
      type: "email",
      format: "email",
      from: "conferences@medicalsociety.org",
      subject: "Your registration for Annual Medical Conference",
      lastModified: "2023-04-14",
      starred: false,
      path: []
    },
    {
      id: "email2",
      name: "Lab Results",
      type: "email",
      format: "email",
      from: "lab@cityhospital.org",
      subject: "Lab results for patient #12345",
      lastModified: "2023-04-13",
      starred: true,
      path: []
    }
  ]);
  
  // Filter documents based on search term and current path
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      JSON.stringify(doc.path) === JSON.stringify(currentPath)
  );
  
  const getDocumentIcon = (doc: Document) => {
    if (doc.type === "folder") return <Folder className="h-10 w-10 text-indigo-600" />;
    
    switch (doc.format) {
      case "pdf":
        return <FileText className="h-10 w-10 text-red-500" />;
      case "image":
        return <Image className="h-10 w-10 text-green-500" />;
      case "spreadsheet":
        return <FileSpreadsheet className="h-10 w-10 text-emerald-500" />;
      case "email":
        return <Mail className="h-10 w-10 text-blue-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };
  
  const handleDocumentClick = (doc: Document) => {
    if (doc.type === "folder") {
      setCurrentPath([...currentPath, doc.id]);
      toast({
        title: "Opening Folder",
        description: `Opening ${doc.name} folder`,
      });
    } else if (doc.type === "email") {
      toast({
        title: "Opening Email",
        description: `Opening email: ${doc.subject}`,
      });
    } else {
      toast({
        title: "Opening Document",
        description: `Opening ${doc.name}`,
      });
    }
  };

  const handleBackClick = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const toggleStar = (id: string) => {
    // In a real app, this would update the database
    toast({
      title: "Starred Status Changed",
      description: "Document star status has been updated.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentPath.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackClick}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <CardTitle className="text-base font-medium">
              {currentPath.length > 0 ? currentPath[currentPath.length - 1] : "Documents & Email"}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPath([])}>
              All Files
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-indigo-50"
            >
              <Star className="h-4 w-4 mr-2" /> Starred
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search documents and emails..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <FilePlus className="h-4 w-4 mr-2" /> Upload
          </Button>
        </div>
        
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDocuments.map((doc) => (
              <div 
                key={doc.id}
                className="bg-white border rounded-md p-3 flex flex-col hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleDocumentClick(doc)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-shrink-0">
                    {getDocumentIcon(doc)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(doc.id);
                    }}
                  >
                    <Star className={`h-4 w-4 ${doc.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </Button>
                </div>
                
                <h3 className="font-medium truncate mb-1" title={doc.name}>{doc.name}</h3>
                
                {doc.type === "email" && (
                  <p className="text-xs text-gray-500 truncate mb-1" title={doc.from}>
                    From: {doc.from}
                  </p>
                )}
                
                <div className="flex justify-between mt-auto pt-2">
                  <p className="text-xs text-gray-500">
                    {doc.type === "email" ? (
                      "Email"
                    ) : doc.type === "folder" ? (
                      "Folder"
                    ) : (
                      doc.size
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(doc.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <table className="w-full">
              <thead className="bg-gray-50 text-sm">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Size</th>
                  <th className="text-left p-3 font-medium">Modified</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDocuments.map((doc) => (
                  <tr 
                    key={doc.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleDocumentClick(doc)}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {getDocumentIcon(doc)}
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          {doc.type === "email" && (
                            <p className="text-xs text-gray-500">{doc.subject}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">
                        {doc.type === "email" ? "Email" : doc.type === "folder" ? "Folder" : doc.format}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className="text-gray-500">{doc.size || "-"}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-gray-500">{new Date(doc.lastModified).toLocaleDateString()}</span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(doc.id);
                          }}
                        >
                          <Star className={`h-4 w-4 ${doc.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Download className="h-4 w-4" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Share2 className="h-4 w-4" /> Share
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredDocuments.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-gray-500">No documents found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorDocuments;
