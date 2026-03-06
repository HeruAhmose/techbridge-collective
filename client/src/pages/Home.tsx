/**
 * TechBridge Collective — Home / Landing Page
 * GOD-TIER Visual Storytelling Masterpiece
 * 
 * Design: "The Bridge" Narrative Journey
 * Colors: Forest Green (#1B4332) + Gold (#C9A227) + Cream (#FDF8F0)
 * Fonts: Fraunces (display) + Inter (body) + JetBrains Mono (data)
 * 
 * Sections:
 * 1. Cinematic Hero with particle canvas + bridge SVG animation
 * 2. Three Pillars with 3D tilt cards + sound
 * 3. Hub Schedule with live status indicators
 * 4. H.K. AI Preview with avatar + conversational demo
 * 5. SPAN Journey visualization (Stabilize → Prepare → Activate → Navigate)
 * 6. Impact Snapshot with animated counters
 * 7. Navigator Stories (from SPAN scenarios)
 * 8. Footer with CTA
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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
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
    desc: 'Walk-in and scheduled 1:1 sessions with paid Digital Navigators. 4–8 hours per week at your community site. No appointments needed. Consistency is the product.',
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
    title: 'TechMinutes® Reporting',
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
  { name: 'Durham Library Hub', address: '300 N Roxboro St, Durham, NC 27701', days: 'Tue 10:00–13:00 · Thu 14:00–17:00', minutes: 1692, sessions: 56, mapUrl: 'https://maps.google.com/?q=300+N+Roxboro+St+Durham+NC+27701' },
  { name: 'Raleigh Digital Impact Hub', address: '501 S Person St, Raleigh, NC 27601', days: 'Mon 09:00–12:00 · Wed 13:00–16:00', minutes: 1155, sessions: 38, mapUrl: 'https://maps.google.com/?q=501+S+Person+St+Raleigh+NC+27601' },
];

const SPAN_PHASES = [
  { phase: 'S', title: 'Stabilize', desc: 'Triage the immediate need. Email recovery, password resets, device setup. The foundation.', color: '#2D6A4F', week: 'Weeks 1–2' },
  { phase: 'P', title: 'Prepare', desc: 'Build digital confidence. Navigate portals, create accounts, understand workflows.', color: '#3D8B6E', week: 'Weeks 3–4' },
  { phase: 'A', title: 'Activate', desc: 'Apply skills independently. Job applications, benefits enrollment, telehealth setup.', color: '#C9A227', week: 'Weeks 5–6' },
  { phase: 'N', title: 'Navigate', desc: 'Self-sufficient digital citizen. Help others. Return for advanced needs. The bridge is crossed.', color: '#D4A03C', week: 'Weeks 7–8' },
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

  const initSound = useCallback(() => {
    tbSoundEngine.init();
  }, []);

  return (
    <div onClick={initSound} style={{ background: '#FDF8F0', color: '#2D3436' }}>

      {/* ============================================
          HERO — Cinematic Bridge with Particles
          ============================================ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Parallax background image */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img src={CDN.bridgeHero} alt="" className="w-full h-full object-cover" style={{ opacity: 0.25 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(10, 31, 20, 0.95) 0%, rgba(27, 67, 50, 0.85) 50%, rgba(15, 43, 31, 0.92) 100%)' }} />
        </motion.div>

        {/* Particle system */}
        <ParticleCanvas />

        {/* Animated bridge cables in background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }}>
          <motion.path
            d="M0 70% Q 25% 30% 50% 50% T 100% 40%"
            stroke="#C9A227" strokeWidth="2" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          />
          <motion.path
            d="M0 80% Q 30% 40% 60% 55% T 100% 50%"
            stroke="#C9A227" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 3.5, delay: 0.5, ease: 'easeInOut' }}
          />
          <motion.path
            d="M0 60% Q 40% 25% 70% 45% T 100% 35%"
            stroke="#2D6A4F" strokeWidth="1" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 4, delay: 1, ease: 'easeInOut' }}
          />
        </svg>

        <motion.div className="container relative z-10 pt-24" style={{ opacity: heroOpacity }}>
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: 'rgba(201, 162, 39, 0.12)', border: '1px solid rgba(201, 162, 39, 0.25)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
                <span className="text-sm font-mono" style={{ color: '#C9A227' }}>Neighborhood Tech Help · Durham & Raleigh, NC</span>
              </div>
            </motion.div>

            <motion.h1
              className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.08] mb-6"
              style={{ color: '#FDF8F0' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
            >
              Tech help, right in your{' '}
              <span className="relative inline-block">
                <span style={{ color: '#C9A227' }}>neighborhood.</span>
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12" fill="none"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1.3 }}
                >
                  <motion.path d="M0 8 Q75 2 150 6 T300 4" stroke="#C9A227" strokeWidth="3" fill="none" strokeLinecap="round" />
                </motion.svg>
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
              style={{ color: 'rgba(253, 248, 240, 0.8)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Free 1:1 support at libraries and community centers — staffed by paid Digital Navigators,
              backed by H.K. AI 24/7. Plus TechMinutes® reporting so partners can prove impact.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Link href="/get-help">
                <span
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-display font-bold transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ background: '#C9A227', color: '#1B4332', boxShadow: '0 4px 20px rgba(201, 162, 39, 0.3)' }}
                  onClick={() => tbSoundEngine.play('nav_click')}
                >
                  Find Help Near Me
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </Link>
              <Link href="/host-a-hub">
                <span
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-display font-bold transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ color: '#C9A227', border: '2px solid rgba(201, 162, 39, 0.4)' }}
                  onClick={() => tbSoundEngine.play('nav_click')}
                >
                  Host a Hub
                </span>
              </Link>
            </motion.div>

            {/* Three Pillar Badges */}
            <motion.div
              className="flex flex-wrap gap-4 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {['1:1 Support — Devices, portals, accounts, job apps.', 'Trusted Spaces — Libraries, community centers, housing.', 'TechMinutes® — Monthly reporting + story-ready metrics.'].map((text, i) => (
                <div
                  key={i}
                  className="px-4 py-3 rounded-xl text-sm"
                  style={{ background: 'rgba(253, 248, 240, 0.06)', border: '1px solid rgba(253, 248, 240, 0.1)', color: 'rgba(253, 248, 240, 0.7)' }}
                >
                  {text}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14m-7-7l7 7 7-7" stroke="rgba(201, 162, 39, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </section>

      {/* ============================================
          THREE PILLARS
          ============================================ */}
      <section className="py-24 md:py-32">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>How It Works</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold" style={{ color: '#1B4332' }}>
                Three Pillars of the Bridge
              </h2>
              <p className="text-base mt-4 max-w-xl mx-auto" style={{ color: '#2D3436' }}>
                No other program in Raleigh-Durham combines paid staff, consistent schedule, 24/7 AI, and proprietary measurement in a single zero-cost offering.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PILLARS.map((p, i) => (
              <Reveal key={p.num} delay={i * 0.15}>
                <motion.div
                  className="relative rounded-2xl p-8 h-full cursor-pointer group"
                  style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)' }}
                  whileHover={{ y: -8, boxShadow: '0 16px 50px rgba(27, 67, 50, 0.15)' }}
                  onHoverStart={() => tbSoundEngine.play('pillar_hover')}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: `${p.accent}15`, color: p.accent }}>
                      {p.icon}
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded-md" style={{ background: `${p.accent}15`, color: p.accent }}>{p.num}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3" style={{ color: '#1B4332' }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#2D3436', lineHeight: 1.75 }}>{p.desc}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-300 group-hover:h-1.5" style={{ background: p.accent }} />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          HUB SCHEDULE
          ============================================ */}
      <section className="py-20 md:py-28" style={{ background: 'rgba(27, 67, 50, 0.03)' }}>
        <div className="container">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <p className="text-sm font-mono tracking-widest uppercase mb-3" style={{ color: '#C9A227' }}>Where We Operate</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>Upcoming hub schedule</h2>
              </div>
              <Link href="/get-help">
                <span className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-medium cursor-pointer transition-colors hover:underline" style={{ color: '#C9A227' }}>
                  See all locations
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </Link>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {HUBS.map((hub, i) => (
              <Reveal key={hub.name} direction={i === 0 ? 'left' : 'right'}>
                <div
                  className="rounded-2xl p-8 transition-all duration-300 hover:shadow-lg group"
                  style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)' }}
                >
                  <h3 className="font-display text-lg font-bold mb-1" style={{ color: '#1B4332' }}>{hub.name}</h3>
                  <p className="text-sm mb-4" style={{ color: '#7C9A6E' }}>{hub.address}</p>
                  <p className="text-sm font-mono mb-6" style={{ color: '#2D6A4F' }}>{hub.days}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-6">
                      <div>
                        <div className="font-display text-xl font-bold" style={{ color: '#C9A227' }}>{hub.minutes.toLocaleString()}</div>
                        <div className="text-xs font-mono" style={{ color: '#7C9A6E' }}>TechMinutes®</div>
                      </div>
                      <div>
                        <div className="font-display text-xl font-bold" style={{ color: '#1B4332' }}>{hub.sessions}</div>
                        <div className="text-xs font-mono" style={{ color: '#7C9A6E' }}>Sessions</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={hub.mapUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: '#2D6A4F', background: 'rgba(45, 106, 79, 0.08)' }}>
                        Open in Maps
                      </a>
                      <Link href="/get-help">
                        <span className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer" style={{ color: '#C9A227', background: 'rgba(201, 162, 39, 0.08)' }}>
                          Request help
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          H.K. AI SECTION
          ============================================ */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <Reveal direction="left">
              <div>
                <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>H.K. AI</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#1B4332' }}>
                  Ask H.K. — get help now, or book a Navigator
                </h2>
                <p className="text-base mb-4 leading-relaxed" style={{ color: '#2D3436' }}>
                  H.K. asks a few clarifying questions, gives step-by-step guidance, and escalates to hub hours when needed. Named for Horace King, the 19th-century bridge builder who connected communities across the South.
                </p>
                <p className="text-sm mb-8 px-4 py-3 rounded-xl" style={{ color: '#7C9A6E', background: 'rgba(45, 106, 79, 0.06)', border: '1px solid rgba(45, 106, 79, 0.1)' }}>
                  H.K. never asks for passwords, SSNs, or sensitive data.
                </p>
                <Link href="/get-help">
                  <span
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-sm transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{ background: 'rgba(27, 67, 50, 0.08)', color: '#1B4332', border: '1px solid rgba(27, 67, 50, 0.15)' }}
                    onClick={() => tbSoundEngine.play('nav_click')}
                  >
                    Request a Navigator visit
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </Link>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="relative">
                {/* H.K. Chat Preview Card */}
                <div className="rounded-2xl overflow-hidden" style={{ background: '#0F2B1F', border: '1px solid rgba(201, 162, 39, 0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
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
          SPAN JOURNEY — Bridge Building Visualization
          ============================================ */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: '#1B4332' }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={CDN.spanJourney} alt="" className="w-full h-full object-cover" style={{ opacity: 0.1 }} />
        </div>

        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>The 60-Day Journey</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold" style={{ color: '#FDF8F0' }}>
                S.P.A.N. — Building Your Bridge
              </h2>
              <p className="text-base mt-4 max-w-2xl mx-auto" style={{ color: 'rgba(253, 248, 240, 0.7)' }}>
                Every resident's journey follows four phases — from crisis to confidence. Like building a bridge, each phase depends on the one before it.
              </p>
            </div>
          </Reveal>

          {/* SPAN Phase Cards */}
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {SPAN_PHASES.map((sp, i) => (
              <Reveal key={sp.phase} delay={i * 0.12}>
                <motion.div
                  className="rounded-2xl p-6 h-full relative overflow-hidden group cursor-pointer"
                  style={{ background: 'rgba(253, 248, 240, 0.04)', border: `1px solid ${sp.color}30` }}
                  whileHover={{ y: -6, borderColor: sp.color }}
                  onHoverStart={() => tbSoundEngine.play('pillar_hover')}
                >
                  {/* Phase letter */}
                  <div className="font-display text-6xl font-bold mb-4 transition-all duration-300 group-hover:scale-110" style={{ color: sp.color, opacity: 0.3 }}>
                    {sp.phase}
                  </div>
                  <p className="text-xs font-mono mb-2" style={{ color: sp.color }}>{sp.week}</p>
                  <h3 className="font-display text-xl font-bold mb-3" style={{ color: '#FDF8F0' }}>{sp.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>{sp.desc}</p>
                  {/* Progress bar */}
                  <div className="mt-4 h-1 rounded-full" style={{ background: 'rgba(253, 248, 240, 0.1)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: sp.color }}
                      initial={{ width: '0%' }}
                      whileInView={{ width: `${(i + 1) * 25}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Connecting bridge line */}
          <Reveal>
            <div className="hidden md:block max-w-5xl mx-auto mt-8">
              <svg viewBox="0 0 1000 40" className="w-full" style={{ opacity: 0.3 }}>
                <motion.path
                  d="M50 20 Q250 5 500 20 T950 20"
                  stroke="#C9A227" strokeWidth="2" fill="none" strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                  viewport={{ once: true }}
                />
                {[50, 300, 550, 800].map((x, i) => (
                  <motion.circle
                    key={i}
                    cx={x} cy={20} r={6}
                    fill={SPAN_PHASES[i].color}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.3, duration: 0.4 }}
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
          COMMUNITY HUB IMAGE SECTION
          ============================================ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.communityHub} alt="Community Digital Hub" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(27, 67, 50, 0.85), rgba(27, 67, 50, 0.6))' }} />
        </div>
        <div className="container relative z-10">
          <Reveal direction="left">
            <div className="max-w-xl">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>The TechBridge Way</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#FDF8F0' }}>
                You are not tech support. You are a bridge.
              </h2>
              <p className="text-base mb-4 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.8)' }}>
                A school portal isn't a password reset — it's a parent reconnecting with their child's education.
                A job application isn't a form — it's a veteran rebuilding their career.
              </p>
              <p className="text-sm italic" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>
                — From the TechBridge Navigator Training Manual
              </p>
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
