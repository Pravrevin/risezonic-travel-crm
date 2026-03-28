import { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Sv = ({ d, size = 16, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);
const ic = {
  users:   ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2','M9 11a4 4 0 100-8 4 4 0 000 8z'],
  star:    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  dollar:  ['M12 2v20','M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'],
  plane:   'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  mail:    ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
  phone:   'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.72 19.79 19.79 0 01.11 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  map:     ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z','M12 7a3 3 0 100 6 3 3 0 000-6z'],
  globe:   ['M12 2a10 10 0 100 20A10 10 0 0012 2z','M2 12h20','M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z'],
  id:      ['M2 3h20v18H2z','M12 8a4 4 0 100 8 4 4 0 000-8z','M2 13h3','M19 13h3'],
  cal:     ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  check:   'M20 6L9 17l-5-5',
  x:       ['M18 6L6 18','M6 6l12 12'],
  clock:   ['M12 2a10 10 0 100 20A10 10 0 0012 2z','M12 6v6l4 2'],
  hotel:   ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z','M9 22V12h6v10'],
  car:     ['M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-1','M7 17a2 2 0 100 4 2 2 0 000-4z','M17 17a2 2 0 100 4 2 2 0 000-4z'],
  shield:  'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  ticket:  ['M15 5v2','M15 11v2','M15 17v2','M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z'],
  trending:'M23 6l-9.5 9.5-5-5L1 18',
};

const customerData = [
  {
    id: 1, name: 'John Davis', email: 'john@email.com', phone: '+1 555 0134',
    country: 'USA', state: 'California', city: 'Los Angeles',
    status: 'VIP', segment: 'Luxury Traveler', avatar: 'JD',
    joinDate: '2023-06-12', preferredLanguage: 'English', passportNo: 'US882341',
    bookings: [
      { id: 'BK001', destination: 'Europe Tour 10D', type: 'Package', date: '2026-03-26', status: 'Confirmed', revenue: 5200, agent: 'Sarah J.' },
      { id: 'BK009', destination: 'Maldives 7N', type: 'Hotel', date: '2025-11-10', status: 'Confirmed', revenue: 4100, agent: 'Mike R.' },
      { id: 'BK014', destination: 'Dubai Package 5N', type: 'Package', date: '2025-07-04', status: 'Confirmed', revenue: 3200, agent: 'Sarah J.' },
      { id: 'BK021', destination: 'Thailand 8D', type: 'Package', date: '2025-02-20', status: 'Confirmed', revenue: 2800, agent: 'Tom K.' },
      { id: 'BK028', destination: 'Singapore Flight', type: 'Flight', date: '2024-09-15', status: 'Cancelled', revenue: 3100, agent: 'Sarah J.' },
    ],
  },
  {
    id: 2, name: 'Fatima Ali', email: 'fatima@email.com', phone: '+971 50 123 4567',
    country: 'UAE', state: 'Dubai', city: 'Dubai',
    status: 'Regular', segment: 'Frequent Traveler', avatar: 'FA',
    joinDate: '2024-01-08', preferredLanguage: 'Arabic', passportNo: 'AE441209',
    bookings: [
      { id: 'BK002', destination: 'Bali Resort 7N', type: 'Hotel', date: '2026-03-25', status: 'Confirmed', revenue: 2900, agent: 'Sarah J.' },
      { id: 'BK011', destination: 'Istanbul Tour 6D', type: 'Package', date: '2025-10-03', status: 'Confirmed', revenue: 3100, agent: 'Mike R.' },
      { id: 'BK017', destination: 'Maldives Water Villa', type: 'Hotel', date: '2025-05-18', status: 'Pending Payment', revenue: 2700, agent: 'Sarah J.' },
    ],
  },
  {
    id: 3, name: 'Raj Kumar', email: 'raj@gmail.com', phone: '+91 98765 43210',
    country: 'India', state: 'Maharashtra', city: 'Mumbai',
    status: 'VIP', segment: 'Top Revenue Customer', avatar: 'RK',
    joinDate: '2022-11-19', preferredLanguage: 'Hindi', passportNo: 'IN773002',
    bookings: [
      { id: 'BK004', destination: 'Dubai Package 5N', type: 'Package', date: '2026-03-24', status: 'Confirmed', revenue: 2500, agent: 'Mike R.' },
      { id: 'BK010', destination: 'Japan 10D', type: 'Package', date: '2025-12-01', status: 'Confirmed', revenue: 4600, agent: 'Tom K.' },
      { id: 'BK015', destination: 'Europe Deluxe Tour', type: 'Package', date: '2025-08-22', status: 'Confirmed', revenue: 6200, agent: 'Sarah J.' },
      { id: 'BK022', destination: 'Singapore 4N', type: 'Package', date: '2025-04-11', status: 'Confirmed', revenue: 2200, agent: 'Mike R.' },
      { id: 'BK029', destination: 'Maldives Honeymoon', type: 'Package', date: '2024-12-15', status: 'Confirmed', revenue: 3900, agent: 'Sarah J.' },
      { id: 'BK033', destination: 'Bali Family Trip', type: 'Package', date: '2024-06-03', status: 'Confirmed', revenue: 2100, agent: 'Tom K.' },
      { id: 'BK040', destination: 'Thailand 7N', type: 'Hotel', date: '2023-10-29', status: 'Cancelled', revenue: 1000, agent: 'Mike R.' },
    ],
  },
  {
    id: 4, name: 'David Lee', email: 'david@email.com', phone: '+1 555 0267',
    country: 'USA', state: 'New York', city: 'New York City',
    status: 'Regular', segment: 'New Customer', avatar: 'DL',
    joinDate: '2025-08-30', preferredLanguage: 'English', passportNo: 'US991034',
    bookings: [
      { id: 'BK003', destination: 'Japan 10D', type: 'Package', date: '2026-05-01', status: 'Pending Payment', revenue: 4600, agent: 'Tom K.' },
      { id: 'BK019', destination: 'Singapore 4N', type: 'Flight', date: '2025-09-14', status: 'Confirmed', revenue: 4600, agent: 'Sarah J.' },
    ],
  },
  {
    id: 5, name: 'Sophie Martin', email: 'sophie@email.com', phone: '+33 6 12 34 56 78',
    country: 'France', state: 'Île-de-France', city: 'Paris',
    status: 'Regular', segment: 'Leisure Traveler', avatar: 'SM',
    joinDate: '2024-03-21', preferredLanguage: 'French', passportNo: 'FR552871',
    bookings: [
      { id: 'BK005', destination: 'Maldives 5N', type: 'Hotel', date: '2026-04-28', status: 'Confirmed', revenue: 3800, agent: 'Sarah J.' },
      { id: 'BK013', destination: 'Bali 7N', type: 'Package', date: '2025-11-20', status: 'Confirmed', revenue: 2700, agent: 'Mike R.' },
      { id: 'BK020', destination: 'Thailand Beach', type: 'Hotel', date: '2025-06-05', status: 'On Hold', revenue: 3100, agent: 'Tom K.' },
      { id: 'BK031', destination: 'Dubai Luxury', type: 'Package', date: '2025-01-17', status: 'Confirmed', revenue: 5000, agent: 'Sarah J.' },
    ],
  },
];

const segmentConfig = {
  'Top Revenue Customer': { color: 'bg-purple-100 text-purple-700', svgIcon: ic.dollar,   svgColor: '#7c3aed' },
  'Luxury Traveler':      { color: 'bg-amber-100 text-amber-700',   svgIcon: ic.star,     svgColor: '#d97706' },
  'Frequent Traveler':    { color: 'bg-blue-100 text-blue-700',     svgIcon: ic.plane,    svgColor: '#2563eb' },
  'Leisure Traveler':     { color: 'bg-teal-100 text-teal-700',     svgIcon: ic.globe,    svgColor: '#0d9488' },
  'New Customer':         { color: 'bg-green-100 text-green-700',   svgIcon: ic.users,    svgColor: '#16a34a' },
  'Corporate Traveler':   { color: 'bg-indigo-100 text-indigo-700', svgIcon: ic.trending, svgColor: '#4f46e5' },
};

const statusColors = {
  VIP: 'bg-amber-100 text-amber-700',
  Regular: 'bg-blue-100 text-blue-700',
  New: 'bg-green-100 text-green-700',
};

const bookingStatusConfig = {
  Confirmed: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  'Pending Payment': { color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  Cancelled: { color: 'bg-red-100 text-red-500', dot: 'bg-red-400' },
  'On Hold': { color: 'bg-orange-100 text-orange-600', dot: 'bg-orange-400' },
  Processing: { color: 'bg-blue-100 text-blue-600', dot: 'bg-blue-400' },
};

const typeIcons = { Package: ic.plane, Flight: ic.plane, Hotel: ic.hotel, Car: ic.car, Insurance: ic.shield, Train: ic.plane };

function CustomerStats({ bookings }) {
  const total = bookings.length;
  const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
  const pending = bookings.filter(b => b.status === 'Pending Payment' || b.status === 'On Hold' || b.status === 'Processing').length;
  const cancelled = bookings.filter(b => b.status === 'Cancelled').length;
  const revenue = bookings.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + b.revenue, 0);
  const avgTicket = confirmed > 0 ? (revenue / confirmed) : 0;

  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      {[
        { label: 'Total Bookings', val: total, sub: 'all time', color: 'text-gray-800', bg: 'bg-gray-50', svgI: ic.plane, c: '#6b7280' },
        { label: 'Confirmed', val: confirmed, sub: `${total ? Math.round(confirmed / total * 100) : 0}% rate`, color: 'text-green-700', bg: 'bg-green-50', svgI: ic.check, c: '#16a34a' },
        { label: 'Pending', val: pending, sub: 'need attention', color: 'text-yellow-700', bg: 'bg-yellow-50', svgI: ic.clock, c: '#ca8a04' },
        { label: 'Cancelled', val: cancelled, sub: 'lost revenue', color: 'text-red-600', bg: 'bg-red-50', svgI: ic.x, c: '#dc2626' },
        { label: 'Total Revenue', val: `$${revenue.toLocaleString()}`, sub: 'excl. cancellations', color: 'text-purple-700', bg: 'bg-purple-50', svgI: ic.dollar, c: '#7c3aed' },
        { label: 'Avg. Ticket', val: `$${Math.round(avgTicket).toLocaleString()}`, sub: 'per confirmed booking', color: 'text-blue-700', bg: 'bg-blue-50', svgI: ic.ticket, c: '#2563eb' },
      ].map((s, i) => (
        <div key={i} className={`${s.bg} rounded-xl p-3 text-center`}>
          <div className="flex justify-center mb-0.5"><Sv d={s.svgI} size={14} color={s.c} sw={2} /></div>
          <div className={`text-lg font-black ${s.color}`}>{s.val}</div>
          <div className="text-xs text-gray-500 font-medium leading-tight">{s.label}</div>
          <div className="text-xs text-gray-400">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

export default function Customers() {
  const [selected, setSelected] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [segFilter, setSegFilter] = useState('All');

  const filtered = customerData.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase());
    const matchSeg = segFilter === 'All' || c.status === segFilter;
    return matchSearch && matchSeg;
  });

  const totalRevenue = useMemo(() =>
    customerData.reduce((sum, c) =>
      sum + c.bookings.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + b.revenue, 0), 0),
    []);

  const openProfile = (c) => { setSelected(c); setProfileOpen(true); };

  return (
    <DashboardLayout title="Customers" subtitle="Complete customer records, booking history and interaction timeline">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Customers', val: customerData.length, svgI: ic.users,   c: '#2563eb', bg: 'bg-blue-50 text-blue-700' },
          { label: 'VIP Customers', val: customerData.filter(c => c.status === 'VIP').length, svgI: ic.star, c: '#d97706', bg: 'bg-amber-50 text-amber-700' },
          { label: 'Total Revenue', val: `$${(totalRevenue / 1000).toFixed(1)}K`, svgI: ic.dollar, c: '#16a34a', bg: 'bg-green-50 text-green-700' },
          { label: 'Total Bookings', val: customerData.reduce((s, c) => s + c.bookings.length, 0), svgI: ic.plane, c: '#7c3aed', bg: 'bg-purple-50 text-purple-700' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0"><Sv d={s.svgI} size={17} color={s.c} /></div>
            <div>
              <div className="text-2xl font-black">{s.val}</div>
              <div className="text-xs font-medium opacity-70">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-1 min-w-48">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input className="bg-transparent outline-none text-sm text-gray-700 w-full placeholder-gray-400" placeholder="Search by name, email, country..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['All', 'VIP', 'Regular', 'New'].map(f => (
            <button key={f} onClick={() => setSegFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${segFilter === f ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List */}
      <div className="grid gap-3">
        {filtered.map(c => {
          const revenue = c.bookings.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + b.revenue, 0);
          const confirmed = c.bookings.filter(b => b.status === 'Confirmed').length;
          const pending = c.bookings.filter(b => ['Pending Payment', 'On Hold', 'Processing'].includes(b.status)).length;
          const seg = segmentConfig[c.segment] || { color: 'bg-gray-100 text-gray-600', icon: '👤' };
          return (
            <div key={c.id} onClick={() => { setSelected(c); }}
              className={`card p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${selected?.id === c.id ? 'border-primary-400 border-2 shadow-md' : ''}`}>
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-500 text-white rounded-2xl flex items-center justify-center font-bold flex-shrink-0">
                  {c.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-gray-800">{c.name}</span>
                    <span className={`badge ${statusColors[c.status]}`}>{c.status}</span>
                    <span className={`badge ${seg.color} inline-flex items-center gap-1`}>
                      <Sv d={seg.svgIcon} size={10} color={seg.svgColor} sw={2.2} /> {c.segment}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">{c.email} • {c.phone} • {c.city}, {c.country}</div>
                </div>

                {/* Quick Stats */}
                <div className="hidden md:flex items-center gap-6 text-center flex-shrink-0">
                  <div>
                    <div className="text-sm font-black text-gray-800">{c.bookings.length}</div>
                    <div className="text-xs text-gray-400">Bookings</div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-green-700">{confirmed}</div>
                    <div className="text-xs text-gray-400">Confirmed</div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-yellow-600">{pending}</div>
                    <div className="text-xs text-gray-400">Pending</div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-800">${revenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Revenue</div>
                  </div>
                </div>

                {/* View Button */}
                <button onClick={e => { e.stopPropagation(); openProfile(c); }}
                  className="flex-shrink-0 btn-primary py-2 px-4 text-xs">
                  View Profile
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="flex justify-center mb-3"><Sv d={ic.users} size={40} color="#d1d5db" sw={1.4} /></div>
            <div className="font-medium">No customers found</div>
          </div>
        )}
      </div>

      {/* ── CUSTOMER PROFILE MODAL ──────────────────────────────── */}
      {profileOpen && selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col" style={{ maxHeight: '92vh' }}>

            {/* Modal Header */}
            <div className="travel-gradient rounded-t-2xl px-6 py-5 flex items-start justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur text-white rounded-2xl flex items-center justify-center font-black text-xl border border-white/30">
                  {selected.avatar}
                </div>
                <div>
                  <h3 className="text-white font-black text-xl leading-tight">{selected.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white`}>{selected.status}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">
                      {selected.segment}
                    </span>
                    <span className="text-blue-100 text-xs">Since {selected.joinDate}</span>
                  </div>
                  <div className="text-blue-100 text-xs mt-1">{selected.email} • {selected.phone}</div>
                </div>
              </div>
              <button onClick={() => setProfileOpen(false)}
                className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-xl font-light flex-shrink-0">×</button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5">

              {/* Booking Stats */}
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Booking Overview</h4>
              <CustomerStats bookings={selected.bookings} />

              {/* Profile Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Details</h4>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Email', val: selected.email, svgI: ic.mail },
                      { label: 'Phone', val: selected.phone, svgI: ic.phone },
                      { label: 'Location', val: `${selected.city}, ${selected.state}, ${selected.country}`, svgI: ic.map },
                      { label: 'Language', val: selected.preferredLanguage, svgI: ic.globe },
                      { label: 'Passport', val: selected.passportNo, svgI: ic.id },
                    ].map(({ label, val, svgI }) => (
                      <div key={label} className="flex items-start gap-2">
                        <span className="w-5 flex-shrink-0 flex items-center pt-0.5"><Sv d={svgI} size={14} color="#9ca3af" sw={1.8} /></span>
                        <span className="text-gray-400 w-20 flex-shrink-0">{label}</span>
                        <span className="font-semibold text-gray-800 flex-1 break-all">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Segment Analysis</h4>
                  <div className="space-y-3">
                    {/* Segment Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold ${segmentConfig[selected.segment]?.color || 'bg-gray-100 text-gray-600'}`}>
                      <Sv d={segmentConfig[selected.segment]?.svgIcon || ic.plane} size={13} color={segmentConfig[selected.segment]?.svgColor || '#6b7280'} sw={2} />
                      {selected.segment}
                    </div>
                    {/* Revenue bar */}
                    {(() => {
                      const rev = selected.bookings.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + b.revenue, 0);
                      const maxRev = 25000;
                      const pct = Math.min(100, Math.round(rev / maxRev * 100));
                      return (
                        <div>
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Lifetime Revenue</span><span className="font-bold text-gray-800">${rev.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })()}
                    {/* Booking frequency */}
                    {(() => {
                      const months = Math.max(1, Math.round((new Date() - new Date(selected.joinDate)) / (1000 * 60 * 60 * 24 * 30)));
                      const freq = (selected.bookings.length / months * 12).toFixed(1);
                      return (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Booking Frequency</span>
                          <span className="font-bold text-gray-800">{freq} trips/year</span>
                        </div>
                      );
                    })()}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Most Booked Type</span>
                      <span className="font-bold text-gray-800">
                        {(() => {
                          const types = selected.bookings.reduce((acc, b) => { acc[b.type] = (acc[b.type] || 0) + 1; return acc; }, {});
                          return Object.entries(types).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Preferred Agent</span>
                      <span className="font-bold text-gray-800">
                        {(() => {
                          const agents = selected.bookings.reduce((acc, b) => { acc[b.agent] = (acc[b.agent] || 0) + 1; return acc; }, {});
                          return Object.entries(agents).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking History Table */}
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Booking History <span className="text-gray-300 font-normal">({selected.bookings.length} bookings)</span>
              </h4>
              <div className="card overflow-hidden mb-2">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="table-header text-left">Booking ID</th>
                        <th className="table-header text-left">Destination</th>
                        <th className="table-header text-left">Type</th>
                        <th className="table-header text-left">Date</th>
                        <th className="table-header text-left">Status</th>
                        <th className="table-header text-left">Agent</th>
                        <th className="table-header text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.bookings.map(bk => {
                        const sc = bookingStatusConfig[bk.status] || { color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };
                        return (
                          <tr key={bk.id} className="hover:bg-gray-50 transition-colors">
                            <td className="table-cell">
                              <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{bk.id}</span>
                            </td>
                            <td className="table-cell font-medium text-gray-800">{bk.destination}</td>
                            <td className="table-cell">
                              <span className="inline-flex items-center gap-1.5">
                                <Sv d={typeIcons[bk.type] || ic.plane} size={12} color="#9ca3af" sw={2} />
                                <span className="text-xs text-gray-500">{bk.type}</span>
                              </span>
                            </td>
                            <td className="table-cell text-gray-400 text-xs">{bk.date}</td>
                            <td className="table-cell">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${sc.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                {bk.status}
                              </span>
                            </td>
                            <td className="table-cell text-gray-500 text-xs">{bk.agent}</td>
                            <td className="table-cell text-right">
                              <span className={`font-bold text-sm ${bk.status === 'Cancelled' ? 'line-through text-gray-300' : 'text-gray-800'}`}>
                                ${bk.revenue.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    {/* Revenue Footer */}
                    <tfoot>
                      <tr className="bg-gray-50 border-t-2 border-gray-100">
                        <td colSpan={5} className="px-4 py-3 text-xs font-semibold text-gray-500">
                          Total (excl. cancellations)
                        </td>
                        <td colSpan={2} className="px-4 py-3 text-right font-black text-gray-800">
                          ${selected.bookings.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + b.revenue, 0).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setProfileOpen(false)} className="btn-outline flex-1 py-2.5 text-sm">Close</button>
              <button className="btn-primary flex-1 py-2.5 text-sm">New Booking for {selected.name.split(' ')[0]}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
