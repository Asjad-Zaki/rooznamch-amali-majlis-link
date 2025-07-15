
import React, { useState, useEffect } from 'react';
import Header from './Header';
import TaskBoard from './TaskBoard';
import TaskModal from './TaskModal';
import UserManagement from './UserManagement';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';
import NotificationPanel from './NotificationPanel';
import { useDatabaseRealtime } from '@/contexts/DatabaseRealtimeContext';
import { useAuth } from '@/hooks/useAuth';
import { Task } from './TaskCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  userRole: 'admin' | 'member';
  userName: string;
  userId: string;
  onLogout: () => void;
  onRoleSwitch?: () => void;
  notifications: any[];
  onUpdateNotifications: (notifications: any[]) => void;
  viewMode?: 'admin' | 'member';
  actualRole?: 'admin' | 'member';
}

const Dashboard = ({
  userRole,
  userName,
  userId,
  onLogout,
  onRoleSwitch,
  notifications,
  onUpdateNotifications,
  viewMode = userRole,
  actualRole = userRole
}: DashboardProps) => {
  const { 
    tasks, 
    profiles,
    createTask,
    updateTask,
    deleteTask,
    markNotificationAsRead,
    deleteNotification,
    clearAllNotifications,
    isConnected,
    loading
  } = useDatabaseRealtime();
  
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  const handleAddTask = () => {
    if (userRole !== 'admin') return;
    setCurrentTask(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    if (userRole !== 'admin') return;
    setCurrentTask(task);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (userRole !== 'admin') return;
    await deleteTask(taskId);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'created_at'>) => {
    if (userRole !== 'admin') return;
    
    if (modalMode === 'create') {
      await createTask(taskData);
    } else if (currentTask) {
      await updateTask(currentTask.id, taskData);
    }
    setIsModalOpen(false);
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    if (userRole !== 'admin') return;
    await updateTask(taskId, { status: newStatus });
  };

  const handleMemberTaskUpdate = async (taskId: string, progress: number, member_notes: string) => {
    await updateTask(taskId, { progress, member_notes });
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.is_read);
    for (const notification of unreadNotifications) {
      await markNotificationAsRead(notification.id);
    }
  };

  const generatePDFReport = () => {
    try {
      console.log('Generating PDF report with tasks:', tasks.length);
      
      if (tasks.length === 0) {
        toast({
          title: "خرابی",
          description: "رپورٹ بنانے کے لیے کم از کم ایک ٹاسک ہونا ضروری ہے",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const currentDate = new Date().toLocaleDateString('ur-PK');
      const currentTime = new Date().toLocaleTimeString('ur-PK');
      
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

      const reportContent = `مجلس دعوۃ الحق - ٹاسک رپورٹ
============================================

تاریخ: ${currentDate}
وقت: ${currentTime}
رپورٹ تیار کردہ: ${userName}

خلاصہ:
========
کل ٹاسکس: ${tasks.length}
مکمل ہونے والے: ${tasks.filter(t => t.status === 'done').length}  
جاری: ${tasks.filter(t => t.status === 'inprogress').length}
جائزہ میں: ${tasks.filter(t => t.status === 'review').length}
باقی: ${tasks.filter(t => t.status === 'todo').length}

تفصیلی فہرست:
===============

${tasks.map((task, index) => `
${index + 1}. ٹاسک: ${task.title}
   تفصیل: ${task.description}
   ذمہ دار: ${task.assigned_to_name}
   حالت: ${statusLabels[task.status] || task.status}
   ترجیح: ${priorityLabels[task.priority] || task.priority}
   پیش قدمی: ${task.progress}%
   شروعاتی تاریخ: ${new Date(task.created_at).toLocaleDateString('ur-PK')}
   آخری تاریخ: ${new Date(task.due_date).toLocaleDateString('ur-PK')}
   رکن کی رپورٹ: ${task.member_notes || 'کوئی رپورٹ نہیں'}
   
-------------------------------------------
`).join('\n')}

رپورٹ مکمل ہونے کا وقت: ${new Date().toLocaleString('ur-PK')}
      `;

      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `majlis-task-report-${new Date().getTime()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "رپورٹ ڈاؤن لوڈ ہو گئی",
        description: `${tasks.length} ٹاسکس کی رپورٹ کامیابی سے ڈاؤن لوڈ ہو گئی`,
        duration: 3000,
      });

      console.log('PDF report generated successfully with', tasks.length, 'tasks');
    } catch (error) {
      console.error('Error generating PDF report:', error);
      toast({
        title: "خرابی",
        description: "رپورٹ بناتے وقت خرابی ہوئی",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  const handleNotificationClick = () => {
    console.log('Notification icon clicked, opening panel');
    setIsNotificationPanelOpen(true);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin shadow-2xl shadow-blue-500/25"></div>
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-white font-medium text-lg animate-pulse">
            لوڈ ہو رہا ہے...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>
      
      <div className="relative z-10">
        <Header 
          userRole={viewMode} 
          userName={userName}
          onLogout={handleLogout}
          notifications={unreadNotifications}
          onNotificationClick={handleNotificationClick}
        />
      </div>
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 relative z-10">
        <div className={`mb-2 text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? '🟢 ڈیٹابیس کنکشن فعال' : '🔴 ڈیٹابیس کنکشن منقطع'}
        </div>

        {viewMode === 'admin' ? (
          <div className="transform transition-all duration-700 animate-fade-in-up">
            <div className="mb-4 flex justify-end">
              <Button 
                onClick={generatePDFReport}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                dir="rtl"
              >
                <FileText className="h-4 w-4 ml-2" />
                PDF رپورٹ ({tasks.length})
              </Button>
            </div>

            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl shadow-blue-500/10 rounded-xl p-1">
                <TabsTrigger 
                  value="tasks" 
                  dir="rtl" 
                  className="text-sm sm:text-base font-medium transition-all duration-300"
                  onClick={() => setActiveTab('tasks')}
                >
                  ٹاسکس
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  dir="rtl" 
                  className="text-sm sm:text-base font-medium transition-all duration-300"
                  onClick={() => setActiveTab('users')}
                >
                  صارفین
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks" className="space-y-4 sm:space-y-6 lg:space-y-8">
                <DashboardStats tasks={tasks} userRole={viewMode} userName={userName} />
                <DashboardCharts tasks={tasks} />
                <TaskBoard
                  tasks={tasks}
                  userRole={viewMode}
                  userName={userName}
                  userId={userId}
                  onAddTask={actualRole === 'admin' ? handleAddTask : undefined}
                  onEditTask={actualRole === 'admin' ? handleEditTask : undefined}
                  onDeleteTask={actualRole === 'admin' ? handleDeleteTask : undefined}
                  onStatusChange={actualRole === 'admin' ? handleStatusChange : undefined}
                  onMemberTaskUpdate={handleMemberTaskUpdate}
                />
              </TabsContent>
              
              <TabsContent value="users">
                <UserManagement
                  onAddUser={() => {}}
                  onEditUser={() => {}}
                  onDeleteUser={() => {}}
                  onToggleUserStatus={() => {}}
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <DashboardStats tasks={tasks} userRole={viewMode} userName={userName} />
            <TaskBoard
              tasks={tasks}
              userRole={viewMode}
              userName={userName}
              userId={userId}
              onMemberTaskUpdate={handleMemberTaskUpdate}
            />
          </div>
        )}

        {actualRole === 'admin' && (
          <TaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveTask}
            task={currentTask}
            mode={modalMode}
          />
        )}

        <NotificationPanel
          notifications={notifications}
          isOpen={isNotificationPanelOpen}
          onClose={() => setIsNotificationPanelOpen(false)}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDeleteNotification={deleteNotification}
          onClearAll={clearAllNotifications}
        />
      </div>
    </div>
  );
};

export default Dashboard;
