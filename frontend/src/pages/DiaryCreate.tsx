import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { diaryApi } from '../api/diary.api';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import Layout from '../components/layout/Layout';

// Validation schema - z.coerce kullan
const diarySchema = z.object({
    originalText: z
        .string()
        .min(50, 'Günlük en az 50 karakter olmalıdır')
        .max(10000, 'Günlük en fazla 10000 karakter olabilir'),
    ieltsLevel: z.coerce.number().min(6).max(9),  
});

type DiaryFormData = z.infer<typeof diarySchema>;

export default function DiaryCreate() {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<DiaryFormData>({
        resolver: zodResolver(diarySchema),
        defaultValues: {
        ieltsLevel: 7,
        },
    });

    const originalText = watch('originalText', '');
    const ieltsLevel = watch('ieltsLevel');
    const charCount = originalText.length;

    const onSubmit = async (data: DiaryFormData) => {
        
        setError('');
        setIsLoading(true);
    
        try {
            const result = await diaryApi.create(data);
        
            // Detay sayfasına yönlendir
            const dateString = new Date(result.entryDate).toISOString().split('T')[0];
            navigate(`/diary/${dateString}`);
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError('Bugün için zaten bir günlük girdiniz');
            } else {
                setError(err.response?.data?.message || 'Bir hata oluştu');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Bugünün Günlüğü ✍️
                    </h1>
                    <p className="text-gray-600">
                        Gününü İngilizce anlat, AI yardımıyla geliştir
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Text Area */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bugün ne yaptın? (İngilizce)
                    </label>
                    <textarea
                        {...register('originalText')}
                        rows={12}
                        className="input-field resize-none font-mono"
                        placeholder="Today was an incredible day. I woke up early in the morning and decided to go for a run in the park..."
                        disabled={isLoading}
                    />
                    <div className="flex justify-between items-center mt-2">
                        {errors.originalText && (
                            <p className="text-sm text-red-600">{errors.originalText.message}</p>
                        )}
                        <p
                            className={`text-sm ml-auto ${
                            charCount < 50
                                ? 'text-red-600'
                                : charCount > 10000
                                ? 'text-red-600'
                                : 'text-gray-500'
                            }`}
                        >
                            {charCount} / 10000 karakter
                        </p>
                    </div>
                </div>

                {/* IELTS Level Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hedef IELTS Seviyesi
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                        {[6, 7, 8, 9].map((level) => (
                            <label
                            key={level}
                            className={`
                                relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                                ${
                                Number(ieltsLevel) === level
                                    ? 'border-primary-600 bg-primary-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }
                            `}
                            >
                            <input
                                {...register('ieltsLevel')}
                                type="radio"
                                value={level}
                                className="sr-only"
                                disabled={isLoading}
                            />
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{level}</div>
                                <div className="text-xs text-gray-600 mt-1">
                                {level === 6 && 'Basic'}
                                {level === 7 && 'Good'}
                                {level === 8 && 'Very Good'}
                                {level === 9 && 'Expert'}
                                </div>
                            </div>
                            </label>
                        ))}
                    </div>
                    {errors.ieltsLevel && (
                        <p className="text-sm text-red-600 mt-2">{errors.ieltsLevel.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>AI İşliyor...</span>
                    </>
                    ) : (
                    <>
                        <Sparkles className="w-5 h-5" />
                        <span>AI ile Dönüştür</span>
                    </>
                    )}
                </button>
                </form>
            </div>
        </Layout>
    );
}