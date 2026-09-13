// Pure aggregation helpers that turn the raw Leads/Calls/Bookings/Follow-ups
// stores into the numbers the Dashboard displays. No fabricated figures —
// every value here is derived from what's actually in the stores.

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isToday(value) {
  const d = parseDate(value);
  return !!d && d.toDateString() === new Date().toDateString();
}

export function isThisMonth(value) {
  const d = parseDate(value);
  if (!d) return false;
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export function withinLastDays(value, days) {
  const d = parseDate(value);
  return !!d && d >= daysAgo(days - 1);
}

export function relativeTime(value) {
  const d = parseDate(value);
  if (!d) return '';
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/** Highest-count key in `rows` grouped by `keyFn`, or null if nothing qualifies. */
export function topByCount(rows, keyFn) {
  const counts = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  let best = null;
  for (const [key, count] of counts) {
    if (!best || count > best.count) best = { key, count };
  }
  return best;
}

/** Agent with the highest booked revenue, with their booking count alongside it. */
export function topAgentByRevenue(bookings) {
  const totals = new Map();
  for (const b of bookings) {
    if (!b.agent) continue;
    const cur = totals.get(b.agent) || { count: 0, revenue: 0 };
    cur.count += 1;
    cur.revenue += parseFloat(b.grandTotal) || 0;
    totals.set(b.agent, cur);
  }
  let best = null;
  for (const [agent, v] of totals) {
    if (!best || v.revenue > best.value.revenue) best = { key: agent, value: v };
  }
  return best;
}

/** Per-day lead volume and booked-conversion % for the last `days` days (default 14). */
export function dailyConversionSeries(leads, days = 14) {
  const series = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = daysAgo(i);
    const dayLeads = leads.filter((l) => {
      const d = parseDate(l.date || l.createdAt);
      return d && d.toDateString() === day.toDateString();
    });
    const booked = dayLeads.filter((l) => l.status === 'Booked').length;
    series.push({
      label: day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      total: dayLeads.length,
      pct: dayLeads.length ? Math.round((booked / dayLeads.length) * 100) : 0,
    });
  }
  return series;
}
