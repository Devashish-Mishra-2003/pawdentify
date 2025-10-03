// src/components/Settings.jsx
import React, { useState, useEffect } from 'react';
import pawLogo from '../assets/PAWS_white_text.png';
import i18n from '../i18n'; // make sure this exists and is imported

const LS_KEY = 'pawdentify-settings';

const LANG_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ur', label: 'اردو' },
  { code: 'fr', label: 'Français' },
  // add more later if you wish
];

const Settings = ({ onBack }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    imageQuality: 'high',
    saveHistory: true,
    anonymousMode: false,
    language: 'en',
  });

  // Load settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setSettings(JSON.parse(saved));
      else {
        // use i18n current language as default if present
        const ln = (i18n && i18n.language) ? i18n.language.slice(0,2) : 'en';
        setSettings((s) => ({ ...s, language: ln }));
      }
    } catch (e) {
      console.error('Failed to read settings from localStorage', e);
    }
  }, []);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  // Apply theme class
  useEffect(() => {
    if (settings.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [settings.theme]);

  // apply language to i18n when changed
  useEffect(() => {
    if (settings.language && i18n && i18n.changeLanguage) {
      i18n.changeLanguage(settings.language).catch(() => {});
    }
  }, [settings.language]);

  const updateSetting = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const clearAllData = () => {
    if (!window.confirm('Clear all Pawdentify data? This cannot be undone.')) return;
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('pawdentify') || k === LS_KEY) localStorage.removeItem(k);
      });
      setSettings({
        theme: 'light',
        imageQuality: 'high',
        saveHistory: true,
        anonymousMode: false,
        language: 'en',
      });
      alert('All Pawdentify data removed.');
    } catch (e) {
      console.error('Failed clearing data', e);
      alert('Failed to clear data — see console.');
    }
  };

  const clearCache = () => {
    if (!window.confirm('Clear cached data?')) return;
    alert('Cache cleared (placeholder).');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="shadow-md" style={{ backgroundColor: '#8c52ff' }}>
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center h-20">
          <div className="flex items-center">
            <img src={pawLogo} alt="PAWS Logo" className="w-40 h-auto object-contain" />
          </div>

          <button
            onClick={onBack}
            className="flex items-center px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-semibold transition-all duration-200"
            aria-label="Back"
            title="Back"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-alfa font-bold text-gray-900 mb-4">Settings</h1>
          <p className="text-xl text-gray-600">Customize your Pawdentify experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column */}
          <div className="space-y-12">
            {/* Appearance */}
            <section className="section-card border rounded-3xl p-8">
              <h2 className="text-3xl font-archivo font-bold text-gray-900 mb-6">Appearance</h2>

              <label className="block text-lg font-semibold text-gray-700 mb-3">Theme</label>
              <p className="text-gray-600 mb-4">Choose between light and dark themes</p>
              <div className="flex gap-4">
                <button
                  onClick={() => updateSetting('theme', 'light')}
                  className={`btn-anim px-6 py-3 rounded-full font-semibold ${
                    settings.theme === 'light'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => updateSetting('theme', 'dark')}
                  className={`btn-anim px-6 py-3 rounded-full font-semibold ${
                    settings.theme === 'dark'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Dark
                </button>
              </div>
            </section>

            {/* Functionality */}
            <section className="section-card border rounded-3xl p-8">
              <h2 className="text-3xl font-archivo font-bold text-gray-900 mb-6">Functionality</h2>

              <div className="space-y-6">
                {/* Image quality */}
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">Image Quality</label>
                  <p className="text-gray-600 mb-4">Processing quality for uploaded images</p>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { value: 'high', label: 'High Quality' },
                      { value: 'medium', label: 'Medium Quality' },
                      { value: 'low', label: 'Low Quality (Faster)' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateSetting('imageQuality', opt.value)}
                        className={`btn-anim px-4 py-2 rounded-full font-semibold ${
                          settings.imageQuality === opt.value
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language selector */}
                <div className="mt-6">
                  <label className="block text-lg font-semibold text-gray-700 mb-3">Language</label>
                  <p className="text-gray-600 mb-4">Select your preferred language</p>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value)}
                    className="px-4 py-2 rounded-lg border bg-white"
                  >
                    {LANG_OPTIONS.map((opt) => (
                      <option key={opt.code} value={opt.code}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-12">
            {/* Privacy & Data */}
            <section className="section-card border rounded-3xl p-8">
              <h2 className="text-3xl font-archivo font-bold text-gray-900 mb-6">Privacy & Data</h2>

              <div className="space-y-6">
                {/* Save history */}
                <label className="flex items-start" role="switch" aria-checked={settings.saveHistory}>
                  <input
                    type="checkbox"
                    checked={settings.saveHistory}
                    onChange={(e) => updateSetting('saveHistory', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors mt-1 ${settings.saveHistory ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.saveHistory ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                  <div className="ml-4">
                    <span className="text-lg font-semibold text-gray-700">Save History</span>
                    <p className="text-gray-600">Keep track of your identifications locally</p>
                  </div>
                </label>

                {/* Anonymous mode */}
                <label className="flex items-start" role="switch" aria-checked={settings.anonymousMode}>
                  <input
                    type="checkbox"
                    checked={settings.anonymousMode}
                    onChange={(e) => updateSetting('anonymousMode', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors mt-1 ${settings.anonymousMode ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.anonymousMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                  <div className="ml-4">
                    <span className="text-lg font-semibold text-gray-700">Anonymous Mode</span>
                    <p className="text-gray-600">Don’t store any personal data</p>
                  </div>
                </label>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Clear All Data</h3>
                  <p className="text-gray-600 mb-4">Remove all stored Pawdentify data</p>
                  <button onClick={clearAllData} className="btn-anim px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-all shadow-md">
                    Clear All Data
                  </button>
                </div>
              </div>
            </section>

            {/* Advanced (no expert mode) */}
            <section className="section-card border rounded-3xl p-8">
              <h2 className="text-3xl font-archivo font-bold text-gray-900 mb-6">Advanced</h2>

              <div className="space-y-6">
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Cache Management</h3>
                  <p className="text-gray-600 mb-4">Clear cached data to free space</p>
                  <button onClick={clearCache} className="btn-anim px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-semibold transition-all shadow-md">
                    Clear Cache
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* About */}
        <section className="section-card mt-12 border rounded-3xl p-8">
          <h2 className="text-3xl font-archivo font-bold text-gray-900 mb-6">About</h2>
          <div className="rounded-2xl p-6 text-gray-700 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><span className="font-semibold">Version:</span> 2.0.0</div>
              <div><span className="font-semibold">Last Updated:</span> October 2025</div>
              <div><span className="font-semibold">Breeds Database:</span> 120+ breeds</div>
              <div><span className="font-semibold">Support:</span> <a href="mailto:support@pawdentify.com" className="text-purple-600 hover:text-purple-800 underline">support@pawdentify.com</a></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;



