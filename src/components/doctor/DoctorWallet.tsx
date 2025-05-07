import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, ArrowUpFromLine, CreditCard, CheckCircle, Link } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMetaMask } from "@/hooks/useMetaMask";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "payment" | "withdrawal";
  description: string;
  txHash?: string;
}

const DoctorWallet: React.FC = () => {
  const { toast } = useToast();
  const { isConnected, account, balance: metamaskBalance, connect, sendTransaction } = useMetaMask();
  const [balance, setBalance] = useState(10000);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawBank, setWithdrawBank] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Listen for appointment payments
    const handleAppointmentPayment = async (event: CustomEvent) => {
      const { amount, patientAddress, appointmentId } = event.detail;
      
      try {
        // Convert INR to ETH (assuming 1 ETH = 200,000 INR for example)
        const ethAmount = (amount / 200000).toString();
        
        const tx = await sendTransaction(account!, ethAmount);
        
        // Add transaction to history
        const newTransaction: Transaction = {
          id: appointmentId,
          date: new Date().toISOString().split('T')[0],
          amount: amount,
          type: "payment",
          description: `Payment for appointment from ${patientAddress.slice(0, 6)}...${patientAddress.slice(-4)}`,
          txHash: tx.hash
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
        setBalance(prev => prev + amount);
        
        toast({
          title: "Payment Received",
          description: `₹${amount.toLocaleString('en-IN')} received for appointment ${appointmentId}`,
          action: (
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          ),
        });
      } catch (error) {
        console.error('Error processing payment:', error);
        toast({
          title: "Payment Failed",
          description: "Failed to process the payment. Please try again.",
          variant: "destructive",
        });
      }
    };

    window.addEventListener('appointmentPayment', handleAppointmentPayment as EventListener);
    return () => {
      window.removeEventListener('appointmentPayment', handleAppointmentPayment as EventListener);
    };
  }, [account, sendTransaction, toast]);

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      });
      return;
    }
    
    if (amount > balance) {
      toast({
        title: "Insufficient funds",
        description: "The withdrawal amount exceeds your available balance.",
        variant: "destructive",
      });
      return;
    }
    
    if (!withdrawBank) {
      toast({
        title: "Bank account required",
        description: "Please select a bank account for withdrawal.",
        variant: "destructive",
      });
      return;
    }
    
    setBalance(prevBalance => prevBalance - amount);
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      type: "withdrawal",
      description: `Withdrawal to ${withdrawBank}`
    };
    
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    
    toast({
      title: "Withdrawal Initiated",
      description: `₹${amount.toLocaleString('en-IN')} will be transferred to your bank account.`,
      action: (
        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>
      ),
    });
    
    setIsWithdrawDialogOpen(false);
    setWithdrawAmount("");
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Doctor Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available Balance</p>
                  <p className="text-2xl font-bold">₹{balance.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {!isConnected ? (
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={connect}
                  >
                    <Link className="mr-2 h-4 w-4" /> Connect MetaMask
                  </Button>
                ) : (
                  <div className="text-sm text-gray-600">
                    <p>Connected: {account?.slice(0, 6)}...{account?.slice(-4)}</p>
                    <p>ETH Balance: {parseFloat(metamaskBalance).toFixed(4)}</p>
                  </div>
                )}
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setIsWithdrawDialogOpen(true)}
                >
                  <ArrowUpFromLine className="mr-2 h-4 w-4" /> Withdraw
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Recent Transactions</h3>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'payment' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {transaction.type === 'payment' ? <CheckCircle className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                        {transaction.txHash && (
                          <a 
                            href={`https://etherscan.io/tx/${transaction.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            View on Etherscan
                          </a>
                        )}
                      </div>
                    </div>
                    <p className={`font-semibold ${transaction.type === 'payment' ? 'text-green-600' : 'text-blue-600'}`}>
                      {transaction.type === 'payment' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="outline" className="w-full">View All Transactions</Button>
        </CardFooter>
      </Card>

      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Withdraw</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input 
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank">Select Bank Account</Label>
              <select
                id="bank"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={withdrawBank}
                onChange={(e) => setWithdrawBank(e.target.value)}
              >
                <option value="">Select a bank account</option>
                <option value="hdfc">HDFC Bank (****6789)</option>
                <option value="sbi">SBI (****4321)</option>
                <option value="icici">ICICI Bank (****2468)</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWithdrawDialogOpen(false)}>Cancel</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleWithdraw}>
              Confirm Withdrawal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DoctorWallet;
