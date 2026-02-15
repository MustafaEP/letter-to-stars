import React from 'react';
import { Image, StyleSheet, ViewStyle } from 'react-native';

type AppLogoProps = {
  size?: number;
  style?: ViewStyle;
};

export default function AppLogo({ size = 56, style }: AppLogoProps) {
  return (
    <Image
      source={require('../../../assets/icon.png')}
      style={[styles.logo, { width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 56,
    height: 56,
  },
});
