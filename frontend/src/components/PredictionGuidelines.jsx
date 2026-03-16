import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CheckImage, CrossImage } from "./icons";

// gallery imports
import do1 from "../assets/do_photos/1.jpg";
import do2 from "../assets/do_photos/2.jpg";
import do3 from "../assets/do_photos/3.jpg";
import dont1 from "../assets/dont_photos/1.jpg";
import dont2 from "../assets/dont_photos/2.jpg";
import dont3 from "../assets/dont_photos/3.jpg";

const GALLERY_INTERVAL = 3000;

const PredictionGuidelines = () => {
  const { t } = useTranslation();
  const [doIndex, setDoIndex] = useState(0);
  const [dontIndex, setDontIndex] = useState(0);

  const doImages = [do1, do2, do3];
  const dontImages = [dont1, dont2, dont3];

  useEffect(() => {
    const a = setInterval(() => setDoIndex((i) => (i + 1) % doImages.length), GALLERY_INTERVAL);
    const b = setInterval(() => setDontIndex((i) => (i + 1) % dontImages.length), GALLERY_INTERVAL + 500);
    return () => { clearInterval(a); clearInterval(b); };
  }, [doImages.length, dontImages.length]);

  return (
    <section id="guidelines" className="py-24 bg-[var(--color-bg-secondary)] relative overflow-hidden">
      <div className="bg-blob blob-blue top-0 left-0 opacity-5"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="font-handwriting text-2xl text-[#30A7DB] block mb-2">How to get accurately results</span>
          <h2 className="text-4xl md:text-6xl text-black dark:text-white">Photo Guidelines</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Do Column */}
          <div className="bento-card border-green-100 dark:border-green-900/30">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                   <CheckImage className="w-6 h-6" />
                </div>
                <h3 className="text-3xl text-black dark:text-white">{t("guidelines.dos.title")}</h3>
             </div>
             
             <div className="aspect-video rounded-[30px] overflow-hidden mb-8 shadow-inner bg-gray-50 dark:bg-black border-4 border-white dark:border-white/5">
                <motion.img 
                  key={`do-${doIndex}`} 
                  src={doImages[doIndex]} 
                  initial={{ opacity: 0, scale: 1.1 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="w-full h-full object-cover" 
                />
             </div>

             <ul className="space-y-4">
               {[t("guidelines.dos.items.clearPhoto"), t("guidelines.dos.items.goodLighting"), t("guidelines.dos.items.singleDog")].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-lg text-gray-600 dark:text-gray-400 font-medium">
                   <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                   {item}
                 </li>
               ))}
             </ul>
          </div>

          {/* Don't Column */}
          <div className="bento-card border-red-100 dark:border-red-900/30">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                   <CrossImage className="w-6 h-6" />
                </div>
                <h3 className="text-3xl text-black dark:text-white">{t("guidelines.donts.title")}</h3>
             </div>
             
             <div className="aspect-video rounded-[30px] overflow-hidden mb-8 shadow-inner bg-gray-50 dark:bg-black border-4 border-white dark:border-white/5">
                <motion.img 
                  key={`dont-${dontIndex}`} 
                  src={dontImages[dontIndex]} 
                  initial={{ opacity: 0, scale: 1.1 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="w-full h-full object-cover" 
                />
             </div>

             <ul className="space-y-4">
               {[t("guidelines.donts.items.blurry"), t("guidelines.donts.items.obstructed"), t("guidelines.donts.items.multipleDogs")].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-lg text-gray-600 dark:text-gray-400 font-medium">
                   <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                   {item}
                 </li>
               ))}
             </ul>
          </div>

          {/* Bottom Wide Card - Fun Tip */}
          <div className="bento-card md:col-span-2 text-white overflow-hidden relative" style={{ background: '#7D64A3' }}>
             <div className="bg-blob blob-pink opacity-20 -right-20 -top-20"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:max-w-xl">
                  <h3 className="text-3xl md:text-5xl mb-4 font-extrabold tracking-tight" style={{ color: 'white' }}>Pro Tip</h3>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.92)' }}>
                    Try to take the photo from the pet's eye level. This helps our AI see the unique facial features better and improves classification accuracy.
                  </p>
                </div>
                <div className="font-handwriting text-3xl md:text-4xl rotate-6 text-yellow-300 shrink-0">
                   Happy Identification
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PredictionGuidelines;
