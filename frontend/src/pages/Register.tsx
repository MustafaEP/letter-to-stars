import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '../api/auth.api';
import toast from 'react-hot-toast';
import { tokenUtils } from '../utils/token';
import { AlertCircle, Sparkles, Star } from 'lucide-react';
import GoogleButton from '../components/auth/GoogleButton';
import StarField from '../components/ui/Starfield';

// Validation schema
const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .max(100, 'Ad en fazla 100 karakter olabilir')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .min(1, 'Email adresi gereklidir')
    .email('Geçerli bir email adresi giriniz'),
  password: z
    .string()
    .min(1, 'Şifre gereklidir')
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .max(64, 'Şifre en fazla 64 karakter olabilir')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'
    ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.register(data);
      tokenUtils.set(response.accessToken);
      
      toast.success('Hesabınız oluşturuldu! Hoş geldiniz 🎉', {
        duration: 2000,
      });
      
      setTimeout(() => {
        navigate('/diary/calendar');
      }, 500);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Kayıt başarısız oldu';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Starfield Background */}
      <StarField count={200} showShootingStars={true} />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="glass-card p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Star className="w-16 h-16 text-cyan-400 animate-float" fill="currentColor" />
                <div className="absolute inset-0 blur-2xl bg-cyan-400/40 animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-cosmic-gradient mb-3 glow-ice">
              Hesap Oluştur
            </h1>
            <p className="text-gray-300 text-lg">
              Yıldızlara ulaşmaya hazır mısın? ✨
            </p>
          </div>

          {/* Google Button */}
          <div className="mb-6">
            <GoogleButton text="Google ile Kayıt Ol" />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#0a0e27]/80 text-gray-400">veya email ile</span>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ad Soyad (Opsiyonel)
              </label>
              <input
                {...register('name')}
                type="text"
                className="input-field"
                placeholder="Adınız"
              />
              {errors.name && (
                <p className="text-sm text-red-400 mt-2">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="input-field"
                placeholder="ornek@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-2">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Şifre
              </label>
              <input
                {...register('password')}
                type="password"
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-red-400 mt-2">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Zaten hesabın var mı?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}