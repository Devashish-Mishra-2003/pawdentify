// src/components/PredictionUpload.jsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import paw from "../assets/icons8-cat-footprint-64.png";
import { DOG_PREDICT_API_URL } from "../constants";

/* Small SVG helper icons */
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

const handleScrollTo = (id) => {
  const element = document.getElementById(id.substring(1));
  if (element)
    window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" });
};

const PredictionUpload = ({ onPredictionSuccess, onPredictionFail }) => {
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
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      clearInterval(progressTimerRef.current);
    };
  }, [previewUrl]);

  const resetStates = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setIsLoading(false);
    setError(null);
    setProgress(0);
    setLiveMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [previewUrl]);

  const handleFile = useCallback(
    (file) => {
      if (file && file.type && file.type.startsWith("image/")) {
        setError(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        const url = URL.createObjectURL(file);
        setSelectedFile(file);
        setPreviewUrl(url);
        setLiveMessage("Image selected. Ready to upload.");
      } else {
        setError("Invalid file type. Please upload an image (JPG, PNG).");
        setLiveMessage("Invalid file type.");
        resetStates();
      }
    },
    [previewUrl, resetStates]
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

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleDropzoneKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleBrowseClick();
    }
  };

  const startProgress = () => {
    setProgress(6);
    clearInterval(progressTimerRef.current);
    progressTimerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(progressTimerRef.current);
          return p;
        }
        return Math.min(90, +(p + Math.random() * 8).toFixed(1));
      });
    }, 400);
  };

  const finishProgress = () => {
    clearInterval(progressTimerRef.current);
    setProgress(100);
    setTimeout(() => setProgress(0), 700);
  };

  const handlePrediction = async () => {
    if (!selectedFile) {
      const msg = "Please select an image file first.";
      setError(msg);
      setLiveMessage(msg);
      onPredictionFail?.(msg);
      return;
    }

    setIsLoading(true);
    setError(null);
    setLiveMessage("Uploading image and requesting prediction...");
    startProgress();

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(DOG_PREDICT_API_URL, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      // CHECKPOINT: backend response
      console.log("[PredictionUpload] /predict response:", {
        ok: response.ok,
        status: response.status,
        body: result,
      });

      finishProgress();

      if (!response.ok) {
        const message =
          result.detail || "Prediction failed due to server error.";
        console.log(
          "[PredictionUpload] response not ok, message:",
          message
        );
        setError(message);
        setLiveMessage("Prediction failed.");
        onPredictionFail?.(message);
        return;
      }

      if (result.low_confidence) {
        const msg =
          "Low confidence in prediction. Please try a clearer image.";
        console.log(
          "[PredictionUpload] low confidence returned:",
          result
        );
        setError(msg);
        setLiveMessage(msg);
        onPredictionFail?.(msg);
      } else {
        // CHECKPOINT: what we'll send up to App
        const payload = {
          breed: result.prediction || "Unknown Breed",
          id: result.prediction_id ?? null,
          previewUrl,
        };
        console.log(
          "[PredictionUpload] calling onPredictionSuccess with:",
          payload
        );
        onPredictionSuccess?.(payload);
        setLiveMessage(`Prediction succeeded: ${result.prediction}`);
        setSelectedFile(null);
      }
    } catch (err) {
      console.error("[PredictionUpload] API Error:", err);
      const msg =
        "Failed to connect to the prediction service. Check console for details.";
      setError(msg);
      setLiveMessage(msg);
      onPredictionFail?.(msg);
    } finally {
      setIsLoading(false);
      clearInterval(progressTimerRef.current);
      setTimeout(() => setProgress(0), 900);
    }
  };

  const baseBox =
    "w-full max-w-3xl mx-auto rounded-3xl transition-all duration-500 relative overflow-hidden";
  const glassBox =
    "bg-white/40 backdrop-blur-md border border-white/30 shadow-xl px-10 py-14";
  const dragBoxExtra = "ring-2 ring-indigo-300/40";

  return (
    <motion.section
      id="predict"
      className="py-16 bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 font-archivo relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(600px 400px at 10% 20%, rgba(139,92,246,0.06), transparent 10%), radial-gradient(500px 350px at 90% 80%, rgba(168,85,247,0.05), transparent 12%)",
          animation: "bgShift 30s linear infinite",
        }}
      />
      <style>{`
        @keyframes bgShift {
          0% { background-position: 0% 0%, 100% 100%; }
          50% { background-position: 10% 10%, 90% 80%; }
          100% { background-position: 0% 0%, 100% 100%; }
        }
        .squircle { border-radius: 18% / 12%; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04); overflow: hidden; }
        .dz-focus:focus { outline: 3px solid rgba(124,58,237,0.18); outline-offset: 4px; border-radius: 18px; }
      `}</style>

      <div className="sr-only" aria-live="polite">
        {liveMessage}
      </div>

      <div className="max-w-3xl mx-auto px-6 text-left relative z-10">
        <motion.h3
          className="text-5xl md:text-4xl font-archivo font-bold mb-8 text-gray-900 tracking-wider"
          align="center"
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Upload a Photo
        </motion.h3>

        <motion.div
          className={`${baseBox} ${glassBox} ${
            isDragging ? dragBoxExtra : ""
          } dz-focus`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={handleDropzoneKey}
          aria-label="Upload image file. Press Enter to browse files or drop an image here."
          initial={{ y: 12, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08 }}
          whileHover={{ scale: 1.005 }}
        >
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-10 relative z-10">
            <div className="flex-shrink-0">
              {previewUrl ? (
                <div className="squircle w-40 h-52 md:w-48 md:h-64 shadow-lg bg-white/8">
                  <img
                    src={previewUrl}
                    alt="Selected preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="squircle w-40 h-52 md:w-48 md:h-64 flex items-center justify-center bg-white/8 shadow-md">
                  <motion.img
                    src={paw}
                    alt="paw icon"
                    className="w-16 h-16"
                    animate={{ y: [-6, 6, -6] }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                  />
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="text-2xl md:text-3xl font-archivo font-bold text-gray-900 mb-3">
                Drag & drop an image
              </p>
              <p className="text-base text-gray-600 mb-6">
                We recommend a clear, front-facing photo. Images are processed
                locally before sending to the model.
              </p>

              <div className="flex items-center gap-4 mb-6">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files) handleFile(e.target.files[0]);
                  }}
                  className="hidden"
                />

                <motion.button
                  onClick={handleBrowseClick}
                  className={`px-6 py-3 rounded-full font-alfa text-white shadow-md focus:outline-none focus:ring-4 focus:ring-purple-300/30 transition-all ${
                    previewUrl
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600"
                  }`}
                  whileHover={{ translateY: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {previewUrl ? "Change" : "Browse"}
                </motion.button>

                <motion.button
                  onClick={handlePrediction}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-full bg-white text-purple-700 font-semibold shadow-md border border-white/30 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all flex items-center gap-2"
                  whileHover={{ translateY: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      ></circle>
                    </svg>
                  ) : null}
                  <span>{isLoading ? "Predicting..." : "Run"}</span>
                </motion.button>

                {previewUrl && (
                  <button
                    onClick={resetStates}
                    className="ml-2 px-4 py-2 border rounded-full bg-white/60 text-gray-700 hover:bg-white focus:outline-none focus:ring-3 focus:ring-purple-200 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-6">
                <div className="flex items-center">
                  <IconCamera />
                  <span>Recommended: 800×800+</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 inline-block mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  <span>File types: JPG, PNG</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="h-1 w-full bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-3">
                  {progress > 0 && progress < 100
                    ? `Uploading… ${Math.round(progress)}%`
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            className="mt-8 p-4 max-w-3xl mx-auto bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200 rounded-2xl shadow relative overflow-hidden"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="font-semibold">{error}</div>
            <button onClick={resetStates} className="mt-3 underline text-sm">
              Try again
            </button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default PredictionUpload;


