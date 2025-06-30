
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, Users } from 'lucide-react';

interface HeaderProps {
  userRole: 'admin' | 'member';
  userName: string;
  onLogout: () => void;
  onRoleSwitch?: () => void;
}

const Header = ({ userRole, userName, onLogout, onRoleSwitch }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4" dir="rtl">
            <h1 className="text-2xl font-bold">مجلس دعوۃ الحق</h1>
            <span className="text-sm opacity-90">ٹاسک منیجمنٹ سسٹم</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm" dir="rtl">خوش آمدید، {userName}</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs" dir="rtl">
              {userRole === 'admin' ? 'منتظم' : 'رکن'}
            </span>
            {onRoleSwitch && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRoleSwitch}
                className="text-white border-white/30 hover:bg-white/10"
              >
                <Users className="h-4 w-4 mr-2" />
                Switch Role
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-white border-white/30 hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span dir="rtl">لاگ آؤٹ</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
