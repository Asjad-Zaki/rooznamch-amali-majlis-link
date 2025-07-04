
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "لاگ ان میں خرابی",
            description: error.message === 'Invalid login credentials' 
              ? "غلط ای میل یا پاس ورڈ" 
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "کامیابی",
            description: "آپ کامیابی سے لاگ ان ہو گئے",
          });
        }
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          toast({
            title: "اکاؤنٹ بنانے میں خرابی",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "کامیابی",
            description: "اکاؤنٹ بن گیا! اپ ای میل چیک کریں",
          });
        }
      }
    } catch (error) {
      toast({
        title: "خرابی",
        description: "کچھ غلط ہوا، دوبارہ کوشش کریں",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" dir="rtl">
            مجلس دعوۃ الحق
          </CardTitle>
          <p className="text-gray-600 text-sm" dir="rtl">
            ٹاسک مینجمنٹ سسٹم
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              dir="rtl"
            >
              لاگ ان
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isLogin 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              dir="rtl"
            >
              نیا اکاؤنٹ
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" dir="rtl" className="text-right block">نام</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="text-right"
                  dir="rtl"
                  placeholder="اپنا نام داخل کریں"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" dir="rtl" className="text-right block">ای میل</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-right"
                dir="rtl"
                placeholder="admin@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" dir="rtl" className="text-right block">پاس ورڈ</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-right pr-10"
                  dir="rtl"
                  placeholder="اپنا پاس ورڈ داخل کریں"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading}
              dir="rtl"
            >
              {loading ? 'براہ کرم انتظار کریں...' : (isLogin ? 'لاگ ان' : 'اکاؤنٹ بنائیں')}
            </Button>
          </form>

          {isLogin && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm" dir="rtl">
              <p className="text-blue-800 font-medium">ٹیسٹ اکاؤنٹس:</p>
              <p className="text-blue-700">منتظم: admin@gmail.com</p>
              <p className="text-blue-600 text-xs">پاس ورڈ: admin123</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
