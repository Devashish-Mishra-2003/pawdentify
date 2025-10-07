// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

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

const PREDICTION_STORAGE_KEY = 'pawdentify-current-prediction';

const App = () => {
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionError, setPredictionError] = useState(null);

  // Load prediction from localStorage on mount
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

  // Save prediction to localStorage whenever it changes
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

  return (
    <ThemeProvider>
      <BrowserRouter>
        <GlobalStyles />
        <Header showInfo={!!predictionResult} />
        <Routes>
          <Route path="/" element={HomeContent} />
          <Route path="/know-more" element={<KnowMorePage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/settings" element={<SettingsPageWrapper />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;





