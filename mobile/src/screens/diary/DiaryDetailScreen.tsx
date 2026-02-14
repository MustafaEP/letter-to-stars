import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { diaryApi } from '../../api/diary.api';
import { Diary } from '../../types/diary.types';
import { RootStackParamList } from '../../navigation/AppNavigator';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { colors } from '../../styles/globalStyles';

type DiaryDetailRouteProp = RouteProp<RootStackParamList, 'DiaryDetail'>;

export default function DiaryDetailScreen() {
  const route = useRoute<DiaryDetailRouteProp>();
  const { date } = route.params;
  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiary();
  }, [date]);

  const fetchDiary = async () => {
    try {
      const data = await diaryApi.getByDate(date);
      setDiary(data);
    } catch (error) {
      Alert.alert('Hata', 'Günlük yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!diary) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.notFoundText}>Günlük bulunamadı</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Ionicons name="calendar-outline" size={20} color={colors.gray[600]} />
              <Text style={styles.dateText}>
                {format(new Date(diary.entryDate), 'd MMMM yyyy', { locale: tr })}
              </Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>IELTS {diary.ieltsLevel}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Original Text */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="create-outline" size={20} color={colors.gray[600]} />
              <Text style={styles.cardTitle}>Senin Yazdığın</Text>
            </View>
            <Text style={styles.cardText}>{diary.originalText}</Text>
          </View>

          {/* AI Rewritten */}
          <View style={[styles.card, styles.aiCard]}>
            <View style={styles.cardHeader}>
              <Ionicons name="sparkles-outline" size={20} color={colors.primary[600]} />
              <Text style={styles.cardTitle}>AI Dönüşümü (IELTS {diary.ieltsLevel})</Text>
            </View>
            <Text style={styles.aiText}>{diary.rewrittenText}</Text>
          </View>

          {/* New Words */}
          {diary.newWords.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.wordsTitle}>
                Yeni Kelimeler 📚 ({diary.newWords.length})
              </Text>
              <View style={styles.wordsContainer}>
                {diary.newWords.map((word, index) => (
                  <View key={index} style={styles.wordCard}>
                    <Text style={styles.wordEnglish}>{word.english_word}</Text>
                    <Text style={styles.wordTurkish}>{word.turkish_meaning}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollView: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: colors.gray[500],
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: colors.gray[600],
    marginLeft: 8,
  },
  levelBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary[700],
  },
  content: {
    padding: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  aiCard: {
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginLeft: 8,
  },
  cardText: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 22,
  },
  aiText: {
    fontSize: 14,
    color: colors.gray[800],
    lineHeight: 22,
    fontWeight: '500',
  },
  wordsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 12,
  },
  wordsContainer: {
    gap: 12,
  },
  wordCard: {
    backgroundColor: colors.gray[50],
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  wordEnglish: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[700],
    marginBottom: 4,
  },
  wordTurkish: {
    fontSize: 14,
    color: colors.gray[600],
  },
});