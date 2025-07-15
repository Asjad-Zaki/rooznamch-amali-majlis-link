
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseService } from '@/services/DatabaseService';
import { Task } from '@/components/TaskCard';
import { Notification } from '@/components/NotificationPanel';
import { Profile } from '@/hooks/useAuth';

interface DatabaseRealtimeContextType {
  tasks: Task[];
  notifications: Notification[];
  profiles: Profile[];
  isConnected: boolean;
  loading: boolean;
  createTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

const DatabaseRealtimeContext = createContext<DatabaseRealtimeContextType | undefined>(undefined);

export const DatabaseRealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [loading, setLoading] = useState(true);

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [tasksData, notificationsData, profilesData] = await Promise.all([
          DatabaseService.getTasks(),
          DatabaseService.getNotifications(),
          DatabaseService.getProfiles(),
        ]);

        setTasks(tasksData);
        setNotifications(notificationsData);
        setProfiles(profilesData);
        setIsConnected(true);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    const tasksChannel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' },
        async (payload) => {
          console.log('Tasks change:', payload);
          const updatedTasks = await DatabaseService.getTasks();
          setTasks(updatedTasks);
        }
      )
      .subscribe();

    const notificationsChannel = supabase
      .channel('notifications-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        async (payload) => {
          console.log('Notifications change:', payload);
          const updatedNotifications = await DatabaseService.getNotifications();
          setNotifications(updatedNotifications);
        }
      )
      .subscribe();

    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        async (payload) => {
          console.log('Profiles change:', payload);
          const updatedProfiles = await DatabaseService.getProfiles();
          setProfiles(updatedProfiles);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, []);

  // CRUD operations
  const createTask = async (task: Omit<Task, 'id' | 'created_at'>) => {
    const newTask = await DatabaseService.createTask(task);
    if (newTask) {
      await DatabaseService.createNotification({
        title: 'نیا ٹاسک',
        message: `نیا ٹاسک "${task.title}" بنایا گیا`,
        type: 'task_created'
      });
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const success = await DatabaseService.updateTask(taskId, updates);
    if (success && updates.status) {
      await DatabaseService.createNotification({
        title: 'ٹاسک اپڈیٹ',
        message: `ٹاسک کی حالت تبدیل ہوئی: ${updates.status}`,
        type: 'task_updated'
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    const success = await DatabaseService.deleteTask(taskId);
    if (success && taskToDelete) {
      await DatabaseService.createNotification({
        title: 'ٹاسک ڈیلیٹ',
        message: `ٹاسک "${taskToDelete.title}" ڈیلیٹ کیا گیا`,
        type: 'task_deleted'
      });
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    await DatabaseService.markNotificationAsRead(notificationId);
  };

  const deleteNotification = async (notificationId: string) => {
    await DatabaseService.deleteNotification(notificationId);
  };

  const clearAllNotifications = async () => {
    await DatabaseService.clearAllNotifications();
  };

  const value: DatabaseRealtimeContextType = {
    tasks,
    notifications,
    profiles,
    isConnected,
    loading,
    createTask,
    updateTask,
    deleteTask,
    markNotificationAsRead,
    deleteNotification,
    clearAllNotifications,
  };

  return (
    <DatabaseRealtimeContext.Provider value={value}>
      {children}
    </DatabaseRealtimeContext.Provider>
  );
};

export const useDatabaseRealtime = () => {
  const context = useContext(DatabaseRealtimeContext);
  if (context === undefined) {
    throw new Error('useDatabaseRealtime must be used within a DatabaseRealtimeProvider');
  }
  return context;
};
