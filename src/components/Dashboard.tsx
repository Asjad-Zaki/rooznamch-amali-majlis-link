import React, { useState, useEffect } from 'react';
import Header from './Header';
import TaskBoard from './TaskBoard';
import TaskModal from './TaskModal';
import UserManagement, { User } from './UserManagement';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';
import TaskManager from './TaskManager';
import NotificationPanel from './NotificationPanel';
import { useNotificationHandler } from './NotificationHandler';
import { Task } from './TaskCard';
import { Notification } from './NotificationPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DashboardProps {
  userRole: 'admin' | 'member';
  userName: string;
  userId: string;
  onLogout: () => void;
  onRoleSwitch?: () => void;
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  notifications: Notification[];
  onUpdateNotifications: (notifications: Notification[]) => void;
  viewMode?: 'admin' | 'member'; // New prop for view mode
  actualRole?: 'admin' | 'member'; // New prop to track actual role
}

const Dashboard = ({ 
  userRole, 
  userName, 
  userId, 
  onLogout, 
  onRoleSwitch, 
  users, 
  onUpdateUsers,
  notifications,
  onUpdateNotifications,
  viewMode = userRole,
  actualRole = userRole
}: DashboardProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'ویب سائٹ کی ڈیزائن',
      description: 'نئی ویب سائٹ کے لیے UI/UX ڈیزائن تیار کرنا',
      status: 'todo',
      priority: 'high',
      assignedTo: 'احمد علی',
      createdAt: '2024-01-01',
      dueDate: '2024-01-15',
      progress: 0,
      memberNotes: ''
    },
    {
      id: '2',
      title: 'ڈیٹابیس کا سیٹ اپ',
      description: 'پروجیکٹ کے لیے ڈیٹابیس کی تشکیل اور کنفیگریشن',
      status: 'inprogress',
      priority: 'medium',
      assignedTo: 'فاطمہ خان',
      createdAt: '2024-01-02',
      dueDate: '2024-01-20',
      progress: 30,
      memberNotes: 'ڈیٹابیس کی بنیادی ساخت مکمل ہو گئی'
    },
    {
      id: '3',
      title: 'ٹیسٹنگ اور ڈیبگنگ',
      description: 'سافٹ ویئر میں موجود مسائل کی تشخیص اور حل',
      status: 'review',
      priority: 'high',
      assignedTo: 'محمد حسن',
      createdAt: '2024-01-03',
      dueDate: '2024-01-18',
      progress: 80,
      memberNotes: 'اہم bugs حل ہو گئے، فائنل ٹیسٹنگ باقی ہے'
    },
    {
      id: '4',
      title: 'دستاویزات کی تیاری',
      description: 'پروجیکٹ کی مکمل دستاویزات اور رپورٹس',
      status: 'done',
      priority: 'low',
      assignedTo: 'عائشہ سلیم',
      createdAt: '2024-01-04',
      dueDate: '2024-01-10',
      progress: 100,
      memberNotes: 'دستاویزات مکمل اور جمع کر دیے گئے'
    },
    
    // Example task objects for ids 6 to 15
{
  id: '6',
  title: 'رپورٹس کا جائزہ',
  description: 'ماہانہ رپورٹس کی تیاری اور جائزہ',
  status: 'todo',
  priority: 'high',
  assignedTo: 'مولوی سہیل صاحب',
  createdAt: '2024-01-06',
  dueDate: '2024-01-25',
  progress: 0,
  memberNotes: 'رپورٹس کے لیے ڈیٹا اکٹھا کیا جا رہا ہے'
},
{
  id: '7',
  title: 'اجلاس کی تیاری',
  description: 'اگلے ہفتے کے اجلاس کے ایجنڈے کی تیاری',
  status: 'inprogress',
  priority: 'medium',
  assignedTo: 'مولوی امجد صاحب',
  createdAt: '2024-01-07',
  dueDate: '2024-01-22',
  progress: 40,
  memberNotes: 'ایجنڈے کے نکات تیار کیے جا رہے ہیں'
},
{
  id: '8',
  title: 'تعلیمی مواد کی تیاری',
  description: 'طلبہ کے لیے تعلیمی مواد تیار کرنا',
  status: 'todo',
  priority: 'high',
  assignedTo: 'حافظ شفاعت صاحب',
  createdAt: '2024-01-08',
  dueDate: '2024-01-28',
  progress: 0,
  memberNotes: 'مواد کے موضوعات پر مشاورت جاری ہے'
},
{
  id: '9',
  title: 'حاضری کا ریکارڈ',
  description: 'حاضری کے ریکارڈ کی جانچ اور اپڈیٹ',
  status: 'inprogress',
  priority: 'low',
  assignedTo: 'حافظ ایاز صاحب',
  createdAt: '2024-01-09',
  dueDate: '2024-01-18',
  progress: 60,
  memberNotes: 'ریکارڈ اپڈیٹ کیا جا رہا ہے'
},
{
  id: '10',
  title: 'مالی امور کی نگرانی',
  description: 'مالی ریکارڈز اور اخراجات کی نگرانی',
  status: 'todo',
  priority: 'high',
  assignedTo: 'مولوی احمد صاحب',
  createdAt: '2024-01-10',
  dueDate: '2024-01-30',
  progress: 0,
  memberNotes: 'مالی ڈیٹا اکٹھا کیا جا رہا ہے'
},
{
  id: '11',
  title: 'کمیٹی ممبران کی فہرست',
  description: 'کمیٹی ممبران کی تازہ فہرست تیار کرنا',
  status: 'done',
  priority: 'medium',
  assignedTo: 'مولوی طفیل صاحب',
  createdAt: '2024-01-11',
  dueDate: '2024-01-15',
  progress: 100,
  memberNotes: 'فہرست مکمل اور جمع کرا دی گئی'
},
{
  id: '12',
  title: 'نئے ممبران کی رجسٹریشن',
  description: 'نئے ممبران کی رجسٹریشن کا عمل',
  status: 'inprogress',
  priority: 'medium',
  assignedTo: 'مولوی امتیاز صاحب',
  createdAt: '2024-01-12',
  dueDate: '2024-01-27',
  progress: 50,
  memberNotes: 'کچھ ممبران کا ڈیٹا باقی ہے'
},
{
  id: '13',
  title: 'تعلیمی ورکشاپ',
  description: 'ورکشاپ کے انتظامات اور دعوت نامے',
  status: 'todo',
  priority: 'low',
  assignedTo: 'مولوی بلال صاحب',
  createdAt: '2024-01-13',
  dueDate: '2024-01-29',
  progress: 0,
  memberNotes: 'ورکشاپ کی تاریخ طے ہونا باقی ہے'
},
{
  id: '14',
  title: 'سالانہ رپورٹ',
  description: 'سالانہ رپورٹ کی تیاری اور جمع',
  status: 'todo',
  priority: 'high',
  assignedTo: 'مولوی ذاکر صاحب',
  createdAt: '2024-01-14',
  dueDate: '2024-01-31',
  progress: 0,
  memberNotes: 'ڈیٹا اکٹھا کیا جا رہا ہے'
},
{
  id: '15',
  title: 'اجتماعی پروگرام',
  description: 'اجتماعی پروگرام کے انتظامات',
  status: 'inprogress',
  priority: 'medium',
  assignedTo: 'مولوی فضل الرحمن صاحب',
  createdAt: '2024-01-15',
  dueDate: '2024-01-28',
  progress: 20,
  memberNotes: 'پروگرام کی جگہ اور تاریخ زیر غور ہیں'
}
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');

  // Use notification handler hook
  const notificationHandler = useNotificationHandler({
    notifications,
    onUpdateNotifications
  });

  // Initialize task manager
  const taskManager = TaskManager({
    tasks,
    onUpdateTasks: setTasks,
    userRole: actualRole, // Use actual role for permissions
    userName,
    notifications,
    onUpdateNotifications
  });

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Log for debugging
  useEffect(() => {
    console.log('Dashboard - Current tasks:', tasks);
    console.log('Dashboard - ViewMode:', viewMode, 'ActualRole:', actualRole);
    console.log('Dashboard - Notifications:', notifications);
  }, [tasks, viewMode, actualRole, notifications]);

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

  if (isLoading) {
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
                  <DashboardStats tasks={tasks} userRole={viewMode} userName={userName} />
                </div>
                
                {/* Charts with Delay Animation */}
                <div className="transform transition-all duration-500 animate-slide-in-from-right animation-delay-200">
                  <DashboardCharts tasks={tasks} />
                </div>
                
                {/* Task Board with Final Animation */}
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
            {/* Member View with Enhanced Animations */}
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
            notifications={notifications}
            isOpen={notificationHandler.isNotificationPanelOpen}
            onClose={() => notificationHandler.setIsNotificationPanelOpen(false)}
            onMarkAsRead={notificationHandler.handleMarkAsRead}
            onMarkAllAsRead={notificationHandler.handleMarkAllAsRead}
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
