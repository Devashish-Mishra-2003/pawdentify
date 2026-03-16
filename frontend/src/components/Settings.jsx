import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@clerk/clerk-react';
import i18n from '../i18n';
import LoadingSpinner from './LoadingSpinner';
import { motion } from 'framer-motion';
import { useTheme } from "../contexts/ThemeContext";

const LS_KEY = 'pawdentify-settings';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const LANG_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' }
];

const Settings = ({ onBack }) => {
  const { t } = useTranslation();
  const { getToken, isSignedIn } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    imageQuality: 'high',
    saveHistory: true,
    language: 'en',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      if (isSignedIn) {
        try {
          const token = await getToken();
          const response = await fetch(`${API_URL}/api/settings`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const backendSettings = await response.json();
            setSettings(backendSettings);
            localStorage.setItem(LS_KEY, JSON.stringify(backendSettings));
            setLoading(false);
            return;
          }
        } catch (error) { console.error(error); }
      }
      try {
        const saved = localStorage.getItem(LS_KEY);
        if (saved) setSettings(JSON.parse(saved));
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    loadSettings();
  }, [isSignedIn, getToken]);

  useEffect(() => {
    const saveSettings = async () => {
      if (loading) return;
      setSaving(true);
      localStorage.setItem(LS_KEY, JSON.stringify(settings));
      if (isSignedIn) {
        try {
          const token = await getToken();
          await fetch(`${API_URL}/api/settings`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
          });
        } catch (error) { console.error(error); }
      }
      setSaving(false);
    };
    saveSettings();
  }, [settings, isSignedIn, getToken, loading]);

  useEffect(() => {
    if (settings.language && i18n && i18n.changeLanguage) {
      i18n.changeLanguage(settings.language).catch(() => {});
    }
  }, [settings.language]);

  const updateSetting = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] pt-32 pb-24 px-6 relative overflow-hidden transition-colors duration-300">
      <div className="bg-blob blob-purple top-0 right-0 opacity-5"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 px-4 gap-6">
           <div>
              <span className="font-handwriting text-3xl text-[#30A7DB] mb-4 block">Personalize your experience</span>
              <h1 className="text-5xl md:text-7xl text-black dark:text-white">Settings.</h1>
           </div>
           <button 
             onClick={onBack}
             className="pill-button bg-white dark:bg-white/5 text-black dark:text-white border-2 border-gray-100 dark:border-white/10 py-4 px-8 font-bold uppercase tracking-widest text-xs h-14 flex items-center shadow-sm hover:border-black dark:hover:border-white transition-all shrink-0"
           >
              Back Home
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Appearance */}
           <div className="bento-card border-gray-100 dark:border-white/10 border-2 bg-white dark:bg-[#111111] p-8 md:p-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#30A7DB] mb-8">Appearance</h2>
              <div>
                 <label className="block text-2xl font-extrabold text-black dark:text-white mb-2">Display Mode</label>
                 <p className="text-gray-400 dark:text-gray-500 font-medium mb-6">Switch between light and dark themes.</p>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={`pill-button flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${theme === 'light' ? 'bg-[#111111] text-white shadow-lg' : 'bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-white/10'}`}
                    >
                       Light
                    </button>
                    <button 
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={`pill-button flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-[#30A7DB] text-white shadow-lg' : 'bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-white/10'}`}
                    >
                       Dark
                    </button>
                 </div>
              </div>
           </div>

           {/* Identification */}
           <div className="bento-card border-gray-100 dark:border-white/10 border-2 bg-white dark:bg-[#111111] p-8 md:p-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#30A7DB] mb-8">Identification</h2>
              <div className="space-y-8">
                 <div>
                    <label className="block text-2xl font-extrabold text-black dark:text-white mb-2">Image Quality</label>
                    <p className="text-gray-400 dark:text-gray-500 font-medium mb-6">Higher quality means better accuracy but slower uploads.</p>
                    {/* flex-wrap prevents overflow on narrow cards */}
                    <div className="flex flex-wrap gap-2">
                       {['high', 'medium', 'low'].map(q => (
                          <button 
                            key={q} 
                            onClick={() => updateSetting('imageQuality', q)}
                            className={`pill-button px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all ${settings.imageQuality === q ? 'bg-[#111111] dark:bg-white dark:text-black text-white shadow-lg' : 'bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-white/10'}`}
                          >
                             {q}
                          </button>
                       ))}
                    </div>
                 </div>
                 
                 <div className="pt-8 border-t border-gray-100 dark:border-white/10">
                    <label className="block text-2xl font-extrabold text-black dark:text-white mb-2">Language</label>
                    <p className="text-gray-400 dark:text-gray-500 font-medium mb-6">Choose your preferred interface language.</p>
                    <div className="flex flex-wrap gap-2">
                       {LANG_OPTIONS.map(l => (
                          <button 
                            key={l.code} 
                            onClick={() => updateSetting('language', l.code)}
                            className={`pill-button px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all ${settings.language === l.code ? 'bg-[#30A7DB] text-white shadow-lg' : 'bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-white/10'}`}
                          >
                             {l.label}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* Privacy & Data */}
           <div className="bento-card border-gray-100 dark:border-white/10 border-2 bg-white dark:bg-[#111111] p-8 md:p-10 flex flex-col justify-between">
              <div>
                 <h2 className="text-sm font-bold uppercase tracking-widest text-[#8c52ff] mb-8">Privacy &amp; Data</h2>
                 <div className="flex items-start justify-between gap-6 mb-8">
                    <div>
                       <h3 className="text-2xl font-extrabold text-black dark:text-white mb-2">Save History</h3>
                       <p className="text-gray-400 dark:text-gray-500 font-medium text-sm leading-relaxed">Keep a record of all your identified dog breeds.</p>
                    </div>
                    <button 
                      onClick={() => updateSetting('saveHistory', !settings.saveHistory)}
                      className={`w-14 h-8 rounded-full p-1 transition-all flex-shrink-0 ${settings.saveHistory ? 'bg-[#111111] dark:bg-[#30A7DB]' : 'bg-gray-200 dark:bg-white/10'}`}
                    >
                       <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${settings.saveHistory ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                 </div>
                 
                 <div className="p-5 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                    <h4 className="text-black dark:text-white font-extrabold mb-2 italic text-sm">Pro Tip</h4>
                    <p className="text-gray-400 dark:text-gray-500 font-medium text-xs leading-relaxed">Disabling history will stop saving new identifications, but your previous records will remain safe in the gallery until you delete them.</p>
                 </div>
              </div>

              <div className="pt-8">
                 <button className="pill-button bg-red-50 dark:bg-red-900/20 text-red-500 w-full py-4 font-bold uppercase tracking-[0.15em] text-[10px] border border-red-100 dark:border-red-900/30 hover:bg-red-500 hover:text-white transition-all">
                   Clear All Local Data
                 </button>
              </div>
           </div>

           {/* App Info Wide */}
           <div className="bento-card md:col-span-2 border-gray-100 dark:border-white/10 border-2 bg-white dark:bg-[#111111] p-8 md:p-10 overflow-hidden relative">
              <div className="bg-blob blob-purple opacity-20 -right-20 -top-20"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                 <div>
                    <h3 className="text-4xl font-extrabold mb-3 text-black dark:text-white">Pawdentify AI</h3>
                    <p className="text-gray-400 font-medium">Build v1.4.2 &bull; Model v3.0 Stable</p>
                 </div>
                 <div className="flex gap-4 flex-wrap">
                    <div className="bento-card bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 px-8 py-4 text-center">
                       <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px] block mb-2">Database</span>
                       <span className="text-xl font-extrabold text-black dark:text-white">120+ Breeds</span>
                    </div>
                    <div className="bento-card bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 px-8 py-4 text-center">
                       <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px] block mb-2">Accuracy</span>
                       <span className="text-xl font-extrabold text-black dark:text-white">99.4%</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Saving indicator */}
           {saving && (
             <div className="md:col-span-1 flex items-center justify-center gap-3 text-gray-400 dark:text-gray-500 py-4">
                <div className="w-4 h-4 border-2 border-[#30A7DB] border-t-transparent animate-spin rounded-full"></div>
                <span className="text-xs font-bold uppercase tracking-widest">Saving...</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
