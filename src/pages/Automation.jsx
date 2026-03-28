import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Sv = ({ d, size = 16, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ic = {
  bolt:    'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  play:    ['M5 3l14 9-14 9V3z'],
  refresh: ['M23 4v6h-6','M1 20v-6h6','M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15'],
  clock:   ['M12 2a10 10 0 100 20A10 10 0 0012 2z','M12 6v6l4 2'],
  mail:    ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
  phone:   'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.72 19.79 19.79 0 01.11 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  msg:     ['M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z'],
  plane:   'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  mobile:  ['M12 18h.01','M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2z'],
  bar:     ['M18 20V10','M12 20V4','M6 20v-6'],
  edit:    ['M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'],
};

const ruleIcons = {
  1: ic.mail,
  2: ic.phone,
  3: ic.msg,
  4: ic.plane,
  5: ic.mobile,
  6: ic.bar,
};

const automations = [
  { id: 1, name: 'New Lead Welcome Email', trigger: 'Lead Created', action: 'Send Email', status: true, runs: 284, lastRun: '2m ago' },
  { id: 2, name: 'Missed Call Auto Callback', trigger: 'Call Missed', action: 'Schedule Callback', status: true, runs: 48, lastRun: '15m ago' },
  { id: 3, name: 'Follow-up Reminder SMS', trigger: '24h Before Due', action: 'Send SMS', status: true, runs: 167, lastRun: '1h ago' },
  { id: 4, name: 'Booking Confirmation Email', trigger: 'Booking Confirmed', action: 'Send Email + PDF', status: true, runs: 92, lastRun: '32m ago' },
  { id: 5, name: 'Lead Re-engagement', trigger: 'Inactive 7 Days', action: 'Send WhatsApp', status: false, runs: 34, lastRun: '2d ago' },
  { id: 6, name: 'Agent Daily Summary', trigger: 'Every Day 6PM', action: 'Send Email', status: true, runs: 180, lastRun: 'Yesterday' },
];

export default function Automation() {
  const [rules, setRules] = useState(automations);
  const toggle = (id) => setRules(r => r.map(rule => rule.id === id ? { ...rule, status: !rule.status } : rule));

  return (
    <DashboardLayout title="Automation" subtitle="Automate emails, follow-ups, and notifications to reduce manual work">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Automations', val: rules.length, icon: ic.bolt, c: '#7c3aed', bg: 'bg-violet-50 text-violet-700' },
          { label: 'Active', val: rules.filter(r => r.status).length, icon: ic.play, c: '#16a34a', bg: 'bg-green-50 text-green-700' },
          { label: 'Total Runs Today', val: '284', icon: ic.refresh, c: '#2563eb', bg: 'bg-blue-50 text-blue-700' },
          { label: 'Time Saved', val: '14h', icon: ic.clock, c: '#d97706', bg: 'bg-amber-50 text-amber-700' },
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

      <div className="flex justify-end mb-4">
        <button className="btn-primary text-sm flex items-center gap-2">
          <span>+</span> Create Automation
        </button>
      </div>

      <div className="grid gap-4">
        {rules.map(rule => (
          <div key={rule.id} className={`card p-5 transition-all duration-200 ${rule.status ? 'border-l-4 border-green-400' : 'border-l-4 border-gray-200 opacity-70'}`}>
            <div className="flex flex-wrap items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${rule.status ? 'bg-violet-100' : 'bg-gray-100'}`}>
                <Sv d={ruleIcons[rule.id]} size={20} color={rule.status ? '#7c3aed' : '#9ca3af'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-gray-800">{rule.name}</h3>
                  {!rule.status && <span className="badge bg-gray-100 text-gray-500">Paused</span>}
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">TRIGGER</span> {rule.trigger}
                  </span>
                  <span>→</span>
                  <span className="flex items-center gap-1">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">ACTION</span> {rule.action}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="font-bold text-gray-800">{rule.runs}</div>
                  <div className="text-xs text-gray-400">Total Runs</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-600 text-sm">{rule.lastRun}</div>
                  <div className="text-xs text-gray-400">Last Run</div>
                </div>
                <button onClick={() => toggle(rule.id)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${rule.status ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${rule.status ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <Sv d={ic.edit} size={18} color="currentColor" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
