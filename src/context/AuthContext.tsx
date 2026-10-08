import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { getUserRole } from '@/services/userService';
import {
  getAuthErrorMessage,
  loginUser,
  logoutUser,
  registerUser,
} from '@/services/authService';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  role: 'admin' | 'user' | null;
  isRoleLoading: boolean;
  roleError: string | null;
  isFirebaseConfigured: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserRole: () => Promise<'admin' | 'user' | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured);
  const [authError, setAuthError] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(isFirebaseConfigured);
  const [roleError, setRoleError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      return;
    }

    let active = true;
    let authEventId = 0;
    const unsubscribe = onAuthStateChanged(
      auth,
      (nextUser) => {
        const eventId = ++authEventId;
        setUser(nextUser);
        setRole(null);
        setRoleError(null);
        setIsRoleLoading(Boolean(nextUser));
        setAuthError(null);
        setIsLoading(false);
        if (nextUser) {
          void getUserRole(nextUser.uid)
            .then((nextRole) => {
              if (active && eventId === authEventId) {
                setRole(nextRole);
              }
            })
            .catch((error: unknown) => {
              if (active && eventId === authEventId) {
                setRoleError(getAuthErrorMessage(error));
              }
            })
            .finally(() => {
              if (active && eventId === authEventId) {
                setIsRoleLoading(false);
              }
            });
        }
      },
      (error) => {
        authEventId += 1;
        setUser(null);
        setRole(null);
        setIsRoleLoading(false);
        setRoleError(null);
        setAuthError(getAuthErrorMessage(error));
        setIsLoading(false);
      },
    );
    return () => {
      active = false;
      authEventId += 1;
      unsubscribe();
    };
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

  const refreshUserRole = useCallback(async () => {
    const currentUser = auth?.currentUser;
    if (!currentUser) {
      setRole(null);
      setRoleError(null);
      setIsRoleLoading(false);
      return null;
    }

    setIsRoleLoading(true);
    setRoleError(null);
    try {
      const nextRole = await getUserRole(currentUser.uid);
      setRole(nextRole);
      return nextRole;
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setRole(null);
      setRoleError(message);
      throw error;
    } finally {
      setIsRoleLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      role,
      isRoleLoading,
      roleError,
      isFirebaseConfigured,
      authError,
      login,
      register,
      logout,
      refreshUserRole,
    }),
    [
      user,
      isLoading,
      role,
      isRoleLoading,
      roleError,
      authError,
      login,
      register,
      logout,
      refreshUserRole,
    ],
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
