/**
 * Risezonic Travel CRM <-> Google Sheet
 *
 * Four tabs, all created automatically on first use:
 *   Leads      — one row per lead, upserted on Record ID (column B)
 *   Calls      — one row per logged call, upserted on Record ID
 *   Bookings   — one row per booking, upserted on Booking ID (the RZ##### id)
 *   Followups  — one row per follow-up, upserted on Record ID
 *
 * SETUP
 * 1. Create a new Google Sheet (drive.google.com > New > Google Sheets).
 * 2. Extensions > Apps Script. Select all existing code (Ctrl+A), delete it,
 *    paste THIS whole file, Save.
 * 3. Deploy > New deployment > type "Web app"
 *      Execute as:      Me
 *      Who has access:  Anyone
 *    Deploy, authorise, then copy the /exec URL.
 * 4. Paste that URL into src/lib/scriptUrl.js as GOOGLE_SCRIPT_URL.
 *
 * If you ever create a NEW deployment (a new URL), the URL changes — update
 * scriptUrl.js again. Redeploying an existing deployment ("Manage deployments"
 * > edit > new version) keeps the same URL.
 *
 * ENDPOINTS
 *   GET  ?action=all        -> { leads, calls, bookings, followups }
 *   GET  ?action=leads      -> { leads }
 *   GET  ?action=calls      -> { calls }
 *   GET  ?action=bookings   -> { bookings }
 *   GET  ?action=followups  -> { followups }
 *   POST { table:'leads'|'calls'|'bookings'|'followups', ... }  -> upsert a row
 *   POST { table:..., action:'delete', id:... }                -> delete a row (manual cleanup only, no UI for it yet)
 */

// Every table's field list is column-position-aligned with its headers list.
// Column A is always a server-stamped Timestamp; column B is always the
// record's own id, which is what upserts match on (see ID_COLUMN below).
var TABLES = {
  leads: {
    sheetName: 'Leads',
    // "+91 98765 43210" gets read as the start of a formula and shows
    // #ERROR! unless forced to literal text — see buildRow().
    textFields: ['phone', 'altPhone'],
    fields: [
      'timestamp', 'id', 'name', 'phone', 'altPhone', 'email', 'country', 'state',
      'preferredLanguage', 'passportAvailable', 'destination', 'departureCity',
      'travelDateStart', 'travelDateReturn', 'flexibleDates', 'adults', 'children', 'infants',
      'travelType', 'budget', 'hotelCategory', 'mealPreference', 'specialRequirements',
      'source', 'campaignName', 'adGroupKeyword', 'landingPageUrl', 'referrerUrl', 'ipAddress',
      'deviceType', 'utmSource', 'utmMedium', 'utmCampaign', 'inquiryType', 'callStatus',
      'callDuration', 'callRecordingLink', 'inquiryNotes', 'agent', 'assignmentType', 'priority',
      'leadScore', 'status', 'stage', 'expectedConversionDate', 'followUpDate', 'followUpTime',
      'followUpType', 'reminderSet', 'followUpNotes', 'date',
    ],
    headers: [
      'Timestamp', 'Record ID', 'Name', 'Phone', 'Alt Phone', 'Email', 'Country', 'State',
      'Preferred Language', 'Passport Available', 'Destination', 'Departure City',
      'Travel Start Date', 'Travel Return Date', 'Flexible Dates', 'Adults', 'Children', 'Infants',
      'Travel Type', 'Budget', 'Hotel Category', 'Meal Preference', 'Special Requirements',
      'Source', 'Campaign Name', 'Ad Group / Keyword', 'Landing Page URL', 'Referrer URL',
      'IP Address', 'Device Type', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Inquiry Type',
      'Call Status', 'Call Duration', 'Call Recording Link', 'Inquiry Notes', 'Agent',
      'Assignment Type', 'Priority', 'Lead Score', 'Status', 'Stage', 'Expected Conversion Date',
      'Follow-up Date', 'Follow-up Time', 'Follow-up Type', 'Reminder Set', 'Follow-up Notes', 'Date',
    ],
  },
  calls: {
    sheetName: 'Calls',
    textFields: ['phone'],
    fields: ['timestamp', 'id', 'caller', 'phone', 'disposition', 'bookingId', 'agent', 'time', 'remarks'],
    headers: ['Timestamp', 'Record ID', 'Caller', 'Phone', 'Disposition', 'Booking ID', 'Agent', 'Time', 'Remarks'],
  },
  bookings: {
    sheetName: 'Bookings',
    // Also covers ticket numbers / zip codes / card-last-4 — long numeric
    // strings that would otherwise get auto-converted to Number and lose
    // leading zeros.
    textFields: ['callingPhone', 'billingPhone', 'billingZip', 'cardLast4', 'ticketNumber'],
    fields: [
      'timestamp', 'id', 'firstName', 'middleName', 'lastName', 'dob', 'email', 'callingPhone',
      'billingPhone', 'billingAddress', 'billingState', 'billingZip', 'billingCountry', 'pnr',
      'airlineCode', 'airlineName', 'flightNumber', 'fromCity', 'toCity', 'travelDate',
      'departureTime', 'paxAdults', 'paxChildren', 'paxInfants', 'paxSeniors', 'cardLast4',
      'cardExp', 'reasonOfCharge', 'ticketNumber', 'baseFare', 'agencyFee', 'merchantFee',
      'grandTotal', 'remarks', 'disposition', 'agent',
    ],
    headers: [
      'Timestamp', 'Booking ID', 'First Name', 'Middle Name', 'Last Name', 'DOB', 'Email',
      'Calling Phone', 'Billing Phone', 'Billing Address', 'Billing State', 'Billing Zip',
      'Billing Country', 'Airline PNR', 'Airline Code', 'Airline Name', 'Flight Number',
      'From City', 'To City', 'Travel Date', 'Departure Time', 'Pax Adults', 'Pax Children',
      'Pax Infants', 'Pax Seniors', 'Card Last 4', 'Card Exp', 'Reason Of Charge', 'Ticket Number',
      'Base Fare', 'Agency Fee', 'Merchant Fee', 'Grand Total', 'Remarks', 'Disposition', 'Agent',
    ],
  },
  followups: {
    sheetName: 'Followups',
    textFields: ['phone'],
    fields: ['timestamp', 'id', 'lead', 'phone', 'destination', 'due', 'priority', 'agent', 'notes', 'status'],
    headers: ['Timestamp', 'Record ID', 'Lead Name', 'Phone', 'Destination', 'Due', 'Priority', 'Agent', 'Notes', 'Status'],
  },
};

// Column B ("id") is the upsert key on every table.
var ID_COLUMN = 2;

/* --------------------------------------------------------------------- AUTH */

// Users are deliberately NOT in TABLES: they never go through the generic
// upsert/read paths, so a password hash or token can't leak via ?action=all.
var USERS = {
  sheetName: 'Users',
  textFields: [],
  fields: ['timestamp', 'id', 'name', 'email', 'passwordHash', 'role', 'status', 'token', 'createdBy'],
  headers: ['Timestamp', 'Record ID', 'Name', 'Email', 'Password Hash', 'Role', 'Status', 'Session Token', 'Created By'],
};
var ROLES = ['Admin', 'Agent'];
var DEFAULT_ADMIN = { name: 'Admin', email: 'admin@risezonic.com', password: 'admin123' };
// Mixed into every password hash. Changing it invalidates all stored passwords.
var PASSWORD_SALT = 'risezonic-crm-v1';

function hashPassword(password) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, PASSWORD_SALT + ':' + String(password), Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
}

function normaliseEmail(email) {
  return String(email || '').trim().toLowerCase();
}

/** What the client is allowed to know about a user — never the hash or token. */
function publicUser(u) {
  var initials = String(u.name || '').split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
  return { id: u.id, name: u.name, email: u.email, role: u.role, status: u.status, updatedAt: u.timestamp, avatar: initials || 'U' };
}

function readUsers() {
  return readSheet(getOrCreateSheet(USERS), USERS.fields);
}

function findUser(predicate) {
  var users = readUsers();
  for (var i = 0; i < users.length; i++) if (predicate(users[i])) return users[i];
  return null;
}

/** Resolves a session token to an Active user, or null. */
function userFromToken(token) {
  if (!token) return null;
  var u = findUser(function (x) { return x.token === token; });
  return u && u.status === 'Active' ? u : null;
}

function isAdmin(u) {
  return !!u && u.role === 'Admin';
}

function writeUser(record) {
  var sheet = getOrCreateSheet(USERS);
  var row = buildRow(USERS, record);
  var existingRow = record.id ? findRowByKey(sheet, ID_COLUMN, record.id) : -1;
  if (existingRow > 0) sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
  else sheet.appendRow(row);
}

/** Seeds DEFAULT_ADMIN when the Users tab is empty so a fresh sheet is usable. */
function ensureAdminExists() {
  if (readUsers().length > 0) return;
  writeUser({
    id: 'user_' + Utilities.getUuid().slice(0, 8),
    name: DEFAULT_ADMIN.name,
    email: DEFAULT_ADMIN.email,
    passwordHash: hashPassword(DEFAULT_ADMIN.password),
    role: 'Admin',
    status: 'Active',
    token: '',
    createdBy: 'system',
  });
}

function login(data) {
  ensureAdminExists();
  var email = normaliseEmail(data.email);
  var u = findUser(function (x) { return normaliseEmail(x.email) === email; });
  if (!u || u.passwordHash !== hashPassword(data.password || '')) {
    return jsonResponse({ success: false, message: 'Invalid email or password.' });
  }
  if (u.status !== 'Active') return jsonResponse({ success: false, message: 'This login has been disabled. Contact your admin.' });

  // One live session per user — a fresh login signs out any other device.
  u.token = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, '');
  writeUser(u);
  return jsonResponse({ success: true, user: publicUser(u), token: u.token });
}

function manageUsers(data, actor) {
  if (!isAdmin(actor)) return jsonResponse({ success: false, message: 'Admin access required.' });

  if (data.action === 'create') {
    var name = String(data.name || '').trim();
    var email = normaliseEmail(data.email);
    var password = String(data.password || '');
    var role = ROLES.indexOf(data.role) > -1 ? data.role : 'Agent';
    if (!name || !email || !password) return jsonResponse({ success: false, message: 'Name, email and password are required.' });
    if (password.length < 6) return jsonResponse({ success: false, message: 'Password must be at least 6 characters.' });
    if (findUser(function (x) { return normaliseEmail(x.email) === email; })) {
      return jsonResponse({ success: false, message: 'A login with that email already exists.' });
    }
    var created = {
      id: 'user_' + Utilities.getUuid().slice(0, 8),
      name: name, email: email, passwordHash: hashPassword(password),
      role: role, status: 'Active', token: '', createdBy: actor.email,
    };
    writeUser(created);
    return jsonResponse({ success: true, message: 'Login created.', user: publicUser(created) });
  }

  var target = findUser(function (x) { return x.id === data.id; });
  if (!target) return jsonResponse({ success: false, message: 'No user with id ' + data.id });

  if (data.action === 'update') {
    if (data.name) target.name = String(data.name).trim();
    if (data.role && ROLES.indexOf(data.role) > -1) target.role = data.role;
    if (data.status === 'Active' || data.status === 'Disabled') target.status = data.status;
    if (data.password) {
      if (String(data.password).length < 6) return jsonResponse({ success: false, message: 'Password must be at least 6 characters.' });
      target.passwordHash = hashPassword(data.password);
      if (target.id !== actor.id) target.token = ''; // force re-login elsewhere
    }
    // Never let the last admin lock everyone out.
    if (target.id === actor.id && (target.role !== 'Admin' || target.status !== 'Active')) {
      return jsonResponse({ success: false, message: 'You cannot demote or disable your own admin login.' });
    }
    if (target.status === 'Disabled') target.token = '';
    writeUser(target);
    return jsonResponse({ success: true, message: 'Login updated.', user: publicUser(target) });
  }

  if (data.action === 'delete') {
    if (target.id === actor.id) return jsonResponse({ success: false, message: 'You cannot delete your own login.' });
    var sheet = getOrCreateSheet(USERS);
    var rowIndex = findRowByKey(sheet, ID_COLUMN, target.id);
    if (rowIndex > 0) sheet.deleteRow(rowIndex);
    return jsonResponse({ success: true, message: 'Login deleted.' });
  }

  return jsonResponse({ success: false, message: 'Unknown users action: ' + data.action });
}

/* --------------------------------------------------------------------- POST */

function doPost(e) {
  // Serialise concurrent submissions so two saves cannot land on the same row.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return jsonResponse({ success: false, message: 'Sheet is busy, please retry.' });
  }

  try {
    var data = JSON.parse(e.postData.contents);
    if (data.action === 'login') return login(data);

    var actor = userFromToken(data.token);
    if (!actor) return jsonResponse({ success: false, unauthorized: true, message: 'Please sign in again.' });
    if (data.table === 'users') return manageUsers(data, actor);

    var table = TABLES[data.table];
    if (!table) return jsonResponse({ success: false, message: 'Unknown table: ' + data.table });
    if (data.action === 'delete') {
      if (!isAdmin(actor)) return jsonResponse({ success: false, message: 'Admin access required.' });
      return deleteRow(table, data.id);
    }
    // Agents can only ever file entries under their own name.
    if (!isAdmin(actor) && table.fields.indexOf('agent') > -1) data.agent = actor.name;
    return upsertRow(table, data);
  } catch (err) {
    return jsonResponse({ success: false, message: 'Server error: ' + err });
  } finally {
    lock.releaseLock();
  }
}

/** Not used by the app UI yet — a manual escape hatch for removing a bad/test row: POST { table, action:'delete', id }. */
function deleteRow(table, id) {
  var sheet = getOrCreateSheet(table);
  var existingRow = id ? findRowByKey(sheet, ID_COLUMN, id) : -1;
  if (existingRow < 1) return jsonResponse({ success: false, message: 'No matching row for id ' + id });

  sheet.deleteRow(existingRow);
  return jsonResponse({ success: true, message: table.sheetName + ' row deleted.' });
}

/** Matched on `d.id`: an existing row is rewritten, an unknown id is appended. */
function upsertRow(table, d) {
  var sheet = getOrCreateSheet(table);

  // Booking ids are sequential and read out to customers, so they are handed
  // out here under the lock — never guessed from whatever one browser has
  // cached (an agent's cache is empty, so it would always guess RZ10001).
  if (table === TABLES.bookings && !d.id) d.id = nextBookingId(sheet);

  var row = buildRow(table, d);
  var existingRow = d.id ? findRowByKey(sheet, ID_COLUMN, d.id) : -1;

  if (existingRow > 0) {
    sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
    return jsonResponse({ success: true, message: table.sheetName + ' updated.', row: existingRow, id: d.id });
  }

  sheet.appendRow(row);
  return jsonResponse({ success: true, message: table.sheetName + ' saved.', row: sheet.getLastRow(), id: d.id });
}

/** Next RZ##### id: one past the highest already in the Bookings tab (starts at RZ10001). */
function nextBookingId(sheet) {
  var highest = 10000;
  var lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    var ids = sheet.getRange(2, ID_COLUMN, lastRow - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      var n = Number(String(ids[i][0]).replace(/^RZ/i, ''));
      if (isFinite(n) && n > highest) highest = n;
    }
  }
  return 'RZ' + (highest + 1);
}

/**
 * Builds one row in field order. Column A (timestamp) always gets the write
 * time, not whatever the client sent.
 *
 * A value starting with +, -, =, or @ makes Sheets try to parse it as a
 * formula — "+1 555 1234" becomes #ERROR! — and setNumberFormat('@') on the
 * column does NOT prevent that for appendRow()/setValues() (only a genuine
 * pre-typed cell in the UI is protected that way). A leading apostrophe is
 * the actual fix: it forces literal text and is stripped from the stored
 * value, so it never shows up when reading the cell back. table.textFields
 * (phone numbers, ticket numbers, zip, card-last-4) get it unconditionally,
 * since a purely numeric string in those columns would otherwise also risk
 * losing leading zeros to Sheets' auto-number conversion.
 */
function buildRow(table, d) {
  var textFields = table.textFields || [];
  return table.fields.map(function (field) {
    if (field === 'timestamp') return new Date();

    var value = d[field];
    if (Array.isArray(value)) value = value.join(', ');
    if (value === undefined || value === null || value === '') return '';

    var str = String(value);
    var mustForceText = textFields.indexOf(field) > -1 || /^[+\-=@]/.test(str);
    return mustForceText ? "'" + str : value;
  });
}

/* ---------------------------------------------------------------------- GET */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || '';
  var token = (e && e.parameter && e.parameter.token) || '';

  if (action === 'me') {
    var me = userFromToken(token);
    if (!me) return jsonResponse({ success: false, unauthorized: true, message: 'Session expired.' });
    return jsonResponse({ success: true, user: publicUser(me) });
  }

  if (action === 'users') {
    if (!isAdmin(userFromToken(token))) return jsonResponse({ success: false, unauthorized: true, message: 'Admin access required.' });
    return jsonResponse({ success: true, users: readUsers().map(publicUser) });
  }

  // Everything below reads the register — Admin only. Agents file entries
  // through doPost but never get the data back.
  if ((action === 'all' || TABLES[action]) && !isAdmin(userFromToken(token))) {
    return jsonResponse({ success: false, unauthorized: true, message: 'Admin access required.' });
  }

  if (action === 'all') {
    var out = { success: true };
    for (var key in TABLES) out[key] = readSheet(getOrCreateSheet(TABLES[key]), TABLES[key].fields);
    return jsonResponse(out);
  }

  if (TABLES[action]) {
    var res = { success: true };
    res[action] = readSheet(getOrCreateSheet(TABLES[action]), TABLES[action].fields);
    return jsonResponse(res);
  }

  // Open the /exec URL in a browser to confirm a deployment is live and which
  // tables it knows about.
  return jsonResponse({
    success: true,
    message: 'Risezonic Travel CRM endpoint is running.',
    tables: Object.keys(TABLES),
  });
}

/** Rows 2..n as objects keyed by `fields`, so column order never leaks out. */
function readSheet(sheet, fields) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var values = sheet.getRange(2, 1, lastRow - 1, fields.length).getValues();
  var tz = Session.getScriptTimeZone();
  var out = [];

  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var record = {};
    var blank = true;

    for (var c = 0; c < fields.length; c++) {
      var key = fields[c];
      var value = row[c];

      // Format dates in the sheet's own timezone. Letting JSON serialise a
      // Date would emit UTC, which shifts local dates back by a day.
      if (value instanceof Date) {
        value = Utilities.formatDate(value, tz, "yyyy-MM-dd'T'HH:mm:ss");
      }

      if (value !== null && value !== undefined && String(value) !== '') blank = false;
      record[key] = value === null || value === undefined ? '' : value;
    }

    if (!blank) out.push(record);
  }

  return out;
}

/* ------------------------------------------------------------------- sheets */

/** Returns the tab, creating it with a frozen bold header row on first use. */
function getOrCreateSheet(table) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(table.sheetName);

  if (!sheet) sheet = ss.insertSheet(table.sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(table.headers);
    var header = sheet.getRange(1, 1, 1, table.headers.length);
    header.setFontWeight('bold');
    header.setBackground('#f5f5f4');
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(2);
  }

  return sheet;
}

/** Row number whose `column` matches `key`, or -1. */
function findRowByKey(sheet, column, key) {
  if (!key) return -1;

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var keys = sheet.getRange(2, column, lastRow - 1, 1).getValues();
  for (var i = 0; i < keys.length; i++) {
    if (String(keys[i][0]) === String(key)) return i + 2;
  }
  return -1;
}

/* -------------------------------------------------------------------- utils */

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
