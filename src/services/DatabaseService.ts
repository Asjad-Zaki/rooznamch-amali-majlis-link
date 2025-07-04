
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/components/TaskCard';
import { Notification } from '@/components/NotificationPanel';
import { Profile } from '@/hooks/useAuth';

export class DatabaseService {
  // Tasks operations
  static async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }

    return (data as any[]).map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      status: task.status as Task['status'],
      priority: task.priority as Task['priority'],
      assignedTo: task.assigned_to_name || '',
      createdAt: task.created_at,
      dueDate: task.due_date || '',
      progress: task.progress || 0,
      memberNotes: task.member_notes || ''
    }));
  }

  static async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigned_to_name: task.assignedTo,
        due_date: task.dueDate,
        progress: task.progress,
        member_notes: task.memberNotes
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return null;
    }

    const taskData = data as any;
    return {
      id: taskData.id,
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
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .update({
        title: updates.title,
        description: updates.description,
        status: updates.status,
        priority: updates.priority,
        assigned_to_name: updates.assignedTo,
        due_date: updates.dueDate,
        progress: updates.progress,
        member_notes: updates.memberNotes
      })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task:', error);
      return false;
    }

    return true;
  }

  static async deleteTask(taskId: string): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      return false;
    }

    return true;
  }

  // Notifications operations
  static async getNotifications(): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return (data as any[]).map(notification => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type as Notification['type'],
      timestamp: notification.created_at,
      read: notification.is_read
    }));
  }

  static async createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .insert({
        title: notification.title,
        message: notification.message,
        type: notification.type
      });

    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }

    return true;
  }

  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }

    return true;
  }

  static async deleteNotification(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error deleting notification:', error);
      return false;
    }

    return true;
  }

  static async clearAllNotifications(): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      console.error('Error clearing notifications:', error);
      return false;
    }

    return true;
  }

  // Users/Profiles operations
  static async getProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }

    return (data as any[]) || [];
  }
}
