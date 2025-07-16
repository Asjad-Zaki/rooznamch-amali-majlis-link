
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TaskBoard from './TaskBoard';
import TaskManager from './TaskManager';
import UserManagement from './UserManagement';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';
import Header from './Header';
import { Task } from './TaskCard';
import { DatabaseService } from '@/services/DatabaseService';
import { useDatabaseRealtime } from '@/contexts/DatabaseRealtimeContext';

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

  // Handle task operations with optimistic updates
  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      // Optimistic update
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) =>
        oldTasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      );

      const success = await DatabaseService.updateTask(taskId, updates);
      
      if (!success) {
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
      }
    } catch (error) {
      console.error('Error creating task:', error);
      await refetchTasks();
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      // Optimistic delete
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) =>
        oldTasks.filter(task => task.id !== taskId)
      );

      const success = await DatabaseService.deleteTask(taskId);
      
      if (!success) {
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

  const handleTaskModalSave = async (updatedTask: Task) => {
    await handleTaskUpdate(updatedTask.id, updatedTask);
    handleTaskModalClose();
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
    <div className="min-h-screen bg-gray-50">
      <Header
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
        onRoleSwitch={onRoleSwitch}
        notifications={notifications.length}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200" dir="rtl">
            <button
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('management')}
                >
                  ٹاسک منتظم
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'users'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('users')}
                >
                  صارف منتظم
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('analytics')}
                >
                  تجزیات
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
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
            <TaskManager
              tasks={filteredTasks}
              profiles={profiles}
              onTaskCreate={handleTaskCreate}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              isLoading={tasksLoading || profilesLoading}
            />
          )}

          {activeTab === 'users' && userRole === 'admin' && (
            <UserManagement />
          )}

          {activeTab === 'analytics' && userRole === 'admin' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    </div>
  );
};

export default Dashboard;
