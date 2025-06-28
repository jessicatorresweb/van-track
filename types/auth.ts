export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
  phone?: string;
}