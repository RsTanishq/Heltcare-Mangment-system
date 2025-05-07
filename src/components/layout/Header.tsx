import { Bell, Search, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  role: "patient" | "doctor" | "admin";
}

const Header: React.FC<HeaderProps> = ({ role }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<number>(0);

  // Get user's initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center flex-1">
          <h1 className="text-xl font-semibold text-gray-900">
            {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
          </h1>
          <div className="ml-8 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search Anything..."
                className="w-full max-w-md pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/wallet">
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Wallet className="mr-2" size={20} />
              Wallet
            </button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="relative">
                <Bell size={24} className="text-gray-600 hover:text-gray-900" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>No new notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  {currentUser?.data?.profileImage ? (
                    <AvatarImage src={currentUser.data.profileImage} />
                  ) : (
                    <AvatarFallback>
                      {getInitials(currentUser?.data?.fullName || 'U')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-sm text-right">
                  <p className="font-medium text-gray-900">{currentUser?.data?.fullName}</p>
                  <p className="text-gray-500">{role}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
