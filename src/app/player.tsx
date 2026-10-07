import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { featuredGuide } from '@/features/tourist/mock-guide-data';

const colors = {
  background: '#F8F6F1',
  white: '#FFFFFF',
  ink: '#1F2937',
  muted: '#7C838A',
  line: '#E5E1DA',
  rust: '#B85E3B',
  green: '#315443',
};

export default function AudioPlayerScreen() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.headerButton}>
            <Feather color={colors.ink} name="chevron-left" size={21} />
          </Pressable>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <Pressable
            accessibilityLabel="More player options"
            accessibilityRole="button"
            onPress={() => router.push('/downloads')}
            style={styles.headerButton}>
            <Feather color={colors.ink} name="more-horizontal" size={21} />
          </Pressable>
        </View>

        <Image
          contentFit="cover"
          source={{ uri: featuredGuide.image }}
          style={styles.coverImage}
        />
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>Sigiriya Audio Guide - Chapter 1</Text>
          <Text style={styles.trackSubtitle}>Ancient Fortress & gardens</Text>
        </View>

        <View style={styles.progressSection}>
          <View accessibilityLabel="Audio progress, 25 percent" style={styles.progressTrack}>
            <View style={styles.progressFill} />
            <View style={styles.progressThumb} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timestamp}>01:15</Text>
            <Text style={styles.timestamp}>04:30</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <Pressable accessibilityLabel="Previous chapter" style={styles.skipButton}>
            <Feather color={colors.green} name="skip-back" size={20} />
          </Pressable>
          <Pressable
            accessibilityLabel={isPlaying ? 'Pause audio' : 'Play audio'}
            accessibilityRole="button"
            onPress={() => setIsPlaying((playing) => !playing)}
            style={styles.playControl}>
            <Feather color={colors.white} name={isPlaying ? 'pause' : 'play'} size={22} />
          </Pressable>
          <Pressable accessibilityLabel="Next chapter" style={styles.skipButton}>
            <Feather color={colors.green} name="skip-forward" size={20} />
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/downloads')}
          style={({ pressed }) => [styles.offlineLink, pressed && styles.pressed]}>
          <Feather color={colors.rust} name="download" size={13} />
          <Text style={styles.offlineText}>Download for Offline Listening</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    height: 48,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  headerTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
  },
  coverImage: {
    width: '84%',
    maxWidth: 310,
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: colors.line,
  },
  trackInfo: {
    marginTop: 16,
    alignItems: 'center',
    gap: 4,
  },
  trackTitle: {
    color: colors.ink,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
  },
  trackSubtitle: {
    color: colors.rust,
    fontSize: 12,
    fontWeight: '600',
  },
  progressSection: {
    marginTop: 21,
  },
  progressTrack: {
    height: 4,
    justifyContent: 'center',
    borderRadius: 2,
    backgroundColor: colors.line,
  },
  progressFill: {
    width: '25%',
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.rust,
  },
  progressThumb: {
    position: 'absolute',
    left: '25%',
    width: 12,
    height: 12,
    marginLeft: -6,
    borderRadius: 6,
    backgroundColor: colors.rust,
  },
  timeRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timestamp: {
    color: colors.muted,
    fontSize: 10,
  },
  controls: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  skipButton: {
    width: 35,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playControl: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: colors.green,
  },
  offlineLink: {
    marginTop: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  offlineText: {
    color: colors.rust,
    fontSize: 11,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
