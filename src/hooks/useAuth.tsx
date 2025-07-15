
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  secret_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, userEmail?: string) => {
    console.log('Fetching profile for user:', userId, userEmail);
    try {
      // Use direct table query with type assertion
      const { data, error } = await (supabase as any).from('profiles').select('*').eq('id', userId);

      console.log('Profile fetch result:', { data, error });

      if (error) {
        console.error('Error fetching profile:', error);
        // Create default admin profile for admin@gmail.com
        if (userEmail === 'admin@gmail.com') {
          console.log('Creating default admin profile');
          setProfile({
            id: userId,
            name: 'Admin User',
            email: 'admin@gmail.com',
            role: 'admin',
            secret_number: 'ADMIN123',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        } else {
          console.log('No profile found and not admin, setting loading to false');
          setProfile(null);
        }
      } else if (data && data.length > 0) {
        console.log('Profile found, setting profile data');
        const profileData = data[0];
        setProfile({
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          role: profileData.role as 'admin' | 'member',
          secret_number: profileData.secret_number,
          is_active: profileData.is_active,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at
        });
      } else {
        console.log('No profile data found');
        // Create default admin profile for admin email
        if (userEmail === 'admin@gmail.com') {
          console.log('Creating default admin profile (no data case)');
          setProfile({
            id: userId,
            name: 'Admin User',
            email: 'admin@gmail.com',
            role: 'admin',
            secret_number: 'ADMIN123',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        } else {
          setProfile(null);
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      // Fallback for admin
      if (userEmail === 'admin@gmail.com') {
        console.log('Exception caught, creating admin profile');
        setProfile({
          id: userId,
          name: 'Admin User',
          email: 'admin@gmail.com',
          role: 'admin',
          secret_number: 'ADMIN123',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } else {
        setProfile(null);
      }
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };
};
