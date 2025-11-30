import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProfileStore } from './state/useProfileStore';
import LandingPage from './pages/LandingPage';
import AccountSetup from './pages/AccountSetup';
import SwipeFeed from './pages/SwipeFeed';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import SavedItems from './pages/SavedItems';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function ProtectedRoute({ children }) {
  const { isProfileComplete } = useProfileStore();
  
  if (!isProfileComplete) {
    return <Navigate to="/setup" replace />;
  }
  
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/setup" element={<AccountSetup />} />
          <Route 
            path="/feed" 
            element={
              <ProtectedRoute>
                <SwipeFeed />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/product/:id" 
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
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
          <Route 
            path="/saved" 
            element={
              <ProtectedRoute>
                <SavedItems />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/products" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
