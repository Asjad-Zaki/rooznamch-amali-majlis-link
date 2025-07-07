import React, { useState } from 'react';
import TaskModal from './TaskModal';
import { Task } from './TaskCard';
import { Notification } from './NotificationPanel'; // Import updated Notification interface
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface TaskManagerProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void; // This prop will become less relevant as data is fetched via react-query
  userRole: 'admin' | 'member';
  userName: string;
  notifications: Notification[]; // This prop will become less relevant as data is fetched via react-query
  onUpdateNotifications: (notifications: Notification[]) => void; // This prop will become less relevant as data is fetched via react-query
}

const TaskManager = ({ 
  tasks, 
  onUpdateTasks, 
  userRole, 
  userName, 
  notifications, 
  onUpdateNotifications 
}: TaskManagerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation for creating notifications in Supabase
  const createNotificationMutation = useMutation({
    mutationFn: async (newNotificationData: Omit<Notification, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('notifications').insert([newNotificationData]).select();
      if (error) throw error;
      return data[0] as Notification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] }); // Invalidate notifications query
    },
    onError: (error) => {
      console.error('Error creating notification in DB:', error);
      toast({
        title: "خرابی",
        description: `اطلاع بنانے میں خرابی: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const createNotification = (type: Notification['type'], title: string, message: string) => {
    const newNotification: Omit<Notification, 'id' | 'created_at'> = {
      title,
      message,
      type,
      is_read: false // Default to unread
    };
    
    createNotificationMutation.mutate(newNotification); // Use mutation to save to DB
    
    toast({
      title: title,
      description: message,
    });
  };

  // Mutations for Supabase operations
  const addTaskMutation = useMutation({
    mutationFn: async (newTaskData: Omit<Task, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('tasks').insert([newTaskData]).select();
      if (error) throw error;
      return data[0] as Task;
    },
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      createNotification(
        'task_created',
        'نیا ٹاسک بنایا گیا',
        `"${newTask.title}" نام کا نیا ٹاسک ${newTask.assigned_to_name} کو تفویض کیا گیا ہے`
      );
    },
    onError: (error) => {
      toast({
        title: "خرابی",
        description: `ٹاسک بنانے میں خرابی: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask: Task) => {
      const { data, error } = await supabase.from('tasks').update(updatedTask).eq('id', updatedTask.id).select();
      if (error) throw error;
      return data[0] as Task;
    },
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      createNotification(
        'task_updated',
        'ٹاسک اپڈیٹ ہوا',
        `"${updatedTask.title}" ٹاسک میں منتظم کی جانب سے تبدیلی کی گئی ہے`
      );
    },
    onError: (error) => {
      toast({
        title: "خرابی",
        description: `ٹاسک اپڈیٹ کرنے میں خرابی: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      return taskId;
    },
    onSuccess: (taskId) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      const taskToDelete = tasks.find(task => task.id === taskId);
      if (taskToDelete) {
        createNotification(
          'task_deleted',
          'ٹاسک حذف کر دیا گیا',
          `"${taskToDelete.title}" ٹاسک منتظم کی جانب سے حذف کر دیا گیا ہے`
        );
      }
    },
    onError: (error) => {
      toast({
        title: "خرابی",
        description: `ٹاسک حذف کرنے میں خرابی: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleAddTask = () => {
    if (userRole !== 'admin') return;
    setCurrentTask(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    if (userRole !== 'admin') return;
    setCurrentTask(task);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (userRole !== 'admin') return;
    deleteTaskMutation.mutate(taskId);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'created_at'>) => {
    if (userRole !== 'admin') return;
    
    if (modalMode === 'create') {
      addTaskMutation.mutate(taskData);
    } else if (currentTask) {
      updateTaskMutation.mutate({ ...currentTask, ...taskData });
    }
    setIsModalOpen(false);
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    if (userRole !== 'admin') return;
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = { ...task, status: newStatus };
      updateTaskMutation.mutate(updatedTask);
      
      const statusLabels = {
        todo: 'کرنا ہے',
        inprogress: 'جاری',
        review: 'جائزہ',
        done: 'مکمل'
      };
      
      createNotification(
        'task_updated',
        'ٹاسک کی حالت تبدیل ہوئی',
        `"${task.title}" کی حالت منتظم کی جانب سے "${statusLabels[newStatus]}" میں تبدیل ہو گئی`
      );
    }
  };

  const handleMemberTaskUpdate = (taskId: string, progress: number, memberNotes: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.assigned_to_name === userName) {
      const updatedTask = { ...task, progress, member_notes: memberNotes };
      updateTaskMutation.mutate(updatedTask);
      
      createNotification(
        'task_updated',
        'رکن کی جانب سے ٹاسک اپڈیٹ',
        `${userName} نے "${task.title}" میں ${progress}% پیش قدمی کی اطلاع دی ہے - ${memberNotes}`
      );
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    currentTask,
    modalMode,
    handleAddTask,
    handleEditTask,
    handleDeleteTask,
    handleSaveTask,
    handleStatusChange,
    handleMemberTaskUpdate
  };
};

export default TaskManager;