import { DISPOSITIONS } from '../constants/dispositions';
import { MERCHANT_FEE_RATE } from '../hooks/useBookingForm';

const MERCHANT_FEE_PCT = (MERCHANT_FEE_RATE * 100).toFixed(1);
const COUNTRIES =['India', 'USA', 'UAE', 'UK', 'Australia', 'Canada', 'Saudi Arabia', 'Pakistan', 'Bangladesh', 'Singapore', 'Malaysia', 'Thailand', 'Germany', 'France', 'Italy', 'Other'];

export const SectionHeader = ({ number, title, subtitle, color = 'primary' }) => {
  const colorMap = {
    primary: ['border-primary-100', 'bg-primary-600'],
    teal: ['border-teal-100', 'bg-teal-600'],
    purple: ['border-purple-100', 'bg-purple-600'],
    orange: ['border-orange-100', 'bg-orange-500'],
    green: ['border-green-100', 'bg-green-600'],
    sky: ['border-sky-100', 'bg-sky-600'],
    amber: ['border-amber-100', 'bg-amber-500'],
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

export const Field = ({ label, required, children, span2 }) => (
  <div className={span2 ? 'sm:col-span-2' : ''}>
    <label className="block text-xs font-semibold text-gray-500 mb-1">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inp = 'input-field text-sm py-2';
const sel = 'input-field text-sm py-2';

// Shared passenger / flight / payment fields used both for the "New booking" call
// disposition flow (Calls page) and the standalone "+ New Booking" flow (Bookings page).
export default function BookingFields({ formApi }) {
  const { form: b, set, fetchPnr, pnrStatus, pnrError, fare, paxTotal } = formApi;

  return (
    <div className="space-y-7">
      {/* Passenger */}
      <div>
        <SectionHeader number="1" title="Passenger Details" color="primary" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="First Name" required>
            <input className={inp} value={b.firstName} onChange={e => set('firstName', e.target.value)} />
          </Field>
          <Field label="Last Name" required>
            <input className={inp} value={b.lastName} onChange={e => set('lastName', e.target.value)} />
          </Field>
          <Field label="Middle Name (if any)">
            <input className={inp} value={b.middleName} onChange={e => set('middleName', e.target.value)} />
          </Field>
          <Field label="Date of Birth">
            <input className={inp} type="date" value={b.dob} onChange={e => set('dob', e.target.value)} />
          </Field>
          <Field label="Email">
            <input className={inp} type="email" value={b.email} onChange={e => set('email', e.target.value)} />
          </Field>
          <Field label="Calling Phone No." required>
            <input className={inp} value={b.callingPhone} onChange={e => set('callingPhone', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Billing */}
      <div>
        <SectionHeader number="2" title="Billing Details" color="teal" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Billing Phone No.">
            <input className={inp} value={b.billingPhone} onChange={e => set('billingPhone', e.target.value)} />
          </Field>
          <Field label="Billing Address" span2>
            <input className={inp} value={b.billingAddress} onChange={e => set('billingAddress', e.target.value)} />
          </Field>
          <Field label="State">
            <input className={inp} value={b.billingState} onChange={e => set('billingState', e.target.value)} />
          </Field>
          <Field label="Zip Code">
            <input className={inp} value={b.billingZip} onChange={e => set('billingZip', e.target.value)} />
          </Field>
          <Field label="Country">
            <select className={sel} value={b.billingCountry} onChange={e => set('billingCountry', e.target.value)}>
              <option value="">Select</option>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
      </div>

      {/* Flight via PNR */}
      <div>
        <SectionHeader number="3" title="Flight Details" subtitle="Enter PNR and fetch to auto-fill" color="purple" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="PNR / Record Locator" span2>
            <div className="flex gap-2">
              <input className={inp} placeholder="e.g. QF7K2P" value={b.pnr} onChange={e => set('pnr', e.target.value.toUpperCase())} />
              <button type="button" onClick={fetchPnr} disabled={!b.pnr || pnrStatus === 'loading'}
                className="btn-primary py-2 px-4 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                {pnrStatus === 'loading' ? 'Fetching…' : 'Fetch Flight Details'}
              </button>
            </div>
            {pnrStatus === 'error' && <p className="text-xs text-red-500 mt-1">{pnrError}</p>}
            {pnrStatus === 'done' && <p className="text-xs text-green-600 mt-1">Flight details auto-filled below — review before saving.</p>}
          </Field>
          <Field label="Airline">
            <input className={inp} value={b.airlineName} onChange={e => set('airlineName', e.target.value)} placeholder="Auto-filled from PNR" />
          </Field>
          <Field label="Airline Code">
            <input className={inp} value={b.airlineCode} onChange={e => set('airlineCode', e.target.value.toUpperCase())} placeholder="e.g. EK" />
          </Field>
          <Field label="Flight Number">
            <input className={inp} value={b.flightNumber} onChange={e => set('flightNumber', e.target.value)} />
          </Field>
          <Field label="Route (From → To)">
            <div className="flex items-center gap-2">
              <input className={inp} value={b.fromCity} onChange={e => set('fromCity', e.target.value.toUpperCase())} placeholder="From" />
              <span className="text-gray-400">→</span>
              <input className={inp} value={b.toCity} onChange={e => set('toCity', e.target.value.toUpperCase())} placeholder="To" />
            </div>
          </Field>
          <Field label="Travel Date">
            <input className={inp} type="date" value={b.travelDate} onChange={e => set('travelDate', e.target.value)} />
          </Field>
          <Field label="Departure Time">
            <input className={inp} type="time" value={b.departureTime} onChange={e => set('departureTime', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Pax */}
      <div>
        <SectionHeader number="4" title="Passenger Count" color="orange" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Field label="Adult">
            <input className={inp} type="number" min="0" value={b.paxAdults} onChange={e => set('paxAdults', e.target.value)} />
          </Field>
          <Field label="Child">
            <input className={inp} type="number" min="0" value={b.paxChildren} onChange={e => set('paxChildren', e.target.value)} />
          </Field>
          <Field label="Infant">
            <input className={inp} type="number" min="0" value={b.paxInfants} onChange={e => set('paxInfants', e.target.value)} />
          </Field>
          <Field label="Senior">
            <input className={inp} type="number" min="0" value={b.paxSeniors} onChange={e => set('paxSeniors', e.target.value)} />
          </Field>
        </div>
        <p className="text-xs text-gray-400 mt-2">Total passengers: <span className="font-semibold text-gray-600">{paxTotal}</span></p>
      </div>

      {/* Card & Charge */}
      <div>
        <SectionHeader number="5" title="Card Details & Charge" color="green" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Card Number">
            <input className={inp} inputMode="numeric" placeholder="•••• •••• •••• ••••" value={b.cardNumber} onChange={e => set('cardNumber', e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Exp (MM/YY)">
              <input className={inp} placeholder="MM/YY" value={b.cardExp} onChange={e => set('cardExp', e.target.value)} />
            </Field>
            <Field label="CVV">
              <input className={inp} inputMode="numeric" maxLength={4} value={b.cardCvv} onChange={e => set('cardCvv', e.target.value)} />
            </Field>
          </div>
          <Field label="Reason of Charge">
            <select className={sel} value={b.reasonOfCharge} onChange={e => set('reasonOfCharge', e.target.value)}>
              {DISPOSITIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Ticket Number">
            <input className={inp} value={b.ticketNumber} onChange={e => set('ticketNumber', e.target.value)} />
          </Field>
          <Field label="Base Fare">
            <input className={inp} type="number" placeholder="0.00" value={b.baseFare} onChange={e => set('baseFare', e.target.value)} />
          </Field>
          <Field label="Agency Fee">
            <input className={inp} type="number" placeholder="0.00" value={b.agencyFee} onChange={e => set('agencyFee', e.target.value)} />
          </Field>
        </div>
        {(fare.base > 0 || fare.agency > 0) && (
          <div className="mt-3 bg-green-50 border border-green-100 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div><span className="text-gray-400 text-xs block">Base Fare</span><span className="font-semibold text-gray-700">${fare.base.toFixed(2)}</span></div>
            <div><span className="text-gray-400 text-xs block">Agency Fee</span><span className="font-semibold text-gray-700">${fare.agency.toFixed(2)}</span></div>
            <div><span className="text-gray-400 text-xs block">Merchant Fee (auto, {(MERCHANT_FEE_PCT)}%)</span><span className="font-semibold text-gray-700">${fare.merchant.toFixed(2)}</span></div>
            <div><span className="text-green-600 text-xs block">Grand Total</span><span className="font-black text-green-700">${fare.grand.toFixed(2)}</span></div>
          </div>
        )}
      </div>

      {/* Remarks */}
      <div>
        <SectionHeader number="6" title="Remarks" color="sky" />
        <textarea className="input-field text-sm py-2 resize-none" rows="3"
          placeholder="Notes about this booking (special requests, seat preference, etc.)"
          value={b.remarks} onChange={e => set('remarks', e.target.value)} />
      </div>
    </div>
  );
}
