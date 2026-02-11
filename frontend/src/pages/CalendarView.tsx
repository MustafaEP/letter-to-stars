import Layout from '../components/layout/Layout';
import Calendar from '../components/diary/Calendar';
import StatsCards from '../components/diary/StatsCards';

export default function CalendarView() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Yıldız Haritası 🌟
          </h1>
          <p className="text-gray-600">
            Günlük yazma serüvenin ve istatistiklerin
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards />
        </div>

        {/* Calendar */}
        <Calendar />

        {/* Legend */}
        <div className="mt-6 bg-gray-50 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Nasıl Çalışır?
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-primary-50 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-500">⭐</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Yıldız Günü</p>
                <p>Bu günde günlük yazdın! Tıklayarak görüntüleyebilirsin.</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-white border-2 border-primary-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold">10</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Bugün</p>
                <p>Mavi çerçeve bugünün tarihini gösterir.</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 font-bold">🔥</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Ardışık Gün</p>
                <p>
                  Şu an <strong>{/* Dinamik olacak */}</strong> gündür ardışık günlük yazıyorsun!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-purple-50 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold">🏆</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Rekor</p>
                <p>En uzun seride günlük yazma hedefini yakalamaya çalış!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}