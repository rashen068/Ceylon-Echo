import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect, Stack, useSegments } from 'expo-router';

import { AdminAuthProvider, useAdminAuth } from '@/features/admin/admin-auth';
import { AdminProvider } from '@/features/admin/admin-context';
import { adminColors } from '@/features/admin/admin-ui';

export default function AdminLayout() {
  return (
    <AdminAuthProvider>
      <AdminRoutes />
    </AdminAuthProvider>
  );
}

function AdminRoutes() {
  const { user, isAdmin, isLoading } = useAdminAuth();
  const segments = useSegments();
  const isAttractionsRoute = segments[1] === 'attractions';

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={adminColors.green} />
      </View>
    );
  }

  if (!user || !isAdmin) {
    if (isAttractionsRoute) {
      return <Redirect href="/admin" />;
    }
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  if (!isAttractionsRoute) {
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
});
