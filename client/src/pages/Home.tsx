/**
 * TechBridge Collective — Home / Landing Page
 * Design: "The Bridge" Narrative Journey
 * Bridge theme, warm brutalism, forest green + gold + cream
 */
import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';

const CDN = {
  hero: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/tb-hero-bridge_57bc3185.png',
  navigator: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/tb-navigator-session_55144ac2.png',
  hub: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/tb-community-hub_a2b31bb6.png',
  hk: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/tb-hk-ai-glow_87bf945f.png',
  impact: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/tb-impact-data_8ff9f492.png',
};

// Reveal on scroll
function Reveal({ children, delay = 0, direction = 'up' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const initial = direction === 'left' ? { x: -40, opacity: 0 } : direction === 'right' ? { x: 40, opacity: 0 } : { y: 30, opacity: 0 };
  return (
    <motion.div ref={ref} initial={initial} animate={visible ? { x: 0, y: 0, opacity: 1 } : initial} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// Animated counter
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

const PILLARS = [
  {
    num: '01',
    title: 'Weekly Help Desk',
    desc: 'Walk-in and scheduled 1:1 sessions with paid Digital Navigators. 4–8 hours per week at your community site. No appointments needed.',
    icon: '🤝',
    accent: '#2D6A4F',
  },
  {
    num: '02',
    title: 'H.K. AI Triage',
    desc: 'Named for Horace King, master bridge builder. 24/7 step-by-step guidance between visits. Flags complex cases for Navigators. Never asks for credentials.',
    icon: '🌉',
    accent: '#C9A227',
  },
  {
    num: '03',
    title: 'TechMinutes® Reporting',
    desc: 'Monthly non-PII impact reports: minutes served, issue categories, resolution rates, and community patterns. Data your funders actually want.',
    icon: '📊',
    accent: '#C4704B',
  },
];

const HUBS = [
  {
    name: 'Durham Library Hub',
    address: 'Durham County Library',
    schedule: 'Tuesdays & Thursdays, 10am – 2pm',
    minutes: 1692,
    sessions: 56,
  },
  {
    name: 'Raleigh Digital Impact Hub',
    address: 'Raleigh Community Center',
    schedule: 'Mondays & Wednesdays, 11am – 3pm',
    minutes: 1155,
    sessions: 38,
  },
];

export default function Home() {
  const [soundInit, setSoundInit] = useState(false);

  const initSound = () => {
    if (!soundInit) {
      tbSoundEngine.init();
      setSoundInit(true);
    }
  };

  return (
    <div onClick={initSound} style={{ background: '#FDF8F0', color: '#2D3436' }}>

      {/* ============================================
          HERO — "Tech help, right in your neighborhood"
          ============================================ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={CDN.hero} alt="" className="w-full h-full object-cover" style={{ opacity: 0.15 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15, 43, 31, 0.92), rgba(27, 67, 50, 0.85))' }} />
        </div>

        {/* Animated bridge cables in background */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }}>
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
        </svg>

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: 'rgba(201, 162, 39, 0.15)', border: '1px solid rgba(201, 162, 39, 0.3)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
                <span className="text-sm font-mono" style={{ color: '#C9A227' }}>2 Hubs Active · Raleigh-Durham</span>
              </div>
            </motion.div>

            <motion.h1
              className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] mb-6"
              style={{ color: '#FDF8F0' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Tech help, right in{' '}
              <span className="relative">
                <span style={{ color: '#C9A227' }}>your neighborhood</span>
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12" fill="none"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1.2 }}
                >
                  <motion.path d="M0 8 Q75 2 150 6 T300 4" stroke="#C9A227" strokeWidth="3" fill="none" strokeLinecap="round" />
                </motion.svg>
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl max-w-2xl mb-10"
              style={{ color: 'rgba(253, 248, 240, 0.8)', lineHeight: 1.7 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Free, in-person digital help at community sites you already trust.
              Paid staff. Weekly schedule. Real impact data. Because the best technology
              in the world doesn't matter if no one shows you how to use it.
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
                >
                  Find Help Near Me
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </Link>
              <Link href="/host-a-hub">
                <span
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-display font-bold transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ background: 'transparent', color: '#FDF8F0', border: '2px solid rgba(201, 162, 39, 0.4)' }}
                >
                  Host a Hub
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          THREE PILLARS
          ============================================ */}
      <section className="py-20 md:py-32">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>How It Works</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold" style={{ color: '#1B4332' }}>
                Three Pillars of the Bridge
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PILLARS.map((p, i) => (
              <Reveal key={p.num} delay={i * 0.15}>
                <motion.div
                  className="relative rounded-2xl p-8 h-full transition-all duration-300"
                  style={{
                    background: 'white',
                    border: '1px solid #e8e0d0',
                    boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)',
                  }}
                  whileHover={{ y: -8, boxShadow: '0 12px 40px rgba(27, 67, 50, 0.12)' }}
                  onHoverStart={() => tbSoundEngine.play('pillar_hover')}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono font-bold"
                      style={{ background: p.accent, color: '#FDF8F0' }}
                    >
                      {p.num}
                    </div>
                    <span className="text-2xl">{p.icon}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3" style={{ color: '#1B4332' }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#2D3436', lineHeight: 1.7 }}>{p.desc}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl" style={{ background: p.accent }} />
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
            <div className="text-center mb-12">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Find Us</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>Hub Schedule</h2>
              <p className="text-base mt-3 max-w-xl mx-auto" style={{ color: '#2D3436' }}>
                Walk in during hub hours. No appointment needed. Bring your device — or use ours.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {HUBS.map((hub, i) => (
              <Reveal key={hub.name} direction={i === 0 ? 'left' : 'right'}>
                <div
                  className="rounded-2xl p-8 transition-all duration-300 hover:shadow-lg"
                  style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)' }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full mt-1.5 shrink-0 animate-pulse" style={{ background: '#22c55e' }} />
                    <div>
                      <h3 className="font-display text-lg font-bold" style={{ color: '#1B4332' }}>{hub.name}</h3>
                      <p className="text-sm" style={{ color: '#7C9A6E' }}>{hub.address}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold mb-4" style={{ color: '#2D6A4F' }}>{hub.schedule}</p>
                  <div className="flex gap-6">
                    <div>
                      <div className="font-display text-2xl font-bold" style={{ color: '#C9A227' }}>{hub.minutes.toLocaleString()}</div>
                      <div className="text-xs font-mono" style={{ color: '#7C9A6E' }}>TechMinutes®</div>
                    </div>
                    <div>
                      <div className="font-display text-2xl font-bold" style={{ color: '#1B4332' }}>{hub.sessions}</div>
                      <div className="text-xs font-mono" style={{ color: '#7C9A6E' }}>Sessions</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          IMPACT SNAPSHOT
          ============================================ */}
      <section className="py-16" style={{ background: '#1B4332' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#FDF8F0' }}>
                Impact <span style={{ color: '#C9A227' }}>Snapshot</span>
              </h2>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: 2847, label: 'TechMinutes®', suffix: '' },
                { value: 94, label: 'Sessions', suffix: '' },
                { value: 76, label: 'Resolution Rate', suffix: '%' },
                { value: 2, label: 'Active Hubs', suffix: '' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-6 rounded-xl"
                  style={{ background: 'rgba(253, 248, 240, 0.06)', border: '1px solid rgba(201, 162, 39, 0.15)' }}
                >
                  <div className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#C9A227' }}>
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-mono mt-2" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="text-center mt-10">
              <Link href="/impact">
                <span
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ background: 'rgba(201, 162, 39, 0.15)', color: '#C9A227', border: '1px solid rgba(201, 162, 39, 0.3)' }}
                >
                  View Full Impact Report
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          H.K. PREVIEW
          ============================================ */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <Reveal direction="left">
              <div>
                <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Meet H.K.</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1B4332' }}>
                  Your 24/7 Digital Guide
                </h2>
                <p className="text-base mb-6" style={{ color: '#2D3436', lineHeight: 1.7 }}>
                  Named for Horace King (1807–1885), the master bridge builder born into slavery who became
                  the most celebrated engineer in the antebellum South. H.K. carries his initials and his mission:
                  building connections that others won't.
                </p>
                <p className="text-sm mb-8" style={{ color: '#7C9A6E', lineHeight: 1.7 }}>
                  H.K. provides step-by-step guidance for school portals, job applications, telehealth setup,
                  housing documents, and more. Available 24/7 between in-person visits. Never asks for passwords or personal information.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['School Portals', 'Job Applications', 'Telehealth', 'Housing', 'Benefits'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-xs font-mono"
                      style={{ background: 'rgba(27, 67, 50, 0.06)', color: '#2D6A4F', border: '1px solid rgba(45, 106, 79, 0.15)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="relative">
                <img
                  src={CDN.hk}
                  alt="H.K. AI Guide"
                  className="rounded-2xl w-full"
                  style={{ boxShadow: '0 20px 60px rgba(27, 67, 50, 0.15)' }}
                />
                <div
                  className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl"
                  style={{ background: '#1B4332', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
                >
                  <span className="text-xs font-mono" style={{ color: '#C9A227' }}>H.K. is always online</span>
                  <span className="inline-block w-2 h-2 rounded-full ml-2 animate-pulse" style={{ background: '#22c55e' }} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================
          CTA — Ready to bring a hub?
          ============================================ */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1B4332, #0F2B1F)' }}>
        <div className="container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: '#FDF8F0' }}>
                Ready to bring a hub to your community?
              </h2>
              <p className="text-base mb-8" style={{ color: 'rgba(253, 248, 240, 0.7)', lineHeight: 1.7 }}>
                One 15-minute call. We bring the staffing, the system, and the reporting. You bring the space.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://calendly.com/thetechbridgecollective/techbridge-15-min-pilot-call"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-display font-bold transition-all duration-300 hover:scale-105"
                  style={{ background: '#C9A227', color: '#1B4332', boxShadow: '0 4px 20px rgba(201, 162, 39, 0.3)' }}
                >
                  Book a Pilot Call
                </a>
                <Link href="/host-a-hub">
                  <span
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-display font-bold transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{ color: '#FDF8F0', border: '2px solid rgba(201, 162, 39, 0.4)' }}
                  >
                    Learn More
                  </span>
                </Link>
              </div>
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
              <span className="font-display text-base font-bold" style={{ color: '#C9A227' }}>TechBridge Collective</span>
            </div>
            <p className="text-sm italic text-center" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>
              Bridging the digital divide, one neighborhood at a time.
            </p>
            <div className="flex items-center gap-4 text-sm" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>
              <a href="https://techbridge-collective.org" className="hover:text-[#C9A227] transition-colors">techbridge-collective.org</a>
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
    </div>
  );
}
