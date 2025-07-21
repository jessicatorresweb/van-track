import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState, LoginCredentials, SignupCredentials } from '@/types/auth';

const AUTH_STORAGE_KEY = '@van_inventory_auth';
const USER_STORAGE_KEY = '@van_inventory_user';
const INVENTORY_STORAGE_KEY = '@van_inventory';
const ALERTS_STORAGE_KEY = '@van_alerts';

// Mock authentication - replace with real API calls
const mockLogin = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock validation
  if (credentials.email.toLowerCase() === 'demo@example.com' && credentials.password === 'password') {
    return {
      id: '1',
      email: credentials.email,
      name: 'John Smith',
      company: 'Smith Plumbing',
      phone: '+1 (555) 123-4567',
      createdAt: new Date().toISOString(),
    };
  }
  
  throw new Error('Invalid email or password');
};

const mockSignup = async (credentials: SignupCredentials): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock validation
  if (credentials.email.toLowerCase() === 'existing@example.com') {
    throw new Error('An account with this email already exists');
  }
  
  return {
    id: Date.now().toString(),
    email: credentials.email,
    name: credentials.name,
    company: credentials.company,
    phone: credentials.phone,
    createdAt: new Date().toISOString(),
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
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedAuth, storedUser] = await Promise.all([
        AsyncStorage.getItem(AUTH_STORAGE_KEY),
        AsyncStorage.getItem(USER_STORAGE_KEY),
      ]);

      if (storedAuth === 'true' && storedUser) {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: 'Failed to load authentication' }));
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const user = await mockLogin(credentials);
      
      await Promise.all([
        AsyncStorage.setItem(AUTH_STORAGE_KEY, 'true'),
        AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)),
      ]);

      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
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
      const user = await mockSignup(credentials);
      
      await Promise.all([
        AsyncStorage.setItem(AUTH_STORAGE_KEY, 'true'),
        AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)),
      ]);

      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Signup failed',
      }));
    }
  };

  const logout = async () => {
    try {
      // Set loading state for logout process
      setAuthState(prev => ({ ...prev, loading: true }));

      // Clear all stored data including inventory and alerts
      await Promise.all([
        AsyncStorage.removeItem(AUTH_STORAGE_KEY),
        AsyncStorage.removeItem(USER_STORAGE_KEY),
        AsyncStorage.removeItem(INVENTORY_STORAGE_KEY),
        AsyncStorage.removeItem(ALERTS_STORAGE_KEY),
      ]);

      // Reset auth state
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });

      // Optional: Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error clearing storage, still log out the user
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