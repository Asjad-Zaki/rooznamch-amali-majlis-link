
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TaskBoard from './TaskBoard';
import TaskManager from './TaskManager';
import TaskModal from './TaskModal';
import UserManagement from './UserManagement';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';
import Header from './Header';
import { Task } from './TaskCard';
import { DatabaseService } from '@/services/DatabaseService';
import { useDatabaseRealtime } from '@/contexts/DatabaseRealtimeContext';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { generatePDFReport } from '@/lib/pdf-generator';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  userRole: 'admin' | 'member';
  userName: string;
  userId: string;
  onLogout: () => void;
  onRoleSwitch?: () => void;
  notifications: any[];
  onUpdateNotifications: (notifications: any[]) => void;
  viewMode: 'admin' | 'member';
  actualRole: 'admin' | 'member';
}

const Dashboard = ({
  userRole,
  userName,
  userId,
  onLogout,
  onRoleSwitch,
  notifications,
  onUpdateNotifications,
  viewMode,
  actualRole
}: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Notification sound function
  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGIaAzyM1fa+diMpJG7A7+OSQgoQVLnl7a5IDglMo9X7uGUdAjmN2vlgJ');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Sound play failed:', e));
  };

  // Use React Query for tasks data
  const { data: tasks = [], isLoading: tasksLoading, refetch: refetchTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: DatabaseService.getTasks,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Use React Query for profiles data (only for admin)
  const { data: profiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: DatabaseService.getProfiles,
    enabled: actualRole === 'admin',
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter tasks based on user role and view mode
  const filteredTasks = useMemo(() => {
    if (viewMode === 'admin') {
      return tasks; // Admin can see all tasks
    } else {
      // Member can only see tasks assigned to them
      return tasks.filter(task => task.assigned_to_name === userName);
    }
  }, [tasks, viewMode, userName]);

  // Handle task operations with optimistic updates and notifications
  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      // Optimistic update
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) =>
        oldTasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      );

      const success = await DatabaseService.updateTask(taskId, updates);
      
      if (success) {
        // Create notification for status changes with sound
        if (updates.status) {
          playNotificationSound();
          
          const statusLabels = {
            'todo': 'کرنا ہے',
            'in-progress': 'جاری',
            'in-review': 'جائزہ',
            'completed': 'مکمل'
          };
          
          await DatabaseService.createNotification({
            title: 'ٹاسک اپڈیٹ',
            message: `ٹاسک کی حالت تبدیل ہوئی: ${statusLabels[updates.status as keyof typeof statusLabels]}`,
            type: 'task_updated'
          });
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      } else {
        // Revert on failure
        await refetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      await refetchTasks();
    }
  };

  const handleTaskCreate = async (taskData: Omit<Task, 'id' | 'created_at'>) => {
    try {
      const newTask = await DatabaseService.createTask(taskData);
      if (newTask) {
        // Update cache with new task
        queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => [
          newTask,
          ...oldTasks
        ]);
        
        // Play notification sound
        playNotificationSound();
        
        // Show success toast
        toast({
          title: "کامیابی",
          description: `نیا ٹاسک "${taskData.title}" بن گیا`,
        });
        
        // Create notification
        await DatabaseService.createNotification({
          title: 'نیا ٹاسک',
          message: `نیا ٹاسک "${taskData.title}" بنایا گیا`,
          type: 'task_created'
        });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "خرابی",
        description: "ٹاسک بناتے وقت خرابی ہوئی",
        variant: "destructive",
      });
      await refetchTasks();
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      const taskToDelete = tasks.find(t => t.id === taskId);
      
      // Optimistic delete
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) =>
        oldTasks.filter(task => task.id !== taskId)
      );

      const success = await DatabaseService.deleteTask(taskId);
      
      if (success && taskToDelete) {
        // Create notification
        await DatabaseService.createNotification({
          title: 'ٹاسک ڈیلیٹ',
          message: `ٹاسک "${taskToDelete.title}" ڈیلیٹ کیا گیا`,
          type: 'task_deleted'
        });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      } else if (!success) {
        // Revert on failure
        await refetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      await refetchTasks();
    }
  };

  const handleTaskEdit = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskModalClose = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(false);
  };

  const handleTaskModalSave = async (taskData: Omit<Task, 'id' | 'created_at'>) => {
    if (selectedTask) {
      // Edit mode
      await handleTaskUpdate(selectedTask.id, taskData);
    } else {
      // Create mode
      await handleTaskCreate(taskData);
    }
    handleTaskModalClose();
  };

  // Download report function
  const handleDownloadReport = async () => {
    try {
      if (filteredTasks.length === 0) {
        toast({
          title: "خرابی",
          description: "رپورٹ بنانے کے لیے کم از کم ایک ٹاسک ہونا ضروری ہے",
          variant: "destructive",
        });
        return;
      }

      await generatePDFReport(filteredTasks, userName);
      
      toast({
        title: "کامیابی",
        description: `PDF رپورٹ کامیابی سے ڈاؤن لوڈ ہو گئی (${filteredTasks.length} ٹاسکس شامل)`,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "خرابی",
        description: "PDF رپورٹ بناتے وقت خرابی ہوئی۔ دوبارہ کوشش کریں۔",
        variant: "destructive",
      });
    }
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    await handleTaskUpdate(taskId, { status: newStatus });
  };

  const handleMemberTaskUpdate = async (taskId: string, progress: number, memberNotes: string) => {
    await handleTaskUpdate(taskId, { progress, member_notes: memberNotes });
  };

  // Show loading state
  if (tasksLoading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 animate-fadeInUp">
      <Header
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
        onRoleSwitch={onRoleSwitch}
        notifications={notifications.length}
      />

      <div className="container mx-auto px-4 py-6 animate-fadeInUp delay-200">
        {/* Navigation Tabs */}
        <div className="glass-card rounded-xl shadow-xl mb-6 overflow-hidden hover-lift animate-scaleIn">
          <div className="flex flex-wrap border-b border-gray-100" dir="rtl">
            <button
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-b-2 border-blue-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:scale-105'
              }`}
              onClick={() => setActiveTab('tasks')}
            >
              ٹاسکس
            </button>
            
            {userRole === 'admin' && (
              <>
                <button
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'management'
                      ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white border-b-2 border-green-600 shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50 hover:scale-105'
                  }`}
                  onClick={() => setActiveTab('management')}
                >
                  ٹاسک منتظم
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'users'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white border-b-2 border-purple-600 shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:scale-105'
                  }`}
                  onClick={() => setActiveTab('users')}
                >
                  صارف منتظم
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-b-2 border-orange-600 shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:scale-105'
                  }`}
                  onClick={() => setActiveTab('analytics')}
                >
                  تجزیات
                </button>
              </>
            )}
          </div>
        </div>

        {/* Download Report Button */}
        <div className="flex justify-end mb-6 animate-fadeInRight delay-300">
          <Button 
            onClick={handleDownloadReport}
            className="flex items-center gap-2 btn-gradient hover-lift px-6 py-3 rounded-xl shadow-lg"
            dir="rtl"
          >
            <Download className="h-4 w-4 animate-bounce" />
            رپورٹ ڈاؤن لوڈ کریں
          </Button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6 animate-fadeInUp delay-400">
          {activeTab === 'tasks' && (
            <TaskBoard
              tasks={filteredTasks}
              userRole={userRole}
              userName={userName}
              userId={userId}
              onAddTask={userRole === 'admin' ? handleAddTask : undefined}
              onEditTask={userRole === 'admin' ? handleTaskEdit : undefined}
              onDeleteTask={userRole === 'admin' ? handleTaskDelete : undefined}
              onStatusChange={userRole === 'admin' ? handleStatusChange : undefined}
              onMemberTaskUpdate={handleMemberTaskUpdate}
              isLoading={tasksLoading}
            />
          )}

          {activeTab === 'management' && userRole === 'admin' && (
            <div className="animate-fadeInLeft">
              <TaskManager
              userRole={userRole}
              userName={userName}
              tasks={filteredTasks}
              profiles={profiles}
              onTaskCreate={handleTaskCreate}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              isLoading={tasksLoading || profilesLoading}
              />
            </div>
          )}

          {activeTab === 'users' && userRole === 'admin' && (
            <div className="animate-fadeInRight">
              <UserManagement />
            </div>
          )}

          {activeTab === 'analytics' && userRole === 'admin' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeInUp">
              <DashboardStats 
                tasks={filteredTasks} 
                userRole={userRole}
                userName={userName}
              />
              <DashboardCharts tasks={filteredTasks} />
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleTaskModalClose}
        onSave={handleTaskModalSave}
        task={selectedTask}
        mode={selectedTask ? 'edit' : 'create'}
        profiles={profiles}
      />
    </div>
  );
};

export default Dashboard;
