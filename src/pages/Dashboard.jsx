import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

// ── SVG icons ────────────────────────────────────────────────────────────────
const Svg = ({ d, size = 20, color = 'currentColor', sw = 1.7, fill = 'none', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ic = {
  leads:    'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  calls:    'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.72 19.79 19.79 0 01.11 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  bookings: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  revenue:  ['M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'],
  followup: ['M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 01-3.46 0'],
  trending: ['M23 6l-9.5 9.5-5-5L1 18'],
  reports:  ['M18 20V10', 'M12 20V4', 'M6 20v-6'],
  agents:   ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', 'M23 21v-2a4 4 0 00-3-3.87', 'M16 3.13a4 4 0 010 7.75', 'M9 11a4 4 0 100-8 4 4 0 000 8z'],
  missed:   ['M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 1 1 0 01-.29-.21M1 1l22 22'],
  send:     ['M22 2L11 13', 'M22 2L15 22 11 13 2 9l20-7z'],
  sparkles: ['M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z', 'M5 3v4', 'M3 5h4', 'M19 17v4', 'M17 19h4'],
  arrowright: 'M5 12h14M12 5l7 7-7 7',
  close:    ['M18 6L6 18', 'M6 6l12 12'],
  inbound:  ['M5 12h14', 'M12 19l7-7-7-7'],
  outbound: ['M19 12H5', 'M12 5l-7 7 7 7'],
  map:      ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z', 'M12 7a3 3 0 100 6 3 3 0 000-6z'],
};

// ── Data ─────────────────────────────────────────────────────────────────────
const statCards = [
  { label: 'Total Leads',      value: '1,284', change: '+12%', up: true,  icon: ic.leads,    accent: '#0ea5e9', bg: 'bg-sky-50',     border: 'border-sky-100',    link: '/leads' },
  { label: 'Active Calls',     value: '24',    change: '+5',   up: true,  icon: ic.calls,    accent: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-100',link: '/calls' },
  { label: 'Bookings Today',   value: '38',    change: '+8%',  up: true,  icon: ic.bookings, accent: '#8b5cf6', bg: 'bg-violet-50',  border: 'border-violet-100', link: '/bookings' },
  { label: 'Revenue MTD',      value: '$84K',  change: '+18%', up: true,  icon: ic.revenue,  accent: '#f59e0b', bg: 'bg-amber-50',   border: 'border-amber-100',  link: '/reports' },
  { label: 'Follow-ups Due',   value: '67',    change: '12 urgent', up: false, icon: ic.followup, accent: '#ef4444', bg: 'bg-red-50',border: 'border-red-100',   link: '/followups' },
  { label: 'Conversion Rate',  value: '68.4%', change: '+4.2%',up: true,  icon: ic.trending, accent: '#14b8a6', bg: 'bg-teal-50',   border: 'border-teal-100',   link: '/reports' },
  { label: 'Active Agents',    value: '18',    change: '2 on break', up: null, icon: ic.agents, accent: '#6366f1', bg: 'bg-indigo-50', border: 'border-indigo-100',link: '/agents' },
  { label: 'Missed Calls',     value: '9',     change: '-3 vs yesterday', up: true, icon: ic.missed, accent: '#f97316', bg: 'bg-orange-50', border: 'border-orange-100', link: '/calls' },
];

const quickActions = [
  { label: 'Add Lead',     path: '/leads',    icon: ic.leads,    from: '#0ea5e9', to: '#0353a1' },
  { label: 'New Booking',  path: '/bookings', icon: ic.bookings, from: '#8b5cf6', to: '#6d28d9' },
  { label: 'Calls Log',    path: '/calls',    icon: ic.calls,    from: '#10b981', to: '#059669' },
  { label: 'View Reports', path: '/reports',  icon: ic.reports,  from: '#f59e0b', to: '#d97706' },
  { label: 'Follow-ups',   path: '/followups',icon: ic.followup, from: '#ef4444', to: '#dc2626' },
  { label: 'Agent Stats',  path: '/agents',   icon: ic.agents,   from: '#6366f1', to: '#4f46e5' },
];

const recentLeads = [
  { name: 'Raj Kumar',      dest: 'Dubai Package',   status: 'New',       time: '2m ago',  initials: 'RK', color: '#0ea5e9' },
  { name: 'Priya Singh',    dest: 'Maldives 5 nights', status: 'Follow-up',time: '15m ago', initials: 'PS', color: '#f59e0b' },
  { name: 'John Davis',     dest: 'Europe Tour 10D', status: 'Booked',    time: '32m ago', initials: 'JD', color: '#10b981' },
  { name: 'Aisha Khan',     dest: 'Singapore Trip',  status: 'Hot Lead',  time: '1h ago',  initials: 'AK', color: '#ef4444' },
  { name: 'Mike Thompson',  dest: 'Thailand 7 nights', status: 'New',     time: '2h ago',  initials: 'MT', color: '#8b5cf6' },
];

const recentCalls = [
  { name: 'Raj Kumar',  duration: '4:32', type: 'Inbound',  agent: 'Sarah J.', status: 'Completed' },
  { name: 'Priya Singh',duration: '2:18', type: 'Outbound', agent: 'Mike R.',  status: 'Completed' },
  { name: 'Unknown',    duration: '—',    type: 'Inbound',  agent: '—',        status: 'Missed' },
  { name: 'John Davis', duration: '6:45', type: 'Outbound', agent: 'Sarah J.', status: 'Completed' },
];

const statusStyle = {
  'New':       'bg-sky-100 text-sky-700',
  'Follow-up': 'bg-amber-100 text-amber-700',
  'Booked':    'bg-emerald-100 text-emerald-700',
  'Hot Lead':  'bg-red-100 text-red-700',
};

const chartData = [52, 68, 44, 82, 62, 76, 58, 90, 70, 64, 84, 88, 66, 80];
const chartLabels = ['Mar 14','15','16','17','18','19','20','21','22','23','24','25','26','Mar 27'];

// ── AI suggestion chips ───────────────────────────────────────────────────────
const suggestions = [
  'How many leads today?',
  'Top agent this week?',
  'Show missed calls',
  'Revenue vs target',
];

export default function Dashboard() {
  const { user } = useAuth();
  const [chartPeriod, setChartPeriod] = useState('2W');
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', text: 'Hi! Ask me anything about your leads, bookings, calls, or performance.' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);

  const sendAi = (text) => {
    const msg = (text || aiInput).trim();
    if (!msg) return;
    setAiMessages(m => [...m, { role: 'user', text: msg }]);
    setAiInput('');
    setAiTyping(true);
    setTimeout(() => {
      const replies = [
        'You have 1,284 leads this month — conversion rate sits at 68.4%, up 4.2% from last month.',
        'Sarah Johnson leads the board with 32 bookings and $42.6K revenue this month.',
        'There are 9 missed calls today. I recommend scheduling auto-callbacks within 10 minutes.',
        'Revenue MTD is $84K, up 18% vs last month. Europe Tour packages are top sellers.',
        '67 follow-ups are due — 12 marked urgent. Prioritise hot leads for best conversion.',
      ];
      setAiTyping(false);
      setAiMessages(m => [...m, { role: 'assistant', text: replies[Math.floor(Math.random() * replies.length)] }]);
    }, 1600);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <DashboardLayout
      title={`${greeting}, ${user?.name?.split(' ')[0] || 'there'}`}
      subtitle="Here's your travel business snapshot for today">

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {statCards.map((s, i) => (
          <Link key={i} to={s.link}
            className={`${s.bg} ${s.border} border rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${s.accent}18` }}>
                <Svg d={s.icon} size={17} color={s.accent} />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full leading-none ${
                s.up === true ? 'bg-emerald-100 text-emerald-700' :
                s.up === false ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
              }`}>{s.change}</span>
            </div>
            <div className="text-[22px] font-black text-gray-900 leading-none">{s.value}</div>
            <div className="text-[11px] text-gray-500 font-medium mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* ── CHART + QUICK ACTIONS ── */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">

        {/* Conversion trend chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-800 text-[15px]">Lead Conversion Trend</h3>
              <p className="text-xs text-gray-400 mt-0.5">Daily conversion % — last 14 days</p>
            </div>
            <div className="flex gap-1.5">
              {['1W', '2W', '1M'].map(t => (
                <button key={t} onClick={() => setChartPeriod(t)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all duration-200 ${
                    chartPeriod === t
                      ? 'text-white shadow-sm'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                  style={chartPeriod === t ? { background: 'linear-gradient(135deg,#0353a1,#0ea5e9)' } : {}}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG line chart */}
          <div className="relative">
            <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="w-full h-32">
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0353a1" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0, 33, 66, 100].map(y => (
                <line key={y} x1="0" y1={y * 1.1 + 5} x2="600" y2={y * 1.1 + 5}
                  stroke="#f1f5f9" strokeWidth="1" />
              ))}
              {/* Area fill */}
              <path
                d={`M ${chartData.map((v, i) => `${i * (600 / (chartData.length - 1))},${110 - v * 1.1}`).join(' L ')} L 600,115 L 0,115 Z`}
                fill="url(#chartFill)" />
              {/* Line */}
              <path
                d={`M ${chartData.map((v, i) => `${i * (600 / (chartData.length - 1))},${110 - v * 1.1}`).join(' L ')}`}
                fill="none" stroke="url(#chartLine)" strokeWidth="2.5" strokeLinejoin="round" />
              {/* Dots */}
              {chartData.map((v, i) => (
                <circle key={i}
                  cx={i * (600 / (chartData.length - 1))}
                  cy={110 - v * 1.1}
                  r="4" fill="white" stroke="#0ea5e9" strokeWidth="2" className="cursor-pointer" />
              ))}
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-0.5">
            <span>{chartLabels[0]}</span>
            <span>{chartLabels[Math.floor(chartLabels.length / 2)]}</span>
            <span>{chartLabels[chartLabels.length - 1]}</span>
          </div>

          {/* Legend */}
          <div className="flex gap-5 mt-3 pt-3 border-t border-gray-100">
            {[
              { color: '#0ea5e9', label: 'Conversion Rate', val: '68.4%' },
              { color: '#10b981', label: 'Avg. this period', val: '73.2%' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                <span className="text-xs text-gray-500">{l.label}</span>
                <span className="text-xs font-bold text-gray-700">{l.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-800 text-[15px] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2.5 flex-1">
            {quickActions.map((q, i) => (
              <Link key={i} to={q.path}
                className="group flex flex-col items-center gap-2 p-3.5 rounded-xl text-white text-center hover:scale-105 hover:shadow-lg transition-all duration-200"
                style={{ background: `linear-gradient(135deg, ${q.from}, ${q.to})` }}>
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Svg d={q.icon} size={16} color="white" sw={1.8} />
                </div>
                <span className="text-[11px] font-semibold leading-tight">{q.label}</span>
              </Link>
            ))}
          </div>

          {/* AI button */}
          <button onClick={() => setAiOpen(true)}
            className="mt-3 w-full flex items-center gap-2.5 justify-center py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            <Svg d={ic.sparkles} size={16} color="white" />
            Ask AI Assistant
          </button>
        </div>
      </div>

      {/* ── RECENT LEADS + CALLS ── */}
      <div className="grid lg:grid-cols-2 gap-4 mb-4">

        {/* Recent leads */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-[15px]">Recent Leads</h3>
            <Link to="/leads" className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1">
              View all <Svg d={ic.arrowright} size={12} color="#0ea5e9" sw={2} />
            </Link>
          </div>
          <div className="space-y-1">
            {recentLeads.map((lead, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[12px] text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${lead.color}cc, ${lead.color})` }}>
                  {lead.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-[13px] truncate">{lead.name}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 truncate">
                    <Svg d={ic.map} size={10} color="#9ca3af" sw={2} />
                    {lead.dest}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle[lead.status]}`}>{lead.status}</span>
                  <span className="text-[10px] text-gray-400">{lead.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent calls */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-[15px]">Recent Calls</h3>
            <Link to="/calls" className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1">
              View all <Svg d={ic.arrowright} size={12} color="#0ea5e9" sw={2} />
            </Link>
          </div>
          <div className="space-y-1">
            {recentCalls.map((call, i) => {
              const missed = call.status === 'Missed';
              const inbound = call.type === 'Inbound';
              return (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    missed ? 'bg-red-50' : inbound ? 'bg-emerald-50' : 'bg-sky-50'
                  }`}>
                    <Svg
                      d={missed ? ic.missed : inbound ? ic.inbound : ic.outbound}
                      size={16}
                      color={missed ? '#ef4444' : inbound ? '#10b981' : '#0ea5e9'}
                      sw={2}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 text-[13px] truncate">{call.name}</div>
                    <div className="text-xs text-gray-400">Agent: {call.agent}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-[13px] font-bold ${missed ? 'text-red-500' : 'text-gray-700'}`}>
                      {call.duration}
                    </div>
                    <div className={`text-[10px] font-medium ${
                      missed ? 'text-red-400' : inbound ? 'text-emerald-500' : 'text-sky-500'
                    }`}>{missed ? 'Missed' : call.type}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── PERFORMANCE MINI BAND ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Top Agent',     value: 'Sarah Johnson', sub: '32 bookings · $42.6K', accent: '#0ea5e9' },
          { label: 'Best Campaign', value: 'Dubai Summer',  sub: 'Google Ads · 284 leads',accent: '#8b5cf6' },
          { label: 'Top Destination',value: 'Dubai',        sub: '68 bookings this month', accent: '#f59e0b' },
          { label: 'Avg Call Time', value: '4m 18s',        sub: 'Up from 3m 52s last week',accent: '#10b981' },
        ].map((p, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: p.accent }}>{p.label}</div>
            <div className="font-black text-gray-900 text-[15px] mb-0.5 truncate">{p.value}</div>
            <div className="text-xs text-gray-400 truncate">{p.sub}</div>
          </div>
        ))}
      </div>

      {/* ── AI CHAT PANEL ── */}
      {aiOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setAiOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[380px] bg-white z-50 shadow-2xl flex flex-col"
            style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100"
              style={{ background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Svg d={ic.sparkles} size={18} color="white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">AI Assistant</div>
                  <div className="text-purple-300 text-xs">Risezonic Intelligence</div>
                </div>
              </div>
              <button onClick={() => setAiOpen(false)}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <Svg d={ic.close} size={18} color="currentColor" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {aiMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg flex-shrink-0 mr-2 flex items-center justify-center mt-0.5"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #4c1d95)' }}>
                      <Svg d={ic.sparkles} size={13} color="white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                    m.role === 'user'
                      ? 'text-white rounded-br-sm'
                      : 'bg-white text-gray-700 rounded-bl-sm border border-gray-100'
                  }`}
                  style={m.role === 'user' ? { background: 'linear-gradient(135deg, #0353a1, #0ea5e9)' } : {}}>
                    {m.text}
                  </div>
                </div>
              ))}
              {aiTyping && (
                <div className="flex justify-start items-end gap-2">
                  <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #4c1d95)' }}>
                    <Svg d={ic.sparkles} size={13} color="white" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 shadow-sm">
                    {[0, 1, 2].map(j => (
                      <div key={j} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${j * 0.18}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggestion chips */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide border-t border-gray-100 bg-white">
              {suggestions.map(s => (
                <button key={s} onClick={() => sendAi(s)}
                  className="flex-shrink-0 text-xs font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-100 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  className="input-field flex-1 py-2.5 text-sm"
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendAi()}
                  placeholder="Ask about your business..."
                />
                <button onClick={() => sendAi()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #0353a1, #0ea5e9)' }}>
                  <Svg d={ic.send} size={16} color="white" sw={1.8} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
