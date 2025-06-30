import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
interface LoginFormProps {
  onLogin: (role: 'admin' | 'member', userName: string) => void;
}
const LoginForm = ({
  onLogin
}: LoginFormProps) => {
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [userName, setUserName] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      onLogin(role, userName);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4 px-[62px] mx-px bg-slate-300 my-[17px]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 dir="rtl" className="text-blue-800 mb-2 py-px px-px text-4xl font-semibold mx-[96px] my-[2px]">
            مجلس دعوۃ الحق
          </h1>
          <p dir="rtl" className="text-gray-600 mx-[111px] my-[11px] px-[35px] py-[15px]">ٹاسک منیجمنٹ سسٹم</p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mt-4"></div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle dir="rtl" className="text-2xl font-semibold px-[75px] my-0 mx-[55px] text-blue-800">داخلہ Login </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="userName" dir="rtl" className="text-right block my-[15px] mx-[2px]">
                  آپ کا نام
                </Label>
                <Input id="userName" type="text" value={userName} onChange={e => setUserName(e.target.value)} required className="text-right" dir="rtl" placeholder="اپنا نام درج کریں" />
              </div>

              <div>
                <Label htmlFor="role" dir="rtl" className="text-right block mx-0 my-[12px]">
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

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3" dir="rtl">
                داخل ہوں
              </Button>
            </form>

            
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-gray-500 text-sm" dir="rtl">©2025 مجلس دعوۃ الحق </div>
      </div>
    </div>;
};
export default LoginForm;