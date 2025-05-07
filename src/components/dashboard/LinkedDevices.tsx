
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Watch, Stethoscope } from "lucide-react";

interface Device {
  id: string;
  name: string;
  model: string;
  icon: string;
}

interface LinkedDevicesProps {
  devices: Device[];
}

const LinkedDevices: React.FC<LinkedDevicesProps> = ({ devices }) => {
  const getDeviceIcon = (iconName: string) => {
    switch (iconName) {
      case 'watch':
        return <Watch className="h-5 w-5" />;
      case 'stethoscope':
        return <Stethoscope className="h-5 w-5" />;
      default:
        return <Watch className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Linked Device</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center">
              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                {getDeviceIcon(device.icon)}
              </div>
              <div>
                <h3 className="font-medium text-sm">{device.name}</h3>
                <p className="text-xs text-gray-500">{device.model}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedDevices;
