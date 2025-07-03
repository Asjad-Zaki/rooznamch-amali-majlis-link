
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col">
        <Card className="flex-1 overflow-hidden shadow-2xl">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <div className="flex justify-between items-center mb-2">
              <CardTitle className="text-lg font-bold" dir="rtl">اطلاعات</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center justify-between">
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {unreadCount} نئی اطلاعات
                </Badge>
              )}
              
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMarkAllAsRead}
                    className="text-xs text-white hover:bg-white/10 px-3 py-1 h-auto"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    سب پڑھا گیا
                  </Button>
                )}
                
                {notifications.length > 0 && onClearAll && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className="text-xs text-white hover:bg-red-500/20 px-3 py-1 h-auto"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    سب حذف کریں
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-4xl mb-4">🔔</div>
                <p className="text-gray-500 text-sm" dir="rtl">
                  کوئی اطلاع نہیں
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 transition-colors ${
                      notification.read 
                        ? 'bg-gray-50 hover:bg-gray-100' 
                        : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-400'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <Badge 
                          variant="outline" 
                          className="text-xs px-2 py-1 bg-white border-gray-200"
                        >
                          {getTypeLabel(notification.type)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkAsRead(notification.id)}
                            className="h-7 w-7 p-0 hover:bg-green-100"
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
                            className="h-7 w-7 p-0 text-red-500 hover:bg-red-100 hover:text-red-700"
                            title="حذف کریں"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-900 leading-snug" dir="rtl">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed" dir="rtl">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.timestamp).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
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
