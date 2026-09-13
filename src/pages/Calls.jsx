import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import BookingFields from '../components/BookingFields';
import BookingDetailModal from '../components/BookingDetailModal';
import { useBookingForm, buildBookingPayload } from '../hooks/useBookingForm';
import { callStore } from '../lib/calls';
import { bookingStore, nextBookingId } from '../lib/bookings';
import { postToSheet } from '../lib/sheetClient';
import { useStoreList } from '../hooks/useStore';
import { DISPOSITIONS, DISPOSITION_COLORS } from '../constants/dispositions';
import { useAuth } from '../context/AuthContext';

const Sv = ({ d, size = 16, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icPhone = 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.72 19.79 19.79 0 01.11 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z';
const icCheck = 'M20 6L9 17l-5-5';

export default function Calls() {
  const calls = useStoreList(callStore);
  const { user } = useAuth();
  const [showEntry, setShowEntry] = useState(false);
  const [viewCall, setViewCall] = useState(null);
  const [viewBookingId, setViewBookingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [disposition, setDisposition] = useState('');
  const [caller, setCaller] = useState('');
  const [phone, setPhone] = useState('');
  const [remarks, setRemarks] = useState('');

  const bookingForm = useBookingForm();
  const isNewBooking = disposition === 'New booking';

  const resetEntry = () => {
    setDisposition(''); setCaller(''); setPhone(''); setRemarks('');
    bookingForm.reset();
  };

  const closeEntry = () => { resetEntry(); setShowEntry(false); };

  const canSave = disposition && remarks.trim() && (!isNewBooking || bookingForm.isValid);

  const saveEntry = async () => {
    if (!canSave || saving) return;
    setSaving(true);

    let bookingId = null;
    if (isNewBooking) {
      const payload = buildBookingPayload(bookingForm.form, bookingForm.fare);
      const id = nextBookingId(bookingStore.all());
      const booking = bookingStore.create({ ...payload, id, disposition, agent: user?.name || 'Agent' });
      const result = await postToSheet('bookings', booking);
      if (result === 'sent') bookingStore.markSynced(booking.id);
      else bookingStore.markUnsynced(booking.id);
      bookingId = booking.id;
    }

    const bookingName = `${bookingForm.form.firstName} ${bookingForm.form.lastName}`.trim();
    const call = callStore.create({
      caller: caller.trim() || bookingName || 'Unknown',
      phone: phone || bookingForm.form.callingPhone || '—',
      disposition,
      bookingId,
      agent: user?.name || 'Agent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      remarks,
    });
    const callResult = await postToSheet('calls', call);
    if (callResult === 'sent') callStore.markSynced(call.id);
    else callStore.markUnsynced(call.id);

    setSaving(false);
    closeEntry();
  };

  const stats = [
    { label: 'Total Entries', value: calls.length, icon: icPhone, c: '#2563eb', color: 'bg-blue-50 text-blue-700' },
    { label: 'New Bookings', value: calls.filter(c => c.disposition === 'New booking').length, icon: icCheck, c: '#16a34a', color: 'bg-green-50 text-green-700' },
    { label: 'Flight Changes', value: calls.filter(c => c.disposition === 'Flight changes').length, icon: icPhone, c: '#0ea5e9', color: 'bg-sky-50 text-sky-700' },
    { label: 'Cancelations', value: calls.filter(c => c.disposition === 'Cancelation').length, icon: icPhone, c: '#dc2626', color: 'bg-red-50 text-red-700' },
  ];

  const inp = 'input-field text-sm py-2';

  return (
    <DashboardLayout title="Calls" subtitle="Log every call with a disposition and remarks">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className={`${s.color} rounded-2xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">
              <Sv d={s.icon} size={17} color={s.c} />
            </div>
            <div>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs font-medium opacity-70">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Call Log</span>
        <button onClick={() => setShowEntry(true)} className="btn-primary py-2 text-sm flex items-center gap-2">
          <Sv d={icPhone} size={14} color="white" /> New Call Entry
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header text-left">Caller</th>
                <th className="table-header text-left">Disposition</th>
                <th className="table-header text-left">Booking ID</th>
                <th className="table-header text-left">Agent</th>
                <th className="table-header text-left">Time</th>
                <th className="table-header text-left">Remarks</th>
                <th className="table-header text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {calls.map(call => (
                <tr key={call.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div className="font-semibold text-gray-800 text-sm">{call.caller}</div>
                    <div className="text-xs text-gray-400">{call.phone}</div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${DISPOSITION_COLORS[call.disposition] || 'bg-gray-100 text-gray-600'}`}>{call.disposition}</span>
                  </td>
                  <td className="table-cell">
                    {call.bookingId ? (
                      <button onClick={() => setViewBookingId(call.bookingId)} className="font-mono text-xs text-primary-600 hover:underline">{call.bookingId}</button>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="table-cell text-gray-600 text-sm">{call.agent}</td>
                  <td className="table-cell text-gray-400 text-sm">{call.time}</td>
                  <td className="table-cell text-gray-500 text-sm max-w-[220px] truncate">{call.remarks || '—'}</td>
                  <td className="table-cell">
                    <button onClick={() => setViewCall(call)} className="text-primary-600 hover:text-primary-700 text-xs font-semibold">View</button>
                  </td>
                </tr>
              ))}
              {calls.length === 0 && (
                <tr><td colSpan={7} className="table-cell text-center text-gray-400 py-10">No calls logged yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── NEW CALL ENTRY MODAL ─────────────────────────────────── */}
      {showEntry && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col" style={{ maxHeight: '92vh' }}>
            <div className="travel-gradient rounded-t-2xl px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-white font-bold text-lg">Call Disposition Entry</h3>
                <p className="text-blue-100 text-xs">Select what happened on the call, then add remarks</p>
              </div>
              <button onClick={closeEntry} className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-xl font-light">×</button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Caller Name</label>
                  <input className={inp} value={caller} onChange={e => setCaller(e.target.value)} placeholder="Optional if filled below in Passenger Details" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
                  <input className={inp} value={phone} onChange={e => setPhone(e.target.value)} placeholder="Calling number" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Call Disposition <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DISPOSITIONS.map(d => (
                    <button key={d} type="button" onClick={() => setDisposition(d)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left ${
                        disposition === d
                          ? 'bg-primary-700 text-white border-primary-700 shadow-md'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:bg-primary-50/40'
                      }`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Remarks <span className="text-red-500">*</span></label>
                <textarea className="input-field text-sm py-2 resize-none" rows="3"
                  placeholder="Document what happened on the call…"
                  value={remarks} onChange={e => setRemarks(e.target.value)} />
              </div>

              {isNewBooking && (
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="badge bg-green-100 text-green-700">New Booking</span>
                    <span className="text-xs text-gray-400">Fill in the booking details below</span>
                  </div>
                  <BookingFields formApi={bookingForm} />
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-gray-50 rounded-b-2xl">
              <button onClick={closeEntry} className="btn-outline flex-1 py-2.5 text-sm">Cancel</button>
              <button onClick={saveEntry} disabled={!canSave || saving}
                className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? 'Saving…' : isNewBooking ? 'Create Booking & Save Entry' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View a call log entry */}
      {viewCall && !viewCall.bookingId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3" onClick={() => setViewCall(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-800 mb-3">Call Entry</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">Caller:</span> <span className="font-semibold">{viewCall.caller}</span></p>
              <p><span className="text-gray-400">Phone:</span> {viewCall.phone}</p>
              <p><span className="text-gray-400">Disposition:</span> <span className={`badge ${DISPOSITION_COLORS[viewCall.disposition]}`}>{viewCall.disposition}</span></p>
              <p><span className="text-gray-400">Agent:</span> {viewCall.agent}</p>
              <p><span className="text-gray-400">Time:</span> {viewCall.time}</p>
              <p className="text-gray-600 bg-gray-50 rounded-lg p-3 mt-2">{viewCall.remarks || 'No remarks'}</p>
            </div>
            <button onClick={() => setViewCall(null)} className="btn-outline w-full py-2 text-sm mt-4">Close</button>
          </div>
        </div>
      )}
      {viewCall && viewCall.bookingId && (
        <BookingDetailModal booking={bookingStore.get(viewCall.bookingId)} onClose={() => setViewCall(null)} />
      )}
      {viewBookingId && (
        <BookingDetailModal booking={bookingStore.get(viewBookingId)} onClose={() => setViewBookingId(null)} />
      )}
    </DashboardLayout>
  );
}
