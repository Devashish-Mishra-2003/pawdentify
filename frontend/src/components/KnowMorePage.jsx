import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const KnowMorePage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { knowMoreData, breedEntry } = location.state || {};

  if (!knowMoreData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#050505]">
        <h2 className="text-4xl font-extrabold text-gray-200 dark:text-white/10 mb-8 italic">No data found for this breed.</h2>
        <button onClick={() => navigate(-1)} className="pill-button bg-black text-white px-10 py-4">Go Back</button>
      </div>
    );
  }

  const renderAny = (val) => {
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object' && val !== null) {
      return Object.entries(val).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${renderAny(v)}`).join('; ');
    }
    return String(val);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] pt-32 pb-24 px-6 relative overflow-hidden transition-colors duration-300">
      <div className="bg-blob blob-purple top-0 right-0 opacity-5"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20 px-4 text-center md:text-left">
           <div>
              <span className="font-handwriting text-3xl text-[#7D64A3] dark:text-[#A892D1] mb-4 block">Deep dive into history</span>
              <h1 className="text-5xl md:text-7xl text-black dark:text-white leading-tight">
                About {breedEntry?.breed || breedEntry?.name}.
              </h1>
           </div>
           <button onClick={() => navigate(-1)} className="pill-button bg-white dark:bg-white/5 text-black dark:text-white border-2 border-gray-100 dark:border-white/10 py-4 px-10 font-bold uppercase tracking-widest text-xs h-14 flex items-center shadow-sm hover:border-black dark:hover:border-white transition-all">
              Return
           </button>
        </div>

        <div className="columns-1 md:columns-2 gap-8 space-y-8">
          {Object.entries(knowMoreData).map(([sectionKey, sectionValue], idx) => (
            <motion.div
              key={sectionKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="break-inside-avoid bento-card bg-white dark:bg-[#111111] border-gray-100 dark:border-white/10 border-2 p-10 hover:border-[#30A7DB] dark:hover:border-[#30A7DB] transition-all"
            >
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#30A7DB] mb-6">
                {sectionKey.replace(/_/g, ' ')}
              </h2>
              
              {typeof sectionValue === 'object' && !Array.isArray(sectionValue) ? (
                <div className="space-y-6">
                  {Object.entries(sectionValue).map(([k, v]) => (
                    <div key={k}>
                       <h3 className="text-xl font-extrabold text-black dark:text-white mb-1 capitalize">{k.replace(/_/g, ' ')}</h3>
                       <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{renderAny(v)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xl text-black dark:text-white font-semibold leading-relaxed">
                  {renderAny(sectionValue)}
                </p>
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
           <div className="bento-card bg-[#111111] text-white p-12 overflow-hidden relative">
              <div className="bg-blob blob-blue opacity-20 -right-20 -top-20"></div>
              <div className="relative z-10">
                 <h3 className="text-3xl md:text-4xl mb-4 italic">Still curious?</h3>
                 <p className="text-gray-400 text-xl mb-10">Discover more breeds in our extensive database.</p>
                 <button onClick={() => navigate('/search-breed')} className="pill-button bg-[#30A7DB] text-white py-5 px-12 font-bold uppercase tracking-widest text-sm shadow-xl hover:-translate-y-1 transition-transform">Browse Gallery</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default KnowMorePage;
