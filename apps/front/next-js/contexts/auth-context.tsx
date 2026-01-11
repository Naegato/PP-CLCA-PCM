'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { getApi } from '@/lib/api';

export type UserRole = 'client' | 'advisor' | 'director';

export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function setCookie(name: string, value: string, maxAge: number = COOKIE_MAX_AGE) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try cookie first, then localStorage for backwards compatibility
    const cookieToken = getCookie(TOKEN_KEY);
    const storedToken = cookieToken || localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Ensure cookie is set if we found token in localStorage
        if (!cookieToken && storedToken) {
          setCookie(TOKEN_KEY, storedToken);
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        deleteCookie(TOKEN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const setAuth = useCallback((newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setCookie(TOKEN_KEY, newToken);
  }, []);

  const login = useCallback(async (email: string, password: string, role: UserRole = 'client') => {
    const endpoints: Record<UserRole, string> = {
      client: '/client/auth/login',
      advisor: '/advisor/auth/login',
      director: '/director/auth/login',
    };

    const response = await getApi().fetch(endpoints[role], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data?.error) {
      throw new Error(data.error);
    }

    const newUser: User = {
      id: data.user?.id || data.id,
      email: data.user?.email || email,
      firstname: data.user?.firstname || '',
      lastname: data.user?.lastname || '',
      role,
    };

    setAuth(newUser, data.token);
  }, [setAuth]);

  const logout = useCallback(async () => {
    if (token && user) {
      const endpoints: Record<UserRole, string> = {
        client: '/client/auth/logout',
        advisor: '/advisor/auth/logout',
        director: '/director/auth/logout',
      };

      try {
        await getApi().fetch(endpoints[user.role], {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch {
        // Ignore logout errors
      }
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    deleteCookie(TOKEN_KEY);
  }, [token, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        role: user?.role || null,
        login,
        logout,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
