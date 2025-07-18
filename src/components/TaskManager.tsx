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
}

const TaskManager = ({ userRole, userName, className }: TaskManagerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use the new tasks hook with real-time updates
  const { 
    tasks, 
    isLoading, 
    createTask, 
    updateTask, 
    deleteTask, 
    updateTaskStatus,
    isCreating,
    isUpdating,
    isDeleting
  } = useTasks();

  // Fetch profiles for task assignment
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('is_active', true)
          .order('name');
        
        if (error) throw error;
        setProfiles((data || []).map(p => ({
          ...p,
          role: p.role as 'admin' | 'member'
        })));
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  // Set up real-time subscription for tasks and profiles
  useEffect(() => {
    const tasksChannel = supabase
      .channel('tasks-realtime-manager')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          console.log('Task change:', payload);
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
      )
      .subscribe();

    const profilesChannel = supabase
      .channel('profiles-realtime-manager')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Profile change:', payload);
          queryClient.invalidateQueries({ queryKey: ['profiles'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, [queryClient]);

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
    const cleanTaskData: TaskData = {
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status,
      priority: taskData.priority,
      assigned_to_name: taskData.assigned_to_name || '',
      due_date: taskData.due_date || '',
      member_notes: taskData.member_notes || '',
      progress: taskData.progress || 0,
    };

    try {
      if (modalMode === 'create') {
        createTask(cleanTaskData);
      } else if (currentTask) {
        updateTask({ id: currentTask.id, data: cleanTaskData });
      }
      
      setIsModalOpen(false);
      setCurrentTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      updateTaskStatus({ id: taskId, status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleMemberTaskUpdate = async (taskId: string, progress: number, memberNotes: string) => {
    try {
      updateTask({ 
        id: taskId, 
        data: { progress, member_notes: memberNotes }
      });
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