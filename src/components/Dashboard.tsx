import React, { useState, useEffect } from 'react';
import Header from './Header';
import TaskBoard from './TaskBoard';
import TaskModal from './TaskModal';
import UserManagement from './UserManagement';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';
import TaskManager from './TaskManager';
import NotificationPanel from './NotificationPanel';
import { useNotificationHandler } from './NotificationHandler';
import { Task } from './TaskCard';
import { Notification } from './NotificationPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface DashboardProps {
  userRole: 'admin' | 'member';
  userName: string;
  userId: string;
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
  useEffect(() => {
    console.log('Dashboard - Current tasks:', tasks);
    console.log('Dashboard - ViewMode:', viewMode, 'ActualRole:', actualRole);
    console.log('Dashboard - Notifications:', notifications);
  }, [tasks, viewMode, actualRole, notifications]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-400/5 to-yellow-400/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

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
                  onClick={() => setActiveTab('tasks')}
                >
                  ٹاسکس
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  dir="rtl" 
                  className="text-sm sm:text-base font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/30 data-[state=active]:transform data-[state=active]:scale-105 rounded-lg"
                  onClick={() => setActiveTab('users')}
                >
                  صارفین
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks" className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Stats with Staggered Animation */}
                <div className="transform transition-all duration-500 animate-slide-in-from-left">
                  <DashboardStats tasks={tasks || []} userRole={viewMode} userName={userName} />
                </div>
                
                {/* Charts with Delay Animation */}
                <div className="transform transition-all duration-500 animate-slide-in-from-right animation-delay-200">
                  <DashboardCharts tasks={tasks || []} />
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
              </TabsContent>
            </Tabs>
          </div>
        ) : (
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
            />
          </div>
        )}

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