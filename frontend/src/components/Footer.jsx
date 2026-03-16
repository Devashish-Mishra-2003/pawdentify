import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const handleScrollTo = (id) => {
  const element = document.getElementById(id.substring(1));
  if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
};

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#111111] text-white py-24 px-6 relative overflow-hidden">
      <div className="bg-blob blob-purple -bottom-40 -left-20 opacity-10"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2">
            <Link to="/" className="text-3xl font-extrabold text-white tracking-tighter flex items-center gap-3 mb-8">
               Pawdentify
            </Link>
            <p className="text-gray-400 text-xl max-w-sm mb-8 leading-relaxed">
              Bringing joy to dog lovers worldwide with the magic of AI. Let's find your pup's identity together.
            </p>
            <div className="flex gap-4">
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors border border-white/10 uppercase text-[10px] font-bold">IG</div>
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors border border-white/10 uppercase text-[10px] font-bold">X</div>
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors border border-white/10 uppercase text-[10px] font-bold">FB</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#30A7DB] mb-8">Platform</h4>
            <ul className="space-y-4">
              <li><button onClick={() => handleScrollTo("#hero")} className="text-gray-400 hover:text-white transition-colors text-lg font-medium">Home</button></li>
              <li><button onClick={() => handleScrollTo("#predict")} className="text-gray-400 hover:text-white transition-colors text-lg font-medium">Predict</button></li>
              <li><Link to="/search-breed" className="text-gray-400 hover:text-white transition-colors text-lg font-medium">Search Breeds</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-lg font-medium">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#F07E7E] mb-8">Say Hello</h4>
            <ul className="space-y-4">
              <li><a href="mailto:hello@pawdentify.ai" className="text-gray-400 hover:text-white transition-colors text-lg font-medium">hello@pawdentify.ai</a></li>
              <li className="text-gray-400 text-lg font-medium">+1 (555) 787 5683</li>
              <li className="font-handwriting text-2xl text-yellow-300 pt-4 italic">We reply fast</li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 font-medium text-sm">
            &copy; {new Date().getFullYear()} Pawdentify AI. All rights reserved.
          </p>
          <div className="flex gap-8 text-gray-500 font-medium text-sm">
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
