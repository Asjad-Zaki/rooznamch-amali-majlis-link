
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-40 sm:h-40 lg:w-64 lg:h-64 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-28 h-28 sm:w-36 sm:h-36 lg:w-56 lg:h-56 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        
        {/* Secondary accent orbs */}
        <div className="absolute top-1/2 right-1/3 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-yellow-500/15 to-orange-500/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-500/15 to-violet-500/15 rounded-full blur-2xl animate-pulse animation-delay-1500"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/6 left-2/3 w-3 h-3 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/6 left-1/6 w-2 h-2 bg-blue-400/40 rounded-full animate-ping animation-delay-500"></div>
        <div className="absolute top-2/3 right-1/6 w-4 h-4 bg-purple-400/30 rounded-full animate-ping animation-delay-1000"></div>
      </div>

      {/* Main Login Card */}
      <Card className="w-full max-w-md shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 relative z-10 animate-card-entrance">
        {/* Card glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-lg blur-xl animate-glow-pulse"></div>
        
        <CardHeader className="text-center pb-2 relative z-10">
          {/* Logo with 3D effect */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <img 
                src="/lovable-uploads/e1652408-702e-47c9-834c-bafadef748e9.png" 
                alt="Majlis e Dawatul Haq Logo" 
                className="h-16 w-16 rounded-full relative z-10 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xl ring-2 ring-white/30"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>
          </div>
          
          <CardTitle className="text-xl font-bold text-center text-white mb-2 animate-slide-down" dir="rtl">
            مجلس دعوۃ الحق
          </CardTitle>
          <p className="text-white/80 text-center text-sm animate-slide-down animation-delay-200" dir="rtl">
            ٹاسک مینجمنٹ سسٹم
          </p>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="flex mb-6 bg-white/5 rounded-lg p-1 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white'
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
                  ? 'bg-gradient-to-r from-green-500 to-cyan-600 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white'
              }`}
              dir="rtl"
            >
              نیا اکاؤنٹ
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" dir="rtl" className="text-right block text-white/90">نام</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="text-right bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-blue-400/50"
                  dir="rtl"
                  placeholder="اپنا نام داخل کریں"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" dir="rtl" className="text-right block text-white/90">ای میل</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-right bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-blue-400/50"
                dir="rtl"
                placeholder="admin@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" dir="rtl" className="text-right block text-white/90">پاس ورڈ</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-right pr-10 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-blue-400/50"
                  dir="rtl"
                  placeholder="اپنا پاس ورڈ داخل کریں"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
              disabled={loading}
              dir="rtl"
            >
              {loading ? 'براہ کرم انتظار کریں...' : (isLogin ? 'لاگ ان' : 'اکاؤنٹ بنائیں')}
            </Button>
          </form>

          {isLogin && (
            <div className="mt-4 p-3 bg-blue-500/10 backdrop-blur-sm rounded-lg text-sm border border-blue-500/20" dir="rtl">
              <p className="text-blue-200 font-medium">ٹیسٹ اکاؤنٹس:</p>
              <p className="text-blue-300">منتظم: admin@gmail.com</p>
              <p className="text-blue-400 text-xs">پاس ورڈ: admin123</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Custom Styles */}
      <style>{`
        @keyframes card-entrance {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slide-down {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
          }
          25% { 
            transform: translateY(-20px) translateX(10px); 
          }
          50% { 
            transform: translateY(-10px) translateX(-5px); 
          }
          75% { 
            transform: translateY(-15px) translateX(5px); 
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% { 
            opacity: 0.5;
          }
          50% { 
            opacity: 0.8;
          }
        }

        .animate-card-entrance {
          animation: card-entrance 1s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slide-down 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
