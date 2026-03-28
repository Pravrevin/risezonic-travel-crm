import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Shared SVG icon renderer
const NavIcon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const navItems = [
  {
    label: 'Dashboard', path: '/dashboard',
    icon: ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', 'M9 22V12h6v10'],
  },
  {
    label: 'Leads', path: '/leads',
    icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  },
  {
    label: 'Calls', path: '/calls',
    icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.72 19.79 19.79 0 01.11 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  },
  {
    label: 'Follow-ups', path: '/followups',
    icon: ['M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 01-3.46 0'],
  },
  {
    label: 'Bookings', path: '/bookings',
    icon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  },
  {
    label: 'Customers', path: '/customers',
    icon: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2', 'M12 11a4 4 0 100-8 4 4 0 000 8z'],
  },
  {
    label: 'Marketing', path: '/marketing',
    icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
  },
  {
    label: 'Agents', path: '/agents',
    icon: ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', 'M23 21v-2a4 4 0 00-3-3.87', 'M16 3.13a4 4 0 010 7.75', 'M9 11a4 4 0 100-8 4 4 0 000 8z'],
  },
  {
    label: 'Quality', path: '/quality',
    icon: ['M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z', 'M19 10v2a7 7 0 01-14 0v-2', 'M12 19v4', 'M8 23h8'],
  },
  {
    label: 'Reports', path: '/reports',
    icon: ['M18 20V10', 'M12 20V4', 'M6 20v-6'],
  },
  {
    label: 'Automation', path: '/automation',
    icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  },
  {
    label: 'Settings', path: '/settings',
    icon: ['M12 15a3 3 0 100-6 3 3 0 000 6z', 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z'],
  },
];

const LogoutIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

const BellIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const SearchIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
  </svg>
);

const MenuIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);

const PlaneIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V14L13 9V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21 15 22V20.5L13 19V13.5L21 16Z" />
  </svg>
);

export default function DashboardLayout({ children, title, subtitle }) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('travel_crm_sidebar') === 'true');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('travel_crm_sidebar', collapsed);
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b border-gray-100 ${collapsed ? 'justify-center px-3' : ''}`}>
        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-md"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)' }}>
          <PlaneIcon />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-black text-gray-900 text-[17px] leading-none tracking-tight">
              Travel<span className="text-teal-500">CRM</span>
            </div>
            <div className="text-[10px] text-gray-400 font-medium mt-0.5 tracking-wide uppercase">Smart Travel Business</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-hide space-y-0.5">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : ''}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive
                  ? 'text-sky-700 font-semibold'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 font-medium'
                }
                ${collapsed ? 'justify-center px-2' : ''}
              `}
              style={isActive ? { background: 'linear-gradient(135deg, #e0f2fe, #ccfbf1)', borderLeft: '3px solid #0ea5e9' } : {}}>
              <span className={`transition-transform duration-200 ${!isActive ? 'group-hover:scale-110' : ''}`}>
                <NavIcon d={item.icon} />
              </span>
              {!collapsed && <span className="text-[13px] truncate">{item.label}</span>}
              {!collapsed && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className={`border-t border-gray-100 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #0353a1, #0ea5e9)' }}
            title={user?.name}>
            {user?.avatar || user?.name?.[0] || 'U'}
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0353a1, #14b8a6)' }}>
              {user?.avatar || user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-gray-800 truncate">{user?.name || 'User'}</div>
              <div className="text-xs text-gray-400 truncate">{user?.role || 'Agent'}</div>
            </div>
            <button onClick={handleLogout} title="Logout"
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50">
              <LogoutIcon />
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50/80 flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-200/80 transition-all duration-300 flex-shrink-0 ${collapsed ? 'w-[68px]' : 'w-[230px]'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-10 w-[230px] bg-white flex flex-col shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200/80 px-5 py-3.5 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => { setCollapsed(c => !c); }}
            className="hidden lg:flex p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
            <MenuIcon />
          </button>
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
            <MenuIcon />
          </button>

          <div className="flex-1 min-w-0">
            {title && <h1 className="text-[15px] font-bold text-gray-800 truncate">{title}</h1>}
            {subtitle && <p className="text-xs text-gray-400 truncate mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 w-48">
              <SearchIcon />
              <input type="text" placeholder="Search..." className="bg-transparent text-[13px] text-gray-600 outline-none w-full placeholder-gray-400" />
            </div>

            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
              <BellIcon />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #0353a1, #14b8a6)' }}>
              {user?.avatar || 'U'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
