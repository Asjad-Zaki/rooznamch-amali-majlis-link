
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
    }
  ]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        userRole={viewMode} 
        userName={viewMode === 'member' && actualRole === 'admin' ? `${userName} (مانیٹرنگ موڈ)` : userName}
        onLogout={onLogout}
        onRoleSwitch={actualRole === 'admin' ? onRoleSwitch : undefined}
        notifications={notificationHandler.unreadNotifications}
        onNotificationClick={() => notificationHandler.setIsNotificationPanelOpen(true)}
      />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {viewMode === 'admin' ? (
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="tasks" dir="rtl" className="text-sm">ٹاسکس</TabsTrigger>
              <TabsTrigger value="users" dir="rtl" className="text-sm">صارفین</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks" className="space-y-4 sm:space-y-6">
              <DashboardStats tasks={tasks} userRole={viewMode} userName={userName} />
              <DashboardCharts tasks={tasks} />
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
            </TabsContent>
            
            <TabsContent value="users">
              <UserManagement
                users={users}
                onAddUser={handleAddUser}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
                onToggleUserStatus={handleToggleUserStatus}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <DashboardStats tasks={tasks} userRole={viewMode} userName={userName} />
            <TaskBoard
              tasks={tasks}
              userRole={viewMode}
              userName={userName}
              userId={userId}
              onMemberTaskUpdate={taskManager.handleMemberTaskUpdate}
            />
          </div>
        )}

        {/* Task Modal - Only for Admin */}
        {actualRole === 'admin' && (
          <TaskModal
            isOpen={taskManager.isModalOpen}
            onClose={() => taskManager.setIsModalOpen(false)}
            onSave={taskManager.handleSaveTask}
            task={taskManager.currentTask}
            mode={taskManager.modalMode}
          />
        )}

        {/* Notification Panel */}
        <NotificationPanel
          notifications={notifications}
          isOpen={notificationHandler.isNotificationPanelOpen}
          onClose={() => notificationHandler.setIsNotificationPanelOpen(false)}
          onMarkAsRead={notificationHandler.handleMarkAsRead}
          onMarkAllAsRead={notificationHandler.handleMarkAllAsRead}
        />
      </div>
    </div>
  );
};

export default Dashboard;
