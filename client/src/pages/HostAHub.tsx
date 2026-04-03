/**
 * TechBridge Collective — Host a Hub Page
 * Tech-Forward Dark Design System — Glassmorphism, Neon Glow, Circuit Patterns
 */
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { tbSoundEngine } from "../lib/TBSoundEngine";
import Footer from "../components/Footer";

const CDN = {
  hub: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/hub-exterior-Dp9FtPxyv99F7AzXgr44Ue.webp",
  navigator:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-navigator-J3QgpVMcvM5w7siVQDejbC.webp",
  gathering:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-gathering-7tsUyPrugQMATVzsJ7YZx2.webp",
};

function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setV(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const variants: Record<string, any> = {
    up: { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    left: { hidden: { x: -60, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    right: { hidden: { x: 60, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    scale: {
      hidden: { scale: 0.85, opacity: 0 },
      visible: { scale: 1, opacity: 1 },
    },
  };
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={v ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function CircuitBg({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M0 100 H200 V200 H400 V100 H600 V300 H800"
          stroke="#E8B931"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M0 400 H300 V200 H500 V400 H800"
          stroke="#00D4AA"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
        {[
          { x: 200, y: 100 },
          { x: 400, y: 200 },
          { x: 600, y: 100 },
          { x: 300, y: 200 },
          { x: 500, y: 400 },
        ].map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#E8B931"
            opacity="0.5"
          />
        ))}
      </svg>
    </div>
  );
}

const YOU_PROVIDE = [
  {
    icon: "🏢",
    title: "Physical Space",
    desc: "A quiet area with seating, power outlets, and Wi-Fi. Library rooms, community centers, church halls.",
    accent: "#00D4AA",
  },
  {
    icon: "📣",
    title: "Local Promotion",
    desc: "Share the hub schedule through your existing channels — flyers, newsletters, social media.",
    accent: "#E8B931",
  },
  {
    icon: "🤝",
    title: "Community Trust",
    desc: "Your existing relationship with the community. People come because they trust your site.",
    accent: "#00D4AA",
  },
];

const WE_PROVIDE = [
  {
    icon: "👤",
    title: "Paid Digital Navigator",
    desc: "Trained, background-checked staff. 4–8 hours/week on-site. We handle hiring, training, and payroll.",
    accent: "#E8B931",
  },
  {
    icon: "🌉",
    title: "H.K. AI Triage System",
    desc: "24/7 AI-powered guidance between visits. Handles routine queries, flags complex cases.",
    accent: "#00D4AA",
  },
  {
    icon: "📊",
    title: "TechMinutes® Reporting",
    desc: "Monthly non-PII impact reports: minutes served, issue categories, resolution rates.",
    accent: "#E8B931",
  },
  {
    icon: "💻",
    title: "Technology & Tools",
    desc: "Devices, software, and digital resources needed to serve community members effectively.",
    accent: "#00D4AA",
  },
  {
    icon: "📋",
    title: "Operational Support",
    desc: "Scheduling, quality assurance, continuous training, and program management.",
    accent: "#E8B931",
  },
  {
    icon: "📈",
    title: "Funder-Ready Data",
    desc: "Formatted impact data for grant applications and board reports.",
    accent: "#00D4AA",
  },
];

const TIMELINE = [
  {
    week: "Week 1",
    title: "Pilot Call",
    desc: "15-minute discovery call. We learn about your space, community, and goals.",
  },
  {
    week: "Week 2-3",
    title: "Setup & Training",
    desc: "Navigator assigned, H.K. configured, TechMinutes® dashboard activated.",
  },
  {
    week: "Week 4",
    title: "Soft Launch",
    desc: "First hub sessions begin. Navigator on-site during scheduled hours.",
  },
  {
    week: "Week 8",
    title: "First Impact Report",
    desc: "Monthly TechMinutes® report delivered. Data shows community patterns.",
  },
  {
    week: "Ongoing",
    title: "Continuous Improvement",
    desc: "Weekly check-ins, quarterly reviews, adaptive programming based on data.",
  },
];

export default function HostAHub() {
  return (
    <div style={{ background: "var(--tb-forest)", color: "var(--tb-cream)" }}>
      {/* HERO */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.hub} alt="" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,31,20,0.65) 0%, rgba(10,31,20,0.85) 60%, rgba(10,31,20,0.95) 100%)",
            }}
          />
        </div>
        <CircuitBg opacity={0.04} />
        <div className="container relative z-10 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="holo-badge inline-block mb-6"
              style={{ color: "#00D4AA" }}
            >
              Partner With Us
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] mb-6 max-w-4xl">
              Host a <span className="text-glow-gold">TechBridge Hub</span>
            </h1>
            <p
              className="text-lg md:text-xl max-w-2xl mb-8"
              style={{ color: "rgba(253, 248, 240, 0.75)" }}
            >
              You provide the space. We provide everything else — staffing,
              technology, training, and reporting.
            </p>
            <a
              href="https://calendly.com/aitconsult22/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="tb-btn tb-btn-primary !text-base !px-8 !py-4"
              onClick={() => tbSoundEngine.play("nav_click")}
            >
              Book a 15-Min Pilot Call
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14m-7-7l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* PARTNERSHIP MODEL */}
      <section
        className="py-24 md:py-36 relative overflow-hidden"
        style={{ background: "var(--tb-forest-mid)" }}
      >
        <CircuitBg opacity={0.04} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-gold">
                The Partnership
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Intentionally <span className="text-glow-teal">Low-Lift</span>{" "}
                for You
              </h2>
              <p
                className="text-base mt-3 max-w-xl mx-auto"
                style={{ color: "rgba(253, 248, 240, 0.55)" }}
              >
                We designed this model so community sites can focus on what they
                do best.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <Reveal>
                <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{
                      background: "rgba(0, 212, 170, 0.1)",
                      color: "#00D4AA",
                      border: "1px solid rgba(0, 212, 170, 0.3)",
                    }}
                  >
                    →
                  </span>
                  Your Site Provides
                </h3>
              </Reveal>
              <div className="space-y-4">
                {YOU_PROVIDE.map((item, i) => (
                  <Reveal key={item.title} delay={i * 0.1}>
                    <motion.div
                      className="glass-card p-5 group"
                      whileHover={{ x: 6 }}
                      onHoverStart={() => tbSoundEngine.play("pillar_hover")}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl shrink-0">{item.icon}</span>
                        <div>
                          <h4
                            className="font-display font-bold mb-1"
                            style={{ color: item.accent }}
                          >
                            {item.title}
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: "rgba(253, 248, 240, 0.6)" }}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div>
              <Reveal delay={0.15}>
                <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{
                      background: "rgba(232, 185, 49, 0.1)",
                      color: "#E8B931",
                      border: "1px solid rgba(232, 185, 49, 0.3)",
                    }}
                  >
                    ←
                  </span>
                  TechBridge Provides
                </h3>
              </Reveal>
              <div className="space-y-4">
                {WE_PROVIDE.map((item, i) => (
                  <Reveal key={item.title} delay={0.15 + i * 0.08}>
                    <motion.div
                      className="glass-card p-5 group"
                      whileHover={{ x: -6 }}
                      onHoverStart={() => tbSoundEngine.play("pillar_hover")}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl shrink-0">{item.icon}</span>
                        <div>
                          <h4
                            className="font-display font-bold mb-1"
                            style={{ color: item.accent }}
                          >
                            {item.title}
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: "rgba(253, 248, 240, 0.6)" }}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LAUNCH TIMELINE */}
      <section
        className="py-24 md:py-36 relative overflow-hidden"
        style={{ background: "var(--tb-forest)" }}
      >
        <CircuitBg opacity={0.05} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">
                Getting Started
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Launch <span className="text-glow-gold">Timeline</span>
              </h2>
            </div>
          </Reveal>

          <div className="max-w-2xl mx-auto relative">
            <div
              className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px]"
              style={{
                background: "linear-gradient(180deg, #00D4AA, #E8B931)",
              }}
            />
            {TIMELINE.map((step, i) => (
              <Reveal key={step.week} delay={i * 0.12}>
                <div className="flex gap-6 md:gap-8 mb-8 relative pl-16 md:pl-20">
                  <div
                    className="absolute left-4 md:left-6 w-4 h-4 rounded-full z-10"
                    style={{
                      background:
                        i === TIMELINE.length - 1
                          ? "#E8B931"
                          : "var(--tb-forest)",
                      border: `2px solid ${i === TIMELINE.length - 1 ? "#E8B931" : "#00D4AA"}`,
                      boxShadow: `0 0 10px ${i === TIMELINE.length - 1 ? "rgba(232,185,49,0.5)" : "rgba(0,212,170,0.3)"}`,
                    }}
                  />
                  <motion.div
                    className="glass-card p-5 flex-1"
                    whileHover={{ y: -4 }}
                  >
                    <span
                      className="text-xs font-mono"
                      style={{ color: "#E8B931" }}
                    >
                      {step.week}
                    </span>
                    <h4
                      className="font-display font-bold mt-1"
                      style={{ color: "var(--tb-cream)" }}
                    >
                      {step.title}
                    </h4>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "rgba(253, 248, 240, 0.55)" }}
                    >
                      {step.desc}
                    </p>
                  </motion.div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* IDEAL PARTNERS */}
      <section
        className="py-24 md:py-36 relative overflow-hidden"
        style={{ background: "var(--tb-forest-mid)" }}
      >
        <CircuitBg opacity={0.03} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Ideal Hub <span className="text-glow-gold">Partners</span>
              </h2>
              <p
                className="text-base mt-3 max-w-xl mx-auto"
                style={{ color: "rgba(253, 248, 240, 0.55)" }}
              >
                Any community-facing organization with foot traffic and a
                mission to serve.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: "📚", name: "Libraries" },
                { icon: "⛪", name: "Faith-Based Orgs" },
                { icon: "🏛️", name: "Community Centers" },
                { icon: "🏥", name: "Health Clinics" },
                { icon: "🏘️", name: "Housing Authorities" },
                { icon: "🎓", name: "Schools & Colleges" },
                { icon: "🏢", name: "Workforce Centers" },
                { icon: "🤲", name: "Nonprofits" },
              ].map(p => (
                <motion.div
                  key={p.name}
                  className="glass-card p-5 text-center"
                  whileHover={{
                    y: -6,
                    boxShadow: "0 0 25px rgba(232, 185, 49, 0.15)",
                  }}
                  onHoverStart={() => tbSoundEngine.play("pillar_hover")}
                >
                  <span className="text-3xl block mb-2">{p.icon}</span>
                  <span
                    className="text-sm font-display font-semibold"
                    style={{ color: "var(--tb-cream)" }}
                  >
                    {p.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
