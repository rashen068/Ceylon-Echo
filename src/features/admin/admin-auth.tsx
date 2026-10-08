import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';

import { auth, isFirebaseConfigured, requireAuth } from '@/lib/firebase';
import { getUserRole } from '@/services/userService';

type AdminAuthValue = {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOutAdmin: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentAuth = auth;
    if (!currentAuth) {
      return;
    }

    let mounted = true;
    let authEventId = 0;
    const unsubscribe = onAuthStateChanged(currentAuth, async (nextUser) => {
      const eventId = ++authEventId;
      if (!mounted) {
        return;
      }
      setUser(nextUser);
      setIsAdmin(false);
      setError(null);

      if (!nextUser) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const role = await getUserRole(nextUser.uid);
        if (mounted && eventId === authEventId) {
          setIsAdmin(role === 'admin');
          if (role !== 'admin') {
            setError('This account does not have admin access.');
          }
          setIsLoading(false);
        }
      } catch (authError) {
        if (mounted && eventId === authEventId) {
          setError(getErrorMessage(authError));
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      authEventId += 1;
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const credential = await signInWithEmailAndPassword(requireAuth(), email.trim(), password);
      const role = await getUserRole(credential.user.uid);
      if (role !== 'admin') {
        await signOut(requireAuth());
        throw new Error('This account does not have admin access.');
      }
    } catch (authError) {
      const message = getErrorMessage(authError);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const signOutAdmin = useCallback(async () => {
    setError(null);
    try {
      await signOut(requireAuth());
    } catch (authError) {
      const message = getErrorMessage(authError);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      isLoading,
      isFirebaseConfigured,
      error,
      signIn,
      signOutAdmin,
    }),
    [user, isAdmin, isLoading, error, signIn, signOutAdmin],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'The email or password is incorrect.';
      case 'auth/invalid-email':
        return 'Enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Wait a moment and try again.';
      case 'permission-denied':
        return 'Could not verify your admin role. Check your connection and Firestore permissions.';
      case 'auth/network-request-failed':
      case 'unavailable':
      case 'deadline-exceeded':
        return 'A network error interrupted admin verification. Check your connection and retry.';
      default:
        break;
    }
  }
  return error instanceof Error ? error.message : 'Authentication failed. Please try again.';
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  }
  return context;
}
