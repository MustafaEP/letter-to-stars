import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { diaryApi } from '../api/diary.api';
import type { DiaryListResponse } from '../types/diary.types';
import Layout from '../components/layout/Layout';
import { 
  Calendar, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Loader2,
  Star
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
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Günlüklerim 📖
            </h1>
            <p className="text-gray-600">
              {data?.meta.total || 0} günlük • {data?.meta.total || 0} yıldız ⭐
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
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Star className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Henüz günlük yazmadın
            </h3>
            <p className="text-gray-600 mb-6">
              İlk günlüğünü yaz ve yıldız toplamaya başla!
            </p>
            <button
              onClick={() => navigate('/diary')}
              className="btn-primary"
            >
              Hemen Başla
            </button>
          </div>
        )}

        {/* Diary List */}
        {data && data.data.length > 0 && (
          <>
            <div className="space-y-4">
              {data.data.map((diary) => (
                <div
                  key={diary.id}
                  onClick={() => {
                    const dateString = new Date(diary.entryDate)
                      .toISOString()
                      .split('T')[0];
                    navigate(`/diary/${dateString}`);
                  }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Star className="w-6 h-6 text-primary-600 fill-primary-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {format(new Date(diary.entryDate), 'd MMMM yyyy', { locale: tr })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {format(new Date(diary.createdAt), 'HH:mm', { locale: tr })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 bg-primary-50 rounded-full">
                      <TrendingUp className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-medium text-primary-700">
                        IELTS {diary.ieltsLevel}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 line-clamp-2 mb-3">
                    {diary.originalText}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{diary.newWords.length} yeni kelime</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="px-4 py-2 text-sm text-gray-600">
                  {currentPage} / {data.meta.totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(data.meta.totalPages, p + 1))}
                  disabled={currentPage === data.meta.totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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