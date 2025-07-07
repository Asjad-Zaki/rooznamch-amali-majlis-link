import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  userRole: 'admin' | 'member';
  userName: string;
  onLogout: () => void;
  onRoleSwitch?: () => void;
  notifications?: number;
  onNotificationClick?: () => void;
}

const Header = ({ userRole, userName, onLogout, onRoleSwitch, notifications = 0, onNotificationClick }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          {/* Logo and Title Section */}
          <div className="flex items-center space-x-3 sm:space-x-4 order-1 sm:order-1" dir="rtl">
            <img
              src="/lovable-uploads/e1652408-702e-47c9-834c-bafadef748e9.png"
              alt="Majlis e Dawatul Haq Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white p-1 flex-shrink-0"
            />
            <div className="text-center sm:text-right">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">مجلس دعوۃ الحق</h1>
              <span className="text-xs sm:text-sm opacity-90 block mt-0.5">ٹاسک  مینجمنٹ سسٹم</span>
            </div>
          </div>

          {/* User Actions Section */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 order-2 sm:order-2 flex-wrap justify-center sm:justify-end">
            {/* Notification Bell */}
            <div className="relative z-20"> {/* Increased z-index for visibility */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onNotificationClick}
                className="text-white hover:bg-white/10 relative p-2 sm:p-2.5"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                {notifications > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs min-w-0 rounded-full" // Ensure rounded-full
                  >
                    {notifications > 9 ? '9+' : notifications}
                  </Badge>
                )}
              </Button>
            </div>
            
            {/* User Welcome Text */}
            <div className="hidden sm:flex flex-col items-end text-right" dir="rtl">
              <span className="text-sm lg:text-base font-medium">خوش آمدید، {userName}</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs opacity-90">
                {userRole === 'admin' ? 'منتظم' : 'رکن'}
              </span>
            </div>

            {/* Mobile User Info */}
            <div className="flex sm:hidden items-center gap-2" dir="rtl">
              <span className="text-sm font-medium">{userName}</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {userRole === 'admin' ? 'منتظم' : 'رکن'}
              </span>
            </div>
            
            {/* Role Switch Button - Only for admin */}
            {userRole === 'admin' && onRoleSwitch && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRoleSwitch}
                className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:mr-2" />
                <span dir="rtl" className="hidden sm:inline">رکن کی نظر</span>
                <span dir="rtl" className="sm:hidden">رکن</span>
              </Button>
            )}
            
            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:mr-2" />
              <span dir="rtl" className="hidden sm:inline">لاگ آؤٹ</span>
              <span dir="rtl" className="sm:hidden">خروج</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;