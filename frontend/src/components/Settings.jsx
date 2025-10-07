// src/components/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import pawLogo from '../assets/PAWS_white_text.png';
import i18n from '../i18n';

const LS_KEY = 'pawdentify-settings';

const LANG_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ur', label: 'اردو' },
  { code: 'fr', label: 'Français' },
];

const Settings = ({ onBack }) => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    imageQuality: 'high',
    saveHistory: true,
    anonymousMode: false,
    language: 'en',
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Remove theme if it exists in old settings
        const { theme, ...rest } = parsed;
        setSettings({ imageQuality: 'high', saveHistory: true, anonymousMode: false, language: 'en', ...rest });
      } else {
        const ln = (i18n && i18n.language) ? i18n.language.slice(0,2) : 'en';
        setSettings((s) => ({ ...s, language: ln }));
      }
    } catch (e) {
      console.error('Failed to read settings from localStorage', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  useEffect(() => {
    if (settings.language && i18n && i18n.changeLanguage) {
      i18n.changeLanguage(settings.language).catch(() => {});
    }
  }, [settings.language]);

  const updateSetting = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const clearAllData = () => {
    if (!window.confirm(t('settings.privacy.clearData.confirm'))) return;
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('pawdentify') || k === LS_KEY) {
          // Don't remove theme preference
          if (k !== 'pawdentify-theme') {
            localStorage.removeItem(k);
          }
        }
      });
      setSettings({
        imageQuality: 'high',
        saveHistory: true,
        anonymousMode: false,
        language: 'en',
      });
      alert(t('settings.privacy.clearData.success'));
    } catch (e) {
      console.error('Failed clearing data', e);
      alert(t('settings.privacy.clearData.error'));
    }
  };

  const clearCache = () => {
    if (!window.confirm(t('settings.advanced.cache.confirm'))) return;
    alert(t('settings.advanced.cache.success'));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-settings-page-bg)" }}>
      {/* Header */}
      <header className="shadow-md" style={{ backgroundColor: "var(--color-settings-header-bg)" }}>
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center h-20">
          <div className="flex items-center">
            <img src={pawLogo} alt={t("header.logoAlt")} className="w-40 h-auto object-contain" />
          </div>

          <button
            onClick={onBack}
            className="flex items-center px-6 py-2 rounded-full font-semibold transition-all duration-200"
            style={{
              backgroundColor: "var(--color-settings-back-btn-bg)",
              color: "var(--color-settings-back-btn-text)",
            }}
            aria-label={t("settings.backToHome")}
            title={t("settings.backToHome")}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("settings.backToHome")}
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-5xl font-alfa mb-4" style={{ color: "var(--color-settings-title)" }}>
            {t("settings.title")}
          </h1>
          <p className="text-xl" style={{ color: "var(--color-settings-subtitle)" }}>
            {t("settings.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column */}
          <div className="space-y-12">
            {/* Functionality */}
            <section className="section-card border rounded-3xl p-8" style={{ borderColor: "var(--color-settings-border)" }}>
              <h2 className="text-3xl font-alfa mb-6" style={{ color: "var(--color-settings-section-title)" }}>
                {t("settings.functionality.title")}
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold mb-3" style={{ color: "var(--color-settings-label)" }}>
                    {t("settings.functionality.imageQuality.label")}
                  </label>
                  <p className="mb-4" style={{ color: "var(--color-settings-description)" }}>
                    {t("settings.functionality.imageQuality.description")}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { value: 'high', label: t("settings.functionality.imageQuality.high") },
                      { value: 'medium', label: t("settings.functionality.imageQuality.medium") },
                      { value: 'low', label: t("settings.functionality.imageQuality.low") },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateSetting('imageQuality', opt.value)}
                        className="btn-anim px-4 py-2 rounded-full font-semibold"
                        style={settings.imageQuality === opt.value ? {
                          background: "var(--color-settings-btn-active-bg)",
                          color: "var(--color-settings-btn-active-text)",
                          boxShadow: "var(--color-settings-btn-active-shadow)",
                        } : {
                          backgroundColor: "var(--color-settings-btn-inactive-bg)",
                          color: "var(--color-settings-btn-inactive-text)",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-lg font-semibold mb-3" style={{ color: "var(--color-settings-label)" }}>
                    {t("settings.functionality.language.label")}
                  </label>
                  <p className="mb-4" style={{ color: "var(--color-settings-description)" }}>
                    {t("settings.functionality.language.description")}
                  </p>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value)}
                    className="px-4 py-2 rounded-lg border"
                    style={{
                      backgroundColor: "var(--color-settings-select-bg)",
                      borderColor: "var(--color-settings-select-border)",
                    }}
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
            <section className="section-card border rounded-3xl p-8" style={{ borderColor: "var(--color-settings-border)" }}>
              <h2 className="text-3xl font-alfa mb-6" style={{ color: "var(--color-settings-section-title)" }}>
                {t("settings.privacy.title")}
              </h2>

              <div className="space-y-6">
                <label className="flex items-start" role="switch" aria-checked={settings.saveHistory}>
                  <input
                    type="checkbox"
                    checked={settings.saveHistory}
                    onChange={(e) => updateSetting('saveHistory', e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors mt-1"
                    style={{
                      background: settings.saveHistory ? "var(--color-settings-toggle-active)" : "var(--color-settings-toggle-inactive)",
                    }}
                  >
                    <span
                      className="inline-block h-4 w-4 transform rounded-full transition-transform"
                      style={{
                        backgroundColor: "var(--color-settings-toggle-knob)",
                        transform: settings.saveHistory ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                      }}
                    />
                  </div>
                  <div className="ml-4">
                    <span className="text-lg font-semibold" style={{ color: "var(--color-settings-label)" }}>
                      {t("settings.privacy.saveHistory.label")}
                    </span>
                    <p style={{ color: "var(--color-settings-description)" }}>
                      {t("settings.privacy.saveHistory.description")}
                    </p>
                  </div>
                </label>

                <label className="flex items-start" role="switch" aria-checked={settings.anonymousMode}>
                  <input
                    type="checkbox"
                    checked={settings.anonymousMode}
                    onChange={(e) => updateSetting('anonymousMode', e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors mt-1"
                    style={{
                      background: settings.anonymousMode ? "var(--color-settings-toggle-active)" : "var(--color-settings-toggle-inactive)",
                    }}
                  >
                    <span
                      className="inline-block h-4 w-4 transform rounded-full transition-transform"
                      style={{
                        backgroundColor: "var(--color-settings-toggle-knob)",
                        transform: settings.anonymousMode ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                      }}
                    />
                  </div>
                  <div className="ml-4">
                    <span className="text-lg font-semibold" style={{ color: "var(--color-settings-label)" }}>
                      {t("settings.privacy.anonymousMode.label")}
                    </span>
                    <p style={{ color: "var(--color-settings-description)" }}>
                      {t("settings.privacy.anonymousMode.description")}
                    </p>
                  </div>
                </label>

                <div className="border-t pt-6" style={{ borderColor: "var(--color-settings-border)" }}>
                  <h3 className="text-xl mb-2" style={{ color: "var(--color-settings-label)" }}>
                    {t("settings.privacy.clearData.title")}
                  </h3>
                  <p className="mb-4" style={{ color: "var(--color-settings-description)" }}>
                    {t("settings.privacy.clearData.description")}
                  </p>
                  <button
                    onClick={clearAllData}
                    className="btn-anim px-6 py-3 rounded-full font-semibold transition-all"
                    style={{
                      backgroundColor: "var(--color-settings-btn-danger-bg)",
                      color: "var(--color-settings-btn-danger-text)",
                      boxShadow: "var(--color-settings-btn-danger-shadow)",
                    }}
                  >
                    {t("settings.privacy.clearData.button")}
                  </button>
                </div>
              </div>
            </section>

            {/* Advanced */}
            <section className="section-card border rounded-3xl p-8" style={{ borderColor: "var(--color-settings-border)" }}>
              <h2 className="text-3xl font-alfa mb-6" style={{ color: "var(--color-settings-section-title)" }}>
                {t("settings.advanced.title")}
              </h2>

              <div className="space-y-6">
                <div className="border-t pt-6" style={{ borderColor: "var(--color-settings-border)" }}>
                  <h3 className="text-xl mb-2" style={{ color: "var(--color-settings-label)" }}>
                    {t("settings.advanced.cache.title")}
                  </h3>
                  <p className="mb-4" style={{ color: "var(--color-settings-description)" }}>
                    {t("settings.advanced.cache.description")}
                  </p>
                  <button
                    onClick={clearCache}
                    className="btn-anim px-6 py-3 rounded-full font-semibold transition-all"
                    style={{
                      backgroundColor: "var(--color-settings-btn-gray-bg)",
                      color: "var(--color-settings-btn-gray-text)",
                      boxShadow: "var(--color-settings-btn-gray-shadow)",
                    }}
                  >
                    {t("settings.advanced.cache.button")}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* About */}
        <section className="section-card mt-12 border rounded-3xl p-8" style={{ borderColor: "var(--color-settings-border)" }}>
          <h2 className="text-3xl font-alfa mb-6" style={{ color: "var(--color-settings-section-title)" }}>
            {t("settings.about.title")}
          </h2>
          <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--color-settings-about-bg)", color: "var(--color-settings-about-text)" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className="font-semibold">{t("settings.about.version")}</span> {t("settings.about.versionNumber")}
              </div>
              <div>
                <span className="font-semibold">{t("settings.about.lastUpdated")}</span> {t("settings.about.lastUpdatedDate")}
              </div>
              <div>
                <span className="font-semibold">{t("settings.about.breedsDatabase")}</span> {t("settings.about.breedsDatabaseCount")}
              </div>
              <div>
                <span className="font-semibold">{t("settings.about.support")}</span>{" "}
                <a
                  href={`mailto:${t("settings.about.supportEmail")}`}
                  className="underline"
                  style={{ color: "var(--color-settings-link)" }}
                >
                  {t("settings.about.supportEmail")}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
