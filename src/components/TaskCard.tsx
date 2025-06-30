
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  createdAt: string;
  dueDate: string;
}

interface TaskCardProps {
  task: Task;
  userRole: 'admin' | 'member';
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
}

const TaskCard = ({ task, userRole, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const priorityLabels = {
    low: 'کم',
    medium: 'درمیانہ',
    high: 'زیادہ'
  };

  const statusLabels = {
    todo: 'کرنا ہے',
    inprogress: 'جاری',
    review: 'جائزہ',
    done: 'مکمل'
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium" dir="rtl">{task.title}</CardTitle>
          {userRole === 'admin' && (
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(task)}
                className="h-8 w-8 p-0"
              >
                <Settings className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(task.id)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3" dir="rtl">{task.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={priorityColors[task.priority]} dir="rtl">
            ترجیح: {priorityLabels[task.priority]}
          </Badge>
          <Badge variant="outline" dir="rtl">
            ذمہ دار: {task.assignedTo}
          </Badge>
        </div>
        <div className="text-xs text-gray-500 mb-3" dir="rtl">
          <div>آخری تاریخ: {new Date(task.dueDate).toLocaleDateString('ur-PK')}</div>
        </div>
        {/* Only show status change buttons for admins */}
        {userRole === 'admin' && onStatusChange && (
          <div className="flex flex-wrap gap-1">
            {(['todo', 'inprogress', 'review', 'done'] as const).map((status) => (
              <Button
                key={status}
                variant={task.status === status ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange(task.id, status)}
                className="text-xs"
                dir="rtl"
              >
                {statusLabels[status]}
              </Button>
            ))}
          </div>
        )}
        {/* For members, just show current status */}
        {userRole === 'member' && (
          <div className="mt-2">
            <Badge variant="secondary" dir="rtl">
              حالت: {statusLabels[task.status]}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
