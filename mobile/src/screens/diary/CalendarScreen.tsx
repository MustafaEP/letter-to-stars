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
import Starfield from '../../components/common/Starfield';
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
    <View style={styles.container}>
      {/* Starfield Background */}
      <Starfield count={60} />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={colors.primary[400]}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Ionicons name="star" size={40} color={colors.primary[400]} />
            </View>
            <Text style={styles.title}>Yıldız Haritası</Text>
            <Text style={styles.subtitle}>
              Günlük yazma serüvenin ve yıldız toplama yolculuğun
            </Text>
          </View>

          {/* Stats Cards */}
          {stats && (
            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                {/* Toplam */}
                <View style={[styles.statCard, styles.statCardYellow]}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="star" size={28} color={colors.primary[400]} />
                  </View>
                  <Text style={styles.statValue}>{stats.total}</Text>
                  <Text style={styles.statLabel}>Toplam Günlük</Text>
                </View>

                {/* Bu Ay */}
                <View style={[styles.statCard, styles.statCardBlue]}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="calendar" size={28} color={colors.blue[500]} />
                  </View>
                  <Text style={styles.statValue}>{stats.thisMonth}</Text>
                  <Text style={styles.statLabel}>Bu Ay</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                {/* Ardışık Gün */}
                <View style={[styles.statCard, styles.statCardGreen]}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="flame" size={28} color={colors.green[400]} />
                  </View>
                  <Text style={styles.statValue}>{stats.currentStreak}</Text>
                  <Text style={styles.statLabel}>Ardışık Gün</Text>
                </View>

                {/* En Uzun Seri */}
                <View style={[styles.statCard, styles.statCardPurple]}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="trophy" size={28} color={colors.purple[400]} />
                  </View>
                  <Text style={styles.statValue}>{stats.longestStreak}</Text>
                  <Text style={styles.statLabel}>En Uzun Seri</Text>
                </View>
              </View>
            </View>
          )}

          {/* Info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>💡</Text>
              <Text style={styles.infoTitle}>Takvim Görünümü Yakında</Text>
              <Text style={styles.infoText}>
                Günlük yazdığın günleri takvimde görebileceğin özel görünüm
                üzerinde çalışıyoruz!
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerIconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary[400],
    marginBottom: 8,
    textShadowColor: colors.primary[400],
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 13,
    color: colors.gray[300],
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  statCardYellow: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  statCardBlue: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  statCardGreen: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  statCardPurple: {
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.gray[100],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.gray[400],
    fontWeight: '500',
    textAlign: 'center',
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  infoCard: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary[400],
    marginBottom: 6,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 13,
    color: colors.gray[300],
    lineHeight: 19,
    textAlign: 'center',
  },
});