
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  // Redirect to dashboard
  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);
  
  // Fallback content while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">HealChain</h1>
        <p className="text-gray-600">Loading blockchain healthcare system...</p>
      </div>
    </div>
  );
};

export default Index;
