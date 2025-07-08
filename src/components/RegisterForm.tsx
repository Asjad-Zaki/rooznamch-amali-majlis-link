import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('پاس ورڈ اور تصدیقی پاس ورڈ مماثل نہیں ہیں');
      toast({
        title: "رجسٹریشن ناکام",
        description: "پاس ورڈ اور تصدیقی پاس ورڈ مماثل نہیں ہیں",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے');
      toast({
        title: "رجسٹریشن ناکام",
        description: "پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            role: 'member', // Default role for self-registered users
            is_active: true, // Default to active
          },
        },
      });

      if (authError) {
        console.error('RegisterForm: Auth error:', authError.message);
        setError(authError.message);
        toast({
          title: "رجسٹریشن ناکام",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "رجسٹریشن کامیاب",
          description: "آپ کا اکاؤنٹ کامیابی سے بن گیا ہے۔ اب آپ لاگ ان کر سکتے ہیں۔",
        });
        onSwitchToLogin(); // Redirect to login page after successful registration
      } else {
        setError('رجسٹریشن میں خرابی ہوئی: کوئی صارف ڈیٹا نہیں ملا');
        toast({
          title: "رجسٹریشن ناکام",
          description: "رجسٹریشن میں خرابی ہوئی: کوئی صارف ڈیٹا نہیں ملا",
          variant: "destructive",
        });
      }

    } catch (err: any) {
      console.error('RegisterForm: Registration catch error:', err.message);
      setError('رجسٹریشن میں خرابی ہوئی: ' + err.message);
      toast({
        title: "رجسٹریشن میں خرابی",
        description: 'رجسٹریشن میں خرابی ہوئی',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-3 sm:p-4 lg:p-6 relative overflow-hidden">
      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/50 transition-all duration-1000 animate-card-entrance">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-lg blur-xl animate-glow-pulse"></div>
        
        <CardHeader className="text-center pb-4 sm:pb-6 relative z-10">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <img 
                src="/lovable-uploads/e1652408-702e-47c9-834c-bafadef748e9.png" 
                alt="Majlis e Dawatul Haq Logo" 
                className="h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 rounded-full relative z-10 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xl ring-2 ring-white/30"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>
          </div>
          
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-white mb-2 transform transition-all duration-700 animate-slide-down" dir="rtl">
            مجلس دعوۃ الحق
          </CardTitle>
          <p className="text-white/80 text-center text-xs sm:text-sm lg:text-base transform transition-all duration-700 animate-slide-down animation-delay-200" dir="rtl">
            نیا اکاؤنٹ رجسٹر کریں
          </p>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" dir="rtl" className="text-sm text-white/90 font-medium">
                نام
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                dir="rtl"
                placeholder="آپ کا نام داخل کریں"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-green-400/50 focus:ring-2 focus:ring-green-400/25 transition-all duration-300 hover:bg-white/15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" dir="rtl" className="text-sm text-white/90 font-medium">
                ای میل
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="rtl"
                placeholder="آپ کا ای میل داخل کریں"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-green-400/50 focus:ring-2 focus:ring-green-400/25 transition-all duration-300 hover:bg-white/15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" dir="rtl" className="text-sm text-white/90 font-medium">
                پاس ورڈ
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="rtl"
                placeholder="پاس ورڈ داخل کریں"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-green-400/50 focus:ring-2 focus:ring-green-400/25 transition-all duration-300 hover:bg-white/15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" dir="rtl" className="text-sm text-white/90 font-medium">
                پاس ورڈ کی تصدیق کریں
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                dir="rtl"
                placeholder="پاس ورڈ دوبارہ داخل کریں"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-green-400/50 focus:ring-2 focus:ring-green-400/25 transition-all duration-300 hover:bg-white/15"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 sm:py-3 text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading}
              dir="rtl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  رجسٹر ہو رہا ہے...
                </div>
              ) : (
                'رجسٹر کریں'
              )}
            </Button>
          </form>
          
          {error && (
            <Alert variant="destructive" className="mt-4 sm:mt-6 bg-red-500/10 border border-red-500/30 backdrop-blur-sm animate-shake">
              <AlertDescription dir="rtl" className="text-sm text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6 text-center text-white/80 text-sm" dir="rtl">
            پہلے سے ہی اکاؤنٹ ہے؟{' '}
            <Button variant="link" onClick={onSwitchToLogin} className="p-0 h-auto text-blue-300 hover:text-blue-200 underline">
              لاگ ان کریں
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;