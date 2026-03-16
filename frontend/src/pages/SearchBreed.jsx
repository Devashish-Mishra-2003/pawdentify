import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import Fuse from 'fuse.js';
import { motion, AnimatePresence } from 'framer-motion';
import { useBreedData } from '../contexts/BreedDataContext';
import BreedCard from '../components/BreedCard';
import BreedDetailModal from '../components/BreedDetailModal';
import breedImages from '../data/breed_images.json';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const SearchBreed = () => {
  const { t } = useTranslation();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const breedData = useBreedData();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topSearchedBreeds, setTopSearchedBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placeholder, setPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  
  const [filters, setFilters] = useState({ size: 'all', energy: 'all', grooming: 'all', children: 'all' });

  const breedsArray = Object.values(breedImages);
  const ALL_BREEDS = Array.isArray(breedData) ? breedData : (breedData.breeds || []);
  const FEATURED_BREEDS = [95, 26, 40, 77, 82, 55, 53, 64, 29, 25];
  const TYPING_TEXTS = ['Golden Retriever', 'German Shepherd', 'Labrador', 'Beagle', 'Bulldog'];

  const fuse = new Fuse(breedsArray, { keys: ['name'], threshold: 0.4, minMatchCharLength: 2 });

  const applyFilters = (breeds) => {
    return breeds.filter((breed) => {
      const bD = ALL_BREEDS.find(b => b.id === breed.id);
      if (!bD) return true;
      const mSize = filters.size === 'all' || bD.physical_traits?.size?.toLowerCase().includes(filters.size);
      const mEnergy = filters.energy === 'all' || bD.trainability_exercise?.energy_level?.toLowerCase().includes(filters.energy);
      const mGrooming = filters.grooming === 'all' || bD.care_grooming?.grooming_needs?.toLowerCase().includes(filters.grooming);
      const mChildren = filters.children === 'all' || (filters.children === 'yes' ? bD.social_traits?.good_with_kids?.toLowerCase().includes('yes') : bD.social_traits?.good_with_kids?.toLowerCase() === 'no');
      return mSize && mEnergy && mGrooming && mChildren;
    });
  };

  const handleFilterChange = (type, val) => setFilters(prev => ({ ...prev, [type]: val }));
  const clearFilters = () => setFilters({ size: 'all', energy: 'all', grooming: 'all', children: 'all' });
  const hasActiveFilters = Object.values(filters).some(f => f !== 'all');
  const shouldShowAllBreeds = hasActiveFilters && searchQuery.trim().length === 0;

  const allFilteredBreeds = useMemo(() => shouldShowAllBreeds ? applyFilters(breedsArray) : [], [shouldShowAllBreeds, filters]);

  useEffect(() => {
    if (isFocused) return;
    const interval = setTimeout(() => {
      const fullText = TYPING_TEXTS[loopNum % TYPING_TEXTS.length];
      if (isDeleting) {
        setPlaceholder(fullText.substring(0, placeholder.length - 1));
        if (placeholder === '') { setIsDeleting(false); setLoopNum(loopNum + 1); }
      } else {
        setPlaceholder(fullText.substring(0, placeholder.length + 1));
        if (placeholder === fullText) setTimeout(() => setIsDeleting(true), 2000);
      }
    }, isDeleting ? 50 : 100);
    return () => clearTimeout(interval);
  }, [placeholder, isDeleting, loopNum, isFocused]);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await fetch(`${API_URL}/api/breeds/top`);
        const data = await res.json();
        if (data.top_searched?.length) {
          setTopSearchedBreeds(data.top_searched.map(i => breedImages[i.breed_id]).filter(Boolean));
        } else {
          setTopSearchedBreeds(FEATURED_BREEDS.map(id => breedImages[id]).filter(Boolean));
        }
      } catch {
        setTopSearchedBreeds(FEATURED_BREEDS.map(id => breedImages[id]).filter(Boolean));
      } finally { setLoading(false); }
    };
    fetchTop();
  }, []);

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (!q.trim()) return setSearchResults([]);
    setSearchResults(applyFilters(fuse.search(q).map(r => r.item)));
  };

  const handleBreedClick = async (breed) => {
    setSelectedBreed(breed);
    try {
      const token = await getToken();
      await fetch(`${API_URL}/api/breeds/track`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ breed_id: String(breed.id), breed_name: breed.name })
      });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-transparent pt-40 pb-24 px-6 relative overflow-hidden">
      <div className="bg-blob blob-blue top-0 right-0 opacity-10"></div>
      <div className="bg-blob blob-purple -bottom-48 -left-48 opacity-10"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <span className="font-handwriting text-4xl text-[#30A7DB] mb-6 block">Encyclopedia</span>
          <h1 className="text-6xl md:text-8xl text-black dark:text-white mb-12 font-black tracking-tighter leading-none uppercase">
            Browse <span className="text-[#8c52ff]">Breeds.</span>
          </h1>
          
          <div className="relative group">
             <div className="absolute inset-0 bg-gradient-to-r from-[#30A7DB]/20 to-[#8c52ff]/20 blur-3xl rounded-full opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
             <input
               ref={inputRef}
               type="text"
               value={searchQuery}
               onChange={(e) => handleSearch(e.target.value)}
               onFocus={() => setIsFocused(true)}
               onBlur={() => setIsFocused(false)}
               placeholder={placeholder || "Search by breed name..."}
               className="relative w-full h-24 px-12 rounded-full border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-black text-3xl font-bold dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all shadow-2xl placeholder-gray-200 dark:placeholder-gray-800"
             />
             <div className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-black rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
          </div>
          
          {hasActiveFilters && (
             <button onClick={clearFilters} className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-red-500 hover:text-red-600">Reset All Filters</button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
           {['size', 'energy', 'grooming', 'children'].map((type) => (
              <div key={type} className="bento-card border-gray-100 dark:border-white/10 border-2 bg-white dark:bg-[#111111] px-8 py-6 hover:border-black dark:hover:border-white transition-all group">
                 <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-3 group-hover:text-[#30A7DB]">{type}</label>
                 <div className="relative">
                    <select 
                      value={filters[type]} 
                      onChange={(e) => handleFilterChange(type, e.target.value)}
                      className="w-full bg-transparent text-xl font-black text-black dark:text-white focus:outline-none cursor-pointer appearance-none relative z-10"
                    >
                       <option value="all">Any</option>
                       {type === 'size' && ['small', 'medium', 'large', 'giant'].map(o => <option key={o} value={o}>{o}</option>)}
                       {type === 'energy' && ['low', 'medium', 'high'].map(o => <option key={o} value={o}>{o}</option>)}
                       {type === 'grooming' && ['low', 'medium', 'high'].map(o => <option key={o} value={o}>{o}</option>)}
                       {type === 'children' && ['yes', 'no'].map(o => {
                          const label = o === 'yes' ? 'Kid Friendly' : 'Reserved';
                          return <option key={o} value={o}>{label}</option>
                       })}
                    </select>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                 </div>
              </div>
           ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={searchQuery ? 'results' : (shouldShowAllBreeds ? 'filtered' : 'featured')}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: "spring", damping: 25, stiffness: 100 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
             {(searchQuery ? searchResults : (shouldShowAllBreeds ? allFilteredBreeds : topSearchedBreeds)).map((breed, i) => (
                <motion.div 
                  key={breed.id} 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: i * 0.05 }}
                >
                   <BreedCard breed={breed} onClick={() => handleBreedClick(breed)} rank={!searchQuery && !hasActiveFilters ? i + 1 : null} />
                </motion.div>
             ))}
          </motion.div>
        </AnimatePresence>

        {!loading && !(searchQuery ? searchResults.length : (shouldShowAllBreeds ? allFilteredBreeds.length : topSearchedBreeds.length)) && (
          <div className="text-center py-40">
             <div className="inline-block p-10 bento-card border-dashed border-2 border-gray-200 dark:border-white/10">
                <h3 className="text-4xl font-black text-gray-200 dark:text-white/10 uppercase tracking-tighter">No Breeds Located.</h3>
                <p className="text-gray-400 dark:text-gray-600 mt-4 font-medium">Try broadening your search or resetting filters.</p>
             </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedBreed && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedBreed(null)}
          >
            <motion.div 
              className="w-full max-w-6xl bg-white dark:bg-[#050505] rounded-[40px] overflow-hidden relative shadow-2xl max-h-[95vh] overflow-y-auto border border-white/10"
              initial={{ scale: 0.9, y: 100, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-8 right-8 z-[110]">
                 <button onClick={() => setSelectedBreed(null)} className="w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              <BreedDetailModal breedId={selectedBreed.id} onClose={() => setSelectedBreed(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBreed;
