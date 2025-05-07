import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DoctorProfileCardProps {
  name?: string;
  specialty?: string;
  hospital?: string;
  image?: string;
  registrationNumber?: string;
  yearsOfExperience?: string;
  workAddress?: string;
  appointmentLimit?: number;
  appointmentCount?: number;
}

const DoctorProfileCard: React.FC<DoctorProfileCardProps> = ({
  name = "Doctor",
  specialty = "Specialist",
  hospital = "Hospital",
  image,
  registrationNumber = "N/A",
  yearsOfExperience = "0",
  workAddress = "N/A",
  appointmentLimit = 100,
  appointmentCount = 0
}) => {
  const progressPercentage = (appointmentCount / appointmentLimit) * 100;
  const initials = name ? name.substring(0, 2).toUpperCase() : "DR";
  
  // Convert IPFS URL to HTTP URL if needed
  const imageUrl = image?.startsWith('ipfs://') 
    ? image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
    : image;
  
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center">
        <Avatar className="h-24 w-24">
          {imageUrl ? (
            <AvatarImage src={imageUrl} alt={name} />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
        
        <div className="mt-4 text-center space-y-2">
          <h3 className="text-xl font-bold text-indigo-800">{name || 'Doctor'}</h3>
          <p className="text-sm text-gray-500">{specialty || 'Specialist'}</p>
          <p className="text-sm text-gray-500">{hospital || 'Hospital'}</p>
          <p className="text-sm text-gray-500">Reg. No: {registrationNumber || 'N/A'}</p>
          <p className="text-sm text-gray-500">{yearsOfExperience || '0'} years of experience</p>
          <p className="text-sm text-gray-500">{workAddress || 'N/A'}</p>
        </div>
        
        <div className="mt-6 w-full">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{appointmentCount} People</span>
            <span className="text-gray-500">{appointmentCount}/{appointmentLimit}</span>
          </div>
          
          <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
            <div 
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <p className="text-xs text-gray-500 mt-1">Appointments Limit</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorProfileCard;
