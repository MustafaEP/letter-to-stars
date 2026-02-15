import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { diaryApi } from '../../api/diary.api';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Button from '../../components/common/Button';
import Starfield from '../../components/common/Starfield';
import CustomAlert from '../../components/common/CustomAlert';
import { colors } from '../../styles/globalStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DiaryCreateScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [text, setText] = useState('');
  const [ieltsLevel, setIeltsLevel] = useState(7);
  const [loading, setLoading] = useState(false);
  
  // Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
    onConfirm?: () => void;
  }>({
    title: '',
    message: '',
    type: 'info',
  });

  const showAlert = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'error' | 'warning',
    onConfirm?: () => void
  ) => {
    setAlertConfig({ title, message, type, onConfirm });
    setAlertVisible(true);
  };

  const handleSubmit = async () => {
    if (text.trim().length < 50) {
      showAlert('Eksik Bilgi', 'Günlük en az 50 karakter olmalıdır', 'warning');
      return;
    }

    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 10) {
      showAlert('Eksik Bilgi', 'Günlük en az 10 kelime içermelidir', 'warning');
      return;
    }

    setLoading(true);
    try {
      const result = await diaryApi.create({
        originalText: text,
        ieltsLevel,
      });

      showAlert('Başarılı', 'Günlük kaydedildi! ✓', 'success', () => {
        const dateString = new Date(result.entryDate)
          .toISOString()
          .split('T')[0];
        navigation.navigate('DiaryDetail', { date: dateString });
        setText('');
      });
    } catch (error: any) {
      const message =
        error.response?.status === 409
          ? 'Bugün için zaten bir günlük girdiniz'
          : 'Günlük kaydedilemedi';
      showAlert('Hata', message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const charCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <View style={styles.container}>
      {/* Starfield Background */}
      <Starfield count={60} />
      
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* Header - Sabit */}
        <View style={styles.header}>
          <Text style={styles.title}>Bugünün Günlüğü</Text>
          <Text style={styles.subtitle}>
            Gününü İngilizce anlat, AI ile yıldızlara ulaş ✨
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
              <View style={styles.glassCard}>
                <Text style={styles.label}>Bugün ne yaptın? (İngilizce)</Text>
                <TextInput
                  style={styles.textArea}
                  value={text}
                  onChangeText={setText}
                  placeholder="Today was an incredible day. I woke up early in the morning..."
                  multiline
                  textAlignVertical="top"
                  placeholderTextColor={colors.gray[500]}
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
            </View>

            {/* IELTS Level */}
            <View style={styles.section}>
              <View style={styles.glassCard}>
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
                      <Text style={[
                        styles.levelNumber,
                        ieltsLevel === level && styles.levelNumberActive
                      ]}>{level}</Text>
                      <Text style={[
                        styles.levelLabel,
                        ieltsLevel === level && styles.levelLabelActive
                      ]}>
                        {level === 6 && 'Basic'}
                        {level === 7 && 'Good'}
                        {level === 8 && 'Very Good'}
                        {level === 9 && 'Expert'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
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

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttons={[
          {
            text: 'Tamam',
            onPress: alertConfig.onConfirm,
          },
        ]}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cosmic.dark,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,  
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary[400],
    marginBottom: 4,
    textShadowColor: colors.primary[400],
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 13,
    color: colors.gray[300],
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray[300],
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 14,
    minHeight: 200,
    fontSize: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    color: colors.gray[100],
  },
  counters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  counterText: {
    fontSize: 12,
    color: colors.gray[400],
  },
  counterError: {
    color: colors.red[400],
  },
  levelGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(10, 14, 39, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 85,
  },
  levelButtonActive: {
    borderColor: colors.primary[400],
    borderWidth: 2,
  },
  levelNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gray[300],
    marginBottom: 4,
  },
  levelNumberActive: {
    color: colors.gray[300],
  },
  levelLabel: {
    fontSize: 11,
    color: colors.gray[500],
    fontWeight: '600',
    textAlign: 'center',
  },
  levelLabelActive: {
    color: colors.gray[500],
  },
});