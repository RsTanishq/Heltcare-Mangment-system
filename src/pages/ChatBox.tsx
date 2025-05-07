
import { useState } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";

interface Message {
  id: string;
  sender: "user" | "doctor";
  content: string;
  timestamp: Date;
}

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "doctor",
      content: "Hello, how can I help you today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: "2",
      sender: "user",
      content: "I've been experiencing headaches lately",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "3",
      sender: "doctor",
      content: "I see. How long have you had these headaches?",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: message,
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
    
    // Simulate doctor response after a delay
    setTimeout(() => {
      const doctorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "doctor",
        content: "Thank you for sharing that information. I'll need more details to provide proper guidance.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, doctorResponse]);
    }, 2000);
  };

  return (
    <Layout role="patient">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Chat with Doctor</h1>
        
        <div className="bg-white rounded-xl shadow-sm h-[500px] flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar>
                <div className="bg-blue-200 h-full w-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">Dr</span>
                </div>
              </Avatar>
              <div>
                <h3 className="font-medium">Dr. Smith</h3>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[70%] rounded-xl p-3 ${
                    msg.sender === "user" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className={`text-xs ${msg.sender === "user" ? "text-blue-100" : "text-gray-500"} block mt-1`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t bg-gray-50">
            <div className="flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatBox;
