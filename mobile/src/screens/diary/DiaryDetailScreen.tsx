import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../../components/common/AppLogo';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { diaryApi } from '../../api/diary.api';
import { Diary } from '../../types/diary.types';
import { RootStackParamList } from '../../navigation/AppNavigator';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Starfield from '../../components/common/Starfield';
import CustomAlert from '../../components/common/CustomAlert';
import { colors } from '../../styles/globalStyles';

type DiaryDetailRouteProp = RouteProp<RootStackParamList, 'DiaryDetail'>;

export default function DiaryDetailScreen() {
  const route = useRoute<DiaryDetailRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { date } = route.params;
  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    fetchDiary();
  }, [date]);

  const fetchDiary = async () => {
    try {
      const data = await diaryApi.getByDate(date);
      setDiary(data);
    } catch (error) {
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!diary) {
    return (
      <View style={styles.container}>
        <Starfield count={60} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerContent}>
            <View style={styles.notFoundIconContainer}>
              <AppLogo size={64} />
            </View>
            <Text style={styles.notFoundText}>Günlük bulunamadı</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Starfield count={60} />
      
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {/* Header - Fixed */}
        <View style={[styles.headerContainer, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.gray[100]} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Günlük Detay</Text>
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color={colors.primary[400]} />
              <Text style={styles.dateText}>
                {format(new Date(diary.entryDate), 'd MMMM yyyy', { locale: tr })}
              </Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>IELTS {diary.ieltsLevel}</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Content */}
          <View style={styles.content}>
            {/* Original Text */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="create-outline" size={20} color={colors.gray[400]} />
                <Text style={styles.cardTitle}>Senin Yazdığın</Text>
              </View>
              <Text style={styles.cardText}>{diary.originalText}</Text>
            </View>

            {/* AI Rewritten */}
            <View style={[styles.card, styles.aiCard]}>
              <View style={styles.cardHeader}>
                <Ionicons name="sparkles" size={20} color={colors.primary[400]} />
                <Text style={styles.cardTitle}>AI Dönüşümü (IELTS {diary.ieltsLevel})</Text>
              </View>
              <Text style={styles.aiText}>{diary.rewrittenText}</Text>
            </View>

            {/* New Words */}
            {diary.newWords.length > 0 && (
              <View style={styles.card}>
                <View style={styles.wordsHeader}>
                  <Ionicons name="sparkles" size={20} color={colors.primary[400]} />
                  <Text style={styles.wordsTitle}>
                    Yeni Kelimeler ({diary.newWords.length})
                  </Text>
                </View>
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

      {/* Error Alert */}
      <CustomAlert
        visible={alertVisible}
        title="Hata"
        message="Günlük yüklenemedi"
        type="error"
        buttons={[{ text: 'Tamam' }]}
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
  scrollView: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundIconContainer: {
    marginBottom: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.gray[300],
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: colors.cosmic.dark,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[100],
    flex: 1,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  dateText: {
    fontSize: 13,
    color: colors.gray[300],
    marginLeft: 6,
    fontWeight: '500',
  },
  levelBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary[400],
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  aiCard: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[100],
    marginLeft: 8,
  },
  cardText: {
    fontSize: 14,
    color: colors.gray[300],
    lineHeight: 21,
  },
  aiText: {
    fontSize: 14,
    color: colors.gray[100],
    lineHeight: 21,
    fontWeight: '500',
  },
  wordsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wordsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[100],
    marginLeft: 8,
  },
  wordsContainer: {
    gap: 10,
  },
  wordCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  wordEnglish: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[400],
    marginBottom: 4,
  },
  wordTurkish: {
    fontSize: 13,
    color: colors.gray[400],
  },
});