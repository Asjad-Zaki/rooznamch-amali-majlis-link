import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'task_created' | 'task_updated' | 'task_deleted';
  timestamp: string;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationPanel = ({ 
  notifications, 
  isOpen, 
  onClose, 
  onMarkAsRead, 
  onMarkAllAsRead 
}: NotificationPanelProps) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task_created':
        return '➕';
      case 'task_updated':
        return '✏️';
      case 'task_deleted':
        return '🗑️';
      default:
        return '📝';
    }
  };

  const getTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'task_created':
        return 'نیا ٹاسک';
      case 'task_updated':
        return 'ٹاسک اپڈیٹ';
      case 'task_deleted':
        return 'ٹاسک حذف';
      default:
        return 'اطلاع';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end p-4">
      <Card className="w-96 max-h-[80vh] overflow-hidden glass">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg" dir="rtl">اطلاعات</CardTitle>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-xs"
                  dir="rtl"
                >
                  سب پڑھا گیا
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {unreadCount > 0 && (
            <Badge variant="secondary" dir="rtl">
              {unreadCount} نئی اطلاعات
            </Badge>
          )}
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-8" dir="rtl">
              کوئی اطلاع نہیں
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(notification.type)}
                      </Badge>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <h4 className="font-medium text-sm mb-1" dir="rtl">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2" dir="rtl">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(notification.timestamp).toLocaleString('ur-PK')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPanel;