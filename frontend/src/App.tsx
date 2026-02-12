import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DiaryCreate from './pages/DiaryCreate';
import DiaryDetail from './pages/DiaryDetail';
import DiaryList from './pages/DiaryList';
import CalendarView from './pages/CalendarView';  // ← Yeni
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />  {/* ← Yeni */}

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
          path="/diary/calendar"  // ← Yeni
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;