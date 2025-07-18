import { supabase } from '@/integrations/supabase/client';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'in-review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_to_name: string;
  due_date: string;
  member_notes: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface TaskData {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'in-review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_to_name: string;
  due_date: string;
  member_notes: string;
  progress: number;
}

export class TasksService {
  static async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return (data || []).map(task => ({
      ...task,
      status: task.status as Task['status'],
      priority: task.priority as Task['priority']
    }));
  }

  static async createTask(taskData: TaskData): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as Task['status'],
      priority: data.priority as Task['priority']
    };
  }

  static async updateTask(id: string, taskData: Partial<TaskData>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(taskData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as Task['status'],
      priority: data.priority as Task['priority']
    };
  }

  static async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  static async updateTaskStatus(id: string, status: Task['status']): Promise<Task> {
    return this.updateTask(id, { status });
  }
}