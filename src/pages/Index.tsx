
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AuthPage from '@/components/AuthPage';
import Dashboard from '@/components/Dashboard';
import { DatabaseRealtimeProvider } from '@/components/DatabaseRealtimeProvider';
import { useAuth } from '@/hooks/useAuth';
import { DatabaseService } from '@/services/DatabaseService';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  password: string;
  secretNumber: string;
  createdAt: string;
  isActive: boolean;
}

const Index = () => {
  const { session, loading, user: authUser, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'admin' | 'member'>('member');

  // Fetch notifications using React Query
  const { data: notifications = [], refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: DatabaseService.getNotifications,
    enabled: !!session,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Set up real-time subscriptions for notifications
  useEffect(() => {
    if (!session) return;

    const notificationsChannel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          console.log('Notification change:', payload);
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    const tasksChannel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          console.log('Task change:', payload);
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, [session, queryClient]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !session) {
      navigate('/login', { replace: true });
    }
  }, [session, loading, navigate]);

  // Set initial view mode based on user role
  useEffect(() => {
    if (profile?.role) {
      setViewMode(profile.role);
    }
  }, [profile?.role]);

  const handleLogout = useCallback(async () => {
    try {
      console.log('Starting logout process...');
      
      // Clear all queries immediately for faster response
      queryClient.clear();
      
      // Sign out
      const { error } = await signOut();
      
      if (error) {
        console.error('Logout error:', error);
      } else {
        console.log('Logout successful, redirecting...');
        // Force navigation to login
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if there's an error
      navigate('/login', { replace: true });
    }
  }, [signOut, navigate, queryClient]);

  const handleRoleSwitch = useCallback(() => {
    if (profile?.role === 'admin') {
      setViewMode(prevMode => (prevMode === 'admin' ? 'member' : 'admin'));
    }
  }, [profile?.role]);

  const handleUpdateNotifications = useCallback(() => {
    refetchNotifications();
  }, [refetchNotifications]);

  // Show loading spinner
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

  // Show login page if no session or profile
  if (!session || !profile) {
    return <AuthPage />;
  }

  const actualUserRole = profile.role;
  const userName = profile.name || authUser?.email || 'Guest';
  const userId = profile.id || authUser?.id || '';

  return (
    <DatabaseRealtimeProvider>
      <Dashboard
        userRole={viewMode}
        userName={userName}
        userId={userId}
        onLogout={handleLogout}
        onRoleSwitch={actualUserRole === 'admin' ? handleRoleSwitch : undefined}
        notifications={notifications}
        onUpdateNotifications={handleUpdateNotifications}
        viewMode={viewMode}
        actualRole={actualUserRole}
      />
    </DatabaseRealtimeProvider>
  );
};

export default Index;
