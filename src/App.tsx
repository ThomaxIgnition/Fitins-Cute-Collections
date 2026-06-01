import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { StorePage } from './pages/StorePage';
import { BlogPage } from './pages/BlogPage';
import { FounderPage } from './pages/FounderPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminDashboard } from './pages/AdminDashboard';

// Helper component to toggle navigation and footer visibility selectively
const AppContent: React.FC = () => {
  const location = useLocation();
  const isLandingRoute = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hide Navbar from landing entry point */}
      {!isLandingRoute && <Navbar />}
      
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<StorePage />} />
          <Route path="/fashion-lifestyle" element={<BlogPage />} />
          <Route path="/founder" element={<FounderPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Fallback route handles graceful redirecting back home */}
          <Route path="*" element={<StorePage />} />
        </Routes>
      </div>

      {/* Hide Footer from landing entry point */}
      {!isLandingRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <React.StrictMode>
      <StoreProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </StoreProvider>
    </React.StrictMode>
  );
}
