import { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Sv = ({ d, size = 16, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);
const icPlane  = 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z';
const icCheck  = 'M20 6L9 17l-5-5';
const icClock  = ['M12 2a10 10 0 100 20A10 10 0 0012 2z','M12 6v6l4 2'];
const icDollar = ['M12 2v20','M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'];

const initialBookings = [
  { id: 'BK001', customer: 'John Davis', type: 'Package', destination: 'Europe Tour 10D', checkIn: '2026-04-15', checkOut: '2026-04-25', revenue: '$5,200', status: 'Confirmed', agent: 'Sarah J.', pax: 2 },
  { id: 'BK002', customer: 'Fatima Ali', type: 'Hotel', destination: 'Bali Resort 7N', checkIn: '2026-04-20', checkOut: '2026-04-27', revenue: '$2,900', status: 'Confirmed', agent: 'Sarah J.', pax: 3 },
  { id: 'BK003', customer: 'David Lee', type: 'Package', destination: 'Japan 10D', checkIn: '2026-05-01', checkOut: '2026-05-11', revenue: '$4,600', status: 'Pending Payment', agent: 'Tom K.', pax: 2 },
  { id: 'BK004', customer: 'Raj Kumar', type: 'Package', destination: 'Dubai 5N', checkIn: '2026-04-10', checkOut: '2026-04-15', revenue: '$2,500', status: 'Confirmed', agent: 'Mike R.', pax: 4 },
  { id: 'BK005', customer: 'Priya Singh', type: 'Hotel', destination: 'Maldives 5N', checkIn: '2026-04-28', checkOut: '2026-05-03', revenue: '$3,800', status: 'Processing', agent: 'Sarah J.', pax: 2 },
];

const emptyBooking = {
  // 1 – Basic
  leadId: '', customerName: '', phone: '', email: '',
  bookingType: 'Package', bookingSource: 'Call',
  // 2 – Travel
  destination: '', departureCity: '', travelStartDate: '', travelEndDate: '',
  adults: '1', children: '0', infants: '0', travelPurpose: 'Leisure',
  // 3 – Flight
  airlineName: '', flightNumber: '', departureTime: '', arrivalTime: '', pnrNumber: '', flightClass: 'Economy',
  // 3 – Hotel
  hotelName: '', roomType: '', checkInDate: '', checkOutDate: '', numberOfRooms: '1', mealPlan: '',
  // 3 – Car
  pickupLocation: '', dropLocation: '', carType: '', driverRequired: 'No',
  // 3 – Insurance
  insuranceProvider: '', policyNumber: '', coverageType: '',
  // 4 – Pricing
  totalPackageCost: '', discountGiven: '0', finalSellingPrice: '', costPrice: '', tax: '', paymentMode: 'Bank Transfer',
  // 5 – Payment
  paymentStatus: 'Pending', amountPaid: '0', paymentDates: '', transactionId: '',
  // 6 – Vendor
  vendorType: '', vendorName: '', vendorCost: '', vendorBookingRef: '',
  // 7 – Agent
  assignedAgent: '', bookingCreatedBy: '', commission: '',
  // 8 – Status
  bookingStatus: 'Pending', ticketStatus: 'Not Issued', cancellationStatus: '', refundStatus: '',
  // 10 – Notes
  bookingNotes: '', specialInstructions: '', customerPreferences: '', internalComments: '',
  // 11 – Automation
  sendConfirmationEmail: false, sendWhatsAppItinerary: false, generateInvoice: false, sendPaymentReminder: false,
};

const statusColors = {
  Confirmed: 'bg-green-100 text-green-700',
  'Pending Payment': 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-red-100 text-red-700',
  'On Hold': 'bg-orange-100 text-orange-700',
};

const SectionHeader = ({ number, title, subtitle, color = 'primary' }) => {
  const colorMap = {
    primary: ['border-primary-100', 'bg-primary-600'],
    teal: ['border-teal-100', 'bg-teal-600'],
    purple: ['border-purple-100', 'bg-purple-600'],
    orange: ['border-orange-100', 'bg-orange-500'],
    green: ['border-green-100', 'bg-green-600'],
    indigo: ['border-indigo-100', 'bg-indigo-600'],
    red: ['border-red-100', 'bg-red-500'],
    pink: ['border-pink-100', 'bg-pink-600'],
    sky: ['border-sky-100', 'bg-sky-600'],
    amber: ['border-amber-100', 'bg-amber-500'],
    gray: ['border-gray-200', 'bg-gray-500'],
  };
  const [border, bg] = colorMap[color] || colorMap.primary;
  return (
    <div className={`flex items-center gap-3 pb-3 mb-4 border-b-2 ${border}`}>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0 ${bg}`}>{number}</div>
      <div>
        <div className="font-bold text-gray-800 text-sm leading-tight">{title}</div>
        {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
      </div>
    </div>
  );
};

const Field = ({ label, required, children, span2 }) => (
  <div className={span2 ? 'sm:col-span-2' : ''}>
    <label className="block text-xs font-semibold text-gray-500 mb-1">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const SubSectionLabel = ({ icon, title }) => (
  <div className="sm:col-span-2 flex items-center gap-2 mt-1">
    <span className="text-base">{icon}</span>
    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{title}</span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
    <div onClick={onChange} className={`w-10 h-5 rounded-full transition-all flex-shrink-0 relative ${checked ? 'bg-primary-600' : 'bg-gray-200'}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
    </div>
    <span className="text-sm text-gray-700 font-medium">{label}</span>
  </label>
);

function calcDuration(start, end) {
  if (!start || !end) return null;
  const d = Math.round((new Date(end) - new Date(start)) / 86400000);
  return d > 0 ? d : null;
}

function calcProfit(selling, cost) {
  const s = parseFloat(selling), c = parseFloat(cost);
  if (!s || !c || s === 0) return null;
  return (((s - c) / s) * 100).toFixed(1);
}

function calcBalance(selling, paid) {
  const s = parseFloat(selling) || 0, p = parseFloat(paid) || 0;
  return (s - p).toFixed(2);
}

export default function Bookings() {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [b, setB] = useState(emptyBooking);

  const set = (key, val) => setB(p => ({ ...p, [key]: val }));
  const tog = (key) => setB(p => ({ ...p, [key]: !p[key] }));

  const filtered = filter === 'All' ? bookings : bookings.filter(bk => bk.status === filter);
  const totalRevenue = bookings.reduce((sum, bk) => sum + parseFloat(bk.revenue.replace(/[$,]/g, '')), 0);

  const duration = useMemo(() => calcDuration(b.travelStartDate, b.travelEndDate), [b.travelStartDate, b.travelEndDate]);
  const profitMargin = useMemo(() => calcProfit(b.finalSellingPrice, b.costPrice), [b.finalSellingPrice, b.costPrice]);
  const balanceAmount = useMemo(() => calcBalance(b.finalSellingPrice, b.amountPaid), [b.finalSellingPrice, b.amountPaid]);

  const showFlight = ['Flight', 'Package'].includes(b.bookingType);
  const showHotel = ['Hotel', 'Package'].includes(b.bookingType);
  const showCar = b.bookingType === 'Car';
  const showInsurance = b.bookingType === 'Insurance';

  const bookingId = useMemo(() => 'BK' + String(bookings.length + 1).padStart(3, '0'), [bookings.length]);

  const saveBooking = () => {
    if (!b.customerName || !b.destination) return;
    setBookings(prev => [{
      id: bookingId,
      customer: b.customerName,
      type: b.bookingType,
      destination: b.destination,
      checkIn: b.travelStartDate || b.checkInDate,
      checkOut: b.travelEndDate || b.checkOutDate,
      revenue: b.finalSellingPrice ? `$${parseFloat(b.finalSellingPrice).toLocaleString()}` : '$0',
      status: b.bookingStatus === 'Confirmed' ? 'Confirmed' : b.bookingStatus === 'Pending' ? 'Pending Payment' : b.bookingStatus,
      agent: b.assignedAgent || '—',
      pax: parseInt(b.adults || 1) + parseInt(b.children || 0),
    }, ...prev]);
    setB(emptyBooking);
    setShowAdd(false);
  };

  const inp = 'input-field text-sm py-2';
  const sel = 'input-field text-sm py-2';

  return (
    <DashboardLayout title="Bookings" subtitle="All confirmed flights, hotels, cars, and insurance bookings">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Bookings', val: bookings.length, icon: icPlane,  c: '#2563eb', bg: 'bg-blue-50 text-blue-700' },
          { label: 'Confirmed', val: bookings.filter(bk => bk.status === 'Confirmed').length, icon: icCheck,  c: '#16a34a', bg: 'bg-green-50 text-green-700' },
          { label: 'Pending', val: bookings.filter(bk => bk.status !== 'Confirmed').length, icon: icClock,  c: '#ca8a04', bg: 'bg-yellow-50 text-yellow-700' },
          { label: 'Total Revenue', val: `$${(totalRevenue / 1000).toFixed(1)}K`, icon: icDollar, c: '#7c3aed', bg: 'bg-purple-50 text-purple-700' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0"><Sv d={s.icon} size={17} color={s.c} /></div>
            <div>
              <div className="text-2xl font-black">{s.val}</div>
              <div className="text-xs font-medium opacity-70">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card p-4 mb-4 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {['All', 'Confirmed', 'Pending Payment', 'Processing', 'On Hold', 'Cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary py-2 text-sm flex items-center gap-2">
          <span>+</span> New Booking
        </button>
      </div>

      {/* Booking Cards */}
      <div className="grid gap-4">
        {filtered.map(booking => (
          <div key={booking.id} className="card p-5 hover:shadow-md transition-all duration-200">
            <div className="flex flex-wrap items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sv d={icPlane} size={22} color="white" sw={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{booking.id}</span>
                  <h3 className="font-bold text-gray-800">{booking.customer}</h3>
                  <span className={`badge ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}>{booking.status}</span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                  <span>{booking.destination}</span>
                  <span className="text-gray-400">·</span>
                  <span>{booking.type}</span>
                  <span className="text-gray-400">·</span>
                  <span>{booking.pax} pax</span>
                  <span className="text-gray-400">·</span>
                  <span>{booking.checkIn} → {booking.checkOut}</span>
                  <span className="text-gray-400">·</span>
                  <span>{booking.agent}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-gray-800">{booking.revenue}</div>
                <div className="text-xs text-gray-400 mt-1">Revenue</div>
                <div className="flex gap-2 mt-3">
                  <button className="text-primary-600 hover:text-primary-700 text-xs font-semibold border border-primary-200 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors">View</button>
                  <button className="text-secondary-600 hover:text-secondary-700 text-xs font-semibold border border-secondary-200 px-3 py-1.5 rounded-lg hover:bg-secondary-50 transition-colors">Send Conf.</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="flex justify-center mb-3"><Sv d={icPlane} size={40} color="#d1d5db" sw={1.4} /></div>
            <div className="font-medium">No bookings found</div>
          </div>
        )}
      </div>

      {/* ── NEW BOOKING MODAL ────────────────────────────────────────── */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col" style={{ maxHeight: '92vh' }}>

            {/* Header */}
            <div className="travel-gradient rounded-t-2xl px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-bold text-lg">New Booking</h3>
                  <span className="bg-white/20 text-white text-xs font-mono px-2 py-0.5 rounded">{bookingId}</span>
                </div>
                <p className="text-blue-100 text-xs">Complete all sections for a full booking record</p>
              </div>
              <button onClick={() => { setB(emptyBooking); setShowAdd(false); }} className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-xl font-light">×</button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-7">

              {/* ── SECTION 1: Basic Booking Information ── */}
              <div>
                <SectionHeader number="1" title="Basic Booking Information" subtitle="Core identification of booking" color="primary" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Booking ID">
                    <input className={`${inp} bg-gray-50 text-gray-400`} value={bookingId} readOnly />
                  </Field>
                  <Field label="Lead ID (if linked)">
                    <input className={inp} placeholder="e.g. LD-1042" value={b.leadId} onChange={e => set('leadId', e.target.value)} />
                  </Field>
                  <Field label="Customer Name" required>
                    <input className={inp} placeholder="Full name" value={b.customerName} onChange={e => set('customerName', e.target.value)} />
                  </Field>
                  <Field label="Phone Number">
                    <input className={inp} placeholder="+91 98765 43210" value={b.phone} onChange={e => set('phone', e.target.value)} />
                  </Field>
                  <Field label="Email Address">
                    <input className={inp} type="email" placeholder="customer@email.com" value={b.email} onChange={e => set('email', e.target.value)} />
                  </Field>
                  <Field label="Booking Date">
                    <input className={`${inp} bg-gray-50`} type="date" value={new Date().toISOString().split('T')[0]} readOnly />
                  </Field>
                  <Field label="Booking Type" required>
                    <select className={sel} value={b.bookingType} onChange={e => set('bookingType', e.target.value)}>
                      {['Package', 'Flight', 'Hotel', 'Car', 'Insurance', 'Train'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Booking Source">
                    <select className={sel} value={b.bookingSource} onChange={e => set('bookingSource', e.target.value)}>
                      {['Call', 'Website', 'Walk-in', 'Agent', 'WhatsApp', 'Email'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              {/* ── SECTION 2: Travel Details ── */}
              <div>
                <SectionHeader number="2" title="Travel Details" subtitle="What exactly is booked?" color="teal" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Destination" required>
                    <input className={inp} placeholder="e.g. Dubai, Maldives, Europe" value={b.destination} onChange={e => set('destination', e.target.value)} />
                  </Field>
                  <Field label="Departure City">
                    <input className={inp} placeholder="e.g. Mumbai, Delhi" value={b.departureCity} onChange={e => set('departureCity', e.target.value)} />
                  </Field>
                  <Field label="Travel Start Date">
                    <input className={inp} type="date" value={b.travelStartDate} onChange={e => set('travelStartDate', e.target.value)} />
                  </Field>
                  <Field label="Travel End Date">
                    <input className={inp} type="date" value={b.travelEndDate} onChange={e => set('travelEndDate', e.target.value)} />
                  </Field>
                  {duration && (
                    <div className="sm:col-span-2">
                      <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
                        <span className="text-teal-600 text-sm font-semibold">⏱ Duration:</span>
                        <span className="text-teal-700 font-bold">{duration} Night{duration !== 1 ? 's' : ''} / {duration + 1} Day{duration + 1 !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Number of Travelers</label>
                    <div className="grid grid-cols-3 gap-3">
                      <Field label="Adults">
                        <input className={inp} type="number" min="1" value={b.adults} onChange={e => set('adults', e.target.value)} />
                      </Field>
                      <Field label="Children (2–12)">
                        <input className={inp} type="number" min="0" value={b.children} onChange={e => set('children', e.target.value)} />
                      </Field>
                      <Field label="Infants (0–2)">
                        <input className={inp} type="number" min="0" value={b.infants} onChange={e => set('infants', e.target.value)} />
                      </Field>
                    </div>
                  </div>
                  <Field label="Travel Purpose">
                    <select className={sel} value={b.travelPurpose} onChange={e => set('travelPurpose', e.target.value)}>
                      {['Leisure', 'Business', 'Honeymoon', 'Group Tour', 'Medical', 'Education', 'Religious'].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              {/* ── SECTION 3: Service Details (Dynamic) ── */}
              <div>
                <SectionHeader number="3" title="Service Details" subtitle={`Fields for: ${b.bookingType}`} color="purple" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* Flight */}
                  {showFlight && (
                    <>
                      <SubSectionLabel icon="✈️" title="Flight Details" />
                      <Field label="Airline Name">
                        <input className={inp} placeholder="e.g. Emirates, IndiGo" value={b.airlineName} onChange={e => set('airlineName', e.target.value)} />
                      </Field>
                      <Field label="Flight Number">
                        <input className={inp} placeholder="e.g. EK504" value={b.flightNumber} onChange={e => set('flightNumber', e.target.value)} />
                      </Field>
                      <Field label="Departure Time">
                        <input className={inp} type="datetime-local" value={b.departureTime} onChange={e => set('departureTime', e.target.value)} />
                      </Field>
                      <Field label="Arrival Time">
                        <input className={inp} type="datetime-local" value={b.arrivalTime} onChange={e => set('arrivalTime', e.target.value)} />
                      </Field>
                      <Field label="PNR Number">
                        <input className={inp} placeholder="e.g. ABC123" value={b.pnrNumber} onChange={e => set('pnrNumber', e.target.value)} />
                      </Field>
                      <Field label="Class">
                        <select className={sel} value={b.flightClass} onChange={e => set('flightClass', e.target.value)}>
                          {['Economy', 'Premium Economy', 'Business', 'First Class'].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </Field>
                    </>
                  )}

                  {/* Hotel */}
                  {showHotel && (
                    <>
                      <SubSectionLabel icon="🏨" title="Hotel Details" />
                      <Field label="Hotel Name">
                        <input className={inp} placeholder="e.g. Atlantis The Palm" value={b.hotelName} onChange={e => set('hotelName', e.target.value)} />
                      </Field>
                      <Field label="Room Type">
                        <select className={sel} value={b.roomType} onChange={e => set('roomType', e.target.value)}>
                          <option value="">Select Room Type</option>
                          {['Standard', 'Deluxe', 'Superior', 'Suite', 'Family Room', 'Villa', 'Overwater Bungalow'].map(r => <option key={r}>{r}</option>)}
                        </select>
                      </Field>
                      <Field label="Check-in Date">
                        <input className={inp} type="date" value={b.checkInDate} onChange={e => set('checkInDate', e.target.value)} />
                      </Field>
                      <Field label="Check-out Date">
                        <input className={inp} type="date" value={b.checkOutDate} onChange={e => set('checkOutDate', e.target.value)} />
                      </Field>
                      <Field label="Number of Rooms">
                        <input className={inp} type="number" min="1" value={b.numberOfRooms} onChange={e => set('numberOfRooms', e.target.value)} />
                      </Field>
                      <Field label="Meal Plan">
                        <select className={sel} value={b.mealPlan} onChange={e => set('mealPlan', e.target.value)}>
                          <option value="">Select</option>
                          {['CP (Breakfast)', 'MAP (Breakfast + Dinner)', 'AP (All Meals)', 'No Meals'].map(m => <option key={m}>{m}</option>)}
                        </select>
                      </Field>
                    </>
                  )}

                  {/* Car */}
                  {showCar && (
                    <>
                      <SubSectionLabel icon="🚗" title="Car / Transfer Details" />
                      <Field label="Pickup Location">
                        <input className={inp} placeholder="e.g. Dubai Airport T3" value={b.pickupLocation} onChange={e => set('pickupLocation', e.target.value)} />
                      </Field>
                      <Field label="Drop Location">
                        <input className={inp} placeholder="e.g. Burj Al Arab" value={b.dropLocation} onChange={e => set('dropLocation', e.target.value)} />
                      </Field>
                      <Field label="Car Type">
                        <select className={sel} value={b.carType} onChange={e => set('carType', e.target.value)}>
                          <option value="">Select</option>
                          {['Sedan', 'SUV', 'Minivan', 'Bus', 'Luxury', 'Economy'].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </Field>
                      <Field label="Driver Required">
                        <select className={sel} value={b.driverRequired} onChange={e => set('driverRequired', e.target.value)}>
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </Field>
                    </>
                  )}

                  {/* Insurance */}
                  {showInsurance && (
                    <>
                      <SubSectionLabel icon="🛡️" title="Insurance Details" />
                      <Field label="Provider Name">
                        <input className={inp} placeholder="e.g. Bajaj Allianz, Tata AIG" value={b.insuranceProvider} onChange={e => set('insuranceProvider', e.target.value)} />
                      </Field>
                      <Field label="Policy Number">
                        <input className={inp} placeholder="e.g. POL-2026-00123" value={b.policyNumber} onChange={e => set('policyNumber', e.target.value)} />
                      </Field>
                      <Field label="Coverage Type">
                        <select className={sel} value={b.coverageType} onChange={e => set('coverageType', e.target.value)}>
                          <option value="">Select</option>
                          {['Single Trip', 'Multi Trip', 'Family', 'Medical Only', 'Comprehensive', 'Cancel for Any Reason'].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </Field>
                    </>
                  )}
                </div>
              </div>

              {/* ── SECTION 4: Pricing & Revenue ── */}
              <div>
                <SectionHeader number="4" title="Pricing & Revenue Details" subtitle="Most important for business" color="orange" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Total Package Cost">
                    <input className={inp} type="number" placeholder="0.00" value={b.totalPackageCost} onChange={e => set('totalPackageCost', e.target.value)} />
                  </Field>
                  <Field label="Discount Given">
                    <input className={inp} type="number" placeholder="0.00" value={b.discountGiven} onChange={e => set('discountGiven', e.target.value)} />
                  </Field>
                  <Field label="Final Selling Price" required>
                    <input className={inp} type="number" placeholder="0.00" value={b.finalSellingPrice} onChange={e => set('finalSellingPrice', e.target.value)} />
                  </Field>
                  <Field label="Cost Price (for profit tracking)">
                    <input className={inp} type="number" placeholder="0.00" value={b.costPrice} onChange={e => set('costPrice', e.target.value)} />
                  </Field>
                  {profitMargin !== null && (
                    <div className="sm:col-span-2">
                      <div className={`rounded-xl px-4 py-2.5 flex items-center gap-3 ${parseFloat(profitMargin) >= 0 ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                        <span className={`text-sm font-semibold ${parseFloat(profitMargin) >= 0 ? 'text-green-600' : 'text-red-600'}`}>📊 Profit Margin:</span>
                        <span className={`font-black text-lg ${parseFloat(profitMargin) >= 0 ? 'text-green-700' : 'text-red-700'}`}>{profitMargin}%</span>
                        <span className="text-xs text-gray-400 ml-auto">Selling − Cost / Selling</span>
                      </div>
                    </div>
                  )}
                  <Field label="Tax / GST">
                    <input className={inp} type="number" placeholder="0.00" value={b.tax} onChange={e => set('tax', e.target.value)} />
                  </Field>
                  <Field label="Payment Mode">
                    <select className={sel} value={b.paymentMode} onChange={e => set('paymentMode', e.target.value)}>
                      {['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque', 'Online Gateway'].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              {/* ── SECTION 5: Payment Details ── */}
              <div>
                <SectionHeader number="5" title="Payment Details" subtitle="Track financials" color="green" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Payment Status">
                    <select className={sel} value={b.paymentStatus} onChange={e => set('paymentStatus', e.target.value)}>
                      {['Pending', 'Partial', 'Paid', 'Refunded', 'Overdue'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Amount Paid">
                    <input className={inp} type="number" placeholder="0.00" value={b.amountPaid} onChange={e => set('amountPaid', e.target.value)} />
                  </Field>
                  {b.finalSellingPrice && (
                    <div className="sm:col-span-2">
                      <div className={`rounded-xl px-4 py-2.5 flex items-center gap-3 ${parseFloat(balanceAmount) <= 0 ? 'bg-green-50 border border-green-100' : 'bg-yellow-50 border border-yellow-100'}`}>
                        <span className={`text-sm font-semibold ${parseFloat(balanceAmount) <= 0 ? 'text-green-600' : 'text-yellow-600'}`}>💳 Balance Due:</span>
                        <span className={`font-black text-lg ${parseFloat(balanceAmount) <= 0 ? 'text-green-700' : 'text-yellow-700'}`}>${parseFloat(balanceAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  <Field label="Payment Date(s)">
                    <input className={inp} type="date" value={b.paymentDates} onChange={e => set('paymentDates', e.target.value)} />
                  </Field>
                  <Field label="Transaction ID / Reference">
                    <input className={inp} placeholder="e.g. TXN-20260328-001" value={b.transactionId} onChange={e => set('transactionId', e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* ── SECTION 6: Vendor / Supplier ── */}
              <div>
                <SectionHeader number="6" title="Vendor / Supplier Details" subtitle="Backend tracking" color="indigo" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Vendor Type">
                    <select className={sel} value={b.vendorType} onChange={e => set('vendorType', e.target.value)}>
                      <option value="">Select</option>
                      {['Airline', 'Hotel', 'Aggregator', 'Car Rental', 'Insurance Provider', 'Ground Operator', 'Visa Agency'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field label="Vendor Name">
                    <input className={inp} placeholder="e.g. TBO Holidays, Amadeus" value={b.vendorName} onChange={e => set('vendorName', e.target.value)} />
                  </Field>
                  <Field label="Vendor Cost">
                    <input className={inp} type="number" placeholder="0.00" value={b.vendorCost} onChange={e => set('vendorCost', e.target.value)} />
                  </Field>
                  <Field label="Vendor Booking Reference">
                    <input className={inp} placeholder="e.g. VND-2026-XYZ" value={b.vendorBookingRef} onChange={e => set('vendorBookingRef', e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* ── SECTION 7: Agent Details ── */}
              <div>
                <SectionHeader number="7" title="Agent Details" subtitle="Who closed the deal?" color="sky" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Assigned Agent">
                    <select className={sel} value={b.assignedAgent} onChange={e => set('assignedAgent', e.target.value)}>
                      <option value="">Select Agent</option>
                      {['Sarah J.', 'Mike R.', 'Tom K.', 'Lisa P.', 'David M.'].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </Field>
                  <Field label="Booking Created By">
                    <select className={sel} value={b.bookingCreatedBy} onChange={e => set('bookingCreatedBy', e.target.value)}>
                      <option value="">Select</option>
                      {['Sarah J.', 'Mike R.', 'Tom K.', 'Lisa P.', 'Admin'].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </Field>
                  <Field label="Commission (%)">
                    <input className={inp} type="number" min="0" max="100" placeholder="e.g. 8" value={b.commission} onChange={e => set('commission', e.target.value)} />
                  </Field>
                  {b.commission && b.finalSellingPrice && (
                    <div className="flex items-end pb-1">
                      <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5 w-full">
                        <span className="text-xs text-purple-500 font-semibold">Agent Incentive</span>
                        <div className="text-purple-700 font-black text-lg">
                          ${((parseFloat(b.commission) / 100) * parseFloat(b.finalSellingPrice)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── SECTION 8: Booking Status ── */}
              <div>
                <SectionHeader number="8" title="Booking Status & Workflow" subtitle="Lifecycle of the booking" color="amber" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Booking Status">
                    <select className={sel} value={b.bookingStatus} onChange={e => set('bookingStatus', e.target.value)}>
                      {['Pending', 'Confirmed', 'On Hold', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Ticket Status">
                    <select className={sel} value={b.ticketStatus} onChange={e => set('ticketStatus', e.target.value)}>
                      {['Not Issued', 'Issued', 'Pending Issuance'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Cancellation Status">
                    <select className={sel} value={b.cancellationStatus} onChange={e => set('cancellationStatus', e.target.value)}>
                      <option value="">N/A</option>
                      {['Cancellation Requested', 'Partially Cancelled', 'Fully Cancelled'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Refund Status">
                    <select className={sel} value={b.refundStatus} onChange={e => set('refundStatus', e.target.value)}>
                      <option value="">N/A</option>
                      {['Refund Pending', 'Partially Refunded', 'Fully Refunded', 'No Refund'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              {/* ── SECTION 9: Documents & Attachments ── */}
              <div>
                <SectionHeader number="9" title="Documents & Attachments" subtitle="Important for operations" color="pink" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Tickets (PDF)', key: 'tickets', icon: '🎫' },
                    { label: 'Hotel Voucher', key: 'hotelVoucher', icon: '🏨' },
                    { label: 'Invoice', key: 'invoice', icon: '🧾' },
                    { label: 'ID Proof / Passport', key: 'idProof', icon: '🪪' },
                    { label: 'Visa Documents', key: 'visaDocs', icon: '📋' },
                  ].map(({ label, key, icon }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">{icon} {label}</label>
                      <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-all group">
                        <div className="w-7 h-7 bg-gray-100 group-hover:bg-primary-100 rounded-lg flex items-center justify-center text-sm transition-colors">📎</div>
                        <span className="text-sm text-gray-400 group-hover:text-primary-600 transition-colors">Click to upload</span>
                        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SECTION 10: Communication & Notes ── */}
              <div>
                <SectionHeader number="10" title="Communication & Notes" subtitle="History tracking" color="gray" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Booking Notes" span2>
                    <textarea className="input-field text-sm py-2 resize-none" rows="2" placeholder="e.g. Customer requested window seat, early check-in..." value={b.bookingNotes} onChange={e => set('bookingNotes', e.target.value)} />
                  </Field>
                  <Field label="Special Instructions">
                    <textarea className="input-field text-sm py-2 resize-none" rows="2" placeholder="e.g. Vegetarian meal, wheelchair required..." value={b.specialInstructions} onChange={e => set('specialInstructions', e.target.value)} />
                  </Field>
                  <Field label="Customer Preferences">
                    <textarea className="input-field text-sm py-2 resize-none" rows="2" placeholder="e.g. Prefers aisle seat, non-smoking room..." value={b.customerPreferences} onChange={e => set('customerPreferences', e.target.value)} />
                  </Field>
                  <Field label="Internal Comments" span2>
                    <textarea className="input-field text-sm py-2 resize-none" rows="2" placeholder="Internal notes not visible to customer..." value={b.internalComments} onChange={e => set('internalComments', e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* ── SECTION 11: Automation & Notifications ── */}
              <div>
                <SectionHeader number="11" title="Automation & Notifications" subtitle="System-driven actions on save" color="teal" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Toggle label="Send Booking Confirmation (Email)" checked={b.sendConfirmationEmail} onChange={() => tog('sendConfirmationEmail')} />
                  <Toggle label="Send WhatsApp Itinerary" checked={b.sendWhatsAppItinerary} onChange={() => tog('sendWhatsAppItinerary')} />
                  <Toggle label="Generate Invoice (PDF)" checked={b.generateInvoice} onChange={() => tog('generateInvoice')} />
                  <Toggle label="Send Payment Reminder" checked={b.sendPaymentReminder} onChange={() => tog('sendPaymentReminder')} />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-gray-50 rounded-b-2xl">
              <button onClick={() => { setB(emptyBooking); setShowAdd(false); }} className="btn-outline flex-1 py-2.5 text-sm">
                Cancel
              </button>
              <button onClick={saveBooking} disabled={!b.customerName || !b.destination}
                className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Save Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
