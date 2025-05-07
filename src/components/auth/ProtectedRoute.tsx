import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('patient' | 'doctor' | 'admin')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        // If currentUser exists and has a type that's not null
        if (currentUser && currentUser.type) {
          // If allowedRoles is specified, check if user has the required role
          if (allowedRoles && allowedRoles.length > 0) {
            setIsAuthenticated(allowedRoles.includes(currentUser.type));
          } else {
            // If no specific roles are required, just check if user is authenticated
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [currentUser, allowedRoles]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">HealChain</h1>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the location they were trying to go to
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If they are authenticated and have the right role, show the children
  return <>{children}</>;
};

export default ProtectedRoute;
