import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Send, 
  Paperclip, 
  CheckCircle2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { mockPatients } from "@/data/mockPatients";
import { useAuth } from "@/context/AuthContext";
import { Doctor } from "@/data/mockDoctors";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: "doctor" | "patient";
  read: boolean;
}

interface Conversation {
  id: string;
  patientId: string;
  patientName: string;
  patientImage?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: Message[];
}

const DoctorMessages: React.FC = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const currentDoctor = currentUser.type === 'doctor' ? currentUser.data as Doctor : null;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  
  // Initialize conversations with mock patients
  const [conversations, setConversations] = useState<Conversation[]>(
    mockPatients.map((patient) => ({
      id: `conv-${patient.id}`,
      patientId: patient.id,
      patientName: patient.name,
      patientImage: patient.profileImage,
      lastMessage: "No messages yet",
      lastMessageTime: new Date().toLocaleTimeString(),
      unread: 0,
      messages: []
    }))
  );
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conversation) =>
    conversation.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getSelectedConversation = () => {
    return conversations.find((conv) => conv.id === selectedConversation);
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversation) {
        const newMessageObj = {
          id: `msg${Date.now()}`,
          content: newMessage,
          timestamp: new Date().toLocaleTimeString(),
          sender: "doctor" as const,
          read: true
        };
        
        return {
          ...conv,
          lastMessage: newMessage,
          lastMessageTime: "Just now",
          messages: [...conv.messages, newMessageObj]
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setNewMessage("");
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    });
  };
  
  const markAsRead = (conversationId: string) => {
    setConversations(
      conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unread: 0,
            messages: conv.messages.map((msg) => ({ ...msg, read: true }))
          };
        }
        return conv;
      })
    );
  };
  
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    markAsRead(conversationId);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-220px)]">
      <Card className="w-1/3 overflow-hidden flex flex-col">
        <CardContent className="p-0 flex-grow flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search patients..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="flex-grow">
            <div className="divide-y">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer ${
                    selectedConversation === conversation.id
                      ? "bg-indigo-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.patientImage} />
                        <AvatarFallback>
                          {conversation.patientName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.unread > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{conversation.patientName}</p>
                        <p className="text-xs text-gray-500">{conversation.lastMessageTime}</p>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="flex-grow overflow-hidden flex flex-col">
        <CardContent className="p-0 flex-grow flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={getSelectedConversation()?.patientImage} />
                    <AvatarFallback>
                      {getSelectedConversation()?.patientName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{getSelectedConversation()?.patientName}</p>
                    <p className="text-sm text-gray-500">
                      {mockPatients.find(p => p.id === getSelectedConversation()?.patientId)?.phone}
                    </p>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="flex-grow p-4">
                <div className="space-y-4">
                  {getSelectedConversation()?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "doctor" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === "doctor"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "doctor"
                              ? "text-indigo-200"
                              : "text-gray-500"
                          }`}
                        >
                          {message.timestamp}
                          {message.sender === "doctor" && (
                            <CheckCircle2
                              className={`inline ml-1 h-3 w-3 ${
                                message.read ? "text-indigo-200" : "text-indigo-400"
                              }`}
                            />
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Textarea
                    placeholder="Type a message..."
                    className="min-h-[2.5rem] max-h-[10rem]"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    className="shrink-0"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorMessages;
