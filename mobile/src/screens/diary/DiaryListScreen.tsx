import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { diaryApi } from '../../api/diary.api';
import { Diary } from '../../types/diary.types';
import { RootStackParamList } from '../../navigation/AppNavigator';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Colors nesnesini styles ile birlikte kullanabilmek için tanımladık.
const colors = {
  gray: {
    50: '#f9fafb',
    200: '#e5e7eb',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    900: '#111827',
  },
  white: '#fff',
  black: '#000',
  primary: {
    50: '#e0f2fe',
    100: '#bae6fd',
    700: '#0284c7',
  },
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DiaryListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async (pageNum = 1) => {
    try {
      const response = await diaryApi.getAll(pageNum, 10);
      if (pageNum === 1) {
        setDiaries(response.data);
      } else {
        setDiaries((prev) => [...prev, ...response.data]);
      }
      setHasMore(response.meta.page < response.meta.totalPages);
      setPage(pageNum);
    } catch (error) {
      Alert.alert('Hata', 'Günlükler yüklenemedi');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDiaries(1);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchDiaries(page + 1);
    }
  };

  const handleDiaryPress = (diary: Diary) => {
    const dateString = format(new Date(diary.entryDate), 'yyyy-MM-dd');
    navigation.navigate('DiaryDetail', { date: dateString });
  };

  const renderDiary = ({ item }: { item: Diary }) => (
    <TouchableOpacity
      style={styles.diaryCard}
      onPress={() => handleDiaryPress(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="star" size={20} color={colors.primary[700]} />
          </View>
          <View>
            <Text style={styles.cardTitle}>
              {format(new Date(item.entryDate), 'd MMMM yyyy', { locale: tr })}
            </Text>
            <Text style={styles.cardTime}>
              {format(new Date(item.createdAt), 'HH:mm')}
            </Text>
          </View>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>
            IELTS {item.ieltsLevel}
          </Text>
        </View>
      </View>

      <Text style={styles.cardText} numberOfLines={2}>
        {item.originalText}
      </Text>

      <View style={styles.cardFooter}>
        <Ionicons name="book-outline" size={16} color={colors.gray[600]} />
        <Text style={styles.footerText}>
          {item.newWords.length} yeni kelime
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && page === 1) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Günlüklerim 📖
        </Text>
        <Text style={styles.headerSubtitle}>
          {diaries.length} günlük • {diaries.length} yıldız ⭐
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={diaries}
        renderItem={renderDiary}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={colors.gray[200]} />
            <Text style={styles.emptyText}>
              Henüz günlük yazmadın
            </Text>
            <Text style={styles.emptySubtext}>
              Yeni sekmesinden ilk günlüğünü oluştur
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.gray[600],
  },
  diaryCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: colors.primary[100],
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  cardTime: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
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
  cardText: {
    fontSize: 14,
    color: colors.gray[700],
    marginBottom: 8,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.gray[600],
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray[500],
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray[400],
    marginTop: 8,
    textAlign: 'center',
  },
});