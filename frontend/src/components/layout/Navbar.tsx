import { useNavigate, Link } from 'react-router-dom';
import { LogOut, BookOpen, List, Plus, User } from 'lucide-react';
import { tokenUtils } from '../../utils/token';
import { authApi } from '../../api/auth.api';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      tokenUtils.remove();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/diary/list" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">
              Yıldızlara Mektup
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <Link
              to="/diary/list"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">Günlüklerim</span>
            </Link>

            <Link
              to="/diary"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Yeni Günlük</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Profil</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Çıkış</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}