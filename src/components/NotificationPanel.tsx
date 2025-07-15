import React from 'react';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import { X, CheckCircle, Trash2, PlusCircle, FilePenLine, Info } from 'lucide-react';
=======
import { X, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3
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
<<<<<<< HEAD
  onDelete: (notificationId: string) => void;
=======
  onDeleteNotification?: (notificationId: string) => void;
  onClearAll?: () => void;
>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3
}

const NotificationPanel = ({ 
  notifications, 
  isOpen, 
  onClose, 
  onMarkAsRead, 
  onMarkAllAsRead,
<<<<<<< HEAD
  onDelete
=======
  onDeleteNotification,
  onClearAll
>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3
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

<<<<<<< HEAD
  // Common content for the notification list area
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(notification.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    title="اطلاع حذف کریں"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
=======
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col">
        <Card className="flex-1 overflow-hidden shadow-2xl">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <div className="flex justify-between items-center mb-2">
              <CardTitle className="text-lg font-bold" dir="rtl">اطلاعات</CardTitle>
>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
<<<<<<< HEAD
          </DrawerHeader>
          {notificationListContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-0 right-0 h-full w-full max-w-sm rounded-none border-l p-4 flex flex-col">
        <DialogHeader className="p-0 pb-3 border-b flex justify-between items-center">
          <DialogTitle dir="rtl">اطلاعات</DialogTitle>
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
        </DialogHeader>
        {notificationListContent}
      </DialogContent>
    </Dialog>
=======
            
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
>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3
  );
};

export default NotificationPanel;