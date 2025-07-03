
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
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
  onDeleteNotification?: (notificationId: string) => void;
  onClearAll?: () => void;
}

const NotificationPanel = ({ 
  notifications, 
  isOpen, 
  onClose, 
  onMarkAsRead, 
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4">
      <div className="w-full max-w-md mt-16">
        <Card className="max-h-[80vh] overflow-hidden shadow-2xl">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg" dir="rtl">اطلاعات</CardTitle>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && onClearAll && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className="text-xs text-white hover:bg-white/10"
                    dir="rtl"
                  >
                    <AlertTriangle className="h-3 w-3 ml-1" />
                    سب حذف کریں
                  </Button>
                )}
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMarkAllAsRead}
                    className="text-xs text-white hover:bg-white/10"
                    dir="rtl"
                  >
                    سب پڑھا گیا
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="w-fit" dir="rtl">
                {unreadCount} نئی اطلاعات
              </Badge>
            )}
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto p-0">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500" dir="rtl">
                  کوئی اطلاع نہیں
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-400'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(notification.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkAsRead(notification.id)}
                            className="h-6 w-6 p-0"
                            title="پڑھا ہوا نشان لگائیں"
                          >
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </Button>
                        )}
                        {onDeleteNotification && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteNotification(notification.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            title="حذف کریں"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <h4 className="font-medium text-sm mb-1" dir="rtl">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2" dir="rtl">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(notification.timestamp).toLocaleString('en-US')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationPanel;
