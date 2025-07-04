
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseService } from '@/services/DatabaseService';
import { Task } from '@/components/TaskCard';
import { Notification } from '@/components/NotificationPanel';
import { Profile } from '@/hooks/useAuth';
import { useAuth } from '@/hooks/useAuth';

interface DatabaseRealtimeContextType {
  tasks: Task[];
  notifications: Notification[];
  profiles: Profile[];
  updateTasks: (tasks: Task[]) => void;
  updateNotifications: (notifications: Notification[]) => void;
  updateProfiles: (profiles: Profile[]) => void;
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<boolean>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<boolean>;
  deleteTask: (taskId: string) => Promise<boolean>;
  createNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => Promise<boolean>;
  markNotificationAsRead: (notificationId: string) => Promise<boolean>;
  deleteNotification: (notificationId: string) => Promise<boolean>;
  clearAllNotifications: () => Promise<boolean>;
  isConnected: boolean;
  loading: boolean;
}

const DatabaseRealtimeContext = createContext<DatabaseRealtimeContextType | undefined>(undefined);

export const useDatabaseRealtime = () => {
  const context = useContext(DatabaseRealtimeContext);
  if (!context) {
    throw new Error('useDatabaseRealtime must be used within a DatabaseRealtimeProvider');
  }
  return context;
};

interface DatabaseRealtimeProviderProps {
  children: React.ReactNode;
}

export const DatabaseRealtimeProvider = ({ children }: DatabaseRealtimeProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load initial data
  useEffect(() => {
    if (user) {
      loadInitialData();
      setupRealtimeSubscriptions();
      setIsConnected(true);
    } else {
      setTasks([]);
      setNotifications([]);
      setProfiles([]);
      setLoading(false);
      setIsConnected(false);
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      const [tasksData, notificationsData, profilesData] = await Promise.all([
        DatabaseService.getTasks(),
        DatabaseService.getNotifications(),
        DatabaseService.getProfiles()
      ]);

      setTasks(tasksData);
      setNotifications(notificationsData);
      setProfiles(profilesData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to tasks changes
    const tasksChannel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks'
      }, () => {
        console.log('Tasks changed, reloading...');
        DatabaseService.getTasks().then(setTasks);
      })
      .subscribe();

    // Subscribe to notifications changes
    const notificationsChannel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications'
      }, () => {
        console.log('Notifications changed, reloading...');
        DatabaseService.getNotifications().then(setNotifications);
      })
      .subscribe();

    // Subscribe to profiles changes
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, () => {
        console.log('Profiles changed, reloading...');
        DatabaseService.getProfiles().then(setProfiles);
      })
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(profilesChannel);
    };
  };

  const createTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<boolean> => {
    const newTask = await DatabaseService.createTask(task);
    if (newTask) {
      await DatabaseService.createNotification({
        title: 'نیا ٹاسک بنایا گیا',
        message: `"${task.title}" نام کا نیا ٹاسک ${task.assignedTo} کو تفویض کیا گیا ہے`,
        type: 'task_created'
      });
      return true;
    }
    return false;
  };

  const updateTask = async (taskId: string, updates: Partial<Task>): Promise<boolean> => {
    const success = await DatabaseService.updateTask(taskId, updates);
    if (success && updates.title) {
      await DatabaseService.createNotification({
        title: 'ٹاسک اپڈیٹ ہوا',
        message: `"${updates.title}" ٹاسک میں تبدیلی کی گئی ہے`,
        type: 'task_updated'
      });
    }
    return success;
  };

  const deleteTask = async (taskId: string): Promise<boolean> => {
    const task = tasks.find(t => t.id === taskId);
    const success = await DatabaseService.deleteTask(taskId);
    if (success && task) {
      await DatabaseService.createNotification({
        title: 'ٹاسک حذف کر دیا گیا',
        message: `"${task.title}" ٹاسک حذف کر دیا گیا ہے`,
        type: 'task_deleted'
      });
    }
    return success;
  };

  const createNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<boolean> => {
    return await DatabaseService.createNotification(notification);
  };

  const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
    return await DatabaseService.markNotificationAsRead(notificationId);
  };

  const deleteNotification = async (notificationId: string): Promise<boolean> => {
    return await DatabaseService.deleteNotification(notificationId);
  };

  const clearAllNotifications = async (): Promise<boolean> => {
    return await DatabaseService.clearAllNotifications();
  };

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const updateNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
  };

  const updateProfiles = (newProfiles: Profile[]) => {
    setProfiles(newProfiles);
  };

  return (
    <DatabaseRealtimeContext.Provider value={{
      tasks,
      notifications,
      profiles,
      updateTasks,
      updateNotifications,
      updateProfiles,
      createTask,
      updateTask,
      deleteTask,
      createNotification,
      markNotificationAsRead,
      deleteNotification,
      clearAllNotifications,
      isConnected,
      loading
    }}>
      {children}
    </DatabaseRealtimeContext.Provider>
  );
};
