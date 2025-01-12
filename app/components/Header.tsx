'use client';

import Link from 'next/link';
import Logo from './Logo';
import { useState } from 'react';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'ABOUT', href: '/about', color: 'bg-[#FFD7BA]' },
  { label: 'DOCS', href: '/docs', color: 'bg-[#FEFFA3]' },
//   { label: 'EXAMPLES', href: '/examples', color: 'bg-[#E7C6FF]' },
  { label: 'FAQ', href: '/faq', color: 'bg-[#98FF98]' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full py-8 sm:py-12 px-8 sm:px-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          <Link href="https://www.browserbase.com" className="flex items-center">
            <span className="text-2xl sm:text-3xl font-galindo flex items-center">
              <div className="mr-2">🧠</div> 
              <Logo className="h-7 mb-1 w-7 text-[#1a1b1e] dark:text-white" />
            </span>
          </Link>
          <Link href="/" className="text-2xl sm:text-3xl font-galindo hover:opacity-80 transition-opacity">
            rainrot
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${item.color} px-5 py-3 rounded-lg font-galindo text-[#1a1b1e] hover:opacity-90 transition-opacity border border-[#1a1b1e]/10`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden p-2"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-[#1a1b1e] dark:text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <motion.div 
            className="absolute top-[5.5rem] right-4 w-64 bg-[#FFF5E1] dark:bg-[#1a1b1e]/90 backdrop-blur-lg shadow-lg sm:hidden p-4 z-50 rounded-lg border border-[#1a1b1e]/10 origin-top"
            initial={{ opacity: 0, y: -20, scaleY: 0.3 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -20, scaleY: 0.3 }}
            transition={{
              type: "spring",
              stiffness: 300,
              mass: 0.7,
              duration: 0.3
            }}
          >
            <nav className="flex flex-col gap-3">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    delay: index * 0.1,
                    mass: 0.5
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`${item.color} px-5 py-3 rounded-lg font-galindo text-[#1a1b1e] hover:opacity-90 hover:scale-[0.98] transition-all duration-200 border border-[#1a1b1e]/10 text-center block`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
} 