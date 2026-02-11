import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '../components/layout/Layout';
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
  newPassword: z.string().min(8, 'Yeni şifre en az 8 karakter olmalıdır'),
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
      setSuccess('Profil başarıyla güncellendi');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profil güncellenemedi');
    }
  };

  // Şifre değiştir
  const onPasswordSubmit = async (data: PasswordFormData) => {
    setError('');
    setSuccess('');

    try {
      await authApi.changePassword(data);
      setSuccess('Şifre değiştirildi. Tekrar giriş yapın.');
      resetPassword();

      // 2 saniye sonra logout
      setTimeout(() => {
        tokenUtils.remove();
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Şifre değiştirilemedi');
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
      setSuccess('Profil resmi güncellendi');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Resim yüklenemedi');
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
      setSuccess('Profil resmi silindi');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Resim silinemedi');
    }
  };

  // Tüm cihazlardan çıkış
  const handleLogoutAll = async () => {
    if (!confirm('Tüm cihazlardan çıkış yapmak istediğinizden emin misiniz?')) return;

    try {
      await authApi.logoutAll();
      tokenUtils.remove();
      navigate('/login');
    } catch (err) {
      setError('Çıkış yapılamadı');
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

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profil Ayarları</h1>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar - Profile Picture */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                {/* Profile Picture */}
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
                    {user?.profilePicture ? (
                      <img
                        src={`${API_URL}${user.profilePicture}`}
                        alt={user.name || 'Profile'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                        {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <label
                    htmlFor="profile-picture"
                    className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors"
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

                <h2 className="text-xl font-semibold text-gray-900 mt-4">
                  {user?.name || 'İsimsiz Kullanıcı'}
                </h2>
                <p className="text-sm text-gray-600">{user?.email}</p>

                {/* Remove Picture */}
                {user?.profilePicture && (
                  <button
                    onClick={handleRemovePicture}
                    className="mt-4 text-sm text-red-600 hover:text-red-700 flex items-center gap-1 mx-auto"
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
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Tüm Cihazlardan Çıkış</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Info Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profil Bilgileri
              </h3>

              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    {...registerProfile('name')}
                    type="text"
                    className="input-field"
                    placeholder="Adınız"
                  />
                  {profileErrors.name && (
                    <p className="text-sm text-red-600 mt-1">{profileErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    {...registerProfile('bio')}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Kendinizden bahsedin..."
                  />
                  {profileErrors.bio && (
                    <p className="text-sm text-red-600 mt-1">{profileErrors.bio.message}</p>
                  )}
                </div>

                <button type="submit" className="btn-primary">
                  Profili Güncelle
                </button>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Şifre Değiştir
              </h3>

              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eski Şifre
                  </label>
                  <input
                    {...registerPassword('oldPassword')}
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                  />
                  {passwordErrors.oldPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {passwordErrors.oldPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yeni Şifre
                  </label>
                  <input
                    {...registerPassword('newPassword')}
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-600 mt-1">
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