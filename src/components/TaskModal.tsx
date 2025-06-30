
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Task } from './TaskCard';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  task?: Task | null;
  mode: 'create' | 'edit';
}

const TaskModal = ({ isOpen, onClose, onSave, task, mode }: TaskModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    assignedTo: '',
    dueDate: '',
    progress: 0,
    memberNotes: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate,
        progress: task.progress,
        memberNotes: task.memberNotes
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignedTo: '',
        dueDate: '',
        progress: 0,
        memberNotes: ''
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
            <Label htmlFor="assignedTo" dir="rtl">ذمہ دار</Label>
            <Input
              id="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
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
                <SelectItem value="inprogress" dir="rtl">جاری</SelectItem>
                <SelectItem value="review" dir="rtl">جائزہ</SelectItem>
                <SelectItem value="done" dir="rtl">مکمل</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dueDate" dir="rtl">آخری تاریخ</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
