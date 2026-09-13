import { GOOGLE_SCRIPT_URL, isSheetConfigured } from './scriptUrl';
import { getToken } from './auth';

export const TABLES = ['leads', 'calls', 'bookings', 'followups'];

// A post resolves to one of: 'sent' | 'not-configured' | 'failed'.

/**
 * Posts one record to the Apps Script Web App and reads the reply.
 *
 * Apps Script answers a POST with a 302 to googleusercontent, and both hops
 * carry `Access-Control-Allow-Origin: *`. The script's doPost has already run
 * by the time the redirect is issued, and the browser turns the redirected
 * request into a GET, so the body is never sent twice — the JSON reply is a
 * genuine confirmation rather than a guess.
 *
 * text/plain keeps this a CORS-simple request (no preflight) — Apps Script
 * reads e.postData.contents regardless of the declared content type.
 */
export async function postToSheet(table, payload) {
  return (await postRecord(table, payload)).status;
}

/**
 * Like postToSheet, but also returns the record id the script settled on.
 * Only bookings care: send `id: ''` and the script assigns the next RZ#####.
 */
export async function postRecord(table, payload) {
  if (!isSheetConfigured()) return { status: 'not-configured', id: payload.id };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ table, ...payload, token: getToken() }),
      redirect: 'follow',
    });
    if (!response.ok) return { status: 'failed', id: payload.id };

    const data = await response.json().catch(() => null);
    if (!data?.success) return { status: 'failed', id: payload.id };
    return { status: 'sent', id: data.id || payload.id };
  } catch {
    return { status: 'failed', id: payload.id };
  }
}

/**
 * Loads every tab (leads, calls, bookings, follow-ups) in one request.
 *
 * Admin only: the script refuses the read for an Agent token, so an agent's
 * browser never holds anyone else's records.
 *
 * This is what makes the CRM work once deployed anywhere other than this
 * browser: localStorage is per-origin, so a fresh browser or a teammate's
 * machine would otherwise start empty. Returns null when the sheet is not
 * configured or unreachable, so the caller just keeps whatever is cached.
 */
export async function fetchAllFromSheet() {
  if (!isSheetConfigured()) return null;

  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=all&token=${encodeURIComponent(getToken())}`, {
      method: 'GET',
      redirect: 'follow',
    });
    if (!response.ok) return null;

    const data = await response.json();
    if (!data?.success) return null;
    return data;
  } catch {
    return null;
  }
}

/** Reads a plain string out of a raw sheet row, tolerating anything typed by hand. */
export function text(value) {
  return value === null || value === undefined ? '' : String(value).trim();
}

/** Reads a number out of a raw sheet row, stripping currency symbols/commas. */
export function num(value) {
  const parsed = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Keeps a sheet value inside its allowed set, falling back to the default. */
export function oneOf(value, allowed, fallback) {
  const v = text(value);
  return allowed.includes(v) ? v : fallback;
}
