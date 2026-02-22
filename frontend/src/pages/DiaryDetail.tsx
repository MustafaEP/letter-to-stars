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
  CheckCircle2,
  XCircle,
  Lightbulb,
  Target,
  TrendingDown,
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
        <div className="grid md:grid-cols-1 gap-6 mb-6">
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

        {/* Grammar Corrections */}
        {diary.grammarCorrections && diary.grammarCorrections.length > 0 && (
          <div className="glass-card p-6 mb-6 bg-gradient-to-br from-red-500/5 to-rose-500/5 border-red-400/20">
            <h3 className="font-semibold text-gray-100 mb-5 flex items-center gap-2">
              <div className="p-1.5 bg-red-500/20 rounded-lg">
                <XCircle className="w-4 h-4 text-red-400" />
              </div>
              Gramer Düzeltmeleri
              <span className="ml-auto text-xs text-red-400/70 bg-red-500/10 px-2 py-1 rounded-full border border-red-400/20">
                {diary.grammarCorrections.length} düzeltme
              </span>
            </h3>
            <div className="space-y-4">
              {diary.grammarCorrections.map((correction, idx) => (
                <div key={idx} className="border-l-2 border-red-400/40 pl-4 py-2">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-red-400 font-mono text-sm bg-red-500/10 border border-red-400/20 px-2.5 py-1 rounded-lg line-through">
                      {correction.original}
                    </span>
                    <span className="text-gray-500">→</span>
                    <span className="text-emerald-400 font-mono text-sm bg-emerald-500/10 border border-emerald-400/20 px-2.5 py-1 rounded-lg">
                      {correction.corrected}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-yellow-400/70 flex-shrink-0 mt-0.5" />
                    {correction.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Writing Tips */}
        {diary.writingTips && diary.writingTips.length > 0 && (
          <div className="glass-card p-6 mb-6 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-400/20">
            <h3 className="font-semibold text-gray-100 mb-5 flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/20 rounded-lg">
                <Lightbulb className="w-4 h-4 text-blue-400" />
              </div>
              Yazma Tavsiyeleri
            </h3>
            <ul className="space-y-3">
              {diary.writingTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 group">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-xs text-blue-400 font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-gray-300 text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Strengths & Weaknesses */}
        {((diary.strengths && diary.strengths.length > 0) || (diary.weaknesses && diary.weaknesses.length > 0)) && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {diary.strengths && diary.strengths.length > 0 && (
              <div className="glass-card p-6 bg-gradient-to-br from-emerald-500/5 to-green-500/5 border-emerald-400/20">
                <h3 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  Güçlü Yönlerin
                </h3>
                <ul className="space-y-2.5">
                  {diary.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400/70 mt-2" />
                      <span className="text-sm text-gray-300 leading-relaxed">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {diary.weaknesses && diary.weaknesses.length > 0 && (
              <div className="glass-card p-6 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-400/20">
                <h3 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500/20 rounded-lg">
                    <TrendingDown className="w-4 h-4 text-amber-400" />
                  </div>
                  Gelişim Alanları
                </h3>
                <ul className="space-y-2.5">
                  {diary.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400/70 mt-2" />
                      <span className="text-sm text-gray-300 leading-relaxed">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Overall Feedback */}
        {diary.overallFeedback && (
          <div className="glass-card p-6 mb-6 bg-gradient-to-br from-violet-500/5 to-purple-500/5 border-violet-400/20">
            <h3 className="font-semibold text-gray-100 mb-3 flex items-center gap-2">
              <div className="p-1.5 bg-violet-500/20 rounded-lg">
                <Target className="w-4 h-4 text-violet-400" />
              </div>
              Genel Değerlendirme
            </h3>
            <p className="text-gray-300 leading-relaxed">{diary.overallFeedback}</p>
          </div>
        )}
        {/* New Words */}
        {diary.newWords.length > 0 && (
          <div className="glass-card p-6 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-400/20">
            <h2 className="text-lg font-bold text-gray-100 mb-5 flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500/20 rounded-lg">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              Yeni Kelimeler
              <span className="ml-auto text-xs text-cyan-400/70 bg-cyan-500/10 px-2 py-1 rounded-full border border-cyan-400/20">
                {diary.newWords.length} kelime
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {diary.newWords.map((word, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-500/5 transition-all duration-200"
                >
                  <div className="font-bold text-cyan-400 mb-1.5 text-sm">
                    {word.english_word}
                  </div>
                  <div className="text-xs text-gray-400">
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