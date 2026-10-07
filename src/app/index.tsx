import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomePage() {
  return (
    <View style={styles.screen}>
      <View style={styles.sky} />
      <View style={styles.distantMountainLeft} />
      <View style={styles.distantMountainRight} />
      <View style={styles.valley} />
      <View style={styles.foregroundHill} />

      <View style={styles.lighthouse}>
        <View style={styles.lighthouseRoof} />
        <View style={styles.lighthouseLantern}>
          <View style={styles.lighthouseWindow} />
        </View>
        <View style={styles.lighthouseBody}>
          <View style={styles.lighthouseStripe} />
          <View style={styles.lighthouseStripeLower} />
        </View>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.brand}>
          <View style={styles.wordmark}>
            <View style={styles.wordmarkCrest}>
              <View style={styles.crestColumn} />
              <View style={styles.crestArch} />
            </View>
            <Text style={styles.wordmarkTitle}>Ceylon Echo</Text>
          </View>
          <View style={styles.emblem}>
            <View style={styles.emblemMark}>
              <View style={styles.emblemLeaf} />
              <View style={styles.emblemTrunk} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#9fbab6',
  },
  sky: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#c9d4d0',
  },
  distantMountainLeft: {
    position: 'absolute',
    width: '125%',
    height: '52%',
    left: '-31%',
    top: '25%',
    borderRadius: 500,
    backgroundColor: '#849e93',
    transform: [{ rotate: '-12deg' }],
  },
  distantMountainRight: {
    position: 'absolute',
    width: '115%',
    height: '50%',
    right: '-46%',
    top: '34%',
    borderRadius: 500,
    backgroundColor: '#718d82',
    transform: [{ rotate: '12deg' }],
  },
  valley: {
    position: 'absolute',
    width: '155%',
    height: '42%',
    left: '-31%',
    bottom: '-1%',
    borderRadius: 500,
    backgroundColor: '#668873',
    transform: [{ rotate: '-8deg' }],
  },
  foregroundHill: {
    position: 'absolute',
    width: '115%',
    height: '25%',
    right: '-35%',
    bottom: '-3%',
    borderRadius: 500,
    backgroundColor: '#547a66',
    transform: [{ rotate: '-15deg' }],
  },
  lighthouse: {
    position: 'absolute',
    width: 54,
    height: '57%',
    left: '8%',
    bottom: '-2%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  lighthouseRoof: {
    zIndex: 2,
    width: 30,
    height: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#c5a873',
  },
  lighthouseLantern: {
    zIndex: 2,
    width: 23,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e8e0c9',
    backgroundColor: '#547467',
  },
  lighthouseWindow: {
    width: 7,
    height: 10,
    backgroundColor: '#d7c58f',
  },
  lighthouseBody: {
    width: 39,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#e8e4d4',
  },
  lighthouseStripe: {
    width: '100%',
    height: 8,
    marginTop: '45%',
    backgroundColor: '#b7714d',
  },
  lighthouseStripeLower: {
    width: '100%',
    height: 8,
    marginTop: 19,
    backgroundColor: '#b7714d',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  brand: {
    alignItems: 'center',
    marginTop: '18%',
  },
  wordmark: {
    alignItems: 'center',
    gap: 2,
    marginBottom: 10,
  },
  wordmarkCrest: {
    width: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  crestColumn: {
    width: 4,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#355c4a',
  },
  crestArch: {
    position: 'absolute',
    width: 13,
    height: 9,
    top: 2,
    borderWidth: 1.5,
    borderColor: '#355c4a',
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  wordmarkTitle: {
    color: '#355c4a',
    fontFamily: 'serif',
    fontSize: 19,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  emblem: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#315b49',
  },
  emblemMark: {
    width: 26,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#edf0df',
    borderRadius: 4,
  },
  emblemLeaf: {
    width: 12,
    height: 7,
    marginBottom: 1,
    borderWidth: 1.5,
    borderColor: '#edf0df',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 0,
  },
  emblemTrunk: {
    width: 2,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#edf0df',
  },
});
