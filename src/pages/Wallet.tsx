import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CreditCard, Bitcoin, QrCode, DollarSign, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import WalletConnect from "@/components/blockchain/WalletConnect";
import { useEthereumWallet } from "@/utils/blockchain"; 

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  method: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState(1250.75);
  const [addFundsAmount, setAddFundsAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const { toast } = useToast();
  const { connected } = useEthereumWallet();
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx1",
      type: "deposit",
      amount: 500,
      method: "Credit Card",
      date: new Date(2022, 4, 15),
      status: "completed"
    },
    {
      id: "tx2",
      type: "withdrawal",
      amount: 150,
      method: "Hospital Bill",
      date: new Date(2022, 4, 10),
      status: "completed"
    },
    {
      id: "tx3",
      type: "deposit",
      amount: 1000,
      method: "Bank Transfer",
      date: new Date(2022, 4, 5),
      status: "completed"
    },
    {
      id: "tx4",
      type: "deposit",
      amount: 250,
      method: "Bitcoin",
      date: new Date(2022, 3, 28),
      status: "completed"
    }
  ]);

  const handleAddFunds = () => {
    const amount = parseFloat(addFundsAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to add to your wallet.",
        variant: "destructive"
      });
      return;
    }

    const newTransaction: Transaction = {
      id: `tx${transactions.length + 1}`,
      type: "deposit",
      amount: amount,
      method: paymentMethod === "card" ? "Credit Card" : 
              paymentMethod === "bank" ? "Bank Transfer" : 
              paymentMethod === "crypto" ? "Bitcoin" : 
              "UPI",
      date: new Date(),
      status: "completed"
    };

    setTransactions([newTransaction, ...transactions]);
    setBalance(prevBalance => prevBalance + amount);
    setAddFundsAmount("");

    toast({
      title: "Funds added successfully",
      description: `₹${amount.toLocaleString('en-IN')} has been added to your wallet.`,
      variant: "default"
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const getTransactionIcon = (type: string, method: string) => {
    if (type === "deposit") {
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    } else {
      return <ArrowUpRight className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Layout role="patient">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">HOSCARE Wallet</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-6">
            <WalletConnect />
          </div>
          
          <div className="md:col-span-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Available Balance</CardTitle>
                <CardDescription>Your current wallet balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">₹{balance.toLocaleString('en-IN')}</span>
                  <span className="ml-2 text-sm text-gray-500">INR</span>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      <Plus className="mr-2 h-4 w-4" /> Add Funds
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add funds to your wallet</DialogTitle>
                      <DialogDescription>
                        Choose your preferred payment method and enter the amount.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="amount" className="text-sm font-medium">
                          Amount
                        </label>
                        <Input
                          id="amount"
                          placeholder="Enter amount"
                          type="number"
                          value={addFundsAmount}
                          onChange={(e) => setAddFundsAmount(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <label htmlFor="payment-method" className="text-sm font-medium">
                          Payment Method
                        </label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                          <SelectTrigger id="payment-method">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="card">Credit/Debit Card</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="crypto">Cryptocurrency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {paymentMethod === "card" && (
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <CreditCard className="h-5 w-5 text-gray-500" />
                            <span className="text-sm">Connect your card for seamless transactions</span>
                          </div>
                        </div>
                      )}
                      
                      {paymentMethod === "upi" && (
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <QrCode className="h-5 w-5 text-gray-500" />
                            <span className="text-sm">Scan QR code or enter UPI ID</span>
                          </div>
                        </div>
                      )}
                      
                      {paymentMethod === "bank" && (
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <DollarSign className="h-5 w-5 text-gray-500" />
                            <span className="text-sm">Connect your bank account</span>
                          </div>
                        </div>
                      )}
                      
                      {paymentMethod === "crypto" && (
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Bitcoin className="h-5 w-5 text-gray-500" />
                            <span className="text-sm">Pay with Bitcoin, Ethereum or other cryptocurrencies</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <DialogFooter>
                      <Button onClick={handleAddFunds} className="bg-green-500 hover:bg-green-600">
                        Add Funds
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Transaction History</CardTitle>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {getTransactionIcon(transaction.type, transaction.method)}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.method}</p>
                            <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === "deposit" ? "+" : "-"}₹{transaction.amount.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No transactions to show
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wallet;
