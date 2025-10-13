import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import Fuse from 'fuse.js';
import { motion, AnimatePresence } from 'framer-motion';
import BreedCard from '../components/BreedCard';
import BreedDetailModal from '../components/BreedDetailModal';
import breedImages from '../data/breed_images.json';
import BREEDS_JSON from '../pawdentify_final_corrected.json';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const SearchBreed = () => {
  const { t } = useTranslation();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topSearchedBreeds, setTopSearchedBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placeholder, setPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  
  // Filter state (removed shedding)
  const [filters, setFilters] = useState({
    size: 'all',
    energy: 'all',
    grooming: 'all',
    children: 'all'
  });

  // Convert breed_images object to array for Fuse.js
  const breedsArray = Object.values(breedImages);
  const ALL_BREEDS = Array.isArray(BREEDS_JSON) ? BREEDS_JSON : (BREEDS_JSON.breeds || []);

  // Featured breeds for initial display
  const FEATURED_BREEDS = [95, 26, 40, 77, 82, 55, 53, 64, 29, 25];
  
  // Random breed suggestions for pills
  const BREED_SUGGESTIONS = [
    'Golden Retriever',
    'German Shepherd', 
    'Labrador Retriever',
    'French Bulldog',
    'Beagle',
    'Poodle',
    'Rottweiler',
    'Bulldog',
    'Yorkshire Terrier',
    'Boxer'
  ];

  // Typing animation texts
  const TYPING_TEXTS = [
    'Golden Retriever',
    'German Shepherd',
    'Labrador',
    'Beagle',
    'Bulldog'
  ];

  // Initialize Fuse.js for fuzzy search
  const fuse = new Fuse(breedsArray, {
    keys: ['name'],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2
  });

  // Filter breeds by criteria (removed shedding)
  const applyFilters = (breeds) => {
    return breeds.filter((breed) => {
      const breedData = ALL_BREEDS.find(b => b.id === breed.id);
      if (!breedData) return true;

      // Size filter
      const matchesSize = filters.size === 'all' || 
                         breedData.physical_traits?.size?.toLowerCase().includes(filters.size);

      // Energy filter
      const matchesEnergy = filters.energy === 'all' || 
                           breedData.trainability_exercise?.energy_level?.toLowerCase().includes(filters.energy);

      // Grooming filter
      const matchesGrooming = filters.grooming === 'all' || 
                             breedData.care_grooming?.grooming_needs?.toLowerCase().includes(filters.grooming);

      // Children filter
      const matchesChildren = filters.children === 'all' || 
                             (filters.children === 'yes' 
                               ? breedData.social_traits?.good_with_kids?.toLowerCase().includes('yes') || breedData.social_traits?.good_with_kids?.toLowerCase() === 'moderate'
                               : breedData.social_traits?.good_with_kids?.toLowerCase() === 'no');

      return matchesSize && matchesEnergy && matchesGrooming && matchesChildren;
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      size: 'all',
      energy: 'all',
      grooming: 'all',
      children: 'all'
    });
  };

  const hasActiveFilters = Object.values(filters).some(f => f !== 'all');

  // Check if we should show all breeds (filters active, no search)
  const shouldShowAllBreeds = hasActiveFilters && searchQuery.trim().length === 0;

  // Get all filtered breeds when filters are active
  const allFilteredBreeds = useMemo(() => {
    if (!shouldShowAllBreeds) return [];
    return applyFilters(breedsArray);
  }, [shouldShowAllBreeds, filters]);

  // Typing animation effect
  useEffect(() => {
    if (isFocused) return;

    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 2000;

    const handleTyping = () => {
      const currentIndex = loopNum % TYPING_TEXTS.length;
      const fullText = TYPING_TEXTS[currentIndex];

      if (isDeleting) {
        setPlaceholder(fullText.substring(0, placeholder.length - 1));
        
        if (placeholder === '') {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
        }
      } else {
        setPlaceholder(fullText.substring(0, placeholder.length + 1));
        
        if (placeholder === fullText) {
          setTimeout(() => setIsDeleting(true), pauseDuration);
          return;
        }
      }
    };

    const timer = setTimeout(
      handleTyping,
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, loopNum, isFocused]);

  // Fetch top 10 searched breeds on mount
  useEffect(() => {
    fetchTopSearchedBreeds();
  }, []);

  const fetchTopSearchedBreeds = async () => {
    try {
      const response = await fetch(`${API_URL}/api/breeds/top`);
      const data = await response.json();
      
      if (data.top_searched && data.top_searched.length > 0) {
        const topBreeds = data.top_searched.map(item => {
          const breed = breedImages[item.breed_id];
          return breed ? { ...breed, searchCount: item.count } : null;
        }).filter(Boolean);
        
        setTopSearchedBreeds(topBreeds);
      } else {
        const featured = FEATURED_BREEDS.map(id => breedImages[id]).filter(Boolean);
        setTopSearchedBreeds(featured);
      }
    } catch (error) {
      console.error('Error fetching top breeds:', error);
      const featured = FEATURED_BREEDS.map(id => breedImages[id]).filter(Boolean);
      setTopSearchedBreeds(featured);
    } finally {
      setLoading(false);
    }
  };

  // Get 3 random breed suggestions
  const getRandomSuggestions = () => {
    const shuffled = [...BREED_SUGGESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const [suggestions] = useState(getRandomSuggestions());

  // Handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const results = fuse.search(query);
    const breeds = results.slice(0, 12).map(result => result.item);
    const filtered = applyFilters(breeds);
    setSearchResults(filtered);
  };

  // Re-apply filters when they change
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      handleSearch(searchQuery);
    }
  }, [filters]);

  // Handle suggestion pill click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  // Handle breed selection
  const handleBreedClick = async (breed) => {
    setSelectedBreed(breed);

    try {
      const token = await getToken();
      await fetch(`${API_URL}/api/breeds/track`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          breed_id: String(breed.id),
          breed_name: breed.name
        })
      });
    } catch (error) {
      console.error('Error tracking breed search:', error);
    }
  };

  // Close breed info modal
  const handleCloseBreedInfo = () => {
    setSelectedBreed(null);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handle input blur
  const handleBlur = () => {
    setIsFocused(false);
    if (!searchQuery) {
      setPlaceholder('');
      setIsDeleting(false);
      setLoopNum(0);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ paddingTop: '120px' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.h1 
            className="text-5xl mb-4"
            style={{ color: 'var(--color-text-primary)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('searchBreed.title')}
          </motion.h1>
          
          <motion.h4 
            className="text-base font-archivo"
            style={{ color: '#6b7280', fontWeight: 'bold' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t('searchBreed.subtitle')}
          </motion.h4>
        </motion.div>

        {/* Search Bar with Typing Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-6"
        >
          <div className="max-w-2xl mx-auto relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              className="w-full px-6 py-4 rounded-full border-2 text-lg focus:outline-none focus:ring-2 transition-all font-archivo search-input"
              style={{
                backgroundColor: 'var(--color-input-bg)',
                borderColor: 'var(--color-input-border)',
                color: 'var(--color-text-primary)',
                '--tw-ring-color': 'var(--color-primary)'
              }}
            />
          </div>
        </motion.div>

        {/* Suggestion Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-5 py-2.5 rounded-full shadow-md flex items-center gap-2"
              style={{
                backgroundColor: searchQuery === suggestion 
                  ? 'var(--color-services-category-btn-active-bg)' 
                  : 'var(--color-services-category-btn-bg)',
                color: searchQuery === suggestion 
                  ? 'var(--color-services-category-btn-active-text)' 
                  : 'var(--color-services-category-btn-text)',
                border: '2px solid var(--color-services-category-btn-border)',
                fontWeight: 'bold'
              }}
              whileHover={{ 
                scale: 1.05,
                y: -4,
                boxShadow: '0 8px 20px rgba(140, 82, 255, 0.3)'
              }}
              whileTap={{ 
                scale: 0.95,
                y: 0
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>{suggestion}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Filters Section (4 filters now) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            backgroundColor: 'var(--color-filter-bg)',
            border: '2px solid var(--color-filter-border)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-alfa" style={{ color: 'var(--color-text-primary)' }}>
              {t('breeds.search.filters.title')}
            </h2>
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              style={{
                backgroundColor: 'var(--color-filter-button-bg)',
                color: 'var(--color-filter-button-text)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontFamily: 'Archivo, sans-serif',
                fontWeight: '600',
                cursor: hasActiveFilters ? 'pointer' : 'not-allowed',
                opacity: hasActiveFilters ? 1 : 0.5,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (hasActiveFilters) {
                  e.target.style.backgroundColor = 'var(--color-filter-button-hover-bg)';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-filter-button-bg)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {t('breeds.search.filters.clear')}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Size Filter */}
            <div>
              <label className="block mb-2" style={{ 
                color: 'var(--color-filter-label)',
                fontFamily: 'Archivo, sans-serif',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                {t('breeds.search.filters.size.label')}
              </label>
              <select
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                className="w-full"
                style={{
                  backgroundColor: 'var(--color-filter-select-bg)',
                  border: '2px solid var(--color-filter-select-border)',
                  color: 'var(--color-filter-select-text)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: '600'
                }}
              >
                <option value="all">{t('breeds.search.filters.size.all')}</option>
                <option value="small">{t('breeds.search.filters.size.small')}</option>
                <option value="medium">{t('breeds.search.filters.size.medium')}</option>
                <option value="large">{t('breeds.search.filters.size.large')}</option>
                <option value="giant">{t('breeds.search.filters.size.giant')}</option>
              </select>
            </div>

            {/* Energy Filter */}
            <div>
              <label className="block mb-2" style={{ 
                color: 'var(--color-filter-label)',
                fontFamily: 'Archivo, sans-serif',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                {t('breeds.search.filters.energy.label')}
              </label>
              <select
                value={filters.energy}
                onChange={(e) => handleFilterChange('energy', e.target.value)}
                className="w-full"
                style={{
                  backgroundColor: 'var(--color-filter-select-bg)',
                  border: '2px solid var(--color-filter-select-border)',
                  color: 'var(--color-filter-select-text)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: '600'
                }}
              >
                <option value="all">{t('breeds.search.filters.energy.all')}</option>
                <option value="low">{t('breeds.search.filters.energy.low')}</option>
                <option value="medium">{t('breeds.search.filters.energy.medium')}</option>
                <option value="high">{t('breeds.search.filters.energy.high')}</option>
              </select>
            </div>

            {/* Grooming Filter */}
            <div>
              <label className="block mb-2" style={{ 
                color: 'var(--color-filter-label)',
                fontFamily: 'Archivo, sans-serif',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                {t('breeds.search.filters.grooming.label')}
              </label>
              <select
                value={filters.grooming}
                onChange={(e) => handleFilterChange('grooming', e.target.value)}
                className="w-full"
                style={{
                  backgroundColor: 'var(--color-filter-select-bg)',
                  border: '2px solid var(--color-filter-select-border)',
                  color: 'var(--color-filter-select-text)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: '600'
                }}
              >
                <option value="all">{t('breeds.search.filters.grooming.all')}</option>
                <option value="low">{t('breeds.search.filters.grooming.low')}</option>
                <option value="medium">{t('breeds.search.filters.grooming.medium')}</option>
                <option value="high">{t('breeds.search.filters.grooming.high')}</option>
              </select>
            </div>

            {/* Children Filter */}
            <div>
              <label className="block mb-2" style={{ 
                color: 'var(--color-filter-label)',
                fontFamily: 'Archivo, sans-serif',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                {t('breeds.search.filters.children.label')}
              </label>
              <select
                value={filters.children}
                onChange={(e) => handleFilterChange('children', e.target.value)}
                className="w-full"
                style={{
                  backgroundColor: 'var(--color-filter-select-bg)',
                  border: '2px solid var(--color-filter-select-border)',
                  color: 'var(--color-filter-select-text)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: '600'
                }}
              >
                <option value="all">{t('breeds.search.filters.children.all')}</option>
                <option value="yes">{t('breeds.search.filters.children.yes')}</option>
                <option value="no">{t('breeds.search.filters.children.no')}</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (value !== 'all') {
                  return (
                    <span 
                      key={key}
                      style={{
                        backgroundColor: 'var(--color-filter-badge-bg)',
                        color: 'var(--color-filter-badge-text)',
                        border: '1px solid var(--color-filter-badge-border)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {t(`breeds.search.filters.${key}.label`)}: {t(`breeds.search.filters.${key}.${value}`)}
                      <button
                        onClick={() => handleFilterChange(key, 'all')}
                        style={{ cursor: 'pointer', marginLeft: '0.25rem' }}
                      >
                        ×
                      </button>
                    </span>
                  );
                }
                return null;
              })}
            </div>
          )}
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {searchQuery.trim().length > 0 ? (
            // Search Results
            <motion.div
              key="search-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.h3 
                className="text-3xl mb-8"
                style={{ color: 'var(--color-text-primary)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {t('searchBreed.searchResults')} ({searchResults.length})
              </motion.h3>
              
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {searchResults.map((breed, index) => (
                    <motion.div
                      key={breed.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <BreedCard
                        breed={breed}
                        onClick={() => handleBreedClick(breed)}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p 
                    className="text-xl font-archivo"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {t('searchBreed.noResults')}
                  </p>
                </div>
              )}
            </motion.div>
          ) : shouldShowAllBreeds ? (
            // All Breeds (when filters active, no search)
            <motion.div
              key="all-filtered-breeds"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.h3 
                className="text-3xl mb-8"
                style={{ color: 'var(--color-text-primary)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {t('breeds.search.results.showing')} {allFilteredBreeds.length} {t('breeds.search.results.breeds')}
              </motion.h3>

              {allFilteredBreeds.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {allFilteredBreeds.map((breed, index) => (
                    <motion.div
                      key={breed.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02, duration: 0.5 }}
                    >
                      <BreedCard
                        breed={breed}
                        onClick={() => handleBreedClick(breed)}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p 
                    className="text-xl font-archivo"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {t('breeds.search.results.noResults')}
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            // Top 10 / Featured Breeds (no filters, no search)
            <motion.div
              key="top-breeds"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.h3 
                className="text-3xl mb-8"
                style={{ color: 'var(--color-text-primary)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {topSearchedBreeds.some(b => b.searchCount) 
                  ? t('searchBreed.topSearched') 
                  : t('searchBreed.featured')}
              </motion.h3>

              {loading ? (
                <div className="text-center py-16">
                  <div 
                    className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent"
                    style={{ borderColor: 'var(--color-primary)' }}
                  ></div>
                  <p 
                    className="mt-4 text-lg font-archivo"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Loading breeds...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {topSearchedBreeds.map((breed, index) => (
                    <motion.div
                      key={breed.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.5 }}
                    >
                      <BreedCard
                        breed={breed}
                        onClick={() => handleBreedClick(breed)}
                        rank={index + 1}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breed Detail Modal */}
        <AnimatePresence>
          {selectedBreed && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseBreedInfo}
            >
              <motion.div
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.8, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 100 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <BreedDetailModal
                  breedId={selectedBreed.id}
                  onClose={handleCloseBreedInfo}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Styles */}
      <style>{`
        .search-input::placeholder {
          color: var(--color-text-secondary) !important;
          opacity: 0.6;
        }

        .search-input:-webkit-autofill,
        .search-input:-webkit-autofill:hover,
        .search-input:-webkit-autofill:focus {
          -webkit-text-fill-color: var(--color-text-primary) !important;
          -webkit-box-shadow: 0 0 0px 1000px var(--color-input-bg) inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default SearchBreed;









