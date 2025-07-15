
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { DatabaseService } from '@/services/DatabaseService';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [memberSecretNumber, setMemberSecretNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('member');
  const [profiles, setProfiles] = useState<any[]>([]);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
      loadProfiles();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const loadProfiles = async () => {
    try {
      const profilesData = await DatabaseService.getProfiles();
      setProfiles(profilesData);
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Try to sign in with email and password
      const { error: signInError } = await signIn(adminEmail, adminPassword);
      
      if (signInError) {
        // If login fails, try to sign up the admin user
        if (signInError.message?.includes('Invalid login credentials')) {
          const { error: signUpError } = await signUp(adminEmail, adminPassword, 'Admin User');
          
          if (signUpError) {
            setError('لاگ ان یا سائن اپ میں خرابی ہوئی');
            setIsLoading(false);
            return;
          }

          toast({
            title: "اکاؤنٹ بن گیا",
            description: "آپ کا اکاؤنٹ کامیابی سے بن گیا اور لاگ ان ہو گئے",
          });
        } else {
          setError('غلط ای میل یا پاس ورڈ');
          setIsLoading(false);
          return;
        }
      } else {
        toast({
          title: "لاگ ان کامیاب",
          description: "آپ کامیابی سے لاگ ان ہو گئے ہیں",
        });
      }
    } catch (err) {
      setError('لاگ ان میں خرابی ہوئی');
      setIsLoading(false);
    }
  };

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Find member by secret number
      const member = profiles.find(p => 
        p.secret_number === memberSecretNumber &&
        p.role === 'member' &&
        p.is_active
      );

      if (!member) {
        setError('غلط خفیہ نمبر یا آپ کا اکاؤنٹ غیر فعال ہے');
        setIsLoading(false);
        return;
      }

      // Sign in with member's email and a default password
      const { error: signInError } = await signIn(member.email, 'member123');
      
      if (signInError) {
        setError('لاگ ان میں خرابی ہوئی');
        setIsLoading(false);
        return;
      }

      toast({
        title: "لاگ ان کامیاب",
        description: `خوش آمدید ${member.name}`,
      });
    } catch (err) {
      setError('لاگ ان میں خرابی ہوئی');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-3 sm:p-4 lg:p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-40 sm:h-40 lg:w-64 lg:h-64 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-28 h-28 sm:w-36 sm:h-36 lg:w-56 lg:h-56 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>

      {/* Main Login Card */}
      <Card className={`w-full max-w-sm sm:max-w-md lg:max-w-lg relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/50 transition-all duration-1000 ${isPageLoaded ? 'animate-card-entrance' : 'opacity-0 scale-90'}`}>
        {/* Card glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-lg blur-xl animate-glow-pulse"></div>
        
        <CardHeader className="text-center pb-4 sm:pb-6 relative z-10">
          {/* Logo with 3D effect */}
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
            ٹاسک  مینجمنٹ سسٹم میں لاگ ان کریں
          </p>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Enhanced TabsList with 3D effects */}
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg p-1 transform transition-all duration-500 animate-slide-up">
              <TabsTrigger 
                value="member" 
                dir="rtl" 
                className="text-xs sm:text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50 data-[state=active]:transform data-[state=active]:scale-105 text-white/70 hover:text-white rounded-md"
              >
                رکن لاگ ان
              </TabsTrigger>
              <TabsTrigger 
                value="admin" 
                dir="rtl" 
                className="text-xs sm:text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/50 data-[state=active]:transform data-[state=active]:scale-105 text-white/70 hover:text-white rounded-md"
              >
                منتظم لاگ ان
              </TabsTrigger>
            </TabsList>
            
            {/* Member Login Tab */}
            <TabsContent value="member" className="transform transition-all duration-500 animate-fade-in-up">
              <div className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="secretNumber" dir="rtl" className="text-sm text-white/90 font-medium">
                    خفیہ نمبر
                  </Label>
                  <div className="relative group">
                    <Input
                      id="secretNumber"
                      type="text"
                      value={memberSecretNumber}
                      onChange={(e) => setMemberSecretNumber(e.target.value)}
                      required
                      dir="rtl"
                      placeholder="آپ کا خفیہ نمبر داخل کریں"
                      className="text-center font-mono text-base sm:text-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/25 transition-all duration-300 hover:bg-white/15 group-hover:shadow-lg group-hover:shadow-blue-500/20"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleMemberLogin(e as any);
                        }
                      }}
                    />
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleMemberLogin}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 sm:py-3 text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading}
                  dir="rtl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      لاگ ان ہو رہا ہے...
                    </div>
                  ) : (
                    'لاگ ان'
                  )}
                </Button>
              </div>
            </TabsContent>
            
            {/* Admin Login Tab */}
            <TabsContent value="admin" className="transform transition-all duration-500 animate-fade-in-up">
              <form onSubmit={handleAdminLogin} className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail" dir="rtl" className="text-sm text-white/90 font-medium">
                    ای میل
                  </Label>
                  <div className="relative group">
                    <Input
                      id="adminEmail"
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                      dir="rtl"
                      placeholder="آپ کا ای میل داخل کریں"
                      className="bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-green-400/50 focus:ring-2 focus:ring-green-400/25 transition-all duration-300 hover:bg-white/15 group-hover:shadow-lg group-hover:shadow-green-500/20"
                    />
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-green-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminPassword" dir="rtl" className="text-sm text-white/90 font-medium">
                    پاس ورڈ
                  </Label>
                  <div className="relative group">
                    <Input
                      id="adminPassword"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      dir="rtl"
                      placeholder="آپ کا پاس ورڈ داخل کریں"
                      className="bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-green-400/50 focus:ring-2 focus:ring-green-400/25 transition-all duration-300 hover:bg-white/15 group-hover:shadow-lg group-hover:shadow-green-500/20"
                    />
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-green-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white font-medium py-2.5 sm:py-3 text-sm sm:text-base shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40 transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading}
                  dir="rtl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      لاگ ان ہو رہا ہے...
                    </div>
                  ) : (
                    'لاگ ان'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          {/* Enhanced Error Alert */}
          {error && (
            <Alert variant="destructive" className="mt-4 sm:mt-6 bg-red-500/10 border border-red-500/30 backdrop-blur-sm animate-shake">
              <AlertDescription dir="rtl" className="text-sm text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Quick login info */}
          <div className="mt-4 text-center text-white/60 text-xs" dir="rtl">
            <p>ٹیسٹ لاگ ان:</p>
            <p>منتظم: asjadzaki2021@gmail.com / admin123</p>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Custom Styles */}
      <style>{`
        @keyframes card-entrance {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9) rotateX(10deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
          }
        }
        
        @keyframes slide-down {
          0% {
            opacity: 0;
            transform:translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
          }
          25% { 
            transform: translateY(-20px) translateX(10px) rotate(1deg); 
          }
          50% { 
            transform: translateY(-10px) translateX(-5px) rotate(-0.5deg); 
          }
          75% { 
            transform: translateY(-15px) translateX(5px) rotate(0.5deg); 
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% { 
            opacity: 0.5;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }

        .animate-card-entrance {
          animation: card-entrance 1s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slide-down 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
