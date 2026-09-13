import { createStore, makeId } from './store';
import { text } from './sheetClient';

export const callStore = createStore({
  storageKey: 'travel_crm_calls',
  dirtyKey: 'travel_crm_calls_unsynced',
  makeId: () => makeId('call'),
});

/** Sheet row -> call log entry, tolerating anything typed by hand into the sheet. */
export function toCall(raw) {
  return {
    id: text(raw.id) || `sheet_${text(raw.phone)}_${text(raw.timestamp)}`.replace(/\s+/g, '-'),
    caller: text(raw.caller) || 'Unknown',
    phone: text(raw.phone),
    disposition: text(raw.disposition),
    bookingId: text(raw.bookingId) || null,
    agent: text(raw.agent),
    time: text(raw.time),
    remarks: text(raw.remarks),
    createdAt: text(raw.timestamp) || new Date().toISOString(),
  };
}
