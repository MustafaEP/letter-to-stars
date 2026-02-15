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
  Sparkles,
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
          <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
        </div>
      </Layout>
    );
  }

  if (error || !diary) {
    return (
      <Layout>
        <div className="glass-card text-center py-12 px-6">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg mb-6">{error || 'Günlük bulunamadı'}</p>
          <button
            onClick={() => navigate('/diary/list')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
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
            className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Geri</span>
          </button>

          <div className="flex items-center gap-4 text-sm">
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-300">{new Date(diary.entryDate).toLocaleDateString('tr-TR')}</span>
            </div>
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-bold">IELTS {diary.ieltsLevel}</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Image Section */}
        {diary.imageUrl ? (
          <div className="mb-8 relative group">
            <img
              src={`${API_BASE_URL}${diary.imageUrl}`}
              alt="Diary"
              className="w-full h-96 object-cover rounded-2xl border border-white/10"
            />
            <button
              onClick={handleRemoveImage}
              disabled={isDeleting}
              className="absolute top-4 right-4 p-3 bg-red-500/90 backdrop-blur-sm text-white rounded-xl hover:bg-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-50"
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
            <label className="glass-card flex flex-col items-center justify-center w-full h-64 cursor-pointer hover:bg-white/10 transition-all duration-300 border border-white/10 border-dashed rounded-2xl">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-3" />
                    <p className="text-sm text-gray-300">Resim yükleniyor...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-cyan-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-300">
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
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-bold text-gray-100">
                Senin Yazdığın
              </h2>
            </div>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {diary.originalText}
            </p>
          </div>

          {/* AI Rewritten Text */}
          <div className="glass-card p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-400/30">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-cyan-400">
                AI Dönüşümü (IELTS {diary.ieltsLevel})
              </h2>
            </div>
            <p className="text-gray-100 whitespace-pre-wrap leading-relaxed font-medium">
              {diary.rewrittenText}
            </p>
          </div>
        </div>

        {/* New Words */}
        {diary.newWords.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-gray-100 mb-5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Yeni Kelimeler ({diary.newWords.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {diary.newWords.map((word, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-colors"
                >
                  <div className="font-bold text-cyan-400 mb-1">
                    {word.english_word}
                  </div>
                  <div className="text-sm text-gray-400">
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