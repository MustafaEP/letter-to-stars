import React from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';
import { colors } from '../../styles/globalStyles';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  multiline = false,
  numberOfLines = 1,
}: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          multiline && styles.multiline,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: colors.gray[700],
    fontWeight: '500',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.red[500],
  },
  multiline: {
    minHeight: 100,
    paddingTop: 12,
  },
  errorText: {
    color: colors.red[500],
    fontSize: 12,
    marginTop: 4,
  },
});