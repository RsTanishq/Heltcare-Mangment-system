import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DoctorWelcomeBannerProps {
  doctorName?: string;
  doctorImage?: string;
  specialty?: string;
  hospital?: string;
  yearsOfExperience?: string;
  newAppointments?: number;
  newMessages?: number;
}

const DoctorWelcomeBanner: React.FC<DoctorWelcomeBannerProps> = ({ 
  doctorName = "Doctor",
  doctorImage,
  specialty = "Specialist",
  hospital = "Hospital",
  yearsOfExperience = "0",
  newAppointments = 0,
  newMessages = 0
}) => {
  const initials = doctorName ? doctorName.split(' ').map(n => n[0]).join('') : "DR";

  const imageUrl = doctorImage?.startsWith('ipfs://') 
    ? doctorImage.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
    : doctorImage;

  return (
    <Card className="bg-indigo-600 text-white">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 bg-indigo-200">
            {imageUrl ? (
              <AvatarImage src={imageUrl} alt={doctorName} />
            ) : (
              <AvatarFallback className="text-indigo-600 text-xl">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div>
            <h2 className="text-2xl font-bold">Hello Dr. {doctorName || 'Doctor'}</h2>
            <p className="text-indigo-200 mt-1">
              Welcome back! You have {newAppointments} new appointment requests
              and {newMessages} messages waiting for your attention.
            </p>
          </div>
        </div>

        <div className="text-right">
          <h3 className="text-xl font-semibold">Dr. {doctorName || 'Doctor'}</h3>
          <p className="text-indigo-200">{specialty || 'Specialist'}</p>
          <p className="text-indigo-200">{hospital || 'Hospital'}</p>
          <p className="text-indigo-200">{yearsOfExperience || '0'} years of experience</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorWelcomeBanner;
