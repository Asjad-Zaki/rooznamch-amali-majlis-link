import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Settings, Edit3, Clock, CalendarDays, TrendingUp, MessageSquare, Users, Info } from 'lucide-react'; // Added Users and Info
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'in-review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_to_name: string;
  created_at: string;
  updated_at: string;
  due_date: string;
  progress: number;
  member_notes: string;
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
  const [memberNotes, setMemberNotes] = useState(task.member_notes);

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200'
  };

  const priorityLabels = {
    low: 'کم',
    medium: 'درمیانہ',
    high: 'زیادہ'
  };

  const statusLabels = {
    todo: 'کرنا ہے',
    'in-progress': 'جاری',
    'in-review': 'جائزہ',
    completed: 'مکمل'
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-700 border-gray-200',
    'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'in-review': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    completed: 'bg-green-100 text-green-700 border-green-200'
  };

  const handleMemberUpdate = () => {
    if (onMemberTaskUpdate && task.assigned_to_name === userName) {
      onMemberTaskUpdate(task.id, progress, memberNotes);
      setIsEditing(false);
    }
  };

  const canMemberEdit = userRole === 'member' && task.assigned_to_name === userName;

  return (
    <Card className="mb-4 bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl border border-gray-200">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-sm sm:text-base font-bold text-gray-800 flex-1" dir="rtl">{task.title}</CardTitle>
          <div className="flex gap-1">
            {userRole === 'admin' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(task)}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                  title="ٹاسک میں تبدیلی"
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(task.id)}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                  title="ٹاسک حذف کریں"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </>
            )}
            {canMemberEdit && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                title="پیش قدمی اپڈیٹ کریں"
              >
                <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="text-xs sm:text-sm text-gray-600 mb-3" dir="rtl">{task.description}</p>
        
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge className={`${priorityColors[task.priority]} text-xs font-medium px-2 py-0.5 rounded-full`} dir="rtl">
            <Clock className="h-3 w-3 ml-1" />
            ترجیح: {priorityLabels[task.priority]}
          </Badge>
          <Badge variant="outline" className="text-xs font-medium px-2 py-0.5 rounded-full border-gray-300 text-gray-700" dir="rtl">
            <Users className="h-3 w-3 ml-1" />
            ذمہ دار: {task.assigned_to_name}
          </Badge>
          <Badge className={`${statusColors[task.status]} text-xs font-medium px-2 py-0.5 rounded-full`} dir="rtl">
            <Info className="h-3 w-3 ml-1" />
            حالت: {statusLabels[task.status]}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1" dir="rtl">
            <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> پیش قدمی</span>
            <span>{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Member Notes */}
        {task.member_notes && (
          <div className="mb-3 p-2 bg-blue-50 rounded-md text-xs sm:text-sm border border-blue-200 text-blue-800 flex items-start gap-2" dir="rtl">
            <MessageSquare className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-0.5">رکن کی رپورٹ:</strong> 
              {task.member_notes}
            </div>
          </div>
        )}

        {/* Member Edit Form */}
        {isEditing && canMemberEdit && (
          <div className="mb-3 p-3 border rounded-lg bg-gray-50 shadow-inner">
            <div className="space-y-3">
              <div>
                <Label htmlFor="progress" dir="rtl" className="text-right block text-xs sm:text-sm font-medium mb-1">
                  پیش قدمی (%)
                </Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="text-right text-sm bg-white border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="notes" dir="rtl" className="text-right block text-xs sm:text-sm font-medium mb-1">
                  آپ کی رپورٹ
                </Label>
                <Textarea
                  id="notes"
                  value={memberNotes}
                  onChange={(e) => setMemberNotes(e.target.value)}
                  className="text-right text-sm min-h-[60px] bg-white border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                  dir="rtl"
                  placeholder="اپنی پیش قدمی کی تفصیل لکھیں"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" onClick={handleMemberUpdate} dir="rtl" className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
                  محفوظ کریں
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  dir="rtl"
                  className="text-xs border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  منسوخ
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-3 flex items-center gap-1" dir="rtl">
          <CalendarDays className="h-3 w-3" />
          <div>آخری تاریخ: {new Date(task.due_date).toLocaleDateString('ur-PK')}</div>
        </div>

        {/* Only show status change buttons for admins */}
        {userRole === 'admin' && onStatusChange && (
          <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-gray-100">
            {(['todo', 'in-progress', 'in-review', 'completed'] as const).map((status) => (
              <Button
                key={status}
                variant={task.status === status ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange(task.id, status)}
                className={`text-xs px-3 py-1.5 rounded-full ${task.status === status ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                dir="rtl"
              >
                {statusLabels[status]}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;