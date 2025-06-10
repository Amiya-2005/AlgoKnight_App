import { lazy, useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from './context/AuthContext';


// Public pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Protected pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
import SmartSheet from './pages/SmartSheet';
import NetworkPage from './pages/NetworkPage';
import ContestsPage from './pages/ContestsPage';
import StumblesPage from './pages/StumblesPage';
import ConceptsPage from './pages/ConceptsPage';

/**
 * Protected Route component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("Log in required");
      toast.error("Please login to continue");
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Public Route component
 * Redirects to dashboard if user is already authenticated
 */
const PublicRoute = ({ children, restricted = false }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (!loading && isAuthenticated && restricted) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};



/**
 * Main application routes
 */
const AppRoutes = () => {
  return (
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute restricted>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute restricted>
              <RegisterPage />
            </PublicRoute>
          }
        />


        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/smartsheet"
          element={
            <ProtectedRoute>
              <SmartSheet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contests"
          element={
            <ProtectedRoute>
              <ContestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/network"
          element={
            <ProtectedRoute>
              <NetworkPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stumbles"
          element={
            <ProtectedRoute>
              <StumblesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/concepts"
          element={
            <ProtectedRoute>
              <ConceptsPage />
            </ProtectedRoute>
          }
        />


        {/* 404 - Not Found */}
        <Route path="*" element={
          <NotFoundPage />
        } />
      </Routes>
  );
};

export default AppRoutes;