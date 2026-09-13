import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const Sv = ({ d, size = 20, color = 'currentColor', sw = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ENTRIES = [
  {
    label: 'Add Lead', path: '/leads', from: '#0ea5e9', to: '#0353a1',
    desc: 'Capture a new enquiry with travel details and follow-up.',
    icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  },
  {
    label: 'Log Call', path: '/calls', from: '#14b8a6', to: '#0f766e',
    desc: 'Record a call disposition, remarks, and a booking if one was made.',
    icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.72 19.79 19.79 0 01.11 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  },
  {
    label: 'New Booking', path: '/bookings', from: '#f59e0b', to: '#b45309',
    desc: 'Enter passenger, flight and payment details for a confirmed booking.',
    icon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  },
];

/** What an Agent login sees instead of the analytics dashboard: just the entry points. */
export default function AgentHome() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <DashboardLayout title={`${greeting}, ${user?.name?.split(' ')[0] || 'there'}`} subtitle="Pick what you'd like to enter">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {ENTRIES.map(e => (
          <Link key={e.path} to={e.path} state={{ openEntry: true }}
            className="card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
              style={{ background: `linear-gradient(135deg, ${e.from}, ${e.to})` }}>
              <Sv d={e.icon} size={22} color="white" />
            </div>
            <div>
              <div className="font-bold text-gray-800 text-lg group-hover:text-primary-700 transition-colors">{e.label}</div>
              <div className="text-sm text-gray-500 mt-1">{e.desc}</div>
            </div>
            <div className="text-primary-600 text-sm font-semibold mt-auto">Open form →</div>
          </Link>
        ))}
      </div>

      <div className="card p-5 bg-primary-50/60 border-primary-100 text-sm text-gray-600">
        Everything you enter is filed under <span className="font-semibold text-gray-800">{user?.name}</span> and goes straight to the admin's register.
        You won't see the records here — if you need to check something, ask your admin.
      </div>
    </DashboardLayout>
  );
}
