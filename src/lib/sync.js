import { fetchAllFromSheet } from './sheetClient';
import { leadStore, toLead } from './leads';
import { callStore, toCall } from './calls';
import { bookingStore, toBooking } from './bookings';
import { followupStore, toFollowup } from './followups';

/**
 * The Google Sheet is the single source of truth once configured.
 *
 * localStorage is only a cache so the screens paint instantly on load; this
 * pull replaces it with whatever the sheet currently holds. Rows deleted in
 * the sheet disappear here, rows edited in the sheet appear here, and the
 * only local records that survive are ones whose own write to the sheet
 * failed (see lib/store.js hydrate()).
 *
 * Returns null when the sheet is not configured or unreachable, in which
 * case the cached copy is left alone rather than blanking the screen.
 */
export async function pullFromSheet() {
  const data = await fetchAllFromSheet();
  if (!data) return null;

  leadStore.hydrate((data.leads ?? []).map(toLead));
  callStore.hydrate((data.calls ?? []).map(toCall));
  bookingStore.hydrate((data.bookings ?? []).map(toBooking));
  followupStore.hydrate((data.followups ?? []).map(toFollowup));

  return data;
}

const ALL_STORES = [leadStore, callStore, bookingStore, followupStore];

/**
 * Empties the cached registers on logout so the next person to sign in on
 * this browser (an agent, say) doesn't inherit an admin's data. A store that
 * still has records waiting to reach the sheet is left alone — clearing it
 * would lose real entries.
 */
export function clearLocalRegisters() {
  ALL_STORES.forEach((store) => {
    if (!store.hasUnsynced()) store.reset();
  });
}
