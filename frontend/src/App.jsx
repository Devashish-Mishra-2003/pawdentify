// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

import { ThemeProvider } from './contexts/ThemeContext';
import GlobalStyles from './components/GlobalStyles';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PredictionGuidelines from './components/PredictionGuidelines';
import PredictionUpload from './components/PredictionUpload';
import BreedInfoDisplay from './components/BreedInfoDisplay';
import KnowMorePage from './components/KnowMorePage';
import FAQ from './pages/FAQ';
import Footer from './components/Footer';
import Settings from './components/Settings';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';

const PREDICTION_STORAGE_KEY = 'pawdentify-current-prediction';

// Component to conditionally render Header and Footer
function Layout({ children, showHeaderFooter }) {
  return (
    <>
      {showHeaderFooter && <Header />}
      {children}
      {showHeaderFooter && <Footer />}
    </>
  );
}

const App = () => {
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionError, setPredictionError] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREDICTION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPredictionResult(parsed);
      }
    } catch (e) {
      console.error('Failed to load prediction from storage', e);
    }
  }, []);

  useEffect(() => {
    try {
      if (predictionResult) {
        localStorage.setItem(PREDICTION_STORAGE_KEY, JSON.stringify(predictionResult));
      } else {
        localStorage.removeItem(PREDICTION_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save prediction to storage', e);
    }
  }, [predictionResult]);

  const handlePredictionSuccess = ({ breed, id, previewUrl }) => {
    setPredictionResult({ breed, id, previewUrl });
    setPredictionError(null);
    const el = document.getElementById('info');
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  const handlePredictionFail = (message) => {
    setPredictionResult(null);
    setPredictionError(message || 'Prediction failed. Try again.');
  };

  const handleClearPrediction = () => {
    setPredictionResult(null);
    setPredictionError(null);
  };

  const HomeContent = (
    <main>
      <HeroSection />
      <PredictionGuidelines />
      <PredictionUpload
        onPredictionSuccess={handlePredictionSuccess}
        onPredictionFail={handlePredictionFail}
        onClearPrediction={handleClearPrediction}
        existingPrediction={predictionResult}
      />
      {predictionError && (
        <div className="max-w-3xl mx-auto px-6 mt-4 text-center text-red-600 font-archivo">
          {predictionError}
        </div>
      )}
      {predictionResult && <BreedInfoDisplay predictionResult={predictionResult} />}
    </main>
  );

  function SettingsPageWrapper() {
    const navigate = useNavigate();
    return <Settings onBack={() => navigate(-1)} />;
  }

  function ProtectedRoute({ children }) {
    return (
      <>
        <SignedIn>{children}</SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    );
  }

  // Hook to check current location
  function AppRoutes() {
    const location = useLocation();
    const authRoutes = ['/sign-in', '/sign-up', '/sso-callback'];
    const isAuthRoute = authRoutes.some(route => location.pathname.startsWith(route));

    return (
      <>
        <GlobalStyles />
        <Layout showHeaderFooter={!isAuthRoute}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={HomeContent} />
            <Route path="/know-more" element={<KnowMorePage />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Auth Routes */}
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
            
            {/* Protected Routes */}
            <Route 
              path="/services" 
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPageWrapper />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;



