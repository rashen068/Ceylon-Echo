import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import { onboardingNavigation } from '@/navigation/app-navigation';

export default function WelcomePage() {
  const { user, isLoading } = useAuth();
  const { height } = useWindowDimensions();
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      router.replace('/(tabs)/home');
    }
  }, [isLoading, user]);

  return (
    <View style={styles.screen}>
      {!imageFailed ? (
        <Image
          accessibilityLabel="Ancient Sri Lankan stone temple"
          contentFit="cover"
          onError={() => setImageFailed(true)}
          source={require('../../assets/images/onboarding(8).jpg')}
          style={StyleSheet.absoluteFill}
          transition={500}
        />
      ) : null}
      <View style={styles.imageOverlay} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <Animated.View entering={FadeIn.duration(650)} style={styles.topBar}>
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>CE</Text>
            </View>
            <Text style={styles.brandName}>CEYLON ECHO</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={onboardingNavigation.begin}
            style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(700).delay(120)}
          style={[styles.welcomeCopy, { paddingBottom: Math.max(height * 0.045, 24) }]}>
          <View style={styles.photoCaption}>
            <View style={styles.captionRule} />
            <Text style={styles.eyebrow}>AN ISLAND OF STORIES</Text>
          </View>
          <Text style={styles.welcomeTitle}>Discover the Soul of Sri Lanka</Text>
          <Text style={styles.welcomeSubtitle}>
            Find your way through living culture, ancient heritage, wild nature and unforgettable
            island experiences.
          </Text>
          <View style={styles.pageIndicators} accessibilityLabel="Onboarding page 1 of 1">
            <View style={styles.activeDot} />
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={onboardingNavigation.begin}
            style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}>
            <Text style={styles.startButtonText}>Get Started</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>
          <Text style={styles.footer}>A more meaningful way to explore</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#35473d',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(12, 24, 19, 0.38)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  brandMark: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.72)',
    borderRadius: 11,
    backgroundColor: 'rgba(27, 63, 48, 0.82)',
  },
  brandMarkText: {
    color: '#ffffff',
    fontFamily: 'serif',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  brandName: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  skipButton: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.58)',
    borderRadius: 20,
    backgroundColor: 'rgba(20, 32, 27, 0.25)',
  },
  skipText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  welcomeCopy: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    alignItems: 'flex-start',
    marginTop: 'auto',
  },
  photoCaption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 14,
  },
  captionRule: {
    width: 26,
    height: 1,
    backgroundColor: '#e7c997',
  },
  eyebrow: {
    color: '#f0dfbd',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.7,
  },
  welcomeTitle: {
    maxWidth: 360,
    color: '#ffffff',
    fontFamily: 'serif',
    fontSize: 36,
    fontWeight: '600',
    lineHeight: 42,
  },
  welcomeSubtitle: {
    maxWidth: 340,
    marginTop: 12,
    color: 'rgba(255,255,255,0.88)',
    fontSize: 13,
    lineHeight: 20,
  },
  pageIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
    marginBottom: 16,
  },
  activeDot: {
    width: 22,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#f0d39f',
  },
  startButton: {
    width: '100%',
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#285944',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  buttonArrow: {
    position: 'absolute',
    right: 18,
    color: '#ffffff',
    fontSize: 19,
  },
  footer: {
    alignSelf: 'center',
    marginTop: 12,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 9,
    letterSpacing: 0.2,
  },
  pressed: {
    opacity: 0.82,
  },
});
