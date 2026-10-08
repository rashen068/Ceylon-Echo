import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, Stack, router, useSegments } from 'expo-router';

import { AdminAuthProvider, useAdminAuth } from '@/features/admin/admin-auth';
import { AdminProvider } from '@/features/admin/admin-context';
import { adminColors } from '@/features/admin/admin-ui';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLayout() {
  return (
    <AdminAuthProvider>
      <AdminRoutes />
    </AdminAuthProvider>
  );
}

function AdminRoutes() {
  const { user, isAdmin, isLoading, error } = useAdminAuth();
  const { t } = useLanguage();
  const segments = useSegments();
  const isAdminContentRoute = segments[1] === 'attractions';

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={adminColors.green} />
      </View>
    );
  }

  if (user && error) {
    return (
      <View style={styles.denied}>
        <Text style={styles.deniedTitle}>{t('adminAccessDenied')}</Text>
        <Text style={styles.deniedMessage}>{error}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/(tabs)/home')}
          style={styles.homeButton}>
          <Text style={styles.homeButtonText}>{t('returnToHome')}</Text>
        </Pressable>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (!isAdmin) {
    return <Redirect href="/(tabs)/home" />;
  }

  if (!isAdminContentRoute) {
    return <Redirect href="/admin/attractions" />;
  }

  return (
    <AdminProvider key={user.uid}>
      <Stack screenOptions={{ headerShown: false }} />
    </AdminProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: adminColors.background,
  },
  denied: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: adminColors.background,
  },
  deniedTitle: {
    color: adminColors.text,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  deniedMessage: {
    marginTop: 10,
    color: adminColors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  homeButton: {
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: adminColors.green,
  },
  homeButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
