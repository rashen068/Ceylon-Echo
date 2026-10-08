import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import { onboardingNavigation } from '@/navigation/app-navigation';
import { getAuthErrorMessage } from '@/services/authService';

type SignInMode = 'user' | 'visitor';

export default function LoginScreen() {
  const { height } = useWindowDimensions();
  const { user, isFirebaseConfigured, authError, login, register } = useAuth();
  const [mode, setMode] = useState<SignInMode>('user');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const completedSignIn = useRef(false);

  useEffect(() => {
    if (user && !isBusy && !completedSignIn.current) {
      onboardingNavigation.finish();
    }
  }, [isBusy, user]);

  async function handleSignIn() {
    if (mode === 'visitor') {
      onboardingNavigation.continueToLanguage();
      return;
    }

    if (!username.trim() || !password || (isRegistering && !name.trim())) {
      setMessage(
        isRegistering
          ? 'Enter your name, email and password to create an account.'
          : 'Enter your email and password to continue.',
      );
      return;
    }
    if (!isFirebaseConfigured) {
      setMessage('Firebase is not configured. Add the project settings to .env and restart Expo.');
      return;
    }

    setIsBusy(true);
    setMessage('');
    try {
      if (isRegistering) {
        await register(name, username, password);
      } else {
        await login(username, password);
      }
      completedSignIn.current = true;
      onboardingNavigation.continueToLanguage();
    } catch (authError) {
      setMessage(getAuthErrorMessage(authError));
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: Math.max(height * 0.07, 44) },
          ]}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                { marginBottom: Math.max(height * 0.07, 30) },
              ]}>
              Access Portal
            </Text>

            <View style={[styles.imageRow, { height: Math.min(height * 0.125, 120) }]}>
              <View
                accessible
                accessibilityRole="image"
                accessibilityLabel="Landscape photo asset required"
                style={[styles.photoPlaceholder, styles.firstPhoto]}
              />
              <View
                accessible
                accessibilityRole="image"
                accessibilityLabel="Sri Lankan heritage photo asset required"
                style={[styles.photoPlaceholder, styles.secondPhoto]}
              />
            </View>

            <View
              style={[
                styles.modeSelector,
                { marginTop: Math.max(height * 0.018, 10) },
              ]}>
              <ModeButton
                label="User Sign-in"
                selected={mode === 'user'}
                onPress={() => {
                  setMode('user');
                  setIsRegistering(false);
                  setMessage('');
                }}
              />
              <ModeButton
                label="Visitor Sign-in"
                selected={mode === 'visitor'}
                onPress={() => {
                  setMode('visitor');
                  setIsRegistering(false);
                  setMessage('');
                }}
              />
            </View>

            <View style={[styles.form, { marginTop: Math.max(height * 0.05, 28) }]}>
              {mode === 'visitor' ? (
                <Text style={styles.visitorMessage}>
                  Continue as a visitor to explore public attractions. Sign in to save places or
                  manage your profile.
                </Text>
              ) : (
                <>
                  {isRegistering ? (
                    <>
                      <Text style={styles.label}>Name</Text>
                      <TextInput
                        accessibilityLabel="Name"
                        autoCapitalize="words"
                        onChangeText={(value) => {
                          setName(value);
                          setMessage('');
                        }}
                        placeholder="Enter your name"
                        placeholderTextColor="#aaa69e"
                        returnKeyType="next"
                        style={styles.input}
                        textContentType="name"
                        value={name}
                      />
                    </>
                  ) : null}

                  <Text style={[styles.label, isRegistering && styles.passwordLabel]}>Email</Text>
                  <TextInput
                    accessibilityLabel="Email"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    onChangeText={(value) => {
                      setUsername(value);
                      setMessage('');
                    }}
                    placeholder="Enter your email"
                    placeholderTextColor="#aaa69e"
                    returnKeyType="next"
                    style={styles.input}
                    textContentType="emailAddress"
                    value={username}
                  />

                  <Text style={[styles.label, styles.passwordLabel]}>Password</Text>
                  <TextInput
                    accessibilityLabel="Password"
                    autoCapitalize="none"
                    onChangeText={(value) => {
                      setPassword(value);
                      setMessage('');
                    }}
                    onSubmitEditing={() => void handleSignIn()}
                    placeholder="••••••••"
                    placeholderTextColor="#aaa69e"
                    returnKeyType="go"
                    secureTextEntry
                    style={styles.input}
                    textContentType={isRegistering ? 'newPassword' : 'password'}
                    value={password}
                  />
                </>
              )}

              {message || authError ? (
                <Text accessibilityLiveRegion="polite" style={styles.message}>
                  {message ?? authError}
                </Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: isBusy }}
                disabled={isBusy}
                onPress={() => void handleSignIn()}
                style={({ pressed }) => [
                  styles.submitButton,
                  { marginTop: 'auto' },
                  pressed && !isBusy && styles.pressed,
                  isBusy && styles.disabled,
                ]}>
                <Text style={styles.submitText}>
                  {mode === 'visitor'
                    ? 'Continue as a Visitor'
                    : isBusy
                      ? isRegistering
                        ? 'Creating account…'
                        : 'Signing in…'
                      : isRegistering
                        ? 'Create Account'
                        : 'Sign in Securely'}
                </Text>
              </Pressable>

              {mode === 'user' ? (
                <Pressable
                  accessibilityRole="button"
                  disabled={isBusy}
                  onPress={() => {
                    setIsRegistering((current) => !current);
                    setMessage('');
                  }}
                  style={styles.switchMode}>
                  <Text style={styles.switchModeText}>
                    {isRegistering ? 'Already have an account? Sign in' : 'New here? Create account'}
                  </Text>
                </Pressable>
              ) : null}

              <Text style={styles.footer}>
                Your journey through Sri Lanka starts here.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ModeButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.modeButton,
        selected && styles.modeButtonSelected,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.modeText, selected && styles.modeTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f6ef',
  },
  keyboardArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  content: {
    width: '100%',
    flexGrow: 1,
    maxWidth: 420,
  },
  title: {
    color: '#294e3e',
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  imageRow: {
    flexDirection: 'row',
    gap: 6,
    overflow: 'hidden',
    borderRadius: 5,
  },
  photoPlaceholder: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 3,
  },
  firstPhoto: {
    backgroundColor: '#e7e3d9',
  },
  secondPhoto: {
    backgroundColor: '#e2e5df',
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 6,
    padding: 4,
    borderRadius: 10,
    backgroundColor: '#eee9dc',
  },
  modeButton: {
    minHeight: 38,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  modeButtonSelected: {
    backgroundColor: '#294e3e',
  },
  modeText: {
    color: '#777267',
    fontSize: 12,
    fontWeight: '500',
  },
  modeTextSelected: {
    color: '#ffffff',
  },
  form: {
    flexGrow: 1,
  },
  label: {
    marginBottom: 4,
    color: '#45433d',
    fontSize: 11,
    fontWeight: '600',
  },
  passwordLabel: {
    marginTop: 10,
  },
  input: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#e4e0d8',
    borderRadius: 7,
    paddingHorizontal: 10,
    color: '#383731',
    backgroundColor: '#ffffff',
    fontSize: 12,
  },
  message: {
    marginTop: 8,
    color: '#9b4d32',
    fontSize: 10,
    lineHeight: 15,
  },
  visitorMessage: {
    marginTop: 4,
    color: '#777267',
    fontSize: 11,
    lineHeight: 17,
  },
  submitButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#b75f3e',
  },
  disabled: {
    opacity: 0.65,
  },
  pressed: {
    opacity: 0.82,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  switchMode: {
    alignItems: 'center',
    paddingVertical: 9,
  },
  switchModeText: {
    color: '#285944',
    fontSize: 10,
    fontWeight: '600',
  },
  footer: {
    marginTop: 7,
    color: '#969187',
    fontSize: 8,
    textAlign: 'center',
  },
});
