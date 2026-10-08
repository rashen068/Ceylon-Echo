import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import type { FirebaseOptions } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { createAuthPersistence } from '@/lib/firebase-auth-persistence';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const requiredConfigKeys: (keyof FirebaseOptions)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'messagingSenderId',
  'appId',
];

export const isFirebaseConfigured = requiredConfigKeys.every((key) => {
  const value = firebaseConfig[key];
  return typeof value === 'string' && value.trim().length > 0;
});

const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

function initializeFirebaseAuth(firebaseApp: NonNullable<typeof app>): Auth {
  try {
    return initializeAuth(firebaseApp, {
      persistence: createAuthPersistence(AsyncStorage),
    });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'auth/already-initialized'
    ) {
      return getAuth(firebaseApp);
    }
    throw error;
  }
}

export const auth = app ? initializeFirebaseAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app && firebaseConfig.storageBucket ? getStorage(app) : null;

function missingConfigurationError() {
  return new Error(
    'Firebase is not configured. Add the EXPO_PUBLIC_FIREBASE_* values from your Firebase web app to .env, then restart Expo.',
  );
}

export function requireAuth(): Auth {
  if (!auth) {
    throw missingConfigurationError();
  }
  return auth;
}

export function requireFirestore() {
  if (!db) {
    throw missingConfigurationError();
  }
  return db;
}

export function requireStorage() {
  if (!storage) {
    throw new Error(
      'Firebase Storage is not configured. Set EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET only if you still need to manage legacy Firebase Storage media.',
    );
  }
  return storage;
}
