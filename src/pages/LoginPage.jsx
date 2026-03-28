import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sv = ({ d, size = 20, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ic = {
  plane:   'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  users:   ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2','M9 11a4 4 0 100-8 4 4 0 000 8z'],
  phone:   'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.72 19.79 19.79 0 01.11 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  dollar:  ['M12 2v20','M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'],
  warn:    ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z','M12 9v4','M12 17h.01'],
  login:   ['M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4','M10 17l5-5-5-5','M15 12H3'],
};

export default function LoginPage() {
  const [email, setEmail] = useState('admin@travelcrm.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient bg-gradient-animate relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center text-white max-w-md">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float shadow-2xl">
            <Sv d={ic.plane} size={38} color="white" sw={1.5} />
          </div>
          <h1 className="text-4xl font-black mb-4">Welcome Back to<br /><span className="text-accent-300">TravelCRM</span></h1>
          <p className="text-blue-200 text-lg mb-10">The smartest way to manage your travel business — leads, calls, bookings, and agents all in one place.</p>

          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { icon: ic.users,  title: '1,284 Leads',    sub: 'Tracked this month',    c: '#7dd3fc' },
              { icon: ic.phone,  title: '2,841 Calls',    sub: 'Logged & analyzed',     c: '#86efac' },
              { icon: ic.plane,  title: '384 Bookings',   sub: 'Confirmed this week',   c: '#fde68a' },
              { icon: ic.dollar, title: '$284K',          sub: 'Revenue generated',     c: '#c4b5fd' },
            ].map((s, i) => (
              <div key={i} className="glass-card rounded-2xl p-4">
                <div className="mb-2"><Sv d={s.icon} size={22} color={s.c} sw={1.6} /></div>
                <div className="text-white font-bold">{s.title}</div>
                <div className="text-blue-200 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-700 to-accent-500 rounded-xl flex items-center justify-center">
              <Sv d={ic.plane} size={18} color="white" sw={1.6} />
            </div>
            <span className="text-gray-800 font-bold text-xl">Travel<span className="text-accent-600">CRM</span></span>
          </div>

          <div className="card p-8 shadow-xl">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-800 mb-2">Sign In</h2>
              <p className="text-gray-500">Access your travel business dashboard</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                <Sv d={ic.warn} size={16} color="#b91c1c" sw={2} /> {error}
              </div>
            )}

            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary-600 font-semibold text-sm">Demo Credentials</span>
                <span className="badge bg-primary-100 text-primary-700">Try it free</span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div><span className="font-medium">Email:</span> admin@travelcrm.com</div>
                <div><span className="font-medium">Password:</span> demo123</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <a href="#" className="text-xs text-primary-600 hover:text-primary-700 font-medium">Forgot password?</a>
                </div>
                <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <><Sv d={ic.login} size={18} color="white" sw={2} /> Sign In to Dashboard</>
                )}
              </button>
            </form>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">← Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
