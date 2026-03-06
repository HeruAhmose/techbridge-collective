/**
 * TechBridge Collective — TechMinutes® Dashboard
 * God-tier treatment: animated charts, live metrics, 5 tabs, bridge theme
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';

// ── Color System ──
const C = {
  forest: '#1B4332', deepForest: '#0F2B1F', gold: '#C9A227', cream: '#FDF8F0',
  sage: '#2D6A4F', terra: '#C4704B', mist: '#7C9A6E',
};

// ── Data Generators ──
function genOverviewData() {
  return {
    totalMinutes: 2847 + Math.floor(Math.random() * 50),
    totalSessions: 94 + Math.floor(Math.random() * 5),
    resolutionRate: 74 + Math.floor(Math.random() * 6),
    avgDuration: 28 + Math.floor(Math.random() * 8),
    activeHubs: 2,
    weeklyGrowth: 8 + Math.floor(Math.random() * 7),
  };
}

function genCategoryData() {
  return [
    { name: 'Education', pct: 42, minutes: 1196, color: '#2D6A4F', icon: '📚' },
    { name: 'Workforce', pct: 28, minutes: 797, color: '#C9A227', icon: '💼' },
    { name: 'Health', pct: 18, minutes: 512, color: '#C4704B', icon: '🏥' },
    { name: 'Housing', pct: 12, minutes: 342, color: '#7C9A6E', icon: '🏠' },
  ];
}

function genTrendData() {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
  return weeks.map((w, i) => ({
    week: w,
    minutes: 200 + i * 80 + Math.floor(Math.random() * 100),
    sessions: 6 + i * 2 + Math.floor(Math.random() * 5),
  }));
}

function genSessionData() {
  const types = ['School Portal Access', 'Job Application Help', 'Telehealth Setup', 'Benefits Application', 'Housing Portal', 'Device Setup', 'Email Account Recovery', 'Resume Upload'];
  const statuses = ['resolved', 'follow-up', 'in-progress'] as const;
  const hubs = ['Durham Library', 'Raleigh Digital Impact'];
  return Array.from({ length: 12 }, (_, i) => ({
    id: `SES-${String(i + 1).padStart(3, '0')}`,
    type: types[Math.floor(Math.random() * types.length)],
    hub: hubs[Math.floor(Math.random() * hubs.length)],
    duration: 10 + Math.floor(Math.random() * 50),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(Date.now() - Math.random() * 14 * 86400000).toLocaleDateString(),
  }));
}

function genHKData() {
  return {
    totalQueries: 312 + Math.floor(Math.random() * 30),
    avgResponseTime: '1.2s',
    topTopics: [
      { topic: 'School Portal Login', count: 87 },
      { topic: 'Job Application Help', count: 64 },
      { topic: 'Telehealth Setup', count: 52 },
      { topic: 'Benefits Navigation', count: 41 },
      { topic: 'Housing Portal', count: 38 },
      { topic: 'Password Recovery', count: 30 },
    ],
    satisfaction: 92,
    escalationRate: 14,
  };
}

// ── Stat Card ──
function Stat({ label, value, suffix = '', sub, color = C.gold }: { label: string; value: string | number; suffix?: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl p-5 transition-all duration-300 hover:shadow-lg" style={{ background: 'rgba(253, 248, 240, 0.04)', border: '1px solid rgba(201, 162, 39, 0.12)' }}>
      <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: C.mist }}>{label}</p>
      <p className="font-display text-2xl md:text-3xl font-bold" style={{ color }}>{value}{suffix}</p>
      {sub && <p className="text-xs mt-1" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>{sub}</p>}
    </div>
  );
}

// ── Simple Bar Chart ──
function BarChart({ data, maxVal }: { data: { label: string; value: number; color: string }[]; maxVal: number }) {
  return (
    <div className="flex flex-col gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-xs font-mono w-20 shrink-0 text-right" style={{ color: C.cream }}>{d.label}</span>
          <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: 'rgba(253, 248, 240, 0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: d.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(d.value / maxVal) * 100}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className="text-xs font-mono w-12 shrink-0" style={{ color: C.gold }}>{d.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Tabs ──
const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'categories', label: 'Categories', icon: '📁' },
  { id: 'trends', label: 'Trends', icon: '📈' },
  { id: 'sessions', label: 'Sessions', icon: '📋' },
  { id: 'hk', label: 'H.K. AI', icon: '🌉' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function Dashboard() {
  const [tab, setTab] = useState<TabId>('overview');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(iv);
  }, []);

  const overview = useMemo(() => genOverviewData(), [tick]);
  const categories = useMemo(() => genCategoryData(), [tick]);
  const trends = useMemo(() => genTrendData(), [tick]);
  const sessions = useMemo(() => genSessionData(), [tick]);
  const hkData = useMemo(() => genHKData(), [tick]);

  const handleTabChange = (t: TabId) => {
    setTab(t);
    tbSoundEngine.play('nav_click');
  };

  return (
    <div className="min-h-screen pt-20" style={{ background: C.deepForest, color: C.cream }}>
      <div className="container py-8">
        {/* SIMULATED DATA BANNER */}
        <div className="mb-6 px-5 py-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(201, 162, 39, 0.08)', border: '1px solid rgba(201, 162, 39, 0.2)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div>
            <p className="text-sm font-display font-bold" style={{ color: C.gold }}>Simulated Dashboard</p>
            <p className="text-xs" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>This dashboard displays simulated data for demonstration purposes. Live data will populate once TechMinutes® tracking goes live at partner sites.</p>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-mono tracking-widest uppercase mb-2" style={{ color: C.gold }}>TechMinutes® Dashboard</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Impact Command Center</h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
            <span className="text-xs font-mono" style={{ color: '#22c55e' }}>Live · Updates every 30s</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300"
              style={{
                background: tab === t.id ? 'rgba(201, 162, 39, 0.15)' : 'transparent',
                color: tab === t.id ? C.gold : 'rgba(253, 248, 240, 0.6)',
                border: tab === t.id ? '1px solid rgba(201, 162, 39, 0.3)' : '1px solid transparent',
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Stat label="Total TechMinutes" value={overview.totalMinutes.toLocaleString()} />
                  <Stat label="Total Sessions" value={overview.totalSessions} />
                  <Stat label="Resolution Rate" value={overview.resolutionRate} suffix="%" color="#22c55e" />
                  <Stat label="Avg Duration" value={overview.avgDuration} suffix=" min" color={C.terra} />
                  <Stat label="Active Hubs" value={overview.activeHubs} color={C.sage} />
                  <Stat label="Weekly Growth" value={`+${overview.weeklyGrowth}`} suffix="%" color="#22c55e" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Category Breakdown */}
                  <div className="rounded-xl p-6" style={{ background: 'rgba(253, 248, 240, 0.03)', border: '1px solid rgba(201, 162, 39, 0.1)' }}>
                    <h3 className="font-display text-lg font-bold mb-4" style={{ color: C.gold }}>Issue Categories</h3>
                    <BarChart
                      data={categories.map(c => ({ label: c.name, value: c.minutes, color: c.color }))}
                      maxVal={Math.max(...categories.map(c => c.minutes))}
                    />
                  </div>

                  {/* Weekly Trend */}
                  <div className="rounded-xl p-6" style={{ background: 'rgba(253, 248, 240, 0.03)', border: '1px solid rgba(201, 162, 39, 0.1)' }}>
                    <h3 className="font-display text-lg font-bold mb-4" style={{ color: C.gold }}>Weekly Trend</h3>
                    <BarChart
                      data={trends.map(t => ({ label: t.week, value: t.minutes, color: C.sage }))}
                      maxVal={Math.max(...trends.map(t => t.minutes))}
                    />
                  </div>
                </div>

                {/* Recent Sessions */}
                <div className="rounded-xl p-6" style={{ background: 'rgba(253, 248, 240, 0.03)', border: '1px solid rgba(201, 162, 39, 0.1)' }}>
                  <h3 className="font-display text-lg font-bold mb-4" style={{ color: C.gold }}>Recent Sessions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(201, 162, 39, 0.15)' }}>
                          {['ID', 'Type', 'Hub', 'Duration', 'Status', 'Date'].map(h => (
                            <th key={h} className="text-left py-2 px-3 font-mono text-xs" style={{ color: C.mist }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.slice(0, 5).map(s => (
                          <tr key={s.id} style={{ borderBottom: '1px solid rgba(253, 248, 240, 0.04)' }}>
                            <td className="py-2 px-3 font-mono text-xs" style={{ color: C.gold }}>{s.id}</td>
                            <td className="py-2 px-3">{s.type}</td>
                            <td className="py-2 px-3 text-xs" style={{ color: C.mist }}>{s.hub}</td>
                            <td className="py-2 px-3 font-mono">{s.duration}m</td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded-full text-xs font-mono" style={{
                                background: s.status === 'resolved' ? 'rgba(34, 197, 94, 0.15)' : s.status === 'follow-up' ? 'rgba(201, 162, 39, 0.15)' : 'rgba(196, 112, 75, 0.15)',
                                color: s.status === 'resolved' ? '#22c55e' : s.status === 'follow-up' ? C.gold : C.terra,
                              }}>
                                {s.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-xs" style={{ color: C.mist }}>{s.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORIES */}
            {tab === 'categories' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map(c => (
                    <motion.div
                      key={c.name}
                      className="rounded-xl p-6 text-center transition-all duration-300"
                      style={{ background: 'rgba(253, 248, 240, 0.03)', border: `1px solid ${c.color}33` }}
                      whileHover={{ y: -4, boxShadow: `0 8px 30px ${c.color}22` }}
                    >
                      <span className="text-3xl mb-3 block">{c.icon}</span>
                      <h3 className="font-display text-lg font-bold mb-1" style={{ color: c.color }}>{c.name}</h3>
                      <p className="font-display text-3xl font-bold mb-1" style={{ color: C.cream }}>{c.pct}%</p>
                      <p className="text-xs font-mono" style={{ color: C.mist }}>{c.minutes.toLocaleString()} minutes</p>
                    </motion.div>
                  ))}
                </div>

                <div className="rounded-xl p-6" style={{ background: 'rgba(253, 248, 240, 0.03)', border: '1px solid rgba(201, 162, 39, 0.1)' }}>
                  <h3 className="font-display text-lg font-bold mb-6" style={{ color: C.gold }}>Category Distribution</h3>
                  {/* Visual bar breakdown */}
                  <div className="flex h-10 rounded-full overflow-hidden mb-4">
                    {categories.map(c => (
                      <motion.div
                        key={c.name}
                        style={{ background: c.color, width: `${c.pct}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${c.pct}%` }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center justify-center text-xs font-mono font-bold"
                        title={`${c.name}: ${c.pct}%`}
                      >
                        {c.pct > 15 && <span style={{ color: C.cream }}>{c.pct}%</span>}
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {categories.map(c => (
                      <div key={c.name} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                        <span className="text-sm" style={{ color: C.cream }}>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Issues per Category */}
                <div className="grid md:grid-cols-2 gap-6">
                  {categories.map(c => (
                    <div key={c.name} className="rounded-xl p-5" style={{ background: 'rgba(253, 248, 240, 0.03)', border: `1px solid ${c.color}22` }}>
                      <div className="flex items-center gap-2 mb-4">
                        <span>{c.icon}</span>
                        <h4 className="font-display font-bold" style={{ color: c.color }}>{c.name} — Top Issues</h4>
                      </div>
                      <ul className="space-y-2 text-sm">
                        {c.name === 'Education' && ['School portal login', 'Homework platform access', 'Parent-teacher comm', 'Enrollment forms'].map(i => <li key={i} style={{ color: C.cream }}>• {i}</li>)}
                        {c.name === 'Workforce' && ['Job application portals', 'Resume upload/formatting', 'Interview scheduling', 'Benefits enrollment'].map(i => <li key={i} style={{ color: C.cream }}>• {i}</li>)}
                        {c.name === 'Health' && ['Telehealth setup', 'Patient portal access', 'Prescription management', 'Insurance navigation'].map(i => <li key={i} style={{ color: C.cream }}>• {i}</li>)}
                        {c.name === 'Housing' && ['Rental applications', 'Housing authority portals', 'Utility assistance', 'Document uploads'].map(i => <li key={i} style={{ color: C.cream }}>• {i}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TRENDS */}
            {tab === 'trends' && (
              <div className="space-y-6">
                <div className="rounded-xl p-6" style={{ background: 'rgba(253, 248, 240, 0.03)', border: '1px solid rgba(201, 162, 39, 0.1)' }}>
                  <h3 className="font-display text-lg font-bold mb-6" style={{ color: C.gold }}>TechMinutes® Over Time</h3>
                  <div className="flex items-end gap-2 h-48">
                    {trends.map((t, i) => (
                      <div key={t.week} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-mono" style={{ color: C.gold }}>{t.minutes}</span>
                        <motion.div
                          className="w-full rounded-t-lg"
                          style={{ background: `linear-gradient(to top, ${C.sage}, ${C.gold})` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${(t.minutes / Math.max(...trends.map(t => t.minutes))) * 160}px` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                        <span className="text-[10px] font-mono" style={{ color: C.mist }}>{t.week.replace('Week ', 'W')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl p-6" style={{ background: 'rgba(253, 248, 240, 0.03)', border: '1px solid rgba(201, 162, 39, 0.1)' }}>
                  <h3 className="font-display text-lg font-bold mb-6" style={{ color: C.gold }}>Sessions Per Week</h3>
                  <div className="flex items-end gap-2 h-36">
                    {trends.map((t, i) => (
                      <div key={t.week} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-mono" style={{ color: C.terra }}>{t.sessions}</span>
                        <motion.div
                          className="w-full rounded-t-lg"
                          style={{ background: C.terra }}
                          initial={{ height: 0 }}
                          animate={{ height: `${(t.sessions / Math.max(...trends.map(t => t.sessions))) * 120}px` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                        <span className="text-[10px] font-mono" style={{ color: C.mist }}>{t.week.replace('Week ', 'W')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Stat label="Peak Week" value="Week 8" color={C.gold} sub="Highest activity recorded" />
                  <Stat label="Avg Weekly Minutes" value={Math.round(trends.reduce((s, t) => s + t.minutes, 0) / trends.length)} color={C.sage} sub="Across all hubs" />
                  <Stat label="Growth Trajectory" value="+12" suffix="%" color="#22c55e" sub="Week-over-week average" />
                </div>
              </div>
            )}

            {/* SESSIONS */}
            {tab === 'sessions' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Stat label="Resolved" value={sessions.filter(s => s.status === 'resolved').length} color="#22c55e" />
                  <Stat label="Follow-up" value={sessions.filter(s => s.status === 'follow-up').length} color={C.gold} />
                  <Stat label="In Progress" value={sessions.filter(s => s.status === 'in-progress').length} color={C.terra} />
                </div>

                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(201, 162, 39, 0.1)' }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: 'rgba(201, 162, 39, 0.08)' }}>
                          {['ID', 'Type', 'Hub', 'Duration', 'Status', 'Date'].map(h => (
                            <th key={h} className="text-left py-3 px-4 font-mono text-xs" style={{ color: C.gold }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map((s, i) => (
                          <motion.tr
                            key={s.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            style={{ borderBottom: '1px solid rgba(253, 248, 240, 0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(253, 248, 240, 0.02)' }}
                          >
                            <td className="py-3 px-4 font-mono text-xs" style={{ color: C.gold }}>{s.id}</td>
                            <td className="py-3 px-4">{s.type}</td>
                            <td className="py-3 px-4 text-xs" style={{ color: C.mist }}>{s.hub}</td>
                            <td className="py-3 px-4 font-mono">{s.duration}m</td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold" style={{
                                background: s.status === 'resolved' ? 'rgba(34, 197, 94, 0.15)' : s.status === 'follow-up' ? 'rgba(201, 162, 39, 0.15)' : 'rgba(196, 112, 75, 0.15)',
                                color: s.status === 'resolved' ? '#22c55e' : s.status === 'follow-up' ? C.gold : C.terra,
                              }}>
                                {s.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs" style={{ color: C.mist }}>{s.date}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* H.K. AI */}
            {tab === 'hk' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Stat label="Total Queries" value={hkData.totalQueries} />
                  <Stat label="Avg Response" value={hkData.avgResponseTime} color={C.sage} />
                  <Stat label="Satisfaction" value={hkData.satisfaction} suffix="%" color="#22c55e" />
                  <Stat label="Escalation Rate" value={hkData.escalationRate} suffix="%" color={C.terra} />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-xl p-6" style={{ background: 'rgba(253, 248, 240, 0.03)', border: '1px solid rgba(201, 162, 39, 0.1)' }}>
                    <h3 className="font-display text-lg font-bold mb-4" style={{ color: C.gold }}>Top Query Topics</h3>
                    <BarChart
                      data={hkData.topTopics.map(t => ({ label: t.topic.split(' ').slice(0, 2).join(' '), value: t.count, color: C.sage }))}
                      maxVal={Math.max(...hkData.topTopics.map(t => t.count))}
                    />
                  </div>

                  <div className="rounded-xl p-6" style={{ background: 'rgba(253, 248, 240, 0.03)', border: '1px solid rgba(201, 162, 39, 0.1)' }}>
                    <h3 className="font-display text-lg font-bold mb-4" style={{ color: C.gold }}>H.K. Performance</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: C.cream }}>Self-Resolved</span>
                          <span className="font-mono" style={{ color: '#22c55e' }}>{100 - hkData.escalationRate}%</span>
                        </div>
                        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(253, 248, 240, 0.06)' }}>
                          <motion.div className="h-full rounded-full" style={{ background: '#22c55e' }} initial={{ width: 0 }} animate={{ width: `${100 - hkData.escalationRate}%` }} transition={{ duration: 1 }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: C.cream }}>Escalated to Navigator</span>
                          <span className="font-mono" style={{ color: C.terra }}>{hkData.escalationRate}%</span>
                        </div>
                        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(253, 248, 240, 0.06)' }}>
                          <motion.div className="h-full rounded-full" style={{ background: C.terra }} initial={{ width: 0 }} animate={{ width: `${hkData.escalationRate}%` }} transition={{ duration: 1 }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: C.cream }}>User Satisfaction</span>
                          <span className="font-mono" style={{ color: C.gold }}>{hkData.satisfaction}%</span>
                        </div>
                        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(253, 248, 240, 0.06)' }}>
                          <motion.div className="h-full rounded-full" style={{ background: C.gold }} initial={{ width: 0 }} animate={{ width: `${hkData.satisfaction}%` }} transition={{ duration: 1 }} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(201, 162, 39, 0.08)', border: '1px solid rgba(201, 162, 39, 0.15)' }}>
                      <p className="text-xs italic" style={{ color: C.cream }}>
                        "H.K. handles {100 - hkData.escalationRate}% of queries independently, freeing Digital Navigators to focus on complex, multi-step issues that require hands-on assistance."
                      </p>
                    </div>
                  </div>
                </div>

                {/* H.K. Quick Chat Preview */}
                <div className="rounded-xl p-6" style={{ background: 'rgba(253, 248, 240, 0.03)', border: '1px solid rgba(201, 162, 39, 0.1)' }}>
                  <h3 className="font-display text-lg font-bold mb-4" style={{ color: C.gold }}>Try H.K. Now</h3>
                  <p className="text-sm mb-4" style={{ color: C.mist }}>
                    Click the bridge icon in the bottom-right corner to chat with H.K. directly. Available 24/7.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['How do I get help?', 'What is a Digital Navigator?', 'Help with school portal', 'Job application help'].map(q => (
                      <span key={q} className="px-3 py-1.5 rounded-full text-xs font-mono cursor-pointer transition-all duration-200 hover:scale-105" style={{ background: 'rgba(201, 162, 39, 0.1)', color: C.gold, border: '1px solid rgba(201, 162, 39, 0.2)' }}>
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
