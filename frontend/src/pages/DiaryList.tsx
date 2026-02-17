import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { diaryApi } from '../api/diary.api';
import type { DiaryListResponse } from '../types/diary.types';
import Layout from '../components/layout/Layout';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Star,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function DiaryList() {
  const navigate = useNavigate();
  const [data, setData] = useState<DiaryListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setIsLoading(true);
        const response = await diaryApi.getAll(currentPage, 10);
        setData(response);
      } catch (err) {
        console.error('Günlükler yüklenemedi:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiaries();
  }, [currentPage]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <LoadingSkeleton />
        </div>
      </Layout>
    );
  }

  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-cosmic-gradient mb-3 glow-ice">
              Günlüklerim
            </h1>
            <p className="text-gray-300 text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-cyan-400" fill="currentColor" />
              {data?.meta.total || 0} günlük • {data?.meta.total || 0} yıldız
            </p>
          </div>

          <button
            onClick={() => navigate('/diary')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Günlük</span>
          </button>
        </div>

        {/* Empty State */}
        {data && data.data.length === 0 && (
          <div className="glass-card text-center py-16 px-6">
            <div className="relative inline-block mb-6">
              <Star className="w-20 h-20 text-cyan-400 animate-float" fill="currentColor" />
              <div className="absolute inset-0 blur-2xl bg-cyan-400/30"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-100 mb-3">
              Henüz günlük yazmadın
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              İlk günlüğünü yaz ve yıldızlar arasında yerini al!
            </p>
            <button
              onClick={() => navigate('/diary')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Hemen Başla
            </button>
          </div>
        )}

        {/* Diary List */}
        {data && data.data.length > 0 && (
          <>
            <div className="space-y-5">
              {data.data.map((diary) => (
                <div
                  key={diary.id}
                  onClick={() => {
                    const dateString = new Date(diary.entryDate)
                      .toISOString()
                      .split('T')[0];
                    navigate(`/diary/${dateString}`);
                  }}
                  className="glass-card p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                    {/* Image Thumbnail */}
                    {diary.imageUrl ? (
                      <div className="w-full h-48 md:w-40 md:h-40 flex-shrink-0">
                        <img
                          src={`${API_BASE_URL}${diary.imageUrl}`}
                          alt="Diary"
                          className="w-full h-full object-cover rounded-xl border border-white/10 group-hover:border-cyan-400/30 transition-colors"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 md:w-40 md:h-40 flex-shrink-0 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center group-hover:border-cyan-400/30 transition-colors">
                        <ImageIcon className="w-16 h-16 text-gray-600" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-cyan-400/30">
                            <Star className="w-6 h-6 text-cyan-400" fill="currentColor" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-100 text-lg">
                              {format(new Date(diary.entryDate), 'd MMMM yyyy', { locale: tr })}
                            </div>
                            <div className="text-sm text-gray-400">
                              {format(new Date(diary.createdAt), 'HH:mm', { locale: tr })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-400/30">
                          <TrendingUp className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm font-bold text-cyan-400">
                            IELTS {diary.ieltsLevel}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 line-clamp-2 mb-4 leading-relaxed">
                        {diary.originalText}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                          <span>{diary.newWords.length} yeni kelime</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="px-6 py-3 glass-card text-sm text-gray-300 font-medium">
                  {currentPage} / {data.meta.totalPages}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(data.meta.totalPages, p + 1))}
                  disabled={currentPage === data.meta.totalPages}
                  className="p-3 rounded-xl btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}