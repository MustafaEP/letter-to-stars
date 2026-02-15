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
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email adresi gereklidir')
    .email('Geçerli bir email adresi giriniz'),
  password: z
    .string()
    .min(1, 'Şifre gereklidir')
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .max(64, 'Şifre en fazla 64 karakter olabilir'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setIsLoading(true);

    
    try {
      const response = await authApi.login(data);
      tokenUtils.set(response.accessToken);
      
      // Success toast
      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...', {
        duration: 2000,
      });
      
      // Delay navigation for toast visibility
      setTimeout(() => {
        navigate('/diary/calendar');
      }, 500);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Giriş başarısız oldu';
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
              Letter to Stars
            </h1>
            <p className="text-gray-300 text-lg">
              Günlüğünü yaz, yıldızlara ulaş ✨
            </p>
          </div>

          {/* Google Button */}
          <div className="mb-6">
            <GoogleButton text="Google ile Giriş Yap" />
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
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Hesabın yok mu?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}