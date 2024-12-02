import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface AuthContextProps {
  user: User | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Recupera a sessão ao carregar o app
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('@authToken');
      if (token) {
        try {
          // Faz uma chamada para obter os dados do usuário
          const response = await axios.get<User>('http://localhost:5271/api/user/details', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Erro ao buscar usuário:', error);
          await AsyncStorage.removeItem('@authToken');
        }
      }
      setIsLoading(false);
    })();
  }, []);

  // Função para login
  const login = async (email: string, senha: string) => {
    try {
      const response = await axios.post<{ token: string }>('http://localhost:5271/api/credentials/login', {
        email,
        senha,
      });
      const { token } = response.data;

      // Armazena o token no AsyncStorage
      await AsyncStorage.setItem('@authToken', token);

      // Busca os dados do usuário
      const userResponse = await axios.get<User>('http://localhost:5271/api/user/details', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userResponse.data);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  // Função para logout
  const logout = async () => {
    await AsyncStorage.removeItem('@authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
