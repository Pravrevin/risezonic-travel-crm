import { useState } from 'react';
import { MERCHANT_FEE_RATE } from '../hooks/useBookingForm';

const Row = ({ label, value }) => (
  <div>
    <div className="text-xs text-gray-400">{label}</div>
    <div className="text-sm font-semibold text-gray-800">{value || '—'}</div>
  </div>
);

export default function BookingDetailModal({ booking, onClose }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  if (!booking) return null;

  const paxTotal = (parseInt(booking.paxAdults) || 0) + (parseInt(booking.paxChildren) || 0)
    + (parseInt(booking.paxInfants) || 0) + (parseInt(booking.paxSeniors) || 0);

  const sendConfirmation = () => {
    setSending(true);
    // Simulated send — wire this to your email/SMS provider.
    setTimeout(() => { setSending(false); setSent(true); }, 900);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="travel-gradient rounded-t-2xl px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-white font-bold text-lg">Booking Details</h3>
              <span className="bg-white/20 text-white text-xs font-mono px-2 py-0.5 rounded">{booking.id}</span>
            </div>
            <p className="text-blue-100 text-xs">{booking.firstName} {booking.lastName} · {booking.email || 'no email on file'}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-xl font-light">×</button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Passenger</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Row label="Name" value={`${booking.firstName} ${booking.middleName || ''} ${booking.lastName}`} />
              <Row label="DOB" value={booking.dob} />
              <Row label="Email" value={booking.email} />
              <Row label="Calling Phone" value={booking.callingPhone} />
              <Row label="Billing Phone" value={booking.billingPhone} />
              <Row label="Passengers" value={`${paxTotal} (${booking.paxAdults || 0} adult, ${booking.paxChildren || 0} child, ${booking.paxInfants || 0} infant, ${booking.paxSeniors || 0} senior)`} />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Billing Address</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Row label="Address" value={booking.billingAddress} />
              <Row label="State" value={booking.billingState} />
              <Row label="Zip" value={booking.billingZip} />
              <Row label="Country" value={booking.billingCountry} />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Flight</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Row label="Airline PNR" value={booking.pnr} />
              <Row label="Airline" value={`${booking.airlineName || ''} (${booking.airlineCode || ''})`} />
              <Row label="Flight No." value={booking.flightNumber} />
              <Row label="Route" value={booking.fromCity && booking.toCity ? `${booking.fromCity} → ${booking.toCity}` : ''} />
              <Row label="Travel Date" value={booking.travelDate} />
              <Row label="Departure" value={booking.departureTime} />
              <Row label="Ticket Number" value={booking.ticketNumber} />
            </div>
          </div>

          {/* Agent-only fare breakdown — never expose merchant/agency lines to the passenger */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fare Breakdown (Internal — Agent View Only)</h4>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div><span className="text-gray-400 text-xs block">Base Fare</span><span className="font-semibold text-gray-700">${parseFloat(booking.baseFare || 0).toFixed(2)}</span></div>
              <div><span className="text-gray-400 text-xs block">Agency Fee</span><span className="font-semibold text-gray-700">${parseFloat(booking.agencyFee || 0).toFixed(2)}</span></div>
              <div><span className="text-gray-400 text-xs block">Merchant Fee ({(MERCHANT_FEE_RATE * 100).toFixed(1)}%, auto)</span><span className="font-semibold text-gray-700">${parseFloat(booking.merchantFee || 0).toFixed(2)}</span></div>
              <div><span className="text-green-600 text-xs block">Grand Total</span><span className="font-black text-green-700">${parseFloat(booking.grandTotal || 0).toFixed(2)}</span></div>
            </div>
          </div>

          {booking.remarks && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Remarks</h4>
              <p className="text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-xl p-3">{booking.remarks}</p>
            </div>
          )}

          {/* Passenger-facing confirmation preview — grand total only, no fee breakdown */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Passenger Confirmation Preview</h4>
            <div className="border border-primary-100 bg-primary-50/40 rounded-xl p-4">
              <p className="text-sm text-gray-700 mb-2">Hi {booking.firstName}, your booking <b>{booking.id}</b> ({booking.airlineName} {booking.flightNumber}, {booking.fromCity}→{booking.toCity} on {booking.travelDate}) is confirmed.</p>
              <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-primary-100">
                <span className="text-sm font-semibold text-gray-600">Total Charged</span>
                <span className="text-lg font-black text-primary-700">${parseFloat(booking.grandTotal || 0).toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">This is exactly what the passenger receives — no fare/fee breakdown is included.</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="btn-outline flex-1 py-2.5 text-sm">Close</button>
          <button onClick={sendConfirmation} disabled={!booking.email || sending}
            className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {sending ? 'Sending…' : sent ? 'Sent ✓' : 'Send Confirmation to Passenger'}
          </button>
        </div>
      </div>
    </div>
  );
}
