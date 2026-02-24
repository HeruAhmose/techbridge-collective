"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, LineChart, Line, CartesianGrid,
} from "recharts";

// ── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  ink:    "#0c1a14",
  forest: "#133a25",
  moss:   "#1e5435",
  sage:   "#2d7a4a",
  gold:   "#d4a843",
  amber:  "#f0c060",
  cream:  "#f7f3ec",
  teal:   "#5bbfa0",
  mist:   "#8a9e92",
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────
type CategoryRow = { name: string; minutes: number; sessions: number };
type HubRow      = { name: string; minutes: number; sessions: number };
type WeekRow     = { week: string; minutes: number; sessions: number };
type LogRow      = { id: number; hub: string; cat: string; min: number; outcome: string; time: string };
type WindowData  = {
  minutes: number; sessions: number; resolved: number; needsHelp: number; followUp: number;
  categories: CategoryRow[]; hubs: HubRow[]; weekly: WeekRow[]; log: LogRow[];
};
type TabId = "overview" | "categories" | "trends" | "sessions" | "hk";

// ── Static dataset ────────────────────────────────────────────────────────────
const DATA: Record<number, WindowData> = {
  30: {
    minutes: 2847, sessions: 94, resolved: 71, needsHelp: 14, followUp: 9,
    categories: [
      { name: "Job applications", minutes: 684, sessions: 23 },
      { name: "Benefits portals", minutes: 531, sessions: 18 },
      { name: "Email recovery",   minutes: 390, sessions: 13 },
      { name: "Device setup",     minutes: 354, sessions: 12 },
      { name: "School portals",   minutes: 312, sessions: 10 },
      { name: "Telehealth",       minutes: 288, sessions:  9 },
      { name: "Doc uploads",      minutes: 174, sessions:  6 },
      { name: "Other",            minutes: 114, sessions:  3 },
    ],
    hubs: [
      { name: "Durham Library",  minutes: 1692, sessions: 56 },
      { name: "Raleigh Digital", minutes: 1155, sessions: 38 },
    ],
    weekly: [
      { week: "Apr 28", minutes: 540, sessions: 18 },
      { week: "May 5",  minutes: 720, sessions: 23 },
      { week: "May 12", minutes: 612, sessions: 20 },
      { week: "May 19", minutes: 810, sessions: 27 },
      { week: "May 26", minutes: 165, sessions:  6 },
    ],
    log: [
      { id:1, hub:"Durham Library",  cat:"Job applications", min:28, outcome:"RESOLVED",   time:"Today 2:41 PM" },
      { id:2, hub:"Raleigh Digital", cat:"Benefits portals", min:45, outcome:"RESOLVED",   time:"Today 1:15 PM" },
      { id:3, hub:"Durham Library",  cat:"Email recovery",   min:20, outcome:"FOLLOW_UP",  time:"Today 11:30 AM" },
      { id:4, hub:"Raleigh Digital", cat:"Device setup",     min:35, outcome:"RESOLVED",   time:"Today 10:02 AM" },
      { id:5, hub:"Durham Library",  cat:"School portals",   min:18, outcome:"NEEDS_HELP", time:"Yesterday 3:22 PM" },
      { id:6, hub:"Raleigh Digital", cat:"Telehealth",       min:40, outcome:"RESOLVED",   time:"Yesterday 2:10 PM" },
      { id:7, hub:"Durham Library",  cat:"Job applications", min:55, outcome:"RESOLVED",   time:"Yesterday 11:45 AM" },
      { id:8, hub:"Durham Library",  cat:"Doc uploads",      min:22, outcome:"RESOLVED",   time:"May 27 3:05 PM" },
    ],
  },
  60: {
    minutes: 5940, sessions: 197, resolved: 152, needsHelp: 28, followUp: 17,
    categories: [
      { name: "Job applications", minutes: 1440, sessions: 48 },
      { name: "Benefits portals", minutes: 1110, sessions: 37 },
      { name: "Email recovery",   minutes:  810, sessions: 27 },
      { name: "Device setup",     minutes:  720, sessions: 24 },
      { name: "School portals",   minutes:  645, sessions: 21 },
      { name: "Telehealth",       minutes:  600, sessions: 20 },
      { name: "Doc uploads",      minutes:  375, sessions: 13 },
      { name: "Other",            minutes:  240, sessions:  7 },
    ],
    hubs: [
      { name: "Durham Library",  minutes: 3540, sessions: 118 },
      { name: "Raleigh Digital", minutes: 2400, sessions:  79 },
    ],
    weekly: [
      { week: "Mar 31", minutes: 480, sessions: 16 },
      { week: "Apr 7",  minutes: 660, sessions: 22 },
      { week: "Apr 14", minutes: 540, sessions: 18 },
      { week: "Apr 21", minutes: 720, sessions: 24 },
      { week: "Apr 28", minutes: 840, sessions: 28 },
      { week: "May 5",  minutes: 900, sessions: 30 },
      { week: "May 12", minutes: 780, sessions: 26 },
      { week: "May 19", minutes: 900, sessions: 30 },
      { week: "May 26", minutes: 120, sessions:  3 },
    ],
    log: [
      { id:1, hub:"Durham Library",  cat:"Job applications", min:28, outcome:"RESOLVED",   time:"Today 2:41 PM" },
      { id:2, hub:"Raleigh Digital", cat:"Benefits portals", min:45, outcome:"RESOLVED",   time:"Today 1:15 PM" },
      { id:3, hub:"Durham Library",  cat:"Email recovery",   min:20, outcome:"FOLLOW_UP",  time:"Today 11:30 AM" },
      { id:4, hub:"Raleigh Digital", cat:"Device setup",     min:35, outcome:"RESOLVED",   time:"Today 10:02 AM" },
      { id:5, hub:"Durham Library",  cat:"School portals",   min:18, outcome:"NEEDS_HELP", time:"Yesterday 3:22 PM" },
      { id:6, hub:"Raleigh Digital", cat:"Telehealth",       min:40, outcome:"RESOLVED",   time:"Yesterday 2:10 PM" },
      { id:7, hub:"Durham Library",  cat:"Job applications", min:55, outcome:"RESOLVED",   time:"May 6 11:45 AM" },
      { id:8, hub:"Durham Library",  cat:"Doc uploads",      min:22, outcome:"RESOLVED",   time:"May 6 3:05 PM" },
    ],
  },
  90: {
    minutes: 9180, sessions: 306, resolved: 238, needsHelp: 43, followUp: 25,
    categories: [
      { name: "Job applications", minutes: 2220, sessions: 74 },
      { name: "Benefits portals", minutes: 1710, sessions: 57 },
      { name: "Email recovery",   minutes: 1230, sessions: 41 },
      { name: "Device setup",     minutes: 1110, sessions: 37 },
      { name: "School portals",   minutes:  990, sessions: 33 },
      { name: "Telehealth",       minutes:  900, sessions: 30 },
      { name: "Doc uploads",      minutes:  570, sessions: 19 },
      { name: "Other",            minutes:  450, sessions: 15 },
    ],
    hubs: [
      { name: "Durham Library",  minutes: 5460, sessions: 182 },
      { name: "Raleigh Digital", minutes: 3720, sessions: 124 },
    ],
    weekly: [
      { week: "Mar 3",  minutes:  420, sessions: 14 },
      { week: "Mar 10", minutes:  600, sessions: 20 },
      { week: "Mar 17", minutes:  540, sessions: 18 },
      { week: "Mar 24", minutes:  780, sessions: 26 },
      { week: "Mar 31", minutes:  660, sessions: 22 },
      { week: "Apr 7",  minutes:  840, sessions: 28 },
      { week: "Apr 14", minutes:  720, sessions: 24 },
      { week: "Apr 21", minutes:  960, sessions: 32 },
      { week: "Apr 28", minutes:  900, sessions: 30 },
      { week: "May 5",  minutes: 1020, sessions: 34 },
      { week: "May 12", minutes:  900, sessions: 30 },
      { week: "May 19", minutes:  720, sessions: 24 },
      { week: "May 26", minutes:  120, sessions:  4 },
    ],
    log: [
      { id:1, hub:"Durham Library",  cat:"Job applications", min:28, outcome:"RESOLVED",   time:"Today 2:41 PM" },
      { id:2, hub:"Raleigh Digital", cat:"Benefits portals", min:45, outcome:"RESOLVED",   time:"Today 1:15 PM" },
      { id:3, hub:"Durham Library",  cat:"Email recovery",   min:20, outcome:"FOLLOW_UP",  time:"Today 11:30 AM" },
      { id:4, hub:"Raleigh Digital", cat:"Device setup",     min:35, outcome:"RESOLVED",   time:"Today 10:02 AM" },
      { id:5, hub:"Durham Library",  cat:"School portals",   min:18, outcome:"NEEDS_HELP", time:"Yesterday 3:22 PM" },
      { id:6, hub:"Raleigh Digital", cat:"Telehealth",       min:40, outcome:"RESOLVED",   time:"Yesterday 2:10 PM" },
      { id:7, hub:"Durham Library",  cat:"Job applications", min:55, outcome:"RESOLVED",   time:"Mar 15 11:45 AM" },
      { id:8, hub:"Durham Library",  cat:"Doc uploads",      min:22, outcome:"RESOLVED",   time:"Mar 8 3:05 PM" },
    ],
  },
};

// ── H.K. simulated responses ──────────────────────────────────────────────────
const HK_RESPONSES: Record<string, string> = {
  "I need help recovering my email account":
    "I can help! Which provider — Gmail, Outlook, or Yahoo?\n\nFor Gmail: accounts.google.com/signin/recovery → 'Forgot password?' → use your backup phone or email.\n\nFor Outlook: account.live.com/password/reset → account recovery form.\n\nWhich one are you trying to recover?",
  "I need help applying for jobs online":
    "Great goal! Here's the plan:\n\n1. NCWorks (ncworks.gov) — NC's free job board\n2. Set up your Indeed or LinkedIn profile\n3. Upload your resume as a PDF\n4. Use a simple cover letter template\n\nDo you already have a resume saved on your device?",
  "I need help setting up my phone":
    "Happy to help!\n• iPhone or Android?\n• Wi-Fi, email, apps, or something else?\n\nFor Wi-Fi on iPhone: Settings → Wi-Fi → tap your network → enter password.\nFor Android: Settings → Connections → Wi-Fi → tap network → enter password.\n\nWhat would you like to tackle first?",
  "I need help setting up a telehealth appointment":
    "Most providers use Zoom, MyChart, or their own app.\n\nFor MyChart:\n1. Download the MyChart app\n2. Sign in with date of birth + zip code\n3. Tap 'Schedule Visit' → 'Video Visit'\n\nWhich health system are you scheduling with?",
  "I need help uploading documents online":
    "The process is similar everywhere:\n1. Find the 'Upload' or 'Attach' button\n2. Tap 'Choose file'\n3. Navigate to your file (Downloads, Photos)\n4. Tap to select, then confirm\n\nAccepted formats: PDF, JPG, or PNG.\n\nAre you uploading to a benefits portal, employer, or somewhere else?",
  "I need help resetting a password safely":
    "Here's the safe way:\n1. Go directly to the official website — never click links in emails\n2. Click 'Forgot password?' on the login page\n3. Enter your email — a reset link will arrive\n4. Use the link within 15 min (they expire)\n5. New password: 12+ characters, mix letters + numbers + symbols\n\n⚠️ Never share the reset link.\n\nWhich account are you resetting?",
};

const HK_PROMPTS = [
  { emoji: "📧", label: "Recover my email",       msg: "I need help recovering my email account" },
  { emoji: "💼", label: "Apply for jobs online",   msg: "I need help applying for jobs online" },
  { emoji: "📱", label: "Set up my phone",         msg: "I need help setting up my phone" },
  { emoji: "🏥", label: "Set up telehealth",       msg: "I need help setting up a telehealth appointment" },
  { emoji: "📁", label: "Upload documents",        msg: "I need help uploading documents online" },
  { emoji: "🔑", label: "Reset a password safely", msg: "I need help resetting a password safely" },
];

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: "overview",   icon: "📊", label: "Overview"   },
  { id: "categories", icon: "📋", label: "Categories" },
  { id: "trends",     icon: "📈", label: "Trends"     },
  { id: "sessions",   icon: "🗂",  label: "Sessions"   },
  { id: "hk",         icon: "🤖", label: "H.K. AI"   },
];

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCounter(target: number): number {
  const [val, setVal] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = prev.current;
    const diff  = target - start;
    const t0    = performance.now();
    const dur   = 800;
    function tick(now: number) {
      const p = Math.min((now - t0) / dur, 1);
      const e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setVal(Math.round(start + diff * e));
      if (p < 1) requestAnimationFrame(tick);
      else prev.current = target;
    }
    requestAnimationFrame(tick);
  }, [target]);
  return val;
}

// ── Small shared components ───────────────────────────────────────────────────
function KPI({ label, value, suffix = "", dim }: { label: string; value: number; suffix?: string; dim?: string }) {
  const v = useCounter(value);
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 38, fontWeight: 800, color: C.gold, lineHeight: 1 }}>
        {v.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.2em", color: C.mist, marginTop: 8, textTransform: "uppercase" }}>{label}</div>
      {dim && <div style={{ fontSize: 10, color: C.mist, opacity: 0.5, marginTop: 3 }}>{dim}</div>}
    </div>
  );
}

function ChartTip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.ink, border: `1px solid ${C.gold}33`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: C.cream }}>
      <div style={{ fontWeight: 700, color: C.gold, marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
          <span style={{ color: C.mist }}>{p.name}</span>
          <span style={{ fontWeight: 700 }}>{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function OutcomePill({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    RESOLVED:   { bg: "#d1fae5", color: "#065f46", label: "Resolved" },
    NEEDS_HELP: { bg: "#fef3c7", color: "#92400e", label: "Needs Help" },
    FOLLOW_UP:  { bg: "#e2e8f0", color: "#334155", label: "Follow-Up" },
  };
  const c = cfg[status] ?? { bg: "#eee", color: "#333", label: status };
  return (
    <span style={{ background: c.bg, color: c.color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>
      {c.label}
    </span>
  );
}

function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
      fontSize: 12, fontWeight: 700, transition: "all .15s",
      background: active ? C.gold : "rgba(255,255,255,0.05)",
      color: active ? C.ink : C.mist,
    }}>
      {label}
    </button>
  );
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 12px", borderRadius: 7, border: "none", cursor: "pointer",
      fontSize: 12, fontWeight: 700, transition: "all .15s",
      background: active ? C.gold : "rgba(255,255,255,0.07)",
      color: active ? C.ink : C.mist,
    }}>
      {label}
    </button>
  );
}

const panel: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 14,
  padding: 22,
};

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function TechBridgeDashboard() {
  const [win,      setWin]      = useState<30 | 60 | 90>(30);
  const [hub,      setHub]      = useState("All hubs");
  const [tab,      setTab]      = useState<TabId>("overview");
  const [logFx,    setLogFx]    = useState("ALL");
  const [hkThread, setHkThread] = useState<Array<{ role: "user" | "hk"; text: string }>>([]);
  const [hkTyping, setHkTyping] = useState(false);
  const threadEnd = useRef<HTMLDivElement>(null);

  const d     = DATA[win];
  const ratio = hub === "Durham Library" ? 0.594 : hub === "Raleigh Digital" ? 0.406 : 1;

  const totalMin  = Math.round(d.minutes  * ratio);
  const totalSess = Math.round(d.sessions * ratio);
  const resolvedN = Math.round(d.resolved * ratio);
  const rate      = totalSess > 0 ? Math.round((resolvedN / totalSess) * 100) : 0;

  const cats = useMemo<CategoryRow[]>(() =>
    ratio === 1
      ? d.categories
      : d.categories.map(c => ({ ...c, minutes: Math.round(c.minutes * ratio), sessions: Math.round(c.sessions * ratio) })),
    [d, ratio],
  );

  const pieData  = [
    { name: "Resolved",   value: Math.round(d.resolved  * ratio) },
    { name: "Needs Help", value: Math.round(d.needsHelp * ratio) },
    { name: "Follow-Up",  value: Math.round(d.followUp  * ratio) },
  ];
  const pieColors = [C.teal, C.gold, C.mist];

  const hubRows = hub === "All hubs"
    ? d.hubs
    : d.hubs.filter(h => h.name.includes(hub === "Durham Library" ? "Durham" : "Raleigh"));

  const filteredLog = useMemo(() => {
    let rows = d.log;
    if (hub !== "All hubs") rows = rows.filter(r => r.hub.includes(hub === "Durham Library" ? "Durham" : "Raleigh"));
    if (logFx !== "ALL")    rows = rows.filter(r => r.outcome === logFx);
    return rows;
  }, [d.log, hub, logFx]);

  const sendHK = useCallback((msg: string) => {
    setHkThread(prev => [...prev, { role: "user", text: msg }]);
    setHkTyping(true);
    setTimeout(() => {
      const resp = HK_RESPONSES[msg] ?? "Let me help with that! Could you tell me a bit more so I can give you exact steps?";
      setHkThread(prev => [...prev, { role: "hk", text: resp }]);
      setHkTyping(false);
    }, 1000 + Math.random() * 800);
  }, []);

  useEffect(() => { threadEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [hkThread, hkTyping]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.ink, fontFamily: "var(--font-outfit, 'Segoe UI', system-ui, sans-serif)", color: C.cream, fontSize: 14 }}>

      {/* ── Control bar ─────────────────────────────────────────────────── */}
      <div style={{ background: C.forest, borderBottom: `1px solid ${C.gold}22`, position: "sticky", top: 64, zIndex: 30 }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.cream }}>TechMinutes® Dashboard</span>
            <div style={{ background: `${C.gold}18`, border: `1px solid ${C.gold}44`, borderRadius: 999, padding: "2px 10px", fontSize: 10, fontWeight: 700, color: C.gold, fontFamily: "monospace", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, display: "inline-block" }} />
              SAMPLE DATA · SEEDS ON DEPLOY
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 3 }}>
              {([30, 60, 90] as const).map(w => (
                <Pill key={w} label={`${w}d`} active={win === w} onClick={() => setWin(w)} />
              ))}
            </div>
            <select
              value={hub}
              onChange={e => setHub(e.target.value)}
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 600, color: C.cream, cursor: "pointer" }}
            >
              {["All hubs", "Durham Library", "Raleigh Digital"].map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Tab bar ─────────────────────────────────────────────────────── */}
      <div style={{ background: `${C.forest}aa`, borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "10px 20px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {TABS.map(t => (
            <TabBtn key={t.id} label={`${t.icon} ${t.label}`} active={tab === t.id} onClick={() => setTab(t.id)} />
          ))}
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "24px 20px 60px" }}>

        {/* KPI strip — always visible */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
          <KPI label="TechMinutes"      value={totalMin}  dim={`Last ${win}d${hub !== "All hubs" ? ` · ${hub}` : ""}`} />
          <KPI label="Sessions"         value={totalSess} dim={`Last ${win}d`} />
          <KPI label="Resolution Rate"  value={rate}      suffix="%" dim="Sessions fully resolved" />
          <KPI label="Hubs Active"      value={hub === "All hubs" ? 2 : 1} dim="Durham + Raleigh" />
        </div>

        {/* ── OVERVIEW ──────────────────────────────────────────────────── */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18 }}>
            <div style={panel}>
              <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.2em", color: C.mist, marginBottom: 4, textTransform: "uppercase" }}>
                Top categories · last {win}d
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Where time is spent</div>
              <ResponsiveContainer width="100%" height={290}>
                <BarChart data={cats} layout="vertical" margin={{ left: 8, right: 16, top: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fill: C.mist, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={115} tick={{ fill: C.mist, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="minutes" name="Minutes" radius={[0, 6, 6, 0]}>
                    {cats.map((_, i) => <Cell key={i} fill={i === 0 ? C.gold : i < 3 ? C.sage : C.moss} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Outcomes donut */}
              <div style={{ ...panel, flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Session outcomes</div>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={76} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                    </Pie>
                    <Tooltip content={<ChartTip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                  {pieData.map((p, i) => (
                    <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.mist }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: pieColors[i], display: "inline-block" }} />
                      {p.name}: <strong style={{ color: C.cream }}>{p.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hub bars */}
              <div style={panel}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>By hub</div>
                {hubRows.map(h => {
                  const pct = hub === "All hubs" ? Math.round(h.minutes / d.minutes * 100) : 100;
                  return (
                    <div key={h.name} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                        <span style={{ color: C.mist }}>{h.name}</span>
                        <span style={{ color: C.gold, fontWeight: 700 }}>{h.minutes.toLocaleString()}m · {h.sessions} sessions</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 999, width: `${pct}%`, background: h.name.includes("Durham") ? C.sage : C.teal, transition: "width .6s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── CATEGORIES ────────────────────────────────────────────────── */}
        {tab === "categories" && (
          <div style={panel}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>
              Category breakdown · last {win}d · {hub}
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.09)" }}>
                    {["Category", "Minutes", "Sessions", "Avg min/session", "Share"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: C.mist, fontWeight: 600, fontSize: 10, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cats.map((c, i) => {
                    const total = cats.reduce((a, x) => a + x.minutes, 0);
                    const share = total > 0 ? Math.round(c.minutes / total * 100) : 0;
                    return (
                      <tr key={c.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: i % 2 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 600 }}>{c.name}</td>
                        <td style={{ padding: "12px 14px", color: C.gold, fontWeight: 700, fontFamily: "monospace" }}>{c.minutes.toLocaleString()}</td>
                        <td style={{ padding: "12px 14px", color: C.mist }}>{c.sessions}</td>
                        <td style={{ padding: "12px 14px", color: C.mist }}>{c.sessions ? Math.round(c.minutes / c.sessions) : 0}</td>
                        <td style={{ padding: "12px 14px", minWidth: 150 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ height: 6, flex: 1, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                              <div style={{ height: "100%", borderRadius: 999, width: `${share}%`, background: i === 0 ? C.gold : C.sage, transition: "width .5s" }} />
                            </div>
                            <span style={{ fontSize: 11, color: C.mist, minWidth: 28 }}>{share}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TRENDS ────────────────────────────────────────────────────── */}
        {tab === "trends" && (
          <div style={{ display: "grid", gap: 18 }}>
            <div style={panel}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Weekly volume</div>
              <div style={{ fontSize: 12, color: C.mist, marginBottom: 18 }}>TechMinutes® and sessions over time · last {win}d</div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={d.weekly} margin={{ left: 0, right: 16, top: 4, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: C.mist, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: C.mist, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="minutes"  name="Minutes"  stroke={C.gold} strokeWidth={2.5} dot={{ fill: C.gold, r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="sessions" name="Sessions" stroke={C.teal} strokeWidth={2}   dot={{ fill: C.teal, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div style={panel}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Performance indicators</div>
                {[
                  { label: "Total sessions",     v: totalSess,                                            note: "+18% vs prior period" },
                  { label: "Avg session length", v: `${totalSess ? Math.round(totalMin / totalSess) : 0}m`, note: "Stable" },
                  { label: "Resolution rate",    v: `${rate}%`,                                            note: "+3pts vs prior period" },
                  { label: "Escalation rate",    v: `${Math.round(d.needsHelp / d.sessions * 100)}%`,     note: "Below 20% target ✓" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div>
                      <div style={{ fontSize: 13, color: C.mist }}>{r.label}</div>
                      <div style={{ fontSize: 10, color: C.mist, opacity: 0.5, marginTop: 2 }}>{r.note}</div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.gold }}>{r.v}</div>
                  </div>
                ))}
              </div>

              <div style={panel}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Funding pipeline</div>
                {([
                  ["Bold Path Fellowship",  "$120K",       "Active — current"],
                  ["NTIA Digital Equity",   "$500K–$3M",   "Eligible"],
                  ["DOL WORC Initiative",   "$500K–$2.5M", "Aligned"],
                  ["Google.org",            "$100K–$1.5M", "Target"],
                  ["Cisco Global Impact",   "$250K–$1M+",  "Prospecting"],
                ] as const).map(([name, amt, status]) => (
                  <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{name}</div>
                      <div style={{ fontSize: 10, marginTop: 1, color: status === "Active — current" ? C.teal : C.mist, fontWeight: status === "Active — current" ? 700 : 400 }}>{status}</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, fontFamily: "monospace" }}>{amt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SESSION LOG ───────────────────────────────────────────────── */}
        {tab === "sessions" && (
          <div style={panel}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>TechMinutes® session log</div>
                <div style={{ fontSize: 12, color: C.mist, marginTop: 3 }}>Non-PII only — no names, no contact info stored</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["ALL", "RESOLVED", "NEEDS_HELP", "FOLLOW_UP"].map(f => (
                  <Pill key={f} active={logFx === f} onClick={() => setLogFx(f)}
                    label={f === "ALL" ? "All" : f === "NEEDS_HELP" ? "Needs Help" : f === "FOLLOW_UP" ? "Follow-Up" : "Resolved"} />
                ))}
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.09)" }}>
                    {["Hub", "Category", "Minutes", "Outcome", "Logged"].map(h => (
                      <th key={h} style={{ padding: "8px 14px", textAlign: "left", color: C.mist, fontWeight: 600, fontSize: 10, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLog.map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: i % 2 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6, background: r.hub.includes("Durham") ? `${C.sage}33` : `${C.teal}33`, color: r.hub.includes("Durham") ? C.sage : C.teal }}>
                          {r.hub}
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontWeight: 600 }}>{r.cat}</td>
                      <td style={{ padding: "11px 14px", color: C.gold, fontFamily: "monospace", fontWeight: 700 }}>{r.min}m</td>
                      <td style={{ padding: "11px 14px" }}><OutcomePill status={r.outcome} /></td>
                      <td style={{ padding: "11px 14px", color: C.mist, fontSize: 12 }}>{r.time}</td>
                    </tr>
                  ))}
                  {filteredLog.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: 32, textAlign: "center", color: C.mist }}>No records match this filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 18, padding: "12px 16px", borderRadius: 10, background: `${C.forest}88`, border: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: C.mist, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <span><strong style={{ color: C.cream }}>Export:</strong></span>
              <a href="/api/reports/monthly?format=pdf" style={{ color: C.gold, fontWeight: 700, textDecoration: "none" }}>↓ PDF</a>
              <a href="/api/reports/monthly?format=csv" style={{ color: C.gold, fontWeight: 700, textDecoration: "none" }}>↓ CSV</a>
              <span style={{ opacity: 0.5 }}>Partners receive monthly reports automatically.</span>
            </div>
          </div>
        )}

        {/* ── H.K. AI ───────────────────────────────────────────────────── */}
        {tab === "hk" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18, alignItems: "start" }}>
            <div style={panel}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>H.K. AI Navigator</div>
              <div style={{ fontSize: 12, color: C.mist, marginTop: 3, marginBottom: 18 }}>
                Named for Horace King — 19th-century bridge builder. Simulated for demo; live Chatbase widget is in the bottom-right corner.
              </div>

              <div style={{ minHeight: 300, maxHeight: 420, overflowY: "auto", borderRadius: 10, background: "rgba(0,0,0,0.2)", padding: 16, marginBottom: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {hkThread.length === 0 && (
                  <div style={{ color: C.mist, fontSize: 13, textAlign: "center", paddingTop: 48, opacity: 0.5 }}>
                    Choose a quick-start prompt on the right →
                  </div>
                )}
                {hkThread.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "82%", padding: "10px 14px", borderRadius: 12, fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-line",
                      background: m.role === "user" ? C.gold : "rgba(255,255,255,0.08)",
                      color: m.role === "user" ? C.ink : C.cream,
                      borderBottomRightRadius: m.role === "user" ? 2 : 12,
                      borderBottomLeftRadius: m.role === "hk" ? 2 : 12,
                    }}>
                      {m.role === "hk" && <div style={{ fontSize: 10, fontWeight: 700, color: C.teal, marginBottom: 4 }}>H.K. AI</div>}
                      {m.text}
                    </div>
                  </div>
                ))}
                {hkTyping && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.mist, fontSize: 12 }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[0, 1, 2].map(i => (
                        <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.mist, display: "inline-block", opacity: 0.6 }} />
                      ))}
                    </div>
                    H.K. is typing…
                  </div>
                )}
                <div ref={threadEnd} />
              </div>

              <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.teal}11`, border: `1px solid ${C.teal}33`, fontSize: 11, color: C.mist }}>
                ⚠️ <strong style={{ color: C.teal }}>Safety:</strong> H.K. never asks for passwords, SSNs, bank info, or 2FA codes.
              </div>
            </div>

            <div style={panel}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Quick starts</div>
              <div style={{ fontSize: 12, color: C.mist, marginBottom: 16 }}>Click any to simulate a conversation.</div>
              <div style={{ display: "grid", gap: 9 }}>
                {HK_PROMPTS.map(p => (
                  <button
                    key={p.label}
                    disabled={hkTyping}
                    onClick={() => sendHK(p.msg)}
                    style={{
                      padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.04)", cursor: hkTyping ? "not-allowed" : "pointer",
                      fontSize: 13, color: C.cream, textAlign: "left", display: "flex", alignItems: "center", gap: 10,
                      transition: "background .15s", opacity: hkTyping ? 0.6 : 1,
                    }}
                    onMouseEnter={e => { if (!hkTyping) (e.currentTarget).style.background = "rgba(255,255,255,0.09)"; }}
                    onMouseLeave={e => { (e.currentTarget).style.background = "rgba(255,255,255,0.04)"; }}
                  >
                    <span style={{ fontSize: 18 }}>{p.emoji}</span>
                    <span style={{ fontWeight: 600 }}>{p.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 18, padding: 14, borderRadius: 10, background: `${C.forest}99`, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 6 }}>24/7 availability</div>
                <div style={{ fontSize: 12, color: C.mist, lineHeight: 1.5 }}>
                  H.K. handles off-hours triage so Navigators focus on the most complex in-person sessions.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Bottom CTA ────────────────────────────────────────────────── */}
        <div style={{ marginTop: 32, padding: "24px 28px", borderRadius: 16, background: C.gold, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>Ready to bring a hub to your community?</div>
            <div style={{ fontSize: 12, color: `${C.ink}99`, marginTop: 3 }}>15 minutes. Durham + Raleigh launching May 2026.</div>
          </div>
          <a href="/host-a-hub#book" style={{ padding: "11px 22px", borderRadius: 10, background: C.ink, color: C.cream, fontWeight: 800, fontSize: 13, textDecoration: "none" }}>
            Book a Pilot Call →
          </a>
        </div>
      </div>

      <style>{`
        select option { background: ${C.ink}; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 999px; }
      `}</style>
    </div>
  );
}
