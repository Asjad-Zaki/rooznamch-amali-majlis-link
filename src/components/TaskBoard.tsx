
import React from 'react';
import TaskCard, { Task } from './TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  userRole: 'admin' | 'member';
  userName: string;
  userId?: string;
  onAddTask?: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  onMemberTaskUpdate?: (taskId: string, progress: number, memberNotes: string) => void;
  isLoading?: boolean;
}

const TaskBoard = ({ 
  tasks, 
  userRole, 
  userName, 
  userId,
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onStatusChange, 
  onMemberTaskUpdate,
  isLoading = false
}: TaskBoardProps) => {
  const statusColumns = [
    { id: 'todo', title: 'کرنا ہے', bgColor: 'bg-gray-50' },
    { id: 'inprogress', title: 'جاری', bgColor: 'bg-blue-50' },
    { id: 'review', title: 'جائزہ', bgColor: 'bg-yellow-50' },
    { id: 'done', title: 'مکمل', bgColor: 'bg-green-50' }
  ];

  const getTasksByStatus = (status: Task['status']) => {
    let filteredTasks = tasks.filter(task => task.status === status);
    
    console.log(`TaskBoard - All ${status} tasks:`, filteredTasks.map(t => ({ title: t.title, assignedTo: t.assigned_to_name })));
    
    // For members, show only their assigned tasks (exact name match)
    if (userRole === 'member') {
      filteredTasks = filteredTasks.filter(task => 
        task.assigned_to_name && task.assigned_to_name.toLowerCase() === userName.toLowerCase()
      );
    }
    
    console.log(`TaskBoard - Final ${status} tasks for ${userRole} ${userName}:`, filteredTasks.length);
    return filteredTasks;
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    
    if (taskId && onStatusChange && userRole === 'admin') {
      onStatusChange(taskId, newStatus);
    }
  };

  console.log('TaskBoard - Rendering with:', {
    totalTasks: tasks.length,
    userRole,
    userName,
    tasksPerStatus: {
      todo: tasks.filter(t => t.status === 'todo').length,
      inprogress: tasks.filter(t => t.status === 'inprogress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 p-4">
        {statusColumns.map((column) => (
          <Card key={column.id} className={`${column.bgColor} border-t-4 border-t-blue-500`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm sm:text-lg font-semibold" dir="rtl">
                {column.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8 text-sm" dir="rtl">
                لوڈ ہو رہا ہے...
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 p-4">
      {statusColumns.map((column) => {
        const columnTasks = getTasksByStatus(column.id as Task['status']);
        
        return (
          <Card 
            key={column.id} 
            className={`${column.bgColor} border-t-4 border-t-blue-500 transition-all duration-200 hover:shadow-lg`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id as Task['status'])}
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm sm:text-lg font-semibold" dir="rtl">
                  {column.title}
                </CardTitle>
                <span className="bg-white px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {columnTasks.length}
                </span>
              </div>
              {/* Only show Add Task button for Admin and only in todo column */}
              {userRole === 'admin' && column.id === 'todo' && onAddTask && (
                <Button
                  onClick={onAddTask}
                  className="w-full mt-2 text-sm"
                  variant="outline"
                  dir="rtl"
                >
                  <Plus className="h-4 w-4 ml-2" />
                  نیا ٹاسک
                </Button>
              )}
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-3 min-h-[200px]">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable={userRole === 'admin'}
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={`cursor-${userRole === 'admin' ? 'grab' : 'default'} active:cursor-grabbing`}
                  >
                    <TaskCard
                      task={task}
                      userRole={userRole}
                      userName={userName}
                      userId={userId}
                      onEdit={userRole === 'admin' ? onEditTask : undefined}
                      onDelete={userRole === 'admin' ? onDeleteTask : undefined}
                      onStatusChange={userRole === 'admin' ? onStatusChange : undefined}
                      onMemberTaskUpdate={onMemberTaskUpdate}
                    />
                  </div>
                ))}
                {columnTasks.length === 0 && (
                  <div className="text-center text-gray-500 py-8 text-sm border-2 border-dashed border-gray-300 rounded-lg" dir="rtl">
                    {userRole === 'member' ? 'آپ کے لیے کوئی ٹاسک نہیں' : 'کوئی ٹاسک نہیں - یہاں ٹاسک چھوڑیں'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TaskBoard;
