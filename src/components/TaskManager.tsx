
import React, { useState } from 'react';
import TaskModal from './TaskModal';
import TaskBoard from './TaskBoard';
import { Task } from './TaskCard';
import { Profile } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface TaskManagerProps {
  tasks: Task[];
  profiles: Profile[];
  onTaskCreate: (taskData: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
  isLoading: boolean;
}

const TaskManager = ({ 
  tasks, 
  profiles,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  isLoading
}: TaskManagerProps) => {
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
        toast({
          title: "کامیابی",
          description: "نیا ٹاسک بنایا گیا",
        });
      } else if (currentTask) {
        await onTaskUpdate(currentTask.id, taskData);
        toast({
          title: "کامیابی", 
          description: "ٹاسک اپڈیٹ ہو گیا",
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "خرابی",
        description: "ٹاسک محفوظ کرنے میں خرابی",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      await onTaskUpdate(taskId, { status: newStatus });
      toast({
        title: "کامیابی",
        description: "ٹاسک کی حالت تبدیل ہو گئی",
      });
    } catch (error) {
      toast({
        title: "خرابی",
        description: "حالت تبدیل کرنے میں خرابی",
        variant: "destructive",
      });
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
      toast({
        title: "خرابی",
        description: "پیش قدمی محفوظ کرنے میں خرابی",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <TaskBoard
        tasks={tasks}
        userRole="admin"
        userName="Admin"
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={onTaskDelete}
        onStatusChange={handleStatusChange}
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
