import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const countryStates = {
  'India': ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh'],
  'UAE': ['Abu Dhabi','Dubai','Sharjah','Ajman','Umm Al Quwain','Ras Al Khaimah','Fujairah'],
  'USA': ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'],
  'UK': ['England','Scotland','Wales','Northern Ireland'],
  'Australia': ['New South Wales','Victoria','Queensland','Western Australia','South Australia','Tasmania','ACT','Northern Territory'],
  'Canada': ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland & Labrador','Nova Scotia','Ontario','Prince Edward Island','Quebec','Saskatchewan'],
  'Saudi Arabia': ['Riyadh','Mecca','Medina','Eastern Province','Asir','Tabuk','Hail','Northern Borders','Jazan','Najran','Al Bahah','Al Jawf','Qassim'],
  'Pakistan': ['Punjab','Sindh','Khyber Pakhtunkhwa','Balochistan','Gilgit-Baltistan','Azad Kashmir','Islamabad Capital Territory'],
  'Bangladesh': ['Dhaka','Chittagong','Rajshahi','Khulna','Barisal','Sylhet','Rangpur','Mymensingh'],
  'Singapore': ['Central Region','East Region','North Region','North-East Region','West Region'],
  'Malaysia': ['Johor','Kedah','Kelantan','Malacca','Negeri Sembilan','Pahang','Perak','Perlis','Penang','Sabah','Sarawak','Selangor','Terengganu','Kuala Lumpur','Labuan','Putrajaya'],
  'Thailand': ['Bangkok','Chiang Mai','Phuket','Pattaya','Koh Samui','Krabi','Chiang Rai','Ayutthaya','Hua Hin','Kanchanaburi'],
  'Germany': ['Baden-Württemberg','Bavaria','Berlin','Brandenburg','Bremen','Hamburg','Hesse','Lower Saxony','Mecklenburg-Vorpommern','North Rhine-Westphalia','Rhineland-Palatinate','Saarland','Saxony','Saxony-Anhalt','Schleswig-Holstein','Thuringia'],
  'France': ['Île-de-France','Provence-Alpes','Normandy','Brittany','Occitanie','Nouvelle-Aquitaine','Auvergne-Rhône-Alpes','Hauts-de-France','Grand Est','Pays de la Loire','Centre-Val de Loire','Bourgogne-Franche-Comté'],
  'Italy': ['Lombardy','Lazio','Campania','Sicily','Veneto','Emilia-Romagna','Piedmont','Apulia','Tuscany','Calabria','Sardinia','Liguria'],
  'Other': [],
};

const countries = Object.keys(countryStates);

const initialLeads = [
  { id: 1, name: 'Raj Kumar', phone: '+91 98765 43210', email: 'raj@gmail.com', destination: 'Dubai Package', source: 'Google Ads', status: 'Hot Lead', stage: 'Hot', agent: 'Sarah J.', date: '2026-03-27', budget: '$2,500', travelType: 'Package', inquiryType: 'Incoming Call', priority: 'High' },
  { id: 2, name: 'Priya Singh', phone: '+91 87654 32109', email: 'priya@gmail.com', destination: 'Maldives 5N', source: 'Facebook', status: 'Follow-up', stage: 'Warm', agent: 'Mike R.', date: '2026-03-27', budget: '$3,800', travelType: 'Package', inquiryType: 'Form', priority: 'High' },
  { id: 3, name: 'John Davis', phone: '+1 555 0134', email: 'john@email.com', destination: 'Europe Tour', source: 'Website', status: 'Booked', stage: 'Hot', agent: 'Sarah J.', date: '2026-03-26', budget: '$5,200', travelType: 'Package', inquiryType: 'Form', priority: 'Medium' },
  { id: 4, name: 'Aisha Khan', phone: '+91 76543 21098', email: 'aisha@gmail.com', destination: 'Singapore', source: 'Referral', status: 'New', stage: 'Cold', agent: 'Tom K.', date: '2026-03-26', budget: '$1,800', travelType: 'Flight', inquiryType: 'WhatsApp', priority: 'Medium' },
  { id: 5, name: 'Mike Thompson', phone: '+1 555 0198', email: 'mike@email.com', destination: 'Thailand 7N', source: 'Google Ads', status: 'Cold', stage: 'Cold', agent: 'Mike R.', date: '2026-03-25', budget: '$2,100', travelType: 'Package', inquiryType: 'Incoming Call', priority: 'Low' },
  { id: 6, name: 'Fatima Ali', phone: '+971 50 123 4567', email: 'fatima@email.com', destination: 'Bali Trip', source: 'Instagram', status: 'Hot Lead', stage: 'Hot', agent: 'Sarah J.', date: '2026-03-25', budget: '$2,900', travelType: 'Package', inquiryType: 'WhatsApp', priority: 'High' },
  { id: 7, name: 'David Lee', phone: '+1 555 0267', email: 'david@email.com', destination: 'Japan 10D', source: 'Website', status: 'New', stage: 'Warm', agent: 'Tom K.', date: '2026-03-24', budget: '$4,600', travelType: 'Package', inquiryType: 'Form', priority: 'Medium' },
];

const emptyLead = {
  // Section 1 – Basic Info
  name: '', phone: '', altPhone: '', email: '', country: '', state: '',
  preferredLanguage: '', passportAvailable: '',
  // Section 2 – Travel Requirements
  destination: '', departureCity: '', travelDateStart: '', travelDateReturn: '',
  flexibleDates: '', adults: '1', children: '0', infants: '0',
  travelType: 'Package', budget: '', hotelCategory: '', mealPreference: '',
  specialRequirements: [],
  // Section 3 – Lead Source
  source: 'Website', campaignName: '', adGroupKeyword: '', landingPageUrl: '',
  referrerUrl: '', ipAddress: '', deviceType: '',
  utmSource: '', utmMedium: '', utmCampaign: '',
  // Section 4 – Call & Inquiry
  inquiryType: 'Incoming Call', callStatus: '', callDuration: '',
  callRecordingLink: '', inquiryNotes: '',
  // Section 5 – Lead Assignment
  agent: '', assignmentType: 'Manual', priority: 'Medium', leadScore: '',
  // Section 6 – Status & Pipeline
  status: 'New', stage: 'Cold', expectedConversionDate: '',
  // Section 7 – Follow-up
  followUpDate: '', followUpTime: '', followUpType: 'Call', reminderSet: 'No', followUpNotes: '',
};

const statusColors = {
  'Hot Lead': 'bg-red-100 text-red-700',
  'New': 'bg-blue-100 text-blue-700',
  'Follow-up': 'bg-yellow-100 text-yellow-700',
  'Booked': 'bg-green-100 text-green-700',
  'Cold': 'bg-gray-100 text-gray-600',
  'Contacted': 'bg-purple-100 text-purple-700',
  'Interested': 'bg-orange-100 text-orange-700',
  'Quote Sent': 'bg-teal-100 text-teal-700',
  'Lost': 'bg-red-100 text-red-500',
};

const sourceColors = {
  'Google Ads': 'bg-blue-50 text-blue-600',
  'Facebook': 'bg-indigo-50 text-indigo-600',
  'Website': 'bg-teal-50 text-teal-600',
  'Referral': 'bg-purple-50 text-purple-600',
  'Instagram': 'bg-pink-50 text-pink-600',
  'WhatsApp': 'bg-green-50 text-green-600',
  'Direct Call': 'bg-orange-50 text-orange-600',
};

const priorityColors = {
  'High': 'bg-red-50 text-red-600',
  'Medium': 'bg-yellow-50 text-yellow-600',
  'Low': 'bg-gray-50 text-gray-500',
};

const SectionHeader = ({ number, title, subtitle, color = 'primary' }) => (
  <div className={`flex items-center gap-3 pb-3 mb-4 border-b-2 ${color === 'primary' ? 'border-primary-100' : color === 'teal' ? 'border-teal-100' : color === 'purple' ? 'border-purple-100' : color === 'orange' ? 'border-orange-100' : color === 'green' ? 'border-green-100' : color === 'indigo' ? 'border-indigo-100' : 'border-gray-100'}`}>
    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white ${color === 'primary' ? 'bg-primary-600' : color === 'teal' ? 'bg-teal-600' : color === 'purple' ? 'bg-purple-600' : color === 'orange' ? 'bg-orange-500' : color === 'green' ? 'bg-green-600' : color === 'indigo' ? 'bg-indigo-600' : 'bg-gray-500'}`}>{number}</div>
    <div>
      <div className="font-bold text-gray-800 text-sm leading-tight">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  </div>
);

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

export default function Leads() {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [newLead, setNewLead] = useState(emptyLead);

  const set = (key, val) => setNewLead(p => ({ ...p, [key]: val }));
  const toggleSpecial = (val) => setNewLead(p => ({
    ...p,
    specialRequirements: p.specialRequirements.includes(val)
      ? p.specialRequirements.filter(x => x !== val)
      : [...p.specialRequirements, val],
  }));

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.destination.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const addLead = () => {
    if (!newLead.name || !newLead.phone) return;
    setLeads(prev => [{
      ...newLead,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
    }, ...prev]);
    setNewLead(emptyLead);
    setShowAdd(false);
  };

  const inp = 'input-field text-sm py-2';
  const sel = 'input-field text-sm py-2';

  return (
    <DashboardLayout title="Leads" subtitle="Manage and track all incoming leads">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total', value: leads.length, color: 'text-gray-800', bg: 'bg-gray-50' },
          { label: 'Hot Leads', value: leads.filter(l => l.status === 'Hot Lead').length, color: 'text-red-700', bg: 'bg-red-50' },
          { label: 'New', value: leads.filter(l => l.status === 'New').length, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Follow-ups', value: leads.filter(l => l.status === 'Follow-up').length, color: 'text-yellow-700', bg: 'bg-yellow-50' },
          { label: 'Booked', value: leads.filter(l => l.status === 'Booked').length, color: 'text-green-700', bg: 'bg-green-50' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl p-4 text-center`}>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-1 min-w-48">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input className="bg-transparent outline-none text-sm text-gray-700 w-full placeholder-gray-400" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field w-auto py-2 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {['All', 'Hot Lead', 'New', 'Contacted', 'Interested', 'Follow-up', 'Quote Sent', 'Booked', 'Lost', 'Cold'].map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => setShowAdd(true)} className="btn-primary py-2 text-sm flex items-center gap-2">
          <span>+</span> Add Lead
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header text-left">Lead</th>
                <th className="table-header text-left">Destination</th>
                <th className="table-header text-left">Source</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-left">Stage</th>
                <th className="table-header text-left">Priority</th>
                <th className="table-header text-left">Agent</th>
                <th className="table-header text-left">Budget</th>
                <th className="table-header text-left">Date</th>
                <th className="table-header text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-500 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{lead.name}</div>
                        <div className="text-xs text-gray-400">{lead.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell font-medium text-gray-700">{lead.destination}</td>
                  <td className="table-cell">
                    <span className={`badge ${sourceColors[lead.source] || 'bg-gray-100 text-gray-600'}`}>{lead.source}</span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${statusColors[lead.status] || 'bg-gray-100 text-gray-600'}`}>{lead.status}</span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${lead.stage === 'Hot' ? 'bg-red-50 text-red-600' : lead.stage === 'Warm' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-500'}`}>{lead.stage}</span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${priorityColors[lead.priority] || 'bg-gray-50 text-gray-500'}`}>{lead.priority}</span>
                  </td>
                  <td className="table-cell text-gray-600">{lead.agent}</td>
                  <td className="table-cell font-semibold text-gray-700">{lead.budget}</td>
                  <td className="table-cell text-gray-400">{lead.date}</td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button className="text-primary-600 hover:text-primary-700 text-xs font-semibold">Edit</button>
                      <button className="text-accent-600 hover:text-accent-700 text-xs font-semibold">Call</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
              </svg>
              <div className="font-medium">No leads found</div>
            </div>
          )}
        </div>
      </div>

      {/* ── ADD LEAD MODAL ───────────────────────────────────────── */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col" style={{ maxHeight: '92vh' }}>

            {/* Modal Header */}
            <div className="travel-gradient rounded-t-2xl px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-white font-bold text-lg">Add New Lead</h3>
                <p className="text-blue-100 text-xs">Fill all sections to capture complete lead details</p>
              </div>
              <button onClick={() => setShowAdd(false)} className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-xl font-light">×</button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-7">

              {/* ── SECTION 1: Basic Information ── */}
              <div>
                <SectionHeader number="1" title="Basic Information" subtitle="Who is the customer?" color="primary" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Full Name" required>
                    <input className={inp} placeholder="e.g. Raj Kumar" value={newLead.name} onChange={e => set('name', e.target.value)} />
                  </Field>
                  <Field label="Phone Number (Primary)" required>
                    <input className={inp} placeholder="+91 98765 43210" value={newLead.phone} onChange={e => set('phone', e.target.value)} />
                  </Field>
                  <Field label="Alternate Phone">
                    <input className={inp} placeholder="+91 87654 32109" value={newLead.altPhone} onChange={e => set('altPhone', e.target.value)} />
                  </Field>
                  <Field label="Email Address">
                    <input className={inp} type="email" placeholder="customer@email.com" value={newLead.email} onChange={e => set('email', e.target.value)} />
                  </Field>
                  <Field label="Country">
                    <select className={sel} value={newLead.country} onChange={e => { set('country', e.target.value); set('state', ''); }}>
                      <option value="">Select Country</option>
                      {countries.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="State / Province / Emirate">
                    <select className={sel} value={newLead.state} onChange={e => set('state', e.target.value)} disabled={!newLead.country}>
                      <option value="">{newLead.country ? 'Select State' : 'Select Country First'}</option>
                      {(countryStates[newLead.country] || []).map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Preferred Language">
                    <select className={sel} value={newLead.preferredLanguage} onChange={e => set('preferredLanguage', e.target.value)}>
                      <option value="">Select Language</option>
                      {['English', 'Hindi', 'Arabic', 'Urdu', 'French', 'German', 'Spanish', 'Other'].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </Field>
                  <Field label="Passport Available">
                    <select className={sel} value={newLead.passportAvailable} onChange={e => set('passportAvailable', e.target.value)}>
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                      <option>In Process</option>
                    </select>
                  </Field>
                </div>
              </div>

              {/* ── SECTION 2: Travel Requirements ── */}
              <div>
                <SectionHeader number="2" title="Travel Requirements" subtitle="What does the customer want?" color="teal" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Destination">
                    <input className={inp} placeholder="e.g. Dubai, Maldives, Europe Tour" value={newLead.destination} onChange={e => set('destination', e.target.value)} />
                  </Field>
                  <Field label="Departure City">
                    <input className={inp} placeholder="e.g. Mumbai, Delhi" value={newLead.departureCity} onChange={e => set('departureCity', e.target.value)} />
                  </Field>
                  <Field label="Travel Date (Start)">
                    <input className={inp} type="date" value={newLead.travelDateStart} onChange={e => set('travelDateStart', e.target.value)} />
                  </Field>
                  <Field label="Return Date">
                    <input className={inp} type="date" value={newLead.travelDateReturn} onChange={e => set('travelDateReturn', e.target.value)} />
                  </Field>
                  <Field label="Flexible Dates">
                    <select className={sel} value={newLead.flexibleDates} onChange={e => set('flexibleDates', e.target.value)}>
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </Field>
                  <Field label="Travel Type">
                    <select className={sel} value={newLead.travelType} onChange={e => set('travelType', e.target.value)}>
                      {['Package', 'Flight', 'Hotel', 'Car', 'Insurance', 'Flight + Hotel'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>

                  {/* Traveler counts */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Number of Travelers</label>
                    <div className="grid grid-cols-3 gap-3">
                      <Field label="Adults">
                        <input className={inp} type="number" min="1" placeholder="1" value={newLead.adults} onChange={e => set('adults', e.target.value)} />
                      </Field>
                      <Field label="Children (2–12 yrs)">
                        <input className={inp} type="number" min="0" placeholder="0" value={newLead.children} onChange={e => set('children', e.target.value)} />
                      </Field>
                      <Field label="Infants (0–2 yrs)">
                        <input className={inp} type="number" min="0" placeholder="0" value={newLead.infants} onChange={e => set('infants', e.target.value)} />
                      </Field>
                    </div>
                  </div>

                  <Field label="Budget Range">
                    <input className={inp} placeholder="e.g. $2,500 or ₹2,00,000" value={newLead.budget} onChange={e => set('budget', e.target.value)} />
                  </Field>
                  <Field label="Hotel Category">
                    <select className={sel} value={newLead.hotelCategory} onChange={e => set('hotelCategory', e.target.value)}>
                      <option value="">Select</option>
                      {['3 Star', '4 Star', '5 Star', 'Budget', 'Luxury Resort', 'Any'].map(h => <option key={h}>{h}</option>)}
                    </select>
                  </Field>
                  <Field label="Meal Preference">
                    <select className={sel} value={newLead.mealPreference} onChange={e => set('mealPreference', e.target.value)}>
                      <option value="">Select</option>
                      {['CP (Breakfast)', 'MAP (Breakfast + Dinner)', 'AP (All Meals)', 'No Meals'].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </Field>

                  {/* Special Requirements checkboxes */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Special Requirements</label>
                    <div className="flex flex-wrap gap-2">
                      {['Honeymoon', 'Family Trip', 'Corporate Travel', 'Adventure', 'Senior Citizens', 'Solo Travel', 'Group Tour'].map(r => (
                        <button key={r} type="button" onClick={() => toggleSpecial(r)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${newLead.specialRequirements.includes(r) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'}`}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: Lead Source Details ── */}
              <div>
                <SectionHeader number="3" title="Lead Source Details" subtitle="For marketing & ROI tracking" color="purple" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Lead Source" required>
                    <select className={sel} value={newLead.source} onChange={e => set('source', e.target.value)}>
                      {['Website', 'Google Ads', 'Facebook', 'Instagram', 'WhatsApp', 'Direct Call', 'Referral', 'Walk-in', 'Email Campaign', 'Other'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Campaign Name">
                    <input className={inp} placeholder="e.g. Dubai Summer Sale" value={newLead.campaignName} onChange={e => set('campaignName', e.target.value)} />
                  </Field>
                  <Field label="Ad Group / Keyword (PPC)">
                    <input className={inp} placeholder="e.g. dubai honeymoon package" value={newLead.adGroupKeyword} onChange={e => set('adGroupKeyword', e.target.value)} />
                  </Field>
                  <Field label="Device Type">
                    <select className={sel} value={newLead.deviceType} onChange={e => set('deviceType', e.target.value)}>
                      <option value="">Select</option>
                      <option>Mobile</option>
                      <option>Desktop</option>
                      <option>Tablet</option>
                    </select>
                  </Field>
                  <Field label="Landing Page URL">
                    <input className={inp} placeholder="https://..." value={newLead.landingPageUrl} onChange={e => set('landingPageUrl', e.target.value)} />
                  </Field>
                  <Field label="Referrer URL">
                    <input className={inp} placeholder="https://..." value={newLead.referrerUrl} onChange={e => set('referrerUrl', e.target.value)} />
                  </Field>
                  <Field label="UTM Source">
                    <input className={inp} placeholder="e.g. google" value={newLead.utmSource} onChange={e => set('utmSource', e.target.value)} />
                  </Field>
                  <Field label="UTM Medium">
                    <input className={inp} placeholder="e.g. cpc" value={newLead.utmMedium} onChange={e => set('utmMedium', e.target.value)} />
                  </Field>
                  <Field label="UTM Campaign">
                    <input className={inp} placeholder="e.g. summer_sale_2026" value={newLead.utmCampaign} onChange={e => set('utmCampaign', e.target.value)} />
                  </Field>
                  <Field label="IP Address (auto capture)">
                    <input className={inp} placeholder="Auto-captured" value={newLead.ipAddress} onChange={e => set('ipAddress', e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* ── SECTION 4: Call & Inquiry Details ── */}
              <div>
                <SectionHeader number="4" title="Call & Inquiry Details" subtitle="Since your system is call-heavy" color="orange" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Inquiry Type">
                    <select className={sel} value={newLead.inquiryType} onChange={e => set('inquiryType', e.target.value)}>
                      {['Incoming Call', 'Outgoing Call', 'Form', 'WhatsApp', 'Email', 'Walk-in'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Call Status">
                    <select className={sel} value={newLead.callStatus} onChange={e => set('callStatus', e.target.value)}>
                      <option value="">Select</option>
                      {['Connected', 'Missed', 'Abandoned', 'Voicemail', 'Busy'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Call Duration">
                    <input className={inp} placeholder="e.g. 5:32" value={newLead.callDuration} onChange={e => set('callDuration', e.target.value)} />
                  </Field>
                  <Field label="Call Recording Link">
                    <input className={inp} placeholder="RingCentral URL" value={newLead.callRecordingLink} onChange={e => set('callRecordingLink', e.target.value)} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Inquiry Notes">
                      <textarea className="input-field text-sm py-2 resize-none" rows="3" placeholder="What did the customer ask? Any special notes..." value={newLead.inquiryNotes} onChange={e => set('inquiryNotes', e.target.value)} />
                    </Field>
                  </div>
                </div>
              </div>

              {/* ── SECTION 5: Lead Assignment ── */}
              <div>
                <SectionHeader number="5" title="Lead Assignment" subtitle="Who will handle this lead?" color="green" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Assign To (Agent)">
                    <select className={sel} value={newLead.agent} onChange={e => set('agent', e.target.value)}>
                      <option value="">Select Agent</option>
                      {['Sarah J.', 'Mike R.', 'Tom K.', 'Lisa P.', 'David M.'].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </Field>
                  <Field label="Assignment Type">
                    <select className={sel} value={newLead.assignmentType} onChange={e => set('assignmentType', e.target.value)}>
                      <option>Manual</option>
                      <option>Auto</option>
                    </select>
                  </Field>
                  <Field label="Priority">
                    <select className={sel} value={newLead.priority} onChange={e => set('priority', e.target.value)}>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </Field>
                  <Field label="Lead Score (0–100)">
                    <input className={inp} type="number" min="0" max="100" placeholder="e.g. 85" value={newLead.leadScore} onChange={e => set('leadScore', e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* ── SECTION 6: Lead Status & Pipeline ── */}
              <div>
                <SectionHeader number="6" title="Lead Status & Pipeline" subtitle="Current stage of the lead" color="indigo" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Lead Status">
                    <select className={sel} value={newLead.status} onChange={e => set('status', e.target.value)}>
                      {['New', 'Contacted', 'Interested', 'Follow-up', 'Quote Sent', 'Booked', 'Lost', 'Hot Lead', 'Cold'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Lead Stage">
                    <select className={sel} value={newLead.stage} onChange={e => set('stage', e.target.value)}>
                      <option>Cold</option>
                      <option>Warm</option>
                      <option>Hot</option>
                    </select>
                  </Field>
                  <Field label="Expected Conversion Date">
                    <input className={inp} type="date" value={newLead.expectedConversionDate} onChange={e => set('expectedConversionDate', e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* ── SECTION 7: Follow-up & Scheduling ── */}
              <div>
                <SectionHeader number="7" title="Follow-up & Scheduling" subtitle="Sales continuity" color="default" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Next Follow-up Date">
                    <input className={inp} type="date" value={newLead.followUpDate} onChange={e => set('followUpDate', e.target.value)} />
                  </Field>
                  <Field label="Follow-up Time">
                    <input className={inp} type="time" value={newLead.followUpTime} onChange={e => set('followUpTime', e.target.value)} />
                  </Field>
                  <Field label="Follow-up Type">
                    <select className={sel} value={newLead.followUpType} onChange={e => set('followUpType', e.target.value)}>
                      {['Call', 'WhatsApp', 'Email', 'In-Person'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Set Reminder">
                    <select className={sel} value={newLead.reminderSet} onChange={e => set('reminderSet', e.target.value)}>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Follow-up Notes">
                      <textarea className="input-field text-sm py-2 resize-none" rows="2" placeholder="Any notes for the next follow-up..." value={newLead.followUpNotes} onChange={e => set('followUpNotes', e.target.value)} />
                    </Field>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-gray-50 rounded-b-2xl">
              <button onClick={() => { setNewLead(emptyLead); setShowAdd(false); }} className="btn-outline flex-1 py-2.5 text-sm">
                Cancel
              </button>
              <button onClick={addLead} className="btn-primary flex-1 py-2.5 text-sm" disabled={!newLead.name || !newLead.phone}>
                Save Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
