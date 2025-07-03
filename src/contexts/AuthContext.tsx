'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { UsuarioI } from '@/utils/types/usuarios';

interface AuthContextType {
  user: UsuarioI | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UsuarioI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userName = Cookies.get('usuario_logado_nome');
    const userId = Cookies.get('usuario_logado_id');
    const userEmail = Cookies.get('usuario_logado_email');

    if (userName && userId && userEmail) {
      setUser({ id: Number(userId), nome: userName, email: userEmail, tipo: 'ALUNO' });
    }
    setIsLoading(false);
  }, []);

  const login = async (data: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        Cookies.set('usuario_logado_id', responseData.id, { expires: 1 });
        Cookies.set('usuario_logado_nome', responseData.nome, { expires: 1 });
        Cookies.set('usuario_logado_email', responseData.email, { expires: 1 });
        
        setUser(responseData);
        
        toast.success(`Bem-vindo de volta, ${responseData.nome}!`);
        router.push('/'); 
      } else {
        toast.error(responseData.erro || 'Email ou senha incorretos.');
      }
    } catch (error) {
      toast.error('Não foi possível conectar ao servidor.');
    }
  };

  const logout = () => {
    // Remove os cookies
    Cookies.remove('usuario_logado_id');
    Cookies.remove('usuario_logado_nome');
    Cookies.remove('usuario_logado_email');

    setUser(null);
    toast.info('Você saiu do sistema.');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}