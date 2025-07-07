import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Edit, Plus, Users, Key, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Updated User interface - removed password
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  secretNumber: string;
  createdAt: string;
  isActive: boolean;
}

// Removed props as UserManagement will manage its own data
interface UserManagementProps {
  // No props needed here anymore, it will fetch its own data
}

const UserManagement = ({}: UserManagementProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member' as User['role'],
    password: '', // Only for create mode
    secretNumber: '',
    isActive: true
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return data as User[];
    },
  });

  // Add user mutation
  const addUserMutation = useMutation({
    mutationFn: async (newUser: Omit<User, 'id' | 'createdAt'> & { password?: string }) => {
      // For new user, first sign up with email/password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password || '', // Password is required for signUp
        options: {
          data: {
            name: newUser.name,
            role: newUser.role,
            is_active: newUser.isActive,
            // secret_number is a custom field, not directly handled by auth.signUp metadata
            // It will be updated in the profiles table after the user is created by the trigger
          },
        },
      });

      if (authError) throw authError;

      // The handle_new_user trigger creates the profile entry.
      // Now, update the secret_number in the newly created profile.
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ secret_number: newUser.secretNumber })
        .eq('id', authData.user?.id);

      if (profileUpdateError) throw profileUpdateError;

      return { ...newUser, id: authData.user?.id || '', createdAt: new Date().toISOString() } as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "کامیاب",
        description: "صارف کامیابی سے شامل کر دیا گیا ہے",
      });
    },
    onError: (err) => {
      toast({
        title: "خرابی",
        description: `صارف شامل کرنے میں خرابی: ${err.message}`,
        variant: "destructive",
      });
    },
  });

  // Edit user mutation
  const editUserMutation = useMutation({
    mutationFn: async (updatedUser: User) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          secret_number: updatedUser.secretNumber,
          is_active: updatedUser.isActive,
        })
        .eq('id', updatedUser.id);
      if (error) throw error;
      return updatedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "کامیاب",
        description: "صارف کی معلومات کامیابی سے اپڈیٹ ہو گئی ہے",
      });
    },
    onError: (err) => {
      toast({
        title: "خرابی",
        description: `صارف اپڈیٹ کرنے میں خرابی: ${err.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Deleting from auth.users will cascade delete from profiles due to foreign key constraint
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "کامیاب",
        description: "صارف کامیابی سے حذف کر دیا گیا ہے",
      });
    },
    onError: (err) => {
      toast({
        title: "خرابی",
        description: `صارف حذف کرنے میں خرابی: ${err.message}`,
        variant: "destructive",
      });
    },
  });

  // Toggle user status mutation
  const toggleUserStatusMutation = useMutation({
    mutationFn: async (user: User) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !user.isActive })
        .eq('id', user.id);
      if (error) throw error;
      return { ...user, isActive: !user.isActive };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "کامیاب",
        description: "صارف کی حالت کامیابی سے تبدیل ہو گئی ہے",
      });
    },
    onError: (err) => {
      toast({
        title: "خرابی",
        description: `صارف کی حالت تبدیل کرنے میں خرابی: ${err.message}`,
        variant: "destructive",
      });
    },
  });

  const generateSecretNumber = () => {
    const secretNumber = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData({ ...formData, secretNumber });
  };

  const copySecretNumber = (secretNumber: string) => {
    navigator.clipboard.writeText(secretNumber);
    toast({
      title: "کاپی ہو گیا",
      description: "خفیہ نمبر کاپی بورڈ میں کاپی ہو گیا ہے",
    });
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setModalMode('create');
    const newSecretNumber = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData({
      name: '',
      email: '',
      role: 'member',
      password: '', // Reset password for new user
      secretNumber: newSecretNumber,
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
      password: '', // Password is not editable for existing users via this form
      secretNumber: user.secretNumber,
      isActive: user.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create') {
      await addUserMutation.mutateAsync(formData);
    } else if (currentUser) {
      await editUserMutation.mutateAsync({ ...currentUser, ...formData });
    }
    setIsModalOpen(false);
  };

  const activeUsers = users?.filter(user => user.isActive) || [];
  const inactiveUsers = users?.filter(user => !user.isActive) || [];

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-600" dir="rtl">
        صارفین لوڈ ہو رہے ہیں...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600" dir="rtl">
        صارفین لوڈ کرنے میں خرابی: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2" dir="rtl">
              <Users className="h-5 w-5" />
              صارف کا انتظام
            </CardTitle>
            <Button onClick={handleAddUser} dir="rtl" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 ml-2" />
              نیا صارف
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Users */}
            <div>
              <h3 className="text-lg font-semibold mb-4" dir="rtl">فعال صارفین</h3>
              <div className="space-y-3">
                {activeUsers.length === 0 ? (
                  <p className="text-center text-gray-500" dir="rtl">کوئی فعال صارف نہیں</p>
                ) : (
                  activeUsers.map((user) => (
                    <Card key={user.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-medium" dir="rtl">{user.name}</h4>
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role === 'admin' ? 'منتظم' : 'رکن'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600" dir="rtl">{user.email}</p>
                            <div className="flex items-center gap-2">
                              <Key className="h-3 w-3 text-gray-400" />
                              <span className="text-sm font-mono">{user.secretNumber}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copySecretNumber(user.secretNumber)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
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
                              onClick={() => toggleUserStatusMutation.mutate(user)}
                              className="text-orange-600"
                            >
                              غیر فعال
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteUserMutation.mutate(user.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Inactive Users */}
            <div>
              <h3 className="text-lg font-semibold mb-4" dir="rtl">غیر فعال صارفین</h3>
              <div className="space-y-3">
                {inactiveUsers.length === 0 ? (
                  <p className="text-center text-gray-500" dir="rtl">کوئی غیر فعال صارف نہیں</p>
                ) : (
                  inactiveUsers.map((user) => (
                    <Card key={user.id} className="p-4 bg-gray-50">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-600" dir="rtl">{user.name}</h4>
                            <Badge variant="outline">
                              {user.role === 'admin' ? 'منتظم' : 'رکن'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500" dir="rtl">{user.email}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserStatusMutation.mutate(user)}
                            className="text-green-600"
                          >
                            فعال کریں
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteUserMutation.mutate(user.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
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
            {modalMode === 'create' && ( // Only show password for create mode
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
            )}
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
            <div>
              <Label htmlFor="secretNumber" dir="rtl">خفیہ نمبر</Label>
              <div className="flex gap-2">
                <Input
                  id="secretNumber"
                  value={formData.secretNumber}
                  onChange={(e) => setFormData({ ...formData, secretNumber: e.target.value })}
                  required
                  dir="rtl"
                  className="flex-1"
                />
                <Button type="button" onClick={generateSecretNumber} variant="outline">
                  تبدیل کریں
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} dir="rtl" className="w-full sm:w-auto">
                منسوخ
              </Button>
              <Button type="submit" dir="rtl" className="w-full sm:w-auto" disabled={addUserMutation.isPending || editUserMutation.isPending}>
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