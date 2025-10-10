// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/clerk-react";
import pawLogo from "../assets/PAWS_white_text.png";

const handleScrollTo = (id) => {
  const el = document.getElementById(id.substring(1));
  if (el) {
    window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  }
};

const Header = ({ showInfo }) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const onHome = location.pathname === "/";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/sign-in');
    setShowDropdown(false);
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
    setShowDropdown(false);
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
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Authentication Section */}
          <SignedOut>
            <Link 
              to="/sign-up"
              className="btn-hover font-alfa px-6 py-2 rounded-full text-lg font-bold shadow-md"
            >
              {t("header.signUp")}
            </Link>
          </SignedOut>

          <SignedIn>
            {/* Custom Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {/* Profile Picture Button */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full border-2 transition-all cursor-pointer overflow-hidden"
                style={{
                  borderColor: showDropdown ? '#8c52ff' : 'white',
                }}
              >
                <img 
                  src={user?.imageUrl} 
                  alt={user?.firstName || 'User'} 
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-lg shadow-2xl py-2 z-50"
                  style={{
                    background: theme === 'dark' 
                      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(49, 46, 129, 0.95) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 245, 255, 0.95) 100%)',
                    border: '1px solid var(--color-auth-card-border)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {/* User Info */}
                  <div 
                    className="px-4 py-3 border-b"
                    style={{ borderColor: 'var(--color-auth-divider)' }}
                  >
                    <p 
                      className="text-sm font-semibold"
                      style={{ color: 'var(--color-auth-title)' }}
                    >
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p 
                      className="text-xs truncate"
                      style={{ color: 'var(--color-auth-subtitle)' }}
                    >
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={handleDashboardClick}
                      className="flex items-center w-full px-4 py-2 text-sm transition-colors text-left"
                      style={{ color: 'var(--clerk-color-text-primary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(140, 82, 255, 0.15)';
                      }}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      {t("header.dashboard")}
                    </button>

                    <Link
                      to="/settings"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center px-4 py-2 text-sm transition-colors"
                      style={{ color: 'var(--clerk-color-text-primary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(140, 82, 255, 0.15)';
                      }}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("header.settings")}
                    </Link>

                    <div 
                      className="border-t my-1"
                      style={{ borderColor: 'var(--color-auth-divider)' }}
                    ></div>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm transition-colors text-left"
                      style={{ color: 'var(--clerk-color-text-primary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(140, 82, 255, 0.15)';
                      }}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      {t("header.signOut")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;







