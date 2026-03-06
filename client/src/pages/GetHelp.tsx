import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BridgeSVG from '../components/BridgeSVG';
import HKChat from '../components/HKChat';
import { useScrollReveal, useCountUp, useScrollProgress } from '../hooks/useScrollReveal';
import { tbSoundEngine } from '../lib/TBSoundEngine';

/*
 * DESIGN: "The Bridge" — Narrative Journey
 * TechBridge Collective · Get Help Page
 * 
 * Colors: Forest Green (#1B4332) + Gold (#C9A227) + Cream (#FDF8F0)
 * Fonts: Fraunces (display) + Inter (body) + JetBrains Mono (data)
 * Bridge metaphor woven throughout — scroll IS crossing the bridge
 */

// ============================================
// CDN IMAGE URLS
// ============================================
const IMAGES = {
  heroBridge: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/tb-hero-bridge-UbQzT3Yxdjbgg9ttB4ndQo.webp',
  navigatorSession: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/tb-navigator-session-m6pruiXUssfWTscjuagPF4.webp',
  communityHub: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/tb-community-hub-mjcoK2qnQkafwbhGuQVL9w.webp',
  hkAI: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/tb-hk-ai-glow-j3fRn9jTFBDqKcTgru6Ddh.webp',
  impactData: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/tb-impact-data-bGzJFSEJ2jyfkk7HmWcrYx.webp',
};

// ============================================
// STORY DATA — Real scenarios from SPAN docs
// ============================================
const STORIES = [
  {
    name: 'Maria',
    scenario: 'Locked out of her child\'s school portal',
    duration: '18 min',
    category: 'Education',
    icon: '📚',
    color: '#2D6A4F',
    detail: 'Maria came in during her lunch break. Her daughter\'s school switched to a new portal, and the password reset emails weren\'t arriving. In 18 minutes, a Digital Navigator helped her regain access, set up a backup email, and bookmarked the portal on her phone. Her daughter\'s grades were due that week.',
  },
  {
    name: 'James',
    scenario: 'VA job application timed out twice',
    duration: '35 min',
    category: 'Workforce',
    icon: '💼',
    color: '#1B4332',
    detail: 'James, a veteran, had been trying to complete a federal job application for three days. The form kept timing out. A Digital Navigator sat beside him, helped him pre-fill answers in a document first, then guided him through the submission in one session. He got the interview.',
  },
  {
    name: 'Dorothy',
    scenario: 'Needed a telehealth appointment but didn\'t know where to start',
    duration: '40 min',
    category: 'Health',
    icon: '🏥',
    color: '#C4704B',
    detail: 'Dorothy, 74, had never used video calling. Her doctor\'s office moved to telehealth-only for follow-ups. A Digital Navigator helped her download the app, test her camera and microphone, and practice joining a call. She made her appointment that afternoon.',
  },
  {
    name: 'Carlos',
    scenario: 'Housing document upload kept failing',
    duration: '22 min',
    category: 'Housing',
    icon: '🏠',
    color: '#C9A227',
    detail: 'Carlos needed to upload proof of income for a housing application. The file was too large, the format was wrong, and the deadline was tomorrow. A Digital Navigator helped him resize the document, convert it to PDF, and submit it. His application went through.',
  },
  {
    name: 'Keisha',
    scenario: 'FAFSA application stalled at verification',
    duration: '45 min',
    category: 'Education',
    icon: '🎓',
    color: '#2D6A4F',
    detail: 'Keisha\'s FAFSA was flagged for verification. She didn\'t understand the IRS Data Retrieval Tool. A Digital Navigator walked her through every step, helped her link her tax information, and submitted the verification. She didn\'t lose her financial aid.',
  },
];

// ============================================
// THREE PILLARS
// ============================================
const PILLARS = [
  {
    number: 1,
    title: 'Weekly Help Desk',
    description: 'Walk-in and scheduled 1:1 sessions with trained, paid Digital Navigators. No volunteer churn. A consistent weekly presence residents rely on.',
    icon: '🤝',
  },
  {
    number: 2,
    title: 'H.K. AI — 24/7 Triage',
    description: 'Named for Horace King. Step-by-step guidance between visits. Complex cases flagged for human follow-up at next session.',
    icon: '🌉',
  },
  {
    number: 3,
    title: 'TechMinutes® Reporting',
    description: 'Monthly non-PII summary: minutes delivered, issue categories, demand patterns, and recommendations. Proof partners can use.',
    icon: '📊',
  },
];

// ============================================
// TIMELINE STEPS
// ============================================
const TIMELINE = [
  { day: 'Day 1', label: '15-min call', description: 'A quick conversation to see if we\'re a fit.' },
  { day: 'Days 1–30', label: 'Setup + Training', description: 'We handle onboarding, navigator training, and materials.' },
  { day: 'Days 30–45', label: 'Hub Hours Live', description: 'Weekly sessions begin. Residents start walking in.' },
  { day: 'Day 60', label: 'First Report', description: 'Your first TechMinutes® impact report lands.' },
];

// ============================================
// SCROLL REVEAL WRAPPER
// ============================================
function Reveal({ children, className = '', direction = 'up', delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  const dirClass = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : direction === 'scale' ? 'reveal-scale' : 'reveal';

  return (
    <div
      ref={ref}
      className={`${dirClass} ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

// ============================================
// STORY CARD COMPONENT
// ============================================
function StoryCard({ story, index }: { story: typeof STORIES[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Reveal direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 0.1}>
      <div
        className="story-card rounded-xl overflow-hidden"
        onClick={() => {
          setExpanded(!expanded);
          tbSoundEngine.play(expanded ? 'story_close' : 'story_reveal');
        }}
        style={{
          background: 'white',
          border: '1px solid #e8e0d0',
        }}
      >
        {/* Card header */}
        <div className="flex items-start gap-4 p-6 pb-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: `${story.color}15` }}
          >
            {story.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <span className="font-display text-lg font-semibold" style={{ color: '#1B4332' }}>
                {story.name}
              </span>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded-full"
                style={{ background: `${story.color}15`, color: story.color }}
              >
                {story.category}
              </span>
            </div>
            <p className="text-sm" style={{ color: '#2D3436' }}>{story.scenario}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="font-display text-2xl font-bold" style={{ color: '#C9A227' }}>
              {story.duration}
            </span>
            <p className="text-xs" style={{ color: '#7C9A6E' }}>one visit</p>
          </div>
        </div>

        {/* Expandable detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2">
                <div className="w-12 h-0.5 mb-4" style={{ background: 'linear-gradient(90deg, #1B4332, #C9A227)' }} />
                <p className="text-sm leading-relaxed" style={{ color: '#2D3436', lineHeight: '1.7' }}>
                  {story.detail}
                </p>
                <p className="text-xs mt-3 italic" style={{ color: '#7C9A6E' }}>
                  The resident sees one visit. The funder sees systemic change.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click hint */}
        <div className="px-6 pb-4 flex items-center gap-2">
          <span className="text-xs" style={{ color: '#C9A227' }}>
            {expanded ? '▲ Close' : '▼ Read the full story'}
          </span>
        </div>
      </div>
    </Reveal>
  );
}

// ============================================
// ANIMATED STAT COUNTER
// ============================================
function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const { ref, isVisible } = useScrollReveal();
  const count = useCountUp(value, 2000, isVisible);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl font-bold" style={{ color: '#C9A227' }}>
        {count}{suffix}
      </div>
      <div className="text-sm mt-1" style={{ color: '#2D6A4F' }}>{label}</div>
    </div>
  );
}

// ============================================
// PILLAR CARD
// ============================================
function PillarCard({ pillar, index }: { pillar: typeof PILLARS[0]; index: number }) {
  return (
    <Reveal delay={index * 0.15}>
      <div className="pillar-card h-full">
        <div
          className="pillar-card-inner h-full rounded-2xl p-8 relative overflow-hidden"
          style={{
            background: 'white',
            border: '1px solid #e8e0d0',
            boxShadow: '0 4px 20px rgba(27, 67, 50, 0.08)',
          }}
        >
          {/* Number badge */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-display font-bold mb-5"
            style={{ background: '#1B4332', color: '#FDF8F0' }}
          >
            {pillar.number}
          </div>

          {/* Icon */}
          <div className="text-3xl mb-3">{pillar.icon}</div>

          <h3 className="font-display text-xl font-bold mb-3" style={{ color: '#1B4332' }}>
            {pillar.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: '#2D3436', lineHeight: '1.7' }}>
            {pillar.description}
          </p>

          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: 'linear-gradient(90deg, #1B4332, #C9A227)' }}
          />
        </div>
      </div>
    </Reveal>
  );
}

// ============================================
// MAIN GET HELP PAGE
// ============================================
export default function GetHelp() {
  const scrollProgress = useScrollProgress();
  const [formData, setFormData] = useState({ name: '', need: '', contact: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [soundReady, setSoundReady] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const lastSectionRef = useRef<string>('');

  const toggleSound = () => {
    const newMuted = !soundMuted;
    setSoundMuted(newMuted);
    tbSoundEngine.setMuted(newMuted);
    if (!newMuted) tbSoundEngine.play('nav_click');
  };

  // Initialize sound on first user interaction
  useEffect(() => {
    const initSound = async () => {
      if (!soundReady) {
        await tbSoundEngine.init();
        setSoundReady(true);
      }
    };
    const handler = () => { initSound(); window.removeEventListener('click', handler); };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [soundReady]);

  // Play section enter sounds based on scroll progress
  useEffect(() => {
    const sections = [
      { id: 'hero', threshold: 0 },
      { id: 'gap', threshold: 0.1 },
      { id: 'stats', threshold: 0.2 },
      { id: 'stories', threshold: 0.3 },
      { id: 'pillars', threshold: 0.45 },
      { id: 'hk', threshold: 0.55 },
      { id: 'outcomes', threshold: 0.65 },
      { id: 'timeline', threshold: 0.75 },
      { id: 'form', threshold: 0.85 },
    ];
    const current = sections.reduce((acc, s) => scrollProgress >= s.threshold ? s.id : acc, 'hero');
    if (current !== lastSectionRef.current) {
      lastSectionRef.current = current;
      tbSoundEngine.play('section_enter');
    }
  }, [scrollProgress]);

  // Bridge complete sound
  useEffect(() => {
    if (scrollProgress > 0.15 && scrollProgress < 0.17) {
      tbSoundEngine.play('bridge_complete');
    }
  }, [Math.floor(scrollProgress * 20)]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    tbSoundEngine.play('form_submit');
    // In production, this would submit to the TechBridge backend
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--tb-cream)' }}>
      {/* ============================================
          BRIDGE PROGRESS BAR (fixed top)
          ============================================ */}
      <div className="bridge-progress" style={{ width: `${scrollProgress * 100}%` }} />

      {/* ============================================
          NAVIGATION
          ============================================ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrollProgress > 0.02 ? 'rgba(253, 248, 240, 0.95)' : 'transparent',
          backdropFilter: scrollProgress > 0.02 ? 'blur(12px)' : 'none',
          borderBottom: scrollProgress > 0.02 ? '1px solid rgba(27, 67, 50, 0.1)' : 'none',
          paddingTop: scrollProgress > 0.02 ? '0.75rem' : '1.5rem',
          paddingBottom: scrollProgress > 0.02 ? '0.75rem' : '1.5rem',
        }}
      >
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Bridge icon */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M4 22 Q16 8 28 22" stroke="#1B4332" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <line x1="4" y1="22" x2="28" y2="22" stroke="#C9A227" strokeWidth="2" />
              <line x1="10" y1="22" x2="10" y2="15" stroke="#1B4332" strokeWidth="1.5" />
              <line x1="16" y1="22" x2="16" y2="11" stroke="#1B4332" strokeWidth="1.5" />
              <line x1="22" y1="22" x2="22" y2="15" stroke="#1B4332" strokeWidth="1.5" />
            </svg>
            <span className="font-display text-lg font-bold" style={{ color: '#1B4332' }}>
              TechBridge
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: '#2D6A4F' }}>
            <a href="#the-gap" className="hover:text-[#C9A227] transition-colors" onClick={() => tbSoundEngine.play('nav_click')}>The Gap</a>
            <a href="#stories" className="hover:text-[#C9A227] transition-colors" onClick={() => tbSoundEngine.play('nav_click')}>Stories</a>
            <a href="#how-it-works" className="hover:text-[#C9A227] transition-colors" onClick={() => tbSoundEngine.play('nav_click')}>How It Works</a>
            <a href="#hk" className="hover:text-[#C9A227] transition-colors" onClick={() => tbSoundEngine.play('nav_click')}>H.K.</a>
            <a href="#get-help" className="hover:text-[#C9A227] transition-colors font-bold px-4 py-2 rounded-lg" style={{ background: '#1B4332', color: '#FDF8F0' }}>
              Get Help
            </a>
            <button
              onClick={toggleSound}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ background: 'rgba(27, 67, 50, 0.08)', color: '#1B4332' }}
              title={soundMuted ? 'Unmute sounds' : 'Mute sounds'}
            >
              {soundMuted ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          </div>
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleSound}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(27, 67, 50, 0.08)', color: '#1B4332' }}
            >
              {soundMuted ? '🔇' : '🔊'}
            </button>
            <a
              href="#get-help"
              className="text-sm font-bold px-4 py-2 rounded-lg"
              style={{ background: '#1B4332', color: '#FDF8F0' }}
            >
              Get Help
            </a>
          </div>
        </div>
      </nav>

      {/* ============================================
          HERO SECTION — "The technology is live."
          ============================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <img
            src={IMAGES.heroBridge}
            alt="Bridge connecting communities"
            className="w-full h-full object-cover"
            style={{ opacity: 0.15 }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(253,248,240,0.3) 0%, rgba(253,248,240,0.95) 60%, var(--tb-cream) 100%)',
            }}
          />
        </div>

        <div className="container relative z-10 pt-32 pb-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-sm font-mono tracking-widest uppercase mb-6" style={{ color: '#C9A227' }}>
                TechBridge Collective · Raleigh-Durham
              </p>
            </motion.div>

            <motion.h1
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8"
              style={{ color: '#1B4332' }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              The technology<br />
              is <span style={{ color: '#C9A227' }}>live.</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl leading-relaxed mb-6"
              style={{ color: '#2D3436', maxWidth: '540px' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              The forms are online. What's missing is the person who sits down and walks you through it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <a
                href="#get-help"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-display font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: '#1B4332',
                  color: '#FDF8F0',
                  boxShadow: '0 4px 20px rgba(27, 67, 50, 0.3)',
                }}
              >
                Get Help Now
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#stories"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-lg font-display font-semibold transition-all duration-300"
                style={{ color: '#1B4332', border: '2px solid #1B4332' }}
              >
                See How It Works
              </a>
            </motion.div>

            <motion.p
              className="text-sm italic mt-8"
              style={{ color: '#7C9A6E' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              Named for Horace King (1807–1885), who built bridges connecting communities across the American South.
            </motion.p>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs" style={{ color: '#C9A227' }}>Scroll to cross the bridge</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v16m-4-4l4 4 4-4" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* ============================================
          ANIMATED BRIDGE (scroll-driven)
          ============================================ */}
      <section className="py-4 -mt-8 relative z-10">
        <div className="container">
          <BridgeSVG progress={scrollProgress * 2.5} />
        </div>
      </section>

      {/* ============================================
          THE GAP — Problem Statement
          ============================================ */}
      <section id="the-gap" className="py-20 md:py-32">
        <div className="container">
          <Reveal>
            <div
              className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
              style={{
                background: 'white',
                border: '1px solid #e8e0d0',
                boxShadow: '0 8px 40px rgba(27, 67, 50, 0.06)',
              }}
            >
              <div className="absolute top-0 left-0 w-1 h-full" style={{ background: '#C9A227' }} />

              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#1B4332' }}>
                The Gap We Close
              </h2>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <p className="text-lg leading-relaxed mb-6" style={{ color: '#2D3436', lineHeight: '1.8' }}>
                    A mother locked out of her child's school portal. A veteran whose job application timed out.
                    A senior who needs telehealth but doesn't know where to start.
                  </p>
                  <p className="text-lg leading-relaxed font-semibold" style={{ color: '#1B4332', lineHeight: '1.8' }}>
                    These aren't technology problems. They're navigation problems.
                  </p>
                </div>
                <div className="flex items-center">
                  <img
                    src={IMAGES.navigatorSession}
                    alt="Digital Navigator helping a community member"
                    className="rounded-xl w-full"
                    style={{ boxShadow: '0 8px 30px rgba(27, 67, 50, 0.12)' }}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          IMPACT STATS — Animated Counters
          ============================================ */}
      <section className="py-16" style={{ background: '#1B4332' }}>
        <div className="container">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCounter value={18} label="Avg. minutes per session" suffix=" min" />
              <StatCounter value={4} label="Issue categories tracked" />
              <StatCounter value={24} label="H.K. available" suffix="/7" />
              <StatCounter value={60} label="Days to first impact report" />
            </div>
          </Reveal>
          <Reveal>
            <p className="text-center text-sm mt-8 italic" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>
              "Because the best technology in the world doesn't matter if no one shows you how to use it."
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          STORIES — Interactive Story Cards
          ============================================ */}
      <section id="stories" className="py-20 md:py-32">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>
                Real Scenarios
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: '#1B4332' }}>
                One Visit Can Change Everything
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#2D3436' }}>
                Click any story to see how a single help desk visit transforms a navigation problem into a solved one.
              </p>
            </div>
          </Reveal>

          <div className="max-w-2xl mx-auto flex flex-col gap-5">
            {STORIES.map((story, i) => (
              <StoryCard key={story.name} story={story} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS — Three Pillars
          ============================================ */}
      <section id="how-it-works" className="py-20 md:py-32" style={{ background: 'rgba(27, 67, 50, 0.03)' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>
                What TechBridge Delivers
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: '#1B4332' }}>
                Three Pillars of Support
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#2D3436' }}>
                A complete system — not just a program. In-person help, AI triage between visits, and measurable impact every month.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {PILLARS.map((pillar, i) => (
              <PillarCard key={pillar.number} pillar={pillar} index={i} />
            ))}
          </div>

          {/* Community hub image */}
          <Reveal>
            <div className="mt-16 rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(27, 67, 50, 0.1)' }}>
              <img
                src={IMAGES.communityHub}
                alt="TechBridge community hub in action"
                className="w-full"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          H.K. AI SECTION
          ============================================ */}
      <section id="hk" className="py-20 md:py-32">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal direction="left">
              <div>
                <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>
                  Between Visits
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#1B4332' }}>
                  Meet H.K. — Your 24/7 Guide
                </h2>
                <p className="text-lg leading-relaxed mb-6" style={{ color: '#2D3436', lineHeight: '1.8' }}>
                  Named for Horace King, H.K. is an AI assistant that provides step-by-step guidance
                  between hub visits. Need help at 2 AM? H.K. walks you through it. Hit something complex?
                  H.K. flags it for your next in-person session.
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    'Step-by-step guidance for common tasks',
                    'Complex cases flagged for human follow-up',
                    'Available 24/7 — no wait, no appointment',
                    'Learns the most common community needs',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#1B4332' }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-sm" style={{ color: '#2D3436' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="relative">
                <img
                  src={IMAGES.hkAI}
                  alt="H.K. AI Assistant visualization"
                  className="rounded-2xl w-full"
                  style={{
                    boxShadow: '0 8px 40px rgba(27, 67, 50, 0.12)',
                    animation: 'glowPulse 4s ease-in-out infinite',
                  }}
                />
                {/* Floating badge */}
                <div
                  className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 px-5 py-3 rounded-xl font-display font-bold"
                  style={{
                    background: '#1B4332',
                    color: '#C9A227',
                    boxShadow: '0 4px 20px rgba(27, 67, 50, 0.3)',
                    animation: 'floatGentle 3s ease-in-out infinite',
                  }}
                >
                  24/7 Available
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================
          THE SPAN MODEL — From SPAN Document
          ============================================ */}
      <section className="py-20 md:py-32" style={{ background: 'rgba(27, 67, 50, 0.03)' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>
                Our Framework
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: '#1B4332' }}>
                The SPAN Model
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#2D3436' }}>
                Staffing, Platform, Analytics, and Navigation — a complete system for closing the digital divide.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                letter: 'S',
                title: 'Staffing',
                desc: 'Paid Digital Navigators — not volunteers. Trained, consistent, and accountable. Zero workload for your site.',
                accent: '#1B4332',
              },
              {
                letter: 'P',
                title: 'Platform',
                desc: 'H.K. AI assistant provides 24/7 triage between hub visits. Step-by-step guidance for common tasks.',
                accent: '#2D6A4F',
              },
              {
                letter: 'A',
                title: 'Analytics',
                desc: 'TechMinutes® tracks every interaction. Monthly reports with issue categories, resolution rates, and demand patterns.',
                accent: '#C9A227',
              },
              {
                letter: 'N',
                title: 'Navigation',
                desc: 'The core service. Sit down, walk through it, solve it. Education, workforce, health, and housing — all in one visit.',
                accent: '#C4704B',
              },
            ].map((item, i) => (
              <Reveal key={item.letter} delay={i * 0.12}>
                <div
                  className="rounded-2xl p-8 h-full relative overflow-hidden transition-transform duration-300 hover:scale-[1.03]"
                  style={{
                    background: 'white',
                    border: '1px solid #e8e0d0',
                    boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)',
                  }}
                  onMouseEnter={() => tbSoundEngine.play('pillar_hover')}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-display font-bold mb-5"
                    style={{ background: `${item.accent}15`, color: item.accent }}
                  >
                    {item.letter}
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3" style={{ color: '#1B4332' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#2D3436', lineHeight: '1.7' }}>
                    {item.desc}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: item.accent }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          WHO WE SERVE — Issue Categories from SPAN
          ============================================ */}
      <section className="py-20 md:py-32">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>
                Community Impact
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: '#1B4332' }}>
                Four Domains of Need
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#2D3436' }}>
                Every help desk interaction maps to one of four issue categories — giving partners clear data on what their community needs most.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: '📚',
                title: 'Education',
                sdg: 'SDG 4',
                examples: 'School portals, FAFSA, online learning platforms, student account recovery, grade tracking',
                stat: 'Most common issue category',
                color: '#2D6A4F',
              },
              {
                icon: '💼',
                title: 'Workforce',
                sdg: 'SDG 8',
                examples: 'Job applications, resume uploads, hiring portals, VA benefits, professional certifications',
                stat: 'Highest time-per-session',
                color: '#1B4332',
              },
              {
                icon: '🏥',
                title: 'Health',
                sdg: 'SDG 3',
                examples: 'Telehealth setup, patient portals, prescription management, insurance enrollment, appointment scheduling',
                stat: 'Fastest growing category',
                color: '#C4704B',
              },
              {
                icon: '🏠',
                title: 'Housing',
                sdg: 'SDG 1 & 10',
                examples: 'Rental applications, housing authority portals, utility assistance, document uploads, lease management',
                stat: 'Most deadline-sensitive',
                color: '#C9A227',
              },
            ].map((item, i) => (
              <Reveal key={item.title} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-8 transition-all duration-300 hover:shadow-lg"
                  style={{
                    background: 'white',
                    border: '1px solid #e8e0d0',
                    boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)',
                  }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: `${item.color}12` }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold" style={{ color: '#1B4332' }}>
                        {item.title}
                      </h3>
                      <span className="text-xs font-mono" style={{ color: item.color }}>{item.sdg}</span>
                    </div>
                  </div>
                  <p className="text-sm mb-3" style={{ color: '#2D3436', lineHeight: '1.7' }}>
                    {item.examples}
                  </p>
                  <div
                    className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full"
                    style={{ background: `${item.color}10`, color: item.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                    {item.stat}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          ONE SERVICE · MULTIPLE OUTCOMES
          ============================================ */}
      <section className="py-16" style={{ background: '#1B4332' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#FDF8F0' }}>
                One Service <span style={{ color: '#C9A227' }}>·</span> Multiple Outcomes
              </h2>
              <p className="text-base mt-4 max-w-2xl mx-auto" style={{ color: 'rgba(253, 248, 240, 0.7)' }}>
                A single visit can unlock a job application, unstick housing, recover a school account, or set up telehealth.
                The resident sees one visit. The funder sees systemic change.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: '📚', label: 'Education', sdg: 'SDG 4' },
                { icon: '💼', label: 'Workforce', sdg: 'SDG 8' },
                { icon: '🏥', label: 'Health', sdg: 'SDG 3' },
                { icon: '🏠', label: 'Housing', sdg: 'SDG 1 & 10' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-center p-6 rounded-xl transition-transform duration-300 hover:scale-105"
                  style={{ background: 'rgba(253, 248, 240, 0.08)', border: '1px solid rgba(201, 162, 39, 0.2)' }}
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <div className="font-display font-bold" style={{ color: '#FDF8F0' }}>{item.label}</div>
                  <div className="text-xs mt-1 font-mono" style={{ color: '#C9A227' }}>{item.sdg}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          TIMELINE — 60 Days to Impact
          ============================================ */}
      <section className="py-20 md:py-32">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>
                The Path Forward
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: '#1B4332' }}>
                60 Days to First Impact
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: '#2D3436' }}>
                From first conversation to first impact report — here's how the bridge gets built.
              </p>
            </div>
          </Reveal>

          {/* Timeline */}
          <div className="max-w-3xl mx-auto relative">
            {/* Vertical line */}
            <div
              className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
              style={{ background: 'linear-gradient(180deg, #1B4332, #C9A227)' }}
            />

            {TIMELINE.map((step, i) => (
              <Reveal key={i} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.15}>
                <div className={`relative flex items-start gap-6 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:text-${i % 2 === 0 ? 'right' : 'left'}`}>
                  {/* Content */}
                  <div className={`flex-1 pl-16 md:pl-0 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div
                      className="p-6 rounded-xl"
                      style={{
                        background: 'white',
                        border: '1px solid #e8e0d0',
                        boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)',
                      }}
                    >
                      <span className="font-mono text-xs" style={{ color: '#C9A227' }}>{step.day}</span>
                      <h3 className="font-display text-lg font-bold mt-1" style={{ color: '#1B4332' }}>{step.label}</h3>
                      <p className="text-sm mt-2" style={{ color: '#2D3436' }}>{step.description}</p>
                    </div>
                  </div>

                  {/* Dot on timeline */}
                  <div
                    className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 z-10"
                    style={{
                      borderColor: i === TIMELINE.length - 1 ? '#C9A227' : '#1B4332',
                      background: '#FDF8F0',
                    }}
                  />

                  {/* Spacer for other side */}
                  <div className="hidden md:block flex-1" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          WHAT YOUR SITE PROVIDES vs RECEIVES
          ============================================ */}
      <section className="py-20 md:py-32" style={{ background: 'rgba(27, 67, 50, 0.03)' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>
                The Partnership
              </h2>
              <p className="text-lg mt-4 max-w-xl mx-auto" style={{ color: '#2D3436' }}>
                Intentionally low-lift for you. High-value for your community.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Reveal direction="left">
              <div
                className="rounded-2xl p-8"
                style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)' }}
              >
                <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1B4332' }}>
                  Your Site Provides
                </h3>
                <p className="text-xs font-mono mb-6" style={{ color: '#7C9A6E' }}>intentionally low-lift</p>
                {[
                  'A small room, table, or shared computer area',
                  'Weekly schedule (8 hrs — can start at 4)',
                  'One staff contact for scheduling',
                  'Light promotion (we supply all materials)',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: '#2D6A4F' }} />
                    <span className="text-sm" style={{ color: '#2D3436' }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal direction="right">
              <div
                className="rounded-2xl p-8"
                style={{ background: '#1B4332', boxShadow: '0 4px 20px rgba(27, 67, 50, 0.2)' }}
              >
                <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#FDF8F0' }}>
                  Your Site Receives
                </h3>
                <p className="text-xs font-mono mb-6" style={{ color: '#C9A227' }}>high-value</p>
                {[
                  { text: 'End-to-end staffing', sub: 'Paid Navigators. Zero workload.' },
                  { text: 'Monthly TechMinutes® report', sub: 'Partner-ready data.' },
                  { text: 'Issue-category intelligence', sub: 'What residents struggle with.' },
                  { text: 'Consistent weekly presence', sub: 'Service neighbors talk about.' },
                  { text: 'Story-ready narratives', sub: 'For funders & leadership.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: '#C9A227' }} />
                    <div>
                      <span className="text-sm font-semibold" style={{ color: '#FDF8F0' }}>{item.text}</span>
                      <span className="text-xs ml-2" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>— {item.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================
          GET HELP FORM — "The Other Side of the Bridge"
          ============================================ */}
      <section id="get-help" className="py-20 md:py-32">
        <div className="container">
          <Reveal>
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(201, 162, 39, 0.15)' }}>
                  <span className="text-sm font-mono" style={{ color: '#C9A227' }}>You've crossed the bridge</span>
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: '#1B4332' }}>
                  Let's See If This Is a Fit
                </h2>
                <p className="text-lg" style={{ color: '#2D3436' }}>
                  One 15-minute call. We bring the staffing, the system, and the reporting. You bring the space.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="rounded-2xl p-8 md:p-10"
                    style={{
                      background: 'white',
                      border: '1px solid #e8e0d0',
                      boxShadow: '0 8px 40px rgba(27, 67, 50, 0.08)',
                    }}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="flex flex-col gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#1B4332' }}>
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-300"
                          style={{
                            background: '#FDF8F0',
                            border: '2px solid #e8e0d0',
                            color: '#2D3436',
                          }}
                  onFocus={(e) => { e.target.style.borderColor = '#C9A227'; tbSoundEngine.play('form_focus'); }}
                  onBlur={(e) => e.target.style.borderColor = '#e8e0d0'}
                  placeholder="Maria, James, Dorothy..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#1B4332' }}>
                          What Do You Need Help With?
                        </label>
                        <textarea
                          required
                          value={formData.need}
                          onChange={(e) => setFormData({ ...formData, need: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-300 resize-none"
                          style={{
                            background: '#FDF8F0',
                            border: '2px solid #e8e0d0',
                            color: '#2D3436',
                          }}
                  onFocus={(e) => { e.target.style.borderColor = '#C9A227'; tbSoundEngine.play('form_focus'); }}
                  onBlur={(e) => e.target.style.borderColor = '#e8e0d0'}
                  placeholder="School portal, job application, telehealth, housing documents..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#1B4332' }}>
                          Best Way to Reach You
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-300"
                          style={{
                            background: '#FDF8F0',
                            border: '2px solid #e8e0d0',
                            color: '#2D3436',
                          }}
                  onFocus={(e) => { e.target.style.borderColor = '#C9A227'; tbSoundEngine.play('form_focus'); }}
                  onBlur={(e) => e.target.style.borderColor = '#e8e0d0'}
                  placeholder="Phone number or email"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 rounded-xl text-lg font-display font-bold transition-all duration-300 hover:scale-[1.02]"
                        style={{
                          background: '#1B4332',
                          color: '#FDF8F0',
                          boxShadow: '0 4px 20px rgba(27, 67, 50, 0.3)',
                        }}
                      >
                        Request Help — It's Free
                      </button>

                      <p className="text-xs text-center" style={{ color: '#7C9A6E' }}>
                        No cost. No sign-up. No data collected beyond what you share here.
                      </p>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-10 text-center"
                    style={{
                      background: '#1B4332',
                      boxShadow: '0 8px 40px rgba(27, 67, 50, 0.2)',
                    }}
                  >
                    <div className="text-5xl mb-4">🌉</div>
                    <h3 className="font-display text-2xl font-bold mb-3" style={{ color: '#FDF8F0' }}>
                      Bridge Connected
                    </h3>
                    <p className="text-base mb-6" style={{ color: 'rgba(253, 248, 240, 0.8)' }}>
                      Thank you, {formData.name}. A Digital Navigator will reach out within 24 hours.
                      In the meantime, H.K. is available 24/7 if you need immediate guidance.
                    </p>
                    <a
                      href="https://techbridge-collective.org"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold transition-all duration-300 hover:scale-105"
                      style={{ background: '#C9A227', color: '#1B4332' }}
                    >
                      Visit TechBridge Collective
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="py-12" style={{ background: '#0F2B1F' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M4 22 Q16 8 28 22" stroke="#C9A227" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <line x1="4" y1="22" x2="28" y2="22" stroke="#C9A227" strokeWidth="2" />
                <line x1="10" y1="22" x2="10" y2="15" stroke="#C9A227" strokeWidth="1.5" />
                <line x1="16" y1="22" x2="16" y2="11" stroke="#C9A227" strokeWidth="1.5" />
                <line x1="22" y1="22" x2="22" y2="15" stroke="#C9A227" strokeWidth="1.5" />
              </svg>
              <span className="font-display text-base font-bold" style={{ color: '#C9A227' }}>
                TechBridge Collective
              </span>
            </div>

            <p className="text-sm italic text-center" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>
              Bridging the digital divide, one neighborhood at a time.
            </p>

            <div className="flex items-center gap-4 text-sm" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>
              <a href="https://techbridge-collective.org" className="hover:text-[#C9A227] transition-colors">
                techbridge-collective.org
              </a>
              <span>·</span>
              <span>2026</span>
            </div>
          </div>

          <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid rgba(201, 162, 39, 0.15)' }}>
            <p className="text-xs" style={{ color: 'rgba(253, 248, 240, 0.4)' }}>
              Jonathan Peoples · Co-Founder · thetechbridgecollective@gmail.com
            </p>
          </div>
        </div>
      </footer>

      {/* ============================================
          H.K. INTERACTIVE CHAT WIDGET
          ============================================ */}
      <HKChat />
    </div>
  );
}
