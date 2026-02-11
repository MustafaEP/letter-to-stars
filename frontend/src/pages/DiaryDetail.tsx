import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { diaryApi } from '../api/diary.api';
import type { Diary } from '../types/diary.types';
import Layout from '../components/layout/Layout';
import { 
    ArrowLeft, 
    Calendar, 
    TrendingUp, 
    BookOpen,
    Loader2 
} from 'lucide-react';

export default function DiaryDetail() {
    const { date } = useParams<{ date: string }>();
    const navigate = useNavigate();
    const [diary, setDiary] = useState<Diary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
                onClick={() => navigate('/diary')}
                className="mt-4 btn-primary"
            >
                Geri Dön
            </button>
            </div>
        </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/diary')}
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