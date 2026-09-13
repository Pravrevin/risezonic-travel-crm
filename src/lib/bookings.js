import { createStore, makeId } from './store';
import { text, postRecord } from './sheetClient';

export const bookingStore = createStore({
  storageKey: 'travel_crm_bookings',
  dirtyKey: 'travel_crm_bookings_unsynced',
  // Never actually used — every booking is created with an explicit RZ##### id
  // from nextBookingId() below, which createStore.create() honours verbatim.
  makeId: () => makeId('bk'),
});

export const BOOKING_FIELDS = [
  'id', 'firstName', 'middleName', 'lastName', 'dob', 'email', 'callingPhone', 'billingPhone',
  'billingAddress', 'billingState', 'billingZip', 'billingCountry', 'pnr', 'airlineCode', 'airlineName',
  'flightNumber', 'fromCity', 'toCity', 'travelDate', 'departureTime', 'paxAdults', 'paxChildren',
  'paxInfants', 'paxSeniors', 'cardLast4', 'cardExp', 'reasonOfCharge', 'ticketNumber', 'baseFare',
  'agencyFee', 'merchantFee', 'grandTotal', 'remarks', 'disposition', 'agent',
];

/**
 * Files a new booking. It is saved locally at once under a provisional id so
 * the screen updates instantly, then re-keyed to the id the sheet assigns
 * (the sheet is the only place that can hand out RZ##### ids safely — see
 * nextBookingId in google-apps-script.gs). Resolves to { status, id } where
 * `id` is the one to show the customer / link the call to.
 */
export async function fileBooking(draft) {
  const provisionalId = nextBookingId(bookingStore.all());
  const booking = bookingStore.create({ ...draft, id: provisionalId });

  const { status, id } = await postRecord('bookings', { ...booking, id: '' });
  if (status !== 'sent') {
    bookingStore.markUnsynced(provisionalId);
    return { status, id: provisionalId };
  }

  const finalId = id || provisionalId;
  if (finalId !== provisionalId) {
    bookingStore.remove(provisionalId);
    bookingStore.create({ ...booking, id: finalId });
  }
  bookingStore.markSynced(finalId);
  return { status, id: finalId };
}

/** Provisional local booking id — only until fileBooking() learns the real one from the sheet. */
export function nextBookingId(rows) {
  const highest = rows
    .map((r) => Number(String(r.id || '').replace(/^RZ/i, '')))
    .filter((n) => Number.isFinite(n) && n > 0)
    .reduce((max, n) => Math.max(max, n), 10000);
  return `RZ${highest + 1}`;
}

/** Sheet row -> Booking, tolerating anything typed by hand into the sheet. */
export function toBooking(raw) {
  const record = {};
  for (const key of BOOKING_FIELDS) record[key] = text(raw[key]);
  record.id = record.id || `sheet_${text(raw.pnr) || text(raw.lastName)}`.replace(/\s+/g, '-');
  record.createdAt = text(raw.timestamp) || new Date().toISOString();
  return record;
}
