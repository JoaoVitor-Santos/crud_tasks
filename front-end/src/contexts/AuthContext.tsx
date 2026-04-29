import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../services/api';
import { User, LoginRequest } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        setUser({ id: 1, email: 'user@example.com' });
      }
    };
    checkToken();
  }, []);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.login(data);
      await AsyncStorage.setItem('access_token', response.access_token);
      const payload = JSON.parse(atob(response.access_token.split('.')[1]));
      setUser({
        id: parseInt(payload.sub),
        email: data.email,
        name: data.email.split('@')[0],
      });
    } catch (err: any) {
      const apiDetail = err.response?.data?.detail;
      let message = 'Erro ao fazer login';

      if (typeof apiDetail === 'string') {
        message = apiDetail;
      } else if (Array.isArray(apiDetail)) {
        message = apiDetail
          .map((item) => {
            if (typeof item === 'string') return item;
            if (typeof item === 'object' && item !== null) {
              return item.msg || item.message || JSON.stringify(item);
            }
            return String(item);
          })
          .join('\n');
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.warn('Erro ao fazer logout no servidor:', error);
    }
    await AsyncStorage.removeItem('access_token');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};