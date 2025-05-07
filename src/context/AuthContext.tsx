import React, { createContext, useContext, useState, useEffect } from "react";
import { Doctor, mockDoctors } from "../data/mockDoctors";
import {
  Patient,
  mockPatients,
  addNewPatient,
  generatePatientId,
} from "../data/mockPatients";
import { BlockchainService } from "../services/blockchainService";

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
        // TEMPORARY FIX: Always clear localStorage to force login page
        localStorage.removeItem("currentUser");
        localStorage.removeItem("rememberedCredentials");
        localStorage.removeItem("doctorActiveTab");
        localStorage.removeItem("doctorMedications");
        localStorage.removeItem("doctorPatients");

        // Original code (commented out for now)
        /*
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);

          // Validate the saved user data
          if (parsedUser && parsedUser.type && parsedUser.data) {
            console.log(
              "Restoring auth state from localStorage:",
              parsedUser.type
            );
            setCurrentUser(parsedUser);

            // If using MetaMask, verify the wallet is still connected
            if (window.ethereum && parsedUser.data.walletAddress) {
              try {
                // Get current connected accounts
                const accounts = await window.ethereum.request({
                  method: "eth_accounts",
                });

                // If wallet is disconnected but we have a saved session with wallet
                if (
                  (!accounts || accounts.length === 0) &&
                  parsedUser.data.walletAddress
                ) {
                  console.warn("Wallet disconnected but session exists");
                  // We'll keep the session for now, but could handle this differently
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
        */
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
      let newUser;

      if (type === "patient") {
        // Generate a proper patient ID
        const patientId = generatePatientId();

        // Create a complete patient object with required fields
        const newPatient: Patient = {
          id: patientId,
          name: userData.fullName,
          email: userData.email,
          phone: userData.phoneNumber || "",
          dateOfBirth:
            userData.dateOfBirth || new Date().toISOString().split("T")[0],
          gender: userData.gender || "Other",
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

        // Create a proper user object with an ID
        const userState = {
          type,
          data: {
            ...userData,
            id: walletAddress.toLowerCase(), // Use wallet address as ID
            walletAddress: walletAddress.toLowerCase(),
            lastLogin: new Date().toISOString(), // Add login timestamp
          },
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
        const mockUserData = {
          id: `demo-${type}-${Date.now()}`,
          name: `Demo ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          email: email,
          // Add other required fields based on your user model
        };

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
      // Clear user data from context
      setCurrentUser({ type: null, data: null });

      // Clear all stored data
      localStorage.removeItem("currentUser");
      localStorage.removeItem("rememberedCredentials");
      localStorage.removeItem("doctorActiveTab"); // Clear any saved tabs
      localStorage.setItem("justLoggedOut", "true");

      // If using blockchain service, disconnect wallet
      if (window.ethereum) {
        try {
          const blockchainService = new BlockchainService();
          await blockchainService.disconnectWallet();
        } catch (error) {
          console.error("Error disconnecting wallet:", error);
        }
      }

      // Clear any session storage items that might contain sensitive data
      sessionStorage.clear();

      console.log("User logged out successfully");
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
