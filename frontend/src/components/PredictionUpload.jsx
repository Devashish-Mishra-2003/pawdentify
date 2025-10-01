import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import paw from '../assets/icons8-cat-footprint-64.png';
import { DOG_PREDICT_API_URL } from '../constants';

const handleScrollTo = (id) => {
  const element = document.getElementById(id.substring(1));
  if (element) {
    window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
  }
};

const PredictionUpload = ({ onPredictionSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const resetStates = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsLoading(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleFile = useCallback(
    (file) => {
      if (file && file.type && file.type.startsWith('image/')) {
        setError(null);
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setError('Invalid file type. Please upload an image (JPG, PNG).');
        resetStates();
      }
    },
    [resetStates]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handlePrediction = async () => {
    if (!selectedFile) {
      setError('Please select an image file first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(DOG_PREDICT_API_URL, { method: 'POST', body: formData });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Prediction failed due to server error.');
      }

      if (result.low_confidence) {
        setError('Low confidence in prediction. Please try a clearer image.');
      } else {
        onPredictionSuccess({ breedName: result.prediction || 'Unknown Breed', previewUrl: previewUrl });
        handleScrollTo('#info');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to connect to the prediction service. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const baseBox = 'w-full max-w-3xl mx-auto rounded-3xl transition-all duration-500 relative overflow-hidden';
  const normalBox = 'bg-white border-4 border-dashed border-purple-400 shadow-xl px-10 py-12';
  const dragBox = 'bg-gradient-to-br from-purple-50 to-indigo-50 border-4 border-dashed border-purple-600 shadow-2xl px-10 py-12 scale-105';

  return (
    <motion.section
      id="predict"
      className="py-12 bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 font-archivo relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Background decorative elements (unchanged) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-200 to-indigo-200 opacity-20"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${5 + i * 12}%`,
              top: `${10 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-10, 10, -10],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* narrower container so heading & box read as a group */}
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.h2
          className="text-5xl md:text-6xl font-alfa mb-6 text-gray-900 relative"
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            type: 'spring',
            stiffness: 90,
          }}
        >
          <motion.span
            animate={{
              textShadow: [
                '0 0 18px rgba(139, 69, 19, 0.25)',
                '0 0 36px rgba(139, 69, 19, 0.4)',
                '0 0 18px rgba(139, 69, 19, 0.25)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            Upload a Photo
          </motion.span>
        </motion.h2>

        <motion.div
          className={`${baseBox} ${isDragging ? dragBox : normalBox}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          initial={{ y: 30, opacity: 0, scale: 0.98 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.25,
            type: 'spring',
            stiffness: 80,
          }}
          whileHover={{
            scale: 1.02,
            boxShadow: '0 30px 60px rgba(124, 58, 237, 0.15)',
          }}
        >
          {/* subtle background pattern */}
          <motion.div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #8b5cf6 0%, transparent 50%), 
                               radial-gradient(circle at 75% 75%, #a855f7 0%, transparent 50%)`,
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <div className="flex flex-col items-center justify-center relative z-10">
            {/* Paw icon */}
            <motion.div
              animate={{
                y: [-8, 8, -8],
                rotate: [-4, 4, -4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <motion.img
                src={paw}
                alt="paw"
                className="w-20 h-20"
                whileHover={{
                  scale: 1.14,
                  rotate: 360,
                }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>

            {/* Two large lines with a clear gap between them */}
            <div className="mt-2">
              <motion.h3
                className="text-4xl md:text-5xl font-alfa text-gray-900"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                Drag or Drop
              </motion.h3>

              <motion.p
                className="text-4xl md:text-5xl font-alfa text-gray-900 mt-3 leading-tight"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.45 }}
              >
                your Photo here
              </motion.p>
            </div>

            <motion.p
              className="text-sm text-gray-500 mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              or click to browse
            </motion.p>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files) handleFile(e.target.files[0]);
              }}
              className="hidden"
            />

            {/* Browse button (unchanged except compact timing) */}
            <motion.button
              onClick={handleBrowseClick}
              className="mt-8 px-14 py-4 rounded-full shadow-xl font-alfa text-lg relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #c4b5fd)',
                color: '#fff',
                boxShadow: '0 15px 35px rgba(124,58,237,0.25)',
              }}
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.8,
                type: 'spring',
                stiffness: 120,
              }}
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: '0 25px 50px rgba(124,58,237,0.4)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 pointer-events-none"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
                aria-hidden="true"
              />
              <span className="relative z-10">Browse Files</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Selected file & Run button (unchanged except spacing) */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div
              className="mt-8 max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border-2 border-purple-200 text-left relative overflow-hidden"
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -30, opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.5,
                type: 'spring',
                stiffness: 120,
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-50"
                aria-hidden="true"
              />

              <motion.p
                className="font-semibold text-lg mb-6 text-purple-700 relative z-10"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Selected: {selectedFile.name}
              </motion.p>

              <div className="flex gap-4 relative z-10">
                <motion.button
                  onClick={handlePrediction}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden group"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 pointer-events-none"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                    aria-hidden="true"
                  />

                  {isLoading ? (
                    <motion.div className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Predicting...
                    </motion.div>
                  ) : (
                    <span className="relative z-10">Run Prediction</span>
                  )}
                </motion.button>

                <motion.button
                  onClick={resetStates}
                  className="px-8 py-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error display (unchanged spacing) */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mt-6 p-6 max-w-xl mx-auto bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-2 border-red-200 rounded-2xl shadow-lg relative overflow-hidden"
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -30, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div className="absolute inset-0 bg-gradient-to-r from-red-100 to-rose-100 opacity-50" aria-hidden="true" />

              <motion.p className="font-semibold relative z-10" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
                {error}
              </motion.p>
              <motion.button
                onClick={resetStates}
                className="mt-3 text-sm underline hover:text-red-900 transition-colors relative z-10"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.12 }}
                whileHover={{ scale: 1.05 }}
              >
                Try again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default PredictionUpload;
