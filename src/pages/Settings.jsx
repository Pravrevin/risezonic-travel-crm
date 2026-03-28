import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Sv = ({ d, size = 20, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const tabs = ['General', 'Users & Roles', 'Integrations', 'Lead Assignment', 'Notifications'];

const users = [
  { name: 'Sarah Johnson', email: 'sarah@travelcrm.com', role: 'Senior Agent', status: 'Active', avatar: 'SJ' },
  { name: 'Mike Roberts', email: 'mike@travelcrm.com', role: 'Agent', status: 'Active', avatar: 'MR' },
  { name: 'Tom Keller', email: 'tom@travelcrm.com', role: 'Agent', status: 'Active', avatar: 'TK' },
  { name: 'Admin User', email: 'admin@travelcrm.com', role: 'Admin', status: 'Active', avatar: 'AU' },
];

const integrations = [
  { name: 'RingCentral', desc: 'Click-to-call and auto call logging', icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.72 19.79 19.79 0 01.11 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z', iconColor: '#2563eb', connected: true },
  { name: 'Google Ads', desc: 'Lead tracking from paid search campaigns', icon: 'M23 6l-9.5 9.5-5-5L1 18', iconColor: '#ea4335', connected: true },
  { name: 'Facebook Lead Ads', desc: 'Automatically capture Facebook leads', icon: ['M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z'], iconColor: '#1877f2', connected: true },
  { name: 'WhatsApp Business', desc: 'Send messages and booking confirmations', icon: ['M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z'], iconColor: '#25d366', connected: false },
  { name: 'Mailchimp', desc: 'Email marketing automation sync', icon: ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'], iconColor: '#ffe01b', connected: false },
  { name: 'Twilio SMS', desc: 'Automated SMS notifications', icon: ['M12 18h.01','M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2z'], iconColor: '#f22f46', connected: true },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('General');
  const [company, setCompany] = useState({ name: 'Skyline Travel Agency', email: 'contact@skylinetravel.com', phone: '+1 800 SKY LINE', currency: 'USD', timezone: 'Asia/Dubai' });

  return (
    <DashboardLayout title="Settings" subtitle="Manage users, roles, integrations and system configurations">
      {/* Tab navigation */}
      <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'General' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-5">Company Information</h3>
            <div className="space-y-4">
              {[
                { label: 'Company Name', key: 'name' },
                { label: 'Email Address', key: 'email' },
                { label: 'Phone Number', key: 'phone' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">{f.label}</label>
                  <input className="input-field" value={company[f.key]} onChange={e => setCompany(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Currency</label>
                  <select className="input-field" value={company.currency} onChange={e => setCompany(p => ({ ...p, currency: e.target.value }))}>
                    {['USD', 'EUR', 'GBP', 'AED', 'INR'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Timezone</label>
                  <select className="input-field" value={company.timezone} onChange={e => setCompany(p => ({ ...p, timezone: e.target.value }))}>
                    {['Asia/Dubai', 'Asia/Kolkata', 'Europe/London', 'America/New_York'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn-primary text-sm py-2.5 mt-2">Save Changes</button>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-5">Lead Assignment Rules</h3>
            <div className="space-y-4">
              {[
                { label: 'Assignment Method', options: ['Round Robin', 'Load Balanced', 'Manual', 'Skill-based'] },
                { label: 'Auto-assign Leads', options: ['Immediately', 'Within 5 minutes', 'Within 30 minutes', 'Manual'] },
              ].map((f, i) => (
                <div key={i}>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">{f.label}</label>
                  <select className="input-field">
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-700 text-sm">After Hours Routing</div>
                  <div className="text-xs text-gray-400">Route leads to on-call agent</div>
                </div>
                <div className="w-10 h-5 bg-primary-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>
              <button className="btn-primary text-sm py-2.5">Save Rules</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Users & Roles' && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Team Members</h3>
            <button className="btn-primary text-sm py-2">+ Invite User</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header text-left">User</th>
                <th className="table-header text-left">Role</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-500 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                        {u.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{u.name}</div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="badge bg-primary-100 text-primary-700">{u.role}</span>
                  </td>
                  <td className="table-cell">
                    <span className="badge bg-green-100 text-green-700">{u.status}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button className="text-primary-600 text-xs font-semibold hover:text-primary-700">Edit</button>
                      <button className="text-red-500 text-xs font-semibold hover:text-red-600">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Integrations' && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {integrations.map((intg, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sv d={intg.icon} size={22} color={intg.iconColor} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-800 text-sm">{intg.name}</h3>
                    <span className={`badge text-xs ${intg.connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {intg.connected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{intg.desc}</p>
                  <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${intg.connected ? 'border border-red-200 text-red-600 hover:bg-red-50' : 'bg-primary-700 text-white hover:bg-primary-800'}`}>
                    {intg.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {['Lead Assignment', 'Notifications'].includes(activeTab) && (
        <div className="card p-12 text-center text-gray-400">
          <div className="flex justify-center mb-3">
            <Sv d={['M12 15a3 3 0 100-6 3 3 0 000 6z','M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z']} size={44} color="#d1d5db" sw={1.4} />
          </div>
          <div className="font-semibold text-lg text-gray-600">{activeTab} Settings</div>
          <div className="text-sm mt-1">Configure your {activeTab.toLowerCase()} preferences here.</div>
        </div>
      )}
    </DashboardLayout>
  );
}
