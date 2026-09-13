// Google Apps Script Web App endpoint backing this CRM's Leads / Calls /
// Bookings / Follow-ups tabs.
//
// SETUP:
// 1. Create a new Google Sheet (drive.google.com > New > Google Sheets).
// 2. Extensions > Apps Script. Delete the default code, paste in the whole
//    contents of google-apps-script.gs from the project root, Save.
// 3. Deploy > New deployment > type "Web app".
//      Execute as:      Me
//      Who has access:  Anyone
//    Deploy, authorise the requested permissions, then copy the /exec URL.
// 4. Paste that URL below, replacing the placeholder.
//
// Until you do, every screen keeps working against localStorage only — saves
// just don't leave this browser. If you ever create a NEW deployment (a new
// URL), change it ONLY here.
export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwuIKRFVa3WUUX7ySFE1i5ny5pXxfwnu_aWeAmAj5oeBM1NvsWZLUDfaD2nIZjBvSs_dA/exec';

/** False until the URL above has been replaced with a real deployment. */
export const isSheetConfigured = () => GOOGLE_SCRIPT_URL.startsWith('https://script.google.com/');
