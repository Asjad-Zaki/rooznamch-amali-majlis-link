
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Settings, Edit3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  createdAt: string;
  dueDate: string;
  progress: number;
  memberNotes: string;
}

interface TaskCardProps {
  task: Task;
  userRole: 'admin' | 'member';
  userName: string;
  userId?: string;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  onMemberTaskUpdate?: (taskId: string, progress: number, memberNotes: string) => void;
}

const TaskCard = ({ task, userRole, userName, userId, onEdit, onDelete, onStatusChange, onMemberTaskUpdate }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(task.progress);
  const [memberNotes, setMemberNotes] = useState(task.memberNotes);

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

  const handleMemberUpdate = () => {
    if (onMemberTaskUpdate && task.assignedTo === userName) {
      onMemberTaskUpdate(task.id, progress, memberNotes);
      setIsEditing(false);
    }
  };

  const canMemberEdit = userRole === 'member' && task.assignedTo === userName;

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xs sm:text-sm font-medium flex-1" dir="rtl">{task.title}</CardTitle>
          <div className="flex gap-1">
            {userRole === 'admin' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(task)}
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                >
                  <Settings className="h-2 w-2 sm:h-3 sm:w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(task.id)}
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-2 w-2 sm:h-3 sm:w-3" />
                </Button>
              </>
            )}
            {canMemberEdit && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-blue-500 hover:text-blue-700"
              >
                <Edit3 className="h-2 w-2 sm:h-3 sm:w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs sm:text-sm text-gray-600 mb-3" dir="rtl">{task.description}</p>
        
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
          <Badge className={`${priorityColors[task.priority]} text-xs`} dir="rtl">
            ترجیح: {priorityLabels[task.priority]}
          </Badge>
          <Badge variant="outline" className="text-xs" dir="rtl">
            ذمہ دار: {task.assignedTo}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1" dir="rtl">
            <span>پیش قدمی</span>
            <span>{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Member Notes */}
        {task.memberNotes && (
          <div className="mb-3 p-2 bg-blue-50 rounded text-xs sm:text-sm" dir="rtl">
            <strong>رکن کی رپورٹ:</strong> {task.memberNotes}
          </div>
        )}

        {/* Member Edit Form */}
        {isEditing && canMemberEdit && (
          <div className="mb-3 p-3 border rounded-lg bg-gray-50">
            <div className="space-y-3">
              <div>
                <Label htmlFor="progress" dir="rtl" className="text-right block text-xs sm:text-sm">
                  پیش قدمی (%)
                </Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="text-right text-sm"
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="notes" dir="rtl" className="text-right block text-xs sm:text-sm">
                  آپ کی رپورٹ
                </Label>
                <Textarea
                  id="notes"
                  value={memberNotes}
                  onChange={(e) => setMemberNotes(e.target.value)}
                  className="text-right text-sm min-h-[60px]"
                  dir="rtl"
                  placeholder="اپنی پیش قدمی کی تفصیل لکھیں"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" onClick={handleMemberUpdate} dir="rtl" className="text-xs">
                  محفوظ کریں
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  dir="rtl"
                  className="text-xs"
                >
                  منسوخ
                </Button>
              </div>
            </div>
          </div>
        )}

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
            <Badge variant="secondary" dir="rtl" className="text-xs">
              حالت: {statusLabels[task.status]}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
