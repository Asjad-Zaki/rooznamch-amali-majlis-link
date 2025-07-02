import React, { useState, useEffect } from 'react';
import Header from './Header';
import TaskBoard from './TaskBoard';
import TaskModal from './TaskModal';
import UserManagement, { User } from './UserManagement';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';
import TaskManager from './TaskManager';
import NotificationPanel from './NotificationPanel';
import { useRealtime } from '@/contexts/RealtimeContext';
import { Task } from './TaskCard';
import { Notification } from './NotificationPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface DashboardProps {
  userRole: 'admin' | 'member';
  userName: string;
  userId: string;
  onLogout: () => void;
  onRoleSwitch?: () => void;
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  viewMode?: 'admin' | 'member';
  actualRole?: 'admin' | 'member';
}

const Dashboard = ({ 
  userRole, 
  userName, 
  userId, 
  onLogout, 
  onRoleSwitch, 
  users, 
  onUpdateUsers,
  viewMode = userRole,
  actualRole = userRole
}: DashboardProps) => {
  const { 
    tasks, 
    notifications, 
    updateTasks, 
    updateNotifications,
    deleteNotification,
    clearAllNotifications
  } = useRealtime();
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  // Initialize task manager with realtime data
  const taskManager = TaskManager({
    tasks,
    onUpdateTasks: updateTasks,
    userRole: actualRole,
    userName,
    notifications,
    onUpdateNotifications: updateNotifications
  });

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Log for debugging realtime updates
  useEffect(() => {
    console.log('Dashboard - Realtime tasks updated:', tasks);
    console.log('Dashboard - Realtime notifications updated:', notifications);
  }, [tasks, notifications]);

  const handleMarkAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    );
    updateNotifications(updatedNotifications);
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ 
      ...notification, 
      read: true 
    }));
    updateNotifications(updatedNotifications);
  };

  const generatePDFReport = () => {
    const reportContent = `
مجلس دعوۃ الحق - ٹاسک رپورٹ
تاریخ: ${new Date().toLocaleDateString('ur-PK')}

کل ٹاسکس: ${tasks.length}
مکمل ہونے والے: ${tasks.filter(t => t.status === 'done').length}
جاری: ${tasks.filter(t => t.status === 'inprogress').length}
جائزہ میں: ${tasks.filter(t => t.status === 'review').length}
باقی: ${tasks.filter(t => t.status === 'todo').length}

تفصیلی فہرست:
${tasks.map(task => `
ٹاسک: ${task.title}
تفصیل: ${task.description}
ذمہ دار: ${task.assignedTo}
حالت: ${task.status}
پیش قدمی: ${task.progress}%
آخری تاریخ: ${new Date(task.dueDate).toLocaleDateString('ur-PK')}
`).join('\n')}
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
  };

  // User management functions
  const handleAddUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    onUpdateUsers([...users, newUser]);
  };

  const handleEditUser = (user: User) => {
    onUpdateUsers(users.map(u => u.id === user.id ? user : u));
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      onUpdateUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const updatedUser = { ...user, isActive: !user.isActive };
      onUpdateUsers(users.map(u => u.id === userId ? updatedUser : u));
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin shadow-2xl shadow-blue-500/25"></div>
          <div className="absolute inset-0 w-16 h-16 m-2 border-4 border-transparent border-b-green-500 border-l-cyan-500 rounded-full animate-spin animation-delay-150 shadow-2xl shadow-green-500/25"></div>
          <div className="absolute inset-0 w-12 h-12 m-4 border-4 border-transparent border-t-pink-500 border-r-yellow-500 rounded-full animate-spin animation-delay-300 shadow-2xl shadow-pink-500/25"></div>
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-400/5 to-yellow-400/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 transform transition-all duration-500 hover:scale-[1.02] origin-top">
        <Header 
          userRole={viewMode} 
          userName={viewMode === 'member' && actualRole === 'admin' ? `${userName} (مانیٹرنگ موڈ)` : userName}
          onLogout={onLogout}
          onRoleSwitch={actualRole === 'admin' ? onRoleSwitch : undefined}
          notifications={unreadNotifications}
          onNotificationClick={() => setIsNotificationPanelOpen(true)}
        />
      </div>
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 relative z-10">
        {viewMode === 'admin' ? (
          <div className="transform transition-all duration-700 animate-fade-in-up">
            <div className="mb-4 flex justify-end">
              <Button 
                onClick={generatePDFReport}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                dir="rtl"
              >
                <FileText className="h-4 w-4 ml-2" />
                PDF رپورٹ
              </Button>
            </div>

            <Tabs defaultValue="tasks" className="w-full">
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
                <div className="transform transition-all duration-500 animate-slide-in-from-left">
                  <DashboardStats tasks={tasks} userRole={viewMode} userName={userName} />
                </div>
                
                <div className="transform transition-all duration-500 animate-slide-in-from-right animation-delay-200">
                  <DashboardCharts tasks={tasks} />
                </div>
                
                <div className="transform transition-all duration-500 animate-fade-in-up animation-delay-400">
                  <TaskBoard
                    tasks={tasks}
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
                    users={users}
                    onAddUser={handleAddUser}
                    onEditUser={handleEditUser}
                    onDeleteUser={handleDeleteUser}
                    onToggleUserStatus={handleToggleUserStatus}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 transform transition-all duration-700 animate-fade-in-up">
            <div className="transform transition-all duration-500 animate-slide-in-from-left">
              <DashboardStats tasks={tasks} userRole={viewMode} userName={userName} />
            </div>
            
            <div className="transform transition-all duration-500 animate-fade-in-up animation-delay-300">
              <TaskBoard
                tasks={tasks}
                userRole={viewMode}
                userName={userName}
                userId={userId}
                onMemberTaskUpdate={taskManager.handleMemberTaskUpdate}
              />
            </div>
          </div>
        )}

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

        <div className="transform transition-all duration-300">
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

      <style>{`
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
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-slide-in-from-left {
          animation: slide-in-from-left 0.7s ease-out forwards;
        }
        
        .animate-slide-in-from-right {
          animation: slide-in-from-right 0.7s ease-out forwards;
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
      `}</style>
    </div>
  );
};

export default Dashboard;
