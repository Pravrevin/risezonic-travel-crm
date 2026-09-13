// Mock PNR retrieval. Swap the body of fetchPnrDetails() with a real GDS call
// (Sabre / Amadeus / Travelport PNR-retrieve endpoint) when one is available —
// everything downstream (the booking form auto-fill) already expects this exact shape.

const AIRLINES = [
  { code: 'AA', name: 'American Airlines' },
  { code: 'DL', name: 'Delta Air Lines' },
  { code: 'UA', name: 'United Airlines' },
  { code: 'EK', name: 'Emirates' },
  { code: '6E', name: 'IndiGo' },
  { code: 'BA', name: 'British Airways' },
  { code: 'AF', name: 'Air France' },
  { code: 'QR', name: 'Qatar Airways' },
  { code: 'SQ', name: 'Singapore Airlines' },
  { code: 'LH', name: 'Lufthansa' },
];

const CITIES = ['JFK', 'LAX', 'ORD', 'DXB', 'LHR', 'DEL', 'BOM', 'CDG', 'DOH', 'SFO', 'MIA', 'ATL', 'SIN', 'FRA'];

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function fetchPnrDetails(pnr) {
  const clean = (pnr || '').trim().toUpperCase();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (clean.length < 5 || clean.length > 8) {
        reject(new Error('Enter a valid 5–8 character PNR / record locator'));
        return;
      }
      const h = hashCode(clean);
      const airline = AIRLINES[h % AIRLINES.length];
      const from = CITIES[h % CITIES.length];
      let to = CITIES[(h + 5) % CITIES.length];
      if (to === from) to = CITIES[(h + 6) % CITIES.length];
      const daysOut = 3 + (h % 30);
      const travelDate = new Date(Date.now() + daysOut * 86400000).toISOString().split('T')[0];
      const hour = String(6 + (h % 14)).padStart(2, '0');

      resolve({
        airlineCode: airline.code,
        airlineName: airline.name,
        flightNumber: `${airline.code}${100 + (h % 900)}`,
        fromCity: from,
        toCity: to,
        travelDate,
        departureTime: `${hour}:00`,
      });
    }, 850);
  });
}
