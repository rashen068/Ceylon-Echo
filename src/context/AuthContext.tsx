import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

import { auth, isFirebaseConfigured } from '@/lib/firebase';
import {
  getAuthErrorMessage,
  loginUser,
  logoutUser,
  registerUser,
} from '@/services/authService';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      return;
    }

    return onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setAuthError(null);
        setIsLoading(false);
      },
      (error) => {
        setUser(null);
        setAuthError(getAuthErrorMessage(error));
        setIsLoading(false);
      },
    );
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await loginUser(email, password);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await registerUser(name, email, password);
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, isFirebaseConfigured, authError, login, register, logout }),
    [user, isLoading, authError, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
