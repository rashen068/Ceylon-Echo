import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { onboardingNavigation } from '@/navigation/app-navigation';

const languages = ['English', 'Russian', 'French', 'Spanish'];

export default function LanguageScreen() {
  const [selected, setSelected] = useState('English');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topMark}>
          <Text style={styles.markText}>CE</Text>
        </View>
        <Text style={styles.eyebrow}>CEYLON ECHO</Text>
        <Text style={styles.title}>Preferred Language</Text>
        <Text style={styles.subtitle}>Choose the language you’d like to explore in.</Text>
        <View style={styles.languageList}>
          {languages.map((language) => {
            const isSelected = selected === language;
            return (
              <Pressable
                key={language}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setSelected(language)}
                style={({ pressed }) => [
                  styles.languageOption,
                  isSelected && styles.languageOptionSelected,
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.languageText, isSelected && styles.languageTextSelected]}>
                  {language}
                </Text>
                {isSelected ? <Text style={styles.check}>✓</Text> : null}
              </Pressable>
            );
          })}
        </View>
        <View style={styles.culturalArt} accessible accessibilityLabel="Illustrated Sri Lankan palm landscape">
          <View style={styles.artSun} />
          <View style={styles.artHorizon} />
          <View style={styles.artSilhouette} />
          <View style={styles.artWater} />
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onboardingNavigation.finish}
          style={({ pressed }) => [styles.continueButton, pressed && styles.pressed]}>
          <Text style={styles.continueText}>Continue</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffd725',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 23,
    paddingTop: 22,
    paddingBottom: 18,
  },
  topMark: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: 17,
    backgroundColor: '#fff8ce',
  },
  markText: {
    color: '#315b49',
    fontFamily: 'serif',
    fontSize: 12,
    fontWeight: '700',
  },
  eyebrow: {
    color: '#74611b',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  title: {
    marginTop: 8,
    color: '#3b392f',
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 5,
    color: '#6f6541',
    fontSize: 11,
  },
  languageList: {
    width: '100%',
    gap: 8,
    marginTop: 22,
  },
  languageOption: {
    minHeight: 41,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(41, 78, 62, 0.24)',
    borderRadius: 12,
    backgroundColor: '#fff8d4',
  },
  languageOptionSelected: {
    borderColor: '#234e3b',
    backgroundColor: '#285944',
  },
  languageText: {
    color: '#524d3b',
    fontSize: 12,
    fontWeight: '600',
  },
  languageTextSelected: {
    color: '#ffffff',
  },
  check: {
    position: 'absolute',
    right: 14,
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  culturalArt: {
    width: '100%',
    minHeight: 190,
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 18,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: '#e99a24',
  },
  artSun: {
    position: 'absolute',
    top: '18%',
    left: '19%',
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: '#ffda50',
  },
  artHorizon: {
    position: 'absolute',
    right: '-20%',
    bottom: '23%',
    left: '-15%',
    height: '31%',
    borderRadius: 100,
    backgroundColor: '#bd642c',
    transform: [{ rotate: '-4deg' }],
  },
  artSilhouette: {
    position: 'absolute',
    right: '22%',
    bottom: 0,
    width: 12,
    height: '70%',
    borderRadius: 7,
    backgroundColor: '#302c1f',
    transform: [{ rotate: '-8deg' }],
  },
  artWater: {
    position: 'absolute',
    right: '-10%',
    bottom: '-24%',
    left: '-10%',
    height: '46%',
    borderRadius: 100,
    backgroundColor: '#884f2a',
  },
  continueButton: {
    width: '100%',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    borderRadius: 10,
    backgroundColor: '#285944',
  },
  continueText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.82,
  },
});
