import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from 'date-fns';
import { tr } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { diaryApi } from '../../api/diary.api';
import { CalendarEntry } from '../../types/diary.types';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { colors } from '../../styles/globalStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Calendar() {
  const navigation = useNavigation<NavigationProp>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<CalendarEntry[]>([]);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const data = await diaryApi.getCalendar(year, month);
        setEntries(data);
      } catch (error) {
        console.error('Takvim yüklenemedi:', error);
      }
    };

    fetchCalendar();
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 0=Pazar, 6=Cumartesi -> bizde hafta Pazartesi başlıyor
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const hasEntry = (day: Date) => {
    return entries.some((entry) => isSameDay(new Date(entry.entryDate), day));
  };

  const handleDayPress = (day: Date) => {
    const entry = entries.find((e) => isSameDay(new Date(e.entryDate), day));
    if (!entry) return;

    const dateString = format(day, 'yyyy-MM-dd');
    navigation.navigate('DiaryDetail', { date: dateString });
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  // Takvim gridini doldurmak için padding + gerçek günler
  const calendarCells = [
    ...Array.from({ length: paddingDays }).map(() => null),
    ...daysInMonth,
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {format(currentDate, 'MMMM yyyy', { locale: tr })}
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={previousMonth}
            style={styles.navButton}
            activeOpacity={0.8}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={colors.gray[300]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={nextMonth}
            style={styles.navButton}
            activeOpacity={0.8}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.gray[300]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekdays */}
      <View style={styles.weekdaysRow}>
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
          <View key={day} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.grid}>
        {calendarCells.map((day, index) => {
          if (!day) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const hasDiary = hasEntry(day);
          const isCurrentDay = isToday(day);

          return (
            <TouchableOpacity
              key={day.toISOString()}
              style={[
                styles.dayCell,
                hasDiary ? styles.dayWithDiary : styles.dayEmpty,
                isCurrentDay && styles.dayToday,
              ]}
              activeOpacity={hasDiary ? 0.8 : 1}
              onPress={() => hasDiary && handleDayPress(day)}
            >
              <Text
                style={[
                  styles.dayText,
                  hasDiary ? styles.dayTextWithDiary : styles.dayTextEmpty,
                ]}
              >
                {format(day, 'd')}
              </Text>

              {hasDiary && <Text style={styles.star}>⭐</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotDiary]} />
          <Text style={styles.legendText}>Günlük yazdığın günler</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotToday]} />
          <Text style={styles.legendText}>Bugün</Text>
        </View>
      </View>
    </View>
  );
}

const CELL_SIZE = `${100 / 7}%`;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[100],
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.6)',
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekdayCell: {
    width: CELL_SIZE,
    alignItems: 'center',
    paddingVertical: 4,
  },
  weekdayText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary[400],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: CELL_SIZE,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayEmpty: {
    borderColor: 'rgba(15, 23, 42, 0.8)',
  },
  dayWithDiary: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderColor: 'rgba(56, 189, 248, 0.6)',
  },
  dayToday: {
    shadowColor: colors.primary[400],
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  dayText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dayTextEmpty: {
    color: colors.gray[500],
  },
  dayTextWithDiary: {
    color: colors.gray[50],
  },
  star: {
    fontSize: 11,
    marginTop: 2,
  },
  legendContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 6,
  },
  legendDotDiary: {
    backgroundColor: 'rgba(56, 189, 248, 0.8)',
  },
  legendDotToday: {
    backgroundColor: 'rgba(251, 191, 36, 0.9)',
  },
  legendText: {
    fontSize: 11,
    color: colors.gray[300],
  },
});

