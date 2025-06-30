import React, { useState, useEffect } from 'react';
import Header from './Header';
import TaskBoard from './TaskBoard';
import TaskModal from './TaskModal';
import NotificationPanel, { Notification } from './NotificationPanel';
import { Task } from './TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  userRole: 'admin' | 'member';
  userName: string;
  onLogout: () => void;
  onRoleSwitch?: () => void;
}

const Dashboard = ({ userRole, userName, onLogout, onRoleSwitch }: DashboardProps) => {
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Notification system
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const { toast } = useToast();

  const createNotification = (type: Notification['type'], title: string, message: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for real-time notification to members
    if (userRole === 'member') {
      toast({
        title: title,
        description: message,
      });
    }
  };

  // Admin-only functions
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

  const handleDeleteTask = (taskId: string) => {
    if (userRole !== 'admin') return;
    
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (taskToDelete) {
      setTasks(tasks.filter(task => task.id !== taskId));
      createNotification(
        'task_deleted',
        'ٹاسک حذف کر دیا گیا',
        `"${taskToDelete.title}" ٹاسک منتظم کی جانب سے حذف کر دیا گیا ہے`
      );
    }
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (userRole !== 'admin') return;
    
    if (modalMode === 'create') {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        progress: 0,
        memberNotes: ''
      };
      setTasks([...tasks, newTask]);
      createNotification(
        'task_created',
        'نیا ٹاسک بنایا گیا',
        `"${newTask.title}" نام کا نیا ٹاسک ${newTask.assignedTo} کو تفویض کیا گیا ہے`
      );
    } else if (currentTask) {
      setTasks(tasks.map(task => 
        task.id === currentTask.id 
          ? { ...task, ...taskData }
          : task
      ));
      createNotification(
        'task_updated',
        'ٹاسک اپڈیٹ ہوا',
        `"${taskData.title}" ٹاسک میں منتظم کی جانب سے تبدیلی کی گئی ہے`
      );
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    if (userRole !== 'admin') return;
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus }
          : task
      ));
      
      const statusLabels = {
        todo: 'کرنا ہے',
        inprogress: 'جاری',
        review: 'جائزہ',
        done: 'مکمل'
      };
      
      createNotification(
        'task_updated',
        'ٹاسک کی حالت تبدیل ہوئی',
        `"${task.title}" کی حالت منتظم کی جانب سے "${statusLabels[newStatus]}" میں تبدیل ہو گئی`
      );
    }
  };

  // Member function to update their own task progress
  const handleMemberTaskUpdate = (taskId: string, progress: number, memberNotes: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.assignedTo === userName) {
      setTasks(tasks.map(t => 
        t.id === taskId 
          ? { ...t, progress, memberNotes }
          : t
      ));
      
      createNotification(
        'task_updated',
        'ٹاسک کی پیش قدمی اپڈیٹ ہوئی',
        `${userName} نے "${task.title}" میں ${progress}% پیش قدمی کی اطلاع دی ہے`
      );
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Statistics for charts
  const statusData = [
    { name: 'کرنا ہے', value: tasks.filter(t => t.status === 'todo').length, color: '#8884d8' },
    { name: 'جاری', value: tasks.filter(t => t.status === 'inprogress').length, color: '#82ca9d' },
    { name: 'جائزہ', value: tasks.filter(t => t.status === 'review').length, color: '#ffc658' },
    { name: 'مکمل', value: tasks.filter(t => t.status === 'done').length, color: '#ff7300' }
  ];

  const priorityData = [
    { name: 'کم', value: tasks.filter(t => t.priority === 'low').length },
    { name: 'درمیانہ', value: tasks.filter(t => t.priority === 'medium').length },
    { name: 'زیادہ', value: tasks.filter(t => t.priority === 'high').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        userRole={userRole} 
        userName={userName} 
        onLogout={onLogout}
        onRoleSwitch={userRole === 'admin' ? onRoleSwitch : undefined}
        notifications={unreadNotifications}
        onNotificationClick={() => setIsNotificationPanelOpen(true)}
      />
      
      <div className="container mx-auto px-4 py-6">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600" dir="rtl">کل ٹاسکس</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600" dir="rtl">مکمل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter(t => t.status === 'done').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600" dir="rtl">جاری</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter(t => t.status === 'inprogress').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600" dir="rtl">
                {userRole === 'member' ? 'میرے ٹاسکس' : 'باقی'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {userRole === 'member' 
                  ? tasks.filter(t => t.assignedTo === userName).length
                  : tasks.filter(t => t.status === 'todo').length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section - Only for Admin */}
        {userRole === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle dir="rtl">حالت کے مطابق</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle dir="rtl">ترجیح کے مطابق</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Task Board */}
        <TaskBoard
          tasks={userRole === 'member' ? tasks : tasks}
          userRole={userRole}
          userName={userName}
          onAddTask={userRole === 'admin' ? handleAddTask : undefined}
          onEditTask={userRole === 'admin' ? handleEditTask : undefined}
          onDeleteTask={userRole === 'admin' ? handleDeleteTask : undefined}
          onStatusChange={userRole === 'admin' ? handleStatusChange : undefined}
          onMemberTaskUpdate={userRole === 'member' ? handleMemberTaskUpdate : undefined}
        />

        {/* Task Modal - Only for Admin */}
        {userRole === 'admin' && (
          <TaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveTask}
            task={currentTask}
            mode={modalMode}
          />
        )}

        {/* Notification Panel */}
        <NotificationPanel
          notifications={notifications}
          isOpen={isNotificationPanelOpen}
          onClose={() => setIsNotificationPanelOpen(false)}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      </div>
    </div>
  );
};

export default Dashboard;
