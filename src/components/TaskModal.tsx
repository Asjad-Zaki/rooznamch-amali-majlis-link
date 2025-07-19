import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Task } from './TaskCard';
import { Profile } from '@/hooks/useAuth';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  task?: Task | null;
  mode: 'create' | 'edit';
  profiles: Profile[];
}

const TaskModal = ({ isOpen, onClose, onSave, task, mode, profiles }: TaskModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    assigned_to_name: '', // Changed to assigned_to_name
    due_date: '', // Changed to due_date
    progress: 0,
    member_notes: '' // Changed to member_notes
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigned_to_name: task.assigned_to_name, // Use assigned_to_name
        due_date: task.due_date, // Use due_date
        progress: task.progress,
        member_notes: task.member_notes // Use member_notes
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assigned_to_name: '',
        due_date: '',
        progress: 0,
        member_notes: ''
      });
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...formData,
      updated_at: new Date().toISOString()
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle dir="rtl">
            {mode === 'create' ? 'نیا ٹاسک بنائیں' : 'ٹاسک میں تبدیلی'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" dir="rtl">ٹاسک کا نام</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              dir="rtl"
            />
          </div>
          <div>
            <Label htmlFor="description" dir="rtl">تفصیل</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              dir="rtl"
            />
          </div>
          <div>
            <Label htmlFor="assigned_to_name" dir="rtl">ذمہ دار</Label> {/* Changed to assigned_to_name */}
            <Input
              id="assigned_to_name"
              value={formData.assigned_to_name}
              onChange={(e) => setFormData({ ...formData, assigned_to_name: e.target.value })}
              required
              dir="rtl"
            />
          </div>
          <div>
            <Label htmlFor="priority" dir="rtl">ترجیح</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: Task['priority']) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low" dir="rtl">کم</SelectItem>
                <SelectItem value="medium" dir="rtl">درمیانہ</SelectItem>
                <SelectItem value="high" dir="rtl">زیادہ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status" dir="rtl">حالت</Label>
            <Select
              value={formData.status}
              onValueChange={(value: Task['status']) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo" dir="rtl">کرنا ہے</SelectItem>
                <SelectItem value="in-progress" dir="rtl">جاری</SelectItem>
                <SelectItem value="in-review" dir="rtl">جائزہ</SelectItem>
                <SelectItem value="completed" dir="rtl">مکمل</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="due_date" dir="rtl">آخری تاریخ</Label> {/* Changed to due_date */}
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} dir="rtl">
              منسوخ
            </Button>
            <Button type="submit" dir="rtl">
              {mode === 'create' ? 'بنائیں' : 'محفوظ کریں'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;