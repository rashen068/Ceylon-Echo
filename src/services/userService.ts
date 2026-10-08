import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';

import { requireAuth, requireFirestore } from '@/lib/firebase';

export type UserProfile = {
  name: string;
  email: string;
  profileImage: string | null;
  interests: string[];
  createdAt: Timestamp | null;
  role: 'user' | 'admin';
};

export type UserProfileInput = Pick<
  UserProfile,
  'name' | 'email' | 'profileImage' | 'interests' | 'role'
>;

export async function createUserProfile(uid: string, profile: UserProfileInput): Promise<void> {
  await setDoc(doc(requireFirestore(), 'users', uid), {
    ...profile,
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(requireFirestore(), 'users', uid));
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  if (
    typeof data.name !== 'string' ||
    typeof data.email !== 'string' ||
    (data.profileImage !== undefined &&
      data.profileImage !== null &&
      typeof data.profileImage !== 'string') ||
    (data.interests !== undefined &&
      (!Array.isArray(data.interests) || !data.interests.every((item) => typeof item === 'string'))) ||
    (data.role !== 'user' && data.role !== 'admin') ||
    (data.createdAt !== undefined &&
      data.createdAt !== null &&
      !(data.createdAt instanceof Timestamp))
  ) {
    throw new Error('Your user profile has invalid Firestore data.');
  }

  return {
    name: data.name,
    email: data.email,
    profileImage: data.profileImage ?? null,
    interests: data.interests ?? [],
    createdAt: data.createdAt ?? null,
    role: data.role,
  };
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<Pick<UserProfile, 'name' | 'profileImage' | 'interests'>>,
): Promise<void> {
  const firestore = requireFirestore();
  const userRef = doc(firestore, 'users', uid);
  const existingProfile = await getDoc(userRef);
  if (!existingProfile.exists()) {
    const user = requireAuth().currentUser;
    if (!user || user.uid !== uid) {
      throw new Error('Sign in again before updating your profile.');
    }
    await createUserProfile(uid, {
      name: updates.name?.trim() || user.displayName || user.email?.split('@')[0] || 'Traveller',
      email: user.email ?? '',
      profileImage: updates.profileImage ?? null,
      interests: updates.interests ?? [],
      role: 'user',
    });
    return;
  }

  const profileUpdates = {
    ...(updates.name === undefined ? {} : { name: updates.name.trim() }),
    ...(updates.profileImage === undefined ? {} : { profileImage: updates.profileImage }),
    ...(updates.interests === undefined ? {} : { interests: updates.interests }),
  };
  await setDoc(userRef, profileUpdates, { merge: true });
}

export async function getSavedAttractionIds(uid: string): Promise<string[]> {
  const snapshot = await getDocs(
    collection(requireFirestore(), 'users', uid, 'savedAttractions'),
  );
  return snapshot.docs.map((item) => item.id);
}

export async function saveAttraction(uid: string, attractionId: string): Promise<void> {
  await setDoc(doc(requireFirestore(), 'users', uid, 'savedAttractions', attractionId), {
    attractionId,
    savedAt: serverTimestamp(),
  });
}

export async function removeSavedAttraction(uid: string, attractionId: string): Promise<void> {
  await deleteDoc(doc(requireFirestore(), 'users', uid, 'savedAttractions', attractionId));
}
