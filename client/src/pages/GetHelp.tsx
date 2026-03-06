/**
 * TechBridge Collective — Get Help Page
 * Tech-Forward Dark Design System — Glassmorphism, Neon Glow, Circuit Patterns
 * Uses global Navigation + Footer + BridgeProgressBar from App.tsx
 */
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';
import Footer from '../components/Footer';

const IMAGES = {
  heroBridge: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/tb-hero-bridge-UbQzT3Yxdjbgg9ttB4ndQo.webp',
  navigatorSession: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-navigator-J3QgpVMcvM5w7siVQDejbC.webp',
  communityHub: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-gathering-7tsUyPrugQMATVzsJ7YZx2.webp',
  hkAI: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/HK_avatar_1024_6c459caf.jpg',
  successMoment: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/success-moment-hm2uPdPFHXpkuohVUwwfqe.webp',
  hubExterior: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/hub-exterior-Dp9FtPxyv99F7AzXgr44Ue.webp',
};

const STORIES = [
  { name: 'Maria', scenario: "Locked out of her child's school portal", duration: '18 min', category: 'Education', icon: '📚', accent: '#00D4AA', detail: "Maria came in during her lunch break. Her daughter's school switched to a new portal, and the password reset emails weren't arriving. In 18 minutes, a Digital Navigator helped her regain access, set up a backup email, and bookmarked the portal on her phone. Her daughter's grades were due that week." },
  { name: 'James', scenario: 'VA job application timed out twice', duration: '35 min', category: 'Workforce', icon: '💼', accent: '#E8B931', detail: "James, a veteran, had been trying to complete a federal job application for three days. The form kept timing out. A Digital Navigator sat beside him, helped him pre-fill answers in a document first, then guided him through the submission in one session. He got the interview." },
  { name: 'Dorothy', scenario: "Needed a telehealth appointment but didn't know where to start", duration: '40 min', category: 'Health', icon: '🏥', accent: '#C4704B', detail: "Dorothy, 74, had never used video calling. Her doctor's office moved to telehealth-only for follow-ups. A Digital Navigator helped her download the app, test her camera and microphone, and practice joining a call. She made her appointment that afternoon." },
  { name: 'Carlos', scenario: 'Housing document upload kept failing', duration: '22 min', category: 'Housing', icon: '🏠', accent: '#E8B931', detail: "Carlos needed to upload proof of income for a housing application. The file was too large, the format was wrong, and the deadline was tomorrow. A Digital Navigator helped him resize the document, convert it to PDF, and submit it. His application went through." },
  { name: 'Keisha', scenario: 'FAFSA application stalled at verification', duration: '45 min', category: 'Education', icon: '🎓', accent: '#00D4AA', detail: "Keisha's FAFSA was flagged for verification. She didn't understand the IRS Data Retrieval Tool. A Digital Navigator walked her through every step, helped her link her tax information, and submitted the verification. She didn't lose her financial aid." },
];

const PILLARS = [
  { number: 1, title: 'Weekly Help Desk', description: 'Walk-in and scheduled 1:1 sessions with trained, paid Digital Navigators. No volunteer churn. A consistent weekly presence residents rely on.', icon: '🤝', accent: '#00D4AA' },
  { number: 2, title: 'H.K. AI — 24/7 Triage', description: 'Named for Horace King. Step-by-step guidance between visits. Complex cases flagged for human follow-up at next session.', icon: '🌉', accent: '#E8B931' },
  { number: 3, title: 'TechMinutes® Reporting', description: 'Monthly non-PII summary: minutes delivered, issue categories, demand patterns, and recommendations. Proof partners can use.', icon: '📊', accent: '#C4704B' },
];

const TIMELINE = [
  { day: 'Day 1', label: '15-min call', description: "A quick conversation to see if we're a fit." },
  { day: 'Days 1–30', label: 'Setup + Training', description: 'We handle onboarding, navigator training, and materials.' },
  { day: 'Days 30–45', label: 'Hub Hours Live', description: 'Weekly sessions begin. Residents start walking in.' },
  { day: 'Day 60', label: 'First Report', description: 'Your first TechMinutes® impact report lands.' },
];

const DOMAINS = [
  { icon: '📚', title: 'Education', sdg: 'SDG 4', examples: 'School portals, FAFSA, online learning platforms, student account recovery', accent: '#00D4AA' },
  { icon: '💼', title: 'Workforce', sdg: 'SDG 8', examples: 'Job applications, resume uploads, hiring portals, VA benefits', accent: '#E8B931' },
  { icon: '🏥', title: 'Health', sdg: 'SDG 3', examples: 'Telehealth setup, patient portals, prescription management, insurance', accent: '#C4704B' },
  { icon: '🏠', title: 'Housing', sdg: 'SDG 1 & 10', examples: 'Rental applications, housing authority portals, utility assistance', accent: '#E8B931' },
];

/* Scroll-triggered reveal */
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
    up: { hidden: { y: 60, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    left: { hidden: { x: -80, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    right: { hidden: { x: 80, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    scale: { hidden: { scale: 0.85, opacity: 0 }, visible: { scale: 1, opacity: 1 } },
  };
  return (
    <motion.div ref={ref} className={className} initial="hidden" animate={visible ? 'visible' : 'hidden'} variants={variants[direction]} transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

/* Animated Counter */
function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) { setStarted(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / 2000, 1);
      setCount(Math.round((1 - Math.pow(1 - progress, 3)) * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, value]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* Circuit Background */
function CircuitBg({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
      <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E8B931" /><stop offset="100%" stopColor="#00D4AA" /></linearGradient></defs>
        <path d="M0 100 H200 V200 H400 V100 H600 V300 H800" stroke="url(#cg)" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M0 300 H150 V400 H350 V300 H550 V500 H800" stroke="url(#cg)" strokeWidth="1" fill="none" opacity="0.3" />
        {[{x:200,y:100},{x:400,y:200},{x:600,y:100},{x:150,y:300},{x:350,y:400}].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#E8B931" opacity="0.5" />
        ))}
      </svg>
    </div>
  );
}

export default function GetHelp() {
  const [formData, setFormData] = useState({ name: '', need: '', contact: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [expandedStory, setExpandedStory] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    tbSoundEngine.play('form_submit');
  };

  return (
    <div style={{ background: 'var(--tb-forest)', color: 'var(--tb-cream)' }}>
      {/* ============================================
          HERO — "The technology is live."
          ============================================ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.heroBridge} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,31,20,0.65) 0%, rgba(10,31,20,0.8) 50%, rgba(10,31,20,0.95) 100%)' }} />
        </div>
        <CircuitBg opacity={0.03} />

        <div className="container relative z-10 pt-32 pb-20">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
            <div className="holo-badge inline-block mb-6" style={{ color: '#00D4AA' }}>
              TechBridge Collective · Raleigh-Durham
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 max-w-4xl">
              The technology is <span className="text-glow-gold">live.</span>
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed mb-6 max-w-2xl" style={{ color: 'rgba(253, 248, 240, 0.75)' }}>
              The forms are online. What's missing is the person who sits down and walks you through it.
            </p>
            <p className="text-sm italic font-mono" style={{ color: 'rgba(232, 185, 49, 0.45)' }}>
              Named for Horace King (1807–1885), who built bridges connecting communities across the American South.
            </p>
          </motion.div>

          <motion.div className="flex flex-wrap gap-4 mt-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
            <a href="#get-help-form" className="tb-btn tb-btn-primary !text-base !px-8 !py-4" onClick={() => tbSoundEngine.play('nav_click')}>
              Get Help Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a href="#stories" className="tb-btn tb-btn-ghost !text-base !px-8 !py-4" onClick={() => tbSoundEngine.play('nav_click')}>
              See How It Works
            </a>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          THE GAP — Problem Statement
          ============================================ */}
      <section className="py-24 md:py-36 relative overflow-hidden" style={{ background: 'var(--tb-forest-mid)' }}>
        <CircuitBg opacity={0.04} />
        <div className="container relative z-10">
          <Reveal>
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div>
                <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">The Digital Divide</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">The Gap We Close</h2>
                <p className="text-lg leading-relaxed mb-4" style={{ color: 'rgba(253, 248, 240, 0.75)' }}>
                  A mother locked out of her child's school portal. A veteran whose job application timed out. A senior who needs telehealth but doesn't know where to start.
                </p>
                <p className="text-lg leading-relaxed font-bold text-glow-gold">
                  These aren't technology problems. They're navigation problems.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(232,185,49,0.08)' }}>
                <img src={IMAGES.navigatorSession} alt="Digital Navigator helping a community member" className="w-full h-full object-cover" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          IMPACT STATS
          ============================================ */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'var(--tb-forest)' }}>
        <CircuitBg opacity={0.06} />
        <div className="container relative z-10">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: 18, label: 'Avg. minutes per session', suffix: ' min', color: '#E8B931' },
                { value: 4, label: 'Issue categories tracked', suffix: '', color: '#00D4AA' },
                { value: 24, label: 'H.K. available', suffix: '/7', color: '#E8B931' },
                { value: 60, label: 'Days to first impact report', suffix: '', color: '#00D4AA' },
              ].map((stat) => (
                <motion.div key={stat.label} className="glass-card text-center p-6" whileHover={{ y: -6 }}>
                  <div className="stat-number text-3xl md:text-4xl" style={{ color: stat.color }}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-mono mt-2 uppercase tracking-wider" style={{ color: 'rgba(253, 248, 240, 0.45)' }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          STORIES — Interactive Story Cards
          ============================================ */}
      <section id="stories" className="py-24 md:py-36 relative overflow-hidden" style={{ background: 'var(--tb-forest-mid)' }}>
        <CircuitBg opacity={0.03} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-gold">Real Scenarios</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                One Visit Can Change <span className="text-glow-gold">Everything</span>
              </h2>
              <p className="text-base max-w-2xl mx-auto" style={{ color: 'rgba(253, 248, 240, 0.55)' }}>
                Click any story to see how a single help desk visit transforms a navigation problem into a solved one.
              </p>
            </div>
          </Reveal>

          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {STORIES.map((story, i) => (
              <Reveal key={story.name} delay={i * 0.08} direction={i % 2 === 0 ? 'left' : 'right'}>
                <motion.div
                  className="glass-card overflow-hidden cursor-pointer group"
                  whileHover={{ y: -4 }}
                  onClick={() => { setExpandedStory(expandedStory === i ? null : i); tbSoundEngine.play(expandedStory === i ? 'story_close' : 'story_reveal'); }}
                >
                  <div className="flex items-start gap-4 p-6 pb-3">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${story.accent}15` }}>
                      {story.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="font-display text-lg font-semibold" style={{ color: 'var(--tb-cream)' }}>{story.name}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: `${story.accent}15`, color: story.accent }}>{story.category}</span>
                      </div>
                      <p className="text-sm" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>{story.scenario}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-display text-2xl font-bold text-glow-gold">{story.duration}</span>
                      <p className="text-xs" style={{ color: 'rgba(0, 212, 170, 0.6)' }}>one visit</p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedStory === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                        <div className="px-6 pb-6 pt-2">
                          <div className="w-12 h-0.5 mb-4" style={{ background: `linear-gradient(90deg, ${story.accent}, transparent)` }} />
                          <p className="text-sm leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.7)', lineHeight: '1.8' }}>{story.detail}</p>
                          <p className="text-xs mt-3 italic" style={{ color: 'rgba(232, 185, 49, 0.45)' }}>The resident sees one visit. The funder sees systemic change.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="px-6 pb-4 flex items-center gap-2">
                    <motion.svg width="12" height="12" viewBox="0 0 24 24" fill="none" animate={{ rotate: expandedStory === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <path d="M6 9l6 6 6-6" stroke={story.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                    <span className="text-xs" style={{ color: story.accent }}>{expandedStory === i ? 'Close' : 'Read the full story'}</span>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          THREE PILLARS
          ============================================ */}
      <section className="py-24 md:py-36 relative overflow-hidden" style={{ background: 'var(--tb-forest)' }}>
        <CircuitBg opacity={0.04} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">What TechBridge Delivers</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Three Pillars of <span className="text-glow-gold">Support</span></h2>
              <p className="text-base max-w-2xl mx-auto" style={{ color: 'rgba(253, 248, 240, 0.55)' }}>
                A complete system — not just a program. In-person help, AI triage between visits, and measurable impact every month.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.number} delay={i * 0.15} direction="scale">
                <motion.div className="glass-card p-8 h-full relative group" whileHover={{ y: -12 }} onHoverStart={() => tbSoundEngine.play('pillar_hover')}>
                  <div className="font-display text-[100px] font-bold absolute -top-4 -right-2 select-none leading-none" style={{ color: pillar.accent, opacity: 0.06 }}>0{pillar.number}</div>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 transition-all duration-500 group-hover:scale-110" style={{ background: `${pillar.accent}15` }}>
                    {pillar.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3" style={{ color: 'var(--tb-cream)' }}>{pillar.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>{pillar.description}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${pillar.accent}, transparent)` }} />
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-16 rounded-2xl overflow-hidden max-w-5xl mx-auto" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
              <img src={IMAGES.communityHub} alt="TechBridge community hub in action" className="w-full" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          H.K. AI SECTION
          ============================================ */}
      <section className="py-24 md:py-36 relative overflow-hidden" style={{ background: 'var(--tb-forest-mid)' }}>
        <CircuitBg opacity={0.05} />
        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <Reveal direction="left">
              <div>
                <div className="holo-badge inline-block mb-6" style={{ color: '#E8B931' }}>Between Visits</div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Meet <span className="text-glow-gold">H.K.</span> — Your 24/7 Guide</h2>
                <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(253, 248, 240, 0.7)' }}>
                  Named for Horace King, H.K. is an AI assistant that provides step-by-step guidance between hub visits. Need help at 2 AM? H.K. walks you through it. Hit something complex? H.K. flags it for your next in-person session.
                </p>
                <div className="flex flex-col gap-3">
                  {['Step-by-step guidance for common tasks', 'Complex cases flagged for human follow-up', 'Available 24/7 — no wait, no appointment', 'Learns the most common community needs'].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(0, 212, 170, 0.15)', border: '1px solid rgba(0, 212, 170, 0.3)' }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <span className="text-sm" style={{ color: 'rgba(253, 248, 240, 0.65)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl" style={{ background: 'radial-gradient(circle, rgba(232, 185, 49, 0.12), transparent 70%)' }} />
                <img src={IMAGES.hkAI} alt="H.K. AI Assistant" className="rounded-2xl w-full relative" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(232, 185, 49, 0.1)', animation: 'glowPulse 4s ease-in-out infinite' }} />
                <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 px-5 py-3 rounded-xl font-display font-bold glass-card" style={{ color: '#00D4AA', boxShadow: '0 0 20px rgba(0, 212, 170, 0.2)' }}>
                  <span className="w-2 h-2 rounded-full inline-block mr-2 animate-pulse" style={{ background: '#00D4AA' }} />
                  24/7 Available
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================
          FOUR DOMAINS OF NEED
          ============================================ */}
      <section className="py-24 md:py-36 relative overflow-hidden" style={{ background: 'var(--tb-forest)' }}>
        <CircuitBg opacity={0.04} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-gold">Community Impact</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Four Domains of <span className="text-glow-teal">Need</span></h2>
              <p className="text-base max-w-2xl mx-auto" style={{ color: 'rgba(253, 248, 240, 0.55)' }}>
                Every help desk interaction maps to one of four issue categories — giving partners clear data on what their community needs most.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {DOMAINS.map((item, i) => (
              <Reveal key={item.title} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                <motion.div className="glass-card p-8 h-full group" whileHover={{ y: -8 }} onHoverStart={() => tbSoundEngine.play('pillar_hover')}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all duration-500 group-hover:scale-110" style={{ background: `${item.accent}12` }}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold" style={{ color: 'var(--tb-cream)' }}>{item.title}</h3>
                      <span className="text-xs font-mono" style={{ color: item.accent }}>{item.sdg}</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>{item.examples}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          TIMELINE — 60 Days to Impact
          ============================================ */}
      <section className="py-24 md:py-36 relative overflow-hidden" style={{ background: 'var(--tb-forest-mid)' }}>
        <CircuitBg opacity={0.03} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">The Path Forward</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">60 Days to First <span className="text-glow-gold">Impact</span></h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(253, 248, 240, 0.55)' }}>
                From first conversation to first impact report — here's how the bridge gets built.
              </p>
            </div>
          </Reveal>

          <div className="max-w-2xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px]" style={{ background: 'linear-gradient(180deg, #00D4AA, #E8B931)' }} />

            {TIMELINE.map((step, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div className="relative flex items-start gap-6 mb-10 pl-16 md:pl-20">
                  {/* Dot on timeline */}
                  <div className="absolute left-4 md:left-6 w-4 h-4 rounded-full z-10"
                    style={{
                      background: i === TIMELINE.length - 1 ? '#E8B931' : 'var(--tb-forest)',
                      border: `2px solid ${i === TIMELINE.length - 1 ? '#E8B931' : '#00D4AA'}`,
                      boxShadow: `0 0 10px ${i === TIMELINE.length - 1 ? 'rgba(232, 185, 49, 0.5)' : 'rgba(0, 212, 170, 0.3)'}`,
                    }}
                  />
                  <motion.div className="glass-card p-6 flex-1" whileHover={{ y: -4 }}>
                    <span className="font-mono text-xs" style={{ color: '#E8B931' }}>{step.day}</span>
                    <h3 className="font-display text-lg font-bold mt-1" style={{ color: 'var(--tb-cream)' }}>{step.label}</h3>
                    <p className="text-sm mt-2" style={{ color: 'rgba(253, 248, 240, 0.55)' }}>{step.description}</p>
                  </motion.div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          PARTNERSHIP — Provides vs Receives
          ============================================ */}
      <section className="py-24 md:py-36 relative overflow-hidden" style={{ background: 'var(--tb-forest)' }}>
        <CircuitBg opacity={0.04} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold">The <span className="text-glow-gold">Partnership</span></h2>
              <p className="text-base mt-4 max-w-xl mx-auto" style={{ color: 'rgba(253, 248, 240, 0.55)' }}>
                Intentionally low-lift for you. High-value for your community.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Reveal direction="left">
              <div className="glass-card p-8 h-full">
                <h3 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--tb-cream)' }}>Your Site Provides</h3>
                <p className="text-xs font-mono mb-6" style={{ color: 'rgba(0, 212, 170, 0.6)' }}>intentionally low-lift</p>
                {['A small room, table, or shared computer area', 'Weekly schedule (8 hrs — can start at 4)', 'One staff contact for scheduling', 'Light promotion (we supply all materials)'].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: '#00D4AA', boxShadow: '0 0 6px rgba(0, 212, 170, 0.5)' }} />
                    <span className="text-sm" style={{ color: 'rgba(253, 248, 240, 0.65)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="glass-card p-8 h-full" style={{ borderColor: 'rgba(232, 185, 49, 0.25)' }}>
                <h3 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--tb-cream)' }}>Your Site Receives</h3>
                <p className="text-xs font-mono mb-6 text-glow-gold">high-value</p>
                {[
                  { text: 'End-to-end staffing', sub: 'Paid Navigators. Zero workload.' },
                  { text: 'Monthly TechMinutes® report', sub: 'Partner-ready data.' },
                  { text: 'Issue-category intelligence', sub: 'What residents struggle with.' },
                  { text: 'Consistent weekly presence', sub: 'Service neighbors talk about.' },
                  { text: 'Story-ready narratives', sub: 'For funders & leadership.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: '#E8B931', boxShadow: '0 0 6px rgba(232, 185, 49, 0.5)' }} />
                    <div>
                      <span className="text-sm font-semibold" style={{ color: 'var(--tb-cream)' }}>{item.text}</span>
                      <span className="text-xs ml-2" style={{ color: 'rgba(253, 248, 240, 0.45)' }}>— {item.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================
          GET HELP FORM
          ============================================ */}
      <section id="get-help-form" className="py-24 md:py-36 relative overflow-hidden" style={{ background: 'var(--tb-forest-mid)' }}>
        <CircuitBg opacity={0.03} />
        <div className="container relative z-10">
          <Reveal>
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <div className="holo-badge inline-block mb-6" style={{ color: '#E8B931' }}>You've crossed the bridge</div>
                <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Let's See If This Is a <span className="text-glow-gold">Fit</span></h2>
                <p className="text-base" style={{ color: 'rgba(253, 248, 240, 0.55)' }}>
                  One 15-minute call. We bring the staffing, the system, and the reporting. You bring the space.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.form key="form" onSubmit={handleSubmit} className="glass-card p-8 md:p-10" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
                    <div className="flex flex-col gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--tb-cream)' }}>Your Name</label>
                        <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-300"
                          style={{ background: 'rgba(253, 248, 240, 0.05)', border: '2px solid rgba(232, 185, 49, 0.15)', color: 'var(--tb-cream)' }}
                          onFocus={(e) => { e.target.style.borderColor = 'rgba(232, 185, 49, 0.5)'; e.target.style.boxShadow = '0 0 15px rgba(232, 185, 49, 0.1)'; tbSoundEngine.play('form_focus'); }}
                          onBlur={(e) => { e.target.style.borderColor = 'rgba(232, 185, 49, 0.15)'; e.target.style.boxShadow = 'none'; }}
                          placeholder="Maria, James, Dorothy..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--tb-cream)' }}>What Do You Need Help With?</label>
                        <textarea required value={formData.need} onChange={(e) => setFormData({ ...formData, need: e.target.value })} rows={4}
                          className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-300 resize-none"
                          style={{ background: 'rgba(253, 248, 240, 0.05)', border: '2px solid rgba(232, 185, 49, 0.15)', color: 'var(--tb-cream)' }}
                          onFocus={(e) => { e.target.style.borderColor = 'rgba(232, 185, 49, 0.5)'; e.target.style.boxShadow = '0 0 15px rgba(232, 185, 49, 0.1)'; tbSoundEngine.play('form_focus'); }}
                          onBlur={(e) => { e.target.style.borderColor = 'rgba(232, 185, 49, 0.15)'; e.target.style.boxShadow = 'none'; }}
                          placeholder="School portal, job application, telehealth, housing documents..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--tb-cream)' }}>Best Way to Reach You</label>
                        <input type="text" required value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-300"
                          style={{ background: 'rgba(253, 248, 240, 0.05)', border: '2px solid rgba(232, 185, 49, 0.15)', color: 'var(--tb-cream)' }}
                          onFocus={(e) => { e.target.style.borderColor = 'rgba(232, 185, 49, 0.5)'; e.target.style.boxShadow = '0 0 15px rgba(232, 185, 49, 0.1)'; tbSoundEngine.play('form_focus'); }}
                          onBlur={(e) => { e.target.style.borderColor = 'rgba(232, 185, 49, 0.15)'; e.target.style.boxShadow = 'none'; }}
                          placeholder="Phone number or email"
                        />
                      </div>
                      <motion.button type="submit" className="w-full tb-btn tb-btn-primary !py-4 !text-lg justify-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        Request Help — It's Free
                      </motion.button>
                      <p className="text-xs text-center" style={{ color: 'rgba(253, 248, 240, 0.35)' }}>
                        No cost. No sign-up. No data collected beyond what you share here.
                      </p>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 text-center" style={{ borderColor: 'rgba(0, 212, 170, 0.3)' }}>
                    <div className="text-5xl mb-4">{'🌉'}</div>
                    <h3 className="font-display text-2xl font-bold mb-3 text-glow-gold">Bridge Connected</h3>
                    <p className="text-base mb-6" style={{ color: 'rgba(253, 248, 240, 0.7)' }}>
                      Thank you, {formData.name}. A Digital Navigator will reach out within 24 hours. In the meantime, H.K. is available 24/7 if you need immediate guidance.
                    </p>
                    <a href="https://techbridge-collective.org" className="tb-btn tb-btn-primary !px-8 !py-3">
                      Visit TechBridge Collective
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
