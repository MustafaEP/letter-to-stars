import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: Animated.Value;
  duration: number;
  isIceBlue: boolean;
}

interface StarfieldProps {
  count?: number;
}

export default function Starfield({ count = 80 }: StarfieldProps) {
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    // Generate stars
    const stars: Star[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 0.5,
      opacity: new Animated.Value(Math.random() * 0.8 + 0.2),
      duration: Math.random() * 3000 + 2000,
      isIceBlue: Math.random() > 0.6,
    }));

    starsRef.current = stars;

    // Animate stars
    stars.forEach((star) => {
      const animate = () => {
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: 1,
            duration: star.duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: 0.2,
            duration: star.duration / 2,
            useNativeDriver: true,
          }),
        ]).start(() => animate());
      };
      animate();
    });
  }, [count]);

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Background gradient overlay */}
      <View style={styles.gradientOverlay} />

      {/* Stars */}
      {starsRef.current.map((star) => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              backgroundColor: star.isIceBlue ? '#38bdf8' : '#8b5cf6',
              shadowColor: star.isIceBlue ? '#38bdf8' : '#8b5cf6',
            },
          ]}
        />
      ))}

      {/* Nebula effects */}
      <View style={[styles.nebula, styles.nebula1]} />
      <View style={[styles.nebula, styles.nebula2]} />
      <View style={[styles.nebula, styles.nebula3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0a0e27',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 14, 39, 0.8)',
  },
  star: {
    position: 'absolute',
    borderRadius: 50,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  nebula: {
    position: 'absolute',
    borderRadius: 500,
    opacity: 0.15,
  },
  nebula1: {
    top: -100,
    right: -50,
    width: 400,
    height: 400,
    backgroundColor: '#6366f1',
  },
  nebula2: {
    bottom: -150,
    left: -80,
    width: 450,
    height: 450,
    backgroundColor: '#38bdf8',
  },
  nebula3: {
    top: '40%',
    left: '50%',
    width: 350,
    height: 350,
    backgroundColor: '#38bdf8',
    opacity: 0.1,
  },
});
