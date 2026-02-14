import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { diaryApi } from '../../api/diary.api';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Button from '../../components/common/Button';
import { colors } from '../../styles/globalStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DiaryCreateScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [text, setText] = useState('');
  const [ieltsLevel, setIeltsLevel] = useState(7);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (text.trim().length < 50) {
      Alert.alert('Eksik Bilgi', 'Günlük en az 50 karakter olmalıdır');
      return;
    }

    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 10) {
      Alert.alert('Eksik Bilgi', 'Günlük en az 10 kelime içermelidir');
      return;
    }

    setLoading(true);
    try {
      const result = await diaryApi.create({
        originalText: text,
        ieltsLevel,
      });

      Alert.alert('Başarılı', 'Günlük kaydedildi! ✓', [
        {
          text: 'Tamam',
          onPress: () => {
            const dateString = new Date(result.entryDate)
              .toISOString()
              .split('T')[0];
            navigation.navigate('DiaryDetail', { date: dateString });
            setText('');
          },
        },
      ]);
    } catch (error: any) {
      const message =
        error.response?.status === 409
          ? 'Bugün için zaten bir günlük girdiniz'
          : 'Günlük kaydedilemedi';
      Alert.alert('Hata', message);
    } finally {
      setLoading(false);
    }
  };

  const charCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header - Sabit */}
      <View style={styles.header}>
        <Text style={styles.title}>Bugünün Günlüğü ✍️</Text>
        <Text style={styles.subtitle}>
          Gününü İngilizce anlat, AI yardımıyla geliştir
        </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Text Area */}
          <View style={styles.section}>
            <Text style={styles.label}>Bugün ne yaptın? (İngilizce)</Text>
            <TextInput
              style={styles.textArea}
              value={text}
              onChangeText={setText}
              placeholder="Today was an incredible day. I woke up early in the morning..."
              multiline
              textAlignVertical="top"
              placeholderTextColor={colors.gray[400]}
            />
            <View style={styles.counters}>
              <Text style={styles.counterText}>{wordCount} kelime</Text>
              <Text
                style={[
                  styles.counterText,
                  (charCount < 50 || charCount > 10000) && styles.counterError,
                ]}
              >
                {charCount} / 10000
              </Text>
            </View>
          </View>

          {/* IELTS Level */}
          <View style={styles.section}>
            <Text style={styles.label}>Hedef IELTS Seviyesi</Text>
            <View style={styles.levelGrid}>
              {[6, 7, 8, 9].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.levelButton,
                    ieltsLevel === level && styles.levelButtonActive,
                  ]}
                  onPress={() => setIeltsLevel(level)}
                >
                  <Text style={styles.levelNumber}>{level}</Text>
                  <Text style={styles.levelLabel}>
                    {level === 6 && 'Basic'}
                    {level === 7 && 'Good'}
                    {level === 8 && 'Very Good'}
                    {level === 9 && 'Expert'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit */}
          <Button
            title="AI ile Dönüştür"
            onPress={handleSubmit}
            loading={loading}
            disabled={charCount < 50 || wordCount < 10}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,  
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[600],
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: 16,
    minHeight: 200,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  counters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  counterText: {
    fontSize: 14,
    color: colors.gray[500],
  },
  counterError: {
    color: colors.red[600],
  },
  levelGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  levelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  levelButtonActive: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  levelLabel: {
    fontSize: 12,
    color: colors.gray[600],
    marginTop: 4,
  },
});