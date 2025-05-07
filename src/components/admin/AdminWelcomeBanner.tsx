
import { Card } from "@/components/ui/card";

interface AdminWelcomeBannerProps {
  name: string;
}

const AdminWelcomeBanner: React.FC<AdminWelcomeBannerProps> = ({ name }) => {
  return (
    <Card className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Welcome back, {name}!</h2>
          <p className="text-indigo-100">
            Your HOSCARE dashboard is ready. Here's an overview of today's statistics.
          </p>
        </div>
        <img 
          src="/lovable-uploads/73138994-4f82-40dd-b0ac-e6e07a3af236.png" 
          alt="Doctors illustration" 
          className="h-32 hidden md:block"
        />
      </div>
    </Card>
  );
};

export default AdminWelcomeBanner;
