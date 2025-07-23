
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Bell, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DatabaseService } from '@/services/DatabaseService';
import NotificationPanel from './NotificationPanel';
import { generatePDFReport } from '@/lib/pdf-generator';

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
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch notifications and tasks using React Query
  const { data: realtimeNotifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: DatabaseService.getNotifications,
    staleTime: 30 * 1000,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: DatabaseService.getTasks,
    staleTime: 30 * 1000,
  });

  // Notification mutations
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const clearAllNotificationsMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const unreadNotifications = realtimeNotifications.filter(n => !n.is_read).length;

  // Generate simple text report instead of PDF
  const generateReport = async () => {
    try {
      if (tasks.length === 0) {
        alert('رپورٹ بنانے کے لیے کم از کم ایک ٹاسک ہونا ضروری ہے');
        return;
      }

      // Generate PDF report
      await generatePDFReport(tasks, userName);
      alert(`PDF رپورٹ کامیابی سے ڈاؤن لوڈ ہو گئی! (${tasks.length} ٹاسکس شامل)`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('رپورٹ بناتے وقت خرابی ہوئی۔ دوبارہ کوشش کریں۔');
    }
  };

  const handleLogoutClick = () => {
    console.log('Logout button clicked');
    onLogout();
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white shadow-2xl backdrop-blur-sm animate-slideInFromTop">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            {/* Logo and Title Section */}
            <div className="flex items-center space-x-3 sm:space-x-4 order-1 sm:order-1 animate-fadeInLeft" dir="rtl">
              <div className="relative">
                <img src="/lovable-uploads/e1652408-702e-47c9-834c-bafadef748e9.png" alt="Majlis e Dawatul Haq Logo" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white p-1 flex-shrink-0 hover:scale-110 transition-transform duration-300 shadow-lg animate-bounceIn" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-30 animate-pulse"></div>
              </div>
              <div className="text-center sm:text-right">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent animate-fadeInDown">مجلس دعوۃ الحق</h1>
                <span className="text-sm sm:text-base opacity-90 block mt-1 animate-fadeInDown delay-100">ٹاسک  مینجمنٹ سسٹم</span>
              </div>
            </div>

            {/* User Actions Section */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 order-2 sm:order-2 flex-wrap justify-center sm:justify-end animate-fadeInRight">
              {/* Report Generation Button - Only for admin */}
              {userRole === 'admin' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={generateReport}
                  className="text-white hover:bg-white/20 p-2 sm:p-2.5 rounded-xl hover:scale-110 transition-all duration-300 hover:shadow-lg"
                  title="Generate Report"
                >
                  <Download className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce" />
                </Button>
              )}
              
              {/* Notification Bell */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsNotificationPanelOpen(true)}
                  className="text-white hover:bg-white/20 relative p-2 sm:p-2.5 rounded-xl hover:scale-110 transition-all duration-300 hover:shadow-lg"
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs min-w-0 rounded-full animate-bounce shadow-lg">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </div>
              
              {/* User Welcome Text */}
              <div className="hidden sm:flex flex-col items-end text-right animate-fadeInDown delay-200" dir="rtl">
                <span className="text-sm lg:text-base font-medium bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">خوش آمدید، {userName}</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs opacity-90 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300">
                  {userRole === 'admin' ? 'منتظم' : 'رکن'}
                </span>
              </div>

              {/* Mobile User Info */}
              <div className="flex sm:hidden items-center gap-2 animate-fadeInUp delay-300" dir="rtl">
                <span className="text-sm font-medium">{userName}</span>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs backdrop-blur-sm border border-white/30">
                  {userRole === 'admin' ? 'منتظم' : 'رکن'}
                </span>
              </div>
              
              {/* Role Switch Button - Only for admin */}
              {userRole === 'admin' && onRoleSwitch && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRoleSwitch}
                  className="text-white border-white/30 hover:bg-white/20 hover:border-white/60 transition-all duration-300 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:mr-2 animate-pulse" />
                  <span dir="rtl" className="hidden sm:inline">رکن کی نظر</span>
                  <span dir="rtl" className="sm:hidden">رکن</span>
                </Button>
              )}
              
              {/* Logout Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogoutClick}
                className="text-white border-white/30 hover:bg-red-500/20 hover:border-red-300/60 transition-all duration-300 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                disabled={false}
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:mr-2 hover:animate-spin" />
                <span dir="rtl" className="hidden sm:inline">لاگ آؤٹ</span>
                <span dir="rtl" className="sm:hidden">خروج</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Panel */}
      <NotificationPanel
        notifications={realtimeNotifications}
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        onMarkAsRead={markAsReadMutation.mutate}
        onMarkAllAsRead={markAllAsReadMutation.mutate}
        onDeleteNotification={deleteNotificationMutation.mutate}
        onClearAll={clearAllNotificationsMutation.mutate}
      />
    </>
  );
};

export default Header;
