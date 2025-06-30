
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LoginFormProps {
  onLogin: (role: 'admin' | 'member', userName: string) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [userName, setUserName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      onLogin(role, userName);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2" dir="rtl">
            مجلس دعوۃ الحق
          </h1>
          <p className="text-gray-600" dir="rtl">ٹاسک منیجمنٹ سسٹم</p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mt-4"></div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-semibold text-gray-800" dir="rtl">
              داخلہ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="userName" className="text-right block" dir="rtl">
                  آپ کا نام
                </Label>
                <Input
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="text-right"
                  dir="rtl"
                  placeholder="اپنا نام درج کریں"
                />
              </div>

              <div>
                <Label htmlFor="role" className="text-right block" dir="rtl">
                  آپ کا کردار
                </Label>
                <Select value={role} onValueChange={(value: 'admin' | 'member') => setRole(value)}>
                  <SelectTrigger className="text-right">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin" dir="rtl">منتظم (Admin)</SelectItem>
                    <SelectItem value="member" dir="rtl">رکن (Member)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3"
                dir="rtl"
              >
                داخل ہوں
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2" dir="rtl">ڈیمو اکاؤنٹس:</h3>
              <div className="text-sm text-blue-700 space-y-1" dir="rtl">
                <div>منتظم: مکمل کنٹرول (بنانا، اپڈیٹ، ڈیلیٹ)</div>
                <div>رکن: ٹاسک دیکھنا اور اپڈیٹ کرنا</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-gray-500 text-sm" dir="rtl">
          © 2024 مجلس دعوۃ الحق - تمام حقوق محفوظ
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
