import { StyleSheet } from 'react-native';

// Cosmic Ice Blue Theme
export const colors = {
  // Cosmic colors
  cosmic: {
    dark: '#0a0e27',
    darker: '#050810',
    darkest: '#0f1329',
  },
  // Ice blue primary
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8', // Main ice blue
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  // Cosmic purple/violet
  purple: {
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
  },
  violet: {
    500: '#6366f1',
    600: '#4f46e5',
  },
  // Grays for text
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  white: '#ffffff',
  black: '#000000',
  red: {
    50: '#fef2f2',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
  },
  green: {
    400: '#4ade80',
    500: '#10b981',
  },
  yellow: {
    500: '#eab308',
  },
  blue: {
    500: '#3b82f6',
    600: '#2563eb',
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cosmic.dark,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Glassmorphism card
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  // Shadow with glow
  glowShadow: {
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  // Text styles
  textCosmic: {
    color: colors.gray[100],
  },
  textIceBlue: {
    color: colors.primary[400],
  },
  textPurple: {
    color: colors.purple[400],
  },
});