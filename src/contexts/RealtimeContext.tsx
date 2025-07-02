
import React, { createContext, useContext, useEffect, useState } from 'react';
import { realtimeService } from '@/services/RealtimeService';
import { Task } from '@/components/TaskCard';
import { Notification } from '@/components/NotificationPanel';
import { User } from '@/components/UserManagement';

interface RealtimeContextType {
  tasks: Task[];
  notifications: Notification[];
  users: User[];
  updateTasks: (tasks: Task[]) => void;
  updateNotifications: (notifications: Notification[]) => void;
  updateUsers: (users: User[]) => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

interface RealtimeProviderProps {
  children: React.ReactNode;
  initialTasks: Task[];
  initialNotifications: Notification[];
  initialUsers: User[];
}

export const RealtimeProvider = ({ 
  children, 
  initialTasks, 
  initialNotifications, 
  initialUsers 
}: RealtimeProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  
  // Initialize with stored data or initial data
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem('app_tasks');
    if (storedTasks) {
      try {
        const parsed = JSON.parse(storedTasks);
        console.log('Loaded tasks from storage:', parsed.length, 'tasks');
        return parsed;
      } catch (error) {
        console.error('Error parsing stored tasks:', error);
      }
    }
    console.log('Using initial tasks:', initialTasks.length, 'tasks');
    localStorage.setItem('app_tasks', JSON.stringify(initialTasks));
    return initialTasks;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const storedNotifications = localStorage.getItem('app_notifications');
    if (storedNotifications) {
      try {
        const parsed = JSON.parse(storedNotifications);
        console.log('Loaded notifications from storage:', parsed.length, 'notifications');
        return parsed;
      } catch (error) {
        console.error('Error parsing stored notifications:', error);
      }
    }
    localStorage.setItem('app_notifications', JSON.stringify(initialNotifications));
    return initialNotifications;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('app_users');
    if (storedUsers) {
      try {
        const parsed = JSON.parse(storedUsers);
        console.log('Loaded users from storage:', parsed.length, 'users');
        return parsed;
      } catch (error) {
        console.error('Error parsing stored users:', error);
      }
    }
    localStorage.setItem('app_users', JSON.stringify(initialUsers));
    return initialUsers;
  });

  // Store data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('app_tasks', JSON.stringify(tasks));
    console.log('Tasks stored to localStorage:', tasks.length, 'tasks');
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('app_notifications', JSON.stringify(notifications));
    console.log('Notifications stored to localStorage:', notifications.length, 'notifications');
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
    console.log('Users stored to localStorage:', users.length, 'users');
  }, [users]);

  useEffect(() => {
    console.log('RealtimeProvider: Initializing realtime service...');
    
    // Initialize realtime service
    realtimeService.initialize();
    setIsConnected(true);

    // Subscribe to real-time updates
    const unsubscribe = realtimeService.subscribe('data_update', (data) => {
      console.log('RealtimeContext: Received realtime update:', data);
      
      // Always update if we receive valid data
      if (data.tasks && Array.isArray(data.tasks)) {
        console.log('Updating tasks from realtime:', data.tasks.length, 'tasks');
        setTasks(data.tasks);
      }
      
      if (data.notifications && Array.isArray(data.notifications)) {
        console.log('Updating notifications from realtime:', data.notifications.length, 'notifications');
        setNotifications(data.notifications);
      }
      
      if (data.users && Array.isArray(data.users)) {
        console.log('Updating users from realtime:', data.users.length, 'users');
        setUsers(data.users);
      }
    });

    // Force initial sync after a short delay
    const syncTimer = setTimeout(() => {
      console.log('RealtimeProvider: Forcing initial sync...');
      realtimeService.forceSync();
    }, 1000);

    return () => {
      clearTimeout(syncTimer);
      unsubscribe();
      realtimeService.disconnect();
      setIsConnected(false);
    };
  }, []);

  const updateTasks = (newTasks: Task[]) => {
    console.log('RealtimeContext: Updating tasks:', newTasks.length, 'tasks');
    setTasks(newTasks);
    
    // Broadcast immediately
    realtimeService.broadcastUpdate({
      type: 'tasks_update',
      tasks: newTasks,
      timestamp: Date.now(),
      source: 'tasks_update'
    });
  };

  const updateNotifications = (newNotifications: Notification[]) => {
    console.log('RealtimeContext: Updating notifications:', newNotifications.length, 'notifications');
    setNotifications(newNotifications);
    
    // Broadcast immediately
    realtimeService.broadcastUpdate({
      type: 'notifications_update',
      notifications: newNotifications,
      timestamp: Date.now(),
      source: 'notifications_update'
    });
  };

  const updateUsers = (newUsers: User[]) => {
    console.log('RealtimeContext: Updating users:', newUsers.length, 'users');
    setUsers(newUsers);
    
    // Broadcast immediately
    realtimeService.broadcastUpdate({
      type: 'users_update',
      users: newUsers,
      timestamp: Date.now(),
      source: 'users_update'
    });
  };

  const deleteNotification = (notificationId: string) => {
    console.log('RealtimeContext: Deleting notification:', notificationId);
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    updateNotifications(updatedNotifications);
  };

  const clearAllNotifications = () => {
    console.log('RealtimeContext: Clearing all notifications');
    updateNotifications([]);
  };

  return (
    <RealtimeContext.Provider value={{
      tasks,
      notifications,
      users,
      updateTasks,
      updateNotifications,
      updateUsers,
      deleteNotification,
      clearAllNotifications,
      isConnected
    }}>
      {children}
    </RealtimeContext.Provider>
  );
};
