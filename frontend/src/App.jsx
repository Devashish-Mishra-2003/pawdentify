import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

import { ThemeProvider } from './contexts/ThemeContext';
import { BreedDataProvider } from './contexts/BreedDataContext'; 
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PredictionGuidelines from './components/PredictionGuidelines';
import PredictionUpload from './components/PredictionUpload';
import BreedInfoDisplay from './components/BreedInfoDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';

const KnowMorePage = lazy(() => import('./components/KnowMorePage'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Settings = lazy(() => import('./components/Settings'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Services = lazy(() => import('./pages/Services'));
const AdminFeedback = lazy(() => import('./pages/AdminFeedback'));
const SearchBreed = lazy(() => import('./pages/SearchBreed'));

const PREDICTION_STORAGE_KEY = 'pawdentify-current-prediction';

function Layout({ children, showHeaderFooter, showInfo }) {
  return (
    <>
      {showHeaderFooter && <Header showInfo={showInfo} />}
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
      if (saved) setPredictionResult(JSON.parse(saved));
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    try {
      if (predictionResult) localStorage.setItem(PREDICTION_STORAGE_KEY, JSON.stringify(predictionResult));
      else localStorage.removeItem(PREDICTION_STORAGE_KEY);
    } catch (e) { console.error(e); }
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
        <div className="max-w-3xl mx-auto px-6 mt-4 text-center text-red-600 font-bold uppercase tracking-widest text-xs">
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
    const location = useLocation();
    return (
      <>
        <SignedIn>{children}</SignedIn>
        <SignedOut>
          <Navigate to="/sign-in" state={{ from: location }} replace />
        </SignedOut>
      </>
    );
  }

  function AppRoutes() {
    const location = useLocation();
    const authRoutes = ['/sign-in', '/sign-up', '/sso-callback'];
    const isAuthRoute = authRoutes.some(route => location.pathname.startsWith(route));
    const isHomePage = location.pathname === '/';

    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
        <Layout showHeaderFooter={!isAuthRoute} showInfo={!!predictionResult}>
          <Routes>
            <Route path="/" element={HomeContent} />
            <Route path="/know-more" element={<KnowMorePage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/search-breed" element={<SearchBreed />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPageWrapper /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminFeedback /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Suspense>
    );
  }

  return (
    <ThemeProvider>
      <BreedDataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </BreedDataProvider>
    </ThemeProvider>
  );
};

export default App;
