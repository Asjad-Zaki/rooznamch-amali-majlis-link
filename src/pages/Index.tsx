<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '@/components/Dashboard';
import { User } from '@/components/UserManagement';
import { Notification } from '@/components/NotificationPanel';
import { useAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { session, loading, user: authUser } = useAuth();
  const navigate = useNavigate();

  const [currentUserProfile, setCurrentUserProfile] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // State to control the current view mode (admin can switch to member view)
  const [viewMode, setViewMode] = useState<'admin' | 'member'>('member'); // Default to 'member'

  useEffect(() => {
    console.log('Index.tsx (useEffect 1): Session, Loading, AuthUser:', { session, loading, authUser });
    if (!loading && !session) {
      console.log('Index.tsx (useEffect 1): No session found, navigating to /login');
      navigate('/login');
    }
  }, [session, loading, navigate, authUser]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authUser) {
        console.log('Index.tsx (useEffect 2): Fetching user profile for authUser ID:', authUser.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          console.error('Index.tsx (useEffect 2): Error fetching user profile:', profileError);
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }
        console.log('Index.tsx (useEffect 2): Fetched user profile:', profileData);
        setCurrentUserProfile(profileData as User);
        // Set the initial view mode based on the fetched user's actual role
        setViewMode((profileData as User).role);
        console.log('Index.tsx (useEffect 2): Initial viewMode set to:', (profileData as User).role);
      }
    };

    if (!loading && session && authUser) {
      fetchUserProfile();
    }
  }, [session, loading, authUser, navigate]);

  // Derive userRole and userName from currentUserProfile
  const actualUserRole = currentUserProfile?.role || 'member';
  const userName = currentUserProfile?.name || authUser?.email || 'Guest';
  const userId = currentUserProfile?.id || authUser?.id || '';

  const handleLogout = async () => {
    if (session) { // Only attempt to sign out if a session exists
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
      } else {
        navigate('/login');
      }
    } else {
      // If no session, just navigate to login
      navigate('/login');
    }
  };

  const handleRoleSwitch = () => {
    // Only allow role switch if the actual user is an admin
    if (actualUserRole === 'admin') {
      setViewMode(prevMode => (prevMode === 'admin' ? 'member' : 'admin'));
      console.log('Index.tsx: Role switched to:', viewMode === 'admin' ? 'member' : 'admin');
    }
  };

  // Log for debugging before rendering Dashboard
  useEffect(() => {
    console.log('Index.tsx: Rendering Dashboard with:', {
      viewMode: viewMode,
      actualRole: actualUserRole,
      userName: userName,
      userId: userId,
      currentUserProfile: currentUserProfile
    });
  }, [viewMode, actualUserRole, userName, userId, currentUserProfile]);


  if (loading || !session || !currentUserProfile) {
=======

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/components/AuthPage';
import Dashboard from '@/components/Dashboard';
import { DatabaseRealtimeProvider } from '@/contexts/DatabaseRealtimeContext';

const Index = () => {
  const { user, profile, loading } = useAuth();

  console.log('Index - Loading:', loading, 'User:', user, 'Profile:', profile);

  if (loading) {
>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3
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

  // Show login page if no user or profile
  if (!user || !profile) {
    console.log('Showing AuthPage - No user or profile');
    return <AuthPage />;
  }

  console.log('Showing Dashboard - User authenticated with profile:', profile.role);

  return (
<<<<<<< HEAD
    <Dashboard
      userRole={viewMode} // This is the current view mode (can be switched by admin)
      userName={userName}
      userId={userId}
      onLogout={handleLogout}
      onRoleSwitch={actualUserRole === 'admin' ? handleRoleSwitch : undefined} // Only show switch if actual user is admin
      notifications={notifications}
      onUpdateNotifications={setNotifications}
      viewMode={viewMode} // Pass viewMode explicitly
      actualRole={actualUserRole} // Pass actual role explicitly
    />
=======
    <DatabaseRealtimeProvider>
      <Dashboard 
        userRole={profile.role}
        userName={profile.name}
        userId={profile.id}
        actualRole={profile.role}
        viewMode={profile.role}
      />
    </DatabaseRealtimeProvider>
>>>>>>> 8d2399815ffd473f0360df2516ab0f7fc292f5d3
  );
};

export default Index;