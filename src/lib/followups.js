import { createStore, makeId } from './store';
import { text } from './sheetClient';

export const followupStore = createStore({
  storageKey: 'travel_crm_followups',
  dirtyKey: 'travel_crm_followups_unsynced',
  makeId: () => makeId('fu'),
});

export const FOLLOWUP_FIELDS = ['id', 'lead', 'phone', 'destination', 'due', 'priority', 'agent', 'notes', 'status'];

/** Sheet row -> follow-up, tolerating anything typed by hand into the sheet. */
export function toFollowup(raw) {
  const record = {};
  for (const key of FOLLOWUP_FIELDS) record[key] = text(raw[key]);
  record.id = record.id || `sheet_${text(raw.phone) || text(raw.lead)}`.replace(/\s+/g, '-');
  record.status = record.status || 'Pending';
  record.priority = record.priority || 'Normal';
  record.createdAt = text(raw.timestamp) || new Date().toISOString();
  return record;
}
