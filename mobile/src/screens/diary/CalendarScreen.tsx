import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { diaryApi } from '../../api/diary.api';
import { DiaryStats } from '../../types/diary.types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { colors } from '../../styles/globalStyles';

export default function CalendarScreen() {
  const [stats, setStats] = useState<DiaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await diaryApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Stats error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Yıldız Haritası 🌟</Text>
          <Text style={styles.subtitle}>
            Günlük yazma serüvenin ve istatistiklerin
          </Text>
        </View>

        {/* Stats Cards */}
        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              {/* Toplam */}
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name="star" size={24} color={colors.yellow[500]} />
                  <Text style={styles.statValue}>{stats.total}</Text>
                </View>
                <Text style={styles.statLabel}>Toplam Günlük</Text>
              </View>

              {/* Bu Ay */}
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name="calendar" size={24} color={colors.blue[500]} />
                  <Text style={styles.statValue}>{stats.thisMonth}</Text>
                </View>
                <Text style={styles.statLabel}>Bu Ay</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              {/* Ardışık Gün */}
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name="flame" size={24} color={colors.green[500]} />
                  <Text style={styles.statValue}>{stats.currentStreak}</Text>
                </View>
                <Text style={styles.statLabel}>Ardışık Gün</Text>
              </View>

              {/* En Uzun Seri */}
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name="trophy" size={24} color={colors.purple[600]} />
                  <Text style={styles.statValue}>{stats.longestStreak}</Text>
                </View>
                <Text style={styles.statLabel}>En Uzun Seri</Text>
              </View>
            </View>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 Takvim Görünümü Yakında</Text>
            <Text style={styles.infoText}>
              Günlük yazdığın günleri takvimde görebileceğin özel görünüm
              üzerinde çalışıyoruz!
            </Text>
          </View>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[600],
  },
  statsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[600],
  },
  infoContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  infoCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
});