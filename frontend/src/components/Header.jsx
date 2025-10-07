// src/components/Header.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import pawLogo from "../assets/PAWS_white_text.png";

const handleScrollTo = (id) => {
  const el = document.getElementById(id.substring(1));
  if (el) {
    window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  }
};

const Header = ({ showInfo, onSettingsClick }) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";

  const handleSettings = (e) => {
    e?.preventDefault();
    if (typeof onSettingsClick === "function") return onSettingsClick();
    navigate("/settings");
  };

  return (
    <header className="header-root fixed top-0 left-0 w-full z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center h-20">
        {/* Logo */}
        {onHome ? (
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("#hero");
            }}
          >
            <img src={pawLogo} alt={t("header.logoAlt")} className="w-60 h-auto object-contain" />
          </a>
        ) : (
          <Link to="/">
            <img src={pawLogo} alt={t("header.logoAlt")} className="w-45 h-auto object-contain" />
          </Link>
        )}

        {/* Navigation */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-6">
            {onHome ? (
              <>
                {[
                  { id: "#hero", label: t("header.nav.home") },
                  ...(showInfo ? [{ id: "#info", label: t("header.nav.info") }] : []),
                ].map((link) => (
                  <a
                    key={link.id}
                    href={link.id}
                    className="nav-link font-alfa font-bold text-xl tracking-wide cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollTo(link.id);
                    }}
                  >
                    {link.label}
                  </a>
                ))}

                <Link to="/faq" className="nav-link font-alfa font-bold text-xl tracking-wide cursor-pointer">
                  {t("header.faq")}
                </Link>

                <button
                  className="btn-hover font-alfa px-6 py-2 rounded-full text-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollTo("#predict");
                  }}
                >
                  {t("header.getStarted")}
                </button>
              </>
            ) : (
              <Link to="/" className="btn-hover font-alfa px-6 py-2 rounded-full text-lg font-bold shadow-md">
                {t("header.back")}
              </Link>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            className="header-settings"
            aria-label={theme === 'dark' ? t("header.lightMode") : t("header.darkMode")}
            onClick={toggleTheme}
            title={theme === 'dark' ? t("header.lightMode") : t("header.darkMode")}
          >
            {theme === 'dark' ? (
              // Sun icon for light mode
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              // Moon icon for dark mode
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Settings Icon */}
          <button
            className="header-settings"
            aria-label={t("header.settings")}
            onClick={handleSettings}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;


