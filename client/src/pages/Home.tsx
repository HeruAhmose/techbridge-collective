/**
 * TechBridge Collective — Home / Landing Page
 * FULLY INTERACTIVE — every card, tile, and button does something meaningful
 *
 * Pillar cards: click to expand details
 * Story cards: click to expand full scenario
 * H.K. preview buttons: open the real H.K. chat bubble
 * Value cards: click to expand quote
 * Hub cards: click entire card to open map
 * Stat cards: click to navigate to dashboard
 * SPAN sections: accordion expand/collapse
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { tbSoundEngine } from "../lib/TBSoundEngine";
import Footer from "../components/Footer";

const CDN = {
  bridgeHero:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/bridge-hero-3L5v75UNyLV5wZc3BXy2gE.webp",
  communityHub:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-hub-Q9JLQXRqmAttfmjNjBXFon.webp",
  hkAvatar:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/HK_avatar_1024_6c459caf.jpg",
  horaceKing:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/horace-king-tribute-WrUcXchvoiExwCufr5cq2T.webp",
  spanJourney:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/span-journey-fgm8ge9JC6YczpG5dzHFSm.webp",
  navigatorHelping:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-navigator-J3QgpVMcvM5w7siVQDejbC.webp",
  communityGathering:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-gathering-7tsUyPrugQMATVzsJ7YZx2.webp",
  handsGuiding:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/navigator-session-7Fy7vkxQXuw2y8AmS6RLxZ.webp",
  hubExterior:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/hub-exterior-Dp9FtPxyv99F7AzXgr44Ue.webp",
  successMoment:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/success-moment-hm2uPdPFHXpkuohVUwwfqe.webp",
};

/* ============================================
   UTILITY: Scroll-triggered reveal
   ============================================ */
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
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const variants: Record<string, any> = {
    up: { hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    left: { hidden: { x: -50, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    right: { hidden: { x: 50, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    scale: {
      hidden: { scale: 0.9, opacity: 0 },
      visible: { scale: 1, opacity: 1 },
    },
  };
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   ANIMATED COUNTER
   ============================================ */
function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
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
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target]);
  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ============================================
   HERO PARTICLE CANVAS
   ============================================ */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId = 0;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      decay: number;
      color: string;
    }> = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const colors = [
      "rgba(232, 185, 49,",
      "rgba(0, 212, 170,",
      "rgba(253, 248, 240,",
    ];
    const addParticle = () => {
      if (particles.length > 80) return;
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.4 - Math.random() * 1.0,
        size: 1 + Math.random() * 2.5,
        alpha: 0.3 + Math.random() * 0.5,
        decay: 0.002 + Math.random() * 0.003,
        color,
      });
    };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.2) addParticle();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha * 0.15})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

/* ============================================
   DATA
   ============================================ */
const PILLARS = [
  {
    num: "01",
    title: "Weekly Help Desk",
    desc: "Walk-in and scheduled 1:1 sessions with paid Digital Navigators. 4–8 hours per week at your community site.",
    quote: '"Consistency is the product." — SPAN §1.6',
    details: [
      "No appointments needed — walk in anytime during hub hours",
      "Paid Navigators ($20/hr) trained in the 7-step session protocol",
      "Covers: email, job apps, school portals, telehealth, housing forms",
      "Every session logged as TechMinutes® for impact measurement",
    ],
    link: "/get-help",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="24" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    color: "gold" as const,
  },
  {
    num: "02",
    title: "H.K. AI Triage",
    desc: "Named for Horace King, master bridge builder. 24/7 step-by-step guidance between visits.",
    quote:
      '"H.K. is not a chatbot. It is a deterministic triage state machine." — SPAN §6.2',
    details: [
      "Routes you to the right portal and walks through each step",
      "Never guesses, never asks for credentials or passwords",
      "Escalates to a human Navigator when needed",
      "Powered by Anthropic Claude with TechBridge safety guardrails",
    ],
    link: "/get-help",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M4 22 Q16 8 28 22"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <line
          x1="4"
          y1="22"
          x2="28"
          y2="22"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="16"
          y1="22"
          x2="16"
          y2="12"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="16"
          cy="9"
          r="3"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    ),
    color: "teal" as const,
  },
  {
    num: "03",
    title: "TechMinutes® Reporting",
    desc: "Monthly non-PII impact reports: minutes served, issue categories, resolution rates.",
    quote:
      '"Every interaction becomes a TechMinute®. No unmeasured work." — SPAN §1.4',
    details: [
      "Proprietary measurement unit — no other program has this",
      "Data your funders actually want: categories, resolution rates, trends",
      "Zero PII collected — privacy by design",
      "Monthly reports auto-generated for each hub partner",
    ],
    link: "/impact",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect
          x="4"
          y="4"
          width="24"
          height="24"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <line
          x1="10"
          y1="22"
          x2="10"
          y2="14"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="16"
          y1="22"
          x2="16"
          y2="10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="22"
          y1="22"
          x2="22"
          y2="16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    color: "gold" as const,
  },
];

const HUBS = [
  {
    name: "Durham County Library",
    address: "Durham, NC",
    days: "Schedule TBD · 4–8 hrs/wk",
    status: "Pilot Target — Year 1",
    mapUrl: "https://maps.google.com/?q=Durham+County+Library+Durham+NC",
  },
  {
    name: "Raleigh Digital Impact Center",
    address: "Raleigh, NC",
    days: "Schedule TBD · 4–8 hrs/wk",
    status: "Pilot Target — Year 1",
    mapUrl:
      "https://maps.google.com/?q=Raleigh+Digital+Impact+Center+Raleigh+NC",
  },
];

const YEAR2_HUBS = [
  "Durham Housing Authority",
  "Raleigh Housing Authority",
  "El Centro Hispano",
];

const SPAN_SECTIONS = [
  {
    num: "1",
    name: "The Crossing",
    subtitle: "Identity & Values",
    focus: "Who we are, what we believe, and how we show up.",
    deep: [
      'Consistency over Novelty — "We show up. Every week."',
      'Human-First Technology — "H.K. triages; humans deliver."',
      'Measured Impact — "Every interaction becomes a TechMinute®."',
      'Low-Lift Partnerships — "Host provides space. TechBridge provides everything else."',
      'Paid Navigators — "No volunteers. Paid staff."',
      'Privacy by Design — "No PII. No credential access."',
    ],
    quote:
      '"Because the best technology doesn\'t matter if no one shows you how to use it." — §1.5',
  },
  {
    num: "2",
    name: "The Structure",
    subtitle: "The Three-Pillar Model",
    focus: "Weekly Help Desk + H.K. AI Triage + TechMinutes® Reporting.",
    deep: [
      "Three pillars delivered at every hub",
      "Host provides: space, Wi-Fi, promotion",
      "TechBridge provides: Navigators, H.K. AI, reporting, all tech",
      "60-day launch timeline from agreement to first session",
      "Zero cost to the host site",
    ],
    quote:
      '"No other RDU program combines paid staff, consistent schedule, 24/7 AI, and proprietary measurement." — §9.6',
  },
  {
    num: "3",
    name: "The Load",
    subtitle: "Budget & Unit Economics",
    focus: "$250K total investment over 2 years.",
    deep: [
      "Year 1: 2 hubs, 4 Navigators, ~4,000 TechMinutes®",
      "Year 2: 4 hubs, ~6,000 TechMinutes®",
      "Cost per TechMinute: ~$31 (Y1) → ~$21 (Y2)",
      "Navigator compensation: $20/hr",
      "Budget split: 55% payroll, 45% operations",
    ],
    quote:
      '"Lean Mode is survivable. The first TechMinutes® report is the inflection." — §8.2',
  },
  {
    num: "4",
    name: "The Approach",
    subtitle: "Outreach & Partnerships",
    focus: "How we find and onboard community partners.",
    deep: [
      "Target: libraries, housing authorities, community centers",
      "Structured email sequences with specific subject lines",
      "Value proposition: zero-cost, fully-staffed digital help desk",
      "Decision-maker mapping at each organization",
      "Persistent but respectful, data-driven pitch",
    ],
    quote: '"First report = inflection. Host sees data → advocate." — §9.7',
  },
  {
    num: "5",
    name: "The Cables",
    subtitle: "Navigator Training",
    focus: "The 7-step session protocol and Navigator mindset.",
    deep: [
      "7-Step: Greet → Listen → Assess → Guide → Confirm → Log → Close",
      '"You are not tech support. You are a bridge."',
      "\"A school portal isn't a password reset — it's a parent reconnecting.\"",
      "Escalation: Crisis → 988 | Legal → NC Legal Aid | Medical → 911",
      "Credentials: Never touch. Walk them through it on their device.",
    ],
    quote:
      '"Comfortable doing this alone next time?" — the confirmation question',
  },
  {
    num: "6",
    name: "The Deck",
    subtitle: "Production Tech Stack",
    focus: "Next.js, Neon PostgreSQL, Clerk auth, Anthropic Claude for H.K.",
    deep: [
      "Frontend: Next.js on Vercel | Database: Neon PostgreSQL 16",
      "Auth: Clerk | AI: Anthropic Claude",
      "Vector Store: ChromaDB → Qdrant (RAG pipeline)",
      "Multi-Tenant SaaS with row-level security",
      "Post-quantum TLS — X25519 + ML-KEM-768",
    ],
    quote:
      '"H.K. is not a chatbot. It is a deterministic triage state machine." — §6.2',
  },
  {
    num: "7",
    name: "The Abutments",
    subtitle: "Funding & Growth",
    focus: "Grant targets from NTIA, DOL, Cisco, Google.org.",
    deep: [
      "NTIA Digital Equity: $500K–$3M+ (HIGH)",
      "DOL WORC: $500K–$2.5M (HIGH)",
      "Cisco Impact: $250K–$1M+ (HIGH)",
      "Google.org: $100K–$1.5M (HIGH)",
      "NC IDEA: $50K–$150K (HIGH)",
    ],
    quote:
      '"The first TechMinutes® report is the inflection." — data unlocks funding',
  },
  {
    num: "8",
    name: "The Foundation",
    subtitle: "Risk Management",
    focus: "What-if scenarios, lean mode, contingency planning.",
    deep: [
      "Hub drops out? → Redirect Navigator hours",
      "Funding stalls? → Lean Mode: 2 Navigators, 1 hub",
      "H.K. goes down? → Paper protocols",
      "Navigator leaves? → Cross-training, no single point of failure",
    ],
    quote: '"Lean Mode is survivable." — §8.2',
  },
  {
    num: "9",
    name: "The Elevation",
    subtitle: "Market & Impact",
    focus: "1.2M NC residents lack digital access.",
    deep: [
      "TAM: 225,000 — Wake + Durham adults lacking digital skills",
      "SAM: 90,000 — likely to seek help at a community location",
      "SOM: 3,200 — two-year pilot capacity across 4 hubs",
      "Four domains: Education, Workforce, Health, Housing",
      "TechMinutes®: proprietary measurement — no other program has this",
    ],
    quote:
      '"No other RDU program combines paid staff, consistent schedule, 24/7 AI, and proprietary measurement." — §9.6',
  },
];

const STORIES = [
  {
    name: "Maria",
    domain: "Education",
    time: "18 min",
    issue:
      "School portal password reset, bookmark setup, physical backup card created.",
    fullStory:
      "Maria came in unable to check her child's grades. The Navigator walked her through resetting her school portal password, bookmarked the site on her phone, and created a physical backup card with her login info. She left confident she could do it herself next time.",
    outcome: "Resolved",
    emoji: "📚",
  },
  {
    name: "James",
    domain: "Workforce",
    time: "35 min",
    issue:
      "VA job application: account creation, draft-save strategy, DD-214 upload.",
    fullStory:
      "James, a veteran, needed help applying for a VA job. The Navigator helped him create an account, showed him how to draft-save his application, upload his DD-214, and referred him to NCWorks for additional support. A follow-up session was scheduled to complete the application.",
    outcome: "Partial — follow-up scheduled",
    emoji: "💼",
  },
  {
    name: "Dorothy",
    domain: "Health",
    time: "40 min",
    issue:
      "Apple ID reset, health portal app install, first telehealth appointment booked.",
    fullStory:
      "Dorothy needed to set up telehealth. The Navigator helped reset her Apple ID, installed the health portal app, created her account, and booked her first telehealth appointment. 40 minutes that changed her access to healthcare.",
    outcome: "Resolved",
    emoji: "🏥",
  },
  {
    name: "Carlos",
    domain: "Housing",
    time: "22 min",
    issue:
      "Phone document scanner setup, housing application upload, screenshot confirmation.",
    fullStory:
      "Carlos needed to upload documents for a housing application. The Navigator set up a document scanner on his phone, helped him upload the documents, and took a screenshot of the confirmation page as proof of submission.",
    outcome: "Resolved",
    emoji: "🏠",
  },
  {
    name: "Keisha",
    domain: "Education",
    time: "45 min",
    issue: "FAFSA: Parent FSA ID creation, guided through each section.",
    fullStory:
      "Keisha's parent needed help with FAFSA. The Navigator created a Parent FSA ID, guided them through every section without entering any data themselves, and scheduled a check-in to ensure the application was submitted successfully.",
    outcome: "Resolved",
    emoji: "🎓",
  },
];

const CORE_VALUES = [
  {
    title: "Consistency over Novelty",
    desc: "We show up. Every week. Same time, same place.",
    expanded:
      "Consistency is the product. Communities trust what they can count on. We don't chase trends — we build habits.",
    icon: "🔄",
  },
  {
    title: "Human-First Technology",
    desc: "H.K. triages; humans deliver.",
    expanded:
      "Tech extends reach, never replaces relationships. The Navigator is the bridge — H.K. is the cable that holds it together between visits.",
    icon: "🤝",
  },
  {
    title: "Measured Impact",
    desc: "Every interaction becomes a TechMinute®.",
    expanded:
      "No unmeasured work. TechMinutes® give funders the data they need and communities the proof they deserve.",
    icon: "📊",
  },
  {
    title: "Low-Lift Partnerships",
    desc: "Host provides space. TechBridge provides everything else.",
    expanded:
      "Zero cost to the host. We bring trained staff, technology, reporting, and infrastructure. You bring the community.",
    icon: "🏢",
  },
  {
    title: "Paid Navigators",
    desc: "No volunteers. Paid staff show up, stay trained, don't churn.",
    expanded:
      "$20/hr ensures quality, retention, and professionalism. Volunteers burn out. Paid staff build careers.",
    icon: "💰",
  },
  {
    title: "Privacy by Design",
    desc: "No PII. No credential access. We guide; we don't control.",
    expanded:
      "We never touch their device unsupervised. We never ask for passwords. We walk them through it — on their screen, at their pace.",
    icon: "🔒",
  },
];

/* ============================================
   MAIN HOME COMPONENT
   ============================================ */
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [expandedSpan, setExpandedSpan] = useState<string | null>(null);
  const [expandedPillar, setExpandedPillar] = useState<number | null>(null);
  const [expandedStory, setExpandedStory] = useState<number | null>(null);
  const [expandedValue, setExpandedValue] = useState<number | null>(null);
  const [, navigate] = useLocation();

  const initSound = useCallback(() => {
    tbSoundEngine.init();
  }, []);

  // Function to open H.K. chat bubble
  const openHKChat = useCallback(() => {
    // Find and click the H.K. chat bubble button
    const hkButton = document.querySelector(
      'button[aria-label="Ask H.K. AI"]'
    ) as HTMLButtonElement;
    if (hkButton) {
      hkButton.click();
      tbSoundEngine.play("nav_click");
    }
  }, []);

  return (
    <div onClick={initSound} style={{ background: "var(--tb-forest)" }}>
      {/* ============================================
          HERO
          ============================================ */}
      <section
        ref={heroRef}
        className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden"
      >
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src={CDN.bridgeHero}
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(10, 31, 20, 0.85) 0%, rgba(10, 31, 20, 0.7) 40%, rgba(10, 31, 20, 0.92) 100%)",
            }}
          />
        </motion.div>
        <ParticleCanvas />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.06,
            backgroundImage:
              "linear-gradient(rgba(0, 212, 170, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 170, 0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          className="container relative z-10 py-32"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="holo-badge inline-block mb-6 text-xs font-mono tracking-widest uppercase"
              style={{ color: "var(--tb-teal)" }}
            >
              TechBridge Collective
            </div>
            <h1
              className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] max-w-4xl"
              style={{ color: "var(--tb-cream)" }}
            >
              Building bridges of <span className="text-glow-gold">access</span>
              , <span className="text-glow-teal">dignity</span>, and{" "}
              <span className="text-glow-gold">opportunity</span>
            </h1>
            <p
              className="text-base md:text-lg mt-6 max-w-2xl leading-relaxed"
              style={{ color: "rgba(253, 248, 240, 0.7)" }}
            >
              Free, human-centered digital help at community sites across the
              Triangle. Walk in. Get help. Cross the bridge.
            </p>
            <p
              className="text-sm mt-3 italic"
              style={{ color: "rgba(0, 212, 170, 0.5)" }}
            >
              "Because the best technology in the world doesn't matter if no one
              shows you how to use it."
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/get-help">
              <span
                className="tb-btn tb-btn-primary cursor-pointer"
                onClick={() => tbSoundEngine.play("nav_click")}
              >
                Get Help Now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14m-7-7l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
            <Link href="/host-a-hub">
              <span
                className="tb-btn tb-btn-secondary cursor-pointer"
                onClick={() => tbSoundEngine.play("nav_click")}
              >
                Host a Hub
              </span>
            </Link>
            <Link href="/about">
              <span
                className="tb-btn tb-btn-ghost cursor-pointer"
                onClick={() => tbSoundEngine.play("nav_click")}
              >
                Our Story
              </span>
            </Link>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <p
              className="text-xs font-mono"
              style={{ color: "rgba(0, 212, 170, 0.4)" }}
            >
              Scroll to explore
            </p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14m-7-7l7 7 7-7"
                  stroke="rgba(0, 212, 170, 0.4)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================
          DIGITAL DIVIDE STATS
          ============================================ */}
      <section
        className="py-20 md:py-28 relative overflow-hidden"
        style={{ background: "var(--tb-forest)" }}
      >
        <div
          className="section-divider-glow"
          style={{ position: "absolute", top: 0 }}
        />
        <div className="container relative z-10">
          <Reveal>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm font-mono tracking-widest uppercase mb-6 text-glow-teal">
                The Digital Divide
              </p>
              <h2
                className="font-display text-4xl md:text-6xl font-bold mb-6"
                style={{ color: "var(--tb-cream)" }}
              >
                <span className="stat-number" style={{ fontSize: "inherit" }}>
                  <AnimatedCounter target={1200000} />
                </span>{" "}
                <span className="text-glow-gold">North Carolinians</span>
              </h2>
              <p
                className="text-xl md:text-2xl font-display mb-8"
                style={{ color: "rgba(253, 248, 240, 0.8)" }}
              >
                lack adequate digital access.
              </p>
              <p
                className="text-base leading-relaxed max-w-2xl mx-auto"
                style={{ color: "rgba(253, 248, 240, 0.5)" }}
              >
                That's parents who can't access their child's school portal.
                Veterans who can't complete a job application. Seniors who can't
                set up telehealth.
              </p>
              <p
                className="text-xs font-mono mt-6"
                style={{ color: "rgba(0, 212, 170, 0.3)" }}
              >
                Source: SPAN Document §9.1 — Market Analysis
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          THREE PILLARS — CLICKABLE EXPAND
          ============================================ */}
      <section
        className="py-24 md:py-32 relative"
        style={{ background: "var(--tb-forest-mid)" }}
      >
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">
                The Model
              </p>
              <h2
                className="font-display text-3xl md:text-5xl font-bold"
                style={{ color: "var(--tb-cream)" }}
              >
                Three pillars.{" "}
                <span className="text-glow-gold">One bridge.</span>
              </h2>
              <p
                className="text-base mt-4 max-w-2xl mx-auto"
                style={{ color: "rgba(253, 248, 240, 0.5)" }}
              >
                Click any pillar to learn more.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PILLARS.map((pillar, i) => {
              const isExpanded = expandedPillar === i;
              return (
                <Reveal key={pillar.num} delay={i * 0.12}>
                  <motion.div
                    className="glass-card p-8 cursor-pointer relative overflow-hidden"
                    style={{
                      borderColor: isExpanded
                        ? pillar.color === "teal"
                          ? "rgba(0, 212, 170, 0.5)"
                          : "rgba(232, 185, 49, 0.5)"
                        : undefined,
                      boxShadow: isExpanded
                        ? pillar.color === "teal"
                          ? "var(--glow-teal)"
                          : "var(--glow-gold)"
                        : undefined,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setExpandedPillar(isExpanded ? null : i);
                      tbSoundEngine.play(
                        isExpanded ? "story_close" : "story_reveal"
                      );
                    }}
                  >
                    {/* Large faded number */}
                    <div
                      className="font-display text-8xl font-bold absolute -top-2 -right-2 select-none pointer-events-none"
                      style={{
                        color:
                          pillar.color === "teal"
                            ? "var(--tb-teal)"
                            : "var(--tb-gold)",
                        opacity: 0.06,
                      }}
                    >
                      {pillar.num}
                    </div>

                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 relative z-10 transition-all duration-400"
                      style={{
                        background:
                          pillar.color === "teal"
                            ? "rgba(0, 212, 170, 0.1)"
                            : "rgba(232, 185, 49, 0.1)",
                        color:
                          pillar.color === "teal"
                            ? "var(--tb-teal)"
                            : "var(--tb-gold)",
                        border: `1px solid ${pillar.color === "teal" ? "rgba(0, 212, 170, 0.2)" : "rgba(232, 185, 49, 0.2)"}`,
                        boxShadow: isExpanded
                          ? pillar.color === "teal"
                            ? "var(--glow-teal)"
                            : "var(--glow-gold)"
                          : "none",
                      }}
                    >
                      {pillar.icon}
                    </div>

                    <h3
                      className={`font-display text-xl font-bold mb-3 relative z-10 ${pillar.color === "teal" ? "text-glow-teal" : "text-glow-gold"}`}
                    >
                      {pillar.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed mb-3 relative z-10"
                      style={{ color: "rgba(253, 248, 240, 0.6)" }}
                    >
                      {pillar.desc}
                    </p>

                    {/* Expand indicator */}
                    <div
                      className="flex items-center gap-2 text-xs font-mono relative z-10 mt-2"
                      style={{
                        color:
                          pillar.color === "teal"
                            ? "rgba(0, 212, 170, 0.5)"
                            : "rgba(232, 185, 49, 0.5)",
                      }}
                    >
                      <motion.svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                      {isExpanded ? "Click to collapse" : "Click to expand"}
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div
                            className="mt-4 pt-4 relative z-10"
                            style={{
                              borderTop: `1px solid ${pillar.color === "teal" ? "rgba(0, 212, 170, 0.2)" : "rgba(232, 185, 49, 0.2)"}`,
                            }}
                          >
                            <ul className="space-y-2 mb-4">
                              {pillar.details.map((detail, j) => (
                                <motion.li
                                  key={j}
                                  className="text-sm flex items-start gap-2"
                                  style={{ color: "rgba(253, 248, 240, 0.7)" }}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: j * 0.08 }}
                                >
                                  <span
                                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{
                                      background:
                                        pillar.color === "teal"
                                          ? "var(--tb-teal)"
                                          : "var(--tb-gold)",
                                      boxShadow: `0 0 6px ${pillar.color === "teal" ? "rgba(0, 212, 170, 0.5)" : "rgba(232, 185, 49, 0.5)"}`,
                                    }}
                                  />
                                  <span>{detail}</span>
                                </motion.li>
                              ))}
                            </ul>
                            <p
                              className="text-xs italic mb-3"
                              style={{
                                color:
                                  pillar.color === "teal"
                                    ? "rgba(0, 212, 170, 0.5)"
                                    : "rgba(232, 185, 49, 0.5)",
                              }}
                            >
                              {pillar.quote}
                            </p>
                            <Link href={pillar.link}>
                              <span
                                className="inline-flex items-center gap-2 text-sm font-display font-bold cursor-pointer transition-all hover:gap-3"
                                style={{
                                  color:
                                    pillar.color === "teal"
                                      ? "var(--tb-teal)"
                                      : "var(--tb-gold)",
                                }}
                                onClick={e => {
                                  e.stopPropagation();
                                  tbSoundEngine.play("nav_click");
                                }}
                              >
                                Learn more
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M5 12h14m-7-7l7 7-7 7"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          NAVIGATOR MINDSET — Full-width Photo
          ============================================ */}
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
                "linear-gradient(to right, rgba(10, 31, 20, 0.92), rgba(10, 31, 20, 0.6))",
            }}
          />
        </div>
        <div className="container relative z-10">
          <Reveal direction="left">
            <div className="max-w-xl">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">
                The Navigator Mindset
              </p>
              <h2
                className="font-display text-3xl md:text-4xl font-bold mb-6"
                style={{ color: "var(--tb-cream)" }}
              >
                "You are not tech support.{" "}
                <span className="text-glow-gold">You are a bridge.</span>"
              </h2>
              <p
                className="text-base mb-4 leading-relaxed"
                style={{ color: "rgba(253, 248, 240, 0.8)" }}
              >
                A school portal isn't a password reset — it's a parent
                reconnecting with their child's education. A job application
                isn't a form — it's a veteran rebuilding their career.
              </p>
              <p
                className="text-sm italic"
                style={{ color: "rgba(0, 212, 170, 0.5)" }}
              >
                — SPAN Document §5.1: Navigator Training
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          CORE VALUES — CLICKABLE EXPAND
          ============================================ */}
      <section
        className="py-24 md:py-32"
        style={{ background: "var(--tb-forest)" }}
      >
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">
                Our DNA
              </p>
              <h2
                className="font-display text-3xl md:text-5xl font-bold"
                style={{ color: "var(--tb-cream)" }}
              >
                Six values.{" "}
                <span className="text-glow-gold">Non-negotiable.</span>
              </h2>
              <p
                className="text-sm mt-3"
                style={{ color: "rgba(253, 248, 240, 0.4)" }}
              >
                Click any value to learn more.
              </p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {CORE_VALUES.map((val, i) => {
              const isExpanded = expandedValue === i;
              return (
                <Reveal key={val.title} delay={i * 0.08}>
                  <motion.div
                    className="glass-card p-6 cursor-pointer h-full"
                    style={{
                      borderColor: isExpanded
                        ? "rgba(232, 185, 49, 0.4)"
                        : undefined,
                      boxShadow: isExpanded ? "var(--glow-gold)" : undefined,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setExpandedValue(isExpanded ? null : i);
                      tbSoundEngine.play(
                        isExpanded ? "story_close" : "story_reveal"
                      );
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3 relative z-10">
                      <span className="text-2xl">{val.icon}</span>
                      <h3 className="font-display text-base font-bold text-glow-gold">
                        {val.title}
                      </h3>
                    </div>
                    <p
                      className="text-sm leading-relaxed italic relative z-10"
                      style={{ color: "rgba(253, 248, 240, 0.6)" }}
                    >
                      "{val.desc}"
                    </p>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p
                            className="text-sm mt-4 pt-4 leading-relaxed relative z-10"
                            style={{
                              color: "rgba(253, 248, 240, 0.8)",
                              borderTop: "1px solid rgba(232, 185, 49, 0.15)",
                            }}
                          >
                            {val.expanded}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          HUB SCHEDULE — CLICKABLE CARDS
          ============================================ */}
      <section
        className="py-24 md:py-32"
        style={{ background: "var(--tb-forest-mid)" }}
      >
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">
                Hub Network
              </p>
              <h2
                className="font-display text-3xl md:text-4xl font-bold"
                style={{ color: "var(--tb-cream)" }}
              >
                Where we're <span className="text-glow-gold">building</span>
              </h2>
              <p
                className="text-sm mt-3"
                style={{ color: "rgba(253, 248, 240, 0.4)" }}
              >
                Click a hub to view on Google Maps.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {HUBS.map((hub, i) => (
              <Reveal key={hub.name} delay={i * 0.15}>
                <a
                  href={hub.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <motion.div
                    className="glass-card overflow-hidden group cursor-pointer"
                    whileHover={{
                      scale: 1.02,
                      borderColor: "rgba(0, 212, 170, 0.4)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => tbSoundEngine.play("nav_click")}
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={i === 0 ? CDN.hubExterior : CDN.communityGathering}
                        alt={hub.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to bottom, transparent, rgba(10, 31, 20, 0.8))",
                        }}
                      />
                      <div
                        className="absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-2"
                        style={{
                          background: "rgba(10, 31, 20, 0.8)",
                          color: "var(--tb-teal)",
                          border: "1px solid rgba(0, 212, 170, 0.3)",
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 12h14m-7-7l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Open in Maps
                      </div>
                    </div>
                    <div className="p-6 relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            background: "var(--tb-teal)",
                            boxShadow: "var(--glow-teal)",
                            animation: "tealPulse 2s ease-in-out infinite",
                          }}
                        />
                        <span className="text-xs font-mono uppercase tracking-wider text-glow-teal">
                          {hub.status}
                        </span>
                      </div>
                      <h3
                        className="font-display text-lg font-bold mb-2"
                        style={{ color: "var(--tb-cream)" }}
                      >
                        {hub.name}
                      </h3>
                      <p
                        className="text-sm mb-1"
                        style={{ color: "rgba(253, 248, 240, 0.5)" }}
                      >
                        {hub.address}
                      </p>
                      <p
                        className="text-sm font-mono"
                        style={{ color: "var(--tb-sage)" }}
                      >
                        {hub.days}
                      </p>
                    </div>
                  </motion.div>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="max-w-4xl mx-auto mt-12">
              <div className="glass-card p-6">
                <p className="text-sm font-mono tracking-widest uppercase mb-3 text-glow-teal relative z-10">
                  Year 2 Expansion Targets
                </p>
                <div className="flex flex-wrap gap-3 relative z-10">
                  {YEAR2_HUBS.map(h => (
                    <motion.span
                      key={h}
                      className="px-4 py-2 rounded-lg text-sm font-mono cursor-default"
                      style={{
                        background: "rgba(0, 212, 170, 0.08)",
                        color: "var(--tb-teal)",
                        border: "1px solid rgba(0, 212, 170, 0.2)",
                      }}
                      whileHover={{
                        scale: 1.05,
                        borderColor: "rgba(0, 212, 170, 0.5)",
                        boxShadow: "0 0 15px rgba(0, 212, 170, 0.2)",
                      }}
                    >
                      {h}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          H.K. AI PREVIEW — Quick-starts open real chat
          ============================================ */}
      <section
        className="py-24 md:py-32"
        style={{ background: "var(--tb-forest)" }}
      >
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <Reveal direction="left">
              <div>
                <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">
                  Meet H.K.
                </p>
                <h2
                  className="font-display text-3xl md:text-4xl font-bold mb-6"
                  style={{ color: "var(--tb-cream)" }}
                >
                  Your <span className="text-glow-gold">24/7</span> bridge
                  between visits
                </h2>
                <p
                  className="text-base mb-4 leading-relaxed"
                  style={{ color: "rgba(253, 248, 240, 0.7)" }}
                >
                  Named for{" "}
                  <strong className="text-glow-gold">Horace King</strong>, the
                  enslaved master bridge builder who connected communities
                  across the American South.
                </p>
                <p
                  className="text-base mb-6 leading-relaxed"
                  style={{ color: "rgba(253, 248, 240, 0.5)" }}
                >
                  H.K. never guesses. Never asks for credentials. Routes you to
                  the right portal, walks you through each step, and escalates
                  to a human Navigator when needed.
                </p>
                <div className="glass-card p-4 mb-6">
                  <p
                    className="text-sm italic relative z-10"
                    style={{ color: "rgba(253, 248, 240, 0.6)" }}
                  >
                    "H.K. is not a chatbot. It is a deterministic triage state
                    machine augmented by generative AI."
                  </p>
                  <p
                    className="text-xs font-mono mt-2 relative z-10"
                    style={{ color: "rgba(0, 212, 170, 0.4)" }}
                  >
                    {"—"} SPAN §6.2
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Step-by-step guidance",
                    "Portal navigation",
                    "Smart escalation",
                    "24/7 availability",
                  ].map(feat => (
                    <span
                      key={feat}
                      className="holo-badge"
                      style={{ color: "var(--tb-teal)" }}
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal direction="right">
              <div className="relative">
                <div
                  className="glass-card overflow-hidden"
                  style={{
                    boxShadow:
                      "var(--glow-gold), 0 20px 60px rgba(0, 0, 0, 0.4)",
                    animation: "glowPulse 4s ease-in-out infinite",
                  }}
                >
                  <div
                    className="flex items-center gap-3 px-5 py-4 relative z-10"
                    style={{ borderBottom: "1px solid var(--glass-border)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-full overflow-hidden"
                      style={{
                        border: "2px solid var(--tb-gold)",
                        boxShadow: "var(--glow-gold)",
                      }}
                    >
                      <img
                        src={CDN.hkAvatar}
                        alt="H.K."
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p
                        className="font-display text-sm font-bold"
                        style={{ color: "var(--tb-cream)" }}
                      >
                        H.K.{" "}
                        <span
                          className="font-normal text-xs"
                          style={{ color: "rgba(253, 248, 240, 0.4)" }}
                        >
                          Powered by Claude AI
                        </span>
                      </p>
                    </div>
                    <div
                      className="ml-auto w-2 h-2 rounded-full"
                      style={{
                        background: "var(--tb-teal)",
                        boxShadow: "var(--glow-teal)",
                        animation: "tealPulse 2s ease-in-out infinite",
                      }}
                    />
                  </div>
                  <div className="px-5 py-6 space-y-4 relative z-10">
                    <p className="text-sm" style={{ color: "var(--tb-cream)" }}>
                      Ask H.K. — get help now
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "rgba(253, 248, 240, 0.4)" }}
                    >
                      Click any button below to open H.K. and start a
                      conversation.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        "📧 Recover my email",
                        "💼 Apply for jobs",
                        "📱 Set up my phone",
                        "📁 Upload documents",
                        "🔑 Reset a password",
                        "🏥 Set up telehealth",
                      ].map(label => (
                        <motion.button
                          key={label}
                          className="px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                          style={{
                            background: "rgba(232, 185, 49, 0.08)",
                            color: "var(--tb-gold)",
                            border: "1px solid rgba(232, 185, 49, 0.15)",
                          }}
                          whileHover={{
                            scale: 1.05,
                            borderColor: "rgba(232, 185, 49, 0.5)",
                            boxShadow: "0 0 15px rgba(232, 185, 49, 0.2)",
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={e => {
                            e.stopPropagation();
                            openHKChat();
                          }}
                        >
                          {label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div
                    className="px-5 py-2 relative z-10"
                    style={{ background: "rgba(0, 212, 170, 0.05)" }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "rgba(0, 212, 170, 0.4)" }}
                    >
                      {"🔒"} Never share passwords, SSNs, bank info, or 2FA
                      codes.
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-2 px-5 py-3 relative z-10"
                    style={{ borderTop: "1px solid var(--glass-border)" }}
                  >
                    <motion.button
                      className="flex-1 px-4 py-2 rounded-xl text-xs text-left cursor-pointer"
                      style={{
                        background: "rgba(253, 248, 240, 0.03)",
                        color: "rgba(253, 248, 240, 0.25)",
                        border: "1px solid var(--glass-border)",
                      }}
                      whileHover={{ borderColor: "rgba(232, 185, 49, 0.3)" }}
                      onClick={e => {
                        e.stopPropagation();
                        openHKChat();
                      }}
                    >
                      Click to ask H.K. anything...
                    </motion.button>
                    <motion.button
                      className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                      style={{
                        background: "var(--tb-gold)",
                        boxShadow: "var(--glow-gold)",
                      }}
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "var(--glow-gold-strong)",
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={e => {
                        e.stopPropagation();
                        openHKChat();
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                          stroke="#0A1F14"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================
          SPAN DOCUMENT — Interactive Accordion
          ============================================ */}
      <section
        className="py-24 md:py-32 relative overflow-hidden"
        style={{ background: "var(--tb-forest-mid)" }}
      >
        <div className="absolute inset-0">
          <img
            src={CDN.spanJourney}
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.06 }}
          />
        </div>
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-6">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">
                The Operational Playbook
              </p>
              <h2
                className="font-display text-3xl md:text-5xl font-bold"
                style={{ color: "var(--tb-cream)" }}
              >
                The <span className="text-glow-gold">SPAN</span> Document
              </h2>
              <p
                className="text-base mt-4 max-w-3xl mx-auto"
                style={{ color: "rgba(253, 248, 240, 0.6)" }}
              >
                <strong className="text-glow-gold">
                  Strategic Playbook, Architecture & Navigator Operations
                </strong>{" "}
                — click any section to explore.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="max-w-3xl mx-auto mb-8">
              <svg
                viewBox="0 0 800 60"
                className="w-full"
                style={{ opacity: 0.3 }}
              >
                <motion.path
                  d="M50 30 Q200 10 400 30 T750 30"
                  stroke="var(--tb-gold)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  viewport={{ once: true }}
                />
                {SPAN_SECTIONS.map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={50 + i * 87.5}
                    cy={30}
                    r={4}
                    fill="var(--tb-teal)"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.3 }}
                    viewport={{ once: true }}
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(0, 212, 170, 0.5))",
                    }}
                  />
                ))}
              </svg>
            </div>
          </Reveal>

          <div className="max-w-3xl mx-auto space-y-3">
            {SPAN_SECTIONS.map((section, i) => (
              <Reveal key={section.num} delay={i * 0.04}>
                <motion.div
                  className="glass-card overflow-hidden cursor-pointer"
                  style={{
                    borderColor:
                      expandedSpan === section.num
                        ? "rgba(232, 185, 49, 0.4)"
                        : undefined,
                    boxShadow:
                      expandedSpan === section.num
                        ? "var(--glow-gold)"
                        : undefined,
                  }}
                  whileHover={{ borderColor: "rgba(232, 185, 49, 0.25)" }}
                  onClick={() => {
                    setExpandedSpan(
                      expandedSpan === section.num ? null : section.num
                    );
                    tbSoundEngine.play(
                      expandedSpan === section.num
                        ? "story_close"
                        : "story_reveal"
                    );
                  }}
                >
                  <div className="flex items-center gap-4 px-6 py-4 relative z-10">
                    <span
                      className="font-mono text-lg font-bold"
                      style={{
                        color: "var(--tb-teal)",
                        textShadow: "0 0 10px rgba(0, 212, 170, 0.3)",
                      }}
                    >
                      {section.num}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-base font-bold text-glow-gold">
                          {section.name}
                        </h3>
                        <span
                          className="text-xs hidden sm:inline"
                          style={{ color: "rgba(253, 248, 240, 0.35)" }}
                        >
                          {section.subtitle}
                        </span>
                      </div>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "rgba(253, 248, 240, 0.4)" }}
                      >
                        {section.focus}
                      </p>
                    </div>
                    <motion.svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      animate={{
                        rotate: expandedSpan === section.num ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="var(--tb-gold)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </div>
                  <AnimatePresence>
                    {expandedSpan === section.num && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="px-6 pb-5 pl-16 space-y-3 relative z-10">
                          <ul className="space-y-2">
                            {section.deep.map((item, j) => (
                              <motion.li
                                key={j}
                                className="text-sm leading-relaxed flex items-start gap-2"
                                style={{ color: "rgba(253, 248, 240, 0.7)" }}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: j * 0.06 }}
                              >
                                <span
                                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{
                                    background: "var(--tb-teal)",
                                    boxShadow: "0 0 6px rgba(0, 212, 170, 0.5)",
                                  }}
                                />
                                <span>{item}</span>
                              </motion.li>
                            ))}
                          </ul>
                          <div
                            className="mt-4 p-3 rounded-lg"
                            style={{
                              background: "rgba(232, 185, 49, 0.05)",
                              borderLeft: "3px solid var(--tb-gold)",
                            }}
                          >
                            <p
                              className="text-xs italic"
                              style={{ color: "rgba(253, 248, 240, 0.5)" }}
                            >
                              {section.quote}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          PILOT PROJECTIONS — Clickable Stats
          ============================================ */}
      <section className="py-20" style={{ background: "var(--tb-forest)" }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-sm font-mono tracking-widest uppercase mb-3 text-glow-teal">
                Two-Year Pilot Projections
              </p>
              <h2
                className="font-display text-3xl md:text-4xl font-bold"
                style={{ color: "var(--tb-cream)" }}
              >
                The numbers behind the{" "}
                <span className="text-glow-gold">bridge</span>
              </h2>
              <p
                className="text-xs font-mono mt-3"
                style={{ color: "rgba(0, 212, 170, 0.4)" }}
              >
                Click any stat to view the full dashboard.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                {
                  value: 4000,
                  label: "Year 1 TechMinutes®",
                  sub: "2 hubs · 4 Navigators",
                  color: "gold",
                },
                {
                  value: 6000,
                  label: "Year 2 TechMinutes®",
                  sub: "4 hubs · expanded team",
                  color: "teal",
                },
                {
                  value: 250,
                  label: "Total Investment ($K)",
                  sub: "Over 2 years",
                  prefix: "$",
                  suffix: "K",
                  color: "gold",
                },
                {
                  value: 3200,
                  label: "Residents Served",
                  sub: "4 hubs × 800 each",
                  color: "teal",
                },
              ].map(stat => (
                <motion.div
                  key={stat.label}
                  className="glass-card text-center p-6 cursor-pointer"
                  whileHover={{
                    scale: 1.05,
                    borderColor:
                      stat.color === "teal"
                        ? "rgba(0, 212, 170, 0.4)"
                        : "rgba(232, 185, 49, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    tbSoundEngine.play("nav_click");
                    navigate("/dashboard");
                  }}
                >
                  <div
                    className={`stat-number text-2xl md:text-3xl relative z-10 ${stat.color === "teal" ? "text-glow-teal" : ""}`}
                    style={
                      stat.color === "teal"
                        ? { color: "var(--tb-teal)" }
                        : undefined
                    }
                  >
                    <AnimatedCounter
                      target={stat.value}
                      prefix={stat.prefix || ""}
                      suffix={stat.suffix || ""}
                    />
                  </div>
                  <div
                    className="text-xs font-mono mt-2 uppercase tracking-wider relative z-10"
                    style={{ color: "rgba(253, 248, 240, 0.4)" }}
                  >
                    {stat.label}
                  </div>
                  <div
                    className="text-xs mt-1 relative z-10"
                    style={{ color: "rgba(253, 248, 240, 0.3)" }}
                  >
                    {stat.sub}
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="max-w-4xl mx-auto mt-8 grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="font-display text-base font-bold mb-3 text-glow-gold relative z-10">
                  Unit Economics
                </h3>
                <div
                  className="space-y-3 text-sm relative z-10"
                  style={{ color: "rgba(253, 248, 240, 0.6)" }}
                >
                  {[
                    {
                      label: "Cost per TechMinute (Year 1)",
                      value: "~$31",
                      color: "var(--tb-gold)",
                    },
                    {
                      label: "Cost per TechMinute (Year 2)",
                      value: "~$21",
                      color: "var(--tb-teal)",
                    },
                    {
                      label: "Navigator Pay",
                      value: "$20/hr",
                      color: "var(--tb-cream)",
                    },
                    {
                      label: "Budget Split",
                      value: "55% payroll / 45% ops",
                      color: "var(--tb-cream)",
                    },
                  ].map(row => (
                    <div
                      key={row.label}
                      className="flex justify-between items-center"
                    >
                      <span>{row.label}</span>
                      <span
                        className="font-mono font-bold"
                        style={{ color: row.color }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card p-6">
                <h3
                  className="font-display text-base font-bold mb-3 text-glow-teal relative z-10"
                  style={{ color: "var(--tb-teal)" }}
                >
                  Market Opportunity
                </h3>
                <div
                  className="space-y-3 text-sm relative z-10"
                  style={{ color: "rgba(253, 248, 240, 0.6)" }}
                >
                  {[
                    {
                      label: "TAM (Wake + Durham)",
                      value: "225,000",
                      pct: 100,
                    },
                    { label: "SAM (seek help)", value: "90,000", pct: 40 },
                    { label: "SOM (two-year pilot)", value: "3,200", pct: 1.4 },
                  ].map(row => (
                    <div key={row.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span>{row.label}</span>
                        <span
                          className="font-mono font-bold"
                          style={{ color: "var(--tb-gold)" }}
                        >
                          {row.value}
                        </span>
                      </div>
                      <div
                        className="w-full h-1.5 rounded-full"
                        style={{ background: "rgba(253, 248, 240, 0.05)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background:
                              "linear-gradient(90deg, var(--tb-teal), var(--tb-gold))",
                            boxShadow: "0 0 8px rgba(0, 212, 170, 0.3)",
                          }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${row.pct}%` }}
                          transition={{
                            duration: 1.5,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-1">
                    <span>NC Digital Divide</span>
                    <span
                      className="font-mono"
                      style={{ color: "rgba(253, 248, 240, 0.5)" }}
                    >
                      1.2M residents
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="text-center mt-10">
              <Link href="/dashboard">
                <span
                  className="tb-btn tb-btn-secondary cursor-pointer"
                  onClick={() => tbSoundEngine.play("nav_click")}
                >
                  View Simulated Dashboard
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14m-7-7l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          NAVIGATOR STORIES — CLICKABLE EXPAND
          ============================================ */}
      <section
        className="py-24 md:py-32"
        style={{ background: "var(--tb-forest-mid)" }}
      >
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">
                From SPAN §5.3 — Training Scenarios
              </p>
              <h2
                className="font-display text-3xl md:text-4xl font-bold"
                style={{ color: "var(--tb-cream)" }}
              >
                Every session is a{" "}
                <span className="text-glow-gold">bridge crossed</span>
              </h2>
              <p
                className="text-sm mt-3"
                style={{ color: "rgba(253, 248, 240, 0.4)" }}
              >
                Click any story to read the full scenario.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {STORIES.map((story, i) => {
              const isExpanded = expandedStory === i;
              return (
                <Reveal key={story.name} delay={i * 0.1}>
                  <motion.div
                    className="glass-card p-6 h-full cursor-pointer"
                    style={{
                      borderColor: isExpanded
                        ? "rgba(232, 185, 49, 0.4)"
                        : undefined,
                      boxShadow: isExpanded ? "var(--glow-gold)" : undefined,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setExpandedStory(isExpanded ? null : i);
                      tbSoundEngine.play(
                        isExpanded ? "story_close" : "story_reveal"
                      );
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                      <span className="text-2xl">{story.emoji}</span>
                      <div>
                        <h3
                          className="font-display text-base font-bold"
                          style={{ color: "var(--tb-cream)" }}
                        >
                          {story.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className="holo-badge text-xs"
                            style={{
                              color: "var(--tb-teal)",
                              padding: "0.15rem 0.5rem",
                            }}
                          >
                            {story.domain}
                          </span>
                          <span
                            className="text-xs font-mono"
                            style={{ color: "var(--tb-sage)" }}
                          >
                            {story.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p
                      className="text-sm mb-3 leading-relaxed relative z-10"
                      style={{ color: "rgba(253, 248, 240, 0.6)" }}
                    >
                      {story.issue}
                    </p>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: story.outcome.startsWith("Resolved")
                              ? "var(--tb-teal)"
                              : "var(--tb-gold)",
                            boxShadow: story.outcome.startsWith("Resolved")
                              ? "var(--glow-teal)"
                              : "var(--glow-gold)",
                          }}
                        />
                        <span
                          className="text-xs font-mono"
                          style={{
                            color: story.outcome.startsWith("Resolved")
                              ? "var(--tb-teal)"
                              : "var(--tb-gold)",
                          }}
                        >
                          {story.outcome}
                        </span>
                      </div>
                      <motion.svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="var(--tb-gold)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="mt-4 pt-4 relative z-10"
                            style={{
                              borderTop: "1px solid rgba(232, 185, 49, 0.15)",
                            }}
                          >
                            <p
                              className="text-sm leading-relaxed"
                              style={{ color: "rgba(253, 248, 240, 0.8)" }}
                            >
                              {story.fullStory}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          SUCCESS MOMENT — CTA
          ============================================ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={CDN.successMoment}
            alt="Community member celebrating"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to left, rgba(10, 31, 20, 0.92), rgba(10, 31, 20, 0.6))",
            }}
          />
        </div>
        <div className="container relative z-10">
          <Reveal direction="right">
            <div className="max-w-xl ml-auto text-right">
              <p className="text-sm font-mono tracking-widest uppercase mb-4 text-glow-teal">
                The Moment
              </p>
              <h2
                className="font-display text-3xl md:text-4xl font-bold mb-6"
                style={{ color: "var(--tb-cream)" }}
              >
                This is what crossing the bridge{" "}
                <span className="text-glow-gold">looks like.</span>
              </h2>
              <p
                className="text-base mb-4 leading-relaxed"
                style={{ color: "rgba(253, 248, 240, 0.8)" }}
              >
                When Dorothy completed her first telehealth appointment after 40
                minutes with her Digital Navigator — that's not a tech task.
                That's a life changed.
              </p>
              <p
                className="text-sm italic mb-6"
                style={{ color: "rgba(0, 212, 170, 0.5)" }}
              >
                {"—"} From SPAN §5.3: Dorothy's Scenario
              </p>
              <div className="flex flex-wrap gap-4 justify-end">
                <Link href="/get-help">
                  <span
                    className="tb-btn tb-btn-primary cursor-pointer"
                    onClick={() => tbSoundEngine.play("nav_click")}
                  >
                    Get Help Today
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14m-7-7l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
                <a
                  href="https://calendly.com/aitconsult22/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tb-btn tb-btn-ghost"
                  onClick={() => tbSoundEngine.play("nav_click")}
                >
                  Book a Pilot Call
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes rippleExpand {
          0% { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
