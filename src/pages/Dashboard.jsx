import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useStoreList } from '../hooks/useStore';
import { leadStore } from '../lib/leads';
import { callStore } from '../lib/calls';
import { bookingStore } from '../lib/bookings';
import { followupStore } from '../lib/followups';
import { DISPOSITION_COLORS } from '../constants/dispositions';
import {
  isToday, isThisMonth, withinLastDays, relativeTime,
  topByCount, topAgentByRevenue, dailyConversionSeries,
} from '../lib/dashboardStats';

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
  warn:     ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z', 'M12 9v4', 'M12 17h.01'],
  send:     ['M22 2L11 13', 'M22 2L15 22 11 13 2 9l20-7z'],
  sparkles: ['M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z', 'M5 3v4', 'M3 5h4', 'M19 17v4', 'M17 19h4'],
  arrowright: 'M5 12h14M12 5l7 7-7 7',
  close:    ['M18 6L6 18', 'M6 6l12 12'],
  map:      ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z', 'M12 7a3 3 0 100 6 3 3 0 000-6z'],
};

const quickActions = [
  { label: 'Add Lead',     path: '/leads',    icon: ic.leads,    from: '#0ea5e9', to: '#0353a1' },
  { label: 'New Booking',  path: '/bookings', icon: ic.bookings, from: '#8b5cf6', to: '#6d28d9' },
  { label: 'Calls Log',    path: '/calls',    icon: ic.calls,    from: '#10b981', to: '#059669' },
  { label: 'Follow-ups',   path: '/followups',icon: ic.followup, from: '#ef4444', to: '#dc2626' },
];

const statusStyle = {
  'New': 'bg-sky-100 text-sky-700',
  'Follow-up': 'bg-amber-100 text-amber-700',
  'Booked': 'bg-emerald-100 text-emerald-700',
  'Hot Lead': 'bg-red-100 text-red-700',
  'Contacted': 'bg-purple-100 text-purple-700',
  'Interested': 'bg-orange-100 text-orange-700',
  'Quote Sent': 'bg-teal-100 text-teal-700',
  'Lost': 'bg-red-100 text-red-500',
  'Cold': 'bg-gray-100 text-gray-600',
};

const AVATAR_COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#14b8a6'];
function colorFor(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function initialsFor(name) {
  return (name || '?').trim().split(/\s+/).slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

export default function Dashboard() {
  const { user } = useAuth();
  const leads = useStoreList(leadStore);
  const calls = useStoreList(callStore);
  const bookings = useStoreList(bookingStore);
  const followups = useStoreList(followupStore);

  const [chartPeriod, setChartPeriod] = useState('2W');
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', text: 'Hi! Ask me anything about your leads, bookings, calls, or performance.' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);

  // ── Derived, real numbers ──────────────────────────────────────────────────
  const bookedLeadsCount = leads.filter((l) => l.status === 'Booked').length;
  const conversionRate = leads.length ? (bookedLeadsCount / leads.length) * 100 : 0;
  const openFollowups = followups.filter((f) => f.status !== 'Done');
  const urgentFollowups = openFollowups.filter((f) => f.priority === 'Urgent').length;
  const cancelations = calls.filter((c) => c.disposition === 'Cancelation').length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.grandTotal) || 0), 0);
  const revenueMTD = bookings.filter((b) => isThisMonth(b.createdAt)).reduce((sum, b) => sum + (parseFloat(b.grandTotal) || 0), 0);
  const bookingsToday = bookings.filter((b) => isToday(b.createdAt)).length;
  const callsToday = calls.filter((c) => isToday(c.createdAt)).length;
  const leadsThisWeek = leads.filter((l) => withinLastDays(l.date || l.createdAt, 7)).length;

  const statCards = [
    { label: 'Total Leads', value: leads.length.toLocaleString(), change: `${leadsThisWeek} this week`, icon: ic.leads, accent: '#0ea5e9', bg: 'bg-sky-50', border: 'border-sky-100', link: '/leads' },
    { label: 'Calls Today', value: String(callsToday), change: `${calls.length} total logged`, icon: ic.calls, accent: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-100', link: '/calls' },
    { label: 'Bookings Today', value: String(bookingsToday), change: `${bookings.length} total`, icon: ic.bookings, accent: '#8b5cf6', bg: 'bg-violet-50', border: 'border-violet-100', link: '/bookings' },
    { label: 'Revenue MTD', value: `$${revenueMTD.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, change: `$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} all time`, icon: ic.revenue, accent: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-100', link: '/bookings' },
    { label: 'Follow-ups Due', value: String(openFollowups.length), change: `${urgentFollowups} urgent`, icon: ic.followup, accent: '#ef4444', bg: 'bg-red-50', border: 'border-red-100', link: '/followups' },
    { label: 'Conversion Rate', value: `${conversionRate.toFixed(1)}%`, change: `${bookedLeadsCount}/${leads.length} booked`, icon: ic.trending, accent: '#14b8a6', bg: 'bg-teal-50', border: 'border-teal-100', link: '/leads' },
    { label: 'Cancelations', value: String(cancelations), change: `${calls.length ? Math.round((cancelations / calls.length) * 100) : 0}% of calls`, icon: ic.warn, accent: '#f97316', bg: 'bg-orange-50', border: 'border-orange-100', link: '/calls' },
  ];

  const chartSeries = useMemo(() => dailyConversionSeries(leads, chartPeriod === '1W' ? 7 : chartPeriod === '1M' ? 30 : 14), [leads, chartPeriod]);
  const chartAvg = chartSeries.length ? chartSeries.reduce((s, d) => s + d.pct, 0) / chartSeries.length : 0;

  const recentLeads = useMemo(
    () => [...leads].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5),
    [leads]
  );
  const recentCalls = useMemo(
    () => [...calls].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 4),
    [calls]
  );

  const topAgent = topAgentByRevenue(bookings);
  const topSource = topByCount(leads, (l) => l.source);
  const topDestination = topByCount(leads, (l) => l.destination);
  const topDisposition = topByCount(calls, (c) => c.disposition);

  const performanceBand = [
    { label: 'Top Agent', value: topAgent ? topAgent.key : 'No bookings yet', sub: topAgent ? `${topAgent.value.count} booking${topAgent.value.count === 1 ? '' : 's'} · $${topAgent.value.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '—', accent: '#0ea5e9' },
    { label: 'Top Lead Source', value: topSource ? topSource.key : 'No leads yet', sub: topSource ? `${topSource.count} lead${topSource.count === 1 ? '' : 's'}` : '—', accent: '#8b5cf6' },
    { label: 'Top Destination', value: topDestination ? topDestination.key : 'No leads yet', sub: topDestination ? `${topDestination.count} lead${topDestination.count === 1 ? '' : 's'}` : '—', accent: '#f59e0b' },
    { label: 'Top Disposition', value: topDisposition ? topDisposition.key : 'No calls yet', sub: topDisposition ? `${topDisposition.count} call${topDisposition.count === 1 ? '' : 's'}` : '—', accent: '#10b981' },
  ];

  const sendAi = (text) => {
    const msg = (text || aiInput).trim();
    if (!msg) return;
    setAiMessages((m) => [...m, { role: 'user', text: msg }]);
    setAiInput('');
    setAiTyping(true);
    setTimeout(() => {
      // Grounded in the live stores, not scripted numbers — matches whatever is actually in the sheet right now.
      const replies = [
        `You have ${leads.length} lead${leads.length === 1 ? '' : 's'} on record — conversion rate is ${conversionRate.toFixed(1)}%.`,
        topAgent ? `${topAgent.key} leads the board with ${topAgent.value.count} booking${topAgent.value.count === 1 ? '' : 's'} and $${topAgent.value.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} revenue.` : 'No bookings recorded yet to rank agents by.',
        `There ${cancelations === 1 ? 'is' : 'are'} ${cancelations} cancelation${cancelations === 1 ? '' : 's'} logged, and ${openFollowups.length} follow-up${openFollowups.length === 1 ? '' : 's'} still open.`,
        `Revenue this month is $${revenueMTD.toLocaleString(undefined, { maximumFractionDigits: 0 })} across ${bookings.length} total booking${bookings.length === 1 ? '' : 's'}.`,
        `${openFollowups.length} follow-up${openFollowups.length === 1 ? '' : 's'} ${openFollowups.length === 1 ? 'is' : 'are'} due${urgentFollowups ? `, ${urgentFollowups} marked urgent` : ''}.`,
      ];
      setAiTyping(false);
      setAiMessages((m) => [...m, { role: 'assistant', text: replies[Math.floor(Math.random() * replies.length)] }]);
    }, 1200);
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
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full leading-none bg-gray-100 text-gray-600">{s.change}</span>
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
              <p className="text-xs text-gray-400 mt-0.5">Daily % of leads marked Booked</p>
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
              {[0, 33, 66, 100].map(y => (
                <line key={y} x1="0" y1={y * 1.1 + 5} x2="600" y2={y * 1.1 + 5}
                  stroke="#f1f5f9" strokeWidth="1" />
              ))}
              {chartSeries.length > 1 && (
                <>
                  <path
                    d={`M ${chartSeries.map((v, i) => `${i * (600 / (chartSeries.length - 1))},${110 - v.pct * 1.1}`).join(' L ')} L 600,115 L 0,115 Z`}
                    fill="url(#chartFill)" />
                  <path
                    d={`M ${chartSeries.map((v, i) => `${i * (600 / (chartSeries.length - 1))},${110 - v.pct * 1.1}`).join(' L ')}`}
                    fill="none" stroke="url(#chartLine)" strokeWidth="2.5" strokeLinejoin="round" />
                  {chartSeries.map((v, i) => (
                    <circle key={i}
                      cx={i * (600 / (chartSeries.length - 1))}
                      cy={110 - v.pct * 1.1}
                      r="4" fill="white" stroke="#0ea5e9" strokeWidth="2" className="cursor-pointer">
                      <title>{`${v.label}: ${v.pct}% (${v.total} lead${v.total === 1 ? '' : 's'})`}</title>
                    </circle>
                  ))}
                </>
              )}
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-0.5">
            <span>{chartSeries[0]?.label}</span>
            <span>{chartSeries[Math.floor(chartSeries.length / 2)]?.label}</span>
            <span>{chartSeries[chartSeries.length - 1]?.label}</span>
          </div>

          <div className="flex gap-5 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#0ea5e9' }} />
              <span className="text-xs text-gray-500">Overall Conversion</span>
              <span className="text-xs font-bold text-gray-700">{conversionRate.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#10b981' }} />
              <span className="text-xs text-gray-500">Avg. this period</span>
              <span className="text-xs font-bold text-gray-700">{chartAvg.toFixed(1)}%</span>
            </div>
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

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-[15px]">Recent Leads</h3>
            <Link to="/leads" className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1">
              View all <Svg d={ic.arrowright} size={12} color="#0ea5e9" sw={2} />
            </Link>
          </div>
          <div className="space-y-1">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[12px] text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${colorFor(lead.id)}cc, ${colorFor(lead.id)})` }}>
                  {initialsFor(lead.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-[13px] truncate">{lead.name}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 truncate">
                    <Svg d={ic.map} size={10} color="#9ca3af" sw={2} />
                    {lead.destination || 'No destination set'}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle[lead.status] || 'bg-gray-100 text-gray-600'}`}>{lead.status}</span>
                  <span className="text-[10px] text-gray-400">{relativeTime(lead.createdAt)}</span>
                </div>
              </div>
            ))}
            {recentLeads.length === 0 && (
              <div className="text-center py-8 text-sm text-gray-400">No leads yet</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-[15px]">Recent Calls</h3>
            <Link to="/calls" className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1">
              View all <Svg d={ic.arrowright} size={12} color="#0ea5e9" sw={2} />
            </Link>
          </div>
          <div className="space-y-1">
            {recentCalls.map((call) => (
              <div key={call.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-sky-50">
                  <Svg d={ic.calls} size={16} color="#0ea5e9" sw={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-[13px] truncate">{call.caller}</div>
                  <div className="text-xs text-gray-400">Agent: {call.agent || '—'}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`badge ${DISPOSITION_COLORS[call.disposition] || 'bg-gray-100 text-gray-600'}`}>{call.disposition}</span>
                  <div className="text-[10px] text-gray-400 mt-1">{call.time}</div>
                </div>
              </div>
            ))}
            {recentCalls.length === 0 && (
              <div className="text-center py-8 text-sm text-gray-400">No calls logged yet</div>
            )}
          </div>
        </div>
      </div>

      {/* ── PERFORMANCE MINI BAND ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {performanceBand.map((p, i) => (
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

            <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide border-t border-gray-100 bg-white">
              {['How many leads?', 'Top agent?', 'Cancelations?', 'Revenue this month?'].map(s => (
                <button key={s} onClick={() => sendAi(s)}
                  className="flex-shrink-0 text-xs font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-100 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
                  {s}
                </button>
              ))}
            </div>

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
