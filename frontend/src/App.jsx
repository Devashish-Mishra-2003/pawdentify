import React, { useState } from 'react';
import GlobalStyles from './components/GlobalStyles';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PredictionGuidelines from './components/PredictionGuidelines';
import PredictionUpload from './components/PredictionUpload';
import BreedInfoDisplay from './components/BreedInfoDisplay';
import Footer from './components/Footer';

const App = () => {
    // State to hold the successful prediction result
    const [predictionResult, setPredictionResult] = useState({
        // Temporarily set to show the UI
        breedName: 'Golden Retriever',
        previewUrl: 'https://placehold.co/400x400/8c52ff/ffffff?text=Uploaded+Dog+Photo',
    });

    return (
        <>
            <GlobalStyles />
            <Header />
            <main>
                <HeroSection />
                <PredictionGuidelines />
                <PredictionUpload onPredictionSuccess={setPredictionResult} />
                {predictionResult && (
                    <BreedInfoDisplay predictionResult={predictionResult} />
                )}
            </main>
            <Footer />
        </>
    );
};

export default App;
