
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEthereumWallet } from "@/utils/blockchain";
import { connectToGanache } from "@/utils/blockchain/truffle-config";
import { AlertCircle, Server, CheckCircle } from "lucide-react";

const GanacheInfo = () => {
  const { toast } = useToast();
  const { provider, networkName } = useEthereumWallet();
  const [isGanache, setIsGanache] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Check if connected to Ganache
  useEffect(() => {
    const checkNetwork = async () => {
      if (provider) {
        const network = await provider.getNetwork();
        setIsGanache(network.chainId === 1337);
      }
    };
    
    checkNetwork();
  }, [provider, networkName]);
  
  const handleSwitchToGanache = async () => {
    setLoading(true);
    const result = await connectToGanache();
    setLoading(false);
    
    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to connect to Ganache",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Ganache Connection</CardTitle>
        <CardDescription>Local blockchain for testing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isGanache ? (
            <div className="bg-green-50 p-4 rounded-md flex items-start gap-3">
              <CheckCircle className="text-green-500 h-5 w-5 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800">Connected to Ganache</h3>
                <p className="text-sm text-green-700 mt-1">
                  You are connected to your local Ganache instance. You can now interact with smart contracts.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-md flex items-start gap-3">
              <AlertCircle className="text-yellow-500 h-5 w-5 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Not Connected to Ganache</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You are currently connected to {networkName || "an unknown network"}. 
                  For local development and testing, connect to Ganache.
                </p>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Server size={16} />
              Ganache Configuration
            </h3>
            <div className="text-sm space-y-2">
              <p className="font-mono bg-gray-100 p-2 rounded">RPC URL: http://127.0.0.1:7545</p>
              <p className="font-mono bg-gray-100 p-2 rounded">Chain ID: 1337</p>
              <p className="font-mono bg-gray-100 p-2 rounded">Network Name: Ganache Local</p>
            </div>
          </div>
          
          <Button 
            onClick={handleSwitchToGanache}
            className="w-full"
            disabled={loading || isGanache}
          >
            {loading ? "Switching..." : isGanache ? "Connected to Ganache" : "Switch to Ganache"}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            Make sure Ganache is running on your local machine
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GanacheInfo;
