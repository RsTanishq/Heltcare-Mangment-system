
import { useState } from "react";
import Layout from "../components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateHTPIScore, checkHADSPAccess } from "../utils/algorithms";
import AlgorithmExplainer from "../components/algorithms/AlgorithmExplainer";
import HTPICalculator from "../components/algorithms/HTPICalculator";
import AccessChecker from "../components/shared/AccessChecker";

interface ConsentsProps {
  role: "patient" | "doctor" | "admin";
}

const Consents: React.FC<ConsentsProps> = ({ role }) => {
  const [accessStatus, setAccessStatus] = useState<boolean>(false);

  return (
    <Layout role={role}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Consent & Algorithm Management</h1>
        </div>
        
        <Tabs defaultValue="algorithms" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
            <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
            <TabsTrigger value="consents">Access Control</TabsTrigger>
          </TabsList>
          
          <TabsContent value="algorithms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AlgorithmExplainer 
                title="H-TPI Algorithm"
                description="Healthcare Transaction Priority Index"
                formula="H-TPI = (U × P_Weight) / (S × L × T_Type)"
                variables={[
                  { name: "U", description: "Urgency factor (emergency = 1, routine = 0)" },
                  { name: "P_Weight", description: "Payment type weight (cryptocurrency > cash)" },
                  { name: "S", description: "Size of the transaction data (in KB)" },
                  { name: "L", description: "Network load (normalized between 0.1 and 1)" },
                  { name: "T_Type", description: "Transaction type (data update = 0.5, payment = 1)" }
                ]}
              />
              
              <HTPICalculator />
            </div>
          </TabsContent>
          
          <TabsContent value="consents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AlgorithmExplainer 
                title="H-ADSP Protocol"
                description="Healthcare Access Decision and Security Protocol"
                formula="Access Granted = (Urgency Level ≥ Threshold) ∧ (Payment Valid) ∧ (Patient Consent Granted)"
                variables={[
                  { name: "Urgency Level", description: "Priority of transaction (0-10)" },
                  { name: "Urgency Threshold", description: "Minimum urgency required (0-10)" },
                  { name: "Payment Valid", description: "Verified via blockchain (true/false)" },
                  { name: "Patient Consent", description: "Explicit approval by patient (true/false)" }
                ]}
              />
              
              <div className="space-y-6">
                <AccessChecker 
                  urgencyLevel={5}
                  urgencyThreshold={3}
                  paymentValid={true}
                  patientConsent={true}
                  onAccessChange={setAccessStatus}
                />
                
                <div className={`p-4 rounded-md ${accessStatus ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`font-medium ${accessStatus ? 'text-green-700' : 'text-red-700'}`}>
                    {accessStatus 
                      ? "Based on the H-ADSP protocol, access to this data is currently GRANTED."
                      : "Based on the H-ADSP protocol, access to this data is currently DENIED."}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Consents;
