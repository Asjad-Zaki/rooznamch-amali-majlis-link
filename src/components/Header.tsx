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
const Header = ({
  userRole,
  userName,
  onLogout,
  onRoleSwitch,
  notifications = 0,
  onNotificationClick
}: HeaderProps) => {
  return <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4" dir="rtl">
            <img src="/lovable-uploads/e1652408-702e-47c9-834c-bafadef748e9.png" alt="Majlis e Dawatul Haq Logo" className="h-12 w-12 rounded-full bg-white p-1" />
            <div>
              <h1 className="text-2xl font-bold">مجلس دعوۃ الحق</h1>
              <span className="text-sm opacity-90">ٹاسک منیجمنٹ سسٹم</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <Button variant="ghost" size="sm" onClick={onNotificationClick} className="text-white hover:bg-white/10 relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {notifications > 9 ? '9+' : notifications}
                  </Badge>}
              </Button>
            </div>
            
            
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs" dir="rtl">
              {userRole === 'admin' ? 'منتظم' : 'رکن'}
            </span>
            
            {/* Only show role switch for admin */}
            {userRole === 'admin' && onRoleSwitch && <Button variant="outline" size="sm" onClick={onRoleSwitch} className="border-white/30 text-inherit bg-inherit">
                <Users className="h-4 w-4 mr-2" />
                <span dir="rtl">رکن کی نظر</span>
              </Button>}
            
            <Button variant="outline" size="sm" onClick={onLogout} className="border-white/30 text-red-900 bg-inherit">
              <LogOut className="h-4 w-4 mr-2" />
              <span dir="rtl">لاگ آؤٹ</span>
            </Button>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;