import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useEthereumWallet } from "../utils/blockchain";
import { BlockchainService } from "../services/blockchainService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  gender: "Male" | "Female" | "Other";
  registrationNumber: string;
  specialization: string;
  yearsOfExperience: string;
  hospitalAffiliation: string;
  workAddress: string;
  profileImage: File | null;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { connectWallet, connected, account } = useEthereumWallet();
  const blockchainService = new BlockchainService();
  const { signup } = useAuth();

  const [userType, setUserType] = useState<"patient" | "doctor">("patient");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gender: "Male", // Default gender
    registrationNumber: "",
    specialization: "",
    yearsOfExperience: "",
    hospitalAffiliation: "",
    workAddress: "",
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      setFormData({ ...formData, profileImage: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    // Add confirmation dialog for registration fee
    if (
      !window.confirm(
        `Registration requires a fee of ${blockchainService.getRegistrationFeeInEth()} ETH. Do you want to continue?`
      )
    ) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // First register on blockchain
      if (userType === "patient") {
        // Format the name properly with capitalization
        const formattedName = formData.fullName
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");

        console.log("Original name:", formData.fullName);
        console.log("Formatted name:", formattedName);

        await blockchainService.registerPatient({
          fullName: formattedName, // Use properly formatted name
          email: formData.email,
          walletAddress: account || "",
          phoneNumber: formData.phoneNumber,
          gender: formData.gender, // Pass gender to blockchain service
          profileImage: formData.profileImage || undefined,
        });

        // Then add to local storage and mock data
        // This will add the patient to the doctor's patient directory

        // Create the patient data object with the formatted name
        const patientData = {
          fullName: formattedName, // Use the formatted name
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          walletAddress: account || "",
          // Convert File to string URL if available
          profileImage: formData.profileImage
            ? URL.createObjectURL(formData.profileImage)
            : "/patients/placeholder.jpg",
          gender: formData.gender, // Use selected gender
          dateOfBirth: new Date().toISOString().split("T")[0],
        };

        console.log("Patient data being passed to signup:", patientData);

        const success = await signup(patientData, "patient");

        if (success) {
          navigate("/patient-dashboard");
        }
      } else {
        // Format the name properly with capitalization
        const formattedName = formData.fullName
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");

        // Format specialization with proper capitalization
        const formattedSpecialization = formData.specialization
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");

        await blockchainService.registerDoctor({
          fullName: formattedName, // Use properly formatted name
          email: formData.email,
          walletAddress: account || "",
          specialization: formattedSpecialization, // Use properly formatted specialization
          license: formData.registrationNumber,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender, // Pass gender to blockchain service
          yearsOfExperience: formData.yearsOfExperience,
          hospitalAffiliation: formData.hospitalAffiliation,
          workAddress: formData.workAddress,
          profileImage: formData.profileImage || undefined,
        });

        // Add doctor to local storage

        // Create the doctor data object with the formatted name
        const doctorData = {
          fullName: formattedName, // Use the formatted name
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          specialization: formattedSpecialization, // Use the formatted specialization
          registrationNumber: formData.registrationNumber,
          yearsOfExperience: formData.yearsOfExperience,
          hospitalAffiliation: formData.hospitalAffiliation,
          workAddress: formData.workAddress,
          walletAddress: account || "",
          gender: formData.gender, // Include gender for doctors too
          profileImage: formData.profileImage
            ? URL.createObjectURL(formData.profileImage)
            : "/doctors/placeholder.jpg",
        };

        console.log("Doctor data being passed to signup:", doctorData);

        await signup(doctorData, "doctor");

        navigate("/doctor-dashboard");
      }

      toast({
        title: "Success",
        description: "Registration successful!",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Join our healthcare platform
          </p>
        </div>

        <Tabs
          value={userType}
          onValueChange={(value: "patient" | "doctor") => setUserType(value)}
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Create a password"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm your password"
                />
              </div>

              <div>
                <Label htmlFor="gender" className="mb-2 block">
                  Gender
                </Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      gender: value as "Male" | "Female" | "Other",
                    })
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="profileImage">Profile Picture</Label>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {userType === "doctor" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    🏥 Professional Details
                  </h3>

                  <div>
                    <Label htmlFor="registrationNumber">
                      Medical Registration Number
                    </Label>
                    <Input
                      id="registrationNumber"
                      required
                      value={formData.registrationNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          registrationNumber: e.target.value,
                        })
                      }
                      placeholder="Enter your registration number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      required
                      value={formData.specialization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialization: e.target.value,
                        })
                      }
                      placeholder="e.g., Cardiologist, General Physician"
                    />
                  </div>

                  <div>
                    <Label htmlFor="yearsOfExperience">
                      Years of Experience
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      required
                      value={formData.yearsOfExperience}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          yearsOfExperience: e.target.value,
                        })
                      }
                      placeholder="Enter years of experience"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hospitalAffiliation">
                      Hospital/Clinic Affiliation
                    </Label>
                    <Input
                      id="hospitalAffiliation"
                      required
                      value={formData.hospitalAffiliation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hospitalAffiliation: e.target.value,
                        })
                      }
                      placeholder="Enter hospital or clinic name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="workAddress">Work Address</Label>
                    <Input
                      id="workAddress"
                      value={formData.workAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          workAddress: e.target.value,
                        })
                      }
                      placeholder="Enter work address (optional)"
                    />
                  </div>
                </div>
              )}
            </div>

            {!connected ? (
              <Button
                type="button"
                onClick={connectWallet}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Connect MetaMask
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            )}
          </form>
        </Tabs>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Registration Fee: {blockchainService.getRegistrationFeeInEth()} ETH
          </p>
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
