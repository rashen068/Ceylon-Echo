import { File, Paths, UploadType } from 'expo-file-system';
import * as LegacyFileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

import type { UploadedMedia } from '@/features/admin/admin-context';

const CLOUDINARY_CLOUD_NAME = 'mweyti8z';
const CLOUDINARY_UPLOAD_PRESET = 'Sigiriya1';

export async function uploadMedia(
  uri: string,
  name: string,
  contentType: string,
  path: string,
): Promise<UploadedMedia> {
  if (!contentType.startsWith('image/') && !contentType.startsWith('audio/')) {
    throw new Error('Only image and audio files can be uploaded.');
  }
  if (Platform.OS === 'web') {
    throw new Error(
      'Cloudinary uploads through Expo FileSystem are only supported on iOS and Android.',
    );
  }

  const safeFile = new File(
    Paths.cache,
    `safe_upload_${Date.now()}_${safeFileName(name)}`,
  );
  await LegacyFileSystem.copyAsync({ from: uri, to: safeFile.uri });

  if (!safeFile.exists || !safeFile.size) {
    throw new Error('The selected file is empty or could not be read.');
  }

  const separator = path.lastIndexOf('/');
  const folder = separator > 0 ? path.slice(0, separator) : 'ceylon-echo';
  const fileName = separator > 0 ? path.slice(separator + 1) : path;
  const extensionIndex = fileName.lastIndexOf('.');
  const publicId = extensionIndex > 0 ? fileName.slice(0, extensionIndex) : fileName;

  const response = await safeFile.upload(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      uploadType: UploadType.MULTIPART,
      fieldName: 'file',
      mimeType: contentType || 'application/octet-stream',
      parameters: {
        upload_preset: CLOUDINARY_UPLOAD_PRESET,
        folder,
        public_id: publicId,
      },
    },
  );
  let result: unknown;
  try {
    result = JSON.parse(response.body);
  } catch {
    throw new Error(
      `Cloudinary returned an unreadable response (HTTP ${response.status}): ${response.body}`,
    );
  }
  if (response.status < 200 || response.status >= 300) {
    const message =
      typeof result === 'object' &&
      result !== null &&
      'error' in result &&
      typeof result.error === 'object' &&
      result.error !== null &&
      'message' in result.error &&
      typeof result.error.message === 'string'
        ? result.error.message
        : response.body;
    throw new Error(`Cloudinary upload failed (HTTP ${response.status}): ${message}`);
  }

  if (
    typeof result !== 'object' ||
    result === null ||
    !('secure_url' in result) ||
    typeof result.secure_url !== 'string' ||
    !('public_id' in result) ||
    typeof result.public_id !== 'string'
  ) {
    throw new Error('Cloudinary upload succeeded but did not return a secure URL and public ID.');
  }

  return {
    name,
    path: `cloudinary/${result.public_id}`,
    url: result.secure_url,
    contentType,
    provider: 'cloudinary',
  };
}

export function safeFileName(name: string) {
  const leafName = name.split(/[\\/]/).pop() ?? 'upload';
  return leafName.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100) || 'upload';
}
