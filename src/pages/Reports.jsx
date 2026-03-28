import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Sv = ({ d, size = 18, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const monthlyData = [
  { month: 'Oct', revenue: 68000, leads: 980, bookings: 142 },
  { month: 'Nov', revenue: 72000, leads: 1050, bookings: 158 },
  { month: 'Dec', revenue: 91000, leads: 1280, bookings: 198 },
  { month: 'Jan', revenue: 63000, leads: 890, bookings: 128 },
  { month: 'Feb', revenue: 78000, leads: 1100, bookings: 165 },
  { month: 'Mar', revenue: 84000, leads: 1284, bookings: 184 },
];

const topDestinations = [
  { dest: 'Dubai', bookings: 68, revenue: '$142K', pct: 85 },
  { dest: 'Maldives', bookings: 54, revenue: '$118K', pct: 72 },
  { dest: 'Europe Tours', bookings: 42, revenue: '$96K', pct: 58 },
  { dest: 'Thailand', bookings: 38, revenue: '$72K', pct: 48 },
  { dest: 'Singapore', bookings: 29, revenue: '$54K', pct: 36 },
];

export default function Reports() {
  const [period, setPeriod] = useState('6M');
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <DashboardLayout title="Reports" subtitle="Sales, marketing, and call analytics for data-driven decisions">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue', val: '$456K', change: '+18%', icon: ['M12 2v20','M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'], bg: 'bg-green-50 border-green-100', c: '#16a34a' },
          { label: 'Total Bookings', val: '975', change: '+12%', icon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z', bg: 'bg-blue-50 border-blue-100', c: '#2563eb' },
          { label: 'Total Leads', val: '6,584', change: '+9%', icon: ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2','M9 11a4 4 0 100-8 4 4 0 000 8z'], bg: 'bg-purple-50 border-purple-100', c: '#7c3aed' },
          { label: 'Avg. Booking Value', val: '$2,840', change: '+5%', icon: ['M18 20V10','M12 20V4','M6 20v-6'], bg: 'bg-amber-50 border-amber-100', c: '#d97706' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} border rounded-2xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center"><Sv d={s.icon} size={17} color={s.c} /></div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{s.change}</span>
            </div>
            <div className="text-2xl font-black text-gray-800">{s.val}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800">Revenue & Bookings Trend</h3>
            <div className="flex gap-2">
              {['3M', '6M', '1Y'].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${period === p ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-4 h-44">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 items-end" style={{ height: '160px' }}>
                  <div className="flex-1 bg-gradient-to-t from-primary-700 to-primary-400 rounded-t-lg transition-all duration-700 hover:from-primary-800 hover:to-primary-500 cursor-pointer"
                    style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                    title={`$${(d.revenue / 1000).toFixed(0)}K`} />
                  <div className="flex-1 bg-gradient-to-t from-accent-600 to-accent-400 rounded-t-lg opacity-70 transition-all duration-700"
                    style={{ height: `${(d.bookings / 200) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-400">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-6 mt-4 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-primary-600 rounded" /><span className="text-gray-500">Revenue</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-accent-500 rounded" /><span className="text-gray-500">Bookings</span></div>
          </div>
        </div>

        {/* Top destinations */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-800 mb-4">Top Destinations</h3>
          <div className="space-y-4">
            {topDestinations.map((d, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{d.dest}</span>
                  <span className="text-gray-500">{d.bookings} bookings</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full" style={{ width: `${d.pct}%` }} />
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{d.revenue} revenue</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export buttons */}
      <div className="card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-800">Export Reports</h3>
          <p className="text-sm text-gray-400">Download detailed reports for analysis</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Sales Report', color: 'btn-primary' },
            { label: 'Marketing Report', color: 'btn-secondary' },
            { label: 'Call Analytics', color: 'btn-outline' },
          ].map(b => (
            <button key={b.label} className={`${b.color} text-sm py-2.5`}>{b.label}</button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
