import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DiaryCreate from './pages/DiaryCreate';
import DiaryDetail from './pages/DiaryDetail';
import DiaryList from './pages/DiaryList';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
        <Route path="/" element={<Navigate to="/diary/list" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;