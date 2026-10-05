import { Stack } from 'expo-router';

import { AdminProvider } from '@/features/admin/admin-context';

export default function AdminLayout() {
  return (
    <AdminProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AdminProvider>
  );
}
