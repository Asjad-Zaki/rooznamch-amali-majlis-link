import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '@/components/Dashboard';
import { User } from '@/components/UserManagement';
import { Notification } from '@/components/NotificationPanel';
import { useAuth } from '@/integrations/supabase/auth'; // Import useAuth hook
import { supabase } from '@/integrations/supabase/client'; // Import supabase client

const Index = () => {
  const { session, loading, user: authUser } = useAuth(); // Get session and user from context
  const navigate = useNavigate();

  // State for user data from profiles table
  const [currentUserProfile, setCurrentUserProfile] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]); // All users from profiles table
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !session) {
      navigate('/login');
    }
  }, [session, loading, navigate]);

  // Fetch user profile and all users from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      if (authUser) {
        // Fetch current user's profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Handle error, maybe log out or show a message
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }
        setCurrentUserProfile(profileData as User);

        // Fetch all users (for admin view)
        const { data: allUsersData, error: allUsersError } = await supabase
          .from('profiles')
          .select('*');

        if (allUsersError) {
          console.error('Error fetching all users:', allUsersError);
        } else {
          setUsers(allUsersData as User[]);
        }
      }
    };

    if (!loading && session && authUser) {
      fetchUserData();
    }
  }, [session, loading, authUser, navigate]);

  // Determine user role and name based on fetched profile
  const userRole = currentUserProfile?.role || 'member';
  const userName = currentUserProfile?.name || authUser?.email || 'Guest';
  const userId = currentUserProfile?.id || authUser?.id || '';

  // View mode state (for admin to switch between admin/member view)
  const [viewMode, setViewMode] = useState<'admin' | 'member'>(userRole);

  useEffect(() => {
    if (currentUserProfile) {
      setViewMode(currentUserProfile.role); // Set initial view mode based on actual role
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

  // User management functions (will interact with Supabase in UserManagement component)
  const handleUpdateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers); // Update local state, actual Supabase updates will be in UserManagement
  };

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
      users={users}
      onUpdateUsers={handleUpdateUsers}
      notifications={notifications}
      onUpdateNotifications={setNotifications}
      viewMode={viewMode}
      actualRole={userRole}
    />
  );
};

export default Index;