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
