import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';  
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import DiaryCreate from './pages/DiaryCreate';
import DiaryDetail from './pages/DiaryDetail';
import DiaryList from './pages/DiaryList';
import CalendarView from './pages/CalendarView';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';  
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';  
import { useOnlineStatus } from './hooks/useOnlineStatus';
import OfflineIndicator from './components/OfflineIndicator';

function App() {
  useOnlineStatus();  
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(10, 14, 39, 0.95)',
              color: '#e5e7eb',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              backdropFilter: 'blur(12px)',
            },
            success: {
              iconTheme: {
                primary: '#38bdf8',
                secondary: '#0a0e27',
              },
            },
            error: {
              iconTheme: {
                primary: '#f87171',
                secondary: '#0a0e27',
              },
            },
          }}
        />
        <OfflineIndicator />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Routes */}
          <Route
            path="/diary"
            element={
              <ProtectedRoute>
                <DiaryCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diary/list"
            element={
              <ProtectedRoute>
                <DiaryList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diary/calendar"
            element={
              <ProtectedRoute>
                <CalendarView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diary/:date"
            element={
              <ProtectedRoute>
                <DiaryDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/diary/calendar" replace />} />
          
          {/* 404 - Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;