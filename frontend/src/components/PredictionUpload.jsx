// src/components/PredictionUpload.jsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from '@clerk/clerk-react';
import paw from "../assets/icons8-cat-footprint-64.png";
import { DOG_PREDICT_API_URL } from "../constants";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const IconCamera = ({ className = "w-4 h-4 inline-block mr-2" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

// Helper function to compress image based on quality setting
const compressImage = async (file, quality) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = quality === 'high' ? 1024 : quality === 'medium' ? 800 : 512;
        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressionQuality = quality === 'high' ? 0.95 : quality === 'medium' ? 0.85 : 0.75;
        canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', compressionQuality);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const PredictionUpload = ({ onPredictionSuccess, onPredictionFail, onClearPrediction, existingPrediction }) => {
  const { t } = useTranslation();
  const { getToken, isSignedIn } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [liveMessage, setLiveMessage] = useState("");
  const fileInputRef = useRef(null);
  const progressTimerRef = useRef(null);

  useEffect(() => {
    if (existingPrediction && existingPrediction.previewUrl && !previewUrl) {
      setPreviewUrl(existingPrediction.previewUrl);
    }
  }, [existingPrediction, previewUrl]);

  useEffect(() => {
    return () => clearInterval(progressTimerRef.current);
  }, []);

  const resetStates = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsLoading(false);
    setError(null);
    setProgress(0);
    setLiveMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onClearPrediction) onClearPrediction();
  }, [onClearPrediction]);

  const handleFile = useCallback(async (file) => {
    if (file && file.type && file.type.startsWith("image/")) {
      setError(null);
      try {
        const dataUrl = await fileToDataURL(file);
        setSelectedFile(file);
        setPreviewUrl(dataUrl);
        setLiveMessage(t("upload.messages.imageSelected"));
      } catch (err) {
        setError(t("upload.errors.invalidFileType"));
        setLiveMessage(t("upload.errors.invalidFileType"));
      }
    } else {
      setError(t("upload.errors.invalidFileType"));
      setLiveMessage(t("upload.errors.invalidFileType"));
      resetStates();
    }
  }, [resetStates, t]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handlePrediction = async () => {
    if (!selectedFile) {
      setError(t("upload.errors.selectImageFirst"));
      return;
    }
    setIsLoading(true);
    setError(null);
    setProgress(10);
    
    try {
      let imageQuality = 'high';
      const savedSettings = localStorage.getItem('pawdentify-settings');
      if (savedSettings) imageQuality = JSON.parse(savedSettings).imageQuality || 'high';

      const compressedFile = await compressImage(selectedFile, imageQuality);
      const formData = new FormData();
      formData.append("file", compressedFile);

      const response = await fetch(DOG_PREDICT_API_URL, { method: "POST", body: formData });
      const result = await response.json();

      if (!response.ok) {
        setError(result.detail || t("upload.errors.serverError"));
        return;
      }

      if (result.low_confidence) {
        setError(t("upload.errors.lowConfidence"));
      } else {
        const payload = { breed: result.prediction, id: result.prediction_id, previewUrl };
        onPredictionSuccess?.(payload);
      }
    } catch (err) {
      setError(t("upload.errors.connectError"));
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <section id="predict" className="py-24 bg-transparent relative overflow-hidden">
      <div className="bg-blob blob-purple -bottom-20 -right-20 opacity-10"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center">
        <div className="text-center mb-16">
          <span className="font-handwriting text-2xl text-[#F07E7E] block mb-2">Drop it like it's hot!</span>
          <h2 className="text-4xl md:text-6xl text-black dark:text-white">Upload a Photo</h2>
        </div>

        <motion.div
          className={`bento-card w-full max-w-4xl cursor-pointer ${isDragging ? "border-[#30A7DB] bg-[#30A7DB]/5" : "border-gray-200 dark:border-white/10"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-shrink-0">
              {previewUrl ? (
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-[40px] bg-white dark:bg-white/5 flex flex-col items-center justify-center border-2 border-gray-100 dark:border-white/10 shadow-inner">
                  <motion.img src={paw} className="w-20 h-20 opacity-20 mb-4 invert dark:invert-0" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} />
                  <p className="text-gray-400 dark:text-gray-500 font-semibold tracking-wide uppercase text-sm">Waiting for a pup...</p>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl md:text-4xl mb-6 text-black dark:text-white">Drag or click to choose a picture</h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                Make sure the dog is clearly visible for the best results!
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
                
                <button
                  className="pill-button bg-purple-accent text-white py-4 px-8 text-lg"
                  onClick={(e) => { e.stopPropagation(); handleBrowseClick(); }}
                >
                  {previewUrl ? "Change Photo" : "Select Photo"}
                </button>

                {previewUrl && (
                  <button
                    disabled={isLoading}
                    className="pill-button bg-[#30A7DB] text-white py-4 px-8 text-lg flex items-center gap-2"
                    onClick={(e) => { e.stopPropagation(); handlePrediction(); }}
                  >
                    {isLoading ? "Thinking..." : "Identify Breed"}
                    {!isLoading && <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </button>
                )}
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-[#F07E7E] font-semibold bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">
                  {error}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
        
        <div className="mt-10 flex gap-8 items-center text-gray-400 font-medium font-handwriting text-xl">
           <span className="flex items-center gap-2"><IconCamera className="w-5 h-5" /> All breeds supported</span>
           <span className="flex items-center gap-2">Fast & Secure</span>
        </div>
      </div>
    </section>
  );
};

export default PredictionUpload;
