import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { AdminButton, AdminField, AdminScreen, adminColors } from '@/features/admin/admin-ui';

export default function AdminLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }
    setError('');
    router.replace('/admin/attractions');
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
          <AdminField
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            label="Username"
            onChangeText={setEmail}
            placeholder="curator@lakheritage.gov.lk"
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
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <AdminButton label="Login" onPress={handleLogin} style={styles.loginButton} />
        </View>
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
  loginButton: {
    marginTop: 1,
  },
});
