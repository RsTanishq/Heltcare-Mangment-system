import { useState } from "react";
import { useEthereumWallet } from "../../utils/blockchain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ExternalLink, AlertCircle, Network } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const WalletConnect = () => {
  const { toast } = useToast();
  const { account, balance, connected, error, networkName, connectWallet, disconnectWallet } = useEthereumWallet();
  const [loading, setLoading] = useState(false);
  
  const handleConnect = async () => {
    setLoading(true);
    const result = await connectWallet();
    setLoading(false);
    
    if (result) {
      toast({
        title: "Success",
        description: "Wallet connected successfully.",
      });
    } else {
      toast({
        title: "Connection failed",
        description: error || "Could not connect to wallet.",
        variant: "destructive",
      });
    }
  };
  
  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: "Disconnected",
      description: "Wallet has been disconnected.",
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Ethereum Wallet</CardTitle>
        {connected && (
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-sm text-green-600 font-medium">Connected</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        {connected ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Account</span>
                <a 
                  href={`https://etherscan.io/address/${account}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 flex items-center gap-1 hover:underline"
                >
                  View <ExternalLink size={14} />
                </a>
              </div>
              <div className="text-sm font-mono truncate">{account}</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Network</span>
              </div>
              <div className="text-sm font-medium">{networkName}</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Balance</span>
                <span className="text-sm text-gray-500">INR</span>
              </div>
              <div className="text-xl font-semibold">₹{balance}</div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleDisconnect}
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 flex flex-col items-center justify-center rounded-md">
              <Wallet size={32} className="text-gray-400 mb-2" />
              <p className="text-center text-gray-500">
                Connect your Ethereum wallet to access blockchain features
              </p>
            </div>
            
            {error && (
              <div className="bg-red-50 p-3 rounded-md flex items-start gap-2">
                <AlertCircle size={16} className="text-red-600 mt-0.5" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}
            
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700" 
              onClick={handleConnect}
              disabled={loading}
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
