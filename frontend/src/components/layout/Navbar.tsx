import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, List, Plus, User, Calendar, Menu, X, BookOpen } from 'lucide-react';
import { tokenUtils } from '../../utils/token';
import { authApi } from '../../api/auth.api';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      tokenUtils.remove();
      navigate('/login');
      setIsMenuOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/diary/calendar"
            className="flex items-center gap-3 group"
            onClick={handleNavClick}
          >
            <img
              src="/logo.png"
              alt="Letter to Stars"
              className="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
            />
            <span className="text-xl font-bold text-cosmic-gradient">
              Letter to Stars
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/diary/calendar"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/diary/calendar')
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-cyan-300'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Takvim</span>
            </Link>

            <Link
              to="/diary/list"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/diary/list')
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-cyan-300'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">Liste</span>
            </Link>

            <Link
              to="/diary"
              className="flex items-center gap-2 px-5 py-2 btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Yeni Günlük</span>
            </Link>
            <Link
              to="/vocabulary"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/vocabulary')
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-400/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-purple-300'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Kelime Defteri</span>
            </Link>
            <Link
              to="/profile"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/profile')
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-cyan-300'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Profil</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Çıkış</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-gray-300 hover:bg-white/10 transition-all duration-200"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Menüyü aç/kapat"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slide-up">
            <Link
              to="/diary/calendar"
              onClick={handleNavClick}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive('/diary/calendar')
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-cyan-300'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Takvim</span>
            </Link>

            <Link
              to="/diary/list"
              onClick={handleNavClick}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive('/diary/list')
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-cyan-300'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">Liste</span>
            </Link>

            <Link
              to="/diary"
              onClick={handleNavClick}
              className="flex items-center gap-2 px-4 py-3 btn-primary w-full justify-center"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Yeni Günlük</span>
            </Link>

            <Link
              to="/vocabulary"
              onClick={handleNavClick}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive('/vocabulary')
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-400/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-purple-300'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Kelime Defteri</span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                onClick={handleNavClick}
                className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive('/profile')
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-cyan-300'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Profil</span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}