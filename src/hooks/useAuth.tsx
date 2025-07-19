
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Use React Query for profile data with real-time updates
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as 'admin' | 'member',
        secret_number: data.secret_number,
        is_active: data.is_active,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: false, // Don't retry on error to prevent infinite loading
  });

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (event === 'SIGNED_OUT') {
            // Clear all React Query cache on logout
            queryClient.clear();
          } else if (event === 'SIGNED_IN' && session?.user) {
            // Invalidate profile cache when user signs in
            queryClient.invalidateQueries({ queryKey: ['profile'] });
          }
          
          setLoading(false);
        }
      }
    );

    // Set up real-time subscription for profiles
    const profilesChannel = supabase
      .channel('profiles-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Profile change:', payload);
          queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      supabase.removeChannel(profilesChannel);
    };
  }, [queryClient]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name,
            role: 'member'
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        return { error, data: null };
      }

      return { error: null, data };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error, data: null };
    }
  };

  const memberLogin = async (secretNumber: string) => {
    try {
      // Find member by secret number
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('secret_number', secretNumber)
        .eq('role', 'member')
        .eq('is_active', true)
        .single();

      if (profileError || !profile) {
        return { error: new Error('Invalid secret number or inactive account'), data: null };
      }

      // Create a temporary session for members (since they don't have email/password)
      return { error: null, data: profile };
    } catch (error) {
      console.error('Member login error:', error);
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear React Query cache first
      queryClient.clear();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        setLoading(false);
        return { error };
      }

      // Clear local state
      setUser(null);
      setSession(null);
      setLoading(false);
      
      return { error: null };
    } catch (error) {
      console.error('Logout error:', error);
      setLoading(false);
      return { error };
    }
  };

  return {
    user,
    session,
    profile,
    loading: loading || profileLoading,
    signIn,
    signUp,
    signOut,
    memberLogin,
  };
};
