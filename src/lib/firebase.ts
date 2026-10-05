import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseError, getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { createAuthPersistence } from '@/lib/firebase-auth-persistence';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

function initializePersistentAuth() {
  if (!app) {
    return null;
  }

  try {
    return initializeAuth(app, {
      persistence: createAuthPersistence(AsyncStorage),
    });
  } catch (error) {
    if (error instanceof FirebaseError && error.code === 'auth/already-initialized') {
      return getAuth(app);
    }
    throw error;
  }
}

export const auth = initializePersistentAuth();
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

export function requireFirestore() {
  if (!db) {
    throw new Error('Firebase is not configured. Add your Firebase values to .env.local.');
  }
  return db;
}

export function requireStorage() {
  if (!storage) {
    throw new Error('Firebase is not configured. Add your Firebase values to .env.local.');
  }
  return storage;
}

export function requireAuth() {
  if (!auth) {
    throw new Error('Firebase is not configured. Add your Firebase values to .env.local.');
  }
  return auth;
}
