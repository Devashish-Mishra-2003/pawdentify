import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export default function PetDetailsModal({ isOpen, onClose, pet, onAddNote, onDeleteNote, onDelete }) {
  const { t } = useTranslation();
  const [newNote, setNewNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('other');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!isOpen || !pet) return null;

  const getPetId = () => pet._id || pet.id;

  const categories = [
    { value: 'health', label: t('dashboard.pets.petDetails.categories.health'), color: '#F07E7E' },
    { value: 'vaccination', label: t('dashboard.pets.petDetails.categories.vaccination'), color: '#30A7DB' },
    { value: 'treats', label: t('dashboard.pets.petDetails.categories.treats'), color: '#F9C851' },
    { value: 'dailyLife', label: t('dashboard.pets.petDetails.categories.dailyLife'), color: '#10b981' },
    { value: 'milestone', label: t('dashboard.pets.petDetails.categories.milestone'), color: '#8b5cf6' },
    { value: 'other', label: t('dashboard.pets.petDetails.categories.other'), color: '#6b7280' }
  ];

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(getPetId(), newNote, selectedCategory);
      setNewNote('');
      setSelectedCategory('other');
      setShowNoteInput(false);
    }
  };

  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const birth = new Date(birthday);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    const years = Math.floor(months / 12);
    if (years > 0) return `${years} ${t('dashboard.pets.yearsOld')}`;
    return `${months % 12} ${t('dashboard.pets.monthsOld')}`;
  };

  const filteredNotes = (pet.notes || []).filter(note => 
    filterCategory === 'all' ? true : note.category === filterCategory
  );

  const inputClass = "w-full px-6 py-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#30A7DB] transition-all font-semibold shadow-inner";
  const labelClass = "block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2 px-2";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 backdrop-blur-xl overflow-y-auto no-scrollbar"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-3xl bg-white dark:bg-[#050505] rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-white/10 my-8 overflow-hidden relative flex flex-col"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        >
          {/* Hero Section */}
          <div className="relative h-96 flex-shrink-0">
             <img 
               src={pet.image_url || pet.image} 
               alt={pet.name}
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
             
             {/* Close Button */}
             <button 
               onClick={onClose}
               className="absolute top-8 right-8 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[#F07E7E] transition-all z-20"
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>

             {/* Bio Overlay */}
             <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
                <div className="drop-shadow-2xl">
                   <p className="font-handwriting text-3xl text-[#30A7DB] mb-2 block" style={{ color: '#30A7DB', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Our Companion</p>
                   <h2 className="text-5xl md:text-7xl font-black leading-[0.8] tracking-tighter uppercase" style={{ color: 'white', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{pet.name}</h2>
                </div>
                <div className="flex gap-4">
                   <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 min-w-[120px] shadow-lg">
                      <span className="block text-[8px] font-black uppercase text-white/60 tracking-widest mb-1">Breed</span>
                      <span className="font-bold block" style={{ color: 'white' }}>{pet.breed}</span>
                   </div>
                   {pet.birthday && (
                     <div className="bg-[#30A7DB]/20 backdrop-blur-md border border-[#30A7DB]/30 rounded-3xl p-4 min-w-[120px] shadow-lg">
                        <span className="block text-[8px] font-black uppercase text-[#30A7DB]/80 tracking-widest mb-1">Age</span>
                        <span className="font-bold block" style={{ color: 'white' }}>{calculateAge(pet.birthday)}</span>
                     </div>
                   )}
                </div>
             </div>
          </div>

          <div className="p-10 flex flex-col gap-10 overflow-visible">
            {/* Journal Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-2 h-12 bg-[#8c52ff] rounded-full"></div>
                  <h3 className="text-4xl font-black text-black dark:text-white tracking-tight uppercase leading-none">Pet Journal</h3>
               </div>
               
               <div className="flex gap-3">
                 {onDelete && (
                   <button
                     onClick={onDelete}
                     className="pill-button bg-red-50 dark:bg-red-900/10 text-red-500 border-2 border-red-100 dark:border-red-900/20 px-8 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all shadow-none"
                   >
                     Remove Pet
                   </button>
                 )}
                 <button
                   onClick={() => setShowNoteInput(!showNoteInput)}
                   className="pill-button bg-[#8c52ff] text-white py-4 px-8 shadow-[0_20px_40px_rgba(140,82,255,0.3)] hover:-translate-y-1"
                 >
                   {t('dashboard.pets.petDetails.addNote')}
                 </button>
               </div>
            </div>

            {/* Note Input Form */}
            <AnimatePresence>
              {showNoteInput && (
                <motion.div 
                  className="bento-card border-2 border-[#8c52ff20] bg-[#8c52ff05] p-8 space-y-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                         <label className={labelClass}>{t('dashboard.pets.petDetails.noteCategory')}</label>
                         <select
                           value={selectedCategory}
                           onChange={(e) => setSelectedCategory(e.target.value)}
                           className={inputClass}
                         >
                           {categories.map(cat => (
                             <option key={cat.value} value={cat.value}>{cat.label}</option>
                           ))}
                         </select>
                      </div>
                      <div className="md:col-span-2">
                         <label className={labelClass}>Note Content</label>
                         <input
                           type="text"
                           value={newNote}
                           onChange={(e) => setNewNote(e.target.value)}
                           placeholder={t('dashboard.pets.petDetails.notePlaceholder')}
                           className={inputClass}
                         />
                      </div>
                   </div>
                   <div className="flex gap-4 justify-end">
                      <button onClick={() => setShowNoteInput(false)} className="text-gray-400 font-bold hover:text-black dark:hover:text-white px-6">Cancel</button>
                      <button onClick={handleAddNote} className="pill-button bg-black dark:bg-white text-white dark:text-black px-10 py-4">Save Entry</button>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter Chips - Hidden Scrollbar */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
               <button 
                 onClick={() => setFilterCategory('all')}
                 className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${filterCategory === 'all' ? 'bg-[#30A7DB] border-[#30A7DB] text-white shadow-lg' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 hover:border-gray-200'}`}
               >
                 All Entries
               </button>
               {categories.map(cat => (
                  <button 
                    key={cat.value}
                    onClick={() => setFilterCategory(cat.value)}
                    className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${filterCategory === cat.value ? 'shadow-lg' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 hover:border-gray-200'}`}
                    style={{ 
                      borderColor: filterCategory === cat.value ? cat.color : '',
                      backgroundColor: filterCategory === cat.value ? `${cat.color}15` : '',
                      color: filterCategory === cat.value ? cat.color : '',
                      boxShadow: filterCategory === cat.value ? `0 10px 20px ${cat.color}20` : ''
                    }}
                  >
                    {cat.label}
                  </button>
               ))}
            </div>

            {/* Notes Body */}
            <div className="space-y-6 mb-8 min-h-[200px]">
              <AnimatePresence mode="popLayout">
                {filteredNotes.length > 0 ? (
                  [...filteredNotes].reverse().map((note, i) => {
                    const category = categories.find(c => c.value === note.category);
                    return (
                      <motion.div 
                        key={note.id || i}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bento-card border-gray-100 dark:border-white/10 border-2 bg-white dark:bg-[#111111] p-8 relative overflow-hidden group shadow-sm"
                      >
                         <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: category?.color }} />
                         <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: category?.color }}>{category?.label}</span>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-white/5 px-3 py-1 rounded-full">
                               {note.date ? new Date(note.date).toLocaleDateString() : 'Just now'}
                            </span>
                         </div>
                         <p className="text-xl text-black dark:text-white font-bold leading-snug mb-4">{note.text}</p>
                         <button
                           onClick={() => onDeleteNote && onDeleteNote(getPetId(), note.id)}
                           className="text-[10px] font-black uppercase tracking-widest text-[#F07E7E] opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                         >
                           Revoke Entry &times;
                         </button>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="bento-card border-dashed border-2 border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 py-24 text-center">
                     <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] italic">Your companion's journal is empty.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="p-10 pt-0 flex-shrink-0 mt-auto">
             <button
               onClick={onClose}
               className="w-full pill-button bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white border-0 shadow-none py-6 font-black uppercase tracking-widest text-xs"
             >
               Return to Gallery
             </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
