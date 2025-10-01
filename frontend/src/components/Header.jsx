import React from 'react';
import pawLogo from '../assets/PAWS_white_text.png'; // adjust path if needed

const handleScrollTo = (id) => {
    const element = document.getElementById(id.substring(1));
    if (element) {
        window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
};

const Header = () => (
    <header
        className="fixed top-0 left-0 w-full z-50 shadow-md "
        style={{ backgroundColor: '#8c52ff' }}
    >
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center h-20">
            {/* Logo */}
            <a
                href="#hero"
                onClick={(e) => {
                    e.preventDefault();
                    handleScrollTo('#hero');
                }}
            >
                <img
                    src={pawLogo}
                    alt="PAWS Logo"
                    className="w-40 h-auto object-contain"
                />
            </a>

            {/* Navigation */}
            <div className="flex items-center space-x-10">
                <a
                    href="#hero"
                    className="font-alfa font-bold text-white text-xl tracking-wide hover:text-pink-300 transition-colors cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        handleScrollTo('#hero');
                    }}
                >
                    Home
                </a>
                <a
                    href="#predict"
                    className="font-alfa font-bold text-white text-xl tracking-wide hover:text-pink-300 transition-colors cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        handleScrollTo('#predict');
                    }}
                >
                    Predict
                </a>
                <a
                    href="#info"
                    className="font-alfa font-bold text-white text-xl tracking-wide hover:text-pink-300 transition-colors cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        handleScrollTo('#info');
                    }}
                >
                    Info
                </a>

                {/* Get Started button */}
                <button
                    className="bg-white text-purple-800 font-alfa px-6 py-2 rounded-full shadow-lg hover:bg-purple-200 transition-all text-lg"
                    onClick={(e) => {
                        e.preventDefault();
                        handleScrollTo('#predict');
                    }}
                >
                    Get Started
                </button>
            </div>
        </nav>
    </header>
);

export default Header;
