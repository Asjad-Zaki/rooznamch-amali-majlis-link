
import React, { useEffect } from 'react';
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
  notifications: Notification[];
  onUpdateNotifications: (notifications: Notification[]) => void;
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
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
  notifications,
  onUpdateNotifications,
  tasks,
  onUpdateTasks,
  viewMode = userRole,
  actualRole = userRole
}: DashboardProps) => {

  // Use notification handler hook
  const notificationHandler = useNotificationHandler({
    notifications,
    onUpdateNotifications
  });

  // Initialize task manager
  const taskManager = TaskManager({
    tasks,
    onUpdateTasks,
    userRole: actualRole,
    userName,
    notifications,
    onUpdateNotifications
  });

  // Log for debugging
  useEffect(() => {
    console.log('Dashboard - Current tasks:', tasks);
    console.log('Dashboard - ViewMode:', viewMode, 'ActualRole:', actualRole);
    console.log('Dashboard - Current user:', userName, userId);
  }, [tasks, viewMode, actualRole, userName, userId]);

  // PDF generation function
  const generatePDFReport = () => {
    const statusLabels = {
      todo: 'کرنا ہے',
      inprogress: 'جاری',
      review: 'جائزہ',
      done: 'مکمل'
    };

    const priorityLabels = {
      low: 'کم',
      medium: 'درمیانہ',
      high: 'زیادہ'
    };

    let reportContent = `
      <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>مجلس دعوۃ الحق - ٹاسک رپورٹ</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
            .date { font-size: 14px; color: #666; margin-top: 10px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #2563eb; padding-bottom: 5px; }
            .task-item { background: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 5px; border-right: 4px solid #2563eb; }
            .task-title { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
            .task-details { font-size: 14px; color: #555; }
            .task-meta { display: flex; justify-content: space-between; margin-top: 10px; font-size: 12px; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat-item { text-align: center; padding: 10px; background: #f0f0f0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">مجلس دعوۃ الحق</div>
            <div style="font-size: 16px; margin: 10px 0;">ٹاسک منیجمنٹ سسٹم - رپورٹ</div>
            <div class="date">تاریخ: ${new Date().toLocaleDateString('ur')}</div>
          </div>
    `;

    // Add statistics
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
    const reviewTasks = tasks.filter(t => t.status === 'review').length;
    const doneTasks = tasks.filter(t => t.status === 'done').length;

    reportContent += `
      <div class="stats">
        <div class="stat-item">
          <div style="font-weight: bold;">${todoTasks}</div>
          <div>کرنا ہے</div>
        </div>
        <div class="stat-item">
          <div style="font-weight: bold;">${inProgressTasks}</div>
          <div>جاری</div>
        </div>
        <div class="stat-item">
          <div style="font-weight: bold;">${reviewTasks}</div>
          <div>جائزہ</div>
        </div>
        <div class="stat-item">
          <div style="font-weight: bold;">${doneTasks}</div>
          <div>مکمل</div>
        </div>
      </div>
    `;

    // Add tasks by status
    ['todo', 'inprogress', 'review', 'done'].forEach(status => {
      const statusTasks = tasks.filter(t => t.status === status);
      if (statusTasks.length > 0) {
        reportContent += `
          <div class="section">
            <div class="section-title">${statusLabels[status as keyof typeof statusLabels]} (${statusTasks.length})</div>
        `;
        
        statusTasks.forEach(task => {
          reportContent += `
            <div class="task-item">
              <div class="task-title">${task.title}</div>
              <div class="task-details">${task.description}</div>
              <div class="task-meta">
                <span>تفویض: ${task.assignedTo}</span>
                <span>اہمیت: ${priorityLabels[task.priority as keyof typeof priorityLabels]}</span>
                <span>پیش قدمی: ${task.progress}%</span>
              </div>
              ${task.memberNotes ? `<div style="margin-top: 10px; font-style: italic;">نوٹس: ${task.memberNotes}</div>` : ''}
            </div>
          `;
        });
        
        reportContent += `</div>`;
      }
    });

    reportContent += `
        </body>
      </html>
    `;

    // Create and download PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportContent);
      printWindow.document.close();
      printWindow.print();
    }
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
        {/* PDF Report Button for Admin */}
        {actualRole === 'admin' && (
          <div className="mb-4 flex justify-end">
            <Button onClick={generatePDFReport} className="flex items-center gap-2" dir="rtl">
              <FileText className="h-4 w-4" />
              رپورٹ پرنٹ کریں
            </Button>
          </div>
        )}

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
