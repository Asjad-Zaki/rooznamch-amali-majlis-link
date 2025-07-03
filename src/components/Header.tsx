
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Bell, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRealtime } from '@/contexts/RealtimeContext';
import { useNotificationHandler } from './NotificationHandler';
import NotificationPanel from './NotificationPanel';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const { notifications: realtimeNotifications, tasks, deleteNotification, clearAllNotifications } = useRealtime();
  
  const {
    isNotificationPanelOpen,
    setIsNotificationPanelOpen,
    handleMarkAsRead,
    handleMarkAllAsRead,
    unreadNotifications
  } = useNotificationHandler({
    notifications: realtimeNotifications,
    onUpdateNotifications: (updatedNotifications) => {
      // This will be handled by the realtime context
    }
  });

  const generatePDFReport = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add header image
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = '/lovable-uploads/2dbef948-c996-4222-9241-afa8cbb093b0.png';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        
        // Add image to PDF (centered at top)
        const imgWidth = 180; // Adjust as needed
        const imgHeight = 40; // Adjust as needed
        const x = (pageWidth - imgWidth) / 2;
        pdf.addImage(img, 'PNG', x, 10, imgWidth, imgHeight);
      } catch (error) {
        console.log('Could not load header image, continuing without it');
      }

      // Add title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Task Management Report', pageWidth / 2, 70, { align: 'center' });
      
      // Add date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 80, { align: 'center' });
      
      let yPosition = 100;
      
      // Task Summary
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Task Summary:', 20, yPosition);
      yPosition += 15;
      
      const todoTasks = tasks.filter(t => t.status === 'todo').length;
      const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
      const reviewTasks = tasks.filter(t => t.status === 'review').length;
      const doneTasks = tasks.filter(t => t.status === 'done').length;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Total Tasks: ${tasks.length}`, 25, yPosition);
      yPosition += 8;
      pdf.text(`To Do: ${todoTasks}`, 25, yPosition);
      yPosition += 8;
      pdf.text(`In Progress: ${inProgressTasks}`, 25, yPosition);
      yPosition += 8;
      pdf.text(`Under Review: ${reviewTasks}`, 25, yPosition);
      yPosition += 8;
      pdf.text(`Completed: ${doneTasks}`, 25, yPosition);
      yPosition += 20;
      
      // Task Details
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Task Details:', 20, yPosition);
      yPosition += 15;
      
      tasks.forEach((task, index) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}. ${task.title}`, 25, yPosition);
        yPosition += 8;
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Assigned to: ${task.assignedTo}`, 30, yPosition);
        yPosition += 6;
        pdf.text(`Status: ${task.status}`, 30, yPosition);
        yPosition += 6;
        pdf.text(`Priority: ${task.priority}`, 30, yPosition);
        yPosition += 6;
        pdf.text(`Progress: ${task.progress}%`, 30, yPosition);
        yPosition += 6;
        pdf.text(`Due Date: ${task.dueDate}`, 30, yPosition);
        yPosition += 10;
      });
      
      // Save the PDF
      pdf.save(`task-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report');
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            {/* Logo and Title Section */}
            <div className="flex items-center space-x-3 sm:space-x-4 order-1 sm:order-1" dir="rtl">
              <img src="/lovable-uploads/e1652408-702e-47c9-834c-bafadef748e9.png" alt="Majlis e Dawatul Haq Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white p-1 flex-shrink-0" />
              <div className="text-center sm:text-right">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">مجلس دعوۃ الحق</h1>
                <span className="text-xs sm:text-sm opacity-90 block mt-0.5 my-[10px]">ٹاسک  مینجمنٹ سسٹم</span>
              </div>
            </div>

            {/* User Actions Section */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 order-2 sm:order-2 flex-wrap justify-center sm:justify-end">
              {/* PDF Generation Button - Only for admin */}
              {userRole === 'admin' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={generatePDFReport}
                  className="text-white hover:bg-white/10 p-2 sm:p-2.5"
                  title="Generate PDF Report"
                >
                  <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              )}
              
              {/* Notification Bell */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsNotificationPanelOpen(true)}
                  className="text-white hover:bg-white/10 relative p-2 sm:p-2.5"
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs min-w-0">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </Badge>
                  )}
                </Button>
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
                  className="border-white/30 hover:border-white/50 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 text-inherit bg-inherit"
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
                className="border-white/30 hover:border-white/50 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 bg-inherit text-red-900"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:mr-2" />
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
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDeleteNotification={deleteNotification}
        onClearAll={clearAllNotifications}
      />
    </>
  );
};

export default Header;
