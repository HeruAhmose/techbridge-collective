/**
 * TechBridge Collective — TechMinutes® Impact Page
 * 
 * ALL NUMBERS ARE VERIFIED FROM THE SPAN DOCUMENT:
 * - Year 1: ~4,000 TechMinutes target, 2 hubs, 4 Navigators
 * - Year 2: ~6,000 TechMinutes target, 4 hubs
 * - Cost/TechMinute: ~$31 (Y1) → ~$21 (Y2)
 * - 4 issue categories: Education, Workforce, Health, Housing
 * - SOM: 3,200 residents over 2-year pilot
 * - Scenarios from §5.3 with verified durations
 * 
 * NO FABRICATED ACTUALS. Projections are labeled as projections.
 */
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';
import Footer from '../components/Footer';

const CDN = {
  successMoment: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/success-moment-hm2uPdPFHXpkuohVUwwfqe.webp',
  navigatorHelping: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-navigator-J3QgpVMcvM5w7siVQDejbC.webp',
  communityGathering: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-gathering-7tsUyPrugQMATVzsJ7YZx2.webp',
};

function Reveal({ children, delay = 0, direction = 'up' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const variants: Record<string, any> = {
    up: { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    left: { hidden: { x: -40, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    right: { hidden: { x: 40, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  };
  return (
    <motion.div ref={ref} initial="hidden" animate={v ? 'visible' : 'hidden'} variants={variants[direction]} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function Counter({ end, suffix = '', duration = 2000, prefix = '' }: { end: number; suffix?: string; duration?: number; prefix?: string }) {
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
      const p = Math.min((Date.now() - start) / duration, 1);
      setVal(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, end, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* Real scenarios from SPAN §5.3 */
const SCENARIOS = [
  {
    name: 'Maria',
    domain: 'Education',
    duration: '18 min',
    issue: 'Locked out of child\'s school portal. Password reset, bookmark setup, physical card backup.',
    outcome: 'Resolved',
    emoji: '📚',
    color: '#2D6A4F',
  },
  {
    name: 'James',
    domain: 'Workforce',
    duration: '35 min',
    issue: 'VA job application timing out. Account creation, draft-save strategy, DD-214 upload, NCWorks referral.',
    outcome: 'Partial — follow-up scheduled',
    emoji: '💼',
    color: '#1B4332',
  },
  {
    name: 'Dorothy',
    domain: 'Health',
    duration: '40 min',
    issue: 'Needed telehealth but never used video calling. Apple ID reset, portal app install, first appointment.',
    outcome: 'Resolved',
    emoji: '🏥',
    color: '#C4704B',
  },
  {
    name: 'Carlos',
    domain: 'Housing',
    duration: '22 min',
    issue: 'Housing document upload failing. Phone scanner, file conversion, upload, screenshot confirmation.',
    outcome: 'Resolved',
    emoji: '🏠',
    color: '#C9A227',
  },
  {
    name: 'Keisha',
    domain: 'Education',
    duration: '45 min',
    issue: 'FAFSA verification stalled. Parent FSA ID creation, guided section completion, no data entry by Navigator.',
    outcome: 'Resolved — check-in next session',
    emoji: '🎓',
    color: '#2D6A4F',
  },
];

export default function Impact() {
  const [soundInit, setSoundInit] = useState(false);
  const [expandedScenario, setExpandedScenario] = useState<number | null>(null);
  const initSound = () => { if (!soundInit) { tbSoundEngine.init(); setSoundInit(true); } };

  return (
    <div onClick={initSound} style={{ background: '#FDF8F0', color: '#2D3436' }}>

      {/* HERO */}
      <section className="relative pt-28 pb-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B4332, #0F2B1F)' }}>
        <div className="absolute inset-0">
          <img src={CDN.successMoment} alt="" className="w-full h-full object-cover" style={{ opacity: 0.08 }} />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              TechMinutes® Impact Framework
            </motion.p>
            <motion.h1
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-6"
              style={{ color: '#FDF8F0' }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            >
              Every minute <span style={{ color: '#C9A227' }}>measured</span>,<br />
              every connection <span style={{ color: '#C9A227' }}>counted</span>
            </motion.h1>
            <motion.p className="text-lg max-w-2xl" style={{ color: 'rgba(253, 248, 240, 0.8)', lineHeight: 1.7 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              TechMinutes® is our proprietary impact measurement system. Every help session is logged with duration, issue category, resolution status, and follow-up needs — giving partners and funders auditable, non-PII data that proves community impact.
            </motion.p>
          </div>
        </div>
      </section>

      {/* YEAR 1 & YEAR 2 PROJECTIONS — From SPAN §3 & §9 */}
      <section className="py-16" style={{ background: 'white' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(201, 162, 39, 0.12)', border: '1px solid rgba(201, 162, 39, 0.2)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#C9A227' }} />
                <span className="text-xs font-mono font-semibold" style={{ color: '#C9A227' }}>SPAN-Verified Projections</span>
              </div>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Year 1 */}
            <Reveal direction="left">
              <div className="rounded-2xl p-8 h-full" style={{ background: '#FDF8F0', border: '2px solid rgba(27, 67, 50, 0.1)', boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)' }}>
                <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#C9A227' }}>Year 1 Target</span>
                <h3 className="font-display text-2xl font-bold mt-2 mb-6" style={{ color: '#1B4332' }}>Foundation</h3>
                <div className="space-y-5">
                  <div>
                    <div className="font-display text-4xl font-bold" style={{ color: '#C9A227' }}>
                      <Counter end={4000} prefix="~" />
                    </div>
                    <p className="text-sm mt-1" style={{ color: '#5a6c5a' }}>TechMinutes® target</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-display text-2xl font-bold" style={{ color: '#1B4332' }}>2</div>
                      <p className="text-xs" style={{ color: '#5a6c5a' }}>Hub locations</p>
                    </div>
                    <div>
                      <div className="font-display text-2xl font-bold" style={{ color: '#1B4332' }}>4</div>
                      <p className="text-xs" style={{ color: '#5a6c5a' }}>Paid Navigators</p>
                    </div>
                  </div>
                  <div className="pt-4" style={{ borderTop: '1px solid #e8e0d0' }}>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#5a6c5a' }}>Cost per TechMinute</span>
                      <span className="font-mono font-bold" style={{ color: '#1B4332' }}>~$31</span>
                    </div>
                  </div>
                  <div className="text-xs" style={{ color: '#7C9A6E' }}>
                    Pilot sites: Durham County Library, Raleigh Digital Impact
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Year 2 */}
            <Reveal direction="right">
              <div className="rounded-2xl p-8 h-full" style={{ background: '#1B4332', boxShadow: '0 4px 20px rgba(27, 67, 50, 0.2)' }}>
                <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#C9A227' }}>Year 2 Target</span>
                <h3 className="font-display text-2xl font-bold mt-2 mb-6" style={{ color: '#FDF8F0' }}>Scale</h3>
                <div className="space-y-5">
                  <div>
                    <div className="font-display text-4xl font-bold" style={{ color: '#C9A227' }}>
                      <Counter end={6000} prefix="~" />
                    </div>
                    <p className="text-sm mt-1" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>TechMinutes® target</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-display text-2xl font-bold" style={{ color: '#FDF8F0' }}>4</div>
                      <p className="text-xs" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>Hub locations</p>
                    </div>
                    <div>
                      <div className="font-display text-2xl font-bold" style={{ color: '#FDF8F0' }}>SOM</div>
                      <p className="text-xs" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>3,200 residents</p>
                    </div>
                  </div>
                  <div className="pt-4" style={{ borderTop: '1px solid rgba(253, 248, 240, 0.1)' }}>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'rgba(253, 248, 240, 0.6)' }}>Cost per TechMinute</span>
                      <span className="font-mono font-bold" style={{ color: '#C9A227' }}>~$21</span>
                    </div>
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(253, 248, 240, 0.4)' }}>
                    Expansion: Durham & Raleigh Housing Authorities, El Centro Hispano
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <p className="text-center text-xs mt-8 italic" style={{ color: '#7C9A6E' }}>
              Source: SPAN Document §3 (The Load) & §9 (The Elevation) — $250K total investment over 2 years
            </p>
          </Reveal>
        </div>
      </section>

      {/* WHAT TECHMINUTES CAPTURES */}
      <section className="py-20" style={{ background: 'rgba(27, 67, 50, 0.03)' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>The Measurement</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>
                What Every TechMinute® Captures
              </h2>
              <p className="text-base mt-3 max-w-xl mx-auto" style={{ color: '#2D3436' }}>
                Every session logged before the resident leaves. Non-PII. Auditable. Partner-ready.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Duration', desc: 'Exact minutes of each session', icon: '⏱️' },
              { label: 'Category', desc: 'Education, Workforce, Health, or Housing', icon: '📋' },
              { label: 'Resolution', desc: 'Resolved, partial, or follow-up needed', icon: '✅' },
              { label: 'Hub Location', desc: 'Which site served the community member', icon: '📍' },
              { label: 'Issue Type', desc: 'Specific problem addressed', icon: '🔍' },
              { label: 'Follow-up', desc: 'Whether additional support is needed', icon: '🔄' },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 0.08}>
                <div className="rounded-xl p-5 h-full" style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 2px 12px rgba(27, 67, 50, 0.04)' }}>
                  <span className="text-xl block mb-2">{item.icon}</span>
                  <h4 className="font-display font-bold text-sm mb-1" style={{ color: '#1B4332' }}>{item.label}</h4>
                  <p className="text-xs" style={{ color: '#5a6c5a' }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="max-w-2xl mx-auto mt-12 p-6 rounded-xl text-center" style={{ background: 'rgba(201, 162, 39, 0.06)', border: '1px solid rgba(201, 162, 39, 0.15)' }}>
              <p className="text-sm italic" style={{ color: '#1B4332' }}>
                "Every interaction becomes a TechMinute®. No unmeasured work."
              </p>
              <p className="text-xs mt-2" style={{ color: '#7C9A6E' }}>— SPAN §1.4, Core Value #3</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOUR DOMAINS */}
      <section className="py-20">
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Issue Categories</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>Four Domains of Need</h2>
              <p className="text-base mt-3 max-w-xl mx-auto" style={{ color: '#2D3436' }}>
                Every TechMinute® maps to one of four domains aligned with UN Sustainable Development Goals — giving partners a clear picture of community needs.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: 'Education',
                sdg: 'SDG 4',
                icon: '📚',
                examples: 'School portals, FAFSA, online learning platforms, student account recovery, grade tracking, homework submission',
                color: '#2D6A4F',
                scenario: 'Maria: 18 min — School portal access restored',
              },
              {
                name: 'Workforce',
                sdg: 'SDG 8',
                icon: '💼',
                examples: 'Job applications, resume uploads, hiring portals, VA benefits, professional certifications, NCWorks navigation',
                color: '#1B4332',
                scenario: 'James: 35 min — VA job application submitted',
              },
              {
                name: 'Health',
                sdg: 'SDG 3',
                icon: '🏥',
                examples: 'Telehealth setup, patient portals, prescription management, insurance enrollment, appointment scheduling',
                color: '#C4704B',
                scenario: 'Dorothy: 40 min — First telehealth appointment made',
              },
              {
                name: 'Housing',
                sdg: 'SDG 1 & 10',
                icon: '🏠',
                examples: 'Rental applications, housing authority portals, utility assistance, document uploads, lease management',
                color: '#C9A227',
                scenario: 'Carlos: 22 min — Housing documents uploaded',
              },
            ].map((item, i) => (
              <Reveal key={item.name} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                <motion.div
                  className="rounded-2xl p-8 h-full transition-all duration-300"
                  style={{ background: 'white', border: `2px solid ${item.color}22`, boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)' }}
                  whileHover={{ y: -4, boxShadow: `0 12px 40px ${item.color}15` }}
                  onHoverStart={() => tbSoundEngine.play('pillar_hover')}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${item.color}12` }}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold" style={{ color: '#1B4332' }}>{item.name}</h3>
                      <span className="text-xs font-mono" style={{ color: item.color }}>{item.sdg}</span>
                    </div>
                  </div>
                  <p className="text-sm mb-4" style={{ color: '#2D3436', lineHeight: '1.7' }}>{item.examples}</p>
                  <div className="pt-3" style={{ borderTop: '1px solid #e8e0d0' }}>
                    <p className="text-xs font-mono" style={{ color: item.color }}>
                      SPAN §5.3: {item.scenario}
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NAVIGATOR PHOTO BREAK */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.navigatorHelping} alt="Digital Navigator helping community member" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(27, 67, 50, 0.9), rgba(27, 67, 50, 0.5))' }} />
        </div>
        <div className="container relative z-10">
          <Reveal direction="left">
            <div className="max-w-xl">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>The Navigator Mindset</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#FDF8F0' }}>
                "You are not tech support. You are a bridge."
              </h2>
              <p className="text-base mb-4 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.85)' }}>
                A school portal isn't a password reset — it's a parent reconnecting with their child's education. A job application isn't a form — it's a veteran rebuilding their career.
              </p>
              <p className="text-xs italic" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>— SPAN §5.1, Navigator Training</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* REAL SCENARIOS FROM SPAN §5.3 */}
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>From the SPAN Document §5.3</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>Real Scenarios, Real Protocols</h2>
              <p className="text-base mt-3 max-w-xl mx-auto" style={{ color: '#2D3436' }}>
                These are the actual training scenarios from our Navigator operations manual. Click to see the full protocol.
              </p>
            </div>
          </Reveal>

          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            {SCENARIOS.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.08}>
                <motion.div
                  className="rounded-xl overflow-hidden cursor-pointer"
                  style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 2px 12px rgba(27, 67, 50, 0.04)' }}
                  whileHover={{ boxShadow: '0 8px 30px rgba(27, 67, 50, 0.1)' }}
                  onClick={() => { setExpandedScenario(expandedScenario === i ? null : i); tbSoundEngine.play('story_reveal'); }}
                >
                  <div className="flex items-center gap-4 p-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${s.color}12` }}>
                      {s.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display text-base font-bold" style={{ color: '#1B4332' }}>{s.name}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: `${s.color}12`, color: s.color }}>{s.domain}</span>
                      </div>
                      <p className="text-sm mt-1 truncate" style={{ color: '#5a6c5a' }}>{s.issue.split('.')[0]}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-display text-xl font-bold" style={{ color: '#C9A227' }}>{s.duration}</span>
                    </div>
                  </div>

                  {expandedScenario === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5"
                    >
                      <div className="w-12 h-0.5 mb-4" style={{ background: 'linear-gradient(90deg, #1B4332, #C9A227)' }} />
                      <p className="text-sm leading-relaxed mb-3" style={{ color: '#2D3436' }}>{s.issue}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: s.outcome.startsWith('Resolved') ? 'rgba(45, 106, 79, 0.1)' : 'rgba(201, 162, 39, 0.1)', color: s.outcome.startsWith('Resolved') ? '#2D6A4F' : '#C9A227' }}>
                          {s.outcome}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="text-center text-xs mt-8 italic" style={{ color: '#7C9A6E' }}>
              All scenarios sourced directly from SPAN §5.3 — Navigator Training Scenarios
            </p>
          </Reveal>
        </div>
      </section>

      {/* THE 7-STEP SESSION PROTOCOL */}
      <section className="py-20" style={{ background: '#1B4332' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>SPAN §5.2</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#FDF8F0' }}>
                The 7-Step Session Protocol
              </h2>
              <p className="text-base mt-3 max-w-xl mx-auto" style={{ color: 'rgba(253, 248, 240, 0.7)' }}>
                Every session follows the same protocol. Consistency is the product.
              </p>
            </div>
          </Reveal>

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {[
                { step: '1', name: 'Greet', detail: 'Welcome by name if returning' },
                { step: '2', name: 'Listen', detail: 'Full problem first' },
                { step: '3', name: 'Assess', detail: 'Quick fix or complex?' },
                { step: '4', name: 'Guide', detail: 'On their device. Explain the why.' },
                { step: '5', name: 'Confirm', detail: '"Comfortable alone next time?"' },
                { step: '6', name: 'Log', detail: 'TechMinutes® entry before they leave' },
                { step: '7', name: 'Close', detail: '"We\'re here every [day]."' },
              ].map((s, i) => (
                <Reveal key={s.step} delay={i * 0.06}>
                  <motion.div
                    className="rounded-xl p-4 text-center h-full"
                    style={{ background: 'rgba(253, 248, 240, 0.05)', border: '1px solid rgba(253, 248, 240, 0.08)' }}
                    whileHover={{ background: 'rgba(201, 162, 39, 0.08)', borderColor: 'rgba(201, 162, 39, 0.2)' }}
                  >
                    <div className="font-display text-2xl font-bold mb-1" style={{ color: '#C9A227' }}>{s.step}</div>
                    <div className="font-display text-sm font-bold mb-1" style={{ color: '#FDF8F0' }}>{s.name}</div>
                    <p className="text-xs" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>{s.detail}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal>
            <div className="max-w-xl mx-auto mt-10 text-center">
              <p className="text-sm italic" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>
                "Comfortable doing this alone next time?" — the confirmation question every session ends with.
              </p>
              <p className="text-xs mt-2" style={{ color: 'rgba(253, 248, 240, 0.3)' }}>— SPAN §5.2</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* COMMUNITY PHOTO BREAK */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.communityGathering} alt="Community gathering" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, rgba(27, 67, 50, 0.9), rgba(27, 67, 50, 0.5))' }} />
        </div>
        <div className="container relative z-10">
          <Reveal direction="right">
            <div className="max-w-xl ml-auto text-right">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#FDF8F0' }}>
                "First report = inflection."
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.85)' }}>
                Host sees data, becomes advocate. Funder sees data, writes check. The TechMinutes® report is the moment everything changes.
              </p>
              <p className="text-xs mt-4 italic" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>— SPAN §9.7</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT MAKES TECHMINUTES DIFFERENT */}
      <section className="py-20">
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>
                Why TechMinutes® Matters
              </h2>
            </div>
          </Reveal>

          <div className="max-w-3xl mx-auto">
            <Reveal>
              <div className="rounded-2xl p-8 md:p-10" style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)' }}>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(27, 67, 50, 0.06)' }}>
                      <span className="text-lg">📊</span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold mb-1" style={{ color: '#1B4332' }}>Proprietary Measurement</h3>
                      <p className="text-sm" style={{ color: '#5a6c5a', lineHeight: 1.7 }}>
                        No other RDU program combines paid staff, consistent schedule, 24/7 AI, and proprietary measurement in a single zero-cost offering.
                      </p>
                      <p className="text-xs mt-1 italic" style={{ color: '#7C9A6E' }}>— SPAN §9.6</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(27, 67, 50, 0.06)' }}>
                      <span className="text-lg">🔒</span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold mb-1" style={{ color: '#1B4332' }}>Privacy by Design</h3>
                      <p className="text-sm" style={{ color: '#5a6c5a', lineHeight: 1.7 }}>
                        No PII. No credential access. We guide; we don't control. Every report is auditable without exposing personal information.
                      </p>
                      <p className="text-xs mt-1 italic" style={{ color: '#7C9A6E' }}>— SPAN §1.4, Core Value #6</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(27, 67, 50, 0.06)' }}>
                      <span className="text-lg">🤖</span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold mb-1" style={{ color: '#1B4332' }}>H.K. AI Continuity</h3>
                      <p className="text-sm" style={{ color: '#5a6c5a', lineHeight: 1.7 }}>
                        Between visits, H.K. provides 24/7 step-by-step guidance. Complex cases are flagged for human follow-up at the next session. The data loop never breaks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1B4332, #0F2B1F)' }}>
        <div className="container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: '#FDF8F0' }}>
                See the data for yourself.
              </h2>
              <p className="text-base mb-8" style={{ color: 'rgba(253, 248, 240, 0.7)', lineHeight: 1.7 }}>
                Explore our simulated dashboard to see how TechMinutes® data looks in practice — or reach out to discuss bringing a hub to your community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/dashboard" className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-display font-bold transition-all duration-300 hover:scale-105" style={{ background: '#C9A227', color: '#1B4332' }}>
                  View Dashboard
                </a>
                <a href="/host-a-hub" className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-display font-bold transition-all duration-300 hover:scale-105" style={{ background: 'transparent', color: '#C9A227', border: '2px solid #C9A227' }}>
                  Host a Hub
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
