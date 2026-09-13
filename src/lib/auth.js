// Login + user-management calls against the Apps Script backend.
//
// Sessions are a token the script hands out on login and checks on every
// later request (see sheetClient.js). The token lives in localStorage under
// TOKEN_KEY; the user profile next to it is only a cache for instant paint —
// the script is the authority on role and status.
import { GOOGLE_SCRIPT_URL, isSheetConfigured } from './scriptUrl';

export const TOKEN_KEY = 'travel_crm_token';
export const USER_KEY = 'travel_crm_user';

export const ROLES = ['Admin', 'Agent'];

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

async function post(body) {
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function get(params) {
  const qs = new URLSearchParams(params).toString();
  const response = await fetch(`${GOOGLE_SCRIPT_URL}?${qs}`, { method: 'GET', redirect: 'follow' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/** { success, user, token } or { success:false, message }. */
export async function loginRequest(email, password) {
  if (!isSheetConfigured()) return { success: false, message: 'Backend not configured.' };
  try {
    const result = await post({ action: 'login', email, password });
    // The pre-auth script answered "Unknown table: undefined" to everything it
    // didn't recognise — the deployment hasn't been updated yet.
    if (!result.success && /Unknown table/.test(result.message || '')) {
      return { success: false, message: 'The Google Apps Script is out of date — redeploy google-apps-script.gs (Manage deployments > Edit > New version).' };
    }
    return result;
  } catch {
    return { success: false, message: 'Could not reach the server. Check your connection and try again.' };
  }
}

/** Re-validates a stored token. Resolves to the user, or null when the session is dead. */
export async function fetchMe() {
  const token = getToken();
  if (!isSheetConfigured() || !token) return null;
  try {
    const data = await get({ action: 'me', token });
    return data?.success ? data.user : null;
  } catch {
    // Network blip — keep the cached session rather than kicking the user out.
    return undefined;
  }
}

export async function listUsers() {
  try {
    const data = await get({ action: 'users', token: getToken() });
    return data?.success ? data.users : [];
  } catch {
    return [];
  }
}

export async function createUser({ name, email, password, role }) {
  try {
    return await post({ table: 'users', action: 'create', token: getToken(), name, email, password, role });
  } catch {
    return { success: false, message: 'Could not reach the server.' };
  }
}

export async function updateUser(id, patch) {
  try {
    return await post({ table: 'users', action: 'update', token: getToken(), id, ...patch });
  } catch {
    return { success: false, message: 'Could not reach the server.' };
  }
}

export async function deleteUser(id) {
  try {
    return await post({ table: 'users', action: 'delete', token: getToken(), id });
  } catch {
    return { success: false, message: 'Could not reach the server.' };
  }
}
