import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext';
import ApiService from '../services/api';
import { AuthRequest } from '../types/auth';
import { Alert } from 'react-native';

interface AuthActionsContextType {
  // Login states
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginPassword: string;
  setLoginPassword: (password: string) => void;

  // Register states
  registerEmail: string;
  setRegisterEmail: (email: string) => void;
  registerPassword: string;
  setRegisterPassword: (password: string) => void;
  registerConfirmPassword: string;
  setRegisterConfirmPassword: (password: string) => void;
  registerErrorMessage: string | null;

  // Actions
  handleLogin: () => Promise<void>;
  handleRegister: () => Promise<void>;
  navigateToRegister: () => void;
  navigateToLogin: () => void;
}

const AuthActionsContext = createContext<AuthActionsContextType | undefined>(undefined);

export const useAuthActions = (): AuthActionsContextType => {
  const context = useContext(AuthActionsContext);
  if (!context) {
    throw new Error('useAuthActions must be used within an AuthActionsProvider');
  }
  return context;
};

interface AuthActionsProviderProps {
  children: ReactNode;
}

export const AuthActionsProvider: React.FC<AuthActionsProviderProps> = ({ children }) => {
  const navigation = useNavigation<any>();
  const { login, isLoading: authLoading } = useAuth();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerErrorMessage, setRegisterErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert('Erro', 'Por favor, preencha email e senha.');
      return;
    }
    await login({ email: loginEmail, password: loginPassword });
  };

  const handleRegister = async () => {
    setRegisterErrorMessage(null);

    if (!registerEmail || !registerPassword || !registerConfirmPassword) {
      const message = 'Por favor, preencha todos os campos.';
      setRegisterErrorMessage(message);
      Alert.alert('Erro', message);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail)) {
      const message = 'Por favor, insira um email válido.';
      console.log('Email inválido:', registerEmail);
      setRegisterErrorMessage(message);
      Alert.alert('Erro', message);
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      const message = 'As senhas não coincidem.';
      console.log('Senhas não coincidem:', registerPassword, registerConfirmPassword);
      setRegisterErrorMessage(message);
      Alert.alert('Erro', message);
      return;
    }

    if (registerPassword.length < 6) {
      const message = 'A senha deve ter pelo menos 6 caracteres.';
      console.log('Senha muito curta:', registerPassword);
      setRegisterErrorMessage(message);
      Alert.alert('Erro', message);
      return;
    }

    try {
      const payload: AuthRequest = { email: registerEmail, password: registerPassword };
      const response = await ApiService.register(payload);
      Alert.alert('Sucesso', response.message, [
        {
          text: 'OK',
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] }),
        },
      ]);
      navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] });
    } catch (err: any) {
      const responseData = err?.response?.data;
      let errorMessage = 'Falha ao registrar.';

      if (responseData) {
        if (typeof responseData.message === 'string') {
          errorMessage = responseData.message;
        } else if (typeof responseData.detail === 'string') {
          errorMessage = responseData.detail;
        } else if (Array.isArray(responseData.detail)) {
          errorMessage = responseData.detail
            .map((item: any) => item.msg || item.message || JSON.stringify(item))
            .join('\n');
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }

      Alert.alert('Erro', errorMessage);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register' as never);
  };

  const navigateToLogin = () => {
    navigation.navigate('Login' as never);
  };

  const value: AuthActionsContextType = {
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,

    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    registerConfirmPassword,
    setRegisterConfirmPassword,
    registerErrorMessage,

    handleLogin,
    handleRegister,
    navigateToRegister,
    navigateToLogin,
  };

  return <AuthActionsContext.Provider value={value}>{children}</AuthActionsContext.Provider>;
};