import React, { useState, useRef, useEffect } from "react";
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
  ChevronLeft,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useToast } from "@/components/ui/use-toast";
import { BlockchainService } from "@/services/blockchainService";

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
  const [viewMode] = useState<"grid" | "list">("grid");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default documents data
  const defaultDocuments: Document[] = [
    {
      id: "patients",
      name: "Patients",
      type: "folder",
      lastModified: "2023-04-15",
      starred: true,
      path: [],
    },
    {
      id: "research",
      name: "Research Papers",
      type: "folder",
      lastModified: "2023-04-10",
      starred: false,
      path: [],
    },
    {
      id: "conference",
      name: "Medical Conference",
      type: "folder",
      lastModified: "2023-03-22",
      starred: false,
      path: [],
    },
    // Patient Records
    {
      id: "patient1",
      name: "Rajesh Kumar",
      type: "folder",
      lastModified: "2023-04-12",
      starred: true,
      path: ["patients"],
      patientId: "P001",
    },
    {
      id: "patient2",
      name: "Priya Sharma",
      type: "folder",
      lastModified: "2023-04-10",
      starred: false,
      path: ["patients"],
      patientId: "P002",
    },
    {
      id: "patient3",
      name: "Amit Patel",
      type: "folder",
      lastModified: "2023-04-08",
      starred: false,
      path: ["patients"],
      patientId: "P003",
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
      content: "/public/patients/p1_mri.jpg",
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
      content: "/public/patients/p1_lab.pdf",
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
      content: "/public/patients/p1_prescription.docx",
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
      content: "/public/patients/p2_xray.jpg",
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
      content: "/public/patients/p2_ecg.pdf",
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
      content: "/public/research/cardiology_study.pdf",
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
      content: "/public/research/trials_data.xlsx",
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
      content: "/public/conference/presentation.pptx",
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
      content: "/public/conference/schedule.docx",
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
      path: [],
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
      path: [],
    },
  ];

  // Initialize documents from localStorage or use default
  const [documents, setDocuments] = useState<Document[]>(() => {
    // Try to get documents from localStorage
    const savedDocuments = localStorage.getItem("doctorDocuments");
    if (savedDocuments) {
      try {
        return JSON.parse(savedDocuments);
      } catch (error) {
        console.error("Error parsing saved documents:", error);
        return defaultDocuments;
      }
    }
    return defaultDocuments;
  });

  // Save documents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("doctorDocuments", JSON.stringify(documents));
  }, [documents]);

  // Filter documents based on search term and current path
  const filteredDocuments = documents.filter(
    (doc: Document) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      JSON.stringify(doc.path) === JSON.stringify(currentPath)
  );

  const getDocumentIcon = (doc: Document) => {
    if (doc.type === "folder")
      return <Folder className="h-10 w-10 text-indigo-600" />;

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
      // For files, show a toast with a link to view the file
      toast({
        title: "Opening Document",
        description: (
          <div>
            <p>Opening {doc.name}</p>
            {doc.content && (
              <p className="mt-1">
                <a
                  href={doc.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  Click here to view
                </a>
              </p>
            )}
          </div>
        ),
      });
    }
  };

  const handleBackClick = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const toggleStar = (id: string) => {
    // Find the document by id and toggle its starred status
    const updatedDocs = documents.map((doc: Document) =>
      doc.id === id ? { ...doc, starred: !doc.starred } : doc
    );

    // Update state (which will trigger the useEffect to save to localStorage)
    setDocuments(updatedDocs);

    // Find the document to get its name for the toast
    const doc = documents.find((doc) => doc.id === id);
    const docName = doc ? doc.name : id;

    toast({
      title: "Starred Status Changed",
      description: `"${docName}" has been ${
        doc?.starred ? "removed from" : "added to"
      } starred items.`,
    });
  };

  const handleUploadClick = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      console.log("Starting file upload process for:", file.name);

      // Create a new instance of BlockchainService
      const blockchainService = new BlockchainService();

      // Upload the file to IPFS via Pinata
      console.log("Calling uploadDocumentToPinata with file:", file.name);
      const result = await blockchainService.uploadDocumentToPinata(file, {
        doctorId: "current-doctor-id", // In a real app, get this from auth context
        documentType: file.type,
      });

      console.log("Pinata upload result:", result); // Add logging to debug

      if (result.success && result.hash && result.url) {
        // Generate a unique ID for the document
        const newDocId = `doc_${Date.now()}`;

        // Create a new document object
        const newDocument: Document = {
          id: newDocId,
          name: result.name || file.name,
          type: "file",
          format: result.format as "pdf" | "image" | "spreadsheet" | "document",
          size: result.size || `${Math.round(file.size / 1024)} KB`,
          lastModified: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
          starred: false,
          path: [...currentPath],
          content: result.url,
        };

        console.log("Created new document object:", newDocument);

        // Add the new document to the documents array
        setDocuments((prevDocs) => {
          const updatedDocs = [...prevDocs, newDocument];
          console.log("Updated documents array:", updatedDocs);
          return updatedDocs;
        });

        // No longer automatically opening the URL in a new tab

        toast({
          title: "Upload Successful",
          description: (
            <div>
              <p>{file.name} has been uploaded to IPFS.</p>
              <p>Hash: {result.hash.substring(0, 10)}...</p>
              <p>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600"
                >
                  View on IPFS Gateway
                </a>
              </p>
            </div>
          ),
        });
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "There was an error uploading your file.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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
              {currentPath.length > 0
                ? currentPath[currentPath.length - 1]
                : "Documents & Email"}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPath([])}
            >
              All Files
            </Button>
            <Button variant="outline" size="sm" className="bg-indigo-50">
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={handleUploadClick}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <FilePlus className="h-4 w-4 mr-2" /> Upload
              </>
            )}
          </Button>
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv"
          />
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDocuments.length === 0 ? (
              <div className="col-span-full py-10 text-center">
                <p className="text-gray-500">
                  No documents found matching "{searchTerm}"
                </p>
              </div>
            ) : (
              filteredDocuments.map((doc: Document) => (
                <div
                  key={doc.id}
                  className="bg-white border rounded-md p-3 flex flex-col hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleDocumentClick(doc)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-shrink-0">{getDocumentIcon(doc)}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        toggleStar(doc.id);
                      }}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          doc.starred ? "fill-yellow-400 text-yellow-400" : ""
                        }`}
                      />
                    </Button>
                  </div>

                  <h3 className="font-medium truncate mb-1" title={doc.name}>
                    {doc.name}
                  </h3>

                  {doc.type === "email" && (
                    <p
                      className="text-xs text-gray-500 truncate mb-1"
                      title={doc.from}
                    >
                      From: {doc.from}
                    </p>
                  )}

                  <div className="flex justify-between mt-auto pt-2">
                    <p className="text-xs text-gray-500">
                      {doc.type === "email"
                        ? "Email"
                        : doc.type === "folder"
                        ? "Folder"
                        : doc.size}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
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
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center">
                      <p className="text-gray-500">
                        No documents found matching "{searchTerm}"
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc: Document) => (
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
                              <p className="text-xs text-gray-500">
                                {doc.subject}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                          {doc.type === "email"
                            ? "Email"
                            : doc.type === "folder"
                            ? "Folder"
                            : doc.format}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-gray-500">{doc.size || "-"}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-gray-500">
                          {new Date(doc.lastModified).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              toggleStar(doc.id);
                            }}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                doc.starred
                                  ? "fill-yellow-400 text-yellow-400"
                                  : ""
                              }`}
                            />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              onClick={(e: React.MouseEvent) =>
                                e.stopPropagation()
                              }
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorDocuments;
