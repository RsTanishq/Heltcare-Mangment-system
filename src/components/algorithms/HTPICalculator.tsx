
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { calculateHTPIScore } from "../../utils/algorithms";

const HTPICalculator = () => {
  const [urgency, setUrgency] = useState<number>(0);
  const [paymentWeight, setPaymentWeight] = useState<number>(3);
  const [dataSize, setDataSize] = useState<number>(1);
  const [networkLoad, setNetworkLoad] = useState<number>(0.5);
  const [transactionType, setTransactionType] = useState<number>(0.5);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const calculatedScore = calculateHTPIScore(
      urgency, 
      paymentWeight, 
      dataSize, 
      networkLoad, 
      transactionType
    );
    setScore(calculatedScore);
  }, [urgency, paymentWeight, dataSize, networkLoad, transactionType]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold text-xl mb-4">H-TPI Calculator</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Urgency Factor</label>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Routine</span>
              <Switch 
                checked={urgency === 1}
                onCheckedChange={(checked) => setUrgency(checked ? 1 : 0)} 
              />
              <span className="text-sm text-gray-500 ml-2">Emergency</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">Current value: {urgency}</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Weight</label>
          <Slider 
            value={[paymentWeight]} 
            min={1} 
            max={5} 
            step={1} 
            onValueChange={(value) => setPaymentWeight(value[0])} 
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Cash (1)</span>
            <span>Cryptocurrency (5)</span>
          </div>
          <p className="text-xs text-gray-500">Current value: {paymentWeight}</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Data Size (KB)</label>
          <Slider 
            value={[dataSize]} 
            min={0.1} 
            max={10} 
            step={0.1} 
            onValueChange={(value) => setDataSize(value[0])} 
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0.1 KB</span>
            <span>10 KB</span>
          </div>
          <p className="text-xs text-gray-500">Current value: {dataSize.toFixed(1)} KB</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Network Load</label>
          <Slider 
            value={[networkLoad]} 
            min={0.1} 
            max={1} 
            step={0.1} 
            onValueChange={(value) => setNetworkLoad(value[0])} 
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low (0.1)</span>
            <span>High (1.0)</span>
          </div>
          <p className="text-xs text-gray-500">Current value: {networkLoad.toFixed(1)}</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Transaction Type</label>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Data Update (0.5)</span>
            <Switch 
              checked={transactionType === 1}
              onCheckedChange={(checked) => setTransactionType(checked ? 1 : 0.5)} 
            />
            <span className="text-sm text-gray-500">Payment (1.0)</span>
          </div>
          <p className="text-xs text-gray-500">Current value: {transactionType.toFixed(1)}</p>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">H-TPI Score</h4>
            <div className={`px-3 py-1 rounded font-medium ${
              score >= 5 ? 'bg-green-100 text-green-800' : 
              score >= 2 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {score.toFixed(4)}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Higher scores indicate higher priority transactions
          </p>
        </div>
      </div>
    </div>
  );
};

export default HTPICalculator;
