import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import type { UploadedMedia } from '@/features/admin/admin-context';
import { requireStorage } from '@/lib/firebase';

export async function uploadMedia(
  uri: string,
  name: string,
  contentType: string,
  path: string,
): Promise<UploadedMedia> {
  const blob = await readLocalFile(uri);
  try {
    if (!blob.size) {
      throw new Error('The selected file is empty or could not be read.');
    }

    const storageRef = ref(requireStorage(), path);
    const snapshot = await uploadBytes(storageRef, blob, { contentType });
    const url = await getDownloadURL(snapshot.ref);
    return { name, path, url, contentType };
  } finally {
    if ('close' in blob && typeof blob.close === 'function') {
      blob.close();
    }
  }
}

function readLocalFile(uri: string) {
  return new Promise<Blob>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.onload = () => {
      if (!(request.response instanceof Blob)) {
        reject(new Error('The selected file could not be read.'));
        return;
      }
      resolve(request.response);
    };
    request.onerror = () => reject(new Error('Could not read the selected file.'));
    request.onabort = () => reject(new Error('Reading the selected file was cancelled.'));
    request.responseType = 'blob';
    request.open('GET', uri, true);
    request.send();
  });
}

export function safeFileName(name: string) {
  const leafName = name.split(/[\\/]/).pop() ?? 'upload';
  return leafName.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100) || 'upload';
}
