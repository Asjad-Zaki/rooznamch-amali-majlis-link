
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from './UserManagement';

interface LoginFormProps {
  onLogin: (role: 'admin' | 'member', name: string, userId: string) => void;
  users: User[];
}

const LoginForm = ({ onLogin, users }: LoginFormProps) => {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [memberSecretNumber, setMemberSecretNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const admin = users.find(u => 
        u.email.toLowerCase() === adminEmail.toLowerCase() && 
        u.password === adminPassword &&
        u.role === 'admin' &&
        u.isActive
      );

      if (admin) {
        onLogin('admin', admin.name, admin.id);
      } else {
        setError('غلط ای میل یا پاس ورڈ، یا آپ کا اکاؤنٹ غیر فعال ہے');
      }
    } catch (err) {
      setError('لاگ ان میں خرابی ہوئی');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const member = users.find(u => 
        u.secretNumber === memberSecretNumber &&
        u.role === 'member' &&
        u.isActive
      );

      if (member) {
        onLogin('member', member.name, member.id);
      } else {
        setError('غلط خفیہ نمبر یا آپ کا اکاؤنٹ غیر فعال ہے');
      }
    } catch (err) {
      setError('لاگ ان میں خرابی ہوئی');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/e1652408-702e-47c9-834c-bafadef748e9.png" 
              alt="Majlis e Dawatul Haq Logo" 
              className="h-16 w-16 rounded-full"
            />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center" dir="rtl">
            مجلس دعوۃ الحق
          </CardTitle>
          <p className="text-gray-600 text-center text-sm sm:text-base" dir="rtl">
            ٹاسک منیجمنٹ سسٹم میں لاگ ان کریں
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="member" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="member" dir="rtl" className="text-sm">رکن لاگ ان</TabsTrigger>
              <TabsTrigger value="admin" dir="rtl" className="text-sm">منتظم لاگ ان</TabsTrigger>
            </TabsList>
            
            <TabsContent value="member">
              <form onSubmit={handleMemberLogin} className="space-y-4">
                <div>
                  <Label htmlFor="secretNumber" dir="rtl" className="text-sm">خفیہ نمبر</Label>
                  <Input
                    id="secretNumber"
                    type="text"
                    value={memberSecretNumber}
                    onChange={(e) => setMemberSecretNumber(e.target.value)}
                    required
                    dir="rtl"
                    placeholder="آپ کا خفیہ نمبر داخل کریں"
                    className="text-center font-mono text-lg"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                  dir="rtl"
                >
                  {isLoading ? 'لاگ ان ہو رہا ہے...' : 'لاگ ان'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <Label htmlFor="adminEmail" dir="rtl" className="text-sm">ای میل</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    dir="rtl"
                    placeholder="آپ کا ای میل داخل کریں"
                  />
                </div>
                <div>
                  <Label htmlFor="adminPassword" dir="rtl" className="text-sm">پاس ورڈ</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    dir="rtl"
                    placeholder="آپ کا پاس ورڈ داخل کریں"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                  dir="rtl"
                >
                  {isLoading ? 'لاگ ان ہو رہا ہے...' : 'لاگ ان'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription dir="rtl" className="text-sm">{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-sm" dir="rtl">ڈیمو اکاؤنٹس:</h3>
            <div className="text-xs space-y-1" dir="rtl">
              <p><strong>منتظم:</strong> admin@example.com / admin123</p>
              <p><strong>رکن:</strong> خفیہ نمبر: 123456</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
