import type { DocumentData } from 'firebase/firestore';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { requireFirestore, requireStorage } from '@/lib/firebase';
import {
  normalizeLocalizedAudioUrls,
  normalizeLocalizedText,
} from '@/lib/localized-attraction';
import type { Attraction, UploadedMedia } from '@/services/attractionService';

export type { Attraction, UploadedMedia } from '@/services/attractionService';

export type AttractionInput = Omit<Attraction, 'id'>;

type AdminContextValue = {
  attractions: Attraction[];
  isLoading: boolean;
  error: string | null;
  createAttractionId: () => string;
  addAttraction: (id: string, attraction: AttractionInput) => Promise<void>;
  updateAttraction: (id: string, attraction: AttractionInput) => Promise<void>;
  deleteAttraction: (id: string) => Promise<void>;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const attractionsQuery = query(
      collection(requireFirestore(), 'attractions'),
      orderBy('name', 'asc'),
    );
    const unsubscribe = onSnapshot(
      attractionsQuery,
      (snapshot) => {
        try {
          setAttractions(snapshot.docs.map((item) => parseAttraction(item.id, item.data())));
          setError(null);
        } catch (snapshotError) {
          setError(
            snapshotError instanceof Error
              ? snapshotError.message
              : 'An attraction record has invalid data.',
          );
        } finally {
          setIsLoading(false);
        }
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setIsLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const createAttractionId = useCallback(
    () => doc(collection(requireFirestore(), 'attractions')).id,
    [],
  );

  const addAttraction = useCallback(async (id: string, attraction: AttractionInput) => {
    try {
      await setDoc(doc(requireFirestore(), 'attractions', id), {
        ...attraction,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (writeError) {
      throw new Error(
        writeError instanceof Error ? writeError.message : 'Could not save the attraction.',
      );
    }
  }, []);

  const updateAttraction = useCallback(
    async (id: string, attraction: AttractionInput) => {
      const previous = attractions.find((item) => item.id === id);
      try {
        const attractionRef = doc(requireFirestore(), 'attractions', id);
        await setDoc(
          attractionRef,
          { ...attraction, updatedAt: serverTimestamp() },
          { merge: true },
        );
      } catch (writeError) {
        throw new Error(
          writeError instanceof Error ? writeError.message : 'Could not update the attraction.',
        );
      }

      if (previous) {
        const retainedPaths = new Set([
          ...attraction.photos.map((photo) => photo.path),
          ...(attraction.audioGuide ? [attraction.audioGuide.path] : []),
        ]);
        const removedMedia = [
          ...previous.photos,
          ...(previous.audioGuide ? [previous.audioGuide] : []),
        ].filter((media) => !retainedPaths.has(media.path));
        try {
          await Promise.all(
            removedMedia.map(deleteStoredMedia),
          );
        } catch (cleanupError) {
          throw new Error(
            `The attraction was updated, but some removed files could not be deleted: ${
              cleanupError instanceof Error ? cleanupError.message : 'unknown error'
            }`,
          );
        }
      }
    },
    [attractions],
  );

  const deleteAttraction = useCallback(
    async (id: string) => {
      const attraction = attractions.find((item) => item.id === id);
      if (attraction) {
        const media = [
          ...attraction.photos,
          ...(attraction.audioGuide ? [attraction.audioGuide] : []),
        ];
        try {
          await Promise.all(
            media.map(deleteStoredMedia),
          );
        } catch (cleanupError) {
          throw new Error(
            `Storage cleanup failed; the attraction record was kept. ${
              cleanupError instanceof Error ? cleanupError.message : 'unknown error'
            }`,
          );
        }
      }

      try {
        await deleteDoc(doc(requireFirestore(), 'attractions', id));
      } catch (deleteError) {
        throw new Error(
          deleteError instanceof Error
            ? `Media was removed, but the attraction record could not be deleted: ${deleteError.message}`
            : 'Media was removed, but the attraction record could not be deleted.',
        );
      }
    },
    [attractions],
  );

  const value = useMemo(
    () => ({
      attractions,
      isLoading,
      error,
      createAttractionId,
      addAttraction,
      updateAttraction,
      deleteAttraction,
    }),
    [
      attractions,
      isLoading,
      error,
      createAttractionId,
      addAttraction,
      updateAttraction,
      deleteAttraction,
    ],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

async function deleteStoredMedia(media: UploadedMedia) {
  if (media.provider === 'cloudinary') {
    return;
  }

  try {
    await deleteObject(ref(requireStorage(), media.path));
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'storage/object-not-found'
    ) {
      return;
    }
    throw error;
  }
}

function parseAttraction(id: string, data: DocumentData): Attraction {
  const legacyAudioUrl =
    typeof data.audioGuide === 'object' &&
    data.audioGuide !== null &&
    'url' in data.audioGuide &&
    typeof data.audioGuide.url === 'string'
      ? data.audioGuide.url
      : '';
  if (
    typeof data.name !== 'string' ||
    typeof data.category !== 'string' ||
    (typeof data.description !== 'string' &&
      (typeof data.description !== 'object' || data.description === null)) ||
    typeof data.location !== 'string' ||
    !isNullableNumber(data.durationMinutes ?? null) ||
    !isNullableNumber(data.chapterCount ?? null) ||
    !isNullableNumber(data.latitude) ||
    !isNullableNumber(data.longitude) ||
    !Array.isArray(data.photos) ||
    !data.photos.every(isUploadedMedia) ||
    (data.audioGuide !== null &&
      data.audioGuide !== undefined &&
      !isUploadedMedia(data.audioGuide))
  ) {
    throw new Error(`Attraction "${id}" has invalid Firestore data.`);
  }

  return {
    id,
    name: data.name,
    category: data.category,
    description: normalizeLocalizedText(data.description),
    audioUrl: normalizeLocalizedAudioUrls(data.audioUrl, legacyAudioUrl),
    location: data.location,
    durationMinutes: data.durationMinutes ?? null,
    chapterCount: data.chapterCount ?? null,
    latitude: data.latitude,
    longitude: data.longitude,
    photos: data.photos,
    audioGuide: data.audioGuide ?? null,
  };
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || (typeof value === 'number' && Number.isFinite(value));
}

function isUploadedMedia(value: unknown): value is UploadedMedia {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const media = value as Record<string, unknown>;
  return (
    typeof media.name === 'string' &&
    typeof media.path === 'string' &&
    typeof media.url === 'string' &&
    typeof media.contentType === 'string'
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used inside AdminProvider');
  }
  return context;
}
