/**
 * TechBridge Collective — TechMinutes® Dashboard
 * Tech-Forward Dark Design System — Glassmorphism, Neon Glow, Circuit Patterns
 */
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';
import Footer from '../components/Footer';

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
    { name: 'Education', pct: 42, minutes: 1196, color: '#00D4AA', icon: '📚' },
    { name: 'Workforce', pct: 28, minutes: 797, color: '#E8B931', icon: '💼' },
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

// ── Stat Card (glassmorphism) ──
function Stat({ label, value, suffix = '', sub, color = '#E8B931' }: { label: string; value: string | number; suffix?: string; sub?: string; color?: string }) {
  return (
    <motion.div className="glass-card p-5" whileHover={{ y: -4 }}>
      <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'rgba(253, 248, 240, 0.45)' }}>{label}</p>
      <p className="font-display text-2xl md:text-3xl font-bold" style={{ color, textShadow: `0 0 15px ${color}33` }}>{value}{suffix}</p>
      {sub && <p className="text-xs mt-1" style={{ color: 'rgba(253, 248, 240, 0.4)' }}>{sub}</p>}
    </motion.div>
  );
}

// ── Bar Chart ──
function BarChart({ data, maxVal }: { data: { label: string; value: number; color: string }[]; maxVal: number }) {
  return (
    <div className="flex flex-col gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-xs font-mono w-20 shrink-0 text-right" style={{ color: 'var(--tb-cream)' }}>{d.label}</span>
          <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: 'rgba(253, 248, 240, 0.06)' }}>
            <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${d.color}88, ${d.color})` }} initial={{ width: 0 }} animate={{ width: `${(d.value / maxVal) * 100}%` }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
          </div>
          <span className="text-xs font-mono w-12 shrink-0 text-glow-gold">{d.value}</span>
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

  const handleTabChange = (t: TabId) => { setTab(t); tbSoundEngine.play('nav_click'); };

  return (
    <div style={{ background: 'var(--tb-forest)', color: 'var(--tb-cream)' }}>
      <div className="container pt-28 pb-16">
        {/* SIMULATED DATA BANNER */}
        <div className="mb-6 glass-card px-5 py-4 flex items-center gap-3" style={{ borderColor: 'rgba(232, 185, 49, 0.2)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="#E8B931" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div>
            <p className="text-sm font-display font-bold text-glow-gold">Simulated Dashboard</p>
            <p className="text-xs" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>This dashboard displays simulated data for demonstration purposes. Live data will populate once TechMinutes® tracking goes live at partner sites.</p>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-mono tracking-widest uppercase mb-2 text-glow-gold">TechMinutes® Dashboard</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Impact Command <span className="text-glow-teal">Center</span></h1>
          </div>
          <div className="holo-badge flex items-center gap-2" style={{ color: '#00D4AA' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00D4AA', boxShadow: '0 0 8px rgba(0, 212, 170, 0.6)' }} />
            Live · Updates every 30s
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => handleTabChange(t.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300"
              style={{
                background: tab === t.id ? 'rgba(232, 185, 49, 0.12)' : 'transparent',
                color: tab === t.id ? '#E8B931' : 'rgba(253, 248, 240, 0.5)',
                border: tab === t.id ? '1px solid rgba(232, 185, 49, 0.3)' : '1px solid transparent',
                textShadow: tab === t.id ? '0 0 10px rgba(232, 185, 49, 0.3)' : 'none',
              }}>
              <span>{t.icon}</span><span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>

            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Stat label="Total TechMinutes" value={overview.totalMinutes.toLocaleString()} />
                  <Stat label="Total Sessions" value={overview.totalSessions} />
                  <Stat label="Resolution Rate" value={overview.resolutionRate} suffix="%" color="#00D4AA" />
                  <Stat label="Avg Duration" value={overview.avgDuration} suffix=" min" color="#C4704B" />
                  <Stat label="Active Hubs" value={overview.activeHubs} color="#00D4AA" />
                  <Stat label="Weekly Growth" value={`+${overview.weeklyGrowth}`} suffix="%" color="#00D4AA" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-bold mb-4 text-glow-gold">Issue Categories</h3>
                    <BarChart data={categories.map(c => ({ label: c.name, value: c.minutes, color: c.color }))} maxVal={Math.max(...categories.map(c => c.minutes))} />
                  </div>
                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-bold mb-4 text-glow-gold">Weekly Trend</h3>
                    <BarChart data={trends.map(t => ({ label: t.week, value: t.minutes, color: '#00D4AA' }))} maxVal={Math.max(...trends.map(t => t.minutes))} />
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-bold mb-4 text-glow-gold">Recent Sessions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(232, 185, 49, 0.15)' }}>
                          {['ID', 'Type', 'Hub', 'Duration', 'Status', 'Date'].map(h => (
                            <th key={h} className="text-left py-2 px-3 font-mono text-xs" style={{ color: 'rgba(253, 248, 240, 0.45)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.slice(0, 5).map(s => (
                          <tr key={s.id} style={{ borderBottom: '1px solid rgba(253, 248, 240, 0.04)' }}>
                            <td className="py-2 px-3 font-mono text-xs text-glow-gold">{s.id}</td>
                            <td className="py-2 px-3">{s.type}</td>
                            <td className="py-2 px-3 text-xs" style={{ color: 'rgba(253, 248, 240, 0.45)' }}>{s.hub}</td>
                            <td className="py-2 px-3 font-mono">{s.duration}m</td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded-full text-xs font-mono" style={{
                                background: s.status === 'resolved' ? 'rgba(0, 212, 170, 0.15)' : s.status === 'follow-up' ? 'rgba(232, 185, 49, 0.15)' : 'rgba(196, 112, 75, 0.15)',
                                color: s.status === 'resolved' ? '#00D4AA' : s.status === 'follow-up' ? '#E8B931' : '#C4704B',
                              }}>{s.status}</span>
                            </td>
                            <td className="py-2 px-3 text-xs" style={{ color: 'rgba(253, 248, 240, 0.45)' }}>{s.date}</td>
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
                    <motion.div key={c.name} className="glass-card p-6 text-center" whileHover={{ y: -6, boxShadow: `0 0 25px ${c.color}22` }} onHoverStart={() => tbSoundEngine.play('pillar_hover')}>
                      <span className="text-3xl mb-3 block">{c.icon}</span>
                      <h3 className="font-display text-lg font-bold mb-1" style={{ color: c.color }}>{c.name}</h3>
                      <p className="font-display text-3xl font-bold mb-1">{c.pct}%</p>
                      <p className="text-xs font-mono" style={{ color: 'rgba(253, 248, 240, 0.45)' }}>{c.minutes.toLocaleString()} minutes</p>
                    </motion.div>
                  ))}
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-bold mb-6 text-glow-gold">Category Distribution</h3>
                  <div className="flex h-10 rounded-full overflow-hidden mb-4">
                    {categories.map(c => (
                      <motion.div key={c.name} style={{ background: c.color, width: `${c.pct}%` }} initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="flex items-center justify-center text-xs font-mono font-bold" title={`${c.name}: ${c.pct}%`}>
                        {c.pct > 15 && <span style={{ color: 'var(--tb-forest)' }}>{c.pct}%</span>}
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {categories.map(c => (
                      <div key={c.name} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                        <span className="text-sm">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {categories.map(c => (
                    <div key={c.name} className="glass-card p-5" style={{ borderColor: `${c.color}22` }}>
                      <div className="flex items-center gap-2 mb-4">
                        <span>{c.icon}</span>
                        <h4 className="font-display font-bold" style={{ color: c.color }}>{c.name} — Top Issues</h4>
                      </div>
                      <ul className="space-y-2 text-sm">
                        {c.name === 'Education' && ['School portal login', 'Homework platform access', 'Parent-teacher comm', 'Enrollment forms'].map(i => <li key={i}>• {i}</li>)}
                        {c.name === 'Workforce' && ['Job application portals', 'Resume upload/formatting', 'Interview scheduling', 'Benefits enrollment'].map(i => <li key={i}>• {i}</li>)}
                        {c.name === 'Health' && ['Telehealth setup', 'Patient portal access', 'Prescription management', 'Insurance navigation'].map(i => <li key={i}>• {i}</li>)}
                        {c.name === 'Housing' && ['Rental applications', 'Housing authority portals', 'Utility assistance', 'Document uploads'].map(i => <li key={i}>• {i}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TRENDS */}
            {tab === 'trends' && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-bold mb-6 text-glow-gold">TechMinutes® Over Time</h3>
                  <div className="flex items-end gap-2 h-48">
                    {trends.map((t, i) => (
                      <div key={t.week} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-mono text-glow-gold">{t.minutes}</span>
                        <motion.div className="w-full rounded-t-lg" style={{ background: 'linear-gradient(to top, rgba(0, 212, 170, 0.6), #E8B931)' }} initial={{ height: 0 }} animate={{ height: `${(t.minutes / Math.max(...trends.map(t => t.minutes))) * 160}px` }} transition={{ duration: 0.8, delay: i * 0.1 }} />
                        <span className="text-[10px] font-mono" style={{ color: 'rgba(253, 248, 240, 0.4)' }}>{t.week.replace('Week ', 'W')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-bold mb-6 text-glow-gold">Sessions Per Week</h3>
                  <div className="flex items-end gap-2 h-36">
                    {trends.map((t, i) => (
                      <div key={t.week} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-mono" style={{ color: '#C4704B' }}>{t.sessions}</span>
                        <motion.div className="w-full rounded-t-lg" style={{ background: '#C4704B' }} initial={{ height: 0 }} animate={{ height: `${(t.sessions / Math.max(...trends.map(t => t.sessions))) * 120}px` }} transition={{ duration: 0.8, delay: i * 0.1 }} />
                        <span className="text-[10px] font-mono" style={{ color: 'rgba(253, 248, 240, 0.4)' }}>{t.week.replace('Week ', 'W')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Stat label="Peak Week" value="Week 8" sub="Highest activity recorded" />
                  <Stat label="Avg Weekly Minutes" value={Math.round(trends.reduce((s, t) => s + t.minutes, 0) / trends.length)} color="#00D4AA" sub="Across all hubs" />
                  <Stat label="Growth Trajectory" value="+12" suffix="%" color="#00D4AA" sub="Week-over-week average" />
                </div>
              </div>
            )}

            {/* SESSIONS */}
            {tab === 'sessions' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Stat label="Resolved" value={sessions.filter(s => s.status === 'resolved').length} color="#00D4AA" />
                  <Stat label="Follow-up" value={sessions.filter(s => s.status === 'follow-up').length} />
                  <Stat label="In Progress" value={sessions.filter(s => s.status === 'in-progress').length} color="#C4704B" />
                </div>

                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: 'rgba(232, 185, 49, 0.06)' }}>
                          {['ID', 'Type', 'Hub', 'Duration', 'Status', 'Date'].map(h => (
                            <th key={h} className="text-left py-3 px-4 font-mono text-xs text-glow-gold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map((s, i) => (
                          <motion.tr key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} style={{ borderBottom: '1px solid rgba(253, 248, 240, 0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(253, 248, 240, 0.02)' }}>
                            <td className="py-3 px-4 font-mono text-xs text-glow-gold">{s.id}</td>
                            <td className="py-3 px-4">{s.type}</td>
                            <td className="py-3 px-4 text-xs" style={{ color: 'rgba(253, 248, 240, 0.45)' }}>{s.hub}</td>
                            <td className="py-3 px-4 font-mono">{s.duration}m</td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold" style={{
                                background: s.status === 'resolved' ? 'rgba(0, 212, 170, 0.15)' : s.status === 'follow-up' ? 'rgba(232, 185, 49, 0.15)' : 'rgba(196, 112, 75, 0.15)',
                                color: s.status === 'resolved' ? '#00D4AA' : s.status === 'follow-up' ? '#E8B931' : '#C4704B',
                              }}>{s.status}</span>
                            </td>
                            <td className="py-3 px-4 text-xs" style={{ color: 'rgba(253, 248, 240, 0.45)' }}>{s.date}</td>
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
                  <Stat label="Avg Response" value={hkData.avgResponseTime} color="#00D4AA" />
                  <Stat label="Satisfaction" value={hkData.satisfaction} suffix="%" color="#00D4AA" />
                  <Stat label="Escalation Rate" value={hkData.escalationRate} suffix="%" color="#C4704B" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-bold mb-4 text-glow-gold">Top Query Topics</h3>
                    <BarChart data={hkData.topTopics.map(t => ({ label: t.topic.split(' ').slice(0, 2).join(' '), value: t.count, color: '#00D4AA' }))} maxVal={Math.max(...hkData.topTopics.map(t => t.count))} />
                  </div>

                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-bold mb-4 text-glow-gold">H.K. Performance</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Self-Resolved', value: 100 - hkData.escalationRate, color: '#00D4AA' },
                        { label: 'Escalated to Navigator', value: hkData.escalationRate, color: '#C4704B' },
                        { label: 'User Satisfaction', value: hkData.satisfaction, color: '#E8B931' },
                      ].map(item => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.label}</span>
                            <span className="font-mono" style={{ color: item.color }}>{item.value}%</span>
                          </div>
                          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(253, 248, 240, 0.06)' }}>
                            <motion.div className="h-full rounded-full" style={{ background: item.color }} initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 1 }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 glass-card p-4" style={{ borderColor: 'rgba(232, 185, 49, 0.2)' }}>
                      <p className="text-xs italic" style={{ color: 'rgba(253, 248, 240, 0.65)' }}>
                        "H.K. handles {100 - hkData.escalationRate}% of queries independently, freeing Digital Navigators to focus on complex, multi-step issues."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-bold mb-4 text-glow-gold">Try H.K. Now</h3>
                  <p className="text-sm mb-4" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>
                    Click the bridge icon in the bottom-right corner to chat with H.K. directly. Available 24/7.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['How do I get help?', 'What is a Digital Navigator?', 'Help with school portal', 'Job application help'].map(q => (
                      <span key={q} className="px-3 py-1.5 rounded-full text-xs font-mono cursor-pointer transition-all duration-300 hover:scale-105" style={{ background: 'rgba(232, 185, 49, 0.08)', color: '#E8B931', border: '1px solid rgba(232, 185, 49, 0.2)' }}>
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

      <Footer />
    </div>
  );
}
