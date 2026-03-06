/**
 * TechBridge Collective — TechMinutes® Impact Page
 * Visual storytelling of community impact with animated data
 */
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <motion.div ref={ref} initial={{ y: 30, opacity: 0 }} animate={v ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

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
      const p = Math.min((Date.now() - start) / duration, 1);
      setVal(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, end, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const IMPACT_STORIES = [
  {
    quote: "I couldn't figure out my child's school portal. The Navigator walked me through it in 15 minutes. Now I check grades every week.",
    category: 'Education',
    minutes: 15,
    color: '#2D6A4F',
  },
  {
    quote: "I'd been trying to apply for jobs online for weeks. One session and I had three applications submitted.",
    category: 'Workforce',
    minutes: 45,
    color: '#C9A227',
  },
  {
    quote: "My doctor switched to telehealth. I didn't know how to use it. The Navigator set everything up on my phone.",
    category: 'Health',
    minutes: 20,
    color: '#C4704B',
  },
  {
    quote: "The housing authority portal kept timing out. Turns out I needed to clear my browser cache. Simple fix, but I never would have known.",
    category: 'Housing',
    minutes: 10,
    color: '#7C9A6E',
  },
];

const MONTHLY_DATA = [
  { month: 'Oct', minutes: 312, sessions: 12 },
  { month: 'Nov', minutes: 487, sessions: 18 },
  { month: 'Dec', minutes: 398, sessions: 15 },
  { month: 'Jan', minutes: 621, sessions: 22 },
  { month: 'Feb', minutes: 584, sessions: 20 },
  { month: 'Mar', minutes: 445, sessions: 17 },
];

export default function Impact() {
  const [soundInit, setSoundInit] = useState(false);
  const initSound = () => { if (!soundInit) { tbSoundEngine.init(); setSoundInit(true); } };

  return (
    <div onClick={initSound} style={{ background: '#FDF8F0', color: '#2D3436' }}>

      {/* HERO */}
      <section className="relative pt-28 pb-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B4332, #0F2B1F)' }}>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              TechMinutes® Impact Report
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
              TechMinutes® is our proprietary impact measurement system. Every help session is logged with duration, issue category, resolution status, and follow-up needs. This is data your funders actually want.
            </motion.p>
          </div>
        </div>
      </section>

      {/* BIG NUMBERS */}
      <section className="py-16" style={{ background: 'white' }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: 2847, label: 'Total TechMinutes®', color: '#C9A227' },
              { value: 94, label: 'Total Sessions', color: '#1B4332' },
              { value: 76, label: 'Resolution Rate', suffix: '%', color: '#22c55e' },
              { value: 4, label: 'Issue Categories', color: '#C4704B' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <div className="text-center p-6 rounded-2xl" style={{ background: '#FDF8F0', border: '1px solid #e8e0d0', boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)' }}>
                  <div className="font-display text-3xl md:text-4xl font-bold" style={{ color: s.color }}>
                    <Counter end={s.value} suffix={s.suffix || ''} />
                  </div>
                  <div className="text-xs font-mono mt-2 uppercase tracking-wider" style={{ color: '#7C9A6E' }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY BREAKDOWN */}
      <section className="py-20">
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>Four Domains of Need</h2>
              <p className="text-base mt-3 max-w-xl mx-auto" style={{ color: '#2D3436' }}>
                Every TechMinute® is categorized into one of four domains, giving partners and funders a clear picture of community needs.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Education', pct: 42, icon: '📚', desc: 'School portals, homework platforms, enrollment forms, parent-teacher communication', color: '#2D6A4F' },
              { name: 'Workforce', pct: 28, icon: '💼', desc: 'Job applications, resume uploads, career portals, interview scheduling', color: '#C9A227' },
              { name: 'Health', pct: 18, icon: '🏥', desc: 'Telehealth setup, patient portals, prescription management, insurance navigation', color: '#C4704B' },
              { name: 'Housing', pct: 12, icon: '🏠', desc: 'Rental applications, housing authority portals, utility assistance, document uploads', color: '#7C9A6E' },
            ].map((c, i) => (
              <Reveal key={c.name} delay={i * 0.12}>
                <motion.div
                  className="rounded-2xl p-6 h-full transition-all duration-300"
                  style={{ background: 'white', border: `2px solid ${c.color}22`, boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)' }}
                  whileHover={{ y: -6, boxShadow: `0 12px 40px ${c.color}15` }}
                >
                  <span className="text-3xl block mb-3">{c.icon}</span>
                  <h3 className="font-display text-xl font-bold mb-1" style={{ color: c.color }}>{c.name}</h3>
                  <div className="font-display text-4xl font-bold mb-3" style={{ color: '#1B4332' }}>{c.pct}%</div>
                  <p className="text-sm" style={{ color: '#2D3436', lineHeight: 1.6 }}>{c.desc}</p>
                  <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: `${c.color}15` }}>
                    <motion.div className="h-full rounded-full" style={{ background: c.color }} initial={{ width: 0 }} whileInView={{ width: `${c.pct}%` }} transition={{ duration: 1, delay: 0.3 }} />
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MONTHLY TREND */}
      <section className="py-20" style={{ background: '#1B4332' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#FDF8F0' }}>
                Monthly <span style={{ color: '#C9A227' }}>Growth</span>
              </h2>
            </div>
          </Reveal>

          <Reveal>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-3 h-56">
                {MONTHLY_DATA.map((m, i) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-mono" style={{ color: '#C9A227' }}>{m.minutes}</span>
                    <motion.div
                      className="w-full rounded-t-lg"
                      style={{ background: `linear-gradient(to top, #2D6A4F, #C9A227)` }}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${(m.minutes / 650) * 180}px` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                    <span className="text-xs font-mono mt-1" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* IMPACT STORIES */}
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>Real Stories, Real Impact</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {IMPACT_STORIES.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="rounded-2xl p-6 h-full" style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold" style={{ background: `${s.color}15`, color: s.color }}>{s.category}</span>
                    <span className="text-xs font-mono" style={{ color: '#7C9A6E' }}>{s.minutes} TechMinutes®</span>
                  </div>
                  <blockquote className="text-base italic" style={{ color: '#2D3436', lineHeight: 1.7 }}>
                    "{s.quote}"
                  </blockquote>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT TECHMINUTES CAPTURES */}
      <section className="py-16" style={{ background: 'rgba(27, 67, 50, 0.03)' }}>
        <div className="container">
          <Reveal>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center" style={{ color: '#1B4332' }}>What Every TechMinute® Captures</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Duration', desc: 'Exact minutes of each session' },
                  { label: 'Category', desc: 'Education, Workforce, Health, Housing' },
                  { label: 'Resolution', desc: 'Resolved, follow-up, or escalated' },
                  { label: 'Hub Location', desc: 'Which site served the community member' },
                  { label: 'Issue Type', desc: 'Specific problem addressed' },
                  { label: 'Follow-up', desc: 'Whether additional support is needed' },
                ].map((item, i) => (
                  <div key={item.label} className="rounded-xl p-4" style={{ background: 'white', border: '1px solid #e8e0d0' }}>
                    <h4 className="font-display font-bold text-sm mb-1" style={{ color: '#C9A227' }}>{item.label}</h4>
                    <p className="text-xs" style={{ color: '#2D3436' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12" style={{ background: '#0F2B1F' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M4 22 Q16 8 28 22" stroke="#C9A227" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <line x1="4" y1="22" x2="28" y2="22" stroke="#C9A227" strokeWidth="2" />
                <line x1="16" y1="22" x2="16" y2="11" stroke="#C9A227" strokeWidth="1.5" />
              </svg>
              <span className="font-display text-base font-bold" style={{ color: '#C9A227' }}>TechBridge Collective</span>
            </div>
            <p className="text-sm italic" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>Bridging the digital divide, one neighborhood at a time.</p>
            <span className="text-sm" style={{ color: 'rgba(253, 248, 240, 0.4)' }}>2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
