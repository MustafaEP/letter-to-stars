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
      color: 'text-cyan-400',
      bg: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-400/30',
      glow: 'shadow-cyan-500/20',
    },
    {
      title: 'Bu Ay',
      value: stats.thisMonth,
      icon: Calendar,
      color: 'text-blue-400',
      bg: 'from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-400/30',
      glow: 'shadow-blue-500/20',
    },
    {
      title: 'Ardışık Gün',
      value: stats.currentStreak,
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-400/30',
      glow: 'shadow-green-500/20',
    },
    {
      title: 'En Uzun Seri',
      value: stats.longestStreak,
      icon: Award,
      color: 'text-purple-400',
      bg: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-400/30',
      glow: 'shadow-purple-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`glass-card p-6 bg-gradient-to-br ${card.bg} border ${card.border} hover:scale-105 transition-all duration-300 ${card.glow} shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">{card.title}</p>
                <p className="text-4xl font-bold text-gray-100">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-white/10`}>
                <Icon className={`w-7 h-7 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}