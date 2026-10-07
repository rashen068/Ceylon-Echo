import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LandscapeArt, ScreenFrame, SectionHeading, TravelColors } from '@/components/travel-ui';

export default function AudioGuideScreen() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(28);

  function seekForward() {
    setProgress((value) => Math.min(value + 8, 100));
  }

  return (
    <ScreenFrame title="Now Playing" subtitle="A local story from the Cultural Triangle">
      <LandscapeArt tone="forest" style={styles.cover} />
      <Text style={styles.guideTitle}>Sigiriya Audio Guide</Text>
      <Text style={styles.chapter}>Chapter 1 · The Lion Rock</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <View style={styles.timeRow}>
        <Text style={styles.time}>{Math.floor((progress / 100) * 720 / 60)}:{String(Math.floor(((progress / 100) * 720) % 60)).padStart(2, '0')}</Text>
        <Text style={styles.time}>12:00</Text>
      </View>
      <View style={styles.playerControls}>
        <Pressable accessibilityRole="button" onPress={() => setProgress(0)} style={styles.skipButton}>
          <Text style={styles.controlText}>↶</Text>
          <Text style={styles.skipLabel}>15</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={playing ? 'Pause audio guide' : 'Play audio guide'}
          onPress={() => setPlaying((value) => !value)}
          style={styles.playButton}>
          <Text style={styles.playIcon}>{playing ? 'Ⅱ' : '▶'}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={seekForward} style={styles.skipButton}>
          <Text style={styles.controlText}>↷</Text>
          <Text style={styles.skipLabel}>15</Text>
        </Pressable>
      </View>
      <Text style={styles.status}>{playing ? 'Playing your audio guide' : 'Ready when you are'}</Text>
      <SectionHeading title="In this guide" />
      <Chapter number="01" title="The Lion Rock" duration="12 min" active />
      <Chapter number="02" title="The Water Gardens" duration="8 min" />
      <Chapter number="03" title="Frescoes & Mirror Wall" duration="10 min" />
    </ScreenFrame>
  );
}

function Chapter({
  number,
  title,
  duration,
  active = false,
}: {
  number: string;
  title: string;
  duration: string;
  active?: boolean;
}) {
  return (
    <View style={[styles.chapterRow, active && styles.chapterActive]}>
      <Text style={styles.chapterNumber}>{number}</Text>
      <Text style={styles.chapterRowTitle}>{title}</Text>
      <Text style={styles.chapterDuration}>{duration}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { height: 200, borderRadius: 15 },
  guideTitle: {
    marginTop: 17,
    color: TravelColors.ink,
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  chapter: { marginTop: 5, color: TravelColors.muted, fontSize: 10, textAlign: 'center' },
  progressTrack: {
    height: 4,
    overflow: 'hidden',
    marginTop: 24,
    borderRadius: 4,
    backgroundColor: '#e6e5de',
  },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: TravelColors.orange },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  time: { color: TravelColors.muted, fontSize: 8 },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    marginTop: 14,
  },
  skipButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  controlText: { color: TravelColors.ink, fontSize: 19 },
  skipLabel: { position: 'absolute', top: 13, color: TravelColors.ink, fontSize: 6 },
  playButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: TravelColors.green,
  },
  playIcon: { color: '#ffffff', fontSize: 18 },
  status: { marginTop: 9, color: TravelColors.orange, fontSize: 9, textAlign: 'center' },
  chapterRow: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#efeee8',
    gap: 10,
  },
  chapterActive: { backgroundColor: '#f1f5f1' },
  chapterNumber: { width: 25, color: TravelColors.green, fontSize: 9, fontWeight: '700' },
  chapterRowTitle: { flex: 1, color: TravelColors.ink, fontSize: 10, fontWeight: '600' },
  chapterDuration: { color: TravelColors.muted, fontSize: 9 },
});
