/**
 * TechBridge Collective — About Page
 * Mission, Horace King story, SPAN model, team
 * Bridge theme, warm brutalism, forest green + gold + cream
 */
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';

const CDN = {
  hk: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/HK_avatar_80_9e8213b6.jpg',
  bridge: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/tb-hero-bridge_e2e7e2c5.png',
};

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

export default function About() {
  const [soundInit, setSoundInit] = useState(false);
  const initSound = () => { if (!soundInit) { tbSoundEngine.init(); setSoundInit(true); } };

  return (
    <div onClick={initSound} style={{ background: '#FDF8F0', color: '#2D3436' }}>

      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img src={CDN.bridge} alt="" className="w-full h-full object-cover" style={{ opacity: 0.1 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15, 43, 31, 0.95), rgba(27, 67, 50, 0.9))' }} />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              Our Story
            </motion.p>
            <motion.h1
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-6"
              style={{ color: '#FDF8F0' }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            >
              Built on the legacy of a <span style={{ color: '#C9A227' }}>bridge builder</span>
            </motion.h1>
            <motion.p className="text-lg max-w-2xl" style={{ color: 'rgba(253, 248, 240, 0.8)', lineHeight: 1.7 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              TechBridge Collective exists because the digital divide isn't a technology problem — it's a human problem that requires human solutions, augmented by technology.
            </motion.p>
          </div>
        </div>
      </section>

      {/* HORACE KING STORY */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <Reveal>
              <div>
                <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>The Namesake</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#1B4332' }}>
                  Horace King
                </h2>
                <p className="text-base mb-4" style={{ color: '#2D3436', lineHeight: 1.8 }}>
                  Born into slavery in 1807, Horace King became one of the most celebrated bridge builders in the American South. He designed and constructed bridges across Alabama, Georgia, and Mississippi — structures that connected communities separated by rivers and terrain.
                </p>
                <p className="text-base mb-4" style={{ color: '#2D3436', lineHeight: 1.8 }}>
                  After emancipation, King continued building. He was elected to the Alabama House of Representatives and became a respected businessman. His bridges were engineering marvels — but more importantly, they were acts of connection.
                </p>
                <p className="text-base" style={{ color: '#2D3436', lineHeight: 1.8 }}>
                  Our AI assistant, <strong style={{ color: '#C9A227' }}>H.K.</strong>, is named in his honor. Like King's bridges, H.K. connects people to the digital resources they need — spanning the divide between confusion and clarity.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(27, 67, 50, 0.15)' }}>
                  <img src={CDN.hk} alt="H.K. AI — Named for Horace King" className="w-full" />
                </div>
                <div className="absolute -bottom-4 -right-4 rounded-xl p-4" style={{ background: '#1B4332', boxShadow: '0 8px 24px rgba(27, 67, 50, 0.2)' }}>
                  <p className="text-sm font-display font-bold" style={{ color: '#C9A227' }}>H.K. AI</p>
                  <p className="text-xs" style={{ color: 'rgba(253, 248, 240, 0.7)' }}>Digital Bridge Builder</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20" style={{ background: '#1B4332' }}>
        <div className="container">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Our Mission</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-8" style={{ color: '#FDF8F0' }}>
                Bridge the digital divide through <span style={{ color: '#C9A227' }}>human-centered</span> technology support
              </h2>
              <p className="text-lg" style={{ color: 'rgba(253, 248, 240, 0.8)', lineHeight: 1.8 }}>
                We deploy paid Digital Navigators — trained community members who provide free, one-on-one tech help at trusted neighborhood locations. Our AI assistant H.K. extends support between visits, and our TechMinutes® system measures every interaction so communities can prove their impact.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* THE SPAN MODEL */}
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Our Methodology</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>The SPAN Model</h2>
              <p className="text-base mt-3 max-w-xl mx-auto" style={{ color: '#2D3436' }}>
                A 60-day journey from digital crisis to digital confidence.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { letter: 'S', name: 'Stabilize', desc: 'Triage the immediate digital crisis. Restore access, fix urgent issues, establish trust.', days: 'Days 1-7', color: '#C4704B' },
              { letter: 'P', name: 'Prepare', desc: 'Assess full digital needs. Create a personalized plan. Set up essential accounts and tools.', days: 'Days 8-21', color: '#C9A227' },
              { letter: 'A', name: 'Activate', desc: 'Build skills through guided practice. Complete key tasks independently with Navigator support.', days: 'Days 22-45', color: '#2D6A4F' },
              { letter: 'N', name: 'Navigate', desc: 'Sustain independence. Use H.K. AI for ongoing support. Become a community resource yourself.', days: 'Days 46-60+', color: '#1B4332' },
            ].map((s, i) => (
              <Reveal key={s.letter} delay={i * 0.12}>
                <motion.div
                  className="rounded-2xl p-6 h-full text-center transition-all duration-300"
                  style={{ background: 'white', border: `2px solid ${s.color}22`, boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)' }}
                  whileHover={{ y: -6, boxShadow: `0 12px 40px ${s.color}15` }}
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 font-display text-2xl font-bold" style={{ background: `${s.color}12`, color: s.color }}>
                    {s.letter}
                  </div>
                  <h3 className="font-display text-xl font-bold mb-1" style={{ color: s.color }}>{s.name}</h3>
                  <p className="text-xs font-mono mb-3" style={{ color: '#7C9A6E' }}>{s.days}</p>
                  <p className="text-sm" style={{ color: '#2D3436', lineHeight: 1.6 }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section className="py-20" style={{ background: 'rgba(27, 67, 50, 0.03)' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>What Makes Us Different</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: 'Human-First, AI-Augmented', desc: 'We don\'t replace human connection with technology. We use AI to extend the reach of our human Navigators — not substitute for them.', icon: '🤝' },
              { title: 'Embedded in Community', desc: 'We go where people already are — libraries, churches, community centers. We don\'t ask people to come to us.', icon: '🏘️' },
              { title: 'Measurable Impact', desc: 'TechMinutes® gives every partner and funder auditable, non-PII data that proves community impact. No more guessing.', icon: '📊' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="rounded-2xl p-6 h-full" style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 4px 20px rgba(27, 67, 50, 0.06)' }}>
                  <span className="text-3xl block mb-4">{item.icon}</span>
                  <h3 className="font-display text-lg font-bold mb-2" style={{ color: '#1B4332' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: '#2D3436', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DIGITAL NAVIGATOR ROLE */}
      <section className="py-20" style={{ background: '#1B4332' }}>
        <div className="container">
          <Reveal>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>The People Behind the Bridge</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#FDF8F0' }}>Digital Navigators</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: 'Who They Are', items: ['Paid community members (not volunteers)', 'Background-checked and trained', 'Culturally competent and bilingual when needed', 'Patient, empathetic, tech-literate'] },
                  { title: 'What They Do', items: ['1-on-1 tech help sessions at hub sites', 'Triage digital crises (locked accounts, expired benefits)', 'Teach digital skills through guided practice', 'Log every session in TechMinutes®'] },
                ].map((col, i) => (
                  <Reveal key={col.title} delay={i * 0.15}>
                    <div className="rounded-xl p-6" style={{ background: 'rgba(253, 248, 240, 0.04)', border: '1px solid rgba(201, 162, 39, 0.12)' }}>
                      <h3 className="font-display text-lg font-bold mb-4" style={{ color: '#C9A227' }}>{col.title}</h3>
                      <ul className="space-y-3">
                        {col.items.map(item => (
                          <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(253, 248, 240, 0.8)' }}>
                            <span style={{ color: '#C9A227' }}>•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FUNDING */}
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Sustainability</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#1B4332' }}>How We're Funded</h2>
              <p className="text-base mb-8" style={{ color: '#2D3436', lineHeight: 1.8 }}>
                TechBridge operates through a blended funding model: government digital equity grants, philanthropic partnerships, and earned revenue from TechMinutes® reporting services. We're actively seeking partners who want to invest in measurable community impact.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Government Grants', icon: '🏛️' },
                  { label: 'Philanthropy', icon: '💛' },
                  { label: 'Earned Revenue', icon: '📈' },
                ].map(f => (
                  <div key={f.label} className="rounded-xl p-4" style={{ background: 'rgba(27, 67, 50, 0.04)', border: '1px solid #e8e0d0' }}>
                    <span className="text-2xl block mb-2">{f.icon}</span>
                    <span className="text-sm font-display font-semibold" style={{ color: '#1B4332' }}>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1B4332, #0F2B1F)' }}>
        <div className="container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: '#FDF8F0' }}>
                Join the bridge.
              </h2>
              <p className="text-base mb-8" style={{ color: 'rgba(253, 248, 240, 0.7)', lineHeight: 1.7 }}>
                Whether you need help, want to host a hub, or want to fund digital equity — there's a place for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/get-help" className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-display font-bold transition-all duration-300 hover:scale-105" style={{ background: '#C9A227', color: '#1B4332' }}>
                  Get Help
                </a>
                <a href="/host-a-hub" className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-display font-bold transition-all duration-300 hover:scale-105" style={{ background: 'transparent', color: '#C9A227', border: '2px solid #C9A227' }}>
                  Host a Hub
                </a>
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
