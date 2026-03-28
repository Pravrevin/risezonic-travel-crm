import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Sv = ({ d, size = 16, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ic = {
  phone: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.72 19.79 19.79 0 01.11 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  check: 'M20 6L9 17l-5-5',
  missed: ['M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 1 1 0 01-.29-.21M1 1l22 22'],
  warn: ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z','M12 9v4','M12 17h.01'],
  inbound: ['M5 12h14','M12 19l7-7-7-7'],
  outbound: ['M19 12H5','M12 5l-7 7 7 7'],
  play: ['M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z','M19 10v2a7 7 0 01-14 0v-2','M12 19v4','M8 23h8'],
};

const callsData = [
  { id: 1, caller: 'Raj Kumar', phone: '+91 98765 43210', type: 'Inbound', status: 'Completed', duration: '4:32', agent: 'Sarah Johnson', time: '10:24 AM', notes: 'Interested in Dubai package, callback tomorrow' },
  { id: 2, caller: 'Priya Singh', phone: '+91 87654 32109', type: 'Outbound', status: 'Completed', duration: '2:18', agent: 'Mike Roberts', time: '10:05 AM', notes: 'Confirmed follow-up for Maldives quote' },
  { id: 3, caller: 'Unknown', phone: '+1 555 0189', type: 'Inbound', status: 'Missed', duration: '0:00', agent: '—', time: '9:47 AM', notes: '' },
  { id: 4, caller: 'John Davis', phone: '+1 555 0134', type: 'Outbound', status: 'Completed', duration: '6:45', agent: 'Sarah Johnson', time: '9:30 AM', notes: 'Booking confirmed for Europe tour' },
  { id: 5, caller: 'Aisha Khan', phone: '+91 76543 21098', type: 'Inbound', status: 'Abandoned', duration: '0:12', agent: '—', time: '9:12 AM', notes: '' },
  { id: 6, caller: 'Mike Thompson', phone: '+1 555 0198', type: 'Outbound', status: 'No Answer', duration: '0:00', agent: 'Tom Keller', time: '8:55 AM', notes: 'Will retry later' },
];

const statusColors = {
  Completed: 'bg-green-100 text-green-700',
  Missed: 'bg-red-100 text-red-700',
  Abandoned: 'bg-orange-100 text-orange-700',
  'No Answer': 'bg-gray-100 text-gray-600',
};

export default function Calls() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? callsData : callsData.filter(c => c.status === filter || c.type === filter);

  const stats = [
    { label: 'Total Calls', value: callsData.length, icon: ic.phone, c: '#2563eb', color: 'bg-blue-50 text-blue-700' },
    { label: 'Completed', value: callsData.filter(c => c.status === 'Completed').length, icon: ic.check, c: '#16a34a', color: 'bg-green-50 text-green-700' },
    { label: 'Missed', value: callsData.filter(c => c.status === 'Missed').length, icon: ic.missed, c: '#dc2626', color: 'bg-red-50 text-red-700' },
    { label: 'Abandoned', value: callsData.filter(c => c.status === 'Abandoned').length, icon: ic.warn, c: '#ea580c', color: 'bg-orange-50 text-orange-700' },
  ];

  return (
    <DashboardLayout title="Calls" subtitle="All incoming, outgoing, missed, and abandoned calls">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className={`${s.color} rounded-2xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">
              <Sv d={s.icon} size={17} color={s.c} />
            </div>
            <div>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs font-medium opacity-70">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-4 flex flex-wrap gap-2 items-center">
        <span className="text-sm font-semibold text-gray-600 mr-2">Filter:</span>
        {['All', 'Inbound', 'Outbound', 'Completed', 'Missed', 'Abandoned'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f}
          </button>
        ))}
        <div className="ml-auto">
          <button className="btn-primary py-2 text-sm flex items-center gap-2">
            <Sv d={ic.phone} size={14} color="white" /> Log Call
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header text-left">Caller</th>
                <th className="table-header text-left">Type</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-left">Duration</th>
                <th className="table-header text-left">Agent</th>
                <th className="table-header text-left">Time</th>
                <th className="table-header text-left">Notes</th>
                <th className="table-header text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(call => {
                const inbound = call.type === 'Inbound';
                return (
                  <tr key={call.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell">
                      <div className="font-semibold text-gray-800 text-sm">{call.caller}</div>
                      <div className="text-xs text-gray-400">{call.phone}</div>
                    </td>
                    <td className="table-cell">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Sv d={inbound ? ic.inbound : ic.outbound} size={13} color={inbound ? '#059669' : '#0ea5e9'} sw={2} />
                        <span className="text-gray-600">{call.type}</span>
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${statusColors[call.status]}`}>{call.status}</span>
                    </td>
                    <td className="table-cell font-mono text-sm text-gray-700">{call.duration}</td>
                    <td className="table-cell text-gray-600 text-sm">{call.agent}</td>
                    <td className="table-cell text-gray-400 text-sm">{call.time}</td>
                    <td className="table-cell text-gray-500 text-sm max-w-[200px] truncate">{call.notes || '—'}</td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button className="text-primary-600 hover:text-primary-700 text-xs font-semibold flex items-center gap-1">
                          <Sv d={ic.phone} size={11} color="currentColor" sw={2} /> Call
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 text-xs font-semibold flex items-center gap-1">
                          <Sv d={ic.play} size={11} color="currentColor" sw={2} /> Play
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
