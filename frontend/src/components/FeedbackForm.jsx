import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const FeedbackForm = ({ prediction }) => {
  const { t } = useTranslation();
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [vote, setVote] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
  const formRef = useRef(null);

  // Close form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
        setVote(null);
        setMessage('');
        setError(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleVoteClick = (voteType) => {
    setVote(voteType);
    setIsOpen(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setTimeout(() => {
      setVote(null);
      setMessage('');
      setError(null);
    }, 300); // Wait for animation to complete before clearing state
  };

  const handleSubmit = async () => {
    if (!vote) {
      setError(t('feedback.selectVoteError'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prediction,
          vote,
          message
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setHasSubmittedFeedback(true); // Mark as submitted permanently
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || t('feedback.submitError'));
      }
    } catch (err) {
      setError(t('feedback.networkError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render anything if user has already submitted feedback
  if (hasSubmittedFeedback) {
    return null;
  }

  return (
    <div ref={formRef} className="flex flex-col items-end gap-3">
      {/* Vote Buttons - Always Visible */}
      <div className="flex items-center gap-2">
        <span className="text-sm mr-2" style={{ color: 'var(--color-feedback-label)', opacity: 0.7 }}>
          {t('feedback.helpfulQuestion')}
        </span>
        <motion.button
          onClick={() => handleVoteClick('upvote')}
          className="w-9 h-9 rounded-full transition-all flex items-center justify-center"
          style={{
            backgroundColor: vote === 'upvote' ? 'var(--color-feedback-upvote-active-bg)' : 'transparent',
            border: '1.5px solid',
            borderColor: vote === 'upvote' ? 'var(--color-feedback-upvote-active-border)' : 'var(--color-feedback-btn-border)',
            opacity: vote === 'upvote' ? 1 : 0.6
          }}
          whileHover={{ 
            scale: 1.1,
            opacity: 1,
            backgroundColor: 'var(--color-feedback-upvote-active-bg)',
            borderColor: 'var(--color-feedback-upvote-active-border)'
          }}
          whileTap={{ scale: 0.95 }}
          animate={vote === 'upvote' ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          } : {}}
          transition={{ duration: 0.4 }}
        >
          <span className="text-lg">👍</span>
        </motion.button>

        <motion.button
          onClick={() => handleVoteClick('downvote')}
          className="w-9 h-9 rounded-full transition-all flex items-center justify-center"
          style={{
            backgroundColor: vote === 'downvote' ? 'var(--color-feedback-downvote-active-bg)' : 'transparent',
            border: '1.5px solid',
            borderColor: vote === 'downvote' ? 'var(--color-feedback-downvote-active-border)' : 'var(--color-feedback-btn-border)',
            opacity: vote === 'downvote' ? 1 : 0.6
          }}
          whileHover={{ 
            scale: 1.1,
            opacity: 1,
            backgroundColor: 'var(--color-feedback-downvote-active-bg)',
            borderColor: 'var(--color-feedback-downvote-active-border)'
          }}
          whileTap={{ scale: 0.95 }}
          animate={vote === 'downvote' ? { 
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, 0]
          } : {}}
          transition={{ duration: 0.4 }}
        >
          <span className="text-lg">👎</span>
        </motion.button>
      </div>

      {/* Expanded Form - Appears Below Buttons */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="rounded-xl p-6 shadow-2xl border w-full max-w-md overflow-hidden"
            style={{
              backgroundColor: 'var(--color-feedback-container-bg)',
              borderColor: 'var(--color-feedback-container-border)'
            }}
            initial={{ opacity: 0, height: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', y: 0, scale: 1 }}
            exit={{ opacity: 0, height: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
              height: {
                duration: 0.3
              }
            }}
          >
            {submitted ? (
              <motion.div 
                className="text-center py-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                <motion.div 
                  className="text-4xl mb-3"
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 0.6 }}
                >
                  🎉
                </motion.div>
                <p className="text-lg font-medium" style={{ color: 'var(--color-feedback-success-text)' }}>
                  {t('feedback.thankYou')}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {/* Selected Vote Display */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: 'var(--color-feedback-container-border)' }}>
                  <motion.span 
                    className="text-3xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                  >
                    {vote === 'upvote' ? '👍' : '👎'}
                  </motion.span>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--color-feedback-label)' }}>
                      {t('feedback.youSelected')}
                    </p>
                    <p className="font-medium" style={{ color: 'var(--color-feedback-title)' }}>
                      {vote === 'upvote' ? t('feedback.upvote') : t('feedback.downvote')}
                    </p>
                  </div>
                </div>

                {/* Message Textarea */}
                <motion.div 
                  className="mb-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-feedback-label)' }}>
                    {t('feedback.additionalFeedback')}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('feedback.placeholder')}
                    className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:border-transparent"
                    style={{
                      borderColor: 'var(--color-feedback-textarea-border)',
                      backgroundColor: 'var(--color-feedback-container-bg)',
                      color: 'var(--color-feedback-title)',
                      '--tw-ring-color': 'var(--color-feedback-textarea-focus-ring)'
                    }}
                    rows={3}
                    autoFocus
                  />
                </motion.div>

                {error && (
                  <motion.p 
                    className="text-sm mb-4" 
                    style={{ color: 'var(--color-feedback-error)' }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {error}
                  </motion.p>
                )}

                {/* Action Buttons */}
                <motion.div 
                  className="flex gap-3"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors border"
                    style={{
                      borderColor: 'var(--color-feedback-btn-border)',
                      backgroundColor: 'var(--color-feedback-btn-bg)',
                      color: 'var(--color-feedback-title)'
                    }}
                  >
                    {t('feedback.cancel')}
                  </button>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: 'var(--color-feedback-submit-bg)',
                      color: 'var(--color-feedback-submit-text)'
                    }}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.backgroundColor = 'var(--color-feedback-submit-hover-bg)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-feedback-submit-bg)';
                    }}
                  >
                    {isSubmitting ? t('feedback.submitting') : t('feedback.submitButton')}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackForm;




