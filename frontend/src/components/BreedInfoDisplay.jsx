import React from 'react';
import { mockBreedDetails } from '../mockData';
import StatCard from './StatCard';
import DetailCard from './DetailCard';
import InfoCard from './InfoCard';

const BreedInfoDisplay = ({ predictionResult }) => {
    // Look up mock data based on the prediction. Falls back to Golden Retriever if not found.
    const breedName = predictionResult.breedName;
    const data = mockBreedDetails[breedName] || mockBreedDetails['Golden Retriever'];

    return (
        <section id="info" className="py-20 bg-gray-50 font-archivo">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-alfa text-gray-800 mb-2">
                    Predicted Breed :
                </h2>
                <h3 className="text-6xl font-alfa text-purple-600 mb-4">
                    {breedName}
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                    Fun Fact : {data.funFact}
                </p>
                
                {/* Uploaded Image Preview */}
                <div className="mb-12">
                    <img 
                        src={predictionResult.previewUrl} 
                        alt={`Uploaded photo of a ${breedName}`}
                        className="mx-auto w-48 h-48 object-cover rounded-full shadow-xl border-4 border-white"
                        style={{ border: '4px solid white', boxShadow: '0 0 0 6px #8c52ff' }}
                    />
                </div>

                {/* 1st Row of Stats (With Kids, Pets, etc.) */}
                <div className="flex flex-wrap justify-center gap-6 mb-8">
                    {data.stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>
                
                {/* 2nd Row of Stats (Weight, Height, etc.) */}
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                    {data.details.map((detail) => (
                        <DetailCard key={detail.label} {...detail} />
                    ))}
                </div>

                {/* 3rd Row of Info Cards (Diseases, Environment, etc.) */}
                <div className="flex flex-wrap justify-center gap-6">
                    {data.cards.map((card) => (
                        <InfoCard key={card.title} {...card} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BreedInfoDisplay;
