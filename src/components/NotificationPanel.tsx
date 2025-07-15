
import React from 'react';  
import { Button } from '@/components/ui/button';
import { X, CheckCircle, Trash2, AlertTriangle, PlusCircle, FilePenLine, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'task_created' | 'task_updated' | 'task_deleted' | 'info';
  created_at: string;
  is_read: boolean;
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
  const isMobile = useIsMobile();
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task_created':
        return <PlusCircle className="h-5 w-5 text-green-500" />;
      case 'task_updated':
        return <FilePenLine className="h-5 w-5 text-blue-500" />;
      case 'task_deleted':
        return <Trash2 className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
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
      case 'info':
      default:
        return 'اطلاع';
    }
  };

  const notificationListContent = (
    <div className="flex-1 overflow-y-auto py-4">
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500 py-8" dir="rtl">
          کوئی اطلاع نہیں
        </p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border relative group transition-all duration-200 hover:shadow-md ${
                notification.is_read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2" dir="rtl">
                  <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(notification.type)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkAsRead(notification.id)}
                      className="h-6 w-6 p-0"
                      title="پڑھا گیا نشان زد کریں"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                  {onDeleteNotification && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteNotification(notification.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      title="اطلاع حذف کریں"
                    >
                      <Trash2 className="h-4 w-4" />
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
                {new Date(notification.created_at).toLocaleString('ur-PK')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-full flex flex-col rounded-t-[10px] bg-white p-4">
          <DrawerHeader className="p-0 pb-3 border-b flex justify-between items-center">
            <DrawerTitle dir="rtl">اطلاعات</DrawerTitle>
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
          </DrawerHeader>
          {notificationListContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between" dir="rtl">
            اطلاعات
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Badge variant="secondary">
                  {unreadCount} نئی اطلاعات
                </Badge>
              )}
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-xs"
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
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  سب حذف کریں
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        {notificationListContent}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPanel;
