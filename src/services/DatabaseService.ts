
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/components/TaskCard';
import { Notification } from '@/components/NotificationPanel';
import { Profile } from '@/hooks/useAuth';

export class DatabaseService {
  // Tasks operations using direct table queries with type assertions
  static async getTasks(): Promise<Task[]> {
    try {
      const { data, error } = await (supabase as any).from('tasks').select('*');
      
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
        assigned_to_name: task.assigned_to_name || '',
        created_at: task.created_at,
        due_date: task.due_date || '',
        progress: task.progress || 0,
        member_notes: task.member_notes || ''
      }));
    } catch (error) {
      console.error('Error in getTasks:', error);
      return [];
    }
  }

  static async createTask(task: Omit<Task, 'id' | 'created_at'>): Promise<Task | null> {
    try {
      const { data, error } = await (supabase as any).from('tasks').insert({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigned_to_name: task.assigned_to_name,
        due_date: task.due_date,
        progress: task.progress,
        member_notes: task.member_notes
      }).select();

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
        assigned_to_name: taskData.assigned_to_name || '',
        created_at: taskData.created_at,
        due_date: taskData.due_date || '',
        progress: taskData.progress || 0,
        member_notes: taskData.member_notes || ''
      };
    } catch (error) {
      console.error('Error in createTask:', error);
      return null;
    }
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<boolean> {
    try {
      const { error } = await (supabase as any).from('tasks').update({
        title: updates.title,
        description: updates.description,
        status: updates.status,
        priority: updates.priority,
        assigned_to_name: updates.assigned_to_name,
        due_date: updates.due_date,
        progress: updates.progress,
        member_notes: updates.member_notes
      }).eq('id', taskId);

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
      const { error } = await (supabase as any).from('tasks').delete().eq('id', taskId);

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
      const { data, error } = await (supabase as any).from('notifications').select('*').order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return (data || []).map((notification: any) => ({
        id: String(notification.id),
        title: notification.title,
        message: notification.message,
        type: notification.type as Notification['type'],
        created_at: notification.created_at,
        is_read: notification.is_read
      }));
    } catch (error) {
      console.error('Error in getNotifications:', error);
      return [];
    }
  }

  static async createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Promise<boolean> {
    try {
      const { error } = await (supabase as any).from('notifications').insert({
        title: notification.title,
        message: notification.message,
        type: notification.type
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
      const { error } = await (supabase as any).from('notifications').update({ is_read: true }).eq('id', notificationId);

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
      const { error } = await (supabase as any).from('notifications').delete().eq('id', notificationId);

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
      const { error } = await (supabase as any).from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');

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
      const { data, error } = await (supabase as any).from('profiles').select('*');

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
