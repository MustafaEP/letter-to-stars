import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-lg mb-6">
            <Search className="w-16 h-16 text-primary-600" />
          </div>
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sayfa Bulunamadı
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
            Anasayfaya dönerek devam edebilirsiniz.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Geri Dön</span>
          </button>
          
          <button
            onClick={() => navigate('/diary/calendar')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Ana Sayfa</span>
          </button>
        </div>
      </div>
    </div>
  );
}