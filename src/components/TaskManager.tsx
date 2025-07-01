
import React, { useState } from 'react';
import TaskModal from './TaskModal';
import { Task } from './TaskCard';
import { Notification } from './NotificationPanel';
import { useToast } from '@/hooks/use-toast';

interface TaskManagerProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
  userRole: 'admin' | 'member';
  userName: string;
  notifications: Notification[];
  onUpdateNotifications: (notifications: Notification[]) => void;
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

  const createNotification = (type: Notification['type'], title: string, message: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    console.log('Creating notification:', newNotification);
    onUpdateNotifications([newNotification, ...notifications]);
    
    toast({
      title: title,
      description: message,
    });
  };

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
    
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (taskToDelete) {
      onUpdateTasks(tasks.filter(task => task.id !== taskId));
      createNotification(
        'task_deleted',
        'ٹاسک حذف کر دیا گیا',
        `"${taskToDelete.title}" ٹاسک منتظم کی جانب سے حذف کر دیا گیا ہے`
      );
    }
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (userRole !== 'admin') return;
    
    if (modalMode === 'create') {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      console.log('Adding new task:', newTask);
      onUpdateTasks([...tasks, newTask]);
      createNotification(
        'task_created',
        'نیا ٹاسک بنایا گیا',
        `"${newTask.title}" نام کا نیا ٹاسک ${newTask.assignedTo} کو تفویض کیا گیا ہے`
      );
    } else if (currentTask) {
      const updatedTask = { ...currentTask, ...taskData };
      console.log('Updating task:', updatedTask);
      onUpdateTasks(tasks.map(task => 
        task.id === currentTask.id 
          ? updatedTask
          : task
      ));
      createNotification(
        'task_updated',
        'ٹاسک اپڈیٹ ہوا',
        `"${taskData.title}" ٹاسک میں منتظم کی جانب سے تبدیلی کی گئی ہے`
      );
    }
    setIsModalOpen(false);
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    if (userRole !== 'admin') return;
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = { ...task, status: newStatus };
      onUpdateTasks(tasks.map(task => 
        task.id === taskId 
          ? updatedTask
          : task
      ));
      
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
    if (task && task.assignedTo === userName) {
      const updatedTask = { ...task, progress, memberNotes };
      onUpdateTasks(tasks.map(t => 
        t.id === taskId 
          ? updatedTask
          : t
      ));
      
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
