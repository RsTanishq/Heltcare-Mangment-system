import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useMetaMask } from "@/hooks/useMetaMask";
import { User, Mail, Lock, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { mockDoctors } from "@/data/mockDoctors";
import { mockPatients } from "@/data/mockPatients";
import { BlockchainService } from "../services/blockchainService";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { connect, isConnected, account } = useMetaMask();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [error, setError] = useState("");
  const [blockchainService, setBlockchainService] = useState<BlockchainService | null>(null);
  
  const clearRememberedCredentials = () => {
    localStorage.removeItem('rememberedCredentials');
    setEmail('');
    setPassword('');
    setRememberMe(false);
  };
  
  useEffect(() => {
    // Check if user just logged out (you can set this flag when logging out)
    const justLoggedOut = localStorage.getItem('justLoggedOut');
    if (justLoggedOut) {
      clearRememberedCredentials();
      localStorage.removeItem('justLoggedOut');
      return;
    }

    // Only load remembered credentials if not just logged out
    const savedCredentials = localStorage.getItem('rememberedCredentials');
    if (savedCredentials) {
      const { email: savedEmail, password: savedPassword, type: savedType } = JSON.parse(savedCredentials);
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);
  
  useEffect(() => {
    try {
      const service = new BlockchainService();
      setBlockchainService(service);
    } catch (err) {
      setError('Please install MetaMask to use this application');
    }
  }, []);
  
  const handleWalletLogin = async () => {
    setWalletLoading(true);
    try {
      if (!blockchainService) {
        throw new Error('Blockchain service not initialized');
      }

      // Connect wallet
      const address = await blockchainService.connectWallet();
      console.log('Connected wallet address:', address);

      // Verify user registration
      const { isRegistered, details } = await blockchainService.verifyUserRegistration(address);
      
      if (!isRegistered) {
        throw new Error('User not registered in the blockchain');
      }

      // Get user role from blockchain
      const userRole = details.role.toLowerCase() as 'patient' | 'doctor';

      // Create a wallet-based login
      const success = await login(
        `${address.toLowerCase()}@wallet.eth`,
        'test@123',
        userRole,
        address
      );

      if (success) {
        toast({
          title: "Success!",
          description: `Connected wallet: ${address.substring(0, 8)}...`,
        });
        
        // Navigate based on role
        if (userRole === 'doctor') {
          navigate("/doctor-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        throw new Error('Login session creation failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Could not connect to MetaMask",
        variant: "destructive",
      });
    } finally {
      setWalletLoading(false);
    }
  };
  
  const handleLogin = async (role: "patient" | "doctor" | "admin", isAutoLogin: boolean = false) => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!isAutoLogin) {
      setLoading(true);
    }
    
    try {
      const success = await login(email, password, role);
      if (success) {
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedCredentials', JSON.stringify({
            email,
            password,
            type: role
          }));
        } else {
          localStorage.removeItem('rememberedCredentials');
        }

        toast({
          title: "Success!",
          description: `Logged in as ${role}`,
        });
        
        // Verify the wallet address on the blockchain
        if (role === "patient") {
          const patientId = await blockchainService.contract.GET_PATIENT_ID(account);
          const patientDetails = await blockchainService.contract.GET_PATIENT_DETAILS(patientId);
          // Store patient details in context/state management
        } else if (role === "doctor") {
          const doctorId = await blockchainService.contract.GET_DOCTOR_ID(account);
          const doctorDetails = await blockchainService.contract.GET_DOCTOR_DETAILS(doctorId);
          // Verify if doctor is approved
          if (!doctorDetails.isApproved) {
            throw new Error("Doctor account is pending approval");
          }
          // Store doctor details in context/state management
        }

        // Navigate based on role
        switch (role) {
          case "patient":
            navigate("/dashboard");
            break;
          case "doctor":
            navigate("/doctor-dashboard");
            break;
          case "admin":
            navigate("/admin-dashboard");
            break;
        }
      } else {
        toast({
          title: "Error",
          description: "Invalid email or password. Default password is test@123",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Failed to login. Please check your wallet address.",
        variant: "destructive",
      });
    } finally {
      if (!isAutoLogin) {
        setLoading(false);
      }
    }
  };
  
  const renderLoginForm = (role: "patient" | "doctor" | "admin") => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor={`email-${role}`} className="text-sm font-medium">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            id={`email-${role}`}
            type="email" 
            placeholder={`${role}@example.com`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor={`password-${role}`} className="text-sm font-medium">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            id={`password-${role}`}
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id={`remember-${role}`} 
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
        />
        <label
          htmlFor={`remember-${role}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Remember me
        </label>
      </div>

      <Button 
        className="w-full" 
        onClick={() => handleLogin(role)}
        disabled={loading}
      >
        {loading ? "Logging in..." : `Login as ${role}`}
      </Button>

      {/* Add MetaMask login for both patient and doctor */}
      {(role === "patient" || role === "doctor") && (
        <>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleWalletLogin}
            disabled={walletLoading}
          >
            <img 
              src="https://cdn.iconscout.com/icon/free/png-256/free-metamask-2728406-2261817.png" 
              alt="MetaMask" 
              className="h-5 w-5" 
            />
            {walletLoading ? "Connecting..." : "Login with MetaMask"}
          </Button>
        </>
      )}
    </div>
  );
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">HOSCARE</h1>
          <p className="text-gray-600 mt-2">Blockchain Healthcare System</p>
        </div>
        
        <Tabs defaultValue="patient" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-8">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patient">
            {renderLoginForm("patient")}
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </a>
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="doctor">
            {renderLoginForm("doctor")}
          </TabsContent>
          
          <TabsContent value="admin">
            {renderLoginForm("admin")}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Secured by blockchain technology</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
