import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { API_URL, apiFetch } from '@/lib/api';
import { normalizeUser } from '@/lib/mapper';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  googleLoginUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch('/api/users/me', { method: 'GET' });
        if (data?.user) {
          setUser(normalizeUser(data.user));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.warn('[Auth] Session fetch failed', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(normalizeUser(data.user));
  };

  const signup = async (name: string, email: string, password: string) => {
    const data = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setUser(normalizeUser(data.user));
  };

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('[Auth] logout failed', error);
    } finally {
      setUser(null);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // best-effort backend sync
      apiFetch('/api/users/me', { method: 'PUT', body: JSON.stringify({
        name: updatedUser.name,
        bio: updatedUser.bio,
        avatarUrl: updatedUser.profilePicture
      }) }).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser, googleLoginUrl: `${API_URL}/api/auth/google` }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};