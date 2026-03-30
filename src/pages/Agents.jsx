import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Sv = ({ d, size = 18, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ic = {
  users:   ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2','M9 11a4 4 0 100-8 4 4 0 000 8z'],
  circle:  'M12 2a10 10 0 100 20A10 10 0 0012 2z',
  plane:   'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  dollar:  ['M12 2v20','M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'],
  clock:   ['M12 2a10 10 0 100 20A10 10 0 0012 2z','M12 6v6l4 2'],
  login:   ['M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4','M10 17l5-5-5-5','M15 12H3'],
  coffee:  ['M18 8h1a4 4 0 010 8h-1','M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z','M6 1v3','M10 1v3','M14 1v3'],
  chart:   ['M18 20V10','M12 20V4','M6 20v-6'],
  phone:   'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.72 19.79 19.79 0 01.11 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  star:    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  target:  ['M12 2a10 10 0 100 20A10 10 0 0012 2z','M12 6a6 6 0 100 12A6 6 0 0012 6z','M12 10a2 2 0 100 4 2 2 0 000-4z'],
  map:     ['M1 6l7-3 8 3 7-3v15l-7 3-8-3-7 3V6z','M8 3v15','M16 6v15'],
  award:   ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z','M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32'],
  close:   ['M18 6L6 18','M6 6l12 12'],
  check:   'M20 6L9 17l-5-5',
  trend:   'M23 6l-9.5 9.5-5-5L1 18',
  info:    ['M12 2a10 10 0 100 20A10 10 0 0012 2z','M12 16v-4','M12 8h.01'],
  shield:  ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  zap:     ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
};

const agents = [
  {
    id: 1, name: 'Sarah Johnson', avatar: 'SJ', role: 'Senior Agent', email: 'sarah@risezonic.com', phone: '+1 555-0101',
    calls: 148, bookings: 32, revenue: '$42,600', conversion: '72%', rating: 4.8, status: 'Online', targets: 85,
    // Login Details
    firstLogin: '08:02 AM', lastLogout: '07:48 PM', totalLoginTime: '11h 46m', loginCount: 1, daysActive: 22,
    // Performance
    callsAnswered: 141, callsMissed: 7, answerRate: '95%', avgCallScore: 91, qualityRating: 'Excellent',
    escalations: 2, firstCallResolution: '88%',
    // Break Details
    totalBreakTime: '45m', breakCount: 3, avgBreakDuration: '15m', lastBreak: '02:30 PM',
    scheduledBreaks: 2, unscheduledBreaks: 1,
    // Idle Time
    totalIdleTime: '28m', idlePct: '4%', longestIdle: '12m', idleSessions: 5,
    // AHT
    avgHandleTime: '4m 32s', avgTalkTime: '3m 58s', avgWrapTime: '34s', avgRingTime: '8s',
    // Revenue
    revenueMonth: '$42,600', revenueWeek: '$9,800', revenueToday: '$2,100',
    avgBookingValue: '$1,331', commission: '$2,130', topDestination: 'Dubai, UAE',
    pendingBookings: 4, cancelledBookings: 1,
    // Value prediction inputs
    conversionNum: 72, avgBookingNum: 1331, qualityNum: 91,
  },
  {
    id: 2, name: 'Mike Roberts', avatar: 'MR', role: 'Agent', email: 'mike@risezonic.com', phone: '+1 555-0102',
    calls: 112, bookings: 21, revenue: '$28,400', conversion: '61%', rating: 4.5, status: 'Online', targets: 68,
    firstLogin: '08:15 AM', lastLogout: '06:55 PM', totalLoginTime: '10h 40m', loginCount: 1, daysActive: 20,
    callsAnswered: 105, callsMissed: 7, answerRate: '94%', avgCallScore: 78, qualityRating: 'Good',
    escalations: 5, firstCallResolution: '79%',
    totalBreakTime: '52m', breakCount: 4, avgBreakDuration: '13m', lastBreak: '03:10 PM',
    scheduledBreaks: 2, unscheduledBreaks: 2,
    totalIdleTime: '41m', idlePct: '6%', longestIdle: '18m', idleSessions: 7,
    avgHandleTime: '3m 58s', avgTalkTime: '3m 22s', avgWrapTime: '36s', avgRingTime: '10s',
    revenueMonth: '$28,400', revenueWeek: '$6,200', revenueToday: '$1,400',
    avgBookingValue: '$1,352', commission: '$1,420', topDestination: 'Bangkok, Thailand',
    pendingBookings: 3, cancelledBookings: 2,
    conversionNum: 61, avgBookingNum: 1352, qualityNum: 78,
  },
  {
    id: 3, name: 'Tom Keller', avatar: 'TK', role: 'Agent', email: 'tom@risezonic.com', phone: '+1 555-0103',
    calls: 98, bookings: 18, revenue: '$23,100', conversion: '58%', rating: 4.3, status: 'Break', targets: 60,
    firstLogin: '08:30 AM', lastLogout: '—', totalLoginTime: '9h 12m', loginCount: 1, daysActive: 19,
    callsAnswered: 90, callsMissed: 8, answerRate: '92%', avgCallScore: 74, qualityRating: 'Average',
    escalations: 8, firstCallResolution: '71%',
    totalBreakTime: '1h 08m', breakCount: 5, avgBreakDuration: '14m', lastBreak: 'Now (active)',
    scheduledBreaks: 2, unscheduledBreaks: 3,
    totalIdleTime: '58m', idlePct: '10%', longestIdle: '22m', idleSessions: 10,
    avgHandleTime: '5m 14s', avgTalkTime: '4m 30s', avgWrapTime: '44s', avgRingTime: '14s',
    revenueMonth: '$23,100', revenueWeek: '$4,800', revenueToday: '$890',
    avgBookingValue: '$1,283', commission: '$1,155', topDestination: 'Paris, France',
    pendingBookings: 5, cancelledBookings: 3,
    conversionNum: 58, avgBookingNum: 1283, qualityNum: 74,
  },
  {
    id: 4, name: 'Emma Wilson', avatar: 'EW', role: 'Junior Agent', email: 'emma@risezonic.com', phone: '+1 555-0104',
    calls: 74, bookings: 12, revenue: '$16,800', conversion: '52%', rating: 4.1, status: 'Online', targets: 45,
    firstLogin: '09:00 AM', lastLogout: '—', totalLoginTime: '7h 32m', loginCount: 1, daysActive: 15,
    callsAnswered: 68, callsMissed: 6, answerRate: '92%', avgCallScore: 70, qualityRating: 'Average',
    escalations: 11, firstCallResolution: '64%',
    totalBreakTime: '38m', breakCount: 3, avgBreakDuration: '13m', lastBreak: '12:45 PM',
    scheduledBreaks: 2, unscheduledBreaks: 1,
    totalIdleTime: '1h 12m', idlePct: '16%', longestIdle: '28m', idleSessions: 13,
    avgHandleTime: '6m 02s', avgTalkTime: '5m 10s', avgWrapTime: '52s', avgRingTime: '18s',
    revenueMonth: '$16,800', revenueWeek: '$3,600', revenueToday: '$720',
    avgBookingValue: '$1,400', commission: '$840', topDestination: 'Maldives',
    pendingBookings: 6, cancelledBookings: 4,
    conversionNum: 52, avgBookingNum: 1400, qualityNum: 70,
  },
  {
    id: 5, name: 'Alex Chen', avatar: 'AC', role: 'Agent', email: 'alex@risezonic.com', phone: '+1 555-0105',
    calls: 105, bookings: 19, revenue: '$25,300', conversion: '64%', rating: 4.4, status: 'Offline', targets: 62,
    firstLogin: '08:10 AM', lastLogout: '05:30 PM', totalLoginTime: '9h 20m', loginCount: 1, daysActive: 21,
    callsAnswered: 99, callsMissed: 6, answerRate: '94%', avgCallScore: 82, qualityRating: 'Good',
    escalations: 4, firstCallResolution: '81%',
    totalBreakTime: '44m', breakCount: 3, avgBreakDuration: '15m', lastBreak: '01:55 PM',
    scheduledBreaks: 2, unscheduledBreaks: 1,
    totalIdleTime: '34m', idlePct: '6%', longestIdle: '14m', idleSessions: 6,
    avgHandleTime: '4m 18s', avgTalkTime: '3m 44s', avgWrapTime: '34s', avgRingTime: '9s',
    revenueMonth: '$25,300', revenueWeek: '$5,600', revenueToday: '$0',
    avgBookingValue: '$1,332', commission: '$1,265', topDestination: 'Singapore',
    pendingBookings: 2, cancelledBookings: 1,
    conversionNum: 64, avgBookingNum: 1332, qualityNum: 82,
  },
];

const statusColors = { Online: 'bg-green-400', Break: 'bg-yellow-400', Offline: 'bg-gray-300' };
const statusText   = { Online: 'text-green-700 bg-green-100', Break: 'text-yellow-700 bg-yellow-100', Offline: 'text-gray-600 bg-gray-100' };

// Value prediction: score agent 0–100 and classify
function predictValue(a) {
  const score = (a.conversionNum * 0.4) + ((a.avgBookingNum / 20) * 0.3) + (a.qualityNum * 0.3);
  if (score >= 72) return { label: 'High Value', color: 'text-green-700 bg-green-100', bar: 'bg-green-500', pct: Math.min(100, Math.round(score)), tip: 'Top performer — strong conversion, quality & revenue.' };
  if (score >= 55) return { label: 'Moderate Value', color: 'text-yellow-700 bg-yellow-100', bar: 'bg-yellow-500', pct: Math.min(100, Math.round(score)), tip: 'Consistent performer with room to improve conversion or quality.' };
  return { label: 'Needs Improvement', color: 'text-red-700 bg-red-100', bar: 'bg-red-500', pct: Math.min(100, Math.round(score)), tip: 'Requires coaching — low conversion or quality score.' };
}

const Row = ({ label, value, bold }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-400">{label}</span>
    <span className={`text-xs ${bold ? 'font-bold text-primary-700' : 'font-semibold text-gray-700'}`}>{value}</span>
  </div>
);

const SectionCard = ({ title, icon, iconColor, children }) => (
  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4">
    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-50">
      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: iconColor + '18' }}>
        <Sv d={icon} size={13} color={iconColor} sw={2} />
      </div>
      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{title}</span>
    </div>
    <div className="px-4 py-1">{children}</div>
  </div>
);

export default function Agents() {
  const [selected, setSelected] = useState(null);

  return (
    <DashboardLayout title="Agents" subtitle="Monitor agent performance, calls, bookings, and productivity">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Agents',   val: agents.length,                                    icon: ic.users,  bg: 'bg-blue-50 text-blue-700',   c: '#2563eb' },
          { label: 'Online Now',     val: agents.filter(a => a.status === 'Online').length, icon: ic.circle, bg: 'bg-green-50 text-green-700',  c: '#16a34a' },
          { label: 'Total Bookings', val: agents.reduce((s, a) => s + a.bookings, 0),       icon: ic.plane,  bg: 'bg-purple-50 text-purple-700',c: '#7c3aed' },
          { label: 'Total Revenue',  val: '$136K',                                          icon: ic.dollar, bg: 'bg-amber-50 text-amber-700',  c: '#d97706' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">
              <Sv d={s.icon} size={17} color={s.c} />
            </div>
            <div>
              <div className="text-2xl font-black">{s.val}</div>
              <div className="text-xs font-medium opacity-70">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {agents.map(agent => {
          const vp = predictValue(agent);
          return (
            <div key={agent.id} className="card-hover p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg">
                    {agent.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColors[agent.status]} rounded-full border-2 border-white`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{agent.name}</h3>
                  <div className="text-sm text-gray-400">{agent.role}</div>
                  <span className={`badge text-xs mt-1 ${statusText[agent.status]}`}>{agent.status}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-gray-800">{agent.revenue}</div>
                  <div className="text-xs text-gray-400">Revenue</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                {[
                  { label: 'Calls',      val: agent.calls,      color: 'text-blue-700' },
                  { label: 'Bookings',   val: agent.bookings,   color: 'text-purple-700' },
                  { label: 'Conv. Rate', val: agent.conversion, color: 'text-green-700' },
                ].map(m => (
                  <div key={m.label} className="bg-gray-50 rounded-xl p-2">
                    <div className={`font-black text-lg ${m.color}`}>{m.val}</div>
                    <div className="text-xs text-gray-400">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Target progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Monthly Target</span>
                  <span className="font-semibold">{agent.targets}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className={`h-2 rounded-full transition-all duration-1000 ${agent.targets >= 75 ? 'bg-green-500' : agent.targets >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${agent.targets}%` }} />
                </div>
              </div>

              {/* Value prediction badge */}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold mb-4 ${vp.color}`}>
                <Sv d={ic.zap} size={11} color="currentColor" sw={2} />
                {vp.label}
              </div>

              {/* Rating + View Details */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className={`w-4 h-4 ${star <= Math.round(agent.rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm font-semibold text-gray-600 ml-1">{agent.rating}</span>
                </div>
                <button onClick={() => setSelected(agent)}
                  className="text-primary-600 text-xs font-semibold hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selected && (() => {
        const vp = predictValue(selected);
        return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="bg-gray-50 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col"
              style={{ maxHeight: '92vh' }} onClick={e => e.stopPropagation()}>

              {/* Modal header */}
              <div className="bg-gradient-to-r from-primary-700 to-accent-600 p-6 flex items-start gap-4 flex-shrink-0">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl flex items-center justify-center font-black text-xl text-white flex-shrink-0">
                  {selected.avatar}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-black text-white">{selected.name}</h2>
                  <div className="text-primary-200 text-sm">{selected.role}</div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className={`badge text-xs ${statusText[selected.status]}`}>{selected.status}</span>
                    <span className="text-xs text-primary-200">{selected.email}</span>
                    <span className="text-xs text-primary-200">{selected.phone}</span>
                  </div>
                </div>
                {/* Value prediction panel */}
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-right flex-shrink-0 min-w-[140px]">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold mb-2 ${vp.label === 'High Value' ? 'bg-green-100 text-green-800' : vp.label === 'Moderate Value' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    <Sv d={ic.zap} size={11} color="currentColor" sw={2.5} />
                    {vp.label}
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full mt-1 mb-1">
                    <div className={`h-1.5 rounded-full ${vp.bar}`} style={{ width: `${vp.pct}%` }} />
                  </div>
                  <div className="text-xs text-primary-200 mt-1.5 text-left leading-snug">{vp.tip}</div>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/60 hover:text-white ml-2 flex-shrink-0">
                  <Sv d={ic.close} size={20} color="currentColor" sw={2.5} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto p-6 space-y-0" style={{ maxHeight: 'calc(92vh - 160px)' }}>

                {/* Quick KPI strip */}
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Total Calls',    val: selected.calls,      c: 'text-blue-700',   bg: 'bg-blue-50' },
                    { label: 'Bookings',       val: selected.bookings,   c: 'text-purple-700', bg: 'bg-purple-50' },
                    { label: 'Conversion',     val: selected.conversion, c: 'text-green-700',  bg: 'bg-green-50' },
                    { label: 'Avg Score',      val: selected.avgCallScore, c: 'text-amber-700', bg: 'bg-amber-50' },
                  ].map(k => (
                    <div key={k.label} className={`${k.bg} rounded-2xl p-3 text-center`}>
                      <div className={`text-xl font-black ${k.c}`}>{k.val}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Login Details */}
                  <SectionCard title="Login Details" icon={ic.login} iconColor="#2563eb">
                    <Row label="First Login Today"      value={selected.firstLogin} />
                    <Row label="Last Logout"            value={selected.lastLogout} />
                    <Row label="Total Login Duration"   value={selected.totalLoginTime} bold />
                    <Row label="Login Count (Today)"    value={selected.loginCount} />
                    <Row label="Days Active (Month)"    value={`${selected.daysActive} days`} />
                  </SectionCard>

                  {/* Performance Details */}
                  <SectionCard title="Performance Details" icon={ic.chart} iconColor="#7c3aed">
                    <Row label="Calls Answered"         value={selected.callsAnswered} />
                    <Row label="Calls Missed"           value={selected.callsMissed} />
                    <Row label="Answer Rate"            value={selected.answerRate} bold />
                    <Row label="First Call Resolution"  value={selected.firstCallResolution} />
                    <Row label="Escalations"            value={selected.escalations} />
                    <Row label="Quality Rating"         value={selected.qualityRating} />
                    <Row label="Avg Call Score"         value={`${selected.avgCallScore}/100`} bold />
                  </SectionCard>

                  {/* Break Details */}
                  <SectionCard title="Break Details" icon={ic.coffee} iconColor="#d97706">
                    <Row label="Total Break Time"       value={selected.totalBreakTime} bold />
                    <Row label="Number of Breaks"       value={selected.breakCount} />
                    <Row label="Avg Break Duration"     value={selected.avgBreakDuration} />
                    <Row label="Last Break"             value={selected.lastBreak} />
                    <Row label="Scheduled Breaks"       value={selected.scheduledBreaks} />
                    <Row label="Unscheduled Breaks"     value={selected.unscheduledBreaks} />
                  </SectionCard>

                  {/* Idle Time */}
                  <SectionCard title="Idle Time" icon={ic.clock} iconColor="#64748b">
                    <Row label="Total Idle Time"        value={selected.totalIdleTime} bold />
                    <Row label="Idle % of Login Time"   value={selected.idlePct} />
                    <Row label="Longest Idle Session"   value={selected.longestIdle} />
                    <Row label="Idle Sessions"          value={selected.idleSessions} />
                  </SectionCard>

                  {/* Average Handling Time */}
                  <SectionCard title="Average Handling Time" icon={ic.phone} iconColor="#0891b2">
                    <Row label="Avg Handle Time (AHT)"  value={selected.avgHandleTime} bold />
                    <Row label="Avg Talk Time"           value={selected.avgTalkTime} />
                    <Row label="Avg Wrap-up Time"        value={selected.avgWrapTime} />
                    <Row label="Avg Ring Time"           value={selected.avgRingTime} />
                  </SectionCard>

                  {/* Revenue Details */}
                  <SectionCard title="Revenue Details" icon={ic.dollar} iconColor="#16a34a">
                    <Row label="Revenue This Month"     value={selected.revenueMonth} bold />
                    <Row label="Revenue This Week"      value={selected.revenueWeek} />
                    <Row label="Revenue Today"          value={selected.revenueToday} />
                    <Row label="Avg Booking Value"      value={selected.avgBookingValue} />
                    <Row label="Commission Earned"      value={selected.commission} />
                    <Row label="Top Destination Sold"   value={selected.topDestination} />
                    <Row label="Pending Bookings"       value={selected.pendingBookings} />
                    <Row label="Cancelled Bookings"     value={selected.cancelledBookings} />
                  </SectionCard>
                </div>

                {/* Monthly target bar */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 mt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sv d={ic.target} size={14} color="#7c3aed" sw={2} />
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Monthly Target Progress</span>
                    </div>
                    <span className="text-sm font-black text-gray-800">{selected.targets}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full">
                    <div className={`h-3 rounded-full transition-all duration-1000 ${selected.targets >= 75 ? 'bg-green-500' : selected.targets >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${selected.targets}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                    <span>0%</span><span>Target: 100%</span>
                  </div>
                </div>

                {/* Star rating */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sv d={ic.star} size={14} color="#f59e0b" sw={2} />
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Agent Rating</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg key={star} className={`w-5 h-5 ${star <= Math.round(selected.rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-lg font-black text-gray-800 ml-1">{selected.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </DashboardLayout>
  );
}
