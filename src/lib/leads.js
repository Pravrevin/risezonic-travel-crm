import { createStore, makeId } from './store';
import { text } from './sheetClient';

/** Array-valued fields need comma-join/split when round-tripping through a sheet cell. */
const ARRAY_FIELDS = ['specialRequirements'];

/** A blank record, pre-filled with the values the front office almost always wants. */
export function emptyLead() {
  return {
    name: '', phone: '', altPhone: '', email: '', country: '', state: '',
    preferredLanguage: '', passportAvailable: '',
    destination: '', departureCity: '', travelDateStart: '', travelDateReturn: '',
    flexibleDates: '', adults: '1', children: '0', infants: '0',
    travelType: 'Package', budget: '', hotelCategory: '', mealPreference: '',
    specialRequirements: [],
    source: 'Website', campaignName: '', adGroupKeyword: '', landingPageUrl: '',
    referrerUrl: '', ipAddress: '', deviceType: '',
    utmSource: '', utmMedium: '', utmCampaign: '',
    inquiryType: 'Incoming Call', callStatus: '', callDuration: '',
    callRecordingLink: '', inquiryNotes: '',
    agent: '', assignmentType: 'Manual', priority: 'Medium', leadScore: '',
    status: 'New', stage: 'Cold', expectedConversionDate: '',
    followUpDate: '', followUpTime: '', followUpType: 'Call', reminderSet: 'No', followUpNotes: '',
    date: new Date().toISOString().split('T')[0],
  };
}

export const LEAD_FIELDS = Object.keys(emptyLead());

export const leadStore = createStore({
  storageKey: 'travel_crm_leads',
  dirtyKey: 'travel_crm_leads_unsynced',
  makeId: () => makeId('lead'),
});

/** Sheet row -> Lead, tolerating anything typed by hand into the sheet. */
export function toLead(raw) {
  const base = emptyLead();
  const record = {};

  for (const key of LEAD_FIELDS) {
    if (ARRAY_FIELDS.includes(key)) {
      const joined = text(raw[key]);
      record[key] = joined ? joined.split(',').map((s) => s.trim()).filter(Boolean) : [];
      continue;
    }
    const value = raw[key];
    record[key] = value !== undefined && value !== null && value !== '' ? value : base[key];
  }

  record.id = text(raw.id) || `sheet_${text(raw.phone) || text(raw.name)}`.replace(/\s+/g, '-');
  record.createdAt = text(raw.timestamp) || new Date().toISOString();
  return record;
}
