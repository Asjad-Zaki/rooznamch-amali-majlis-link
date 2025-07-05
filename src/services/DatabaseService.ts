
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/components/TaskCard';
import { Notification } from '@/components/NotificationPanel';
import { Profile } from '@/hooks/useAuth';

export class DatabaseService {
  // Tasks operations using raw SQL to bypass type system
  static async getTasks(): Promise<Task[]> {
    try {
      const { data, error } = await supabase.rpc('get_all_tasks');
      
      if (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }

      return (data || []).map((task: any) => ({
        id: String(task.id),
        title: task.title || '',
        description: task.description || '',
        status: task.status as Task['status'],
        priority: task.priority as Task['priority'],
        assignedTo: task.assigned_to_name || '',
        createdAt: task.created_at,
        dueDate: task.due_date || '',
        progress: task.progress || 0,
        memberNotes: task.member_notes || ''
      }));
    } catch (error) {
      console.error('Error in getTasks:', error);
      return [];
    }
  }

  static async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task | null> {
    try {
      const { data, error } = await supabase.rpc('create_task', {
        task_title: task.title,
        task_description: task.description,
        task_status: task.status,
        task_priority: task.priority,
        task_assigned_to: task.assignedTo,
        task_due_date: task.dueDate,
        task_progress: task.progress,
        task_member_notes: task.memberNotes
      });

      if (error) {
        console.error('Error creating task:', error);
        return null;
      }

      if (!data || data.length === 0) return null;

      const taskData = data[0];
      return {
        id: String(taskData.id),
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status as Task['status'],
        priority: taskData.priority as Task['priority'],
        assignedTo: taskData.assigned_to_name || '',
        createdAt: taskData.created_at,
        dueDate: taskData.due_date || '',
        progress: taskData.progress || 0,
        memberNotes: taskData.member_notes || ''
      };
    } catch (error) {
      console.error('Error in createTask:', error);
      return null;
    }
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('update_task', {
        task_id: taskId,
        task_title: updates.title,
        task_description: updates.description,
        task_status: updates.status,
        task_priority: updates.priority,
        task_assigned_to: updates.assignedTo,
        task_due_date: updates.dueDate,
        task_progress: updates.progress,
        task_member_notes: updates.memberNotes
      });

      if (error) {
        console.error('Error updating task:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateTask:', error);
      return false;
    }
  }

  static async deleteTask(taskId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('delete_task', { task_id: taskId });

      if (error) {
        console.error('Error deleting task:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteTask:', error);
      return false;
    }
  }

  // Notifications operations
  static async getNotifications(): Promise<Notification[]> {
    try {
      const { data, error } = await supabase.rpc('get_all_notifications');

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return (data || []).map((notification: any) => ({
        id: String(notification.id),
        title: notification.title,
        message: notification.message,
        type: notification.type as Notification['type'],
        timestamp: notification.created_at,
        read: notification.is_read
      }));
    } catch (error) {
      console.error('Error in getNotifications:', error);
      return [];
    }
  }

  static async createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('create_notification', {
        notif_title: notification.title,
        notif_message: notification.message,
        notif_type: notification.type
      });

      if (error) {
        console.error('Error creating notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createNotification:', error);
      return false;
    }
  }

  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('mark_notification_read', { 
        notification_id: notificationId 
      });

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markNotificationAsRead:', error);
      return false;
    }
  }

  static async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('delete_notification', { 
        notification_id: notificationId 
      });

      if (error) {
        console.error('Error deleting notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteNotification:', error);
      return false;
    }
  }

  static async clearAllNotifications(): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('clear_all_notifications');

      if (error) {
        console.error('Error clearing notifications:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in clearAllNotifications:', error);
      return false;
    }
  }

  // Users/Profiles operations
  static async getProfiles(): Promise<Profile[]> {
    try {
      const { data, error } = await supabase.rpc('get_all_profiles');

      if (error) {
        console.error('Error fetching profiles:', error);
        return [];
      }

      return (data || []).map((profile: any) => ({
        id: String(profile.id),
        name: profile.name,
        email: profile.email,
        role: profile.role as 'admin' | 'member',
        secret_number: profile.secret_number,
        is_active: profile.is_active,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }));
    } catch (error) {
      console.error('Error in getProfiles:', error);
      return [];
    }
  }
}
