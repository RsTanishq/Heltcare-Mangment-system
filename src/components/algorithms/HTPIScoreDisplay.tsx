
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface HTPIScoreDisplayProps {
  score: number;
  title?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
}

const HTPIScoreDisplay: React.FC<HTPIScoreDisplayProps> = ({ 
  score, 
  title = "H-TPI Score", 
  showPercentage = false,
  size = "md" 
}) => {
  // Calculate priority percentage
  const percentage = Math.min(Math.round((score / 10) * 100), 100);
  
  // Determine color based on score
  const getColor = () => {
    if (score >= 5) return "text-green-600";
    if (score >= 2) return "text-yellow-600";
    return "text-red-600";
  };
  
  const getBackgroundColor = () => {
    if (score >= 5) return "bg-green-100";
    if (score >= 2) return "bg-yellow-100";
    return "bg-red-100";
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case "sm": return "text-lg";
      case "lg": return "text-4xl";
      default: return "text-2xl";
    }
  };

  return (
    <div className={`flex items-center ${size === "sm" ? "gap-2" : "gap-3"}`}>
      <div className={`${getBackgroundColor()} rounded-full p-3 flex items-center justify-center`}>
        <div className={`font-bold ${getColor()} ${getSizeClasses()}`}>
          {score.toFixed(2)}
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-1">
          <p className="font-medium text-gray-800">{title}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon size={14} className="text-gray-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs max-w-xs">
                  H-TPI (Healthcare Transaction Priority Index) rates the importance and urgency of healthcare transactions.
                  Higher scores indicate higher priority. <br/>
                  • 5+ = High Priority<br/>
                  • 2-5 = Medium Priority<br/>
                  • 0-2 = Low Priority
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {showPercentage && (
          <div className="text-sm text-gray-500">
            {percentage}% priority
          </div>
        )}
      </div>
    </div>
  );
};

export default HTPIScoreDisplay;
