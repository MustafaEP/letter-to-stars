import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { diaryApi } from '../api/diary.api';
import { Sparkles, AlertCircle, Loader2, Image as ImageIcon, X } from 'lucide-react';
import Layout from '../components/layout/Layout';

// Validation schema 
const diarySchema = z.object({
    originalText: z
        .string()
        .min(50, 'Günlük en az 50 karakter olmalıdır')
        .max(10000, 'Günlük en fazla 10000 karakter olabilir'),
    ieltsLevel: z.number().min(6).max(9),
});

type DiaryFormData = z.infer<typeof diarySchema>;

export default function DiaryCreate() {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
  
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
    // const ieltsLevel = watch('ieltsLevel', 7);
    const charCount = originalText.length;

    
  const onSubmit = async (data: DiaryFormData) => {
    console.log('🚀 onSubmit çağrıldı!');
    
    setError('');
    setIsLoading(true);

    try {
      // 1. Önce günlüğü oluştur
      const result = await diaryApi.create(data);
      console.log('✅ Günlük oluşturuldu:', result);

      // 2. Eğer resim varsa yükle
      if (selectedImage) {
        console.log('📸 Resim yükleniyor...');
        await diaryApi.uploadImage(result.id, selectedImage);
        console.log('✅ Resim yüklendi');
      }

      // 3. Detay sayfasına git
      const dateString = new Date(result.entryDate).toISOString().split('T')[0];
      navigate(`/diary/${dateString}`);
    } catch (err: any) {
      console.error('❌ Hata:', err);
      
      if (err.response?.status === 409) {
        setError('Bugün için zaten bir günlük girdiniz');
      } else {
        setError(err.response?.data?.message || 'Bir hata oluştu');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resim seçme
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya boyutu kontrolü (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Dosya boyutu 10MB\'dan küçük olmalıdır');
      return;
    }

    setSelectedImage(file);

    // Preview oluştur
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Resmi kaldır
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
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
                      watch('ieltsLevel') === level
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    {...register('ieltsLevel', { 
                      setValueAs: (v) => parseInt(v, 10) 
                    })}
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
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotoğraf Ekle (Opsiyonel)
            </label>

            {imagePreview ? (
              // Preview
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              // Upload button
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-600">
                    <span className="font-semibold">Tıkla</span> veya sürükle bırak
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF (max. 10MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
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
