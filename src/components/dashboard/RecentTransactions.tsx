
import { FileText, ExternalLink } from "lucide-react";

interface Transaction {
  id: string;
  type: "record" | "payment" | "consent";
  description: string;
  timestamp: string;
  htpiScore: number;
  transactionHash: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const getTransactionTypeText = (type: string) => {
    switch(type) {
      case "record": return "Medical Record";
      case "payment": return "Payment";
      case "consent": return "Consent Update";
      default: return "Transaction";
    }
  };
  
  const getHTPIScoreColor = (score: number) => {
    if (score >= 5) return "text-green-600";
    if (score >= 2) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h3 className="font-semibold text-xl mb-4">Recent Transactions</h3>
        
        <div className="divide-y divide-gray-100">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <FileText className="text-blue-600" size={18} />
                </div>
                
                <div>
                  <p className="font-medium">{getTransactionTypeText(transaction.type)}</p>
                  <p className="text-sm text-gray-500">{transaction.description}</p>
                  <p className="text-xs text-gray-400">{formatTimestamp(transaction.timestamp)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-6 text-right">
                  <p className="text-sm font-medium">H-TPI Score</p>
                  <p className={`font-bold ${getHTPIScoreColor(transaction.htpiScore)}`}>
                    {transaction.htpiScore.toFixed(2)}
                  </p>
                </div>
                
                <a href={`https://etherscan.io/tx/${transaction.transactionHash}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={18} className="text-gray-400 hover:text-blue-600" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {transactions.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No recent transactions
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
