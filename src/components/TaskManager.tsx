import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import TaskModal from './TaskModal';
import TaskBoard from './TaskBoard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskData } from '@/services/TasksService';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  secret_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskManagerProps {
  userRole: 'admin' | 'member';
  userName: string;
  className?: string;
  tasks: Task[];
  profiles: Profile[];
  onTaskCreate: (taskData: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
  isLoading: boolean;
}

const TaskManager = ({ userRole, userName, className, tasks, profiles, onTaskCreate, onTaskUpdate, onTaskDelete, isLoading }: TaskManagerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAddTask = () => {
    setCurrentTask(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'created_at'>) => {
    try {
      if (modalMode === 'create') {
        await onTaskCreate(taskData);
      } else if (currentTask) {
        await onTaskUpdate(currentTask.id, taskData);
      }
      
      setIsModalOpen(false);
      setCurrentTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await onTaskDelete(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      await onTaskUpdate(taskId, { status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleMemberTaskUpdate = async (taskId: string, progress: number, memberNotes: string) => {
    try {
      await onTaskUpdate(taskId, { progress, member_notes: memberNotes });
      toast({
        title: "کامیابی",
        description: "آپ کی پیش قدمی محفوظ ہو گئی",
      });
    } catch (error) {
      console.error('Error updating member task:', error);
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <TaskBoard
        tasks={tasks}
        userRole={userRole}
        userName={userName}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onStatusChange={handleTaskStatusChange}
        onMemberTaskUpdate={handleMemberTaskUpdate}
        isLoading={isLoading}
      />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={currentTask}
        mode={modalMode}
        profiles={profiles}
      />
    </div>
  );
};

export default TaskManager;