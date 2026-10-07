import { useState } from 'react';
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

type SignInMode = 'user' | 'visitor';

export default function LoginScreen() {
  const { height } = useWindowDimensions();
  const [mode, setMode] = useState<SignInMode>('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function handleSignIn() {
    if (!username.trim() || !password) {
      setMessage('Enter your username and password to continue.');
      return;
    }

    setMessage('Sign-in is not connected yet.');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: Math.max(height * 0.055, 36) },
          ]}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                { marginBottom: Math.max(height * 0.033, 22) },
              ]}>
              Access Portal
            </Text>

            <View style={[styles.imageRow, { height: Math.min(height * 0.11, 112) }]}>
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

            <View style={styles.modeSelector}>
              <ModeButton
                label="User Sign-in"
                selected={mode === 'user'}
                onPress={() => {
                  setMode('user');
                  setMessage('');
                }}
              />
              <ModeButton
                label="Visitor Sign-in"
                selected={mode === 'visitor'}
                onPress={() => {
                  setMode('visitor');
                  setMessage('');
                }}
              />
            </View>

            <View style={{ marginTop: Math.max(height * 0.038, 26) }}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                accessibilityLabel="Username"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(value) => {
                  setUsername(value);
                  setMessage('');
                }}
                placeholder="Enter your username"
                placeholderTextColor="#aaa69e"
                returnKeyType="next"
                style={styles.input}
                textContentType="username"
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
                placeholder="••••••••"
                placeholderTextColor="#aaa69e"
                returnKeyType="done"
                secureTextEntry
                style={styles.input}
                textContentType="password"
                value={password}
              />

              {message ? (
                <Text accessibilityLiveRegion="polite" style={styles.message}>
                  {message}
                </Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={handleSignIn}
                style={({ pressed }) => [
                  styles.submitButton,
                  { marginTop: height * 0.125 },
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.submitText}>Sign in Securely</Text>
              </Pressable>

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
    gap: 5,
    overflow: 'hidden',
    borderRadius: 4,
  },
  photoPlaceholder: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 3,
  },
  firstPhoto: {
    backgroundColor: '#e5e1d7',
  },
  secondPhoto: {
    backgroundColor: '#dce0d8',
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 8,
    padding: 3,
    borderRadius: 8,
    backgroundColor: '#eee9dc',
  },
  modeButton: {
    minHeight: 31,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  modeButtonSelected: {
    backgroundColor: '#294e3e',
  },
  modeText: {
    color: '#777267',
    fontSize: 11,
    fontWeight: '500',
  },
  modeTextSelected: {
    color: '#ffffff',
  },
  label: {
    marginBottom: 3,
    color: '#45433d',
    fontSize: 10,
    fontWeight: '500',
  },
  passwordLabel: {
    marginTop: 8,
  },
  input: {
    minHeight: 35,
    borderWidth: 1,
    borderColor: '#e4e0d8',
    borderRadius: 6,
    paddingHorizontal: 9,
    color: '#383731',
    backgroundColor: '#ffffff',
    fontSize: 11,
  },
  message: {
    marginTop: 8,
    color: '#9b4d32',
    fontSize: 10,
    lineHeight: 15,
  },
  submitButton: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#b75f3e',
  },
  pressed: {
    opacity: 0.82,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    marginTop: 7,
    color: '#969187',
    fontSize: 8,
    textAlign: 'center',
  },
});
