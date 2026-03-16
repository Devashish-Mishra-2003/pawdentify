import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const { t } = useTranslation();

  const handleScrollToPredict = () => {
    const section = document.getElementById("predict");
    if (section) {
      window.scrollTo({ top: section.offsetTop - 80, behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center pt-30 pb-16 overflow-hidden bg-[var(--color-bg-app)]">
      {/* Background Blobs */}
      <div className="bg-blob blob-purple top-[-10%] right-[-5%] opacity-10"></div>
      <div className="bg-blob blob-blue bottom-[10%] left-[-5%] opacity-10"></div>
      <div className="bg-blob blob-pink top-[20%] left-[20%] opacity-5 scale-150"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* Playful Annotation */}
        <motion.div 
          initial={{ opacity: 0, x: 20, rotate: 10 }}
          animate={{ opacity: 1, x: 0, rotate: -5 }}
          className="absolute top-0 right-0 md:right-[10%] hidden md:block"
        >
          <span className="font-handwriting text-3xl text-[#7D64A3] dark:text-[#A892D1] bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-full border border-purple-100 dark:border-purple-800/50 italic">
            Waiting for a pup
          </span>
        </motion.div>

        {/* Main Content */}
        <div className="text-center mb-16 max-w-4xl">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-block px-4 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[#30A7DB] font-bold text-sm uppercase tracking-widest mb-6"
           >
             AI Powered Identification
           </motion.div>
           
           <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-6xl md:text-8xl lg:text-9xl text-black dark:text-white leading-[0.9] tracking-tighter mb-8"
           >
             Identify <span className="text-gray-300 dark:text-gray-700">every</span> dog breed.
           </motion.h1>

           <motion.p 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-12 max-w-2xl mx-auto"
           >
             The most advanced AI classifier for dog lovers. Discover breeds, temperaments, and histories in seconds.
           </motion.p>

           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="flex flex-col sm:flex-row gap-4 justify-center"
           >
             <button 
               onClick={handleScrollToPredict}
               className="pill-button bg-purple-accent text-white py-6 px-12 text-xl shadow-xl hover:-translate-y-1 transition-transform"
             >
               Identify Now
             </button>
             <Link 
               to="/search-breed"
               className="pill-button bg-white dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 text-black dark:text-white py-6 px-12 text-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
             >
               Browse Breeds
             </Link>
           </motion.div>
        </div>

        {/* Bento Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mt-8">
           <motion.div 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bento-card border-none bg-gray-50 dark:bg-white/5 text-center flex flex-col items-center justify-center aspect-square md:aspect-auto md:h-48"
           >
              <div className="text-4xl font-bold text-black dark:text-white mb-1">100+</div>
              <div className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Breeds</div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="bento-card border-none bg-red-50 dark:bg-red-950/20 text-center flex flex-col items-center justify-center aspect-square md:aspect-auto md:h-48"
           >
              <div className="text-4xl font-bold text-[#E11D48] mb-1">99%</div>
              <div className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Accuracy</div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="bento-card border-none bg-green-50 dark:bg-green-950/20 text-center flex flex-col items-center justify-center aspect-square md:aspect-auto md:h-48"
           >
              <div className="text-4xl font-bold text-[#16A34A] mb-1">2.5k</div>
              <div className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Users</div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.3 }}
             className="bento-card border-none bg-blue-50 dark:bg-blue-950/20 text-center flex flex-col items-center justify-center aspect-square md:aspect-auto md:h-48"
           >
              <div className="text-4xl font-bold text-[#2563EB] mb-1">Fast</div>
              <div className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Processing</div>
           </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
