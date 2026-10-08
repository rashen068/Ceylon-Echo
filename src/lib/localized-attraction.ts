import type { AppLanguage } from '@/lib/language-preference';

export type LocalizedText = Record<AppLanguage, string>;
export type LocalizedAudioUrls = Record<AppLanguage, string>;

export const APP_LANGUAGE_CODES: AppLanguage[] = ['en', 'fr', 'zh'];

export function emptyLocalizedText(): LocalizedText {
  return { en: '', fr: '', zh: '' };
}

export function emptyLocalizedAudioUrls(): LocalizedAudioUrls {
  return { en: '', fr: '', zh: '' };
}

export function normalizeLocalizedText(value: unknown): LocalizedText {
  if (typeof value === 'string') {
    return { en: value, fr: '', zh: '' };
  }
  if (typeof value !== 'object' || value === null) {
    return emptyLocalizedText();
  }

  const localized = value as Partial<Record<AppLanguage, unknown>>;
  return {
    en: typeof localized.en === 'string' ? localized.en : '',
    fr: typeof localized.fr === 'string' ? localized.fr : '',
    zh: typeof localized.zh === 'string' ? localized.zh : '',
  };
}

export function getLocalizedText(
  value: unknown,
  language: AppLanguage,
  fallback = '',
): string {
  const localized = normalizeLocalizedText(value);
  return localized[language] || localized.en || fallback;
}

export function normalizeLocalizedAudioUrls(
  value: unknown,
  legacyAudioUrl = '',
): LocalizedAudioUrls {
  const localized = emptyLocalizedAudioUrls();
  if (typeof value === 'string') {
    localized.en = value;
  } else if (typeof value === 'object' && value !== null) {
    const record = value as Partial<Record<AppLanguage, unknown>>;
    for (const language of APP_LANGUAGE_CODES) {
      const entry = record[language];
      if (typeof entry === 'string') {
        localized[language] = entry;
      } else if (
        typeof entry === 'object' &&
        entry !== null &&
        'url' in entry &&
        typeof entry.url === 'string'
      ) {
        localized[language] = entry.url;
      }
    }
  }
  if (!localized.en && legacyAudioUrl) {
    localized.en = legacyAudioUrl;
  }
  return localized;
}

export function getLocalizedAudioUrl(
  value: unknown,
  language: AppLanguage,
  legacyAudioUrl = '',
): string {
  const localized = normalizeLocalizedAudioUrls(value, legacyAudioUrl);
  return localized[language] || localized.en;
}
