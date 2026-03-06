/**
 * TechBridge Collective — About Page
 * Tech-Forward Dark Design System — Glassmorphism, Neon Glow, Circuit Patterns
 * SPAN = Strategic Playbook, Architecture & Navigator Operations
 */
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';
import Footer from '../components/Footer';

const CDN = {
  hk: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/HK_avatar_1024_6c459caf.jpg',
  horaceKing: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/horace-king-tribute-WrUcXchvoiExwCufr5cq2T.webp',
  navigatorHelping: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-navigator-J3QgpVMcvM5w7siVQDejbC.webp',
  handsGuiding: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/navigator-session-7Fy7vkxQXuw2y8AmS6RLxZ.webp',
  spanJourney: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/span-journey-fgm8ge9JC6YczpG5dzHFSm.webp',
};

function Reveal({ children, delay = 0, direction = 'up', className = '' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' | 'scale'; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const variants: Record<string, any> = {
    up: { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    left: { hidden: { x: -60, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    right: { hidden: { x: 60, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    scale: { hidden: { scale: 0.85, opacity: 0 }, visible: { scale: 1, opacity: 1 } },
  };
  return (
    <motion.div ref={ref} className={className} initial="hidden" animate={v ? 'visible' : 'hidden'} variants={variants[direction]} transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function CircuitBg({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
      <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <path d="M0 150 H250 V250 H450 V150 H650 V350 H800" stroke="#E8B931" strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M0 450 H200 V300 H500 V450 H800" stroke="#00D4AA" strokeWidth="1" fill="none" opacity="0.3" />
        {[{x:250,y:150},{x:450,y:250},{x:650,y:150},{x:200,y:300},{x:500,y:450}].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#E8B931" opacity="0.5" />
        ))}
      </svg>
    </div>
  );
}

export default function About() {
  return (
    <div style={{ background: 'var(--tb-forest)', color: 'var(--tb-cream)' }}>

      {/* HERO */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.horaceKing} alt="Horace King tribute" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,31,20,0.65) 0%, rgba(10,31,20,0.85) 60%, rgba(10,31,20,0.95) 100%)' }} />
        </div>
        <CircuitBg opacity={0.03} />
        <div className="container relative z-10 pt-32 pb-20">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
            <div className="holo-badge inline-block mb-6" style={{ color: '#00D4AA' }}>Our Story</div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl">
              Where Carbon Meets <span className="text-glow-gold">Crystal</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl" style={{ color: 'rgba(253, 248, 240, 0.75)' }}>
              TechBridge Collective exists because the digital divide isn't about devices — it's about access, dignity, and the human connection that makes technology useful.
            </p>
          </motion.div>
        </div>
      </section>

      {/* HORACE KING TRIBUTE */}
      <section className="py-24 md:py-36 relative overflow-hidden" style={{ background: 'var(--tb-forest-mid)' }}>
        <CircuitBg opacity={0.04} />
        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <Reveal direction="left">
              <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(232, 185, 49, 0.08)' }}>
                <img src={CDN.horaceKing} alt="Horace King, master bridge builder" className="w-full h-auto" />
              </div>
            </Reveal>
            <Reveal direction="right">
              <div>
                <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-gold">Our Namesake</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Horace <span className="text-glow-gold">King</span></h2>
                <p className="text-base mb-4 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.75)' }}>
                  Born into slavery, Horace King became the most celebrated bridge builder in the American South. He designed and constructed bridges that connected communities separated by rivers, geography, and circumstance.
                </p>
                <p className="text-base mb-4 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.75)' }}>
                  His legacy lives in our name and our mission. The digital divide is today's river — and we build the bridges to cross it. Our AI assistant, <strong className="text-glow-gold">H.K.</strong>, carries his initials and his spirit of connection.
                </p>
                <div className="glass-card flex items-center gap-3 p-4 mt-6">
                  <img src={CDN.hk} alt="H.K. AI" className="w-12 h-12 rounded-full" style={{ border: '2px solid #E8B931', boxShadow: '0 0 12px rgba(232, 185, 49, 0.3)' }} />
                  <div>
                    <p className="font-display text-sm font-bold" style={{ color: 'var(--tb-cream)' }}>H.K. — Help Desk Architect</p>
                    <p className="text-xs" style={{ color: 'rgba(0, 212, 170, 0.6)' }}>24/7 AI bridge between visits</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* NAVIGATOR PHOTO SECTION */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.navigatorHelping} alt="Digital Navigator helping community member" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,31,20,0.92), rgba(10,31,20,0.5))' }} />
        </div>
        <div className="container relative z-10">
          <Reveal direction="left">
            <div className="max-w-xl">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-gold">Our Approach</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">You are not tech support. You are a <span className="text-glow-gold">bridge</span>.</h2>
              <p className="text-base mb-4 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.85)' }}>
                A school portal isn't a password reset — it's a parent reconnecting with their child's education. A job application isn't a form — it's a veteran rebuilding their career.
              </p>
              <p className="text-sm italic" style={{ color: 'rgba(253, 248, 240, 0.45)' }}>— From the TechBridge SPAN, Section 1: The Crossing</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* THE SPAN DOCUMENT */}
      <section className="py-24 md:py-36 relative overflow-hidden" style={{ background: 'var(--tb-forest)' }}>
        <div className="absolute inset-0">
          <img src={CDN.spanJourney} alt="" className="w-full h-full object-cover" style={{ opacity: 0.04 }} />
        </div>
        <CircuitBg opacity={0.05} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">Our Operational Blueprint</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">The <span className="text-glow-gold">SPAN</span> Document</h2>
              <p className="text-base mt-3 max-w-2xl mx-auto" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>
                <strong className="text-glow-gold">Strategic Playbook, Architecture & Navigator Operations</strong> — our comprehensive operational document. Every section is named after a part of a bridge.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { num: '1', name: 'The Crossing', focus: 'Identity, values, brand voice, code of conduct', icon: '🧭' },
              { num: '2', name: 'The Structure', focus: 'Three pillars, partnership model, 60-day launch', icon: '🏗️' },
              { num: '3', name: 'The Load', focus: 'Budget, payroll, unit economics', icon: '⚖️' },
              { num: '4', name: 'The Approach', focus: 'Outreach rules, cadence, subject lines', icon: '📨' },
              { num: '5', name: 'The Cables', focus: 'Navigator training, session protocol, escalation', icon: '🔗' },
              { num: '6', name: 'The Deck', focus: 'Production stack, H.K. architecture, security', icon: '💻' },
              { num: '7', name: 'The Abutments', focus: 'Grant targets, local pipeline, growth roadmap', icon: '📈' },
              { num: '8', name: 'The Foundation', focus: 'Risk management, what-if scenarios, lean mode', icon: '🛡️' },
              { num: '9', name: 'The Elevation', focus: "MBA case study — PESTEL, Porter's, SWOT", icon: '🎓' },
            ].map((s, i) => (
              <Reveal key={s.num} delay={i * 0.06} direction="scale">
                <motion.div className="glass-card p-5 h-full" whileHover={{ y: -6, boxShadow: '0 0 20px rgba(232, 185, 49, 0.15)' }} onHoverStart={() => tbSoundEngine.play('pillar_hover')}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{s.icon}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(232, 185, 49, 0.15)', color: '#E8B931' }}>{s.num}</span>
                    <h3 className="font-display text-sm font-bold" style={{ color: 'var(--tb-cream)' }}>{s.name}</h3>
                  </div>
                  <p className="text-xs leading-relaxed pl-9" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>{s.focus}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section className="py-24 md:py-36 relative overflow-hidden" style={{ background: 'var(--tb-forest-mid)' }}>
        <CircuitBg opacity={0.04} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold">What Makes Us <span className="text-glow-gold">Different</span></h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: 'Human-First, AI-Augmented', desc: "We don't replace human connection with technology. We use AI to extend the reach of our human Navigators.", icon: '🤝', accent: '#00D4AA' },
              { title: 'Embedded in Community', desc: "We go where people already are — libraries, churches, community centers. We don't ask people to come to us.", icon: '🏘️', accent: '#E8B931' },
              { title: 'Measurable Impact', desc: 'TechMinutes® gives every partner and funder auditable, non-PII data that proves community impact.', icon: '📊', accent: '#00D4AA' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1} direction="scale">
                <motion.div className="glass-card p-6 h-full group" whileHover={{ y: -8 }} onHoverStart={() => tbSoundEngine.play('pillar_hover')}>
                  <span className="text-3xl block mb-4">{item.icon}</span>
                  <h3 className="font-display text-lg font-bold mb-2" style={{ color: item.accent }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'rgba(253, 248, 240, 0.6)', lineHeight: 1.7 }}>{item.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HANDS GUIDING — Photo Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.handsGuiding} alt="Navigator guiding a community member" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, rgba(10,31,20,0.92), rgba(10,31,20,0.5))' }} />
        </div>
        <div className="container relative z-10">
          <Reveal direction="right">
            <div className="max-w-xl ml-auto text-right">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-gold">The People Behind the Bridge</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Digital <span className="text-glow-teal">Navigators</span></h2>
              <p className="text-base mb-4 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.85)' }}>
                Paid community members — not volunteers. Background-checked, trained, culturally competent, and bilingual when needed. They deliver 1-on-1 tech help sessions, triage digital crises, teach digital skills through guided practice, and log every session in TechMinutes®.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FUNDING */}
      <section className="py-24 md:py-36 relative overflow-hidden" style={{ background: 'var(--tb-forest)' }}>
        <CircuitBg opacity={0.04} />
        <div className="container relative z-10">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">Sustainability</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">How We're <span className="text-glow-gold">Funded</span></h2>
              <p className="text-base mb-8" style={{ color: 'rgba(253, 248, 240, 0.65)', lineHeight: 1.8 }}>
                TechBridge operates through a blended funding model: government digital equity grants, philanthropic partnerships, and earned revenue from TechMinutes® reporting services.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Government Grants', icon: '🏛️', accent: '#00D4AA' },
                  { label: 'Philanthropy', icon: '💛', accent: '#E8B931' },
                  { label: 'Earned Revenue', icon: '📈', accent: '#00D4AA' },
                ].map(f => (
                  <motion.div key={f.label} className="glass-card p-4 text-center" whileHover={{ y: -6 }}>
                    <span className="text-2xl block mb-2">{f.icon}</span>
                    <span className="text-sm font-display font-semibold" style={{ color: f.accent }}>{f.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'var(--tb-forest-mid)' }}>
        <CircuitBg opacity={0.06} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Join the <span className="text-glow-gold">bridge</span>.</h2>
              <p className="text-base mb-8" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>
                Whether you need help, want to host a hub, or want to fund digital equity — there's a place for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/get-help" className="tb-btn tb-btn-primary !px-8 !py-4 !text-base justify-center" onClick={() => tbSoundEngine.play('nav_click')}>Get Help</a>
                <a href="/host-a-hub" className="tb-btn tb-btn-ghost !px-8 !py-4 !text-base justify-center" onClick={() => tbSoundEngine.play('nav_click')}>Host a Hub</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
