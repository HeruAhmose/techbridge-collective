/**
 * TechBridge Collective — About Page
 * Mission, Horace King story, SPAN document, team
 * 
 * SPAN = Strategic Playbook, Architecture & Navigator Operations
 * (The operational document name, NOT a resident journey model)
 * 
 * Bridge theme, forest green + gold + cream
 */
import { useState, useEffect, useRef } from 'react';
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

export default function About() {
  const [soundInit, setSoundInit] = useState(false);
  const initSound = () => { if (!soundInit) { tbSoundEngine.init(); setSoundInit(true); } };

  return (
    <div onClick={initSound} style={{ background: '#FDF8F0', color: '#2D3436' }}>

      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img src={CDN.horaceKing} alt="Horace King tribute" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15, 43, 31, 0.92), rgba(27, 67, 50, 0.85))' }} />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              Our Story
            </motion.p>
            <motion.h1
              className="font-display text-4xl md:text-6xl font-bold mb-6"
              style={{ color: '#FDF8F0' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Where Carbon Meets Crystal
            </motion.h1>
            <motion.p
              className="text-base md:text-lg max-w-2xl leading-relaxed"
              style={{ color: 'rgba(253, 248, 240, 0.8)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              TechBridge Collective exists because the digital divide isn't about devices — it's about access, dignity, and the human connection that makes technology useful.
            </motion.p>
          </div>
        </div>
      </section>

      {/* HORACE KING TRIBUTE */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <Reveal direction="left">
              <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(27, 67, 50, 0.12)' }}>
                <img src={CDN.horaceKing} alt="Horace King, master bridge builder" className="w-full h-auto" />
              </div>
            </Reveal>
            <Reveal direction="right">
              <div>
                <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Our Namesake</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#1B4332' }}>
                  Horace King
                </h2>
                <p className="text-base mb-4 leading-relaxed" style={{ color: '#2D3436' }}>
                  Born into slavery, Horace King became the most celebrated bridge builder in the American South. He designed and constructed bridges that connected communities separated by rivers, geography, and circumstance.
                </p>
                <p className="text-base mb-4 leading-relaxed" style={{ color: '#2D3436' }}>
                  His legacy lives in our name and our mission. The digital divide is today's river — and we build the bridges to cross it. Our AI assistant, <strong style={{ color: '#C9A227' }}>H.K.</strong>, carries his initials and his spirit of connection.
                </p>
                <div className="flex items-center gap-3 mt-6 p-4 rounded-xl" style={{ background: 'rgba(27, 67, 50, 0.04)', border: '1px solid #e8e0d0' }}>
                  <img src={CDN.hk} alt="H.K. AI" className="w-12 h-12 rounded-full" style={{ border: '2px solid #C9A227' }} />
                  <div>
                    <p className="font-display text-sm font-bold" style={{ color: '#1B4332' }}>H.K. — Help Desk Architect</p>
                    <p className="text-xs" style={{ color: '#5a6c5a' }}>24/7 AI bridge between visits</p>
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
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(27, 67, 50, 0.88), rgba(27, 67, 50, 0.5))' }} />
        </div>
        <div className="container relative z-10">
          <Reveal direction="left">
            <div className="max-w-xl">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Our Approach</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#FDF8F0' }}>
                You are not tech support. You are a bridge.
              </h2>
              <p className="text-base mb-4 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.85)' }}>
                A school portal isn't a password reset — it's a parent reconnecting with their child's education. A job application isn't a form — it's a veteran rebuilding their career.
              </p>
              <p className="text-sm italic" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>
                — From the TechBridge SPAN, Section 1: The Crossing
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* THE SPAN DOCUMENT — Correct Definition */}
      <section className="py-20 md:py-28 relative overflow-hidden" style={{ background: '#0F2B1F' }}>
        <div className="absolute inset-0">
          <img src={CDN.spanJourney} alt="" className="w-full h-full object-cover" style={{ opacity: 0.06 }} />
        </div>
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Our Operational Blueprint</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#FDF8F0' }}>The SPAN Document</h2>
              <p className="text-base mt-3 max-w-2xl mx-auto" style={{ color: 'rgba(253, 248, 240, 0.7)' }}>
                <strong style={{ color: '#C9A227' }}>Strategic Playbook, Architecture & Navigator Operations</strong> — our comprehensive operational document. Every section is named after a part of a bridge, because that's what we build.
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
              { num: '9', name: 'The Elevation', focus: 'MBA case study — PESTEL, Porter\'s, SWOT', icon: '🎓' },
            ].map((s, i) => (
              <Reveal key={s.num} delay={i * 0.06}>
                <motion.div
                  className="rounded-xl p-5 h-full cursor-pointer"
                  style={{ background: 'rgba(253, 248, 240, 0.03)', border: '1px solid rgba(253, 248, 240, 0.06)' }}
                  whileHover={{ borderColor: 'rgba(201, 162, 39, 0.3)', background: 'rgba(201, 162, 39, 0.05)' }}
                  onHoverStart={() => tbSoundEngine.play('pillar_hover')}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{s.icon}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(201, 162, 39, 0.15)', color: '#C9A227' }}>{s.num}</span>
                    <h3 className="font-display text-sm font-bold" style={{ color: '#FDF8F0' }}>{s.name}</h3>
                  </div>
                  <p className="text-xs leading-relaxed pl-9" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>{s.focus}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section className="py-20" style={{ background: '#FDF8F0' }}>
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

      {/* HANDS GUIDING — Photo Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.handsGuiding} alt="Navigator guiding a community member through a session" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, rgba(27, 67, 50, 0.88), rgba(27, 67, 50, 0.5))' }} />
        </div>
        <div className="container relative z-10">
          <Reveal direction="right">
            <div className="max-w-xl ml-auto text-right">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>The People Behind the Bridge</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#FDF8F0' }}>
                Digital Navigators
              </h2>
              <p className="text-base mb-4 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.85)' }}>
                Paid community members — not volunteers. Background-checked, trained, culturally competent, and bilingual when needed. They deliver 1-on-1 tech help sessions, triage digital crises, teach digital skills through guided practice, and log every session in TechMinutes®.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FUNDING */}
      <section className="py-20 md:py-28" style={{ background: '#FDF8F0' }}>
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

      <Footer />
    </div>
  );
}
