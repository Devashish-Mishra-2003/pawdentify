import React, { useState } from 'react';
import GlobalStyles from './components/GlobalStyles';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PredictionGuidelines from './components/PredictionGuidelines';
import PredictionUpload from './components/PredictionUpload';
import BreedInfoDisplay from './components/BreedInfoDisplay';
import Footer from './components/Footer';

const App = () => {
  // store prediction result or null
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionError, setPredictionError] = useState(null);

  // Called by PredictionUpload on success
  const handlePredictionSuccess = ({ breed, id, previewUrl }) => {
    console.log('[App] handlePredictionSuccess called with:', { breed, id, previewUrl });
    setPredictionResult({ breed, id, previewUrl });
    setPredictionError(null);
    // optionally scroll to info
    const el = document.getElementById('info');
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  // Called by PredictionUpload on fail
  const handlePredictionFail = (message) => {
    console.log('[App] handlePredictionFail called with message:', message);
    setPredictionResult(null);
    setPredictionError(message || 'Prediction failed. Try again.');
    // keep user on upload so they can retry
  };

  // debug: show current predictionResult in console on each render
  console.log('[App] render predictionResult:', predictionResult);

  return (
    <>
      <GlobalStyles />
      <Header />
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
        {predictionResult && (
          <BreedInfoDisplay predictionResult={predictionResult} />
        )}
      </main>
      <Footer />
    </>
  );
};

export default App;
