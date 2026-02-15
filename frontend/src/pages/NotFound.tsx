import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Star } from 'lucide-react';
import StarField from '../components/ui/Starfield';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Starfield Background */}
      <StarField count={150} showShootingStars={true} />
      
      {/* Content */}
      <div className="relative z-10 text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 glass-card rounded-full shadow-2xl mb-6 animate-float">
            <Search className="w-16 h-16 text-cyan-400" />
          </div>
          <h1 className="text-9xl font-bold text-cosmic-gradient mb-4 glow-ice">404</h1>
          <h2 className="text-4xl font-bold text-gray-100 mb-4 flex items-center justify-center gap-3">
            <Star className="w-8 h-8 text-cyan-400 animate-pulse" />
            Kayıp Yıldız
            <Star className="w-8 h-8 text-cyan-400 animate-pulse" />
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
            Aradığınız sayfa yıldızlar arasında kaybolmuş. 
            Takvime dönerek yıldız haritanıza geri dönebilirsiniz.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center justify-center gap-2 px-6 py-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Geri Dön</span>
          </button>
          
          <button
            onClick={() => navigate('/diary/calendar')}
            className="btn-primary flex items-center justify-center gap-2 px-6 py-3"
          >
            <Home className="w-5 h-5" />
            <span>Yıldız Haritası</span>
          </button>
        </div>
      </div>
    </div>
  );
}