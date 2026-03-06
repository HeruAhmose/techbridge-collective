/**
 * TechBridge Collective — Home / Landing Page
 * GOD-TIER Visual Storytelling Masterpiece
 * 
 * Design: "The Bridge" Narrative Journey
 * Colors: Forest Green (#1B4332) + Gold (#C9A227) + Cream (#FDF8F0)
 * Fonts: Fraunces (display) + Inter (body) + JetBrains Mono (data)
 * 
 * SPAN = Strategic Playbook, Architecture & Navigator Operations
 * (The operational document itself, NOT a resident journey model)
 * 
 * ALL NUMBERS ARE VERIFIED FROM THE SPAN DOCUMENT:
 * - 1.2M NC residents lack adequate digital access (Section 9.1)
 * - TAM: 225,000 / SAM: 90,000 / SOM: 3,200 (Section 9.1)
 * - Year 1: 2 hubs, 4 Navigators, ~4,000 TechMinutes target
 * - Year 2: 4 hubs, ~6,000 TechMinutes target
 * - $250K total investment over 2 years
 * - Navigator pay: $20/hr, ~10 hrs/wk
 * - Hub hours: 4-8 hrs/wk
 * - 60-day launch timeline
 * - Scenarios: Maria (18m), James (35m), Dorothy (40m), Carlos (22m), Keisha (45m)
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';
import Footer from '../components/Footer';

const CDN = {
  bridgeHero: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/bridge-hero-3L5v75UNyLV5wZc3BXy2gE.webp',
  communityHub: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-hub-Q9JLQXRqmAttfmjNjBXFon.webp',
  hkAvatar: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/HK_avatar_80_9e8213b6.jpg',
  horaceKing: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/horace-king-tribute-WrUcXchvoiExwCufr5cq2T.webp',
  spanJourney: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/span-journey-fgm8ge9JC6YczpG5dzHFSm.webp',
  navigatorHelping: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-navigator-J3QgpVMcvM5w7siVQDejbC.webp',
  communityGathering: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/community-gathering-7tsUyPrugQMATVzsJ7YZx2.webp',
  handsGuiding: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/navigator-session-7Fy7vkxQXuw2y8AmS6RLxZ.webp',
  hubExterior: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/hub-exterior-Dp9FtPxyv99F7AzXgr44Ue.webp',
  successMoment: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/success-moment-hm2uPdPFHXpkuohVUwwfqe.webp',
};

/* ============================================
   UTILITY: Scroll-triggered reveal
   ============================================ */
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
    up: { hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    left: { hidden: { x: -50, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    right: { hidden: { x: 50, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    scale: { hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1 } },
  };
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={variants[direction]}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
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
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId = 0;
    const particles: Array<{x:number;y:number;vx:number;vy:number;size:number;alpha:number;decay:number}> = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const addParticle = () => {
      if (particles.length > 60) return;
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.3 - Math.random() * 0.7,
        size: 1 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.4,
        decay: 0.002 + Math.random() * 0.003,
      });
    };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.15) addParticle();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 162, 39, ${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.6 }} />;
}

/* ============================================
   DATA — ALL VERIFIED FROM SPAN DOCUMENT
   ============================================ */
const PILLARS = [
  {
    num: '01',
    title: 'Weekly Help Desk',
    desc: 'Walk-in and scheduled 1:1 sessions with paid Digital Navigators. 4\u20138 hours per week at your community site. No appointments needed.',
    quote: '"Consistency is the product." \u2014 SPAN \u00A71.6',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    accent: '#2D6A4F',
  },
  {
    num: '02',
    title: 'H.K. AI Triage',
    desc: 'Named for Horace King, master bridge builder. 24/7 step-by-step guidance between visits. Routes, guides, and escalates. Never guesses. Never asks for credentials.',
    quote: '"H.K. is not a chatbot. It is a deterministic triage state machine augmented by generative AI." \u2014 SPAN \u00A76.2',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 22 Q16 8 28 22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <line x1="4" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="1.5" />
        <line x1="16" y1="22" x2="16" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    accent: '#C9A227',
  },
  {
    num: '03',
    title: 'TechMinutes\u00AE Reporting',
    desc: 'Monthly non-PII impact reports: minutes served, issue categories, resolution rates, and community patterns. Data your funders actually want.',
    quote: '"Every interaction becomes a TechMinute\u00AE. No unmeasured work." \u2014 SPAN \u00A71.4',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="10" y1="22" x2="10" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="16" y1="22" x2="16" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="22" x2="22" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    accent: '#C4704B',
  },
];

/* Pilot Hub Targets — from SPAN Section 2 & 9 */
const HUBS = [
  { name: 'Durham County Library', address: 'Durham, NC', days: 'Schedule TBD \u00B7 4\u20138 hrs/wk', status: 'Pilot Target \u2014 Year 1', mapUrl: 'https://maps.google.com/?q=Durham+County+Library+Durham+NC' },
  { name: 'Raleigh Digital Impact Center', address: 'Raleigh, NC', days: 'Schedule TBD \u00B7 4\u20138 hrs/wk', status: 'Pilot Target \u2014 Year 1', mapUrl: 'https://maps.google.com/?q=Raleigh+Digital+Impact+Center+Raleigh+NC' },
];

/* Year 2 expansion targets — from SPAN Section 9 */
const YEAR2_HUBS = [
  'Durham Housing Authority',
  'Raleigh Housing Authority',
  'El Centro Hispano',
];

/* SPAN Document Sections — Bridge Engineering Metaphors with DEEP content from the actual document */
const SPAN_SECTIONS = [
  {
    num: '1', name: 'The Crossing', subtitle: 'Identity & Values',
    focus: 'Who we are, what we believe, and how we show up. Six core values guide every decision.',
    deep: [
      'Consistency over Novelty \u2014 "We show up. Every week. Same time, same place."',
      'Human-First Technology \u2014 "H.K. triages; humans deliver. Tech extends reach, never replaces relationships."',
      'Measured Impact \u2014 "Every interaction becomes a TechMinute\u00AE. No unmeasured work."',
      'Low-Lift Partnerships \u2014 "Host provides space. TechBridge provides everything else."',
      'Paid Navigators \u2014 "No volunteers. Paid staff show up, stay trained, don\'t churn."',
      'Privacy by Design \u2014 "No PII. No credential access. We guide; we don\'t control."',
    ],
    quote: '"Because the best technology in the world doesn\'t matter if no one shows you how to use it." \u2014 \u00A71.5',
    icon: '\uD83E\uDDED',
  },
  {
    num: '2', name: 'The Structure', subtitle: 'The Three-Pillar Model',
    focus: 'Weekly Help Desk + H.K. AI Triage + TechMinutes\u00AE Reporting. The partnership model and 60-day launch timeline.',
    deep: [
      'Three pillars delivered at every hub: Weekly Help Desk, H.K. AI, TechMinutes\u00AE Reports',
      'Host provides: space, Wi-Fi, promotion, staff liaison',
      'TechBridge provides: trained Navigators, H.K. AI, reporting, all tech infrastructure',
      '60-day launch timeline from signed agreement to first session',
      'Zero cost to the host site \u2014 TechBridge covers all operational expenses',
    ],
    quote: '"No other RDU program combines paid staff, consistent schedule, 24/7 AI, and proprietary measurement in a single zero-cost offering." \u2014 \u00A79.6',
    icon: '\uD83C\uDFD7\uFE0F',
  },
  {
    num: '3', name: 'The Load', subtitle: 'Budget & Unit Economics',
    focus: '$250K total investment over 2 years. 55% payroll, 45% operations. Navigator pay: $20/hr.',
    deep: [
      'Year 1: 2 hubs, 4 Navigators, ~4,000 TechMinutes\u00AE target',
      'Year 2: 4 hubs, ~6,000 TechMinutes\u00AE target',
      'Cost per TechMinute: ~$31 (Year 1) \u2192 ~$21 (Year 2)',
      'Bold Path Fellowship: $120K ($60K/yr) \u2014 primary early funding',
      'Navigator compensation: $20/hr, ~10 hrs/wk each',
      'Budget split: 55% payroll, 45% operations',
    ],
    quote: '"Lean Mode is survivable. The first TechMinutes\u00AE report is the inflection." \u2014 \u00A78.2',
    icon: '\u2696\uFE0F',
  },
  {
    num: '4', name: 'The Approach', subtitle: 'Outreach & Partnerships',
    focus: 'How we find and onboard community partners. Outreach rules, cadence, and subject lines.',
    deep: [
      'Target partners: libraries, housing authorities, community centers, faith-based orgs',
      'Outreach cadence: structured email sequences with specific subject lines',
      'Value proposition: zero-cost, fully-staffed digital help desk at your site',
      'Decision-maker mapping: identify the right person at each organization',
      'Follow-up protocol: persistent but respectful, data-driven pitch',
    ],
    quote: '"First report = inflection. Host sees data \u2192 advocate. Funder sees data \u2192 check." \u2014 \u00A79.7',
    icon: '\uD83D\uDCE8',
  },
  {
    num: '5', name: 'The Cables', subtitle: 'Navigator Training & Protocol',
    focus: 'The 7-step session protocol, real scenarios, escalation paths, and the Navigator mindset.',
    deep: [
      '7-Step Session Protocol: Greet \u2192 Listen \u2192 Assess \u2192 Guide \u2192 Confirm \u2192 Log \u2192 Close',
      '"You are not tech support. You are a bridge." \u2014 the Navigator mindset',
      '"A school portal isn\'t a password reset \u2014 it\'s a parent reconnecting with their child\'s education."',
      'Escalation: Crisis \u2192 988/DV Hotline | Legal \u2192 NC Legal Aid | Medical \u2192 911',
      '"Know the Horace King story by heart." \u2014 every Navigator carries the mission',
      'Credentials policy: Never touch. Walk them through it on their device.',
    ],
    quote: '"Comfortable doing this alone next time?" \u2014 the confirmation question every session',
    icon: '\uD83D\uDD17',
  },
  {
    num: '6', name: 'The Deck', subtitle: 'Production Tech Stack',
    focus: 'Next.js, Neon PostgreSQL, Clerk auth, Anthropic Claude for H.K., post-quantum security.',
    deep: [
      'Frontend: Next.js on Vercel | Database: Neon PostgreSQL 16 + pgvector',
      'Auth: Clerk | AI Triage: H.K. powered by Anthropic Claude',
      'Vector Store: ChromaDB \u2192 Qdrant (RAG pipeline for semantic search)',
      'Architecture: Multi-Tenant SaaS with row-level security',
      'Security: Post-quantum TLS \u2014 X25519 + ML-KEM-768',
      'Ticketing: Jira Service Management (free nonprofit tier)',
    ],
    quote: '"H.K. is not a chatbot. It is a deterministic triage state machine augmented by generative AI." \u2014 \u00A76.2',
    icon: '\uD83D\uDCBB',
  },
  {
    num: '7', name: 'The Abutments', subtitle: 'Funding & Growth',
    focus: 'Grant targets from NTIA ($500K\u2013$3M+), DOL, Cisco, Google.org, and local pipeline.',
    deep: [
      'NTIA Digital Equity: $500K\u2013$3M+ (HIGH priority)',
      'DOL WORC: $500K\u2013$2.5M (HIGH)',
      'Cisco Impact: $250K\u2013$1M+ (HIGH)',
      'Google.org: $100K\u2013$1.5M (HIGH)',
      'Lenovo Foundation: $100K\u2013$750K (HIGH)',
      'BofA Neighborhood Builders: $200K (HIGH)',
      'NC IDEA: $50K\u2013$150K (HIGH)',
    ],
    quote: '"The first TechMinutes\u00AE report is the inflection." \u2014 data unlocks funding',
    icon: '\uD83D\uDCC8',
  },
  {
    num: '8', name: 'The Foundation', subtitle: 'Risk Management',
    focus: 'What-if scenarios, lean mode operations, and contingency planning.',
    deep: [
      'What if a hub drops out? \u2192 Redirect Navigator hours, maintain continuity',
      'What if funding stalls? \u2192 Lean Mode: reduce to 2 Navigators, 1 hub, preserve core',
      'What if H.K. goes down? \u2192 Navigators operate independently with paper protocols',
      'What if a Navigator leaves? \u2192 Cross-training ensures no single point of failure',
      'Lean Mode budget: survivable on Bold Path Fellowship alone',
    ],
    quote: '"Lean Mode is survivable. The first TechMinutes\u00AE report is the inflection." \u2014 \u00A78.2',
    icon: '\uD83D\uDEE1\uFE0F',
  },
  {
    num: '9', name: 'The Elevation', subtitle: 'Market & Impact',
    focus: '1.2M NC residents lack digital access. TAM: 225K. SAM: 90K. SOM: 3,200 in two-year pilot.',
    deep: [
      '1.2 million North Carolina residents lack adequate digital access',
      'TAM: 225,000 \u2014 Wake + Durham adults lacking digital skills (~15% of 1.5M)',
      'SAM: 90,000 \u2014 likely to seek help at a trusted community location (~40%)',
      'SOM: 3,200 \u2014 two-year pilot capacity across 4 hubs (800 per hub)',
      'Four domains of impact: Education, Workforce, Health, Housing',
      'TechMinutes\u00AE: proprietary measurement unit \u2014 no other program has this',
    ],
    quote: '"No other RDU program combines paid staff, consistent schedule, 24/7 AI, and proprietary measurement in a single zero-cost offering." \u2014 \u00A79.6',
    icon: '\uD83C\uDF1F',
  },
];

/* Real scenarios from SPAN Section 5.3 */
const STORIES = [
  { name: 'Maria', domain: 'Education', time: '18 min', issue: 'School portal password reset, bookmark setup, physical backup card created.', outcome: 'Resolved', emoji: '\uD83D\uDCDA' },
  { name: 'James', domain: 'Workforce', time: '35 min', issue: 'VA job application: account creation, draft-save strategy, DD-214 upload, NCWorks referral.', outcome: 'Partial \u2014 follow-up scheduled', emoji: '\uD83D\uDCBC' },
  { name: 'Dorothy', domain: 'Health', time: '40 min', issue: 'Apple ID reset, health portal app install, account creation, first telehealth appointment booked.', outcome: 'Resolved', emoji: '\uD83C\uDFE5' },
  { name: 'Carlos', domain: 'Housing', time: '22 min', issue: 'Phone document scanner setup, housing application upload, screenshot confirmation saved.', outcome: 'Resolved', emoji: '\uD83C\uDFE0' },
  { name: 'Keisha', domain: 'Education', time: '45 min', issue: 'FAFSA: Parent FSA ID creation, guided through each section, no data entry by Navigator. Check-in scheduled.', outcome: 'Resolved', emoji: '\uD83C\uDF93' },
];

/* Core Values from SPAN Section 1.4 */
const CORE_VALUES = [
  { title: 'Consistency over Novelty', desc: 'We show up. Every week. Same time, same place.', icon: '\uD83D\uDD04' },
  { title: 'Human-First Technology', desc: 'H.K. triages; humans deliver. Tech extends reach, never replaces relationships.', icon: '\uD83E\uDD1D' },
  { title: 'Measured Impact', desc: 'Every interaction becomes a TechMinute\u00AE. No unmeasured work.', icon: '\uD83D\uDCCA' },
  { title: 'Low-Lift Partnerships', desc: 'Host provides space. TechBridge provides everything else.', icon: '\uD83C\uDFE2' },
  { title: 'Paid Navigators', desc: 'No volunteers. Paid staff show up, stay trained, don\'t churn.', icon: '\uD83D\uDCB0' },
  { title: 'Privacy by Design', desc: 'No PII. No credential access. We guide; we don\'t control.', icon: '\uD83D\uDD12' },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [expandedSpan, setExpandedSpan] = useState<string | null>(null);
  const [expandedValue, setExpandedValue] = useState<number | null>(null);

  const initSound = useCallback(() => {
    tbSoundEngine.init();
  }, []);

  return (
    <div onClick={initSound} style={{ background: '#FDF8F0', color: '#2D3436' }}>
      {/* ============================================
          HERO — Cinematic Bridge with Parallax
          ============================================ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img src={CDN.bridgeHero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10, 31, 20, 0.7) 0%, rgba(27, 67, 50, 0.85) 50%, rgba(10, 31, 20, 0.95) 100%)' }} />
        </motion.div>
        <ParticleCanvas />
        <motion.div className="container relative z-10 py-32" style={{ opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-sm font-mono tracking-[0.3em] uppercase mb-6" style={{ color: '#C9A227' }}>
              TechBridge Collective
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] max-w-4xl" style={{ color: '#FDF8F0' }}>
              Building bridges of access, dignity, and opportunity
            </h1>
            <p className="text-base md:text-lg mt-6 max-w-2xl leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.75)' }}>
              Free, human-centered digital help at community sites across the Triangle. Walk in. Get help. Cross the bridge.
            </p>
            <p className="text-sm mt-3 italic" style={{ color: 'rgba(201, 162, 39, 0.6)' }}>
              "Because the best technology in the world doesn't matter if no one shows you how to use it."
            </p>
          </motion.div>
          <motion.div className="flex flex-wrap gap-4 mt-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <Link href="/get-help">
              <span className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-bold text-base transition-all duration-300 hover:scale-105 cursor-pointer" style={{ background: '#C9A227', color: '#1B4332' }} onClick={() => tbSoundEngine.play('nav_click')}>
                Get Help Now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </Link>
            <Link href="/host-a-hub">
              <span className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-bold text-base transition-all duration-300 hover:scale-105 cursor-pointer" style={{ background: 'transparent', color: '#FDF8F0', border: '2px solid rgba(253, 248, 240, 0.25)' }} onClick={() => tbSoundEngine.play('nav_click')}>
                Host a Hub
              </span>
            </Link>
          </motion.div>
          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
            <p className="text-xs font-mono" style={{ color: 'rgba(201, 162, 39, 0.5)' }}>Scroll to explore</p>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14m-7-7l7 7 7-7" stroke="rgba(201, 162, 39, 0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================
          THE PROBLEM — 1.2M NC Residents (SPAN §9.1)
          ============================================ */}
      <section className="py-20 md:py-28" style={{ background: '#1B4332' }}>
        <div className="container">
          <Reveal>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm font-mono tracking-widest uppercase mb-6" style={{ color: '#C9A227' }}>The Digital Divide</p>
              <h2 className="font-display text-4xl md:text-6xl font-bold mb-6" style={{ color: '#FDF8F0' }}>
                <span style={{ color: '#C9A227' }}>1.2 million</span> North Carolinians
              </h2>
              <p className="text-xl md:text-2xl font-display mb-8" style={{ color: 'rgba(253, 248, 240, 0.8)' }}>
                lack adequate digital access.
              </p>
              <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>
                That's parents who can't access their child's school portal. Veterans who can't complete a job application. Seniors who can't set up telehealth. The technology exists — but no one showed them how to use it.
              </p>
              <p className="text-xs font-mono mt-6" style={{ color: 'rgba(201, 162, 39, 0.4)' }}>Source: SPAN Document §9.1 — Market Analysis</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          THREE PILLARS — The Model
          ============================================ */}
      <section className="py-24 md:py-32" style={{ background: '#FDF8F0' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>The Model</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold" style={{ color: '#1B4332' }}>
                Three pillars. One bridge.
              </h2>
              <p className="text-base mt-4 max-w-2xl mx-auto" style={{ color: '#5a6c5a' }}>
                Every TechBridge hub delivers the same three things. No more, no less. Simplicity is the strategy.
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.num} delay={i * 0.12}>
                <motion.div
                  className="rounded-2xl p-8 h-full relative overflow-hidden group cursor-pointer"
                  style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 4px 24px rgba(27, 67, 50, 0.06)' }}
                  whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(27, 67, 50, 0.12)' }}
                  onHoverStart={() => tbSoundEngine.play('pillar_hover')}
                >
                  <div className="font-display text-7xl font-bold absolute -top-2 -right-2 select-none" style={{ color: pillar.accent, opacity: 0.06 }}>{pillar.num}</div>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110" style={{ background: `${pillar.accent}15`, color: pillar.accent }}>{pillar.icon}</div>
                  <h3 className="font-display text-xl font-bold mb-3" style={{ color: '#1B4332' }}>{pillar.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#5a6c5a' }}>{pillar.desc}</p>
                  <p className="text-xs italic leading-relaxed" style={{ color: pillar.accent, opacity: 0.8 }}>{pillar.quote}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          NAVIGATOR HELPING — Full-width Photo Section
          ============================================ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.navigatorHelping} alt="Digital Navigator helping community member" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(27, 67, 50, 0.88), rgba(27, 67, 50, 0.5))' }} />
        </div>
        <div className="container relative z-10">
          <Reveal direction="left">
            <div className="max-w-xl">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>The Navigator Mindset</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#FDF8F0' }}>
                "You are not tech support. You are a bridge."
              </h2>
              <p className="text-base mb-4 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.85)' }}>
                A school portal isn't a password reset — it's a parent reconnecting with their child's education. A job application isn't a form — it's a veteran rebuilding their career. We don't fix devices. We build bridges.
              </p>
              <p className="text-sm italic" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>
                — SPAN Document §5.1: Navigator Training
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          CORE VALUES — From SPAN §1.4
          ============================================ */}
      <section className="py-24 md:py-32" style={{ background: '#FDF8F0' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Our DNA</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold" style={{ color: '#1B4332' }}>
                Six values. Non-negotiable.
              </h2>
              <p className="text-sm mt-3" style={{ color: '#5a6c5a' }}>From SPAN Document §1.4 — Core Values</p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {CORE_VALUES.map((val, i) => (
              <Reveal key={val.title} delay={i * 0.08}>
                <motion.div
                  className="rounded-xl p-6 cursor-pointer h-full"
                  style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 2px 12px rgba(27, 67, 50, 0.04)' }}
                  whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(27, 67, 50, 0.08)' }}
                  onClick={() => { setExpandedValue(expandedValue === i ? null : i); tbSoundEngine.play('story_reveal'); }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{val.icon}</span>
                    <h3 className="font-display text-base font-bold" style={{ color: '#1B4332' }}>{val.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed italic" style={{ color: '#5a6c5a' }}>"{val.desc}"</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          HUB SCHEDULE — Pilot Targets (SPAN §2 & §9)
          ============================================ */}
      <section className="py-24 md:py-32" style={{ background: 'rgba(27, 67, 50, 0.03)' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Hub Network</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>
                Where we're building
              </h2>
              <p className="text-sm mt-3" style={{ color: '#5a6c5a' }}>Year 1 pilot targets from SPAN Document §2 & §9</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {HUBS.map((hub, i) => (
              <Reveal key={hub.name} delay={i * 0.15}>
                <motion.div
                  className="rounded-2xl overflow-hidden group"
                  style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 4px 24px rgba(27, 67, 50, 0.06)' }}
                  whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(27, 67, 50, 0.1)' }}
                >
                  <div className="h-48 overflow-hidden">
                    <img src={i === 0 ? CDN.hubExterior : CDN.communityGathering} alt={hub.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#C9A227' }} />
                      <span className="text-xs font-mono uppercase tracking-wider" style={{ color: '#C9A227' }}>{hub.status}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2" style={{ color: '#1B4332' }}>{hub.name}</h3>
                    <p className="text-sm mb-1" style={{ color: '#5a6c5a' }}>{hub.address}</p>
                    <p className="text-sm font-mono mb-4" style={{ color: '#7C9A6E' }}>{hub.days}</p>
                    <a
                      href={hub.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono px-3 py-1.5 rounded-lg transition-all hover:scale-105 inline-block"
                      style={{ background: 'rgba(27, 67, 50, 0.06)', color: '#1B4332' }}
                    >
                      View on Map →
                    </a>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Year 2 Expansion */}
          <Reveal>
            <div className="max-w-4xl mx-auto mt-12">
              <div className="rounded-xl p-6" style={{ background: 'rgba(27, 67, 50, 0.04)', border: '1px dashed rgba(27, 67, 50, 0.15)' }}>
                <p className="text-sm font-mono tracking-widest uppercase mb-3" style={{ color: '#C9A227' }}>Year 2 Expansion Targets</p>
                <div className="flex flex-wrap gap-3">
                  {YEAR2_HUBS.map((h) => (
                    <span key={h} className="px-4 py-2 rounded-lg text-sm" style={{ background: 'white', color: '#1B4332', border: '1px solid #e8e0d0' }}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          H.K. AI PREVIEW — Meet Your Digital Navigator
          ============================================ */}
      <section className="py-24 md:py-32" style={{ background: '#1B4332' }}>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <Reveal direction="left">
              <div>
                <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>Meet H.K.</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#FDF8F0' }}>
                  Your 24/7 bridge between visits
                </h2>
                <p className="text-base mb-4 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.8)' }}>
                  Named for <strong style={{ color: '#C9A227' }}>Horace King</strong>, the enslaved master bridge builder who connected communities across the American South. H.K. carries that legacy forward — connecting people to the digital resources they need.
                </p>
                <p className="text-base mb-6 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.7)' }}>
                  H.K. never guesses. Never asks for credentials. Routes you to the right portal, walks you through each step, and escalates to a human Navigator when needed.
                </p>
                <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(201, 162, 39, 0.06)', border: '1px solid rgba(201, 162, 39, 0.15)' }}>
                  <p className="text-sm italic" style={{ color: 'rgba(253, 248, 240, 0.7)' }}>
                    "H.K. is not a chatbot. It is a deterministic triage state machine augmented by generative AI."
                  </p>
                  <p className="text-xs font-mono mt-2" style={{ color: 'rgba(201, 162, 39, 0.5)' }}>— SPAN §6.2</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['Step-by-step guidance', 'Portal navigation', 'Smart escalation', '24/7 availability'].map((feat) => (
                    <span key={feat} className="px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: 'rgba(201, 162, 39, 0.1)', color: '#C9A227', border: '1px solid rgba(201, 162, 39, 0.2)' }}>
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal direction="right">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden" style={{ background: '#0F2B1F', border: '1px solid rgba(201, 162, 39, 0.2)', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
                  <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(201, 162, 39, 0.15)' }}>
                    <div className="w-10 h-10 rounded-full overflow-hidden" style={{ border: '2px solid #C9A227' }}>
                      <img src={CDN.hkAvatar} alt="H.K." className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold" style={{ color: '#FDF8F0' }}>H.K. <span className="font-normal text-xs" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>Powered by Anthropic Claude</span></p>
                    </div>
                  </div>
                  <div className="px-5 py-6 space-y-4">
                    <p className="text-sm" style={{ color: '#FDF8F0' }}>Ask H.K. — get help now</p>
                    <p className="text-xs" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>Describe your issue or choose a quick start below.</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['\uD83D\uDCE7 Recover my email', '\uD83D\uDCBC Apply for jobs online', '\uD83D\uDCF1 Set up my phone', '\uD83D\uDCC1 Upload documents', '\uD83D\uDD11 Reset a password', '\uD83C\uDFE5 Set up telehealth'].map((label) => (
                        <span key={label} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(201, 162, 39, 0.1)', color: '#C9A227', border: '1px solid rgba(201, 162, 39, 0.2)' }}>{label}</span>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 py-2" style={{ background: 'rgba(45, 106, 79, 0.1)' }}>
                    <p className="text-xs" style={{ color: 'rgba(253, 248, 240, 0.4)' }}>\uD83D\uDD12 Never share passwords, SSNs, bank info, or 2FA codes.</p>
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3" style={{ borderTop: '1px solid rgba(201, 162, 39, 0.1)' }}>
                    <div className="flex-1 px-4 py-2 rounded-xl text-xs" style={{ background: 'rgba(253, 248, 240, 0.05)', color: 'rgba(253, 248, 240, 0.3)', border: '1px solid rgba(201, 162, 39, 0.15)' }}>
                      Describe your issue...
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#C9A227' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#1B4332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================
          THE SPAN DOCUMENT — Deep Interactive Playbook
          ============================================ */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: '#0F2B1F' }}>
        <div className="absolute inset-0">
          <img src={CDN.spanJourney} alt="" className="w-full h-full object-cover" style={{ opacity: 0.08 }} />
        </div>
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-6">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>The Operational Playbook</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold" style={{ color: '#FDF8F0' }}>
                The SPAN Document
              </h2>
              <p className="text-base mt-4 max-w-3xl mx-auto" style={{ color: 'rgba(253, 248, 240, 0.7)' }}>
                <strong style={{ color: '#C9A227' }}>Strategic Playbook, Architecture & Navigator Operations</strong> — our comprehensive operational blueprint. Every section is named after a part of a bridge, because that's what we build.
              </p>
            </div>
          </Reveal>

          {/* Bridge SVG header */}
          <Reveal>
            <div className="max-w-3xl mx-auto mb-8">
              <svg viewBox="0 0 800 60" className="w-full" style={{ opacity: 0.25 }}>
                <motion.path
                  d="M50 30 Q200 10 400 30 T750 30"
                  stroke="#C9A227" strokeWidth="2" fill="none" strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                  viewport={{ once: true }}
                />
                {SPAN_SECTIONS.map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={50 + i * 87.5} cy={30} r={4}
                    fill="#C9A227"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.3 }}
                    viewport={{ once: true }}
                  />
                ))}
              </svg>
            </div>
          </Reveal>

          {/* SPAN Sections — Deep Interactive Accordion */}
          <div className="max-w-3xl mx-auto space-y-3">
            {SPAN_SECTIONS.map((section, i) => (
              <Reveal key={section.num} delay={i * 0.04}>
                <motion.div
                  className="rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    background: expandedSpan === section.num ? 'rgba(201, 162, 39, 0.08)' : 'rgba(253, 248, 240, 0.03)',
                    border: `1px solid ${expandedSpan === section.num ? 'rgba(201, 162, 39, 0.3)' : 'rgba(253, 248, 240, 0.06)'}`,
                  }}
                  whileHover={{ borderColor: 'rgba(201, 162, 39, 0.2)' }}
                  onClick={() => {
                    setExpandedSpan(expandedSpan === section.num ? null : section.num);
                    tbSoundEngine.play(expandedSpan === section.num ? 'story_close' : 'story_reveal');
                  }}
                >
                  <div className="flex items-center gap-4 px-6 py-4">
                    <span className="text-xl">{section.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(201, 162, 39, 0.15)', color: '#C9A227' }}>{section.num}</span>
                        <h3 className="font-display text-base font-bold" style={{ color: '#FDF8F0' }}>{section.name}</h3>
                        <span className="text-xs hidden sm:inline" style={{ color: 'rgba(253, 248, 240, 0.4)' }}>{section.subtitle}</span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>{section.focus}</p>
                    </div>
                    <motion.svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      animate={{ rotate: expandedSpan === section.num ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path d="M6 9l6 6 6-6" stroke="rgba(201, 162, 39, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  </div>
                  <AnimatePresence>
                    {expandedSpan === section.num && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="px-6 pb-5 pl-16 space-y-3">
                          {/* Deep content bullets */}
                          <ul className="space-y-2">
                            {section.deep.map((item, j) => (
                              <motion.li
                                key={j}
                                className="text-sm leading-relaxed flex items-start gap-2"
                                style={{ color: 'rgba(253, 248, 240, 0.75)' }}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: j * 0.06 }}
                              >
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#C9A227' }} />
                                <span>{item}</span>
                              </motion.li>
                            ))}
                          </ul>
                          {/* Quote */}
                          <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(201, 162, 39, 0.06)', borderLeft: '3px solid rgba(201, 162, 39, 0.3)' }}>
                            <p className="text-xs italic" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>{section.quote}</p>
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
          PILOT PROJECTIONS — SPAN-Verified Targets
          ============================================ */}
      <section className="py-20" style={{ background: '#FDF8F0' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-sm font-mono tracking-widest uppercase mb-3" style={{ color: '#C9A227' }}>Two-Year Pilot Projections</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>
                The numbers behind the bridge
              </h2>
              <p className="text-xs font-mono mt-3" style={{ color: '#7C9A6E' }}>All figures from SPAN Document §3 & §9 — verified projections</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: '4,000', label: 'Year 1 TechMinutes\u00AE Target', sub: '2 hubs \u00B7 4 Navigators' },
                { value: '6,000', label: 'Year 2 TechMinutes\u00AE Target', sub: '4 hubs \u00B7 expanded team' },
                { value: '$250K', label: 'Total Investment', sub: 'Over 2 years' },
                { value: '3,200', label: 'Residents Served (SOM)', sub: '4 hubs \u00D7 800 each' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
                  style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 2px 12px rgba(27, 67, 50, 0.04)' }}
                >
                  <div className="font-display text-2xl md:text-3xl font-bold" style={{ color: '#C9A227' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono mt-2 uppercase tracking-wider" style={{ color: '#7C9A6E' }}>{stat.label}</div>
                  <div className="text-xs mt-1" style={{ color: '#5a6c5a' }}>{stat.sub}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="max-w-4xl mx-auto mt-8 grid md:grid-cols-2 gap-6">
              <div className="rounded-xl p-6" style={{ background: 'rgba(27, 67, 50, 0.04)', border: '1px solid rgba(27, 67, 50, 0.1)' }}>
                <h3 className="font-display text-base font-bold mb-3" style={{ color: '#1B4332' }}>Unit Economics</h3>
                <div className="space-y-2 text-sm" style={{ color: '#5a6c5a' }}>
                  <div className="flex justify-between"><span>Cost per TechMinute (Year 1)</span><span className="font-mono font-bold" style={{ color: '#C9A227' }}>~$31</span></div>
                  <div className="flex justify-between"><span>Cost per TechMinute (Year 2)</span><span className="font-mono font-bold" style={{ color: '#2D6A4F' }}>~$21</span></div>
                  <div className="flex justify-between"><span>Navigator Pay</span><span className="font-mono">$20/hr</span></div>
                  <div className="flex justify-between"><span>Budget Split</span><span className="font-mono">55% payroll / 45% ops</span></div>
                </div>
              </div>
              <div className="rounded-xl p-6" style={{ background: 'rgba(27, 67, 50, 0.04)', border: '1px solid rgba(27, 67, 50, 0.1)' }}>
                <h3 className="font-display text-base font-bold mb-3" style={{ color: '#1B4332' }}>Market Opportunity</h3>
                <div className="space-y-2 text-sm" style={{ color: '#5a6c5a' }}>
                  <div className="flex justify-between"><span>TAM (Wake + Durham)</span><span className="font-mono font-bold" style={{ color: '#C9A227' }}>225,000</span></div>
                  <div className="flex justify-between"><span>SAM (seek help at trusted site)</span><span className="font-mono font-bold" style={{ color: '#2D6A4F' }}>90,000</span></div>
                  <div className="flex justify-between"><span>SOM (two-year pilot)</span><span className="font-mono font-bold" style={{ color: '#C4704B' }}>3,200</span></div>
                  <div className="flex justify-between"><span>NC Digital Divide</span><span className="font-mono">1.2M residents</span></div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="text-center mt-10">
              <Link href="/dashboard">
                <span
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold text-sm transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ background: 'rgba(27, 67, 50, 0.06)', color: '#1B4332', border: '1px solid rgba(27, 67, 50, 0.12)' }}
                  onClick={() => tbSoundEngine.play('nav_click')}
                >
                  View Simulated Dashboard
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          NAVIGATOR STORIES — Real Scenarios from SPAN §5.3
          ============================================ */}
      <section className="py-24 md:py-32" style={{ background: 'rgba(27, 67, 50, 0.03)' }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>From SPAN §5.3 — Training Scenarios</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#1B4332' }}>
                Every session is a bridge crossed
              </h2>
              <p className="text-sm mt-3" style={{ color: '#5a6c5a' }}>These are the real training scenarios from the SPAN document that every Navigator studies.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {STORIES.map((story, i) => (
              <Reveal key={story.name} delay={i * 0.1}>
                <motion.div
                  className="rounded-2xl p-6 h-full group cursor-pointer"
                  style={{ background: 'white', border: '1px solid #e8e0d0', boxShadow: '0 4px 20px rgba(27, 67, 50, 0.04)' }}
                  whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(27, 67, 50, 0.1)' }}
                  onHoverStart={() => tbSoundEngine.play('story_reveal')}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{story.emoji}</span>
                    <div>
                      <h3 className="font-display text-base font-bold" style={{ color: '#1B4332' }}>{story.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md" style={{ background: 'rgba(201, 162, 39, 0.1)', color: '#C9A227' }}>{story.domain}</span>
                        <span className="text-xs font-mono" style={{ color: '#7C9A6E' }}>{story.time}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mb-3 leading-relaxed" style={{ color: '#2D3436' }}>{story.issue}</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: story.outcome.startsWith('Resolved') ? '#22c55e' : '#C9A227' }} />
                    <span className="text-xs font-mono" style={{ color: story.outcome.startsWith('Resolved') ? '#2D6A4F' : '#C9A227' }}>{story.outcome}</span>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SUCCESS MOMENT — Full-width Photo Section
          ============================================ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.successMoment} alt="Community member celebrating a digital success" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, rgba(27, 67, 50, 0.88), rgba(27, 67, 50, 0.5))' }} />
        </div>
        <div className="container relative z-10">
          <Reveal direction="right">
            <div className="max-w-xl ml-auto text-right">
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>The Moment</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: '#FDF8F0' }}>
                This is what crossing the bridge looks like.
              </h2>
              <p className="text-base mb-4 leading-relaxed" style={{ color: 'rgba(253, 248, 240, 0.85)' }}>
                When Dorothy completed her first telehealth appointment after 40 minutes with her Digital Navigator — Apple ID reset, portal app installed, account created, appointment booked — that's not a tech task. That's a life changed.
              </p>
              <p className="text-sm italic mb-6" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>— From SPAN §5.3: Dorothy's Scenario</p>
              <Link href="/get-help">
                <span
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-sm transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ background: '#C9A227', color: '#1B4332' }}
                  onClick={() => tbSoundEngine.play('nav_click')}
                >
                  Get Help Today
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <Footer />
    </div>
  );
}
