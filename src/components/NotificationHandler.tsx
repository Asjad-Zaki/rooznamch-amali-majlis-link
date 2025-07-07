import React, { useState } from 'react';
import NotificationPanel, { Notification } from './NotificationPanel';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NotificationHandlerProps {
  notifications: Notification[]; // Now received from Dashboard (fetched from Supabase)
}

const NotificationHandler = ({ notifications }: NotificationHandlerProps) => {
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false); // Mark only unread as read
      if (error) throw error;
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Error marking all notifications as read:', error);
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Error deleting notification:', error);
    }
  });

  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  return (
    <>
      <NotificationPanel
        notifications={notifications}
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        onMarkAsRead={markAsReadMutation.mutate}
        onMarkAllAsRead={markAllAsReadMutation.mutate}
        onDelete={deleteNotificationMutation.mutate}
      />
      {/* Export functions for parent component to use */}
      <div style={{ display: 'none' }} data-notification-handler={{
        unreadNotifications,
        setIsNotificationPanelOpen,
        handleMarkAsRead: markAsReadMutation.mutate,
        handleMarkAllAsRead: markAllAsReadMutation.mutate,
        handleDeleteNotification: deleteNotificationMutation.mutate
      }} />
    </>
  );
};

// Export hook for easier usage
export const useNotificationHandler = ({ notifications }: NotificationHandlerProps) => {
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);
      if (error) throw error;
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Error marking all notifications as read:', error);
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Error deleting notification:', error);
    }
  });

  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  return {
    isNotificationPanelOpen,
    setIsNotificationPanelOpen,
    handleMarkAsRead: markAsReadMutation.mutate,
    handleMarkAllAsRead: markAllAsReadMutation.mutate,
    handleDeleteNotification: deleteNotificationMutation.mutate,
    unreadNotifications
  };
};

export default NotificationHandler;