import Layout from '../components/layout/Layout';
import Calendar from '../components/diary/Calendar';
import StatsCards from '../components/diary/StatsCards';
import { Sparkles } from 'lucide-react';

export default function CalendarView() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse-glow" />
            <h1 className="text-4xl font-bold text-cosmic-gradient glow-ice">
              Yıldız Haritası
            </h1>
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse-glow" />
          </div>
          <p className="text-gray-300 text-lg">
            Günlük yazma serüvenin ve yıldız toplama yolculuğun
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards />
        </div>

        {/* Calendar */}
        <Calendar />

        {/* Legend */}
        <div className="glass-card mt-8 p-6">
          <h3 className="text-sm font-bold text-gray-100 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Nasıl Çalışır?
          </h3>
          <div className="grid sm:grid-cols-2 gap-5 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/30">
                <span className="text-xl">⭐</span>
              </div>
              <div>
                <p className="font-bold text-cyan-400 mb-1">Yıldız Günü</p>
                <p className="text-gray-400">Bu günde günlük yazdın! Tıklayarak görüntüleyebilirsin.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/10 border-2 border-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-cyan-400">10</span>
              </div>
              <div>
                <p className="font-bold text-cyan-400 mb-1">Bugün</p>
                <p className="text-gray-400">Mavi çerçeve bugünün tarihini gösterir.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-green-400/30">
                <span className="text-green-400 text-xl font-bold">🔥</span>
              </div>
              <div>
                <p className="font-bold text-cyan-400 mb-1">Ardışık Gün</p>
                <p className="text-gray-400">
                  Her gün günlük yazarak seriyi devam ettir!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-purple-400/30">
                <span className="text-purple-400 text-xl font-bold">🏆</span>
              </div>
              <div>
                <p className="font-bold text-cyan-400 mb-1">Rekor</p>
                <p className="text-gray-400">En uzun seride günlük yazma hedefini yakalamaya çalış!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}