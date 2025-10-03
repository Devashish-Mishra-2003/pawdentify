// src/components/Header.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import pawLogo from "../assets/PAWS_white_text.png";

const handleScrollTo = (id) => {
  const el = document.getElementById(id.substring(1));
  if (el) {
    window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  }
};

const Header = ({ showInfo, onSettingsClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";

  const handleSettings = (e) => {
    e?.preventDefault();
    if (typeof onSettingsClick === "function") return onSettingsClick();
    // fallback: route to /settings
    navigate("/settings");
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 shadow-md"
      style={{ backgroundColor: "#8c52ff" }}
    >
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
            <img src={pawLogo} alt="PAWS Logo" className="w-60 h-auto object-contain" />
          </a>
        ) : (
          <Link to="/">
            <img src={pawLogo} alt="PAWS Logo" className="w-45 h-auto object-contain" />
          </Link>
        )}

        {/* Navigation */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-6">
            {onHome ? (
              [
                { id: "#hero", label: "Home" },
                { id: "#predict", label: "Predict" },
                // Info only shown when showInfo true
                ...(showInfo ? [{ id: "#info", label: "Info" }] : []),
              ].map((link) => (
                <a
                  key={link.id}
                  href={link.id}
                  className="nav-link font-alfa font-bold text-white text-xl tracking-wide cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollTo(link.id);
                  }}
                >
                  {link.label}
                </a>
              ))
            ) : (
              <Link
                to="/"
                className="btn-hover font-alfa px-6 py-2 rounded-full text-lg bg-white text-purple-700 font-bold shadow-md hover:bg-purple-100"
              >
                Back
              </Link>
            )}

            {/* FAQ link always visible */}
            <Link
              to="/faq"
              className="nav-link font-alfa font-bold text-white text-xl tracking-wide cursor-pointer"
            >
              FAQ
            </Link>

            {/* Get Started (only on home) */}
            {onHome && (
              <button
                className="btn-hover font-alfa px-6 py-2 rounded-full text-lg"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo("#predict");
                }}
              >
                Get Started
              </button>
            )}
          </div>

          {/* Settings Icon (rightmost) */}
      {/* Settings Icon - Rightmost corner */}
<button
  className="p-2 rounded-full hover:bg-white transition-all duration-200 text-white hover:text-purple-700 ml-4"
  aria-label="Settings"
  onClick={() => (window.location.href = '/settings')}
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



