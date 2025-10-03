// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

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

const App = () => {
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionError, setPredictionError] = useState(null);

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

  const HomeContent = (
    <main>
      <HeroSection />
      <PredictionGuidelines />
      <PredictionUpload
        onPredictionSuccess={handlePredictionSuccess}
        onPredictionFail={handlePredictionFail}
      />
      {predictionError && (
        <div className="max-w-3xl mx-auto px-6 mt-4 text-center text-red-600 font-archivo">
          {predictionError}
        </div>
      )}
      {predictionResult && <BreedInfoDisplay predictionResult={predictionResult} />}
    </main>
  );

  // Small wrapper component so we can pass a navigate-based onBack prop to Settings
  function SettingsPageWrapper() {
    const navigate = useNavigate();
    return <Settings onBack={() => navigate(-1)} />;
  }

  return (
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
  );
};

export default App;




