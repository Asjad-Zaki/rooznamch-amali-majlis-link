
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLogin: (role: 'admin' | 'member', userName: string) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [userName, setUserName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const { toast } = useToast();

  // Simple admin password (in a real app, this would be properly secured)
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      toast({
        title: 'خرابی',
        description: 'برائے کرم اپنا نام درج کریں',
        variant: 'destructive'
      });
      return;
    }

    if (role === 'admin') {
      if (adminPassword !== ADMIN_PASSWORD) {
        toast({
          title: 'غلط پاس ورڈ',
          description: 'منتظم کا پاس ورڈ غلط ہے',
          variant: 'destructive'
        });
        return;
      }
    }

    onLogin(role, userName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/e1652408-702e-47c9-834c-bafadef748e9.png" 
            alt="Majlis e Dawatul Haq Logo" 
            className="h-16 w-16 mx-auto mb-4 rounded-full"
          />
          <h1 dir="rtl" className="text-blue-800 mb-2 text-4xl font-semibold">
            مجلس دعوۃ الحق
          </h1>
          <p dir="rtl" className="text-gray-600">ٹاسک منیجمنٹ سسٹم</p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mt-4"></div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle dir="rtl" className="text-2xl font-semibold text-blue-800">
              داخلہ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="userName" dir="rtl" className="text-right block">
                  آپ کا نام
                </Label>
                <Input 
                  id="userName" 
                  type="text" 
                  value={userName} 
                  onChange={e => setUserName(e.target.value)} 
                  required 
                  className="text-right" 
                  dir="rtl" 
                  placeholder="اپنا نام درج کریں" 
                />
              </div>

              <div>
                <Label htmlFor="role" dir="rtl" className="text-right block">
                  آپ کا کردار
                </Label>
                <Select 
                  value={role} 
                  onValueChange={(value: 'admin' | 'member') => {
                    setRole(value);
                    setAdminPassword(''); // Reset password when changing role
                  }}
                >
                  <SelectTrigger className="text-right">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member" dir="rtl">رکن (Member)</SelectItem>
                    <SelectItem value="admin" dir="rtl">منتظم (Admin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Admin Password Field */}
              {role === 'admin' && (
                <div>
                  <Label htmlFor="adminPassword" dir="rtl" className="text-right block">
                    منتظم کا پاس ورڈ
                  </Label>
                  <Input 
                    id="adminPassword" 
                    type="password" 
                    value={adminPassword} 
                    onChange={e => setAdminPassword(e.target.value)} 
                    required 
                    className="text-right" 
                    dir="rtl" 
                    placeholder="منتظم کا پاس ورڈ درج کریں" 
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right" dir="rtl">
                    ڈیمو کے لیے: admin123
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3" 
                dir="rtl"
              >
                داخل ہوں
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-gray-500 text-sm" dir="rtl">
          ©2025 مجلس دعوۃ الحق
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
