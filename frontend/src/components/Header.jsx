// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/clerk-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from "../contexts/ThemeContext";

const handleScrollTo = (id) => {
  const el = document.getElementById(id.substring(1));
  if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
};

const Header = ({ showInfo }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const onHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", path: "/", section: "#hero" },
    { label: "Browse", path: "/search-breed" },
    { label: "Services", path: "/services" },
    { label: "Settings", path: "/settings" },
    { label: "FAQ", path: "/faq" },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "py-4" : "py-6"}`}>
      <nav className={`max-w-6xl mx-auto px-6 h-16 rounded-full flex items-center justify-between transition-all duration-300 ${isScrolled ? "bg-white/95 dark:bg-black/90 backdrop-blur-xl shadow-lg border border-gray-200/80 dark:border-white/5" : "bg-white/80 dark:bg-black/30 backdrop-blur-md shadow-sm border border-gray-200/60 dark:border-white/10"}`}>
        
        {/* Logo */}
        <Link to="/" className="text-xl md:text-2xl font-extrabold text-black dark:text-white tracking-tighter flex items-center gap-2">
           Pawdentify
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
           {navLinks.map((link) => (
             <React.Fragment key={link.label}>
               {onHome && link.section ? (
                 <button 
                   onClick={() => handleScrollTo(link.section)}
                   className="text-[10px] font-bold text-gray-700 dark:text-gray-300 hover:text-[#30A7DB] transition-colors uppercase tracking-[0.2em]"
                 >
                   {link.label}
                 </button>
               ) : (
                 <Link 
                   to={link.path}
                   className="text-[10px] font-bold text-gray-700 dark:text-gray-300 hover:text-[#30A7DB] transition-colors uppercase tracking-[0.2em]"
                 >
                   {link.label}
                 </Link>
               )}
             </React.Fragment>
           ))}
           {onHome && showInfo && (
              <button 
                onClick={() => handleScrollTo("#info")}
                className="text-[10px] font-bold text-[#7D64A3] hover:text-[#30A7DB] transition-colors uppercase tracking-[0.2em]"
              >
                Prediction
              </button>
           )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
           {/* Theme Toggle */}
           <button 
             onClick={toggleTheme}
             className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
           >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
           </button>

           <SignedIn>
              <Link to="/dashboard" className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm hover:scale-110 transition-transform">
                 <img src={user?.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              </Link>
           </SignedIn>
           <SignedOut>
              <Link to="/sign-in" className="pill-button bg-[#111111] text-white py-2 px-6 text-xs font-bold uppercase tracking-widest hover:-translate-y-0.5 transition-transform">
                 Sign In
              </Link>
           </SignedOut>

           {/* Mobile Menu Toggle */}
           <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-black dark:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
           </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 right-6 bg-white dark:bg-[#111111] rounded-[40px] shadow-2xl p-10 border border-gray-100 dark:border-white/10 flex flex-col gap-8 lg:hidden z-50"
          >
             <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.label} 
                    to={link.path} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl font-black text-black dark:text-white tracking-tighter"
                  >
                    {link.label}
                  </Link>
                ))}
                 <SignedIn>
                    <Link to="/settings" className="text-3xl font-black text-black dark:text-white tracking-tighter" onClick={() => setMobileMenuOpen(false)}>Settings</Link>
                    <Link to="/dashboard" className="text-3xl font-black text-[#30A7DB] tracking-tighter" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                 </SignedIn>
             </div>
                          <hr className="border-gray-100 dark:border-white/10" />
             
             <SignedIn>
                 <div className="flex items-center gap-4">
                    <img src={user?.imageUrl} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                       <p className="font-bold text-black dark:text-white">{user?.firstName}</p>
                       <button onClick={() => signOut()} className="text-xs font-bold text-red-500 uppercase tracking-widest">Sign Out</button>
                    </div>
                 </div>
             </SignedIn>
             <SignedOut>
                <Link to="/sign-in" className="pill-button bg-[#111111] text-white py-5 w-full text-center font-bold uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
             </SignedOut>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
