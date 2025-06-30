
import React from 'react';
import TaskCard, { Task } from './TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  userRole: 'admin' | 'member';
  onAddTask?: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
}

const TaskBoard = ({ tasks, userRole, onAddTask, onEditTask, onDeleteTask, onStatusChange }: TaskBoardProps) => {
  const statusColumns = [
    { id: 'todo', title: 'کرنا ہے', bgColor: 'bg-gray-50' },
    { id: 'inprogress', title: 'جاری', bgColor: 'bg-blue-50' },
    { id: 'review', title: 'جائزہ', bgColor: 'bg-yellow-50' },
    { id: 'done', title: 'مکمل', bgColor: 'bg-green-50' }
  ];

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statusColumns.map((column) => (
        <Card key={column.id} className={`${column.bgColor} border-t-4 border-t-blue-500`}>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold" dir="rtl">
                {column.title}
              </CardTitle>
              <span className="bg-white px-2 py-1 rounded-full text-sm font-medium">
                {getTasksByStatus(column.id as Task['status']).length}
              </span>
            </div>
            {/* Only show Add Task button for Admin and only in todo column */}
            {userRole === 'admin' && column.id === 'todo' && onAddTask && (
              <Button
                onClick={onAddTask}
                className="w-full mt-2"
                variant="outline"
                dir="rtl"
              >
                <Plus className="h-4 w-4 ml-2" />
                نیا ٹاسک
              </Button>
            )}
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {getTasksByStatus(column.id as Task['status']).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                userRole={userRole}
                onEdit={userRole === 'admin' ? onEditTask : undefined}
                onDelete={userRole === 'admin' ? onDeleteTask : undefined}
                onStatusChange={userRole === 'admin' ? onStatusChange : undefined}
              />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskBoard;
