import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FirebaseAuth from 'firebase/auth';
import { browserLocalPersistence } from 'firebase/auth';
import type { Persistence } from 'firebase/auth';
import { Platform } from 'react-native';

type NativePersistenceFactory = (storage: typeof AsyncStorage) => Persistence;

function isNativePersistenceFactory(value: unknown): value is NativePersistenceFactory {
  return typeof value === 'function';
}

export function createAuthPersistence(storage: typeof AsyncStorage): Persistence {
  if (Platform.OS === 'web') {
    return browserLocalPersistence;
  }

  // Firebase exposes this helper in its React Native entry but omits it from shared typings.
  const factory = Reflect.get(FirebaseAuth, 'getReactNativePersistence');
  if (!isNativePersistenceFactory(factory)) {
    throw new Error('Firebase Auth does not expose React Native persistence in this build.');
  }
  return factory(storage);
}
