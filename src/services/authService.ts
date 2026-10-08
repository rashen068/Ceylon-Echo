import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import type { User } from 'firebase/auth';

import { requireAuth } from '@/lib/firebase';
import { createUserProfile } from '@/services/userService';

export async function registerUser(name: string, email: string, password: string): Promise<User> {
  let user: User;
  try {
    const credential = await createUserWithEmailAndPassword(
      requireAuth(),
      email.trim(),
      password,
    );
    user = credential.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }

  try {
    await updateProfile(user, { displayName: name.trim() });
    await createUserProfile(user.uid, {
      name: name.trim(),
      email: user.email ?? email.trim(),
      profileImage: null,
      interests: [],
      role: 'user',
    });
    return user;
  } catch (profileError) {
    const profileMessage = getAuthErrorMessage(profileError);
    try {
      await signOut(requireAuth());
    } catch (signOutError) {
      throw new Error(
        `Your account was created, but its profile could not be saved: ${profileMessage} Signing out also failed: ${getAuthErrorMessage(signOutError)}`,
      );
    }
    throw new Error(
      `Your account was created, but its profile could not be saved: ${profileMessage} Sign in again after checking your connection.`,
    );
  }
}

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const credential = await signInWithEmailAndPassword(
      requireAuth(),
      email.trim(),
      password,
    );
    return credential.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(requireAuth());
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

export function getCurrentUser(): User | null {
  return requireAuth().currentUser;
}

export function getAuthErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'The email or password is incorrect.';
      case 'auth/email-already-in-use':
        return 'An account already exists for this email address.';
      case 'auth/invalid-email':
        return 'Enter a valid email address.';
      case 'auth/weak-password':
        return 'Choose a stronger password (at least 6 characters).';
      case 'auth/too-many-requests':
        return 'Too many attempts. Wait a moment and try again.';
      case 'auth/network-request-failed':
        return 'A network error interrupted authentication. Check your connection and retry.';
      case 'permission-denied':
        return 'Firebase rejected the request. Check your Firestore security rules.';
      default:
        break;
    }
  }

  return error instanceof Error ? error.message : 'Authentication failed. Please try again.';
}
