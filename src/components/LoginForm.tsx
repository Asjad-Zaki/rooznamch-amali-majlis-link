
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User } from './UserManagement';

interface LoginFormProps {
  onLogin: (role: 'admin' | 'member', name: string, userId: string) => void;
  users: User[];
}

const LoginForm = ({ onLogin, users }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Find user by email and password
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password &&
        u.isActive
      );

      if (user) {
        onLogin(user.role, user.name, user.id);
      } else {
        setError('غلط ای میل یا پاس ورڈ، یا آپ کا اکاؤنٹ غیر فعال ہے');
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
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/e1652408-702e-47c9-834c-bafadef748e9.png" 
              alt="Majlis e Dawatul Haq Logo" 
              className="h-16 w-16 rounded-full"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center" dir="rtl">
            مجلس دعوۃ الحق
          </CardTitle>
          <p className="text-gray-600 text-center" dir="rtl">
            ٹاسک منیجمنٹ سسٹم میں لاگ ان کریں
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" dir="rtl">ای میل</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="rtl"
                placeholder="آپ کا ای میل داخل کریں"
              />
            </div>
            <div>
              <Label htmlFor="password" dir="rtl">پاس ورڈ</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="rtl"
                placeholder="آپ کا پاس ورڈ داخل کریں"
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription dir="rtl">{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
              dir="rtl"
            >
              {isLoading ? 'لاگ ان ہو رہا ہے...' : 'لاگ ان'}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2" dir="rtl">ڈیمو اکاؤنٹس:</h3>
            <div className="text-sm space-y-1" dir="rtl">
              <p><strong>منتظم:</strong> admin@example.com / admin123</p>
              <p><strong>رکن:</strong> member@example.com / member123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
