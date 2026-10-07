import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { touristGuides } from '@/features/tourist/mock-guide-data';

const colors = {
  background: '#F8F6F1',
  white: '#FFFFFF',
  ink: '#1F2937',
  muted: '#858B91',
  line: '#E9E5DE',
  green: '#315443',
  greenLight: '#EDF3EF',
};

export default function DownloadsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Offline Audio Guides</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Downloaded Guides</Text>
        <View style={styles.guideList}>
          {touristGuides.map((guide) => (
            <View key={guide.id} style={styles.guideCard}>
              <Image contentFit="cover" source={{ uri: guide.image }} style={styles.thumbnail} />
              <View style={styles.guideCopy}>
                <Text numberOfLines={1} style={styles.guideTitle}>
                  {guide.title}
                </Text>
                <Text style={styles.fileSize}>{guide.fileSize}</Text>
              </View>
              <Pressable
                accessibilityLabel={`Play ${guide.title}`}
                accessibilityRole="button"
                onPress={() => router.push('/player')}
                style={({ pressed }) => [styles.playButton, pressed && styles.pressed]}>
                <Feather color={colors.green} name="play" size={15} />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 58,
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    backgroundColor: colors.background,
  },
  headerTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 10,
  },
  sectionTitle: {
    marginBottom: 1,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  guideList: {
    gap: 8,
  },
  guideCard: {
    minHeight: 62,
    padding: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 7,
    backgroundColor: colors.line,
  },
  guideCopy: {
    flex: 1,
    gap: 3,
  },
  guideTitle: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '700',
  },
  fileSize: {
    color: colors.muted,
    fontSize: 9,
  },
  playButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.greenLight,
  },
  pressed: {
    opacity: 0.65,
  },
});
