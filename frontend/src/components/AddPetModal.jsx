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
    if (!petImage) { setError(t('dashboard.pets.addPetModal.imageRequired')); return; }
    if (!petName.trim()) { setError('Pet name is required'); return; }
    if (!petBreed.trim()) { setError('Pet breed is required'); return; }

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
      setPetName(''); setPetBreed(''); setPetBirthday(''); setPetImage(null); setImagePreview(null); setError('');
    } catch (err) {
      setError('Failed to add pet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setPetName(''); setPetBreed(''); setPetBirthday(''); setPetImage(null); setImagePreview(null); setError('');
    onClose();
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-6 py-5 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#30A7DB] transition-all font-semibold shadow-inner";
  const labelClass = "block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3 px-2";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 backdrop-blur-xl no-scrollbar overflow-y-auto"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-xl bg-white dark:bg-[#050505] rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-white/10 my-8 flex flex-col overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        >
          {/* Decorative Blobs */}
          <div className="bg-blob blob-purple opacity-10 -right-20 -top-20 scale-75"></div>
          <div className="bg-blob blob-blue opacity-10 -left-20 -bottom-20 scale-75"></div>

          {/* Header */}
          <div className="px-10 pt-12 pb-8 flex items-start justify-between relative z-10">
            <div>
               <span className="font-handwriting text-3xl text-[#30A7DB] mb-2 block">New Companion!</span>
               <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white leading-[0.9] tracking-tighter">
                 Add Your Pet.
               </h2>
            </div>
            <button
              onClick={handleClose}
              className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-[#F07E7E] hover:text-white transition-all transform hover:rotate-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="px-10 pb-10 overflow-y-auto no-scrollbar relative z-10 space-y-8">
            {error && (
              <motion.div
                className="p-5 rounded-3xl bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-100 dark:border-red-900/30 text-sm font-bold flex items-center gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                   </svg>
                </div>
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className={labelClass}>{t('dashboard.pets.addPetModal.petName')}</label>
                 <input
                   type="text"
                   value={petName}
                   onChange={(e) => setPetName(e.target.value)}
                   disabled={isSubmitting}
                   required
                   className={inputClass}
                   placeholder={t('dashboard.pets.addPetModal.petNamePlaceholder') || "e.g., Max, Luna"}
                 />
               </div>
               <div>
                 <label className={labelClass}>{t('dashboard.pets.addPetModal.petBreed')}</label>
                 <input
                   type="text"
                   value={petBreed}
                   onChange={(e) => setPetBreed(e.target.value)}
                   disabled={isSubmitting}
                   required
                   className={inputClass}
                   placeholder={t('dashboard.pets.addPetModal.petBreedPlaceholder') || "e.g., Golden Retriever"}
                 />
               </div>
            </div>

            <div>
              <label className={labelClass}>{t('dashboard.pets.addPetModal.petBirthday')}</label>
              <input
                type="date"
                value={petBirthday}
                onChange={(e) => setPetBirthday(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                disabled={isSubmitting}
                className={inputClass}
              />
            </div>

            <div className="bento-card bg-gray-50/50 dark:bg-white/5 border-dashed border-2 border-gray-200 dark:border-white/10 p-8">
               <label className={labelClass.replace('mb-3', 'mb-4')}>Pet Photo</label>
               <div className="flex flex-col items-center gap-6">
                 <AnimatePresence mode="wait">
                   {imagePreview ? (
                     <motion.div
                       key="preview"
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.9 }}
                       className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/10"
                     >
                       <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                       <button 
                         type="button"
                         onClick={() => { setPetImage(null); setImagePreview(null); }}
                         className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black transition-colors"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                       </button>
                     </motion.div>
                   ) : (
                     <motion.label 
                       key="upload"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="w-full h-40 rounded-3xl border-2 border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-white/5 transition-all group"
                     >
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-[#8c52ff] mb-4 group-hover:scale-110 transition-transform">
                           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Tap to Upload</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                     </motion.label>
                   )}
                 </AnimatePresence>
               </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 pill-button bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white border-0 shadow-none py-5"
              >
                {t('dashboard.pets.addPetModal.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-2 pill-button bg-[#8c52ff] text-white py-5 shadow-[0_20px_40px_rgba(140,82,255,0.3)] hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
                  t('dashboard.pets.addPetModal.save') || 'Explore Together'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
