import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ── SVG Icon Components ──────────────────────────────────────────────────────
const Icon = ({ d, size = 24, stroke = 'currentColor', fill = 'none', strokeWidth = 1.6, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icons = {
  dashboard: ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', 'M9 22V12h6v10'],
  leads: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  calls: ['M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.72 19.79 19.79 0 01.11 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z'],
  followup: ['M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 01-3.46 0'],
  bookings: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  customers: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2', 'M12 11a4 4 0 100-8 4 4 0 000 8z'],
  marketing: ['M22 12h-4l-3 9L9 3l-3 9H2'],
  agents: ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', 'M23 21v-2a4 4 0 00-3-3.87', 'M16 3.13a4 4 0 010 7.75', 'M9 11a4 4 0 100-8 4 4 0 000 8z'],
  quality: ['M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z', 'M19 10v2a7 7 0 01-14 0v-2', 'M12 19v4', 'M8 23h8'],
  reports: ['M18 20V10', 'M12 20V4', 'M6 20v-6'],
  automation: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
  settings: ['M12 15a3 3 0 100-6 3 3 0 000 6z', 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z'],
  plane: 'M21 16V14L13 9V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21 15 22V20.5L13 19V13.5L21 16Z',
  globe: ['M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z', 'M12 13a3 3 0 100-6 3 3 0 000 6z'],
  map: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z', 'M12 7a3 3 0 100 6 3 3 0 000-6z'],
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  check: 'M20 6L9 17l-5-5',
  arrow: 'M5 12h14M12 5l7 7-7 7',
  trending: ['M23 6l-9.5 9.5-5-5L1 18'],
  menu: ['M3 12h18', 'M3 6h18', 'M3 18h18'],
  x: ['M18 6L6 18', 'M6 6l12 12'],
};

const ModuleIcon = ({ name, size = 20, className = '', style = {} }) => {
  const d = icons[name];
  return d ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  ) : null;
};

// ── Data ──────────────────────────────────────────────────────────────────────
const modules = [
  { key: 'dashboard', title: 'Dashboard', desc: 'Live performance overview — calls, leads, bookings and revenue at a glance.', accent: '#0ea5e9', bg: 'from-sky-500/10 to-sky-600/5' },
  { key: 'leads', title: 'Leads', desc: 'Capture leads from calls, website and campaigns. Track, assign and nurture them to conversion.', accent: '#8b5cf6', bg: 'from-violet-500/10 to-violet-600/5' },
  { key: 'calls', title: 'Calls', desc: 'All inbound, outbound, missed and abandoned calls in one place with RingCentral integration.', accent: '#10b981', bg: 'from-emerald-500/10 to-emerald-600/5' },
  { key: 'followup', title: 'Follow-ups', desc: 'Schedule callbacks, set reminders, and ensure every lead gets timely attention.', accent: '#f59e0b', bg: 'from-amber-500/10 to-amber-600/5' },
  { key: 'bookings', title: 'Bookings', desc: 'Manage flights, hotels, cars and insurance bookings with revenue tracking and confirmations.', accent: '#14b8a6', bg: 'from-teal-500/10 to-teal-600/5' },
  { key: 'customers', title: 'Customers', desc: 'Full customer profiles with booking history, interaction timeline and repeat booking insights.', accent: '#ec4899', bg: 'from-pink-500/10 to-pink-600/5' },
  { key: 'marketing', title: 'Marketing', desc: 'Track Google Ads, Facebook, affiliates and organic sources. Measure campaign ROI.', accent: '#6366f1', bg: 'from-indigo-500/10 to-indigo-600/5' },
  { key: 'agents', title: 'Agents', desc: 'Agent-wise performance dashboards — calls handled, bookings closed, conversion rates.', accent: '#f97316', bg: 'from-orange-500/10 to-orange-600/5' },
  { key: 'quality', title: 'Quality Monitoring', desc: 'Listen to call recordings, score agent performance and deliver structured coaching.', accent: '#06b6d4', bg: 'from-cyan-500/10 to-cyan-600/5' },
  { key: 'reports', title: 'Reports', desc: 'Detailed sales, marketing and call analytics reports for smarter decisions.', accent: '#0d9488', bg: 'from-teal-600/10 to-teal-700/5' },
  { key: 'automation', title: 'Automation', desc: 'Automate follow-ups, emails and notifications. Cut manual work, speed up every workflow.', accent: '#7c3aed', bg: 'from-purple-600/10 to-purple-700/5' },
  { key: 'settings', title: 'Settings', desc: 'Users, roles, permissions, lead assignment rules, call tracking and system integrations.', accent: '#475569', bg: 'from-slate-500/10 to-slate-600/5' },
];

const destinations = [
  { city: 'Dubai', country: 'UAE', gradient: 'from-amber-400 via-orange-500 to-rose-500', tag: 'Most Booked', trips: '2,840' },
  { city: 'Maldives', country: 'Maldives', gradient: 'from-cyan-400 via-teal-500 to-blue-600', tag: 'Trending', trips: '1,920' },
  { city: 'Paris', country: 'France', gradient: 'from-rose-400 via-pink-500 to-purple-600', tag: 'Popular', trips: '1,680' },
  { city: 'Tokyo', country: 'Japan', gradient: 'from-red-400 via-rose-500 to-pink-600', tag: 'New Route', trips: '1,240' },
];

const stats = [
  { value: '500+', label: 'Travel Agencies', sub: 'Trust Risezonic CRM daily' },
  { value: '98%', label: 'Lead Response', sub: 'Average response rate' },
  { value: '$2.4M', label: 'Revenue Tracked', sub: 'Monthly across agencies' },
  { value: '40%', label: 'Less Admin Work', sub: 'Saved by automation' },
];

const steps = [
  { icon: 'leads', step: '01', title: 'Capture Every Lead', desc: 'Leads from calls, web forms, Google Ads and Facebook flow automatically into your pipeline.', color: 'text-sky-600', ring: 'ring-sky-200 bg-sky-50' },
  { icon: 'calls', step: '02', title: 'Manage All Calls', desc: 'Click-to-call via RingCentral, auto call logging, missed call alerts and follow-up scheduling.', color: 'text-emerald-600', ring: 'ring-emerald-200 bg-emerald-50' },
  { icon: 'bookings', step: '03', title: 'Confirm Bookings', desc: 'Track every stage from interest to confirmed booking — flights, hotels, cars, insurance.', color: 'text-teal-600', ring: 'ring-teal-200 bg-teal-50' },
  { icon: 'reports', step: '04', title: 'Analyse & Grow', desc: 'Real-time reports, agent leaderboards and ROI dashboards to keep improving every week.', color: 'text-violet-600', ring: 'ring-violet-200 bg-violet-50' },
];

// ── Sub-components ────────────────────────────────────────────────────────────
const CountUp = ({ target, duration = 2200 }) => {
  const [val, setVal] = useState('0');
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    if (target === '24/7') { setVal('24/7'); return; }
    const raw = parseFloat(target.replace(/[^0-9.]/g, ''));
    const suffix = target.replace(/[0-9.]/g, '');
    const step = raw / (duration / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= raw) { setVal(raw % 1 ? raw.toFixed(1) + suffix : raw + suffix); clearInterval(t); }
      else setVal((cur % 1 ? cur.toFixed(1) : Math.floor(cur)) + suffix);
    }, 16);
    return () => clearInterval(t);
  }, [started, target, duration]);

  return <span ref={ref}>{val || target}</span>;
};

const Card3D = ({ children, className = '' }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 16;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -16;
    setStyle({ transform: `perspective(700px) rotateX(${y}deg) rotateY(${x}deg) translateZ(8px)`, transition: 'transform 0.08s ease' });
  };
  const onLeave = () => setStyle({ transform: 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0px)', transition: 'transform 0.5s ease' });

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={className} style={style}>
      {children}
    </div>
  );
};

const useVisible = (id) => {
  const [vis, setVis] = useState({});
  useEffect(() => {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) setVis(p => ({ ...p, [e.target.dataset.reveal]: true }));
    }), { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return vis;
};

// ── Animated flight path SVG ──────────────────────────────────────────────────
const FlightPath = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
        <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
    {/* Curved dashed flight routes */}
    <path d="M-50,400 Q360,80 720,300 Q1080,500 1490,150" fill="none" stroke="url(#pathGrad)" strokeWidth="1.5" strokeDasharray="8,12" className="animate-shimmer" />
    <path d="M-50,250 Q400,500 800,200 Q1100,0 1490,320" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="5,10" />
    <path d="M-50,550 Q300,200 700,450 Q1000,650 1490,400" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="6,14" />
  </svg>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const vis = useVisible();

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navScrolled = scrollY > 60;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${navScrolled ? 'bg-white/96 backdrop-blur-xl shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-teal-600 flex items-center justify-center shadow-md">
              <Icon d={icons.plane} size={16} stroke="white" strokeWidth={1.5} />
            </div>
            <span className={`font-black text-xl tracking-tight transition-colors duration-300 ${navScrolled ? 'text-gray-900' : 'text-white'}`}>
              Risezonic
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {[['#features', 'Features'], ['#workflow', 'How it Works'], ['#modules', 'Modules']].map(([href, label]) => (
              <a key={label} href={href} className={`text-sm font-medium transition-colors duration-300 hover:text-teal-400 ${navScrolled ? 'text-gray-600' : 'text-white/80'}`}>{label}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className={`hidden md:block text-sm font-semibold transition-colors duration-300 ${navScrolled ? 'text-gray-700 hover:text-sky-600' : 'text-white/90 hover:text-white'}`}>Sign in</Link>
            <Link to="/login" className="text-sm font-bold px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-200">
              Get Started
            </Link>
            <button onClick={() => setMobileMenu(m => !m)} className={`md:hidden p-2 rounded-lg ${navScrolled ? 'text-gray-700' : 'text-white'}`}>
              <Icon d={mobileMenu ? icons.x : icons.menu} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
            {[['#features', 'Features'], ['#workflow', 'How it Works'], ['#modules', 'Modules']].map(([href, label]) => (
              <a key={label} href={href} onClick={() => setMobileMenu(false)} className="block text-gray-700 font-medium py-2">{label}</a>
            ))}
            <Link to="/login" className="block btn-primary text-center mt-2">Sign in</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0c2340 0%, #0a3a6b 25%, #0e5c8a 55%, #0d7a7a 80%, #0e9977 100%)' }}>

        {/* Layered depth bg */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(45,212,191,0.25) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 20% 70%, rgba(14,134,233,0.4) 0%, transparent 60%)' }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
        </div>

        {/* Animated flight paths */}
        <FlightPath />

        {/* Floating destination cards */}
        <div className="absolute top-28 right-8 xl:right-16 hidden lg:block animate-float z-10">
          <div className="w-52 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20" style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-24 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 relative p-3 flex items-end">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0 L40 20 L20 40 L0 20Z\' fill=\'rgba(255,255,255,0.15)\'/%3E%3C/svg%3E")' }} />
              <span className="relative z-10 text-white font-black text-xl tracking-tight">Dubai</span>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs">2,840 bookings</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/30">Most Booked</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-36 right-12 xl:right-24 hidden xl:block animate-float-delayed z-10">
          <div className="w-44 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20" style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-20 bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 relative p-3 flex items-end">
              <span className="relative z-10 text-white font-black text-lg">Maldives</span>
            </div>
            <div className="p-3">
              <div className="text-white/60 text-xs">1,920 bookings</div>
            </div>
          </div>
        </div>

        <div className="absolute top-44 left-8 xl:left-16 hidden xl:block animate-float-slow z-10">
          {/* Live metrics card */}
          <div className="w-48 rounded-2xl p-4 shadow-2xl ring-1 ring-white/20" style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/70 text-xs font-medium">Live — Right Now</span>
            </div>
            <div className="space-y-2">
              {[['Active Calls', '24'], ['Open Leads', '142'], ['Bookings Today', '38']].map(([l, v]) => (
                <div key={l} className="flex justify-between">
                  <span className="text-white/50 text-xs">{l}</span>
                  <span className="text-white font-bold text-xs">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-0.5 items-end h-8">
              {[40, 65, 48, 80, 58, 90, 72, 85, 68, 92].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: `rgba(45,212,191,${0.3 + h / 200})` }} />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-32 left-8 hidden lg:block z-10 animate-bounce-gentle">
          <div className="rounded-xl px-4 py-3 ring-1 ring-white/20 shadow-xl" style={{ backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/30 ring-1 ring-teal-400/40 flex items-center justify-center">
                <Icon d={icons.trending} size={14} stroke="#2dd4bf" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">+18% Revenue</div>
                <div className="text-white/50 text-xs">vs last month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="max-w-3xl">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 mb-8 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white/90 font-medium"
              style={{ animation: 'fadeIn 0.8s ease forwards' }}>
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Trusted by 500+ travel agencies worldwide
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
              style={{ animation: 'slideUp 0.7s ease forwards', textShadow: '0 2px 24px rgba(0,0,0,0.3)' }}>
              The CRM Built for<br />
              <span style={{ background: 'linear-gradient(90deg, #2dd4bf, #38bdf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Travel Agencies
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/70 max-w-xl leading-relaxed mb-10"
              style={{ animation: 'slideUp 0.7s ease 0.15s both' }}>
              Manage leads, calls, bookings and agents in one unified platform — built specifically to help travel businesses close more deals and delight every customer.
            </p>

            <div className="flex flex-wrap gap-4" style={{ animation: 'slideUp 0.7s ease 0.3s both' }}>
              <Link to="/login" className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-base bg-white text-gray-900 shadow-2xl hover:shadow-teal-500/20 hover:scale-105 transition-all duration-300">
                Start Free Demo
                <Icon d={icons.arrow} size={18} stroke="#0d7a7a" className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <a href="#workflow" className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-base border border-white/25 text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                See How It Works
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex flex-wrap items-center gap-6 text-white/50 text-sm"
              style={{ animation: 'fadeIn 0.8s ease 0.5s both' }}>
              <div className="flex -space-x-2">
                {['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full ring-2 ring-[#0a3a6b] flex items-center justify-center text-xs font-bold text-white" style={{ background: c }}>
                    {['RK', 'SJ', 'JD', 'FA', 'MT'][i][0]}
                  </div>
                ))}
              </div>
              <span>Joined by 500+ agencies this year</span>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => <Icon key={s} d={icons.star} size={14} fill="#fbbf24" stroke="none" />)}
                <span className="ml-1">4.9 / 5 rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 fill-white">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-gray-100">
            {stats.map((s, i) => (
              <div key={i}
                data-reveal={`stat-${i}`}
                className={`text-center px-6 transition-all duration-700 ${vis[`stat-${i}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="text-4xl lg:text-5xl font-black text-gray-900 mb-1">
                  <CountUp target={s.value} />
                </div>
                <div className="font-semibold text-gray-700 text-sm mb-0.5">{s.label}</div>
                <div className="text-gray-400 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP DESTINATIONS ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div data-reveal="dest-header" className={`mb-12 transition-all duration-700 ${vis['dest-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded bg-teal-500" />
              <span className="text-teal-600 font-semibold text-sm uppercase tracking-widest">Live data</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900">Top Destinations Being Managed</h2>
            <p className="text-gray-500 mt-3 max-w-xl">Real-time view of the destinations your clients are booking most through Risezonic CRM agencies.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {destinations.map((d, i) => (
              <div key={i}
                data-reveal={`dest-${i}`}
                className={`transition-all duration-700 ${vis[`dest-${i}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${i * 0.1}s` }}>
                <Card3D className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer group">
                  {/* Destination image area */}
                  <div className={`h-48 bg-gradient-to-br ${d.gradient} relative overflow-hidden`}>
                    {/* Geometric pattern overlay */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px)`
                    }} />
                    {/* Abstract location marker */}
                    <div className="absolute bottom-4 left-4">
                      <div className="w-8 h-8 rounded-full bg-white/20 ring-2 ring-white/40 flex items-center justify-center mb-2">
                        <Icon d={icons.map} size={14} stroke="white" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-black/20 text-white backdrop-blur-sm ring-1 ring-white/20">{d.tag}</span>
                    </div>
                    {/* City name overlay */}
                    <div className="absolute bottom-4 right-4">
                      <div className="font-black text-white text-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 select-none">{d.city[0]}</div>
                    </div>
                  </div>
                  <div className="bg-white p-4">
                    <div className="font-bold text-gray-900">{d.city}</div>
                    <div className="text-gray-400 text-sm">{d.country}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">{d.trips} bookings</span>
                      <Icon d={icons.trending} size={16} stroke="#10b981" strokeWidth={2} />
                    </div>
                  </div>
                </Card3D>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES / 12 MODULES ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div data-reveal="feat-header" className={`text-center mb-16 transition-all duration-700 ${vis['feat-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-1 h-5 rounded bg-sky-500" />
              <span className="text-sky-600 font-semibold text-sm uppercase tracking-widest">Everything You Need</span>
              <div className="w-1 h-5 rounded bg-sky-500" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">12 Modules. One Platform.</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Every workflow your travel agency runs — from first call to repeat customer — connected in one place.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {modules.map((mod, i) => (
              <div key={i}
                data-reveal={`mod-${i}`}
                className={`transition-all duration-600 ${vis[`mod-${i}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${(i % 4) * 0.07}s` }}>
                <Card3D className="group relative rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-xl hover:border-transparent cursor-default transition-shadow duration-300 overflow-hidden">
                  {/* Subtle gradient bg on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${mod.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />
                  <div className="relative z-10">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 ring-1 transition-all duration-300 group-hover:scale-110"
                      style={{ background: `${mod.accent}18`, borderColor: `${mod.accent}30` }}>
                      <ModuleIcon name={mod.key} size={20} className="transition-colors duration-300" style={{ color: mod.accent }} />
                    </div>
                    <h3 className="font-bold text-gray-800 text-[15px] mb-2 group-hover:text-gray-900">{mod.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-600">{mod.desc}</p>
                  </div>
                </Card3D>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="workflow" className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(14,165,233,0.06) 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div data-reveal="wf-header" className={`mb-16 transition-all duration-700 ${vis['wf-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded bg-violet-500" />
              <span className="text-violet-600 font-semibold text-sm uppercase tracking-widest">Workflow</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-3">From First Call to Loyal Customer</h2>
            <p className="text-gray-500 max-w-lg">Four steps that summarise how Risezonic CRM transforms your sales process.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Steps */}
            <div className="space-y-5">
              {steps.map((s, i) => (
                <div key={i}
                  data-reveal={`step-${i}`}
                  className={`group flex gap-5 p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-500 cursor-default ${vis[`step-${i}`] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                  style={{ transitionDelay: `${i * 0.12}s` }}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ring-1 ${s.ring} group-hover:scale-110 transition-transform duration-300`}>
                    <ModuleIcon name={s.icon} size={20} className={s.color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-black text-gray-300 tracking-widest">STEP {s.step}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-base mb-1">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 3D Dashboard preview */}
            <div data-reveal="db-preview" className={`transition-all duration-700 ${vis['db-preview'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div style={{ perspective: '1200px' }}>
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80"
                  style={{ transform: 'rotateY(-6deg) rotateX(3deg)', transformStyle: 'preserve-3d' }}>
                  {/* Fake browser chrome */}
                  <div className="h-9 bg-gray-100 border-b border-gray-200 flex items-center gap-2 px-4">
                    <div className="flex gap-1.5">
                      {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
                    </div>
                    <div className="flex-1 mx-4 h-5 bg-white rounded border border-gray-200 flex items-center px-3">
                      <span className="text-gray-400 text-xs">risezonic.app/dashboard</span>
                    </div>
                  </div>
                  {/* Dashboard mockup */}
                  <div className="bg-gray-50 p-4">
                    {/* Sidebar + content layout */}
                    <div className="flex gap-3 h-64">
                      {/* Mini sidebar */}
                      <div className="w-10 bg-white rounded-xl border border-gray-100 flex flex-col items-center py-3 gap-3 flex-shrink-0">
                        <div className="w-6 h-6 rounded-lg bg-sky-600 flex items-center justify-center">
                          <Icon d={icons.plane} size={10} stroke="white" strokeWidth={2} />
                        </div>
                        {[icons.dashboard, icons.leads, icons.calls, icons.bookings, icons.reports].map((ic, i) => (
                          <div key={i} className={`w-6 h-6 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-sky-50' : ''}`}>
                            <Icon d={ic} size={12} stroke={i === 0 ? '#0ea5e9' : '#9ca3af'} strokeWidth={1.8} />
                          </div>
                        ))}
                      </div>
                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        {/* Stat cards row */}
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { l: 'Leads', v: '1,284', color: 'bg-sky-50 border-sky-100', tc: 'text-sky-700' },
                            { l: 'Calls', v: '24', color: 'bg-emerald-50 border-emerald-100', tc: 'text-emerald-700' },
                            { l: 'Bookings', v: '38', color: 'bg-violet-50 border-violet-100', tc: 'text-violet-700' },
                            { l: 'Revenue', v: '$84K', color: 'bg-amber-50 border-amber-100', tc: 'text-amber-700' },
                          ].map((st, i) => (
                            <div key={i} className={`${st.color} border rounded-lg p-2`}>
                              <div className={`font-black text-sm ${st.tc}`}>{st.v}</div>
                              <div className="text-gray-400 text-[9px] mt-0.5">{st.l}</div>
                            </div>
                          ))}
                        </div>
                        {/* Chart */}
                        <div className="bg-white rounded-xl border border-gray-100 p-3 h-24">
                          <div className="text-xs font-semibold text-gray-600 mb-2">Conversion Trend</div>
                          <div className="flex items-end gap-1 h-12">
                            {[38, 55, 42, 70, 58, 82, 65, 90, 72, 85, 68, 95, 78, 88].map((h, i) => (
                              <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: `linear-gradient(to top, #0353a1, #38bdf8)`, opacity: 0.75 + i * 0.01 }} />
                            ))}
                          </div>
                        </div>
                        {/* Lead list */}
                        <div className="bg-white rounded-xl border border-gray-100 p-3">
                          <div className="text-xs font-semibold text-gray-600 mb-2">Recent Leads</div>
                          <div className="space-y-1.5">
                            {['Raj Kumar — Dubai Package', 'Priya Singh — Maldives', 'John Davis — Europe Tour'].map((l, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-sky-100 flex-shrink-0" />
                                <span className="text-gray-500 text-[10px] flex-1 truncate">{l}</span>
                                <span className="text-teal-600 text-[10px] font-bold">New</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODULES GRID ── */}
      <section id="modules" className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0c2340 0%, #0a3a6b 40%, #0d7a7a 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <FlightPath />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <div data-reveal="mod-grid-header" className={`text-center mb-14 transition-all duration-700 ${vis['mod-grid-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="text-teal-400 font-semibold text-sm uppercase tracking-widest">Complete Coverage</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-3">Every Tool Your Agency Needs</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {modules.map((mod, i) => (
              <div key={i}
                data-reveal={`modg-${i}`}
                className={`group rounded-2xl p-4 text-center cursor-pointer transition-all duration-500 border ${vis[`modg-${i}`] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                style={{
                  transitionDelay: `${(i % 6) * 0.06}s`,
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = `${mod.accent}50`; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `${mod.accent}22`, boxShadow: `0 0 0 1px ${mod.accent}30` }}>
                  <ModuleIcon name={mod.key} size={18} className="group-hover:scale-110" style={{ color: mod.accent }} />
                </div>
                <div className="text-white/90 font-semibold text-xs leading-tight">{mod.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div data-reveal="cta" className={`transition-all duration-700 ${vis['cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-8 shadow-xl animate-float"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)' }}>
              <Icon d={icons.plane} size={28} stroke="white" strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-5 leading-tight">
              Ready to Transform Your<br />Travel Business?
            </h2>
            <p className="text-gray-500 text-xl max-w-xl mx-auto mb-10">
              Sign in with the demo account and explore all 12 modules — no setup required.
            </p>
            <Link to="/login"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-xl font-bold text-lg text-white shadow-2xl hover:shadow-sky-500/20 hover:scale-105 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #0353a1, #0ea5e9)' }}>
              Launch the Demo
              <Icon d={icons.arrow} size={20} stroke="white" className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <div className="mt-6 text-gray-400 text-sm">
              Login: <span className="font-semibold text-gray-700">admin@risezonic.com</span> &nbsp;/&nbsp; <span className="font-semibold text-gray-700">demo123</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 text-gray-500 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)' }}>
                <Icon d={icons.plane} size={16} stroke="white" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-white font-black text-lg">Risezonic</div>
                <div className="text-gray-600 text-xs">Smart Travel Business Management</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {modules.slice(0, 6).map(m => (
                <span key={m.title} className="hover:text-white cursor-pointer transition-colors duration-200">{m.title}</span>
              ))}
            </div>
            <div className="text-gray-600 text-sm">© 2026 Risezonic CRM. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
