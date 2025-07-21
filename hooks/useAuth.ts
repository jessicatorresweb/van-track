import { useState, useEffect, createContext, useContext } from 'react';
import { User, AuthState, LoginCredentials, SignupCredentials } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Convert Supabase user to our User type
const convertSupabaseUser = (supabaseUser: SupabaseUser, profile?: any): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profile?.name || supabaseUser.user_metadata?.name || '',
    company: profile?.company || supabaseUser.user_metadata?.company || '',
    phone: profile?.phone || supabaseUser.user_metadata?.phone || '',
    createdAt: supabaseUser.created_at || new Date().toISOString(),
  };
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Try to get user profile from database
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      const user = convertSupabaseUser(supabaseUser, profile);
      
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Still set user even if profile fetch fails
      const user = convertSupabaseUser(supabaseUser);
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      // User state will be updated via the auth state change listener
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            company: credentials.company,
            phone: credentials.phone,
          }
        }
      });

      if (error) {
        throw error;
      }

      // User state will be updated via the auth state change listener
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Signup failed',
      }));
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      // Auth state will be updated via the auth state change listener
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, still clear the local state
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    login,
    signup,
    logout,
    clearError,
  };
}