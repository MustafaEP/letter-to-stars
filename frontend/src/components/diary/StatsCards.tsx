import { useEffect, useState } from 'react';
import { Star, Calendar, TrendingUp, Award } from 'lucide-react';
import { diaryApi } from '../../api/diary.api';
import type { DiaryStats } from '../../types/diary.types';

export default function StatsCards() {
  const [stats, setStats] = useState<DiaryStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await diaryApi.getStats();
        setStats(data);
      } catch (err) {
        console.error('İstatistikler yüklenemedi:', err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return null;

  const cards = [
    {
      title: 'Toplam Günlük',
      value: stats.total,
      icon: Star,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      title: 'Bu Ay',
      value: stats.thisMonth,
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Ardışık Gün',
      value: stats.currentStreak,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'En Uzun Seri',
      value: stats.longestStreak,
      icon: Award,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.bg} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}