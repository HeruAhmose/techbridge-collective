/**
 * TechBridge Collective — Home / Landing Page
 * GOD-TIER Visual Storytelling Masterpiece
 * 
 * Design: "The Bridge" Narrative Journey
 * Colors: Forest Green (#1B4332) + Gold (#C9A227) + Cream (#FDF8F0)
 * Fonts: Fraunces (display) + Inter (body) + JetBrains Mono (data)
 * 
 * SPAN = Strategic Playbook, Architecture & Navigator Operations
 * (The operational document itself, NOT a resident journey model)
 * 
 * Sections:
 * 1. Cinematic Hero with particle canvas + bridge SVG animation
 * 2. Three Pillars with 3D tilt cards + sound
 * 3. Community Hub photo section (navigator helping)
 * 4. Hub Schedule with live status indicators
 * 5. H.K. AI Preview with avatar + conversational demo
 * 6. The SPAN Document — Bridge-Metaphor Sections
 * 7. Impact Snapshot with animated counters
 * 8. Navigator Stories (from SPAN scenarios)
 * 9. Success Moment photo section
 * 10. TechBridge Way quote section
 * 11. Footer with CTA
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';
import Footer from '../components/Footer';

const CDN = {
  bridgeHero: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/bridge-hero-3L5v75UNyLV5wZc3BXy2gE.webp',
  communityHub: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-hub-Q9JLQXRqmAttfmjNjBXFon.webp',
  hkAvatar: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/HK_avatar_80_9e8213b6.jpg',
  horaceKing: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/horace-king-tribute-WrUcXchvoiExwCufr5cq2T.webp',
  spanJourney: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/span-journey-fgm8ge9JC6YczpG5dzHFSm.webp',
  navigatorHelping: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-navigator-J3QgpVMcvM5w7siVQDejbC.webp',
  communityGathering: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-gathering-7tsUyPrugQMATVzsJ7YZx2.webp',
  handsGuiding: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/navigator-session-7Fy7vkxQXuw2y8AmS6RLxZ.webp',
  hubExterior: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/hub-exterior-Dp9FtPxyv99F7AzXgr44Ue.webp',
  successMoment: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/success-moment-hm2uPdPFHXpkuohVUwwfqe.webp',
};

/* ============================================
   UTILITY: Scroll-triggered reveal
   ============================================ */
function Reveal({ children, delay = 0, direction = 'up', className = '' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' | 'scale'; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); tbSoundEngine.play('section_enter'); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const variants: Record<string, any> = {
    up: { hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    left: { hidden: { x: -50, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    right: { hidden: { x: 50, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    scale: { hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1 } },
  };
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={variants[direction]}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   UTILITY: Animated counter
   ============================================ */
function Counter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(end * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, end, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ============================================
   HERO PARTICLE CANVAS
   ============================================ */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId = 0;
    const particles: Array<{x:number;y:number;vx:number;vy:number;size:number;alpha:number;decay:number}> = [];

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const addParticle = () => {
      if (particles.length > 60) return;
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.3 - Math.random() * 0.7,
        size: 1 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.4,
        decay: 0.002 + Math.random() * 0.003,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.15) addParticle();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 162, 39, ${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.6 }} />;
}

/* ============================================
   DATA
   ============================================ */
const PILLARS = [
  {
    num: '01',
    title: 'Weekly Help Desk',
    desc: 'Walk-in and scheduled 1:1 sessions with paid Digital Navigators. 4-8 hours per week at your community site. No appointments needed. Consistency is the product.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    accent: '#2D6A4F',
  },
  {
    num: '02',
    title: 'H.K. AI Triage',
    desc: 'Named for Horace King, master bridge builder. 24/7 step-by-step guidance between visits. Routes, guides, and escalates. Never guesses. Never asks for credentials.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 22 Q16 8 28 22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <line x1="4" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="1.5" />
        <line x1="16" y1="22" x2="16" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    accent: '#C9A227',
  },
  {
    num: '03',
    title: 'TechMinutes\u00AE Reporting',
    desc: 'Monthly non-PII impact reports: minutes served, issue categories, resolution rates, and community patterns. Data your funders actually want. Every interaction measured.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="10" y1="22" x2="10" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="16" y1="22" x2="16" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="22" x2="22" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    accent: '#C4704B',
  },
];

const HUBS = [
  { name: 'Durham Library Hub', address: '300 N Roxboro St, Durham, NC 27701', days: 'Tue 10:00-13:00 \u00B7 Thu 14:00-17:00', minutes: 1692, sessions: 56, mapUrl: 'https://maps.google.com/?q=300+N+Roxboro+St+Durham+NC+27701' },
  { name: 'Raleigh Digital Impact Hub', address: '501 S Person St, Raleigh, NC 27601', days: 'Mon 09:00-12:00 \u00B7 Wed 13:00-16:00', minutes: 1155, sessions: 38, mapUrl: 'https://maps.google.com/?q=501+S+Person+St+Raleigh+NC+27601' },
];

/* SPAN Document Sections — Bridge Engineering Metaphors */
const SPAN_SECTIONS = [
  { num: '1', name: 'The Crossing', focus: 'Identity, values, brand voice, code of conduct', icon: '🧭' },
  { num: '2', name: 'The Structure', focus: 'Three pillars, partnership model, 60-day launch, live proof', icon: '🏗️' },
  { num: '3', name: 'The Load', focus: 'Budget, payroll, unit economics, business model canvas', icon: '⚖️' },
  { num: '4', name: 'The Approach', focus: 'Outreach rules, cadence, subject lines', icon: '📨' },
  { num: '5', name: 'The Cables', focus: 'Navigator training, session protocol, scenarios, escalation', icon: '🔗' },
  { num: '6', name: 'The Deck', focus: 'Production stack, H.K. architecture, security', icon: '💻' },
  { num: '7', name: 'The Abutments', focus: 'Grant targets, local pipeline, growth roadmap', icon: '📈' },
  { num: '8', name: 'The Foundation', focus: 'Risk management, what-if scenarios, lean mode', icon: '🛡️' },
  { num: '9', name: 'The Elevation', focus: 'MBA case study — PESTEL, TAM/SAM/SOM, Porter\'s, SWOT', icon: '🎓' },
];

const STORIES = [
  { name: 'Maria', domain: 'Education', time: '18 min', issue: 'School portal password reset, bookmark setup, physical backup card', outcome: 'Resolved', emoji: '📚' },
  { name: 'James', domain: 'Workforce', time: '35 min', issue: 'VA job application, draft-save strategy, DD-214 upload, NCWorks referral', outcome: 'Partial — follow-up', emoji: '💼' },
  { name: 'Dorothy', domain: 'Health', time: '40 min', issue: 'Apple ID reset, health portal app, account creation, first telehealth appointment', outcome: 'Resolved', emoji: '🏥' },
  { name: 'Carlos', domain: 'Housing', time: '22 min', issue: 'Phone document scanner, housing application upload, screenshot confirmation', outcome: 'Resolved', emoji: '🏠' },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [expandedSpan, setExpandedSpan] = useState<string | null>(null);

  const initSound = useCallback(() => {
    tbSoundEngine.init();
  }, []);

  return (
    <div onClick={initSound} style={{ background: '#FDF8F0', color: '#2D3436' }}>
      {/* ============================================
          HERO — Cinematic Bridge with Parallax
          ============================================ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image with parallax */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img src={CDN.bridgeHero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10, 31, 20, 0.7) 0%, rgba(27, 67, 50, 0.85) 50%, rgba(10, 31, 20, 0.95) 100%)' }} />
        </motion.div>

        {/* Particle overlay */}
        <ParticleCanvas />

        {/* Hero content */}
        <motion.div className="container relative z-10 py-32" style={{ opacity: heroOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-mono tracking-[0.3em] uppercase mb-6" style={{ color: '#C9A227' }}>
              TechBridge Collective
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] max-w-4xl" style={{ color: '#FDF8F0' }}>
              Building bridges of access, dignity, and opportunity
            </h1>
            <p className="text-base md:text-lg mt-6 max-w-2xl leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.75)' }}>
              Free, human-centered digital help at community sites across the Triangle. Walk in. Get help. Cross the bridge.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/get-help">
              <span
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-bold text-base transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ background: '#C9A227', color: '#1B4332' }}
                onClick={() => tbSoundEngine.play('nav_click')}
              >
                Get Help Now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </Link>
            <Link href="/host-a-hub">
              <span
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-bold text-base transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ background: 'transparent', color: '#FDF8F0', border: '2px solid rgba(253, 248, 240, 0.25)' }}
                onClick={() => tbSoundEngine.play('nav_click')}
              >
                Host a Hub
              </span>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <p className="text-xs font-mono" style={{ color: 'rgba(201, 162, 39, 0.5)' }}>Scroll to explore</p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14m-7-7l7 7 7-7" stroke="rgba(201, 162, 39, 0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================
          THREE PILLARS — The Model
          ============================================ */}
      <section className="py-24 md:py-32" style={{ background: '#FDF8F0' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>The Model</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold" style={{ color: '#1B4332' }}>
                Three pillars. One bridge.
              </h2>
              <p className="text-base mt-4 max-w-2xl mx-auto" style={{ color: '#5a6c5a' }}>
                Every TechBridge hub delivers the same three things. No more, no less. Simplicity is the strategy.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.num} delay={i * 0.12}>
                <motion.div
                  className="rounded-2xl p-8 h-full relative overflow-hidden group cursor-pointer"
                  style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 4px 24px rgba(27, 67, 50, 0.06)' }}
                  whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(27, 67, 50, 0.12)' }}
                  onHoverStart={() => tbSoundEngine.play('pillar_hover')}
                >
                  {/* Number watermark */}
                  <div className="font-display text-7xl font-bold absolute -top-2 -right-2 select-none" style={{ color: pillar.accent, opacity: 0.06 }}>
                    {pillar.num}
                  </div>
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110" style={{ background: `${pillar.accent}15`, color: pillar.accent }}>
                    {pillar.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3" style={{ color: '#1B4332' }}>{pillar.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#5a6c5a' }}>{pillar.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          NAVIGATOR HELPING — Full-width Photo Section
          ============================================ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.navigatorHelping} alt="Digital Navigator helping community member" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(27, 67, 50, 0.88), rgba(27, 67, 50, 0.5))' }} />
        </div>
        <div className="container relative z-10">
          <Reveal direction="left">
            <div className="max-w-xl">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Human-Centered Help</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#FDF8F0' }}>
                A school portal isn't a password reset.
              </h2>
              <p className="text-base mb-4 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.85)' }}>
                It's a parent reconnecting with their child's education. A job application isn't a form — it's a veteran rebuilding their career. We don't do tech support. We build bridges.
              </p>
              <p className="text-sm italic" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>
                — From the TechBridge SPAN Document, Section 1: The Crossing
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          HUB SCHEDULE — Where to Find Us
          ============================================ */}
      <section className="py-24 md:py-32" style={{ background: '#FDF8F0' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Hub Schedule</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>
                Walk in. Get help.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {HUBS.map((hub, i) => (
              <Reveal key={hub.name} delay={i * 0.15}>
                <motion.div
                  className="rounded-2xl overflow-hidden group"
                  style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 4px 24px rgba(27, 67, 50, 0.06)' }}
                  whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(27, 67, 50, 0.1)' }}
                >
                  {/* Hub exterior image */}
                  {i === 0 && (
                    <div className="h-48 overflow-hidden">
                      <img src={CDN.hubExterior} alt={hub.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  {i === 1 && (
                    <div className="h-48 overflow-hidden">
                      <img src={CDN.communityGathering} alt={hub.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
                      <span className="text-xs font-mono uppercase tracking-wider" style={{ color: '#2D6A4F' }}>Active Hub</span>
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2" style={{ color: '#1B4332' }}>{hub.name}</h3>
                    <p className="text-sm mb-1" style={{ color: '#5a6c5a' }}>{hub.address}</p>
                    <p className="text-sm font-mono mb-4" style={{ color: '#C9A227' }}>{hub.days}</p>
                    <div className="flex items-center gap-4 pt-4" style={{ borderTop: '1px solid #e8e0d0' }}>
                      <div>
                        <span className="font-display text-xl font-bold" style={{ color: '#C9A227' }}>{hub.minutes.toLocaleString()}</span>
                        <span className="text-xs ml-1" style={{ color: '#7C9A6E' }}>TechMinutes</span>
                      </div>
                      <div>
                        <span className="font-display text-xl font-bold" style={{ color: '#2D6A4F' }}>{hub.sessions}</span>
                        <span className="text-xs ml-1" style={{ color: '#7C9A6E' }}>Sessions</span>
                      </div>
                      <a
                        href={hub.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-xs font-mono px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{ background: 'rgba(27, 67, 50, 0.06)', color: '#1B4332' }}
                      >
                        Directions →
                      </a>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          H.K. AI PREVIEW — Meet Your Digital Navigator
          ============================================ */}
      <section className="py-24 md:py-32" style={{ background: '#1B4332' }}>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Left: H.K. Story */}
            <Reveal direction="left">
              <div>
                <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Meet H.K.</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#FDF8F0' }}>
                  Your 24/7 bridge between visits
                </h2>
                <p className="text-base mb-4 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.8)' }}>
                  Named for <strong style={{ color: '#C9A227' }}>Horace King</strong>, the enslaved master bridge builder who connected communities across the American South. H.K. carries that legacy forward — connecting people to the digital resources they need.
                </p>
                <p className="text-base mb-6 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.7)' }}>
                  H.K. never guesses. Never asks for credentials. Routes you to the right portal, walks you through each step, and escalates to a human Navigator when needed.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Step-by-step guidance', 'Portal navigation', 'Smart escalation', '24/7 availability'].map((feat) => (
                    <span key={feat} className="px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: 'rgba(201, 162, 39, 0.1)', color: '#C9A227', border: '1px solid rgba(201, 162, 39, 0.2)' }}>
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Right: H.K. Chat Preview */}
            <Reveal direction="right">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden" style={{ background: '#0F2B1F', border: '1px solid rgba(201, 162, 39, 0.2)', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
                  {/* Header */}
                  <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(201, 162, 39, 0.15)' }}>
                    <div className="w-10 h-10 rounded-full overflow-hidden" style={{ border: '2px solid #C9A227' }}>
                      <img src={CDN.hkAvatar} alt="H.K." className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold" style={{ color: '#FDF8F0' }}>H.K. <span className="font-normal text-xs" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>Help Desk Architect</span></p>
                    </div>
                  </div>
                  {/* Messages */}
                  <div className="px-5 py-6 space-y-4">
                    <p className="text-sm" style={{ color: '#FDF8F0' }}>Ask H.K. — get help now</p>
                    <p className="text-xs" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>Describe your issue or choose a quick start below.</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['📧 Recover my email', '💼 Apply for jobs online', '📱 Set up my phone', '📁 Upload documents', '🔑 Reset a password', '🏥 Set up telehealth'].map((label) => (
                        <span key={label} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(201, 162, 39, 0.1)', color: '#C9A227', border: '1px solid rgba(201, 162, 39, 0.2)' }}>
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Safety */}
                  <div className="px-5 py-2" style={{ background: 'rgba(45, 106, 79, 0.1)' }}>
                    <p className="text-xs" style={{ color: 'rgba(253, 248, 240, 0.4)' }}>🔒 Never share passwords, SSNs, bank info, or 2FA codes.</p>
                  </div>
                  {/* Input */}
                  <div className="flex items-center gap-2 px-5 py-3" style={{ borderTop: '1px solid rgba(201, 162, 39, 0.1)' }}>
                    <div className="flex-1 px-4 py-2 rounded-xl text-xs" style={{ background: 'rgba(253, 248, 240, 0.05)', color: 'rgba(253, 248, 240, 0.3)', border: '1px solid rgba(201, 162, 39, 0.15)' }}>
                      Describe your issue...
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#C9A227' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#1B4332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================
          THE SPAN DOCUMENT — Operational Playbook
          ============================================ */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: '#0F2B1F' }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={CDN.spanJourney} alt="" className="w-full h-full object-cover" style={{ opacity: 0.08 }} />
        </div>

        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>The Operational Playbook</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold" style={{ color: '#FDF8F0' }}>
                The SPAN Document
              </h2>
              <p className="text-base mt-4 max-w-3xl mx-auto" style={{ color: 'rgba(253, 248, 240, 0.7)' }}>
                <strong style={{ color: '#C9A227' }}>Strategic Playbook, Architecture & Navigator Operations</strong> — our comprehensive operational blueprint. Every section is named after a part of a bridge, because that's what we build.
              </p>
            </div>
          </Reveal>

          {/* SPAN Sections — Interactive accordion */}
          <div className="max-w-3xl mx-auto space-y-3">
            {SPAN_SECTIONS.map((section, i) => (
              <Reveal key={section.num} delay={i * 0.06}>
                <motion.div
                  className="rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    background: expandedSpan === section.num ? 'rgba(201, 162, 39, 0.08)' : 'rgba(253, 248, 240, 0.03)',
                    border: `1px solid ${expandedSpan === section.num ? 'rgba(201, 162, 39, 0.3)' : 'rgba(253, 248, 240, 0.06)'}`,
                  }}
                  whileHover={{ borderColor: 'rgba(201, 162, 39, 0.2)' }}
                  onClick={() => {
                    setExpandedSpan(expandedSpan === section.num ? null : section.num);
                    tbSoundEngine.play(expandedSpan === section.num ? 'story_close' : 'story_reveal');
                  }}
                >
                  <div className="flex items-center gap-4 px-6 py-4">
                    <span className="text-xl">{section.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(201, 162, 39, 0.15)', color: '#C9A227' }}>
                          {section.num}
                        </span>
                        <h3 className="font-display text-base font-bold" style={{ color: '#FDF8F0' }}>{section.name}</h3>
                      </div>
                    </div>
                    <motion.svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      animate={{ rotate: expandedSpan === section.num ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path d="M6 9l6 6 6-6" stroke="rgba(201, 162, 39, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  </div>
                  <motion.div
                    initial={false}
                    animate={{ height: expandedSpan === section.num ? 'auto' : 0, opacity: expandedSpan === section.num ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-6 pb-4 pl-16">
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>{section.focus}</p>
                    </div>
                  </motion.div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Bridge SVG connecting the sections */}
          <Reveal>
            <div className="max-w-3xl mx-auto mt-12">
              <svg viewBox="0 0 800 60" className="w-full" style={{ opacity: 0.25 }}>
                <motion.path
                  d="M50 30 Q200 10 400 30 T750 30"
                  stroke="#C9A227" strokeWidth="2" fill="none" strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                  viewport={{ once: true }}
                />
                {SPAN_SECTIONS.map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={50 + i * 87.5} cy={30} r={4}
                    fill="#C9A227"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.3 }}
                    viewport={{ once: true }}
                  />
                ))}
              </svg>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          IMPACT SNAPSHOT
          ============================================ */}
      <section className="py-20" style={{ background: '#FDF8F0' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-sm font-mono tracking-widest uppercase mb-3" style={{ color: '#C9A227' }}>Impact Snapshot (Last 30 Days)</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>
                Proof partners can use
              </h2>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: 2847, label: 'Total TechMinutes', suffix: '' },
                { value: 94, label: 'Sessions', suffix: '' },
                { value: 76, label: 'Resolution Rate', suffix: '%' },
                { value: 2, label: 'Hubs Active', suffix: '' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
                  style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 2px 12px rgba(27, 67, 50, 0.04)' }}
                >
                  <div className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#C9A227' }}>
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-mono mt-2 uppercase tracking-wider" style={{ color: '#7C9A6E' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="text-center mt-10">
              <Link href="/impact">
                <span
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold text-sm transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ background: 'rgba(27, 67, 50, 0.06)', color: '#1B4332', border: '1px solid rgba(27, 67, 50, 0.12)' }}
                  onClick={() => tbSoundEngine.play('nav_click')}
                >
                  See full impact
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          NAVIGATOR STORIES — From SPAN Scenarios
          ============================================ */}
      <section className="py-24 md:py-32" style={{ background: 'rgba(27, 67, 50, 0.03)' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Real Stories</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>
                Every session is a bridge crossed
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {STORIES.map((story, i) => (
              <Reveal key={story.name} delay={i * 0.1}>
                <motion.div
                  className="rounded-2xl p-6 h-full group cursor-pointer"
                  style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 4px 20px rgba(27, 67, 50, 0.04)' }}
                  whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(27, 67, 50, 0.1)' }}
                  onHoverStart={() => tbSoundEngine.play('story_reveal')}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{story.emoji}</span>
                    <div>
                      <h3 className="font-display text-base font-bold" style={{ color: '#1B4332' }}>{story.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md" style={{ background: 'rgba(201, 162, 39, 0.1)', color: '#C9A227' }}>{story.domain}</span>
                        <span className="text-xs font-mono" style={{ color: '#7C9A6E' }}>{story.time}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mb-3 leading-relaxed" style={{ color: '#2D3436' }}>{story.issue}</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: story.outcome === 'Resolved' ? '#22c55e' : '#C9A227' }} />
                    <span className="text-xs font-mono" style={{ color: story.outcome === 'Resolved' ? '#2D6A4F' : '#C9A227' }}>{story.outcome}</span>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SUCCESS MOMENT — Full-width Photo Section
          ============================================ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.successMoment} alt="Community member celebrating a digital success" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, rgba(27, 67, 50, 0.88), rgba(27, 67, 50, 0.5))' }} />
        </div>
        <div className="container relative z-10">
          <Reveal direction="right">
            <div className="max-w-xl ml-auto text-right">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>The Moment</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#FDF8F0' }}>
                This is what crossing the bridge looks like.
              </h2>
              <p className="text-base mb-4 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.85)' }}>
                When Dorothy completed her state benefits enrollment after 40 minutes with her Digital Navigator, she raised her hands in triumph. That's not a tech task. That's a life changed.
              </p>
              <Link href="/get-help">
                <span
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-sm transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ background: '#C9A227', color: '#1B4332' }}
                  onClick={() => tbSoundEngine.play('nav_click')}
                >
                  Get Help Today
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <Footer />
    </div>
  );
}
