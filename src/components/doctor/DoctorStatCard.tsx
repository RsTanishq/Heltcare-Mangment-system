import React from 'react';
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface DoctorStatCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: {
    value: number;
    timeframe: string;
  };
  info?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  showProgress?: boolean;
  progressValue?: number;
}

const DoctorStatCard: React.FC<DoctorStatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  info,
  icon,
  color = 'blue',
  showProgress = false,
  progressValue = 0,
}) => {
  const bgColors = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50'
  };

  const textColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600'
  };

  const trendColors = {
    positive: 'text-green-600',
    negative: 'text-red-600'
  };

  return (
    <Card className={`${bgColors[color]} p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">{title}</span>
            {info && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{info}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="mt-2 flex items-baseline">
            <span className={`text-2xl font-bold ${textColors[color]}`}>{value}</span>
            {trend && (
              <span className={`ml-2 text-sm ${trend.value >= 0 ? trendColors.positive : trendColors.negative}`}>
                {trend.value >= 0 ? '+' : ''}{trend.value}% vs {trend.timeframe}
              </span>
            )}
          </div>
          <div className="mt-1 text-sm text-gray-500">{subtitle}</div>
        </div>
        {icon && <div className={`${textColors[color]}`}>{icon}</div>}
      </div>
      
      {showProgress && (
        <div className="mt-4">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${color === 'blue' ? 'bg-blue-600' : color === 'purple' ? 'bg-purple-600' : 'bg-green-600'}`}
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-gray-500">{progressValue}% of target</div>
        </div>
      )}
    </Card>
  );
};

export default DoctorStatCard;
