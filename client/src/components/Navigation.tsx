/**
 * TechBridge Collective — Navigation
 * Fixed: proper hamburger icon, no bleed into content, correct z-index layering
 */
import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';
import SoundToggle from './SoundToggle';

const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/get-help', label: 'Get Help' },
  { path: '/host-a-hub', label: 'Host a Hub' },
  { path: '/impact', label: 'TechMinutes® Impact' },
  { path: '/about', label: 'About' },
  { path: '/dashboard', label: 'Dashboard', hasDot: true },
];

export default function Navigation() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = useCallback(() => {
    tbSoundEngine.play('nav_click');
  }, []);

  const handleHover = useCallback((path: string) => {
    setHoveredItem(path);
    tbSoundEngine.play('pillar_hover');
  }, []);

  return (
    <>
      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div className="h-16 lg:h-[72px]" />

      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(10, 31, 20, 0.98)'
            : 'rgba(10, 31, 20, 0.92)',
          backdropFilter: 'blur(24px)',
          borderBottom: scrolled
            ? '1px solid rgba(232, 185, 49, 0.15)'
            : '1px solid rgba(232, 185, 49, 0.06)',
          boxShadow: scrolled
            ? '0 4px 40px rgba(0,0,0,0.4), 0 0 30px rgba(232, 185, 49, 0.05)'
            : '0 2px 20px rgba(0,0,0,0.2)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link href="/" onClick={handleNavClick}>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(232,185,49,0.5)]">
                  <path d="M4 26 Q18 8 32 26" stroke="#E8B931" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <line x1="4" y1="26" x2="32" y2="26" stroke="#E8B931" strokeWidth="2" />
                  <line x1="11" y1="26" x2="11" y2="17" stroke="#00D4AA" strokeWidth="1.5" opacity="0.7" />
                  <line x1="18" y1="26" x2="18" y2="12" stroke="#E8B931" strokeWidth="1.5" />
                  <line x1="25" y1="26" x2="25" y2="17" stroke="#00D4AA" strokeWidth="1.5" opacity="0.7" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-base lg:text-lg font-bold tracking-wider text-glow-gold">
                  TECHBRIDGE
                </span>
                <span className="hidden sm:block font-display text-[10px] font-semibold tracking-[0.3em] uppercase"
                  style={{ color: 'rgba(0, 212, 170, 0.6)' }}>
                  COLLECTIVE
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.path;
              const isHovered = hoveredItem === item.path;
              return (
                <Link key={item.path} href={item.path} onClick={handleNavClick}>
                  <span
                    className="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer block"
                    style={{
                      color: isActive ? '#E8B931' : isHovered ? '#E8B931' : 'rgba(253, 248, 240, 0.6)',
                      background: isActive ? 'rgba(232, 185, 49, 0.1)' : isHovered ? 'rgba(232, 185, 49, 0.05)' : 'transparent',
                      textShadow: isActive || isHovered ? '0 0 12px rgba(232, 185, 49, 0.3)' : 'none',
                    }}
                    onMouseEnter={() => handleHover(item.path)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {item.label}
                    {item.hasDot && (
                      <span
                        className="absolute top-1.5 right-0.5 w-2 h-2 rounded-full animate-pulse"
                        style={{ background: '#00D4AA', boxShadow: '0 0 8px rgba(0, 212, 170, 0.6)' }}
                      />
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #00D4AA, #E8B931)',
                          boxShadow: '0 0 8px rgba(232, 185, 49, 0.4)',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </span>
                </Link>
              );
            })}

            <SoundToggle />

            <Link href="/get-help" onClick={handleNavClick}>
              <span className="ml-2 px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 cursor-pointer transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(0, 212, 170, 0.1)',
                  color: '#00D4AA',
                  border: '1px solid rgba(0, 212, 170, 0.3)',
                }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00D4AA', boxShadow: '0 0 6px rgba(0, 212, 170, 0.5)' }} />
                Ask H.K. AI
              </span>
            </Link>

            <a
              href="https://calendly.com/aitconsult22/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleNavClick}
              className="ml-2 px-4 py-2 text-sm font-display font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #E8B931, #C9A227)',
                color: '#0A1F14',
                boxShadow: '0 0 15px rgba(232, 185, 49, 0.3)',
              }}
            >
              Book a Call
            </a>
          </div>

          {/* Mobile Hamburger Button — proper 3-line icon */}
          <button
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300"
            style={{
              background: mobileOpen ? 'rgba(232, 185, 49, 0.1)' : 'transparent',
              border: '1px solid rgba(232, 185, 49, 0.2)',
            }}
            onClick={() => {
              setMobileOpen(!mobileOpen);
              tbSoundEngine.play('nav_click');
            }}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <motion.span
                className="block w-full h-[2px] rounded-full origin-left"
                style={{ background: '#E8B931' }}
                animate={mobileOpen
                  ? { rotate: 45, x: 2, y: -1 }
                  : { rotate: 0, x: 0, y: 0 }
                }
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="block w-full h-[2px] rounded-full"
                style={{ background: '#E8B931' }}
                animate={mobileOpen
                  ? { opacity: 0, x: -10 }
                  : { opacity: 1, x: 0 }
                }
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block w-full h-[2px] rounded-full origin-left"
                style={{ background: '#E8B931' }}
                animate={mobileOpen
                  ? { rotate: -45, x: 2, y: 1 }
                  : { rotate: 0, x: 0, y: 0 }
                }
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay — full screen */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(10, 31, 20, 0.98)', backdropFilter: 'blur(30px)' }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu content */}
            <motion.div
              className="relative pt-24 px-8 flex flex-col gap-1"
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
                    transition={{ delay: 0.1 + i * 0.06 }}
                  >
                    <Link href={item.path} onClick={() => { handleNavClick(); setMobileOpen(false); }}>
                      <span
                        className="flex items-center gap-4 text-2xl font-display font-bold py-4 transition-all cursor-pointer"
                        style={{
                          color: isActive ? '#E8B931' : '#FDF8F0',
                          textShadow: isActive ? '0 0 20px rgba(232, 185, 49, 0.3)' : 'none',
                          borderBottom: '1px solid rgba(232, 185, 49, 0.08)',
                        }}
                      >
                        {isActive && (
                          <span className="w-2 h-6 rounded-full" style={{ background: 'linear-gradient(to bottom, #00D4AA, #E8B931)' }} />
                        )}
                        {item.label}
                        {item.hasDot && (
                          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00D4AA', boxShadow: '0 0 8px rgba(0, 212, 170, 0.5)' }} />
                        )}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-col gap-4"
              >
                <Link href="/get-help" onClick={() => setMobileOpen(false)}>
                  <span className="block text-center py-4 rounded-xl text-base font-display font-bold cursor-pointer transition-all hover:scale-[1.02]"
                    style={{
                      background: 'rgba(0, 212, 170, 0.1)',
                      color: '#00D4AA',
                      border: '1px solid rgba(0, 212, 170, 0.3)',
                    }}>
                    <span className="inline-block w-2 h-2 rounded-full animate-pulse mr-2" style={{ background: '#00D4AA' }} />
                    Ask H.K. AI
                  </span>
                </Link>
                <a
                  href="https://calendly.com/aitconsult22/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-4 rounded-xl text-lg font-display font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #E8B931, #C9A227)',
                    color: '#0A1F14',
                    boxShadow: '0 0 20px rgba(232, 185, 49, 0.3)',
                  }}
                >
                  Book a Call
                </a>
                <div className="flex justify-center mt-2">
                  <SoundToggle />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
