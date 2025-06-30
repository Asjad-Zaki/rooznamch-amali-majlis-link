
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Edit, Plus, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  password: string;
  createdAt: string;
  isActive: boolean;
}

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
}

const UserManagement = ({ 
  users, 
  onAddUser, 
  onEditUser, 
  onDeleteUser, 
  onToggleUserStatus 
}: UserManagementProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member' as User['role'],
    password: '',
    isActive: true
  });

  const handleAddUser = () => {
    setCurrentUser(null);
    setModalMode('create');
    setFormData({
      name: '',
      email: '',
      role: 'member',
      password: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setModalMode('edit');
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password,
      isActive: user.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create') {
      onAddUser(formData);
    } else if (currentUser) {
      onEditUser({ ...currentUser, ...formData });
    }
    setIsModalOpen(false);
  };

  const activeUsers = users.filter(user => user.isActive);
  const inactiveUsers = users.filter(user => !user.isActive);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2" dir="rtl">
              <Users className="h-5 w-5" />
              صارف کا انتظام
            </CardTitle>
            <Button onClick={handleAddUser} dir="rtl">
              <Plus className="h-4 w-4 ml-2" />
              نیا صارف
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Users */}
            <div>
              <h3 className="text-lg font-semibold mb-4" dir="rtl">فعال صارفین</h3>
              <div className="space-y-3">
                {activeUsers.map((user) => (
                  <Card key={user.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium" dir="rtl">{user.name}</h4>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? 'منتظم' : 'رکن'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600" dir="rtl">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString('ur-PK')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onToggleUserStatus(user.id)}
                          className="text-orange-600"
                        >
                          غیر فعال
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteUser(user.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Inactive Users */}
            <div>
              <h3 className="text-lg font-semibold mb-4" dir="rtl">غیر فعال صارفین</h3>
              <div className="space-y-3">
                {inactiveUsers.map((user) => (
                  <Card key={user.id} className="p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-600" dir="rtl">{user.name}</h4>
                          <Badge variant="outline">
                            {user.role === 'admin' ? 'منتظم' : 'رکن'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500" dir="rtl">{user.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onToggleUserStatus(user.id)}
                          className="text-green-600"
                        >
                          فعال کریں
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteUser(user.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle dir="rtl">
              {modalMode === 'create' ? 'نیا صارف شامل کریں' : 'صارف میں تبدیلی'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" dir="rtl">نام</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                dir="rtl"
              />
            </div>
            <div>
              <Label htmlFor="email" dir="rtl">ای میل</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                dir="rtl"
              />
            </div>
            <div>
              <Label htmlFor="password" dir="rtl">پاس ورڈ</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                dir="rtl"
              />
            </div>
            <div>
              <Label htmlFor="role" dir="rtl">کردار</Label>
              <Select
                value={formData.role}
                onValueChange={(value: User['role']) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member" dir="rtl">رکن</SelectItem>
                  <SelectItem value="admin" dir="rtl">منتظم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} dir="rtl">
                منسوخ
              </Button>
              <Button type="submit" dir="rtl">
                {modalMode === 'create' ? 'شامل کریں' : 'محفوظ کریں'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
