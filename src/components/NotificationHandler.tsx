
import React, { useState } from 'react';
import NotificationPanel, { Notification } from './NotificationPanel';

interface NotificationHandlerProps {
  notifications: Notification[];
  onUpdateNotifications: (notifications: Notification[]) => void;
}

const NotificationHandler = ({ notifications, onUpdateNotifications }: NotificationHandlerProps) => {
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const handleMarkAsRead = (notificationId: string) => {
    onUpdateNotifications(
      notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    onUpdateNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return {
    isNotificationPanelOpen,
    setIsNotificationPanelOpen,
    handleMarkAsRead,
    handleMarkAllAsRead,
    unreadNotifications,
    NotificationPanel: () => (
      <NotificationPanel
        notifications={notifications}
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    )
  };
};

export default NotificationHandler;
