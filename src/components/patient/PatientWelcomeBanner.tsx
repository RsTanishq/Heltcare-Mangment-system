import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface PatientWelcomeBannerProps {
  patientName?: string;
  patientImage?: string;
  nextAppointment?: {
    date: string;
    doctorName: string;
  };
}

const PatientWelcomeBanner: React.FC<PatientWelcomeBannerProps> = ({ 
  patientName = "Patient",
  patientImage,
  nextAppointment
}) => {
  const initials = (patientName ?? "PT").split(' ').map(n => n[0]).join('');

  // Convert IPFS URL to HTTP URL if needed
  const imageUrl = patientImage?.startsWith('ipfs://') 
    ? patientImage.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
    : patientImage;

  return (
    <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 bg-white/20">
            {imageUrl ? (
              <AvatarImage src={imageUrl} alt={patientName} />
            ) : (
              <AvatarFallback className="text-white text-xl">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div>
            <h2 className="text-2xl font-bold">Welcome, {patientName}</h2>
            <p className="text-indigo-100 mt-1">
              {nextAppointment 
                ? `Your next appointment is on ${nextAppointment.date} with Dr. ${nextAppointment.doctorName}`
                : "No upcoming appointments"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientWelcomeBanner; 