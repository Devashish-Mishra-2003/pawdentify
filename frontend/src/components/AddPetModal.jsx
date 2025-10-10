import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddPetModal({ isOpen, onClose, onSave }) {
  const { t } = useTranslation();
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petBirthday, setPetBirthday] = useState('');
  const [petImage, setPetImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setPetImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!petImage) {
      setError(t('dashboard.pets.addPetModal.imageRequired'));
      return;
    }

    if (!petName.trim()) {
      setError('Pet name is required');
      return;
    }

    if (!petBreed.trim()) {
      setError('Pet breed is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSave({
        name: petName,
        breed: petBreed,
        birthday: petBirthday,
        image: petImage,
        imagePreview: imagePreview
      });

      // Reset form only after successful save
      setPetName('');
      setPetBreed('');
      setPetBirthday('');
      setPetImage(null);
      setImagePreview(null);
      setError('');
    } catch (err) {
      setError('Failed to add pet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing while submitting
    
    setPetName('');
    setPetBreed('');
    setPetBirthday('');
    setPetImage(null);
    setImagePreview(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          overflowY: 'auto'
        }}
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="rounded-2xl shadow-2xl w-full max-w-md"
          style={{
            backgroundColor: 'var(--color-auth-card-bg)',
            border: '1px solid var(--color-auth-card-border)',
            marginTop: '2rem',
            marginBottom: '2rem',
            maxHeight: 'calc(100vh - 4rem)',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
        >
          {/* Scrollable Content */}
          <div 
            className="p-8"
            style={{ 
              overflowY: 'auto',
              flex: 1
            }}
          >
            <h2 
              className="text-2xl mb-6"
              style={{ color: 'var(--color-auth-title)' }}
            >
              {t('dashboard.pets.addPetModal.title')}
            </h2>

            {error && (
              <motion.div 
                className="mb-4 p-3 rounded-lg text-sm flex items-start gap-2"
                style={{ 
                  backgroundColor: 'var(--color-upload-error-bg)',
                  color: 'var(--color-upload-error-text)',
                  border: '1px solid var(--color-upload-error-border)'
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Pet Name */}
              <div>
                <label 
                  className="block text-sm mb-2"
                  style={{ color: 'var(--color-auth-title)' }}
                >
                  {t('dashboard.pets.addPetModal.petName')}
                </label>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--clerk-color-input-bg)',
                    color: 'var(--clerk-color-text-primary)',
                    border: '1px solid var(--clerk-color-input-border)',
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                  placeholder={t('dashboard.pets.addPetModal.petNamePlaceholder')}
                />
              </div>

              {/* Pet Breed */}
              <div>
                <label 
                  className="block text-sm mb-2"
                  style={{ color: 'var(--color-auth-title)' }}
                >
                  {t('dashboard.pets.addPetModal.petBreed')}
                </label>
                <input
                  type="text"
                  value={petBreed}
                  onChange={(e) => setPetBreed(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--clerk-color-input-bg)',
                    color: 'var(--clerk-color-text-primary)',
                    border: '1px solid var(--clerk-color-input-border)',
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                  placeholder={t('dashboard.pets.addPetModal.petBreedPlaceholder')}
                />
              </div>

              {/* Pet Birthday */}
              <div>
                <label 
                  className="block text-sm mb-2"
                  style={{ color: 'var(--color-auth-title)' }}
                >
                  {t('dashboard.pets.addPetModal.petBirthday')}
                </label>
                <input
                  type="date"
                  value={petBirthday}
                  onChange={(e) => setPetBirthday(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--clerk-color-input-bg)',
                    color: 'var(--clerk-color-text-primary)',
                    border: '1px solid var(--clerk-color-input-border)',
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                />
              </div>

              {/* Pet Image */}
              <div>
                <label 
                  className="block text-sm mb-2"
                  style={{ color: 'var(--color-auth-title)' }}
                >
                  {t('dashboard.pets.addPetModal.petImage')}
                </label>
                
                <div className="flex flex-col items-center gap-4">
                  <AnimatePresence mode="wait">
                    {imagePreview && (
                      <motion.img 
                        key="preview"
                        src={imagePreview} 
                        alt="Pet preview" 
                        className="w-full h-48 object-cover rounded-lg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <label 
                    className="w-full px-4 py-3 rounded-lg text-center cursor-pointer transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: imagePreview ? 'rgba(140, 82, 255, 0.1)' : '#8c52ff',
                      color: imagePreview ? '#8c52ff' : 'white',
                      border: imagePreview ? '2px solid #8c52ff' : 'none',
                      pointerEvents: isSubmitting ? 'none' : 'auto'
                    }}
                  >
                    {imagePreview ? t('dashboard.pets.addPetModal.changeImage') : t('dashboard.pets.addPetModal.uploadImage')}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Fixed Buttons at Bottom */}
          <div 
            className="p-6 border-t" 
            style={{ 
              borderColor: 'var(--color-auth-divider)',
              flexShrink: 0
            }}
          >
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--color-auth-subtitle)',
                  border: '1px solid var(--color-auth-card-border)'
                }}
              >
                {t('dashboard.pets.addPetModal.cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-lg text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#8c52ff',
                  boxShadow: '0 4px 14px rgba(140, 82, 255, 0.4)'
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{t('dashboard.pets.addPetModal.saving')}</span>
                  </>
                ) : (
                  t('dashboard.pets.addPetModal.save')
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}






