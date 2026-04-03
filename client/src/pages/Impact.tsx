/**
 * TechBridge Collective — TechMinutes® Impact Page
 * Tech-Forward Dark Design System — Glassmorphism, Neon Glow, Circuit Patterns
 *
 * ALL NUMBERS ARE VERIFIED FROM THE SPAN DOCUMENT:
 * - Year 1: ~4,000 TechMinutes target, 2 hubs, 4 Navigators
 * - Year 2: ~6,000 TechMinutes target, 4 hubs
 * - Cost/TechMinute: ~$31 (Y1) → ~$21 (Y2)
 * - 4 issue categories: Education, Workforce, Health, Housing
 * - SOM: 3,200 residents over 2-year pilot
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tbSoundEngine } from "../lib/TBSoundEngine";
import Footer from "../components/Footer";

const CDN = {
  successMoment:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/success-moment-hm2uPdPFHXpkuohVUwwfqe.webp",
  navigatorHelping:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-navigator-J3QgpVMcvM5w7siVQDejbC.webp",
  communityGathering:
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

function Counter({
  end,
  suffix = "",
  prefix = "",
}: {
  end: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / 2000, 1);
      setVal(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, end]);
  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
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

const SCENARIOS = [
  {
    name: "Maria",
    domain: "Education",
    duration: "18 min",
    issue:
      "Locked out of child's school portal. Password reset, bookmark setup, physical card backup.",
    outcome: "Resolved",
    emoji: "📚",
    color: "#00D4AA",
  },
  {
    name: "James",
    domain: "Workforce",
    duration: "35 min",
    issue:
      "VA job application timing out. Account creation, draft-save strategy, DD-214 upload, NCWorks referral.",
    outcome: "Partial — follow-up scheduled",
    emoji: "💼",
    color: "#E8B931",
  },
  {
    name: "Dorothy",
    domain: "Health",
    duration: "40 min",
    issue:
      "Needed telehealth but never used video calling. Apple ID reset, portal app install, first appointment.",
    outcome: "Resolved",
    emoji: "🏥",
    color: "#C4704B",
  },
  {
    name: "Carlos",
    domain: "Housing",
    duration: "22 min",
    issue:
      "Housing document upload failing. Phone scanner, file conversion, upload, screenshot confirmation.",
    outcome: "Resolved",
    emoji: "🏠",
    color: "#E8B931",
  },
  {
    name: "Keisha",
    domain: "Education",
    duration: "45 min",
    issue:
      "FAFSA verification stalled. Parent FSA ID creation, guided section completion, no data entry by Navigator.",
    outcome: "Resolved — check-in next session",
    emoji: "🎓",
    color: "#00D4AA",
  },
];

export default function Impact() {
  const [expandedScenario, setExpandedScenario] = useState<number | null>(null);

  return (
    <div style={{ background: "var(--tb-forest)", color: "var(--tb-cream)" }}>
      {/* HERO */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={CDN.successMoment}
            alt=""
            className="w-full h-full object-cover"
          />
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
              style={{ color: "#E8B931" }}
            >
              TechMinutes® Impact Framework
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] mb-6 max-w-4xl">
              Every minute <span className="text-glow-gold">measured</span>,
              <br />
              every connection <span className="text-glow-teal">counted</span>
            </h1>
            <p
              className="text-lg md:text-xl max-w-2xl"
              style={{ color: "rgba(253, 248, 240, 0.75)" }}
            >
              TechMinutes® is our proprietary impact measurement system. Every
              help session is logged with duration, issue category, resolution
              status, and follow-up needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* YEAR 1 & YEAR 2 PROJECTIONS */}
      <section
        className="py-24 md:py-36 relative overflow-hidden"
        style={{ background: "var(--tb-forest-mid)" }}
      >
        <CircuitBg opacity={0.05} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-4">
              <div
                className="holo-badge inline-block mb-6"
                style={{ color: "#E8B931" }}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block mr-2 animate-pulse"
                  style={{ background: "#E8B931" }}
                />
                SPAN-Verified Projections
              </div>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Reveal direction="left">
              <div className="glass-card p-8 h-full">
                <span className="text-xs font-mono tracking-widest uppercase text-glow-teal">
                  Year 1 Target
                </span>
                <h3
                  className="font-display text-2xl font-bold mt-2 mb-6"
                  style={{ color: "var(--tb-cream)" }}
                >
                  Foundation
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="stat-number text-4xl">
                      <Counter end={4000} prefix="~" />
                    </div>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "rgba(253, 248, 240, 0.5)" }}
                    >
                      TechMinutes® target
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div
                        className="font-display text-2xl font-bold"
                        style={{ color: "var(--tb-cream)" }}
                      >
                        2
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: "rgba(253, 248, 240, 0.45)" }}
                      >
                        Hub locations
                      </p>
                    </div>
                    <div>
                      <div
                        className="font-display text-2xl font-bold"
                        style={{ color: "var(--tb-cream)" }}
                      >
                        4
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: "rgba(253, 248, 240, 0.45)" }}
                      >
                        Paid Navigators
                      </p>
                    </div>
                  </div>
                  <div
                    className="pt-4"
                    style={{ borderTop: "1px solid rgba(232, 185, 49, 0.15)" }}
                  >
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "rgba(253, 248, 240, 0.5)" }}>
                        Cost per TechMinute
                      </span>
                      <span className="font-mono font-bold text-glow-gold">
                        ~$31
                      </span>
                    </div>
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "rgba(0, 212, 170, 0.5)" }}
                  >
                    Pilot sites: Durham County Library, Raleigh Digital Impact
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div
                className="glass-card p-8 h-full"
                style={{ borderColor: "rgba(232, 185, 49, 0.25)" }}
              >
                <span className="text-xs font-mono tracking-widest uppercase text-glow-gold">
                  Year 2 Target
                </span>
                <h3
                  className="font-display text-2xl font-bold mt-2 mb-6"
                  style={{ color: "var(--tb-cream)" }}
                >
                  Scale
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="stat-number text-4xl">
                      <Counter end={6000} prefix="~" />
                    </div>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "rgba(253, 248, 240, 0.5)" }}
                    >
                      TechMinutes® target
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div
                        className="font-display text-2xl font-bold"
                        style={{ color: "var(--tb-cream)" }}
                      >
                        4
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: "rgba(253, 248, 240, 0.45)" }}
                      >
                        Hub locations
                      </p>
                    </div>
                    <div>
                      <div
                        className="font-display text-2xl font-bold"
                        style={{ color: "var(--tb-cream)" }}
                      >
                        SOM
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: "rgba(253, 248, 240, 0.45)" }}
                      >
                        3,200 residents
                      </p>
                    </div>
                  </div>
                  <div
                    className="pt-4"
                    style={{ borderTop: "1px solid rgba(232, 185, 49, 0.15)" }}
                  >
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "rgba(253, 248, 240, 0.5)" }}>
                        Cost per TechMinute
                      </span>
                      <span className="font-mono font-bold text-glow-gold">
                        ~$21
                      </span>
                    </div>
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "rgba(0, 212, 170, 0.5)" }}
                  >
                    Expansion: Durham & Raleigh Housing Authorities, El Centro
                    Hispano
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <p
              className="text-center text-xs mt-8 italic"
              style={{ color: "rgba(253, 248, 240, 0.35)" }}
            >
              Source: SPAN Document §3 (The Load) & §9 (The Elevation) — $250K
              total investment over 2 years
            </p>
          </Reveal>
        </div>
      </section>

      {/* WHAT TECHMINUTES CAPTURES */}
      <section
        className="py-24 md:py-36 relative overflow-hidden"
        style={{ background: "var(--tb-forest)" }}
      >
        <CircuitBg opacity={0.04} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-gold">
                The Measurement
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                What Every TechMinute®{" "}
                <span className="text-glow-teal">Captures</span>
              </h2>
              <p
                className="text-base mt-3 max-w-xl mx-auto"
                style={{ color: "rgba(253, 248, 240, 0.55)" }}
              >
                Every session logged before the resident leaves. Non-PII.
                Auditable. Partner-ready.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              {
                label: "Duration",
                desc: "Exact minutes of each session",
                icon: "⏱️",
              },
              {
                label: "Category",
                desc: "Education, Workforce, Health, or Housing",
                icon: "📋",
              },
              {
                label: "Resolution",
                desc: "Resolved, partial, or follow-up needed",
                icon: "✅",
              },
              {
                label: "Hub Location",
                desc: "Which site served the community member",
                icon: "📍",
              },
              {
                label: "Issue Type",
                desc: "Specific problem addressed",
                icon: "🔍",
              },
              {
                label: "Follow-up",
                desc: "Whether additional support is needed",
                icon: "🔄",
              },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 0.08} direction="scale">
                <motion.div
                  className="glass-card p-5 h-full"
                  whileHover={{ y: -6 }}
                  onHoverStart={() => tbSoundEngine.play("pillar_hover")}
                >
                  <span className="text-xl block mb-2">{item.icon}</span>
                  <h4
                    className="font-display font-bold text-sm mb-1"
                    style={{ color: "var(--tb-cream)" }}
                  >
                    {item.label}
                  </h4>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(253, 248, 240, 0.5)" }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div
              className="max-w-2xl mx-auto mt-12 glass-card p-6 text-center"
              style={{ borderColor: "rgba(232, 185, 49, 0.2)" }}
            >
              <p
                className="text-sm italic"
                style={{ color: "rgba(253, 248, 240, 0.7)" }}
              >
                "Every interaction becomes a TechMinute®. No unmeasured work."
              </p>
              <p
                className="text-xs mt-2"
                style={{ color: "rgba(232, 185, 49, 0.45)" }}
              >
                — SPAN §1.4, Core Value #3
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOUR DOMAINS */}
      <section
        className="py-24 md:py-36 relative overflow-hidden"
        style={{ background: "var(--tb-forest-mid)" }}
      >
        <CircuitBg opacity={0.03} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">
                Issue Categories
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Four Domains of <span className="text-glow-gold">Need</span>
              </h2>
              <p
                className="text-base mt-3 max-w-xl mx-auto"
                style={{ color: "rgba(253, 248, 240, 0.55)" }}
              >
                Every TechMinute® maps to one of four domains aligned with UN
                Sustainable Development Goals.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Education",
                sdg: "SDG 4",
                icon: "📚",
                examples:
                  "School portals, FAFSA, online learning platforms, student account recovery",
                color: "#00D4AA",
                scenario: "Maria: 18 min — School portal access restored",
              },
              {
                name: "Workforce",
                sdg: "SDG 8",
                icon: "💼",
                examples:
                  "Job applications, resume uploads, hiring portals, VA benefits, NCWorks",
                color: "#E8B931",
                scenario: "James: 35 min — VA job application submitted",
              },
              {
                name: "Health",
                sdg: "SDG 3",
                icon: "🏥",
                examples:
                  "Telehealth setup, patient portals, prescription management, insurance",
                color: "#C4704B",
                scenario: "Dorothy: 40 min — First telehealth appointment made",
              },
              {
                name: "Housing",
                sdg: "SDG 1 & 10",
                icon: "🏠",
                examples:
                  "Rental applications, housing authority portals, utility assistance",
                color: "#E8B931",
                scenario: "Carlos: 22 min — Housing documents uploaded",
              },
            ].map((item, i) => (
              <Reveal
                key={item.name}
                direction={i % 2 === 0 ? "left" : "right"}
                delay={i * 0.1}
              >
                <motion.div
                  className="glass-card p-8 h-full group"
                  whileHover={{ y: -8 }}
                  onHoverStart={() => tbSoundEngine.play("pillar_hover")}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all duration-500 group-hover:scale-110"
                      style={{ background: `${item.color}15` }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h3
                        className="font-display text-xl font-bold"
                        style={{ color: "var(--tb-cream)" }}
                      >
                        {item.name}
                      </h3>
                      <span
                        className="text-xs font-mono"
                        style={{ color: item.color }}
                      >
                        {item.sdg}
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-sm mb-4"
                    style={{
                      color: "rgba(253, 248, 240, 0.6)",
                      lineHeight: "1.7",
                    }}
                  >
                    {item.examples}
                  </p>
                  <div
                    className="pt-3"
                    style={{ borderTop: "1px solid rgba(232, 185, 49, 0.1)" }}
                  >
                    <p
                      className="text-xs font-mono"
                      style={{ color: item.color }}
                    >
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
          <img
            src={CDN.navigatorHelping}
            alt="Digital Navigator helping community member"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(10,31,20,0.92), rgba(10,31,20,0.5))",
            }}
          />
        </div>
        <div className="container relative z-10">
          <Reveal direction="left">
            <div className="max-w-xl">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-gold">
                The Navigator Mindset
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                "You are not tech support. You are a{" "}
                <span className="text-glow-gold">bridge</span>."
              </h2>
              <p
                className="text-base mb-4 leading-relaxed"
                style={{ color: "rgba(253, 248, 240, 0.85)" }}
              >
                A school portal isn't a password reset — it's a parent
                reconnecting with their child's education. A job application
                isn't a form — it's a veteran rebuilding their career.
              </p>
              <p
                className="text-xs italic"
                style={{ color: "rgba(253, 248, 240, 0.4)" }}
              >
                — SPAN §5.1, Navigator Training
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* REAL SCENARIOS */}
      <section
        className="py-24 md:py-36 relative overflow-hidden"
        style={{ background: "var(--tb-forest)" }}
      >
        <CircuitBg opacity={0.04} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">
                From the SPAN Document §5.3
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Real Scenarios, Real{" "}
                <span className="text-glow-gold">Protocols</span>
              </h2>
              <p
                className="text-base mt-3 max-w-xl mx-auto"
                style={{ color: "rgba(253, 248, 240, 0.55)" }}
              >
                Click any scenario to see the full protocol.
              </p>
            </div>
          </Reveal>

          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            {SCENARIOS.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.08}>
                <motion.div
                  className="glass-card overflow-hidden cursor-pointer group"
                  whileHover={{ y: -4 }}
                  onClick={() => {
                    setExpandedScenario(expandedScenario === i ? null : i);
                    tbSoundEngine.play("story_reveal");
                  }}
                >
                  <div className="flex items-center gap-4 p-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all duration-500 group-hover:scale-110"
                      style={{ background: `${s.color}15` }}
                    >
                      {s.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="font-display text-base font-bold"
                          style={{ color: "var(--tb-cream)" }}
                        >
                          {s.name}
                        </span>
                        <span
                          className="text-xs font-mono px-2 py-0.5 rounded-full"
                          style={{ background: `${s.color}15`, color: s.color }}
                        >
                          {s.domain}
                        </span>
                      </div>
                      <p
                        className="text-sm mt-1 truncate"
                        style={{ color: "rgba(253, 248, 240, 0.5)" }}
                      >
                        {s.issue.split(".")[0]}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-display text-xl font-bold text-glow-gold">
                        {s.duration}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedScenario === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5">
                          <div
                            className="w-12 h-0.5 mb-4"
                            style={{
                              background: `linear-gradient(90deg, ${s.color}, transparent)`,
                            }}
                          />
                          <p
                            className="text-sm leading-relaxed mb-3"
                            style={{ color: "rgba(253, 248, 240, 0.7)" }}
                          >
                            {s.issue}
                          </p>
                          <span
                            className="text-xs font-mono px-2 py-1 rounded"
                            style={{
                              background: s.outcome.startsWith("Resolved")
                                ? "rgba(0, 212, 170, 0.1)"
                                : "rgba(232, 185, 49, 0.1)",
                              color: s.outcome.startsWith("Resolved")
                                ? "#00D4AA"
                                : "#E8B931",
                            }}
                          >
                            {s.outcome}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="px-5 pb-4 flex items-center gap-2">
                    <motion.svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      animate={{ rotate: expandedScenario === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke={s.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                    <span className="text-xs" style={{ color: s.color }}>
                      {expandedScenario === i ? "Close" : "Full protocol"}
                    </span>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7-STEP SESSION PROTOCOL */}
      <section
        className="py-24 md:py-36 relative overflow-hidden"
        style={{ background: "var(--tb-forest-mid)" }}
      >
        <CircuitBg opacity={0.05} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-gold">
                SPAN §5.2
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                The 7-Step Session{" "}
                <span className="text-glow-teal">Protocol</span>
              </h2>
              <p
                className="text-base mt-3 max-w-xl mx-auto"
                style={{ color: "rgba(253, 248, 240, 0.55)" }}
              >
                Every session follows the same protocol. Consistency is the
                product.
              </p>
            </div>
          </Reveal>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {[
                {
                  step: "1",
                  name: "Greet",
                  detail: "Welcome by name if returning",
                },
                { step: "2", name: "Listen", detail: "Full problem first" },
                { step: "3", name: "Assess", detail: "Quick fix or complex?" },
                {
                  step: "4",
                  name: "Guide",
                  detail: "On their device. Explain the why.",
                },
                {
                  step: "5",
                  name: "Confirm",
                  detail: '"Comfortable alone next time?"',
                },
                {
                  step: "6",
                  name: "Log",
                  detail: "TechMinutes® entry before they leave",
                },
                {
                  step: "7",
                  name: "Close",
                  detail: '"We\'re here every [day]."',
                },
              ].map((s, i) => (
                <Reveal key={s.step} delay={i * 0.06} direction="scale">
                  <motion.div
                    className="glass-card p-4 text-center h-full"
                    whileHover={{
                      y: -6,
                      boxShadow: "0 0 20px rgba(232, 185, 49, 0.15)",
                    }}
                  >
                    <div className="font-display text-2xl font-bold mb-1 text-glow-gold">
                      {s.step}
                    </div>
                    <div
                      className="font-display text-sm font-bold mb-1"
                      style={{ color: "var(--tb-cream)" }}
                    >
                      {s.name}
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: "rgba(253, 248, 240, 0.45)" }}
                    >
                      {s.detail}
                    </p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal>
            <div className="max-w-xl mx-auto mt-10 text-center">
              <p
                className="text-sm italic"
                style={{ color: "rgba(253, 248, 240, 0.55)" }}
              >
                "Comfortable doing this alone next time?" — the confirmation
                question every session ends with.
              </p>
              <p
                className="text-xs mt-2"
                style={{ color: "rgba(253, 248, 240, 0.3)" }}
              >
                — SPAN §5.2
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* COMMUNITY PHOTO BREAK */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={CDN.communityGathering}
            alt="Community gathering"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to left, rgba(10,31,20,0.92), rgba(10,31,20,0.5))",
            }}
          />
        </div>
        <div className="container relative z-10">
          <Reveal direction="right">
            <div className="max-w-xl ml-auto text-right">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                "First report ={" "}
                <span className="text-glow-gold">inflection</span>."
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "rgba(253, 248, 240, 0.85)" }}
              >
                Host sees data, becomes advocate. Funder sees data, writes
                check. The TechMinutes® report is the moment everything changes.
              </p>
              <p
                className="text-xs mt-4 italic"
                style={{ color: "rgba(253, 248, 240, 0.4)" }}
              >
                — SPAN §9.7
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY TECHMINUTES MATTERS */}
      <section
        className="py-24 md:py-36 relative overflow-hidden"
        style={{ background: "var(--tb-forest)" }}
      >
        <CircuitBg opacity={0.04} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Why TechMinutes® <span className="text-glow-gold">Matters</span>
              </h2>
            </div>
          </Reveal>

          <div className="max-w-3xl mx-auto">
            <Reveal>
              <div className="glass-card p-8 md:p-10">
                <div className="space-y-6">
                  {[
                    {
                      icon: "📊",
                      title: "Proprietary Measurement",
                      desc: "No other RDU program combines paid staff, consistent schedule, 24/7 AI, and proprietary measurement in a single zero-cost offering.",
                      source: "— SPAN §9.6",
                    },
                    {
                      icon: "🔒",
                      title: "Privacy by Design",
                      desc: "No PII. No credential access. We guide; we don't control. Every report is auditable without exposing personal information.",
                      source: "— SPAN §1.4, Core Value #6",
                    },
                    {
                      icon: "🤖",
                      title: "H.K. AI Continuity",
                      desc: "Between visits, H.K. provides 24/7 step-by-step guidance. Complex cases are flagged for human follow-up at the next session.",
                      source: "",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "rgba(232, 185, 49, 0.08)" }}
                      >
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div>
                        <h3
                          className="font-display font-bold mb-1"
                          style={{ color: "var(--tb-cream)" }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-sm"
                          style={{
                            color: "rgba(253, 248, 240, 0.6)",
                            lineHeight: 1.7,
                          }}
                        >
                          {item.desc}
                        </p>
                        {item.source && (
                          <p
                            className="text-xs mt-1 italic"
                            style={{ color: "rgba(232, 185, 49, 0.4)" }}
                          >
                            {item.source}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: "var(--tb-forest-mid)" }}
      >
        <CircuitBg opacity={0.06} />
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                See the data for{" "}
                <span className="text-glow-gold">yourself</span>.
              </h2>
              <p
                className="text-base mb-8"
                style={{ color: "rgba(253, 248, 240, 0.6)" }}
              >
                Explore our simulated dashboard to see how TechMinutes® data
                looks in practice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/dashboard"
                  className="tb-btn tb-btn-primary !px-8 !py-4 !text-base justify-center"
                  onClick={() => tbSoundEngine.play("nav_click")}
                >
                  View Dashboard
                </a>
                <a
                  href="/host-a-hub"
                  className="tb-btn tb-btn-ghost !px-8 !py-4 !text-base justify-center"
                  onClick={() => tbSoundEngine.play("nav_click")}
                >
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
