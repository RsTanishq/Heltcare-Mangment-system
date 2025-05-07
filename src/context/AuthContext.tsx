import React, { createContext, useContext, useState, useEffect } from "react";
import { Doctor } from "../data/mockDoctors";
import {
  Patient,
  mockPatients,
  addNewPatient,
  generatePatientId,
} from "../data/mockPatients";
import { BlockchainService } from "../services/blockchainService";
import useAppointmentStore from "../store/appointmentStore";

interface AuthContextType {
  currentUser: {
    type: "doctor" | "patient" | "admin" | null;
    data: Doctor | Patient | null;
  };
  login: (
    email: string,
    password: string,
    type: "doctor" | "patient" | "admin",
    walletAddress?: string
  ) => Promise<boolean>;
  signup: (userData: any, type: "doctor" | "patient") => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<
    AuthContextType["currentUser"]
  >({
    type: null,
    data: null,
  });

  useEffect(() => {
    // Check for saved session
    const checkAuthState = async () => {
      try {
        // Restore user session from localStorage
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);

          // Validate the saved user data
          if (parsedUser && parsedUser.type && parsedUser.data) {
            console.log(
              "Restoring auth state from localStorage:",
              parsedUser.type
            );

            // Make sure the name is properly set
            if (
              parsedUser.data.name === "Patient" &&
              parsedUser.data.fullName
            ) {
              parsedUser.data.name = parsedUser.data.fullName;
            }

            setCurrentUser(parsedUser);

            // If using MetaMask, verify the wallet is still connected
            if (window.ethereum && parsedUser.data.walletAddress) {
              try {
                // Get current connected accounts
                const accounts = await window.ethereum.request({
                  method: "eth_accounts",
                });

                // If wallet is disconnected or address doesn't match, clear the session
                if (
                  !accounts ||
                  accounts.length === 0 ||
                  (accounts &&
                    accounts.length > 0 &&
                    accounts[0].toLowerCase() !==
                      parsedUser.data.walletAddress?.toLowerCase())
                ) {
                  console.warn(
                    "Wallet disconnected or address mismatch - clearing session"
                  );
                  localStorage.removeItem("currentUser");
                  setCurrentUser({ type: null, data: null });
                  return; // Exit early
                }
              } catch (error) {
                console.error("Error checking wallet connection:", error);
              }
            }
          } else {
            // Invalid saved user data
            localStorage.removeItem("currentUser");
          }
        }
      } catch (error) {
        console.error("Error restoring auth state:", error);
        localStorage.removeItem("currentUser");
      }
    };

    checkAuthState();

    // Listen for storage events (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "currentUser") {
        if (e.newValue) {
          setCurrentUser(JSON.parse(e.newValue));
        } else {
          setCurrentUser({ type: null, data: null });
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const signup = async (
    userData: any,
    type: "doctor" | "patient"
  ): Promise<boolean> => {
    try {
      // Create a new user object
      let newUser: Doctor | Patient;

      if (type === "patient") {
        // Generate a proper patient ID
        const patientId = generatePatientId();

        // Create a complete patient object with required fields
        // Log the userData to see what's coming in
        console.log("userData received in AuthContext:", userData);

        const newPatient: Patient = {
          id: patientId,
          // Make sure we're using the correct property for the name
          name: userData.fullName || "Patient", // This should be the formatted name from signup
          email: userData.email,
          phone: userData.phoneNumber || "",
          dateOfBirth:
            userData.dateOfBirth || new Date().toISOString().split("T")[0],
          gender: userData.gender || "Male",
          bloodGroup: userData.bloodGroup || "Unknown",
          address: userData.address || "",
          emergencyContact: {
            name: userData.emergencyContactName || "Not provided",
            relationship:
              userData.emergencyContactRelationship || "Not provided",
            phone: userData.emergencyContactPhone || "Not provided",
          },
          medicalHistory: [],
          allergies: [],
          vaccinations: [],
          weight: userData.weight || 0,
          height: userData.height || 0,
          profileImage: userData.profileImage || "/placeholder.svg",
          createdAt: new Date().toISOString(),
          lastVisit: new Date().toISOString(),
          bloodPressureHistory: [
            { date: "Sunday", value: 120 },
            { date: "Monday", value: 120 },
            { date: "Tuesday", value: 120 },
            { date: "Wednesday", value: 120 },
            { date: "Thursday", value: 120 },
            { date: "Friday", value: 120 },
            { date: "Saturday", value: 120 },
          ],
          recentBloodPressure: "120/80",
          highestBloodPressure: "120/80",
          lowestBloodPressure: "120/80",
          appointments: [],
          recentAppointments: [],
        };

        // Log the patient data before adding to mockPatients
        console.log("Creating new patient with name:", userData.fullName);

        // Add the new patient to the mockPatients array
        addNewPatient(newPatient);

        newUser = newPatient;
        console.log("New patient added to doctor's directory:", newPatient);
      } else {
        // For doctor, just create a basic user object
        newUser = {
          id: `${type[0].toUpperCase()}${Date.now()}`, // Generate a unique ID
          ...userData,
          createdAt: new Date().toISOString(),
        };
      }

      // Set the current user
      const userState = { type, data: newUser };
      setCurrentUser(userState);
      localStorage.setItem("currentUser", JSON.stringify(userState));

      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const login = async (
    email: string,
    password: string,
    type: "doctor" | "patient" | "admin",
    walletAddress?: string
  ): Promise<boolean> => {
    try {
      console.log(
        `Attempting login as ${type}${walletAddress ? " with wallet" : ""}`
      );

      // Initialize blockchain service
      const blockchainService = new BlockchainService();

      // For wallet-based login
      if (walletAddress) {
        // Verify user registration on blockchain
        const { isRegistered, details } =
          await blockchainService.verifyUserRegistration(walletAddress);

        if (!isRegistered) {
          throw new Error("User not registered in the blockchain");
        }

        // Get user data from IPFS
        const userData = await blockchainService.getUserData(walletAddress);

        if (!userData || details.role !== type) {
          throw new Error(`Not registered as a ${type}`);
        }

        // Log the userData from IPFS to debug
        console.log("User data from IPFS:", userData);

        // Create a proper user object with an ID
        let userDataWithName = { ...userData };

        // Make sure we have a name property
        if (type === "patient") {
          // For patients, create a proper Patient object
          const patientData: Patient = {
            id: walletAddress.toLowerCase(),
            name: userData.fullName || "Unknown Patient", // Use fullName from IPFS
            email: userData.email || "",
            phone: userData.phoneNumber || "",
            dateOfBirth:
              userData.dateOfBirth || new Date().toISOString().split("T")[0],
            gender: userData.gender || "Male",
            bloodGroup: userData.bloodGroup || "Unknown",
            address: userData.address || "",
            emergencyContact: {
              name: userData.emergencyContactName || "Not provided",
              relationship:
                userData.emergencyContactRelationship || "Not provided",
              phone: userData.emergencyContactPhone || "Not provided",
            },
            medicalHistory: [],
            allergies: [],
            vaccinations: [],
            weight: userData.weight || 0,
            height: userData.height || 0,
            profileImage: userData.profileImage || "/placeholder.svg",
            createdAt: userData.createdAt || new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            bloodPressureHistory: [
              { date: "Sunday", value: 120 },
              { date: "Monday", value: 120 },
              { date: "Tuesday", value: 120 },
              { date: "Wednesday", value: 120 },
              { date: "Thursday", value: 120 },
              { date: "Friday", value: 120 },
              { date: "Saturday", value: 120 },
            ],
            recentBloodPressure: "120/80",
            highestBloodPressure: "120/80",
            lowestBloodPressure: "120/80",
            appointments: [],
            recentAppointments: [],
            walletAddress: walletAddress.toLowerCase(),
            lastLogin: new Date().toISOString(),
          };

          // Always update the patient data in mockPatients to ensure fresh data
          // First remove any existing patient with this ID
          const existingPatientIndex = mockPatients.findIndex(
            (p) => p.id === patientData.id
          );

          if (existingPatientIndex >= 0) {
            console.log(
              "Updating existing patient data for:",
              patientData.name
            );
            // Remove the existing patient
            mockPatients.splice(existingPatientIndex, 1);
          }

          // Add the patient with fresh data
          console.log(
            "Adding/updating patient in mockPatients:",
            patientData.name
          );
          addNewPatient(patientData);

          userDataWithName = patientData;
        } else {
          // For doctors or other types
          userDataWithName = {
            ...userData,
            id: walletAddress.toLowerCase(),
            name:
              userData.fullName ||
              `Unknown ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            walletAddress: walletAddress.toLowerCase(),
            lastLogin: new Date().toISOString(),
          };
        }

        const userState = {
          type,
          data: userDataWithName,
        };

        // Update state and persist to localStorage
        setCurrentUser(userState);
        localStorage.setItem("currentUser", JSON.stringify(userState));
        console.log(`Successfully logged in as ${type} with wallet`);
        return true;
      }

      // For demo/testing purposes, you could implement a mock login here
      // This would allow login without MetaMask for development
      if (
        process.env.NODE_ENV === "development" &&
        email === "demo@example.com" &&
        password === "demo123"
      ) {
        // Create a proper mock user based on the type
        let mockUserData: Patient | Doctor;

        if (type === "patient") {
          // Create a mock patient
          mockUserData = {
            id: `demo-${type}-${Date.now()}`,
            name: `Demo Patient`,
            email: email,
            phone: "+91 98765 43210",
            dateOfBirth: "1990-01-01",
            gender: "Male",
            bloodGroup: "O+",
            address: "123 Demo Street, Demo City",
            emergencyContact: {
              name: "Emergency Contact",
              relationship: "Relative",
              phone: "+91 98765 43211",
            },
            medicalHistory: [],
            allergies: [],
            vaccinations: [],
            weight: 70,
            height: 170,
            profileImage: "/patients/placeholder.jpg",
            createdAt: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            bloodPressureHistory: [
              { date: "Sunday", value: 120 },
              { date: "Monday", value: 120 },
              { date: "Tuesday", value: 120 },
              { date: "Wednesday", value: 120 },
              { date: "Thursday", value: 120 },
              { date: "Friday", value: 120 },
              { date: "Saturday", value: 120 },
            ],
            recentBloodPressure: "120/80",
            highestBloodPressure: "120/80",
            lowestBloodPressure: "120/80",
            appointments: [],
            recentAppointments: [],
            walletAddress: "0xdemo",
            lastLogin: new Date().toISOString(),
          };

          // Add to mockPatients
          addNewPatient(mockUserData as Patient);
        } else {
          // Create a mock doctor with all required fields
          mockUserData = {
            id: `demo-${type}-${Date.now()}`,
            name: `Demo Doctor`,
            email: email,
            specialty: "General Medicine",
            image: "/doctors/placeholder.jpg",
            availability: true,
            phone: "+91 98765 43210",
            address: "123 Demo Street, Demo City",
            experience: 5,
            rating: 4.5,
            consultationFee: 1000,
            workingHours: {
              start: "09:00",
              end: "17:00",
              days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            },
            about: "Demo doctor for testing purposes",
            languages: ["English", "Hindi"],
            education: ["MBBS - Demo University"],
            certifications: ["Demo Certification"],
          } as Doctor;
        }

        const userState = { type, data: mockUserData };
        setCurrentUser(userState);
        localStorage.setItem("currentUser", JSON.stringify(userState));
        console.log(`Successfully logged in as demo ${type}`);
        return true;
      }

      // Regular email/password login is not supported anymore
      // All logins must be through wallet
      throw new Error("Please use wallet login");
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Get current user type before clearing
      const userType = currentUser?.type;
      const userId = currentUser?.data?.id;

      // Clear user data from context
      setCurrentUser({ type: null, data: null });

      // Clear all stored data
      localStorage.clear(); // Clear all localStorage items
      sessionStorage.clear(); // Clear all sessionStorage items

      // Set a flag to indicate the user just logged out
      localStorage.setItem("justLoggedOut", "true");

      // Clear appointments from the store
      const appointmentStore = useAppointmentStore.getState();
      appointmentStore.clearAppointments();

      // If the user was a patient, remove them from mockPatients to ensure fresh data on next login
      if (userType === "patient" && userId) {
        console.log("Removing patient data for:", userId);
        const patientIndex = mockPatients.findIndex((p) => p.id === userId);
        if (patientIndex >= 0) {
          mockPatients.splice(patientIndex, 1);
        }
      }

      // If using blockchain service, disconnect wallet
      if (window.ethereum) {
        try {
          const blockchainService = new BlockchainService();
          await blockchainService.disconnectWallet();

          // Force disconnect by clearing any MetaMask cached connections
          if (window.ethereum.disconnect) {
            await window.ethereum.disconnect();
          }
        } catch (error) {
          console.error("Error disconnecting wallet:", error);
        }
      }

      // Clear mock data for the next session
      if (typeof window !== "undefined") {
        // Reset any mock data that might be stored in window object
        (window as any).mockDataReset = true;

        // Force a page reload to clear any in-memory state
        window.location.href = "/"; // Redirect to root which is the login page
      }

      console.log("User logged out successfully and all data cleared");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
