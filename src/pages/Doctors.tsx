import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
  Search,
  Star,
  Calendar,
  AlarmClock,
  Video,
  MapPin,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { mockDoctors, Doctor } from "../data/mockDoctors";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import useAppointmentStore from "@/store/appointmentStore";
import { useAuth } from "@/context/AuthContext";
import { useMetaMask } from "@/hooks/useMetaMask";
import { BlockchainService } from "../services/blockchainService";

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addAppointment } = useAppointmentStore();
  const { currentUser } = useAuth();
  const { sendTransaction, account } = useMetaMask();

  // Booking dialog state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [visitMode, setVisitMode] = useState<string>("");
  const [urgency, setUrgency] = useState<string>("");
  const [symptoms, setSymptoms] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentReason, setAppointmentReason] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      const blockchainService = new BlockchainService();
      try {
        const doctorList = await blockchainService.getAllDoctors();
        setDoctors(doctorList);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch doctors from blockchain.",
          variant: "destructive",
        });
      }
    };
    fetchDoctors();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm) {
      setDoctors(mockDoctors);
      return;
    }

    const filtered = mockDoctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setDoctors(filtered);
  };

  const handleCryptoPayment = async () => {
    setIsPaying(true);
    try {
      // Use a real Ethereum address for receiving payments
      const toAddress = "0x00000000219ab540356cBB839Cbe05303d7705Fa"; // Example: Ethereum Foundation address (replace with your own)
      const amount = "0.0025";
      const tx = await sendTransaction(toAddress, amount);
      setTransactionHash(tx.hash);
      toast({
        title: "Payment Successful",
        description: `Transaction Hash: ${tx.hash}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your crypto payment.",
        variant: "destructive",
      });
    }
    setIsPaying(false);
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !currentUser?.data) {
      toast({
        title: "Error",
        description: "Please select a doctor and ensure you're logged in",
        variant: "destructive",
      });
      return;
    }
    if (!paymentType) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }
    if (paymentType === "crypto" && !transactionHash) {
      toast({
        title: "Crypto Payment Required",
        description: "Please complete the crypto payment before booking.",
        variant: "destructive",
      });
      return;
    }
    // Add the appointment to the store
    addAppointment({
      patientName: currentUser.data.name,
      patientId: currentUser.data.id,
      doctorId: selectedDoctor.id,
      doctorName:
        selectedDoctor.fullName || selectedDoctor.name || "Dr. Unknown", // Use fullName if available, fallback to name
      date: selectedDate.toISOString().split("T")[0],
      time: selectedTime,
      condition: appointmentReason || symptoms, // Use appointmentReason if available, fallback to symptoms
      status: "pending",
      visitMode: visitMode as "online" | "offline",
      urgency: urgency as "low" | "medium" | "high",
      symptoms: appointmentReason || symptoms,
      paymentType:
        paymentType === "crypto"
          ? "Cryptocurrency"
          : paymentType === "money"
          ? "Money"
          : "UPI",
      transactionHash: transactionHash || "N/A",
    });
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      setIsBookingOpen(false);
      setPaymentType("");
      setTransactionHash("");
      toast({
        title: "Appointment Booked",
        description: "Your appointment request has been sent to the doctor",
      });
    }, 2000);
  };

  const handleChat = (doctorId: string) => {
    navigate("/chat");
  };

  return (
    <Layout role="patient">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Find a Doctor</h1>

        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Button type="submit">
            <Search size={18} className="mr-2" />
            Search
          </Button>
        </form>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  {doctor.profileImage ? (
                    <img
                      src={doctor.profileImage}
                      alt={doctor.fullName || doctor.name}
                    />
                  ) : (
                    <div className="bg-blue-200 h-full w-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-lg">
                        {(doctor.fullName || doctor.name || "Dr")
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                </Avatar>

                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">
                    {doctor.fullName || doctor.name || "Doctor"}
                  </h3>
                  <p className="text-blue-600">
                    {doctor.specialization ||
                      doctor.specialty ||
                      "General Medicine"}
                  </p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">
                      {doctor.rating || "New"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {doctor.yearsOfExperience || doctor.experience || "0"} years
                    of experience
                  </p>
                  <p className={`text-xs font-medium text-gray-600`}>
                    {doctor.hospitalAffiliation || "Independent Practice"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Contact: {doctor.phoneNumber || "Not Available"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleChat(doctor.id)}
                >
                  Chat
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setIsBookingOpen(true);
                  }}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          ))}
        </div>

        {doctors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No doctors found matching your search. Please try different
            keywords.
          </div>
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Book Appointment with{" "}
              {selectedDoctor?.fullName || selectedDoctor?.name || "Doctor"}
            </DialogTitle>
            <DialogDescription>
              Fill out the information below to book your appointment
            </DialogDescription>
          </DialogHeader>

          {showConfirmation ? (
            <div className="py-10 flex flex-col items-center justify-center animate-bounce">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-green-600 text-center">
                Appointment Confirmed!
              </h3>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">
                    Specialty:{" "}
                    {selectedDoctor?.specialization ||
                      selectedDoctor?.specialty ||
                      "General Medicine"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlarmClock className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">
                    {selectedDoctor?.availability
                      ? "Available Today"
                      : "Not Available"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="visit-mode" className="flex items-center gap-2">
                  <span>Mode of Visit</span>
                </Label>
                <Select value={visitMode} onValueChange={setVisitMode}>
                  <SelectTrigger id="visit-mode" className="w-full">
                    <SelectValue placeholder="Select visit mode">
                      {visitMode === "online" && (
                        <div className="flex items-center gap-2">
                          <Video size={16} /> Online Consultation
                        </div>
                      )}
                      {visitMode === "offline" && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} /> In-person Visit
                        </div>
                      )}
                      {!visitMode && "Select visit mode"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">
                      <div className="flex items-center gap-2">
                        <Video size={16} /> Online Consultation
                      </div>
                    </SelectItem>
                    <SelectItem value="offline">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} /> In-person Visit
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="urgency" className="flex items-center gap-2">
                  <span>Urgency Level</span>
                </Label>
                <Select value={urgency} onValueChange={setUrgency}>
                  <SelectTrigger id="urgency" className="w-full">
                    <SelectValue placeholder="Select urgency level">
                      {urgency === "low" && (
                        <div className="text-green-600 flex items-center gap-2">
                          <AlertTriangle size={16} /> Low Urgency
                        </div>
                      )}
                      {urgency === "medium" && (
                        <div className="text-yellow-600 flex items-center gap-2">
                          <AlertTriangle size={16} /> Medium Urgency
                        </div>
                      )}
                      {urgency === "high" && (
                        <div className="text-red-600 flex items-center gap-2">
                          <AlertTriangle size={16} /> High Urgency
                        </div>
                      )}
                      {!urgency && "Select urgency level"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="text-green-600 flex items-center gap-2">
                        <AlertTriangle size={16} /> Low Urgency
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="text-yellow-600 flex items-center gap-2">
                        <AlertTriangle size={16} /> Medium Urgency
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="text-red-600 flex items-center gap-2">
                        <AlertTriangle size={16} /> High Urgency
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="symptoms" className="flex items-center gap-2">
                  <MessageSquare size={16} /> Symptoms
                </Label>
                <Textarea
                  id="symptoms"
                  placeholder="Please describe your symptoms..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="payment-method"
                  className="flex items-center gap-2"
                >
                  <span>Payment Method</span>
                </Label>
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger id="payment-method" className="w-full">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="money">Money</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentType === "crypto" && (
                <div className="space-y-2">
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleCryptoPayment}
                    disabled={isPaying || !!transactionHash}
                  >
                    {transactionHash
                      ? "Payment Complete"
                      : isPaying
                      ? "Processing..."
                      : "Pay 0.0025 ETH"}
                  </Button>
                  {transactionHash && (
                    <div className="text-xs text-green-600 break-all">
                      Transaction Hash: {transactionHash}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {!showConfirmation && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsBookingOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBookAppointment}
                  disabled={
                    !visitMode || !urgency || !symptoms.trim() || !paymentType
                  }
                >
                  Confirm Booking
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Doctors;
