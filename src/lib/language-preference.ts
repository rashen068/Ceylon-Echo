import AsyncStorage from '@react-native-async-storage/async-storage';

export const APP_LANGUAGES = ['en', 'fr', 'zh'] as const;
export type AppLanguage = (typeof APP_LANGUAGES)[number];

const LANGUAGE_STORAGE_KEY = '@ceylon-echo/language';

export async function getSavedLanguage(): Promise<AppLanguage | null> {
  const language = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  switch (language) {
    case 'en':
    case 'English':
      return 'en';
    case 'fr':
    case 'Français':
    case 'French':
      return 'fr';
    case 'zh':
    case '中文':
    case 'Chinese':
      return 'zh';
    default:
      return null;
  }
}

export async function saveLanguage(language: AppLanguage): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}
