/**
 * TechBridge Collective — Shared Navigation
 * Bridge-themed nav with sound integration and mobile responsive hamburger.
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';

const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/get-help', label: 'Get Help' },
  { path: '/host-a-hub', label: 'Host a Hub' },
  { path: '/impact', label: 'TechMinutes® Impact' },
  { path: '/about', label: 'About' },
  { path: '/dashboard', label: 'Dashboard' },
];

export default function Navigation() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleNavClick = () => {
    tbSoundEngine.play('nav_click');
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(15, 43, 31, 0.95)' : 'rgba(15, 43, 31, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(201, 162, 39, 0.2)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        <div className="container flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" onClick={handleNavClick}>
            <div className="flex items-center gap-3 cursor-pointer group">
              {/* Bridge icon */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="transition-transform duration-300 group-hover:scale-110">
                <path d="M4 22 Q16 8 28 22" stroke="#C9A227" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <line x1="4" y1="22" x2="28" y2="22" stroke="#C9A227" strokeWidth="2" />
                <line x1="10" y1="22" x2="10" y2="15" stroke="#C9A227" strokeWidth="1.5" />
                <line x1="16" y1="22" x2="16" y2="11" stroke="#C9A227" strokeWidth="1.5" />
                <line x1="22" y1="22" x2="22" y2="15" stroke="#C9A227" strokeWidth="1.5" />
              </svg>
              <div>
                <span className="font-display text-sm md:text-base font-bold tracking-wide" style={{ color: '#C9A227' }}>
                  TECHBRIDGE
                </span>
                <span className="hidden md:inline font-display text-sm font-bold tracking-wide ml-1" style={{ color: 'rgba(253, 248, 240, 0.7)' }}>
                  COLLECTIVE
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.path || (item.path === '/' && location === '/');
              return (
                <Link key={item.path} href={item.path} onClick={handleNavClick}>
                  <span
                    className="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer"
                    style={{
                      color: isActive ? '#C9A227' : 'rgba(253, 248, 240, 0.7)',
                      background: isActive ? 'rgba(201, 162, 39, 0.1)' : 'transparent',
                    }}
                  >
                    {item.label}
                    {item.label === 'Dashboard' && (
                      <span
                        className="absolute top-1.5 right-1 w-2 h-2 rounded-full"
                        style={{ background: '#22c55e', boxShadow: '0 0 6px rgba(34, 197, 94, 0.5)' }}
                      />
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                        style={{ background: '#C9A227' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </span>
                </Link>
              );
            })}

            {/* Book a Call CTA */}
            <a
              href="https://calendly.com/thetechbridgecollective/techbridge-15-min-pilot-call"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleNavClick}
              className="ml-3 px-4 py-2 rounded-lg text-sm font-display font-bold transition-all duration-300 hover:scale-105"
              style={{
                background: '#C9A227',
                color: '#1B4332',
                boxShadow: '0 2px 12px rgba(201, 162, 39, 0.3)',
              }}
            >
              Book a Call
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => {
              setMobileOpen(!mobileOpen);
              tbSoundEngine.play('nav_click');
            }}
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-6 h-0.5 rounded-full"
              style={{ background: '#C9A227' }}
              animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="block w-6 h-0.5 rounded-full"
              style={{ background: '#C9A227' }}
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className="block w-6 h-0.5 rounded-full"
              style={{ background: '#C9A227' }}
              animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(15, 43, 31, 0.95)', backdropFilter: 'blur(20px)' }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              className="relative pt-24 px-8 flex flex-col gap-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              {NAV_ITEMS.map((item, i) => {
                const isActive = location === item.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link href={item.path} onClick={handleNavClick}>
                      <span
                        className="block text-2xl font-display font-bold py-3 border-b transition-colors cursor-pointer"
                        style={{
                          color: isActive ? '#C9A227' : '#FDF8F0',
                          borderColor: 'rgba(201, 162, 39, 0.15)',
                        }}
                      >
                        {item.label}
                        {item.label === 'Dashboard' && (
                          <span
                            className="inline-block w-2 h-2 rounded-full ml-2"
                            style={{ background: '#22c55e' }}
                          />
                        )}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <a
                  href="https://calendly.com/thetechbridgecollective/techbridge-15-min-pilot-call"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-4 rounded-xl text-lg font-display font-bold transition-all duration-300"
                  style={{
                    background: '#C9A227',
                    color: '#1B4332',
                    boxShadow: '0 4px 20px rgba(201, 162, 39, 0.3)',
                  }}
                >
                  Book a Call
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
