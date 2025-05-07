
import { useState } from "react";

interface ConsentFormProps {
  patientId: string;
  doctorId: string;
  doctorName: string;
  initialStatus?: boolean;
  onSubmit: (status: boolean, expiryDate: string | null) => Promise<void>;
}

const ConsentForm: React.FC<ConsentFormProps> = ({
  patientId,
  doctorId,
  doctorName,
  initialStatus = false,
  onSubmit,
}) => {
  const [status, setStatus] = useState(initialStatus);
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError("");
      
      // Convert empty string to null
      const formattedExpiryDate = expiryDate ? expiryDate : null;
      
      await onSubmit(status, formattedExpiryDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">
        {initialStatus ? "Update Consent" : "Grant Consent"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">You are about to {status ? "grant" : "revoke"} consent for:</p>
          <p className="font-medium">{doctorName}</p>
          <p className="text-xs text-gray-400">Doctor ID: {doctorId}</p>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={status}
                onChange={() => setStatus(!status)}
              />
              <div className={`block w-14 h-8 rounded-full transition ${status ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${status ? 'translate-x-6' : ''}`}></div>
            </div>
            <div className="ml-3">
              <p className="font-medium">{status ? "Consent Granted" : "Consent Denied"}</p>
              <p className="text-xs text-gray-500">
                {status
                  ? "The doctor will be able to access your medical records."
                  : "The doctor will not be able to access your medical records."}
              </p>
            </div>
          </label>
        </div>
        
        {status && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              If left empty, the consent will not expire.
            </p>
          </div>
        )}
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md font-medium ${
              isSubmitting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsentForm;
