import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

import { ThemeProvider } from './contexts/ThemeContext';
import GlobalStyles from './components/GlobalStyles';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PredictionGuidelines from './components/PredictionGuidelines';
import PredictionUpload from './components/PredictionUpload';
import BreedInfoDisplay from './components/BreedInfoDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';

// Lazy load components
const KnowMorePage = lazy(() => import('./components/KnowMorePage'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Settings = lazy(() => import('./components/Settings'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Services = lazy(() => import('./pages/Services'));
const AdminFeedback = lazy(() => import('./pages/AdminFeedback'));
const SearchBreed = lazy(() => import('./pages/SearchBreed')); // <- NEW LINE ADDED

const PREDICTION_STORAGE_KEY = 'pawdentify-current-prediction';

// Wrapper component that shows full-page loader without header/footer
function SuspenseWrapper({ children, showHeaderFooter }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Suspense 
      fallback={
        <div style={{ minHeight: '100vh' }}>
          <LoadingSpinner message="Loading page..." />
        </div>
      }
    >
      <LoadingHandler setIsLoading={setIsLoading}>
        {isLoading ? (
          <LoadingSpinner message="Loading page..." />
        ) : (
          <>
            {showHeaderFooter && <Header />}
            {children}
            {showHeaderFooter && <Footer />}
          </>
        )}
      </LoadingHandler>
    </Suspense>
  );
}

// Helper component to detect when content is loaded
function LoadingHandler({ children, setIsLoading }) {
  useEffect(() => {
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  return <>{children}</>;
}

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

  function AppRoutes() {
    const location = useLocation();
    const authRoutes = ['/sign-in', '/sign-up', '/sso-callback'];
    const isAuthRoute = authRoutes.some(route => location.pathname.startsWith(route));
    const isHomePage = location.pathname === '/';

    return (
      <>
        <GlobalStyles />
        
        {/* Home page - no lazy loading, show immediately with header/footer */}
        {isHomePage ? (
          <Layout showHeaderFooter={true}>
            <Routes>
              <Route path="/" element={HomeContent} />
            </Routes>
          </Layout>
        ) : (
          /* Other pages - lazy load with full-page loader */
          <Suspense 
            fallback={
              <div style={{ minHeight: '100vh' }}>
                <LoadingSpinner message="Loading page..." />
              </div>
            }
          >
            <Layout showHeaderFooter={!isAuthRoute}>
              <Routes>
                {/* Public Routes */}
                <Route path="/know-more" element={<KnowMorePage />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/search-breed" element={<SearchBreed />} /> {/* <- NEW LINE ADDED */}
                
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
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminFeedback />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Layout>
          </Suspense>
        )}
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


