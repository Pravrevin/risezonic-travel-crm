import { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import BookingFields from '../components/BookingFields';
import BookingDetailModal from '../components/BookingDetailModal';
import { useBookingForm, buildBookingPayload } from '../hooks/useBookingForm';
import { bookingStore, nextBookingId } from '../lib/bookings';
import { postToSheet } from '../lib/sheetClient';
import { useStoreList } from '../hooks/useStore';
import { useAuth } from '../context/AuthContext';

const Sv = ({ d, size = 16, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);
const icPlane = 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z';
const icSearch = ['M11 19a8 8 0 100-16 8 8 0 000 16z', 'M21 21l-4.35-4.35'];

const SEARCH_TYPES = ['Booking ID', 'Airline PNR', 'Email ID'];

export default function Bookings() {
  const bookings = useStoreList(bookingStore);
  const { user } = useAuth();
  const [searchType, setSearchType] = useState('Booking ID');
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [saving, setSaving] = useState(false);

  const bookingForm = useBookingForm();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter((b) => {
      if (searchType === 'Booking ID') return b.id.toLowerCase().includes(q);
      if (searchType === 'Airline PNR') return (b.pnr || '').toLowerCase().includes(q);
      if (searchType === 'Email ID') return (b.email || '').toLowerCase().includes(q);
      return true;
    });
  }, [bookings, searchType, query]);

  const saveBooking = async () => {
    if (!bookingForm.isValid || saving) return;
    setSaving(true);
    const payload = buildBookingPayload(bookingForm.form, bookingForm.fare);
    const id = nextBookingId(bookingStore.all());
    const booking = bookingStore.create({ ...payload, id, disposition: 'New booking', agent: user?.name || 'Agent' });

    const result = await postToSheet('bookings', booking);
    if (result === 'sent') bookingStore.markSynced(booking.id);
    else bookingStore.markUnsynced(booking.id);

    setSaving(false);
    bookingForm.reset();
    setShowAdd(false);
  };

  return (
    <DashboardLayout title="Bookings" subtitle="Look up an existing reservation or create a new one">

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 text-blue-700 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0"><Sv d={icPlane} size={17} color="#2563eb" /></div>
          <div>
            <div className="text-2xl font-black">{bookings.length}</div>
            <div className="text-xs font-medium opacity-70">Total Bookings</div>
          </div>
        </div>
        <div className="bg-green-50 text-green-700 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">
            <Sv d="M20 6L9 17l-5-5" size={17} color="#16a34a" />
          </div>
          <div>
            <div className="text-2xl font-black">${bookings.reduce((s, b) => s + parseFloat(b.grandTotal || 0), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <div className="text-xs font-medium opacity-70">Total Grand Total</div>
          </div>
        </div>
      </div>

      {/* Existing reservation lookup */}
      <div className="card p-4 mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-600 mr-1">Check Existing Reservation:</span>
          <select value={searchType} onChange={e => setSearchType(e.target.value)} className="input-field text-sm py-2 w-auto">
            {SEARCH_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <div className="flex-1 min-w-[180px] flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Sv d={icSearch} size={14} color="#9ca3af" sw={2} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Search by ${searchType}…`}
              className="bg-transparent text-sm outline-none w-full placeholder-gray-400" />
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary py-2 text-sm flex items-center gap-2 ml-auto">
            <span>+</span> New Booking
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-4">
        {results.map(b => {
          const paxTotal = (parseInt(b.paxAdults) || 0) + (parseInt(b.paxChildren) || 0) + (parseInt(b.paxInfants) || 0) + (parseInt(b.paxSeniors) || 0);
          return (
            <div key={b.id} className="card p-5 hover:shadow-md transition-all duration-200">
              <div className="flex flex-wrap items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Sv d={icPlane} size={22} color="white" sw={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{b.id}</span>
                    <h3 className="font-bold text-gray-800">{b.firstName} {b.lastName}</h3>
                    <span className="badge bg-green-100 text-green-700">{b.airlineCode || '—'} {b.flightNumber || ''}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                    <span>{b.pnr ? `PNR: ${b.pnr}` : 'No PNR'}</span>
                    <span className="text-gray-400">·</span>
                    <span>{b.email || 'no email'}</span>
                    <span className="text-gray-400">·</span>
                    <span>{paxTotal} pax</span>
                    <span className="text-gray-400">·</span>
                    <span>{b.fromCity && b.toCity ? `${b.fromCity} → ${b.toCity}` : '—'}</span>
                    <span className="text-gray-400">·</span>
                    <span>{b.travelDate || '—'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-gray-800">${parseFloat(b.grandTotal || 0).toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-1">Grand Total</div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setViewBooking(b)} className="text-primary-600 hover:text-primary-700 text-xs font-semibold border border-primary-200 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors">View / Send Conf.</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {results.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="flex justify-center mb-3"><Sv d={icPlane} size={40} color="#d1d5db" sw={1.4} /></div>
            <div className="font-medium">No bookings found</div>
          </div>
        )}
      </div>

      {/* New Booking Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col" style={{ maxHeight: '92vh' }}>
            <div className="travel-gradient rounded-t-2xl px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-white font-bold text-lg">New Booking</h3>
                <p className="text-blue-100 text-xs">Complete passenger, flight, and payment details</p>
              </div>
              <button onClick={() => { bookingForm.reset(); setShowAdd(false); }} className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-xl font-light">×</button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5">
              <BookingFields formApi={bookingForm} />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-gray-50 rounded-b-2xl">
              <button onClick={() => { bookingForm.reset(); setShowAdd(false); }} className="btn-outline flex-1 py-2.5 text-sm">Cancel</button>
              <button onClick={saveBooking} disabled={!bookingForm.isValid || saving}
                className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? 'Saving…' : 'Create Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewBooking && <BookingDetailModal booking={viewBooking} onClose={() => setViewBooking(null)} />}
    </DashboardLayout>
  );
}
