import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { getCurrentUser, setCurrentUser as saveCurrentUser } from '@/lib/mockData';
import { API_URL, apiFetch } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  googleLoginUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Try backend session
    (async () => {
      try {
        const data = await apiFetch('/api/users/me', { method: 'GET' });
        setUser(data.user);
        saveCurrentUser(data.user);
      } catch {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setUser(data.user);
      saveCurrentUser(data.user);
    } catch {
      const mockUser = getCurrentUser();
      setUser(mockUser);
      saveCurrentUser(mockUser);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const data = await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      setUser(data.user);
      saveCurrentUser(data.user);
    } catch {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        bio: '',
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        followers: [],
        following: [],
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      saveCurrentUser(newUser);
    }
  };

  const logout = () => {
    setUser(null);
    saveCurrentUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      saveCurrentUser(updatedUser);
      // best-effort backend sync
      apiFetch('/api/users/me', { method: 'PUT', body: JSON.stringify({
        name: updatedUser.name,
        bio: updatedUser.bio,
        avatarUrl: updatedUser.profilePicture
      }) }).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, googleLoginUrl: `${API_URL}/api/auth/google` }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};