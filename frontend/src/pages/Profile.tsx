import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '../components/layout/Layout';
import toast from 'react-hot-toast';
import { usersApi } from '../api/users.api';
import { authApi } from '../api/auth.api';
import { tokenUtils } from '../utils/token';
import type { User } from '../types/auth.types';
import {
  Camera,
  Loader2,
  AlertCircle,
  CheckCircle,
  Trash2,
  LogOut,
} from 'lucide-react';

// Validation schemas
const profileSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalıdır').optional(),
  bio: z.string().max(500, 'Bio en fazla 500 karakter olabilir').optional(),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(8, 'Eski şifre en az 8 karakter olmalıdır'),
  newPassword: z
    .string()
    .min(8, 'Yeni şifre en az 8 karakter olmalıdır')
    .max(64, 'Yeni şifre en fazla 64 karakter olabilir')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'
    ),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Profil bilgilerini yükle
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await usersApi.getProfile();
        setUser(data);
        resetProfile({
          name: data.name || '',
          bio: data.bio || '',
        });
      } catch (err: any) {
        setError('Profil yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [resetProfile]);

  // Profil güncelle
  const onProfileSubmit = async (data: ProfileFormData) => {
    setError('');
    setSuccess('');

    try {
      const updated = await usersApi.updateProfile(data);
      setUser(updated);
      toast.success('Profil güncellendi ✓');  // ← Toast
    } catch (err: any) {
      const message = err.response?.data?.message || 'Profil güncellenemedi';
      setError(message);
      toast.error(message);
    }
  };

  // Şifre değiştir
  const onPasswordSubmit = async (data: PasswordFormData) => {
    setError('');
    setSuccess('');

    try {
      await authApi.changePassword(data);
      toast.success('Şifre değiştirildi. Tekrar giriş yapılıyor...');
      resetPassword();

      setTimeout(() => {
        tokenUtils.remove();
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Şifre değiştirilemedi';
      setError(message);
      toast.error(message);
    }
  };

  // Profil resmi yükle
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    setIsUploading(true);
    setError('');
    
    try {
      const updated = await usersApi.uploadProfilePicture(file);
      setUser(updated);
      toast.success('Profil resmi güncellendi 📸');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Resim yüklenemedi';
      setError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  // Profil resmini sil
  const handleRemovePicture = async () => {
    if (!confirm('Profil resmini silmek istediğinizden emin misiniz?')) return;

    try {
      const updated = await usersApi.removeProfilePicture();
      setUser(updated);
      toast.success('Profil resmi silindi');
    } catch (err: any) {
      toast.error('Resim silinemedi');
    }
  };

  // Tüm cihazlardan çıkış
  const handleLogoutAll = async () => {
    if (!confirm('Tüm cihazlardan çıkış yapmak istediğinizden emin misiniz?')) return;

    try {
      await authApi.logoutAll();
      tokenUtils.remove();
      toast.success('Tüm cihazlardan çıkış yapıldı');
      navigate('/login');
    } catch (err) {
      toast.error('Çıkış yapılamadı');
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

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-cosmic-gradient mb-3 glow-ice text-center">Profil Ayarları</h1>
        <p className="text-gray-300 text-center mb-8">Hesap bilgilerini yönet</p>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start gap-3 backdrop-blur-sm">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-300">{success}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar - Profile Picture */}
          <div className="md:col-span-1">
            <div className="glass-card p-6">
              <div className="text-center">
                {/* Profile Picture */}
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-white/10 overflow-hidden border-2 border-cyan-400/30">
                    {user?.profilePicture ? (
                      <img
                        src={`${API_URL}${user.profilePicture}`}
                        alt={user.name || 'Profile'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-cyan-400">
                        {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <label
                    htmlFor="profile-picture"
                    className="absolute bottom-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg"
                  >
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>

                <h2 className="text-xl font-bold text-gray-100 mt-4">
                  {user?.name || 'İsimsiz Kullanıcı'}
                </h2>
                <p className="text-sm text-gray-400">{user?.email}</p>

                {/* Remove Picture */}
                {user?.profilePicture && (
                  <button
                    onClick={handleRemovePicture}
                    className="mt-4 text-sm text-red-400 hover:text-red-300 flex items-center gap-1 mx-auto transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Resmi Sil</span>
                  </button>
                )}
              </div>
            </div>

            {/* Logout All Devices */}
            <button
              onClick={handleLogoutAll}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-all duration-300 backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Tüm Cihazlardan Çıkış</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Info Form */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-gray-100 mb-5">
                Profil Bilgileri
              </h3>

              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    {...registerProfile('name')}
                    type="text"
                    className="input-field"
                    placeholder="Adınız"
                  />
                  {profileErrors.name && (
                    <p className="text-sm text-red-400 mt-2">{profileErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    {...registerProfile('bio')}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Kendinizden bahsedin..."
                  />
                  {profileErrors.bio && (
                    <p className="text-sm text-red-400 mt-2">{profileErrors.bio.message}</p>
                  )}
                </div>

                <button type="submit" className="btn-primary">
                  Profili Güncelle
                </button>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-gray-100 mb-5">
                Şifre Değiştir
              </h3>

              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Eski Şifre
                  </label>
                  <input
                    {...registerPassword('oldPassword')}
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                  />
                  {passwordErrors.oldPassword && (
                    <p className="text-sm text-red-400 mt-2">
                      {passwordErrors.oldPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Yeni Şifre
                  </label>
                  <input
                    {...registerPassword('newPassword')}
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-400 mt-2">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn-primary">
                  Şifreyi Değiştir
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}