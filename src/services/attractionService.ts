import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

import {
  normalizeLocalizedAudioUrls,
  normalizeLocalizedText,
  type LocalizedAudioUrls,
  type LocalizedText,
} from '@/lib/localized-attraction';
import { requireFirestore } from '@/lib/firebase';

export type UploadedMedia = {
  name: string;
  path: string;
  url: string;
  contentType: string;
  provider?: 'cloudinary';
};

export type Attraction = {
  id: string;
  name: string;
  category: string;
  description: LocalizedText;
  audioUrl: LocalizedAudioUrls;
  location: string;
  durationMinutes: number | null;
  chapterCount: number | null;
  latitude: number | null;
  longitude: number | null;
  photos: UploadedMedia[];
  audioGuide: UploadedMedia | null;
};

export async function getAttractions(): Promise<Attraction[]> {
  const snapshot = await getDocs(
    query(collection(requireFirestore(), 'attractions'), orderBy('name', 'asc')),
  );
  return snapshot.docs.map((item) => parseAttraction(item.id, item.data()));
}

export function subscribeToAttractions(
  onAttractions: (attractions: Attraction[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    query(collection(requireFirestore(), 'attractions'), orderBy('name', 'asc')),
    (snapshot) => {
      try {
        onAttractions(snapshot.docs.map((item) => parseAttraction(item.id, item.data())));
      } catch (error) {
        onError(error instanceof Error ? error : new Error('Attraction data is invalid.'));
      }
    },
    onError,
  );
}

export async function getAttractionById(id: string): Promise<Attraction | null> {
  const snapshot = await getDoc(doc(requireFirestore(), 'attractions', id));
  return snapshot.exists() ? parseAttraction(snapshot.id, snapshot.data()) : null;
}

export async function getAttractionsByIds(ids: string[]): Promise<Attraction[]> {
  const attractions = await Promise.all(ids.map((id) => getAttractionById(id)));
  return attractions.filter((item): item is Attraction => item !== null);
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
    typeof media.contentType === 'string' &&
    (media.provider === undefined || media.provider === 'cloudinary')
  );
}
