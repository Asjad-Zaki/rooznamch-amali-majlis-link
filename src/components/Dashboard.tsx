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
<<<<<<< HEAD
import { Button } from '@/components/ui/button'; // Import Button
import { FileText } from 'lucide-react'; // Import FileText icon
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { generateTasksReportPdf } from '@/lib/pdf-generator'; // Import the PDF generator
=======
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3

interface DashboardProps {
  userRole: 'admin' | 'member';
  userName: string;
  userId: string;
<<<<<<< HEAD
  onLogout: () => void;
  onRoleSwitch?: () => void;
  notifications: Notification[]; // This prop will now be managed internally by Dashboard's fetch
  onUpdateNotifications: (notifications: Notification[]) => void; // This prop will now be managed internally by Dashboard's fetch
  viewMode?: 'admin' | 'member';
  actualRole?: 'admin' | 'member';
}

const Dashboard = ({
  userRole,
  userName,
  userId,
  onLogout,
  onRoleSwitch,
  // notifications, // No longer directly passed as prop, fetched internally
  // onUpdateNotifications, // No longer directly passed as prop, managed by react-query
  viewMode = userRole,
  actualRole = userRole
}: DashboardProps) => {
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');

  // Fetch tasks from Supabase
  const { data: tasks, isLoading: isLoadingTasks, error: tasksError } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tasks').select('*');
      if (error) throw error;
      return data as Task[];
    },
  });

  // Fetch notifications from Supabase
  const { data: notifications, isLoading: isLoadingNotifications, error: notificationsError } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Notification[];
    },
  });

  // Use notification handler hook
  const notificationHandler = useNotificationHandler({
    notifications: notifications || [], // Pass fetched notifications
  });

  // Initialize task manager
  const taskManager = TaskManager({
    tasks: tasks || [],
    onUpdateTasks: () => {}, // No longer needed as react-query handles invalidation
    userRole: actualRole,
    userName,
    notifications: notifications || [], // Pass fetched notifications
    onUpdateNotifications: () => {} // No longer needed as react-query handles invalidation
  });

  // Initial loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingInitial(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Log for debugging
=======
  actualRole: 'admin' | 'member';
  viewMode: 'admin' | 'member';
}

const Dashboard = ({ 
  userRole, 
  userName, 
  userId,
  actualRole,
  viewMode
}: DashboardProps) => {
  const { 
    tasks, 
    notifications,
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

>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

<<<<<<< HEAD
  const handleGenerateReport = () => {
    if (tasks) {
      generateTasksReportPdf(tasks, userName);
    }
  };

  if (isLoadingInitial || isLoadingTasks || isLoadingNotifications) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          {/* 3D Loading Spinner */}
          <div className="w-20 h-20 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin shadow-2xl shadow-blue-500/25"></div>
          <div className="absolute inset-0 w-16 h-16 m-2 border-4 border-transparent border-b-green-500 border-l-cyan-500 rounded-full animate-spin animation-delay-150 shadow-2xl shadow-green-500/25"></div>
          <div className="absolute inset-0 w-12 h-12 m-4 border-4 border-transparent border-t-pink-500 border-r-yellow-500 rounded-full animate-spin animation-delay-300 shadow-2xl shadow-pink-500/25"></div>
          
          {/* Loading Text */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-white font-medium text-lg animate-pulse">
            لوڈ ہو رہا ہے...
          </div>
        </div>
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800">
        <p dir="rtl">ٹاسکس لوڈ کرنے میں خرابی: {tasksError.message}</p>
      </div>
    );
  }

  if (notificationsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800">
        <p dir="rtl">اطلاعات لوڈ کرنے میں خرابی: {notificationsError.message}</p>
      </div>
    );
  }
=======
  const handleLogout = async () => {
    await signOut();
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

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
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

  const handleMemberTaskUpdate = async (taskId: string, progress: number, memberNotes: string) => {
    await updateTask(taskId, { progress, memberNotes });
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
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
   ذمہ دار: ${task.assignedTo}
   حالت: ${statusLabels[task.status] || task.status}
   ترجیح: ${priorityLabels[task.priority] || task.priority}
   پیش قدمی: ${task.progress}%
   شروعاتی تاریخ: ${new Date(task.createdAt).toLocaleDateString('ur-PK')}
   آخری تاریخ: ${new Date(task.dueDate).toLocaleDateString('ur-PK')}
   رکن کی رپورٹ: ${task.memberNotes || 'کوئی رپورٹ نہیں'}
   
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
>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3

  const unreadNotifications = notifications.filter(n => !n.read).length;

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
<<<<<<< HEAD
      {/* Animated Background Elements */}
=======
>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-400/5 to-yellow-400/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>
<<<<<<< HEAD

      {/* Header with 3D Effect */}
      <div className="relative z-10 transform transition-all duration-500 hover:scale-[1.02] origin-top">
        <Header 
          userRole={viewMode} 
          userName={viewMode === 'member' && actualRole === 'admin' ? `${userName} (مانیٹرنگ موڈ)` : userName}
          onLogout={onLogout}
          onRoleSwitch={actualRole === 'admin' ? onRoleSwitch : undefined}
          notifications={notificationHandler.unreadNotifications}
          onNotificationClick={() => notificationHandler.setIsNotificationPanelOpen(true)}
        />
      </div>
      
      {/* Main Content with 3D Cards */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 relative z-10">
        {viewMode === 'admin' ? (
          <div className="transform transition-all duration-700 animate-fade-in-up">
            <Tabs defaultValue="tasks" className="w-full">
              {/* Enhanced TabsList with 3D Effects */}
              <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl shadow-blue-500/10 rounded-xl p-1 transform transition-all duration-300 hover:shadow-3xl hover:shadow-blue-500/20">
                <TabsTrigger 
                  value="tasks" 
                  dir="rtl" 
                  className="text-sm sm:text-base font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 data-[state=active]:transform data-[state=active]:scale-105 rounded-lg"
=======
      
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
        {/* Connection status indicator */}
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
>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3
                  onClick={() => setActiveTab('tasks')}
                >
                  ٹاسکس
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  dir="rtl" 
<<<<<<< HEAD
                  className="text-sm sm:text-base font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/30 data-[state=active]:transform data-[state=active]:scale-105 rounded-lg"
=======
                  className="text-sm sm:text-base font-medium transition-all duration-300"
>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3
                  onClick={() => setActiveTab('users')}
                >
                  صارفین
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks" className="space-y-4 sm:space-y-6 lg:space-y-8">
<<<<<<< HEAD
                {/* Stats with Staggered Animation */}
                <div className="transform transition-all duration-500 animate-slide-in-from-left">
                  <DashboardStats tasks={tasks || []} userRole={viewMode} userName={userName} />
                </div>
                
                {/* Charts with Delay Animation */}
                <div className="transform transition-all duration-500 animate-slide-in-from-right animation-delay-200">
                  <DashboardCharts tasks={tasks || []} />
                </div>

                {/* Generate Report Button */}
                <div className="flex justify-end mb-4">
                  <Button onClick={handleGenerateReport} className="bg-purple-600 hover:bg-purple-700 text-white" dir="rtl">
                    <FileText className="h-4 w-4 ml-2" />
                    رپورٹ بنائیں
                  </Button>
                </div>
                
                {/* Task Board with Final Animation */}
                <div className="transform transition-all duration-500 animate-fade-in-up animation-delay-400">
                  <TaskBoard
                    tasks={tasks || []}
                    userRole={viewMode}
                    userName={userName}
                    userId={userId}
                    onAddTask={actualRole === 'admin' ? taskManager.handleAddTask : undefined}
                    onEditTask={actualRole === 'admin' ? taskManager.handleEditTask : undefined}
                    onDeleteTask={actualRole === 'admin' ? taskManager.handleDeleteTask : undefined}
                    onStatusChange={actualRole === 'admin' ? taskManager.handleStatusChange : undefined}
                    onMemberTaskUpdate={taskManager.handleMemberTaskUpdate}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="users">
                <div className="transform transition-all duration-500 animate-fade-in-up">
                  <UserManagement
                    // No props needed here anymore, UserManagement fetches its own data
                  />
                </div>
=======
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
                  users={profiles.map(p => ({
                    id: p.id,
                    name: p.name,
                    email: p.email,
                    role: p.role,
                    password: '',
                    secretNumber: p.secret_number,
                    createdAt: p.created_at,
                    isActive: p.is_active
                  }))}
                  onAddUser={() => {}}
                  onEditUser={() => {}}
                  onDeleteUser={() => {}}
                  onToggleUserStatus={() => {}}
                />
>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3
              </TabsContent>
            </Tabs>
          </div>
        ) : (
<<<<<<< HEAD
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 transform transition-all duration-700 animate-fade-in-up">
            {/* Member View with Enhanced Animations */}
            <div className="transform transition-all duration-500 animate-slide-in-from-left">
              <DashboardStats tasks={tasks || []} userRole={viewMode} userName={userName} />
            </div>
            
            <div className="transform transition-all duration-500 animate-fade-in-up animation-delay-300">
              <TaskBoard
                tasks={tasks || []}
                userRole={viewMode}
                userName={userName}
                userId={userId}
                onMemberTaskUpdate={taskManager.handleMemberTaskUpdate}
              />
            </div>
          </div>
        )}

        {/* Enhanced Task Modal with 3D Effects */}
        {actualRole === 'admin' && (
          <div className="transform transition-all duration-300">
            <TaskModal
              isOpen={taskManager.isModalOpen}
              onClose={() => taskManager.setIsModalOpen(false)}
              onSave={taskManager.handleSaveTask}
              task={taskManager.currentTask}
              mode={taskManager.modalMode}
=======
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <DashboardStats tasks={tasks} userRole={viewMode} userName={userName} />
            <TaskBoard
              tasks={tasks}
              userRole={viewMode}
              userName={userName}
              userId={userId}
              onMemberTaskUpdate={handleMemberTaskUpdate}
>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3
            />
          </div>
        )}

<<<<<<< HEAD
        {/* Enhanced Notification Panel */}
        <div className="transform transition-all duration-300">
          <NotificationPanel
            notifications={notifications || []} // Pass fetched notifications
            isOpen={notificationHandler.isNotificationPanelOpen}
            onClose={() => notificationHandler.setIsNotificationPanelOpen(false)}
            onMarkAsRead={notificationHandler.handleMarkAsRead}
            onMarkAllAsRead={notificationHandler.handleMarkAllAsRead}
            onDelete={notificationHandler.handleDeleteNotification}
          />
        </div>
=======
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
>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3
      </div>

      {/* Enhanced Mobile-First Responsive Styles */}
      <style>{`
        /* Custom animations */
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slide-in-from-left {
          from {
            opacity: 0;
            transform: translateX(-50px) rotateY(-10deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotateY(0deg);
          }
        }
        
        @keyframes slide-in-from-right {
          from {
            opacity: 0;
            transform: translateX(50px) rotateY(10deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotateY(0deg);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15); }
          50% { box-shadow: 0 8px 40px rgba(59, 130, 246, 0.25); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-slide-in-from-left {
          animation: slide-in-from-left 0.7s ease-out forwards;
        }
        
        .animate-slide-in-from-right {
          animation: slide-in-from-right 0.7s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }

        /* 3D Card Effects */
        .card-3d {
          transform-style: preserve-3d;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-3d:hover {
          transform: translateY(-8px) rotateX(5deg) rotateY(5deg);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        /* Glass morphism effect */
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Mobile-first responsive improvements */
        @media (max-width: 640px) {
          .container {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          
          .animate-fade-in-up {
            animation-duration: 0.4s;
          }
          
          .card-3d:hover {
            transform: translateY(-4px) rotateX(2deg) rotateY(2deg);
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }

        /* Enhanced shadow effects */
        .shadow-3xl {
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.05);
        }
        
        .shadow-glow-blue {
          box-shadow: 
            0 4px 20px rgba(59, 130, 246, 0.15),
            0 0 0 1px rgba(59, 130, 246, 0.1);
        }
        
        .shadow-glow-green {
          box-shadow: 
            0 4px 20px rgba(34, 197, 94, 0.15),
            0 0 0 1px rgba(34, 197, 94, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;