import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Sv = ({ d, size = 16, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ic = {
  bell: ['M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 01-3.46 0'],
  warn: ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z','M12 9v4','M12 17h.01'],
  clock: ['M12 2a10 10 0 100 20A10 10 0 0012 2z','M12 6v6l4 2'],
  check: 'M20 6L9 17l-5-5',
  plane: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  phone: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.72 19.79 19.79 0 01.11 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  user: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2','M12 11a4 4 0 100-8 4 4 0 000 8z'],
};

const followups = [
  { id: 1, lead: 'Raj Kumar', phone: '+91 98765 43210', destination: 'Dubai Package', due: '2026-03-27 02:00 PM', priority: 'Urgent', agent: 'Sarah J.', notes: 'Waiting for quote confirmation', status: 'Pending' },
  { id: 2, lead: 'Priya Singh', phone: '+91 87654 32109', destination: 'Maldives 5N', due: '2026-03-27 04:30 PM', priority: 'High', agent: 'Mike R.', notes: 'Send revised itinerary', status: 'Pending' },
  { id: 3, lead: 'John Davis', phone: '+1 555 0134', destination: 'Europe Tour', due: '2026-03-28 10:00 AM', priority: 'Normal', agent: 'Sarah J.', notes: 'Payment confirmation follow-up', status: 'Scheduled' },
  { id: 4, lead: 'Aisha Khan', phone: '+91 76543 21098', destination: 'Singapore', due: '2026-03-27 11:00 AM', priority: 'Urgent', agent: 'Tom K.', notes: 'Hot lead — needs immediate attention', status: 'Overdue' },
  { id: 5, lead: 'Mike Thompson', phone: '+1 555 0198', destination: 'Thailand 7N', due: '2026-03-29 02:00 PM', priority: 'Low', agent: 'Mike R.', notes: 'Send hotel options', status: 'Scheduled' },
];

const priorityColors = { Urgent: 'bg-red-100 text-red-700', High: 'bg-orange-100 text-orange-700', Normal: 'bg-blue-100 text-blue-700', Low: 'bg-gray-100 text-gray-600' };
const statusColors = { Pending: 'bg-yellow-100 text-yellow-700', Scheduled: 'bg-blue-100 text-blue-700', Overdue: 'bg-red-100 text-red-700', Done: 'bg-green-100 text-green-700' };

export default function Followups() {
  const [data, setData] = useState(followups);
  const [filter, setFilter] = useState('All');

  const markDone = (id) => setData(d => d.map(f => f.id === id ? { ...f, status: 'Done' } : f));
  const filtered = filter === 'All' ? data : data.filter(f => f.status === filter || f.priority === filter);

  return (
    <DashboardLayout title="Follow-ups" subtitle="Track scheduled callbacks and pending lead interactions">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', val: data.length, icon: ic.bell, c: '#6b7280', bg: 'bg-gray-50' },
          { label: 'Overdue', val: data.filter(f => f.status === 'Overdue').length, icon: ic.warn, c: '#dc2626', bg: 'bg-red-50' },
          { label: 'Pending', val: data.filter(f => f.status === 'Pending').length, icon: ic.clock, c: '#ca8a04', bg: 'bg-yellow-50' },
          { label: 'Done Today', val: data.filter(f => f.status === 'Done').length, icon: ic.check, c: '#16a34a', bg: 'bg-green-50' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0">
              <Sv d={s.icon} size={17} color={s.c} />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-800">{s.val}</div>
              <div className="text-xs text-gray-500 font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-4 flex flex-wrap gap-2">
        {['All', 'Overdue', 'Pending', 'Scheduled', 'Done', 'Urgent'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(f => (
          <div key={f.id} className={`card p-5 hover:shadow-md transition-all duration-200 ${f.status === 'Overdue' ? 'border-l-4 border-red-500' : f.priority === 'Urgent' ? 'border-l-4 border-orange-500' : ''}`}>
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-gray-800">{f.lead}</h3>
                  <span className={`badge ${priorityColors[f.priority]}`}>{f.priority}</span>
                  <span className={`badge ${statusColors[f.status]}`}>{f.status}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Sv d={ic.plane} size={12} color="#9ca3af" sw={2} /> {f.destination}</span>
                  <span className="flex items-center gap-1.5"><Sv d={ic.phone} size={12} color="#9ca3af" sw={2} /> {f.phone}</span>
                  <span className="flex items-center gap-1.5"><Sv d={ic.user} size={12} color="#9ca3af" sw={2} /> {f.agent}</span>
                  <span className="flex items-center gap-1.5"><Sv d={ic.clock} size={12} color="#9ca3af" sw={2} /> {f.due}</span>
                </div>
                {f.notes && <p className="text-sm text-gray-600 mt-2 bg-gray-50 px-3 py-2 rounded-lg">{f.notes}</p>}
              </div>
              <div className="flex gap-2">
                <button className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
                  <Sv d={ic.phone} size={13} color="white" sw={2} /> Call Now
                </button>
                {f.status !== 'Done' && (
                  <button onClick={() => markDone(f.id)} className="border border-green-300 text-green-700 hover:bg-green-50 font-semibold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-1.5">
                    <Sv d={ic.check} size={13} color="#15803d" sw={2.5} /> Mark Done
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 card">
            <div className="flex justify-center mb-2"><Sv d={ic.bell} size={36} color="#d1d5db" sw={1.5} /></div>
            <div>No follow-ups found for this filter</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
