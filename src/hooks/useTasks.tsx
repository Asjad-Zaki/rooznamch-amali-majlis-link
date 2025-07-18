import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TasksService, Task, TaskData } from '@/services/TasksService';
import { useToast } from '@/hooks/use-toast';

export const useTasks = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all tasks
  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: TasksService.getTasks,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: TasksService.createTask,
    onMutate: async (newTask: TaskData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      // Optimistically update
      const optimisticTask: Task = {
        id: 'temp-' + Date.now(),
        ...newTask,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData<Task[]>(['tasks'], (old) => 
        old ? [optimisticTask, ...old] : [optimisticTask]
      );

      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      // Rollback on error
      queryClient.setQueryData(['tasks'], context?.previousTasks);
      toast({
        title: "خرابی",
        description: "ٹاسک بنانے میں خرابی ہوئی",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "کامیابی",
        description: "ٹاسک کامیابی سے بن گیا",
      });
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskData> }) => 
      TasksService.updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.map((task) =>
          task.id === id ? { ...task, ...data, updated_at: new Date().toISOString() } : task
        ) || []
      );

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
      toast({
        title: "خرابی",
        description: "ٹاسک اپڈیٹ کرنے میں خرابی ہوئی",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "کامیابی",
        description: "ٹاسک کامیابی سے اپڈیٹ ہو گیا",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: TasksService.deleteTask,
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.filter((task) => task.id !== taskId) || []
      );

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
      toast({
        title: "خرابی",
        description: "ٹاسک ڈیلیٹ کرنے میں خرابی ہوئی",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "کامیابی",
        description: "ٹاسک کامیابی سے ڈیلیٹ ہو گیا",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Update task status mutation (for drag and drop)
  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task['status'] }) =>
      TasksService.updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.map((task) =>
          task.id === id ? { ...task, status, updated_at: new Date().toISOString() } : task
        ) || []
      );

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
      toast({
        title: "خرابی",
        description: "ٹاسک کی حالت تبدیل کرنے میں خرابی ہوئی",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    refetch: tasksQuery.refetch,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    updateTaskStatus: updateTaskStatusMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
};