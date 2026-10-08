import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { TravelColors } from '@/components/travel-ui';

export function DataMessage({
  message,
  isLoading = false,
  isError = false,
}: {
  message: string;
  isLoading?: boolean;
  isError?: boolean;
}) {
  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator color={TravelColors.green} /> : null}
      <Text style={[styles.message, isError && styles.error]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f0f3ed',
  },
  message: {
    color: TravelColors.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },
  error: {
    color: '#9b4d32',
  },
});
