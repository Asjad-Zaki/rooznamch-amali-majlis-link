import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '@/components/Dashboard';
import { User } from '@/components/UserManagement'; // Keep User type for current user profile
import { Notification } from '@/components/NotificationPanel';
import { useAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { session, loading, user: authUser } = useAuth();
  const navigate = useNavigate();

  const [currentUserProfile, setCurrentUserProfile] = useState<User | null>(null);
  // Removed users state as UserManagement will fetch its own
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login');
    }
  }, [session, loading, navigate]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authUser) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }
        setCurrentUserProfile(profileData as User);
      }
    };

    if (!loading && session && authUser) {
      fetchUserProfile();
    }
  }, [session, loading, authUser, navigate]);

  const userRole = currentUserProfile?.role || 'member';
  const userName = currentUserProfile?.name || authUser?.email || 'Guest';
  const userId = currentUserProfile?.id || authUser?.id || '';

  const [viewMode, setViewMode] = useState<'admin' | 'member'>(userRole);

  useEffect(() => {
    if (currentUserProfile) {
      setViewMode(currentUserProfile.role);
    }
  }, [currentUserProfile]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      navigate('/login');
    }
  };

  const handleRoleSwitch = () => {
    if (userRole === 'admin') {
      setViewMode(viewMode === 'admin' ? 'member' : 'admin');
    }
  };

  // Removed handleUpdateUsers as UserManagement handles its own data
  // const handleUpdateUsers = (updatedUsers: User[]) => {
  //   setUsers(updatedUsers);
  // };

  if (loading || !session || !currentUserProfile) {
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

  return (
    <Dashboard
      userRole={viewMode}
      userName={userName}
      userId={userId}
      onLogout={handleLogout}
      onRoleSwitch={userRole === 'admin' ? handleRoleSwitch : undefined}
      // Removed users and onUpdateUsers props
      notifications={notifications}
      onUpdateNotifications={setNotifications}
      viewMode={viewMode}
      actualRole={userRole}
    />
  );
};

export default Index;