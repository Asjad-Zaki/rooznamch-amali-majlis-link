
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
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [users, setUsers] = useState<User[]>(initialUsers);

  useEffect(() => {
    // Initialize realtime service
    realtimeService.initialize();

    // Subscribe to real-time updates
    const unsubscribe = realtimeService.subscribe('data_update', (data) => {
      console.log('Received realtime update:', data);
      
      if (data.tasks) {
        setTasks(data.tasks);
      }
      if (data.notifications) {
        setNotifications(data.notifications);
      }
      if (data.users) {
        setUsers(data.users);
      }
    });

    return () => {
      unsubscribe();
      realtimeService.disconnect();
    };
  }, []);

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    realtimeService.broadcastUpdate({
      type: 'tasks_update',
      tasks: newTasks
    });
  };

  const updateNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
    realtimeService.broadcastUpdate({
      type: 'notifications_update',
      notifications: newNotifications
    });
  };

  const updateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    realtimeService.broadcastUpdate({
      type: 'users_update',
      users: newUsers
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
