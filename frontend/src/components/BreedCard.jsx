import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import breedData from '../pawdentify_final_corrected.json';

const BreedCard = ({ breed, onClick, rank }) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Format size to handle "Small to Medium" → "Medium"
  const formatSize = (size) => {
    if (!size) return "Medium";
    
    if (size.includes(" to ")) {
      const parts = size.split(" to ");
      return parts[1].trim();
    }
    
    if (size.includes("-")) {
      const parts = size.split("-");
      return parts[1].trim();
    }
    
    return size;
  };

  // Get breed info from comprehensive JSON
  const getBreedInfo = () => {
    const breedInfo = breedData.find(b => b.id === breed.id);
    
    if (breedInfo && breedInfo.physical_traits) {
      return {
        size: formatSize(breedInfo.physical_traits.size) || "Medium",
        weight: breedInfo.physical_traits.weight_range || "15-25 kg",
        height: breedInfo.physical_traits.height_range || "40-50 cm"
      };
    }
    
    return {
      size: "Medium",
      weight: "15-25 kg",
      height: "40-50 cm"
    };
  };

  const breedInfo = getBreedInfo();

  // Preload all images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = breed.images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    };

    preloadImages();
  }, [breed.images]);

  // Continuous auto-cycle through images
  useEffect(() => {
    if (breed.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % breed.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [breed.images.length]);

  // Format stats to integers
  const formatStat = (stat) => {
    const numbers = stat.match(/[\d.]+/g);
    if (!numbers || numbers.length < 2) return stat;
    
    const min = Math.round(parseFloat(numbers[0]));
    const max = Math.round(parseFloat(numbers[1]));
    
    return `${min}-${max}`;
  };

  return (
    <motion.div
      className="cursor-pointer rounded-2xl overflow-hidden shadow-lg relative group h-full flex flex-col"
      style={{
        backgroundColor: 'var(--color-services-card-bg)',
        border: '1px solid var(--color-card-border)'
      }}
      whileHover={{ 
        y: -8,
        boxShadow: '0 20px 40px rgba(140, 82, 255, 0.25)'
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Rank Badge */}
      {rank && (
        <motion.div 
          className="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10"
          style={{
            backgroundColor: rank <= 3 ? '#FFD700' : '#8c52ff',
            color: rank <= 3 ? '#000' : '#fff'
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          #{rank}
        </motion.div>
      )}

      {/* Image with Cycling */}
      <div className="relative h-56 overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--color-services-card-bg)' }}>
        <AnimatePresence initial={false}>
          <motion.img
            key={`${breed.id}-${currentImageIndex}`}
            src={breed.images[currentImageIndex]}
            alt={breed.name}
            className="w-full h-full object-cover absolute inset-0"
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onError={(e) => {
              e.target.src = '/placeholder-dog.jpg';
            }}
          />
        </AnimatePresence>

        {/* Image Counter Dots */}
        {breed.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {breed.images.map((_, index) => (
              <motion.div
                key={index}
                className="rounded-full transition-all"
                style={{
                  backgroundColor: index === currentImageIndex 
                    ? 'white' 
                    : 'rgba(255, 255, 255, 0.4)',
                }}
                animate={{
                  width: index === currentImageIndex ? '24px' : '8px',
                  height: '8px'
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        )}

        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-[1]"
        />
      </div>

      {/* Breed Info */}
      <div className="p-4 flex flex-col">
        <h3 
          className="text-xl mb-3 font-archivo line-clamp-1"
          style={{ 
            color: 'var(--color-text-primary)',
            minHeight: '28px'
          }}
        >
          {breed.name}
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Size */}
          <motion.div 
            className="flex flex-col items-center p-2 rounded-lg"
            style={{
              backgroundColor: 'rgba(140, 82, 255, 0.1)',
              minHeight: '60px'
            }}
            whileHover={{ scale: 1.05 }}
          >
            <span 
              className="text-xs mb-1 text-center" 
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('searchBreed.card.size')}
            </span>
            <span 
              className="text-sm font-bold text-center"
              style={{ color: '#8c52ff' }}
            >
              {breedInfo.size}
            </span>
          </motion.div>

          {/* Weight */}
          <motion.div 
            className="flex flex-col items-center p-2 rounded-lg"
            style={{
              backgroundColor: 'rgba(140, 82, 255, 0.1)',
              minHeight: '60px'
            }}
            whileHover={{ scale: 1.05 }}
          >
            <span 
              className="text-xs mb-1 text-center" 
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('searchBreed.card.weight')}
            </span>
            <span 
              className="text-sm font-bold text-center"
              style={{ color: '#8c52ff' }}
            >
              {formatStat(breedInfo.weight)}kg
            </span>
          </motion.div>

          {/* Height */}
          <motion.div 
            className="flex flex-col items-center p-2 rounded-lg"
            style={{
              backgroundColor: 'rgba(140, 82, 255, 0.1)',
              minHeight: '60px'
            }}
            whileHover={{ scale: 1.05 }}
          >
            <span 
              className="text-xs mb-1 text-center" 
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('searchBreed.card.height')}
            </span>
            <span 
              className="text-sm font-bold text-center"
              style={{ color: '#8c52ff' }}
            >
              {formatStat(breedInfo.height)}cm
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default BreedCard;





