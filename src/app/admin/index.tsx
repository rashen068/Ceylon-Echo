import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAdminAuth } from '@/features/admin/admin-auth';
import { AdminButton, AdminField, AdminScreen, adminColors } from '@/features/admin/admin-ui';

export default function AdminLoginScreen() {
  const { user, isAdmin, isFirebaseConfigured, error: authError, signIn, signOutAdmin } =
    useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }
    if (!isFirebaseConfigured) {
      setError('Firebase is not configured. Add the project settings to .env.local first.');
      return;
    }

    setError(null);
    setIsSigningIn(true);
    try {
      await signIn(email, password);
      router.replace('/admin/attractions');
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Could not sign in.');
    } finally {
      setIsSigningIn(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOutAdmin();
    } catch (signOutError) {
      setError(
        signOutError instanceof Error ? signOutError.message : 'Could not sign out. Please retry.',
      );
    }
  }

  return (
    <AdminScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.brand}>
          <Text style={styles.brandName}>Ceylon Echo</Text>
          <Text style={styles.brandCaption}>Staff & Curator Portal</Text>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>♧</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Admin Login</Text>
          {user && !isAdmin ? (
            <>
              <Text style={styles.error}>
                {authError ??
                  'This account is signed in but does not have admin access. Contact your Firebase project owner.'}
              </Text>
              <AdminButton
                label="Sign out"
                onPress={() => void handleSignOut()}
                style={styles.loginButton}
              />
            </>
          ) : (
            <>
              <AdminField
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                label="Email"
                onChangeText={setEmail}
                placeholder="admin@example.com"
                value={email}
              />
              <AdminField
                autoCapitalize="none"
                label="Password"
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                value={password}
              />
              {!isFirebaseConfigured ? (
                <Text style={styles.info}>
                  Connect a Firebase project by adding its Expo public settings to .env.local.
                </Text>
              ) : null}
              {error || authError ? <Text style={styles.error}>{error ?? authError}</Text> : null}
              <AdminButton
                disabled={isSigningIn}
                label={isSigningIn ? 'Signing in…' : 'Login'}
                onPress={() => void handleLogin()}
                style={styles.loginButton}
              />
            </>
          )}
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/(tabs)')}
          style={styles.publicAppLink}>
          <Text style={styles.publicAppLinkText}>Back to public app</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingBottom: 28,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandName: {
    color: adminColors.green,
    fontFamily: 'serif',
    fontSize: 29,
    fontWeight: '700',
  },
  brandCaption: {
    marginTop: 2,
    color: adminColors.muted,
    fontSize: 11,
  },
  brandMark: {
    width: 54,
    height: 54,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: adminColors.green,
  },
  brandMarkText: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 42,
  },
  card: {
    gap: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: adminColors.surface,
    borderWidth: 1,
    borderColor: '#EEEAE4',
  },
  title: {
    marginBottom: 1,
    color: adminColors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  error: {
    color: adminColors.rust,
    fontSize: 13,
  },
  info: {
    color: adminColors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  loginButton: {
    marginTop: 1,
  },
  publicAppLink: {
    alignSelf: 'center',
    marginTop: 18,
    padding: 10,
  },
  publicAppLinkText: {
    color: adminColors.green,
    fontSize: 13,
    fontWeight: '700',
  },
});
