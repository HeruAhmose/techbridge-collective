/**
 * TechBridge Collective — Host a Hub Page
 * Content from HubHost One-Pager + SPAN document
 * Bridge theme, warm brutalism, forest green + gold + cream
 */
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';

import Footer from '../components/Footer';

const CDN = {
  hub: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/hub-exterior-Dp9FtPxyv99F7AzXgr44Ue.webp',
  navigator: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-navigator-J3QgpVMcvM5w7siVQDejbC.webp',
  gathering: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-gathering-7tsUyPrugQMATVzsJ7YZx2.webp',
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

const YOU_PROVIDE = [
  { icon: '🏢', title: 'Physical Space', desc: 'A quiet area with seating, power outlets, and Wi-Fi. Library rooms, community centers, church halls — wherever your community already gathers.' },
  { icon: '📣', title: 'Local Promotion', desc: 'Share the hub schedule through your existing channels — flyers, newsletters, social media, word of mouth.' },
  { icon: '🤝', title: 'Community Trust', desc: 'Your existing relationship with the community. People come because they trust your site.' },
];

const WE_PROVIDE = [
  { icon: '👤', title: 'Paid Digital Navigator', desc: 'Trained, background-checked staff member. 4–8 hours/week on-site. We handle hiring, training, and payroll.' },
  { icon: '🌉', title: 'H.K. AI Triage System', desc: '24/7 AI-powered guidance between visits. Handles routine queries, flags complex cases for Navigators.' },
  { icon: '📊', title: 'TechMinutes® Reporting', desc: 'Monthly non-PII impact reports: minutes served, issue categories, resolution rates, community patterns.' },
  { icon: '💻', title: 'Technology & Tools', desc: 'Devices, software, and digital resources needed to serve community members effectively.' },
  { icon: '📋', title: 'Operational Support', desc: 'Scheduling, quality assurance, continuous training, and program management.' },
  { icon: '📈', title: 'Funder-Ready Data', desc: 'Formatted impact data that demonstrates community need — ready for grant applications and board reports.' },
];

const TIMELINE = [
  { week: 'Week 1', title: 'Pilot Call', desc: '15-minute discovery call. We learn about your space, community, and goals.' },
  { week: 'Week 2-3', title: 'Setup & Training', desc: 'Navigator assigned, H.K. configured, TechMinutes® dashboard activated.' },
  { week: 'Week 4', title: 'Soft Launch', desc: 'First hub sessions begin. Navigator on-site during scheduled hours.' },
  { week: 'Week 8', title: 'First Impact Report', desc: 'Monthly TechMinutes® report delivered. Data shows community patterns and needs.' },
  { week: 'Ongoing', title: 'Continuous Improvement', desc: 'Weekly check-ins, quarterly reviews, adaptive programming based on data.' },
];

export default function HostAHub() {
  const [soundInit, setSoundInit] = useState(false);
  const initSound = () => { if (!soundInit) { tbSoundEngine.init(); setSoundInit(true); } };

  return (
    <div onClick={initSound} style={{ background: '#FDF8F0', color: '#2D3436' }}>

      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img src={CDN.hub} alt="" className="w-full h-full object-cover" style={{ opacity: 0.12 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15, 43, 31, 0.93), rgba(27, 67, 50, 0.88))' }} />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Partner With Us</p>
            </motion.div>
            <motion.h1
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-6"
              style={{ color: '#FDF8F0' }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            >
              Host a <span style={{ color: '#C9A227' }}>TechBridge Hub</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl max-w-2xl mb-8"
              style={{ color: 'rgba(253, 248, 240, 0.8)', lineHeight: 1.7 }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
            >
              You provide the space. We provide everything else — staffing, technology, training, and reporting.
              One visit can unlock a job application, unstick housing, recover a school account, or set up telehealth.
            </motion.p>
            <motion.a
              href="https://calendly.com/aitconsult22/30min"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-display font-bold transition-all duration-300 hover:scale-105"
              style={{ background: '#C9A227', color: '#1B4332', boxShadow: '0 4px 20px rgba(201, 162, 39, 0.3)' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}
            >
              Book a 15-Min Pilot Call
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.a>
          </div>
        </div>
      </section>

      {/* PARTNERSHIP MODEL */}
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>The Partnership</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>
                Intentionally Low-Lift for You
              </h2>
              <p className="text-base mt-3 max-w-xl mx-auto" style={{ color: '#2D3436' }}>
                We designed this model so community sites can focus on what they do best — serving their community.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Your Site Provides */}
            <Reveal>
              <div>
                <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1B4332' }}>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'rgba(27, 67, 50, 0.1)', color: '#2D6A4F' }}>→</span>
                  Your Site Provides
                </h3>
                <div className="space-y-4">
                  {YOU_PROVIDE.map((item, i) => (
                    <Reveal key={item.title} delay={i * 0.1}>
                      <motion.div
                        className="rounded-xl p-5 transition-all duration-300"
                        style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 2px 12px rgba(27, 67, 50, 0.04)' }}
                        whileHover={{ x: 4, boxShadow: '0 4px 20px rgba(27, 67, 50, 0.08)' }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl shrink-0">{item.icon}</span>
                          <div>
                            <h4 className="font-display font-bold mb-1" style={{ color: '#1B4332' }}>{item.title}</h4>
                            <p className="text-sm" style={{ color: '#2D3436', lineHeight: 1.6 }}>{item.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* TechBridge Provides */}
            <Reveal delay={0.2}>
              <div>
                <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#C9A227' }}>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'rgba(201, 162, 39, 0.1)', color: '#C9A227' }}>←</span>
                  TechBridge Provides
                </h3>
                <div className="space-y-4">
                  {WE_PROVIDE.map((item, i) => (
                    <Reveal key={item.title} delay={0.2 + i * 0.08}>
                      <motion.div
                        className="rounded-xl p-5 transition-all duration-300"
                        style={{ background: 'white', border: '1px solid rgba(201, 162, 39, 0.15)', boxShadow: '0 2px 12px rgba(201, 162, 39, 0.04)' }}
                        whileHover={{ x: -4, boxShadow: '0 4px 20px rgba(201, 162, 39, 0.1)' }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl shrink-0">{item.icon}</span>
                          <div>
                            <h4 className="font-display font-bold mb-1" style={{ color: '#C9A227' }}>{item.title}</h4>
                            <p className="text-sm" style={{ color: '#2D3436', lineHeight: 1.6 }}>{item.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* LAUNCH TIMELINE */}
      <section className="py-20" style={{ background: '#1B4332' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Getting Started</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#FDF8F0' }}>Launch Timeline</h2>
            </div>
          </Reveal>

          <div className="max-w-3xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px" style={{ background: 'rgba(201, 162, 39, 0.3)' }} />

            {TIMELINE.map((step, i) => (
              <Reveal key={step.week} delay={i * 0.12}>
                <div className="flex gap-6 md:gap-8 mb-8 relative">
                  <div className="shrink-0 w-12 md:w-16 flex flex-col items-center">
                    <motion.div
                      className="w-4 h-4 rounded-full z-10"
                      style={{ background: '#C9A227', boxShadow: '0 0 12px rgba(201, 162, 39, 0.4)' }}
                      whileInView={{ scale: [0, 1.3, 1] }}
                      transition={{ duration: 0.5, delay: i * 0.15 }}
                    />
                    <span className="text-[10px] font-mono mt-2 text-center" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>{step.week}</span>
                  </div>
                  <div className="flex-1 rounded-xl p-5" style={{ background: 'rgba(253, 248, 240, 0.04)', border: '1px solid rgba(201, 162, 39, 0.12)' }}>
                    <h4 className="font-display font-bold mb-1" style={{ color: '#C9A227' }}>{step.title}</h4>
                    <p className="text-sm" style={{ color: 'rgba(253, 248, 240, 0.7)', lineHeight: 1.6 }}>{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* IDEAL PARTNERS */}
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>Ideal Hub Partners</h2>
              <p className="text-base mt-3 max-w-xl mx-auto" style={{ color: '#2D3436' }}>
                Any community-facing organization with foot traffic and a mission to serve.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: '📚', name: 'Libraries' },
                { icon: '⛪', name: 'Faith-Based Orgs' },
                { icon: '🏛️', name: 'Community Centers' },
                { icon: '🏥', name: 'Health Clinics' },
                { icon: '🏘️', name: 'Housing Authorities' },
                { icon: '🎓', name: 'Schools & Colleges' },
                { icon: '🏢', name: 'Workforce Centers' },
                { icon: '🤲', name: 'Nonprofits' },
              ].map((p, i) => (
                <motion.div
                  key={p.name}
                  className="rounded-xl p-5 text-center transition-all duration-300"
                  style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 2px 12px rgba(27, 67, 50, 0.04)' }}
                  whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(27, 67, 50, 0.08)' }}
                >
                  <span className="text-3xl block mb-2">{p.icon}</span>
                  <span className="text-sm font-display font-semibold" style={{ color: '#1B4332' }}>{p.name}</span>
                </motion.div>
              ))}
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
                One call. That's all it takes.
              </h2>
              <p className="text-base mb-8" style={{ color: 'rgba(253, 248, 240, 0.7)', lineHeight: 1.7 }}>
                15 minutes to explore if a TechBridge Hub is right for your community. No commitment. No cost for the initial conversation.
              </p>
              <a
                href="https://calendly.com/aitconsult22/30min"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-display font-bold transition-all duration-300 hover:scale-105"
                style={{ background: '#C9A227', color: '#1B4332', boxShadow: '0 4px 20px rgba(201, 162, 39, 0.3)' }}
              >
                Schedule Your Pilot Call
              </a>
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
