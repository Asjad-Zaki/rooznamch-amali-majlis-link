
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
  // Initialize with stored data or initial data
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem('app_tasks');
    if (storedTasks) {
      try {
        const parsed = JSON.parse(storedTasks);
        console.log('Loaded tasks from storage:', parsed);
        return parsed;
      } catch (error) {
        console.error('Error parsing stored tasks:', error);
      }
    }
    console.log('Using initial tasks:', initialTasks);
    return initialTasks;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const storedNotifications = localStorage.getItem('app_notifications');
    if (storedNotifications) {
      try {
        const parsed = JSON.parse(storedNotifications);
        console.log('Loaded notifications from storage:', parsed);
        return parsed;
      } catch (error) {
        console.error('Error parsing stored notifications:', error);
      }
    }
    return initialNotifications;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('app_users');
    if (storedUsers) {
      try {
        const parsed = JSON.parse(storedUsers);
        console.log('Loaded users from storage:', parsed);
        return parsed;
      } catch (error) {
        console.error('Error parsing stored users:', error);
      }
    }
    return initialUsers;
  });

  // Store data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('app_tasks', JSON.stringify(tasks));
    console.log('Tasks stored to localStorage:', tasks);
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('app_notifications', JSON.stringify(notifications));
    console.log('Notifications stored to localStorage:', notifications);
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
    console.log('Users stored to localStorage:', users);
  }, [users]);

  useEffect(() => {
    // Initialize realtime service
    realtimeService.initialize();

    // Subscribe to real-time updates
    const unsubscribe = realtimeService.subscribe('data_update', (data) => {
      console.log('RealtimeContext: Received realtime update:', data);
      
      // Only update if the data is newer than what we have
      const lastUpdate = parseInt(localStorage.getItem('last_local_update') || '0');
      const updateTimestamp = data.timestamp || 0;
      
      if (updateTimestamp > lastUpdate || data.type === 'force_update') {
        if (data.tasks) {
          console.log('Updating tasks from realtime:', data.tasks);
          setTasks(data.tasks);
        }
        if (data.notifications) {
          console.log('Updating notifications from realtime:', data.notifications);
          setNotifications(data.notifications);
        }
        if (data.users) {
          console.log('Updating users from realtime:', data.users);
          setUsers(data.users);
        }
        
        // Update last local update timestamp
        localStorage.setItem('last_local_update', Date.now().toString());
      }
    });

    // Force sync on mount
    setTimeout(() => {
      realtimeService.forceSync();
    }, 500);

    return () => {
      unsubscribe();
      realtimeService.disconnect();
    };
  }, []);

  const updateTasks = (newTasks: Task[]) => {
    console.log('RealtimeContext: Updating tasks:', newTasks);
    setTasks(newTasks);
    localStorage.setItem('last_local_update', Date.now().toString());
    realtimeService.broadcastUpdate({
      type: 'tasks_update',
      tasks: newTasks,
      timestamp: Date.now()
    });
  };

  const updateNotifications = (newNotifications: Notification[]) => {
    console.log('RealtimeContext: Updating notifications:', newNotifications);
    setNotifications(newNotifications);
    localStorage.setItem('last_local_update', Date.now().toString());
    realtimeService.broadcastUpdate({
      type: 'notifications_update',
      notifications: newNotifications,
      timestamp: Date.now()
    });
  };

  const updateUsers = (newUsers: User[]) => {
    console.log('RealtimeContext: Updating users:', newUsers);
    setUsers(newUsers);
    localStorage.setItem('last_local_update', Date.now().toString());
    realtimeService.broadcastUpdate({
      type: 'users_update',
      users: newUsers,
      timestamp: Date.now()
    });
  };

  const deleteNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    updateNotifications(updatedNotifications);
  };

  const clearAllNotifications = () => {
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
      clearAllNotifications
    }}>
      {children}
    </RealtimeContext.Provider>
  );
};
