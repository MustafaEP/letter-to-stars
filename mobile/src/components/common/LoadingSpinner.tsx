import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { colors } from '../../styles/globalStyles';

export default function LoadingSpinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary[600]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});