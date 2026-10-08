import { router } from 'expo-router';

export const APP_ROUTES = {
  onboarding: '/',
  userLogin: '/login',
  languageSelection: '/language',
  home: '/(tabs)/home',
} as const;

export const onboardingNavigation = {
  begin: () => router.replace(APP_ROUTES.userLogin),
  continueToLanguage: () => router.replace(APP_ROUTES.languageSelection),
  finish: () => router.replace(APP_ROUTES.home),
};
