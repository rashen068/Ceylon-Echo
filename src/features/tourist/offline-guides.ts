import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';

const STORAGE_KEY = '@ceylon-echo/offline-guides/v1';

export type OfflineGuide = {
  id: string;
  title: string;
  category: string;
  imageUrl: string | null;
  audioUrl: string;
  localUri: string;
  sizeBytes: number;
};

export async function getOfflineGuides(): Promise<OfflineGuide[]> {
  const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
  if (!storedValue) {
    return [];
  }

  const parsed: unknown = JSON.parse(storedValue);
  if (!Array.isArray(parsed) || !parsed.every(isOfflineGuide)) {
    throw new Error('Saved offline guide information is invalid. Remove and download the guides again.');
  }

  const existingGuides = parsed.filter((guide) => new File(guide.localUri).exists);
  if (existingGuides.length !== parsed.length) {
    await storeOfflineGuides(existingGuides);
  }
  return existingGuides;
}

export async function downloadOfflineGuide(
  guide: Omit<OfflineGuide, 'localUri' | 'sizeBytes'>,
): Promise<OfflineGuide> {
  const extension = getAudioExtension(guide.audioUrl);
  const safeId = guide.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const destination = new File(Paths.document, `${safeId}-${Date.now()}.${extension}`);
  let downloadedFile: File;

  try {
    downloadedFile = await File.downloadFileAsync(guide.audioUrl, destination, {
      idempotent: true,
    });
  } catch (error) {
    if (destination.exists) {
      destination.delete();
    }
    throw error;
  }

  const downloadedGuide: OfflineGuide = {
    ...guide,
    localUri: downloadedFile.uri,
    sizeBytes: downloadedFile.info().size ?? 0,
  };
  const offlineGuides = await getOfflineGuides();
  const previousGuide = offlineGuides.find((item) => item.id === guide.id);
  try {
    await storeOfflineGuides([
      ...offlineGuides.filter((item) => item.id !== guide.id),
      downloadedGuide,
    ]);
  } catch (error) {
    downloadedFile.delete();
    throw error;
  }
  if (previousGuide) {
    const previousFile = new File(previousGuide.localUri);
    if (previousFile.exists) {
      previousFile.delete();
    }
  }
  return downloadedGuide;
}

export async function removeOfflineGuide(id: string): Promise<void> {
  const guides = await getOfflineGuides();
  const removed = guides.find((guide) => guide.id === id);
  const remaining = guides.filter((guide) => guide.id !== id);
  await storeOfflineGuides(remaining);
  if (removed) {
    const file = new File(removed.localUri);
    if (file.exists) {
      file.delete();
    }
  }
}

export function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function storeOfflineGuides(guides: OfflineGuide[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(guides));
}

function isOfflineGuide(value: unknown): value is OfflineGuide {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const guide = value as Record<string, unknown>;
  return (
    typeof guide.id === 'string' &&
    typeof guide.title === 'string' &&
    typeof guide.category === 'string' &&
    (typeof guide.imageUrl === 'string' || guide.imageUrl === null) &&
    typeof guide.audioUrl === 'string' &&
    typeof guide.localUri === 'string' &&
    typeof guide.sizeBytes === 'number'
  );
}

function getAudioExtension(audioUrl: string): string {
  try {
    const path = new URL(audioUrl).pathname;
    const extension = path.split('.').pop()?.toLowerCase();
    if (extension && /^[a-z0-9]{2,5}$/.test(extension)) {
      return extension;
    }
  } catch {
    throw new Error('The audio guide URL is invalid.');
  }
  return 'audio';
}
