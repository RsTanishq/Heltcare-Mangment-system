
import { Card, CardContent } from "@/components/ui/card";

const MobileAppPromo: React.FC = () => {
  return (
    <Card className="bg-green-50 border-none overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="font-medium text-gray-800">Have you tried</h3>
          <p className="font-medium text-gray-800">new Mobile Application?</p>
        </div>
        
        <div className="flex justify-center mb-4">
          <img 
            src="/lovable-uploads/548ba9c5-8472-4f97-aa24-f9ce70f53b9d.png" 
            alt="Mobile app preview" 
            className="h-32 object-contain"
          />
        </div>
        
        <div className="space-y-3">
          <button className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
            Try Now
          </button>
          <button className="w-full py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            Learn more
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileAppPromo;
