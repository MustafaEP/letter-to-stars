import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
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
import Starfield from '../../components/common/Starfield';
import CustomAlert from '../../components/common/CustomAlert';
import { colors } from '../../styles/globalStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DiaryListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);

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
      setAlertVisible(true);
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
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="star" size={18} color={colors.primary[400]} />
          </View>
          <View style={styles.cardTitleContainer}>
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

      <Text style={styles.cardText} numberOfLines={3}>
        {item.originalText}
      </Text>

      <View style={styles.cardFooter}>
        <Ionicons name="sparkles" size={14} color={colors.primary[400]} />
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
    <View style={styles.container}>
      {/* Starfield Background */}
      <Starfield count={60} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="star" size={40} color={colors.primary[400]} />
          </View>
          <Text style={styles.headerTitle}>
            Günlüklerim
          </Text>
          <Text style={styles.headerSubtitle}>
            {diaries.length} günlük • {diaries.length} yıldız
          </Text>
        </View>

        {/* List */}
        <FlatList
          data={diaries}
          renderItem={renderDiary}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={colors.primary[400]}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="star-outline" size={64} color={colors.primary[400]} />
              </View>
              <Text style={styles.emptyText}>
                Henüz günlük yazmadın
              </Text>
              <Text style={styles.emptySubtext}>
                İlk günlüğünü yaz ve yıldızlar arasında yerini al!
              </Text>
            </View>
          }
        />
      </SafeAreaView>

      {/* Error Alert */}
      <CustomAlert
        visible={alertVisible}
        title="Hata"
        message="Günlükler yüklenemedi"
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  headerIconContainer: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary[400],
    marginBottom: 4,
    textShadowColor: colors.primary[400],
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.gray[300],
  },
  diaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 8,
  },
  iconContainer: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[100],
    marginBottom: 2,
  },
  cardTime: {
    fontSize: 13,
    color: colors.gray[400],
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
  cardText: {
    fontSize: 13,
    color: colors.gray[300],
    marginBottom: 10,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerText: {
    fontSize: 13,
    color: colors.gray[400],
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[200],
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 15,
    color: colors.gray[400],
    textAlign: 'center',
  },
});