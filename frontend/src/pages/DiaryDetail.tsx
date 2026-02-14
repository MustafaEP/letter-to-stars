import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { diaryApi } from '../api/diary.api';
import type { Diary } from '../types/diary.types';
import Layout from '../components/layout/Layout';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Calendar, 
  TrendingUp, 
  BookOpen,
  Loader2,
  Trash2,
  Upload,
  AlertCircle, 
} from 'lucide-react';

export default function DiaryDetail() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDiary = async () => {
      if (!date) return;

      try {
        setIsLoading(true);
        const data = await diaryApi.getByDate(date);
        setDiary(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Günlük yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiary();
  }, [date]);

  // Resim yükle
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!diary) return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Dosya boyutu 10MB\'dan küçük olmalıdır');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const updated = await diaryApi.uploadImage(diary.id, file);
      setDiary(updated);
      toast.success('Resim eklendi 📸');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Resim yüklenemedi';
      setError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  // Resim sil
  const handleRemoveImage = async () => {
    if (!diary) return;
    if (!confirm('Resmi silmek istediğinizden emin misiniz?')) return;

    try {
      setIsDeleting(true);
      const updated = await diaryApi.removeImage(diary.id);
      setDiary(updated);
      toast.success('Resim silindi');
    } catch (err: any) {
      toast.error('Resim silinemedi');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </Layout>
    );
  }

  if (error || !diary) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Günlük bulunamadı'}</p>
          <button
            onClick={() => navigate('/diary/list')}
            className="mt-4 btn-primary"
          >
            Geri Dön
          </button>
        </div>
      </Layout>
    );
  }

  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/diary/list')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Geri</span>
          </button>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(diary.entryDate).toLocaleDateString('tr-TR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>IELTS {diary.ieltsLevel}</span>
            </div>
          </div>
        </div>
        {/* Error Alert */}
        {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
        </div>
        )}
        {/* Image Section */}
        {diary.imageUrl ? (
          <div className="mb-8 relative group">
            <img
              src={`${API_BASE_URL}${diary.imageUrl}`}
              alt="Diary"
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
            <button
              onClick={handleRemoveImage}
              disabled={isDeleting}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          </div>
        ) : (
          // Resim yoksa upload butonu
          <div className="mb-8">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-3" />
                    <p className="text-sm text-gray-600">Resim yükleniyor...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-600">
                      <span className="font-semibold">Bu günlüğe fotoğraf ekle</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF (max. 10MB)</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
        )}

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Original Text */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Senin Yazdığın
              </h2>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {diary.originalText}
            </p>
          </div>

          {/* AI Rewritten Text */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl shadow-sm border border-primary-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                AI Dönüşümü (IELTS {diary.ieltsLevel})
              </h2>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">
              {diary.rewrittenText}
            </p>
          </div>
        </div>

        {/* New Words */}
        {diary.newWords.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Yeni Kelimeler 📚 ({diary.newWords.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {diary.newWords.map((word, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="font-semibold text-primary-700 mb-1">
                    {word.english_word}
                  </div>
                  <div className="text-sm text-gray-600">
                    {word.turkish_meaning}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}