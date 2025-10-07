// src/components/PredictionUpload.jsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import paw from "../assets/icons8-cat-footprint-64.png";
import { DOG_PREDICT_API_URL } from "../constants";

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

// Convert File to base64 data URL
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
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [liveMessage, setLiveMessage] = useState("");
  const fileInputRef = useRef(null);
  const progressTimerRef = useRef(null);

  // Restore preview if coming back from another page
  useEffect(() => {
    if (existingPrediction && existingPrediction.previewUrl && !previewUrl) {
      setPreviewUrl(existingPrediction.previewUrl);
    }
  }, [existingPrediction, previewUrl]);

  useEffect(() => {
    return () => {
      clearInterval(progressTimerRef.current);
    };
  }, []);

  const resetStates = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsLoading(false);
    setError(null);
    setProgress(0);
    setLiveMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    // Notify parent to clear prediction
    if (onClearPrediction) {
      onClearPrediction();
    }
  }, [onClearPrediction]);

  const handleFile = useCallback(
    async (file) => {
      if (file && file.type && file.type.startsWith("image/")) {
        setError(null);
        try {
          // Convert to base64 data URL so it persists across navigation
          const dataUrl = await fileToDataURL(file);
          setSelectedFile(file);
          setPreviewUrl(dataUrl);
          setLiveMessage("Image selected. Ready to upload.");
        } catch (err) {
          console.error("Failed to convert file to data URL", err);
          setError(t("upload.errors.invalidFileType"));
          setLiveMessage(t("upload.errors.invalidFileType"));
        }
      } else {
        setError(t("upload.errors.invalidFileType"));
        setLiveMessage(t("upload.errors.invalidFileType"));
        resetStates();
      }
    },
    [resetStates, t]
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
      const msg = t("upload.errors.selectImageFirst");
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
        const msg = t("upload.errors.lowConfidence");
        console.log(
          "[PredictionUpload] low confidence returned:",
          result
        );
        setError(msg);
        setLiveMessage(msg);
        onPredictionFail?.(msg);
      } else {
        const payload = {
          breed: result.prediction || "Unknown Breed",
          id: result.prediction_id ?? null,
          previewUrl, // This is now a base64 data URL
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
      const msg = t("upload.errors.connectError");
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
    "backdrop-blur-md border shadow-xl px-10 py-14";
  const dragBoxExtra = "ring-2";

  return (
    <motion.section
      id="predict"
      className="py-16 font-archivo relative overflow-hidden"
      style={{ background: "var(--color-upload-bg)" }}
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
          className="text-4xl md:text-4xl font-alfa mb-8"
          style={{ color: "var(--color-upload-title)" }}
          align="center"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t("upload.title")}
        </motion.h3>

        <motion.div
          className={`${baseBox} ${glassBox} ${
            isDragging ? dragBoxExtra : ""
          } dz-focus`}
          style={{
            backgroundColor: "var(--color-upload-card-bg)",
            borderColor: "var(--color-upload-card-border)",
            boxShadow: "var(--color-upload-card-shadow)",
          }}
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
              <p
                className="text-2xl md:text-3xl font-archivo font-bold mb-3"
                style={{ color: "var(--color-upload-text-primary)" }}
              >
                Drag & drop an image
              </p>
              <p
                className="text-base mb-6"
                style={{ color: "var(--color-upload-text-secondary)" }}
              >
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
                  className="px-6 py-3 rounded-full font-alfa text-white shadow-md focus:outline-none focus:ring-4 focus:ring-purple-300/30 transition-all"
                  style={{
                    background: previewUrl
                      ? "var(--color-upload-btn-browse-selected)"
                      : "var(--color-upload-btn-browse)",
                  }}
                  whileHover={{ translateY: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {previewUrl ? "Change" : "Browse"}
                </motion.button>

                <motion.button
                  onClick={handlePrediction}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-full font-semibold shadow-md border hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all flex items-center gap-2"
                  style={{
                    backgroundColor: "var(--color-upload-btn-run-bg)",
                    color: "var(--color-upload-btn-run-text)",
                    borderColor: "var(--color-upload-btn-run-border)",
                  }}
                  whileHover={{ translateY: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      style={{ color: "var(--color-upload-spinner)" }}
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
                  <span>{isLoading ? t("upload.predicting") : "Run"}</span>
                </motion.button>

                {previewUrl && (
                  <button
                    onClick={resetStates}
                    className="ml-2 px-4 py-2 border rounded-full hover:bg-white focus:outline-none focus:ring-3 focus:ring-purple-200 transition"
                    style={{
                      backgroundColor: "var(--color-upload-btn-cancel-bg)",
                      color: "var(--color-upload-btn-cancel-text)",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div
                className="mt-2 text-sm flex flex-wrap gap-6"
                style={{ color: "var(--color-upload-text-hint)" }}
              >
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
                <div
                  className="h-1 w-full rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--color-upload-progress-bg)" }}
                >
                  <div
                    className="h-full transition-all"
                    style={{
                      background: "var(--color-upload-progress-fill)",
                      width: `${progress}%`,
                    }}
                  />
                </div>
                <div
                  className="text-xs mt-3"
                  style={{ color: "var(--color-upload-text-hint)" }}
                >
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
            className="mt-8 p-4 max-w-3xl mx-auto border rounded-2xl shadow relative overflow-hidden"
            style={{
              background: "var(--color-upload-error-bg)",
              color: "var(--color-upload-error-text)",
              borderColor: "var(--color-upload-error-border)",
            }}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="font-semibold">{error}</div>
            <button onClick={resetStates} className="mt-3 underline text-sm">
              {t("common.tryAgain")}
            </button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default PredictionUpload;






