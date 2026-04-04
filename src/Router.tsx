import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Navigation } from '@/components/Navigation/Navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute';
import {
  HomePage,
  DashboardPage,
  ReviewsPage,
  RestaurantsPage,
  RestaurantDetailPage,
  SubmitReviewPage,
  LoginPage,
  NotFoundPage,
} from '@/pages';

export default function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
          <Route
            path="/restaurants/:id/review"
            element={
              <ProtectedRoute>
                <SubmitReviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit"
            element={
              <ProtectedRoute>
                <SubmitReviewPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
};