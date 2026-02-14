import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '../api/auth.api';
import toast from 'react-hot-toast';  
import { tokenUtils } from '../utils/token';
import { AlertCircle } from 'lucide-react';
import GoogleButton from '../components/auth/GoogleButton';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Yıldızlara Mektup
          </h1>
          <p className="text-gray-600">
            Günlüğünü yaz, İngilizceni geliştir ✨
          </p>
        </div>

        {/* Google Button */}
        <div className="mb-6">
          <GoogleButton text="Google ile Giriş Yap" />
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">veya</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="input-field"
              placeholder="ornek@email.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              {...register('password')}
              type="password"
              className="input-field"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Hesabın yok mu?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}