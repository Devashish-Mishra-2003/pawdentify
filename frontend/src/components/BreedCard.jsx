import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useBreedData } from '../contexts/BreedDataContext';

const BreedCard = ({ breed, onClick, rank }) => {
  const { t } = useTranslation();
  const breedData = useBreedData();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatSize = (size) => {
    if (!size) return "Medium";
    if (size.includes(" to ")) return size.split(" to ")[1].trim();
    if (size.includes("-")) return size.split("-")[1].trim();
    return size;
  };

  const breedInfo = (() => {
    const info = breedData.find(b => b.id === breed.id);
    if (info?.physical_traits) {
      return {
        size: formatSize(info.physical_traits.size) || "Medium",
        weight: info.physical_traits.weight_range || "15-25",
        height: info.physical_traits.height_range || "40-50"
      };
    }
    return { size: "Medium", weight: "15-25", height: "40-50" };
  })();

  useEffect(() => {
    if (breed.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % breed.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [breed.images.length]);

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -10, boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}
      className="bento-card !p-0 border-gray-100 dark:border-white/10 border-2 bg-white dark:bg-[#111111] flex flex-col group cursor-pointer overflow-hidden h-full"
    >
      <div className="relative h-72 w-full flex items-center justify-center bg-gray-50/50 dark:bg-white/5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={breed.images[currentImageIndex]}
            alt={breed.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        
        {rank && (
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xl z-20">
            #{rank}
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {breed.images.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 shadow-sm'}`} 
            />
          ))}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl text-black dark:text-white mb-6 leading-tight group-hover:text-[#30A7DB] transition-colors font-extrabold">{breed.name}</h3>
        
        <div className="flex gap-2 mt-auto">
           <div className="flex-1 bento-card border-0 bg-gray-50/80 dark:bg-white/5 p-3 text-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 block mb-1">Size</span>
              <span className="text-xs font-black text-[#30A7DB]">{breedInfo.size}</span>
           </div>
           <div className="flex-1 bento-card border-0 bg-gray-50/80 dark:bg-white/5 p-3 text-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 block mb-1">Weight</span>
              <span className="text-xs font-black text-[#8c52ff]">{breedInfo.weight.match(/\d+/g)?.[0] || '15'}kg</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BreedCard;
