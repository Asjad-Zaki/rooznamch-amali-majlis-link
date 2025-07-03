
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Bell, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRealtime } from '@/contexts/RealtimeContext';
import { useNotificationHandler } from './NotificationHandler';
import NotificationPanel from './NotificationPanel';
import jsPDF from 'jspdf';

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
      console.log('Generating PDF report with proper Urdu formatting...');
      
      if (tasks.length === 0) {
        alert('رپورٹ بنانے کے لیے کم از کم ایک ٹاسک ہونا ضروری ہے');
        return;
      }

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
          setTimeout(reject, 5000); // Timeout after 5 seconds
        });
        
        // Add image to PDF (centered at top)
        const imgWidth = 160;
        const imgHeight = 35;
        const x = (pageWidth - imgWidth) / 2;
        pdf.addImage(img, 'PNG', x, 10, imgWidth, imgHeight);
      } catch (error) {
        console.log('Could not load header image, continuing without it');
      }

      let yPosition = 60;
      
      // Add title in Urdu
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('مجلس دعوۃ الحق - ٹاسک رپورٹ', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Add date in Urdu format
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString('ur-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.text(`تاریخ: ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;
      pdf.text(`رپورٹ تیار کردہ: ${userName}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;
      
      // Task Summary in Urdu
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('خلاصہ:', 20, yPosition);
      yPosition += 12;
      
      const todoTasks = tasks.filter(t => t.status === 'todo').length;
      const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
      const reviewTasks = tasks.filter(t => t.status === 'review').length;
      const doneTasks = tasks.filter(t => t.status === 'done').length;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`کل ٹاسکس: ${tasks.length}`, 25, yPosition);
      yPosition += 7;
      pdf.text(`کرنا ہے: ${todoTasks}`, 25, yPosition);
      yPosition += 7;
      pdf.text(`جاری: ${inProgressTasks}`, 25, yPosition);
      yPosition += 7;
      pdf.text(`جائزہ: ${reviewTasks}`, 25, yPosition);
      yPosition += 7;
      pdf.text(`مکمل: ${doneTasks}`, 25, yPosition);
      yPosition += 15;
      
      // Task Details in Urdu
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('تفصیلی فہرست:', 20, yPosition);
      yPosition += 12;
      
      const statusLabels = {
        todo: 'کرنا ہے',
        inprogress: 'جاری',
        review: 'جائزہ',
        done: 'مکمل'
      };

      const priorityLabels = {
        high: 'زیادہ',
        medium: 'درمیانہ',
        low: 'کم'
      };
      
      tasks.forEach((task, index) => {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}. ${task.title}`, 25, yPosition);
        yPosition += 7;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        
        // Wrap long descriptions
        if (task.description) {
          const descLines = pdf.splitTextToSize(`تفصیل: ${task.description}`, pageWidth - 60);
          pdf.text(descLines, 30, yPosition);
          yPosition += descLines.length * 5;
        }
        
        pdf.text(`ذمہ دار: ${task.assignedTo}`, 30, yPosition);
        yPosition += 5;
        pdf.text(`حالت: ${statusLabels[task.status]}`, 30, yPosition);
        yPosition += 5;
        pdf.text(`ترجیح: ${priorityLabels[task.priority]}`, 30, yPosition);
        yPosition += 5;
        pdf.text(`پیش قدمی: ${task.progress}%`, 30, yPosition);
        yPosition += 5;
        
        const dueDate = new Date(task.dueDate).toLocaleDateString('ur-PK');
        pdf.text(`آخری تاریخ: ${dueDate}`, 30, yPosition);
        yPosition += 5;
        
        if (task.memberNotes) {
          const notesLines = pdf.splitTextToSize(`رکن کی رپورٹ: ${task.memberNotes}`, pageWidth - 60);
          pdf.text(notesLines, 30, yPosition);
          yPosition += notesLines.length * 5;
        }
        
        yPosition += 8; // Space between tasks
      });
      
      // Add footer
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`صفحہ ${i} از ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
      
      // Save the PDF with proper filename
      const fileName = `majlis-task-report-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      console.log('PDF report generated successfully:', fileName);
      alert(`رپورٹ کامیابی سے ڈاؤن لوڈ ہو گئی: ${tasks.length} ٹاسکس`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('رپورٹ بناتے وقت خرابی ہوئی۔ دوبارہ کوشش کریں۔');
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
