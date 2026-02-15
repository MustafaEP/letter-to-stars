import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import Starfield from './Starfield';
import AppLogo from './AppLogo';
import { colors } from '../../styles/globalStyles';

export default function LoadingSpinner() {
  return (
    <View style={styles.container}>
      <Starfield count={60} />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <AppLogo size={64} />
        </View>
        <ActivityIndicator size="large" color={colors.primary[400]} />
        <Text style={styles.text}>Yıldızlara bağlanıyor...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cosmic.dark,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: colors.gray[300],
    fontWeight: '500',
  },
});