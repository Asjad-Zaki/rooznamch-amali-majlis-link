import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm'; // Import the new RegisterForm
import { useAuth } from '@/integrations/supabase/auth';

const Login = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false); // State to toggle between login and register

  useEffect(() => {
    console.log('Login.tsx: Session state changed. Loading:', loading, 'Session:', session);
    if (!loading && session) {
      // If user is already logged in, redirect to dashboard
      console.log('Login.tsx: Session found, navigating to /');
      navigate('/');
    }
  }, [session, loading, navigate]);

  const handleLoginSuccess = (role: 'admin' | 'member', name: string, userId: string) => {
    console.log('Login successful (Login.tsx):', { role, name, userId });
    // The useEffect above will handle navigation to '/'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin shadow-2xl shadow-blue-500/25"></div>
          <div className="absolute inset-0 w-16 h-16 m-2 border-4 border-transparent border-b-green-500 border-l-cyan-500 rounded-full animate-spin animation-delay-150 shadow-2xl shadow-green-500/25"></div>
          <div className="absolute inset-0 w-12 h-12 m-4 border-4 border-transparent border-t-pink-500 border-r-yellow-500 rounded-full animate-spin animation-delay-300 shadow-2xl shadow-pink-500/25"></div>
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-white font-medium text-lg animate-pulse">
            لوڈ ہو رہا ہے...
          </div>
        </div>
      </div>
    );
  }

  return showRegister ? (
    <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
  ) : (
    <LoginForm onLogin={handleLoginSuccess} onSwitchToRegister={() => setShowRegister(true)} />
  );
};

export default Login;