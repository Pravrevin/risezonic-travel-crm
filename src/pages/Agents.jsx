import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useAgents } from '../hooks/useAgents';
import { createUser, updateUser, deleteUser, ROLES } from '../lib/auth';
import { isSheetConfigured } from '../lib/scriptUrl';

const Sv = ({ d, size = 16, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ic = {
  users: ['M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2', 'M9 11a4 4 0 100-8 4 4 0 000 8z', 'M19 8v6', 'M22 11h-6'],
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  key: ['M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4'],
  warn: ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z', 'M12 9v4', 'M12 17h.01'],
};

const roleColors = { Admin: 'bg-purple-100 text-purple-700', Agent: 'bg-sky-100 text-sky-700' };
const statusColors = { Active: 'bg-green-100 text-green-700', Disabled: 'bg-gray-100 text-gray-500' };

const emptyForm = () => ({ name: '', email: '', password: '', role: 'Agent' });

export default function Agents() {
  const { user: me, refreshUser } = useAuth();
  const { users, loading, reload } = useAgents();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [resetFor, setResetFor] = useState(null); // user whose password is being reset
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null); // { ok: bool, text }

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const flash = (ok, text) => { setNotice({ ok, text }); setTimeout(() => setNotice(null), 4000); };

  const submitCreate = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const result = await createUser(form);
    setBusy(false);
    if (!result.success) return flash(false, result.message);
    flash(true, `Login created for ${form.name}. Share the email + password with them.`);
    setForm(emptyForm());
    setShowAdd(false);
    reload();
  };

  const toggleStatus = async (u) => {
    if (busy) return;
    const status = u.status === 'Active' ? 'Disabled' : 'Active';
    if (status === 'Disabled' && !window.confirm(`Disable ${u.name}'s login? They will be signed out and unable to sign in.`)) return;
    setBusy(true);
    const result = await updateUser(u.id, { status });
    setBusy(false);
    flash(result.success, result.message);
    if (result.success) reload();
  };

  const changeRole = async (u, role) => {
    if (busy || role === u.role) return;
    setBusy(true);
    const result = await updateUser(u.id, { role });
    setBusy(false);
    flash(result.success, result.message);
    if (result.success) reload();
  };

  const submitReset = async (e) => {
    e.preventDefault();
    if (busy || !resetFor) return;
    setBusy(true);
    const result = await updateUser(resetFor.id, { password: newPassword });
    setBusy(false);
    if (!result.success) return flash(false, result.message);
    flash(true, `Password updated for ${resetFor.name}.`);
    if (resetFor.id === me?.id) refreshUser(result.user);
    setResetFor(null);
    setNewPassword('');
  };

  const remove = async (u) => {
    if (busy) return;
    if (!window.confirm(`Delete ${u.name}'s login permanently? Their entries in the sheet are kept.`)) return;
    setBusy(true);
    const result = await deleteUser(u.id);
    setBusy(false);
    flash(result.success, result.message);
    if (result.success) reload();
  };

  const inp = 'input-field text-sm py-2';
  const admins = users.filter(u => u.role === 'Admin').length;
  const agents = users.filter(u => u.role === 'Agent').length;
  const active = users.filter(u => u.status === 'Active').length;

  return (
    <DashboardLayout title="Agents" subtitle="Create and manage logins for your team">
      {!isSheetConfigured() && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
          <Sv d={ic.warn} size={16} color="#a16207" sw={2} />
          Logins are stored in the Google Sheet. Set GOOGLE_SCRIPT_URL in src/lib/scriptUrl.js to enable this page.
        </div>
      )}

      {notice && (
        <div className={`px-4 py-3 rounded-xl mb-6 text-sm border ${notice.ok ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {notice.text}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Logins', value: users.length, bg: 'bg-gray-50', color: 'text-gray-800' },
          { label: 'Agents', value: agents, bg: 'bg-sky-50', color: 'text-sky-700' },
          { label: 'Admins', value: admins, bg: 'bg-purple-50', color: 'text-purple-700' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl p-4 text-center`}>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-sm font-semibold text-gray-600">Team Logins</span>
          <span className="text-xs text-gray-400 ml-2">{active} active</span>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary py-2 text-sm flex items-center gap-2">
          <Sv d={ic.users} size={14} color="white" /> Create Login
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header text-left">Name</th>
                <th className="table-header text-left">Email</th>
                <th className="table-header text-left">Role</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isMe = u.id === me?.id;
                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #0353a1, #14b8a6)' }}>{u.avatar}</div>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm">{u.name} {isMe && <span className="text-xs text-gray-400 font-normal">(you)</span>}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-gray-600 text-sm">{u.email}</td>
                    <td className="table-cell">
                      <select value={u.role} disabled={isMe || busy} onChange={e => changeRole(u, e.target.value)}
                        className={`badge border-0 cursor-pointer ${roleColors[u.role]} disabled:cursor-default`}>
                        {ROLES.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="table-cell"><span className={`badge ${statusColors[u.status] || statusColors.Disabled}`}>{u.status}</span></td>
                    <td className="table-cell">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => { setResetFor(u); setNewPassword(''); }} disabled={busy}
                          className="text-primary-600 hover:text-primary-700 text-xs font-semibold border border-primary-200 px-2.5 py-1 rounded-lg hover:bg-primary-50 transition-colors">
                          {isMe ? 'Change Password' : 'Reset Password'}
                        </button>
                        {!isMe && (
                          <>
                            <button onClick={() => toggleStatus(u)} disabled={busy}
                              className={`text-xs font-semibold border px-2.5 py-1 rounded-lg transition-colors ${u.status === 'Active' ? 'text-yellow-700 border-yellow-200 hover:bg-yellow-50' : 'text-green-700 border-green-200 hover:bg-green-50'}`}>
                              {u.status === 'Active' ? 'Disable' : 'Enable'}
                            </button>
                            <button onClick={() => remove(u)} disabled={busy}
                              className="text-red-600 text-xs font-semibold border border-red-200 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors">
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr><td colSpan={5} className="table-cell text-center text-gray-400 py-10">{loading ? 'Loading logins…' : 'No logins yet'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400 flex items-start gap-2">
        <Sv d={ic.shield} size={14} color="#9ca3af" />
        <span>Agents can file leads, calls and bookings under their own name but cannot see any records. Admins see everything and manage logins here.</span>
      </div>

      {/* Create login modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
          <form onSubmit={submitCreate} className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
            <div className="travel-gradient rounded-t-2xl px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg">Create Login</h3>
                <p className="text-blue-100 text-xs">The agent signs in with this email and password</p>
              </div>
              <button type="button" onClick={() => setShowAdd(false)} className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-xl font-light">×</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input className={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Sarah Johnson" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Email <span className="text-red-500">*</span></label>
                <input type="email" className={inp} value={form.email} onChange={e => set('email', e.target.value)} placeholder="sarah@risezonic.com" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Password <span className="text-red-500">*</span></label>
                <input type="text" className={inp} value={form.password} onChange={e => set('password', e.target.value)} placeholder="At least 6 characters" minLength={6} required autoComplete="off" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Role</label>
                <select className={inp} value={form.role} onChange={e => set('role', e.target.value)}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {form.role === 'Agent' ? 'Can add entries only — no access to records.' : 'Full access, including this page.'}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50 rounded-b-2xl">
              <button type="button" onClick={() => setShowAdd(false)} className="btn-outline flex-1 py-2.5 text-sm">Cancel</button>
              <button type="submit" disabled={busy} className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50">{busy ? 'Creating…' : 'Create Login'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Reset password modal */}
      {resetFor && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
          <form onSubmit={submitReset} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-2 mb-1"><Sv d={ic.key} size={16} color="#0353a1" /><h3 className="font-bold text-gray-800">
              {resetFor.id === me?.id ? 'Change your password' : `Reset password — ${resetFor.name}`}
            </h3></div>
            <p className="text-xs text-gray-400 mb-4">
              {resetFor.id === me?.id ? 'You stay signed in on this device.' : 'They will be signed out everywhere and need the new password.'}
            </p>
            <input type="text" className={inp} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (min 6 characters)" minLength={6} required autoFocus autoComplete="off" />
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => setResetFor(null)} className="btn-outline flex-1 py-2 text-sm">Cancel</button>
              <button type="submit" disabled={busy} className="btn-primary flex-1 py-2 text-sm disabled:opacity-50">{busy ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}
