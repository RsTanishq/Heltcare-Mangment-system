
import { useState, useEffect } from "react";
import { checkHADSPAccess } from "../../utils/algorithms";

interface AccessCheckerProps {
  urgencyLevel: number;
  urgencyThreshold: number;
  paymentValid: boolean;
  patientConsent: boolean;
  onAccessChange?: (granted: boolean) => void;
}

const AccessChecker: React.FC<AccessCheckerProps> = ({
  urgencyLevel,
  urgencyThreshold,
  paymentValid,
  patientConsent,
  onAccessChange
}) => {
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    const access = checkHADSPAccess(
      urgencyLevel,
      urgencyThreshold,
      paymentValid,
      patientConsent
    );
    
    setAccessGranted(access);
    
    if (onAccessChange) {
      onAccessChange(access);
    }
  }, [urgencyLevel, urgencyThreshold, paymentValid, patientConsent, onAccessChange]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4">H-ADSP Access Control</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div>
            <p className="font-medium">Urgency Level Check</p>
            <p className="text-sm text-gray-500">
              Urgency Level ({urgencyLevel}) ≥ Threshold ({urgencyThreshold})
            </p>
          </div>
          <div className={`text-sm font-medium ${urgencyLevel >= urgencyThreshold ? 'text-green-600' : 'text-red-600'}`}>
            {urgencyLevel >= urgencyThreshold ? 'PASSED' : 'FAILED'}
          </div>
        </div>
        
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div>
            <p className="font-medium">Payment Validation</p>
            <p className="text-sm text-gray-500">
              Payment is valid and verified
            </p>
          </div>
          <div className={`text-sm font-medium ${paymentValid ? 'text-green-600' : 'text-red-600'}`}>
            {paymentValid ? 'PASSED' : 'FAILED'}
          </div>
        </div>
        
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div>
            <p className="font-medium">Patient Consent</p>
            <p className="text-sm text-gray-500">
              Patient has given explicit consent
            </p>
          </div>
          <div className={`text-sm font-medium ${patientConsent ? 'text-green-600' : 'text-red-600'}`}>
            {patientConsent ? 'PASSED' : 'FAILED'}
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between items-center p-3 rounded-md bg-gray-50">
        <div>
          <p className="font-medium">Final Decision</p>
          <p className="text-sm text-gray-500">
            Access Granted = (Urgency Level ≥ Threshold) ∧ (Payment Valid) ∧ (Patient Consent Granted)
          </p>
        </div>
        <div className={`text-lg font-bold ${accessGranted ? 'text-green-600' : 'text-red-600'}`}>
          {accessGranted ? 'GRANTED' : 'DENIED'}
        </div>
      </div>
    </div>
  );
};

export default AccessChecker;
