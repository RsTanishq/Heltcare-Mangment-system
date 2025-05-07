
import { FileText, ExternalLink as ExternalLinkIcon, Lock, Unlock, AlertTriangle } from "lucide-react";
import { MedicalRecord } from "../../pages/MedicalRecords";

interface MedicalRecordCardProps extends MedicalRecord {
  onClick: () => void;
}

const MedicalRecordCard: React.FC<MedicalRecordCardProps> = ({
  id,
  patientName,
  patientId,
  doctorName,
  doctorId,
  diagnosis,
  date,
  accessGranted,
  urgencyLevel,
  recordHash,
  transactionHash,
  htpiScore,
  onClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between p-4 bg-gray-50">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <FileText className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="font-medium">{diagnosis}</h3>
            <p className="text-sm text-gray-500">Record ID: {id.substring(0, 8)}...</p>
          </div>
        </div>
        
        <div className="flex items-center">
          {accessGranted ? (
            <div className="flex items-center text-green-600">
              <Unlock size={16} className="mr-1" />
              <span className="text-sm font-medium">Access Granted</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <Lock size={16} className="mr-1" />
              <span className="text-sm font-medium">Access Denied</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Patient</p>
            <p className="font-medium">{patientName}</p>
            <p className="text-xs text-gray-400">ID: {patientId.substring(0, 8)}...</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Doctor</p>
            <p className="font-medium">{doctorName}</p>
            <p className="text-xs text-gray-400">ID: {doctorId.substring(0, 8)}...</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Date Created</p>
            <p className="font-medium">{formatDate(date)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">H-TPI Score</p>
            <p className={`font-medium ${htpiScore >= 5 ? 'text-green-600' : htpiScore >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
              {htpiScore.toFixed(2)}
            </p>
          </div>
        </div>
        
        {urgencyLevel > 0 && (
          <div className="flex items-center bg-yellow-50 p-2 rounded-md mb-4">
            <AlertTriangle size={16} className="text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-800">Emergency Record</span>
          </div>
        )}
        
        <div className="border-t border-gray-100 pt-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <span className="text-xs text-gray-500 w-24">Record Hash:</span>
              <span className="text-xs text-gray-700 font-mono">{recordHash.substring(0, 20)}...</span>
              <a 
                href={`https://ipfs.io/ipfs/${recordHash}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-2"
                onClick={(e) => e.stopPropagation()} // Prevent the card click event
              >
                <ExternalLinkIcon size={14} className="text-blue-500" />
              </a>
            </div>
            
            <div className="flex items-center">
              <span className="text-xs text-gray-500 w-24">Transaction:</span>
              <span className="text-xs text-gray-700 font-mono">{transactionHash.substring(0, 20)}...</span>
              <a 
                href={`https://etherscan.io/tx/${transactionHash}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-2"
                onClick={(e) => e.stopPropagation()} // Prevent the card click event
              >
                <ExternalLinkIcon size={14} className="text-blue-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordCard;
