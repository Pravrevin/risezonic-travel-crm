import { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Sv = ({ d, size = 16, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const emptyCampaign = {
  // 1 – Basic
  name: '', type: 'Google Ads', objective: 'Lead Generation', status: 'Active',
  // 2 – Platform
  platform: 'Google', accountId: '', manager: '',
  // 3 – Budget
  totalBudget: '', dailyBudget: '', currency: 'USD', costModel: 'CPC',
  expectedCPL: '', expectedConversions: '',
  // 4 – Targeting
  location: '', ageGroup: '', gender: '', interests: [], deviceTargeting: '',
  // 5 – UTM
  utmSource: '', utmMedium: '', utmCampaign: '', utmTerm: '', utmContent: '', trackingUrl: '',
  // 6 – Lead Capture
  leadCaptureType: 'Landing Page Form', landingPageUrl: '', formId: '', callTrackingPhone: '',
  // 7 – Call Tracking
  trackingNumber: '', callRoutingRule: '', recordCalls: 'Yes', ringCentralIntegration: 'Yes',
  // 8 – Lead Assignment
  assignTo: '', assignmentType: 'Round Robin', priorityLevel: 'Medium',
  // 9 – Conversion Goals
  primaryGoal: 'Lead', targetConversions: '', targetRevenue: '', conversionWindow: '30',
  // 11 – Timeline
  startDate: '', endDate: '',
  // 12 – Notes
  campaignNotes: '', adCreatives: null, adCopyText: '',
};

const initialCampaigns = [
  { id: 'CP001', name: 'Summer Dubai Deals', type: 'Google Ads', platform: 'Google', leads: 284, conversions: 38, spend: '$1,200', roi: '340%', status: 'Active', startDate: '2026-03-01', endDate: '2026-03-31' },
  { id: 'CP002', name: 'Maldives Honeymoon', type: 'Facebook Ads', platform: 'Facebook', leads: 156, conversions: 22, spend: '$800', roi: '290%', status: 'Active', startDate: '2026-03-05', endDate: '2026-04-05' },
  { id: 'CP003', name: 'Europe Explorer', type: 'Instagram', platform: 'Instagram', leads: 98, conversions: 14, spend: '$600', roi: '245%', status: 'Paused', startDate: '2026-02-15', endDate: '2026-03-15' },
  { id: 'CP004', name: 'Asia Weekend Getaway', type: 'Google Ads', platform: 'Google', leads: 210, conversions: 31, spend: '$950', roi: '310%', status: 'Active', startDate: '2026-03-10', endDate: '2026-04-10' },
  { id: 'CP005', name: 'Travel Affiliate Program', type: 'Affiliate', platform: 'Affiliate Network', leads: 67, conversions: 9, spend: '$400', roi: '180%', status: 'Active', startDate: '2026-01-01', endDate: '2026-06-30' },
];

const sources = [
  { name: 'Google Ads', leads: 494, pct: 42, color: 'bg-blue-500' },
  { name: 'Facebook', leads: 156, pct: 13, color: 'bg-indigo-500' },
  { name: 'Instagram', leads: 98, pct: 8, color: 'bg-pink-500' },
  { name: 'Website Organic', leads: 284, pct: 24, color: 'bg-teal-500' },
  { name: 'Referral', leads: 67, pct: 6, color: 'bg-purple-500' },
  { name: 'Affiliate', leads: 85, pct: 7, color: 'bg-amber-500' },
];

const statusColors = { Active: 'bg-green-100 text-green-700', Paused: 'bg-yellow-100 text-yellow-700', Completed: 'bg-gray-100 text-gray-600' };

// ── Section header ──────────────────────────────────────────────────
const colorMap = {
  primary: ['border-primary-100', 'bg-primary-600'],
  teal:    ['border-teal-100',    'bg-teal-600'],
  purple:  ['border-purple-100',  'bg-purple-600'],
  orange:  ['border-orange-100',  'bg-orange-500'],
  green:   ['border-green-100',   'bg-green-600'],
  indigo:  ['border-indigo-100',  'bg-indigo-600'],
  red:     ['border-red-100',     'bg-red-500'],
  sky:     ['border-sky-100',     'bg-sky-600'],
  amber:   ['border-amber-100',   'bg-amber-500'],
  pink:    ['border-pink-100',    'bg-pink-600'],
  gray:    ['border-gray-200',    'bg-gray-500'],
};

const SectionHeader = ({ number, title, subtitle, color = 'primary' }) => {
  const [border, bg] = colorMap[color] || colorMap.primary;
  return (
    <div className={`flex items-center gap-3 pb-3 mb-4 border-b-2 ${border}`}>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0 ${bg}`}>{number}</div>
      <div>
        <div className="font-bold text-gray-800 text-sm leading-tight">{title}</div>
        {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
      </div>
    </div>
  );
};

const Field = ({ label, required, span2, children }) => (
  <div className={span2 ? 'sm:col-span-2' : ''}>
    <label className="block text-xs font-semibold text-gray-500 mb-1">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const Toggle = ({ label, sub, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
    <div onClick={onChange} className={`w-10 h-5 rounded-full transition-all flex-shrink-0 relative ${checked ? 'bg-primary-600' : 'bg-gray-200'}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
    </div>
    <div>
      <div className="text-sm text-gray-700 font-medium">{label}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  </label>
);

const ReadOnlyField = ({ label, value }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
    <div className="input-field text-sm py-2 bg-gray-50 text-gray-400 cursor-not-allowed">{value || '— auto calculated —'}</div>
  </div>
);

function calcActiveDays(start, end) {
  if (!start || !end) return null;
  const d = Math.round((new Date(end) - new Date(start)) / 86400000);
  return d > 0 ? d : null;
}

export default function Marketing() {
  const [campaignList, setCampaignList] = useState(initialCampaigns);
  const [showModal, setShowModal] = useState(false);
  const [c, setC] = useState(emptyCampaign);

  const set = (key, val) => setC(p => ({ ...p, [key]: val }));
  const toggleInterest = (val) => setC(p => ({
    ...p,
    interests: p.interests.includes(val) ? p.interests.filter(x => x !== val) : [...p.interests, val],
  }));

  const campaignId = useMemo(() => 'CP' + String(campaignList.length + 1).padStart(3, '0'), [campaignList.length]);
  const activeDays  = useMemo(() => calcActiveDays(c.startDate, c.endDate), [c.startDate, c.endDate]);

  const saveCampaign = () => {
    if (!c.name) return;
    setCampaignList(prev => [{
      id: campaignId,
      name: c.name,
      type: c.type,
      platform: c.platform,
      leads: 0, conversions: 0,
      spend: c.totalBudget ? `$${parseFloat(c.totalBudget).toLocaleString()}` : '$0',
      roi: '—',
      status: c.status,
      startDate: c.startDate,
      endDate: c.endDate,
    }, ...prev]);
    setC(emptyCampaign);
    setShowModal(false);
  };

  const inp = 'input-field text-sm py-2';
  const sel = 'input-field text-sm py-2';

  return (
    <DashboardLayout title="Marketing" subtitle="Track lead sources, campaign performance, and ROI">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Leads', val: '1,184', icon: ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2','M9 11a4 4 0 100-8 4 4 0 000 8z'], bg: 'bg-blue-50 text-blue-700' },
          { label: 'Active Campaigns', val: campaignList.filter(x => x.status === 'Active').length, icon: 'M22 12h-4l-3 9L9 3l-3 9H2', bg: 'bg-green-50 text-green-700' },
          { label: 'Avg. CPC', val: '$2.84', icon: ['M12 2v20','M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'], bg: 'bg-amber-50 text-amber-700' },
          { label: 'Avg. ROI', val: '273%', icon: 'M23 6l-9.5 9.5-5-5L1 18', bg: 'bg-purple-50 text-purple-700' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0"><Sv d={s.icon} size={17} /></div>
            <div>
              <div className="text-2xl font-black">{s.val}</div>
              <div className="text-xs font-medium opacity-70">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Source + Campaign Table */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-6">
          <h3 className="font-bold text-gray-800 mb-4">Lead Sources</h3>
          <div className="space-y-3">
            {sources.map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">{s.name}</span>
                  <span className="text-gray-800 font-bold">{s.leads} <span className="text-gray-400 font-normal">({s.pct}%)</span></span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-2 ${s.color} rounded-full transition-all duration-1000`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Campaigns</h3>
            <button onClick={() => setShowModal(true)} className="btn-primary py-2 text-sm flex items-center gap-2">
              <span>+</span> New Campaign
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="table-header text-left">Campaign</th>
                  <th className="table-header text-left">Platform</th>
                  <th className="table-header text-right">Leads</th>
                  <th className="table-header text-right">Conv.</th>
                  <th className="table-header text-right">Spend</th>
                  <th className="table-header text-right">ROI</th>
                  <th className="table-header text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaignList.map((camp, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="font-medium text-gray-800">{camp.name}</div>
                      <div className="text-xs text-gray-400">{camp.id} · {camp.type}</div>
                    </td>
                    <td className="table-cell text-gray-500 text-sm">{camp.platform}</td>
                    <td className="table-cell text-right font-semibold text-gray-700">{camp.leads}</td>
                    <td className="table-cell text-right text-accent-700 font-semibold">{camp.conversions}</td>
                    <td className="table-cell text-right text-gray-500">{camp.spend}</td>
                    <td className="table-cell text-right font-bold text-green-600">{camp.roi}</td>
                    <td className="table-cell"><span className={`badge ${statusColors[camp.status] || 'bg-gray-100 text-gray-600'}`}>{camp.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── CREATE CAMPAIGN MODAL ───────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col" style={{ maxHeight: '92vh' }}>

            {/* Header */}
            <div className="travel-gradient rounded-t-2xl px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-bold text-lg">Create Campaign</h3>
                  <span className="bg-white/20 text-white text-xs font-mono px-2 py-0.5 rounded">{campaignId}</span>
                </div>
                <p className="text-blue-100 text-xs mt-0.5">Complete all sections for full campaign tracking</p>
              </div>
              <button onClick={() => { setC(emptyCampaign); setShowModal(false); }}
                className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-xl font-light">×</button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-7">

              {/* ── 1: Basic Campaign Information ── */}
              <div>
                <SectionHeader number="1" title="Basic Campaign Information" subtitle="Identify the campaign" color="primary" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Campaign ID">
                    <input className={`${inp} bg-gray-50 text-gray-400`} value={campaignId} readOnly />
                  </Field>
                  <Field label="Campaign Name" required>
                    <input className={inp} placeholder="e.g. Summer Dubai Deals 2026" value={c.name} onChange={e => set('name', e.target.value)} />
                  </Field>
                  <Field label="Campaign Type" required>
                    <select className={sel} value={c.type} onChange={e => set('type', e.target.value)}>
                      {['Google Ads','Facebook Ads','Affiliate','Email','WhatsApp','Organic','Instagram Ads','LinkedIn Ads'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Campaign Objective">
                    <select className={sel} value={c.objective} onChange={e => set('objective', e.target.value)}>
                      {['Lead Generation','Sales','Traffic','Awareness','App Installs','Video Views'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field label="Campaign Status">
                    <select className={sel} value={c.status} onChange={e => set('status', e.target.value)}>
                      {['Active','Paused','Completed','Draft'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              {/* ── 2: Platform Details ── */}
              <div>
                <SectionHeader number="2" title="Platform Details" subtitle="Where the campaign is running" color="teal" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Platform Name" required>
                    <select className={sel} value={c.platform} onChange={e => set('platform', e.target.value)}>
                      {['Google','Facebook','Instagram','LinkedIn','Affiliate Network','WhatsApp','Email','Organic/SEO'].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </Field>
                  <Field label="Account ID (Ad Account)">
                    <input className={inp} placeholder="e.g. ADS-12345-XYZ" value={c.accountId} onChange={e => set('accountId', e.target.value)} />
                  </Field>
                  <Field label="Campaign Manager">
                    <select className={sel} value={c.manager} onChange={e => set('manager', e.target.value)}>
                      <option value="">Select Manager</option>
                      {['Sarah J.','Mike R.','Tom K.','Lisa P.','Admin'].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              {/* ── 3: Budget & Costing ── */}
              <div>
                <SectionHeader number="3" title="Budget & Costing" subtitle="For ROI tracking" color="orange" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Total Budget">
                    <input className={inp} type="number" placeholder="0.00" value={c.totalBudget} onChange={e => set('totalBudget', e.target.value)} />
                  </Field>
                  <Field label="Daily Budget">
                    <input className={inp} type="number" placeholder="0.00" value={c.dailyBudget} onChange={e => set('dailyBudget', e.target.value)} />
                  </Field>
                  <Field label="Currency">
                    <select className={sel} value={c.currency} onChange={e => set('currency', e.target.value)}>
                      {['USD','EUR','GBP','AED','INR','SAR'].map(cur => <option key={cur}>{cur}</option>)}
                    </select>
                  </Field>
                  <Field label="Cost Model">
                    <select className={sel} value={c.costModel} onChange={e => set('costModel', e.target.value)}>
                      {['CPC','CPM','CPL','CPA','CPV','Fixed'].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </Field>
                  <Field label="Expected Cost per Lead (CPL)">
                    <input className={inp} type="number" placeholder="0.00" value={c.expectedCPL} onChange={e => set('expectedCPL', e.target.value)} />
                  </Field>
                  <Field label="Expected Conversions">
                    <input className={inp} type="number" placeholder="e.g. 50" value={c.expectedConversions} onChange={e => set('expectedConversions', e.target.value)} />
                  </Field>
                  {c.totalBudget && c.expectedConversions && parseFloat(c.expectedConversions) > 0 && (
                    <div className="sm:col-span-2">
                      <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 flex items-center gap-3">
                        <span className="text-sm font-semibold text-green-600">Estimated CPA:</span>
                        <span className="font-black text-lg text-green-700">
                          {c.currency} {(parseFloat(c.totalBudget) / parseFloat(c.expectedConversions)).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">Total Budget / Conversions</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── 4: Targeting Details ── */}
              <div>
                <SectionHeader number="4" title="Targeting Details" subtitle="Audience targeting" color="purple" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Location (Country / City)">
                    <input className={inp} placeholder="e.g. India, UAE, USA" value={c.location} onChange={e => set('location', e.target.value)} />
                  </Field>
                  <Field label="Age Group">
                    <select className={sel} value={c.ageGroup} onChange={e => set('ageGroup', e.target.value)}>
                      <option value="">All Ages</option>
                      {['18–24','25–34','35–44','45–54','55–64','65+'].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </Field>
                  <Field label="Gender">
                    <select className={sel} value={c.gender} onChange={e => set('gender', e.target.value)}>
                      <option value="">All Genders</option>
                      {['Male','Female','All'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </Field>
                  <Field label="Device Targeting">
                    <select className={sel} value={c.deviceTargeting} onChange={e => set('deviceTargeting', e.target.value)}>
                      <option value="">All Devices</option>
                      {['Mobile','Desktop','Tablet','Mobile + Tablet'].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </Field>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Interests</label>
                    <div className="flex flex-wrap gap-2">
                      {['Travel','Honeymoon','Luxury Travel','Adventure','Beach Holidays','Family Travel','Business Travel','Budget Travel','Cultural Tours'].map(i => (
                        <button key={i} type="button" onClick={() => toggleInterest(i)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${c.interests.includes(i) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'}`}>
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 5: Tracking & UTM ── */}
              <div>
                <SectionHeader number="5" title="Tracking & UTM Details" subtitle="Connect marketing to CRM" color="indigo" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="UTM Source">
                    <input className={inp} placeholder="e.g. google" value={c.utmSource} onChange={e => set('utmSource', e.target.value)} />
                  </Field>
                  <Field label="UTM Medium">
                    <input className={inp} placeholder="e.g. cpc" value={c.utmMedium} onChange={e => set('utmMedium', e.target.value)} />
                  </Field>
                  <Field label="UTM Campaign">
                    <input className={inp} placeholder="e.g. summer_dubai_2026" value={c.utmCampaign} onChange={e => set('utmCampaign', e.target.value)} />
                  </Field>
                  <Field label="UTM Term (Keyword)">
                    <input className={inp} placeholder="e.g. dubai honeymoon package" value={c.utmTerm} onChange={e => set('utmTerm', e.target.value)} />
                  </Field>
                  <Field label="UTM Content">
                    <input className={inp} placeholder="e.g. banner_v1" value={c.utmContent} onChange={e => set('utmContent', e.target.value)} />
                  </Field>
                  <Field label="Tracking URL (Landing page + UTM)" span2>
                    <input className={inp} placeholder="https://yoursite.com/dubai?utm_source=google&utm_medium=cpc..." value={c.trackingUrl} onChange={e => set('trackingUrl', e.target.value)} />
                  </Field>
                  {c.utmSource && c.utmMedium && c.utmCampaign && (
                    <div className="sm:col-span-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
                      <div className="text-xs font-semibold text-indigo-500 mb-1">Auto-generated UTM String</div>
                      <div className="text-xs font-mono text-indigo-700 break-all">
                        ?utm_source={c.utmSource}&utm_medium={c.utmMedium}&utm_campaign={c.utmCampaign}
                        {c.utmTerm && `&utm_term=${c.utmTerm}`}
                        {c.utmContent && `&utm_content=${c.utmContent}`}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── 6: Lead Capture ── */}
              <div>
                <SectionHeader number="6" title="Lead Capture Configuration" subtitle="How leads enter CRM" color="green" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Lead Capture Type">
                    <select className={sel} value={c.leadCaptureType} onChange={e => set('leadCaptureType', e.target.value)}>
                      {['Landing Page Form','Call','WhatsApp','API','Chat Widget','Manual'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Landing Page URL">
                    <input className={inp} placeholder="https://..." value={c.landingPageUrl} onChange={e => set('landingPageUrl', e.target.value)} />
                  </Field>
                  <Field label="Form ID / API Endpoint">
                    <input className={inp} placeholder="e.g. FORM-001 or /api/leads" value={c.formId} onChange={e => set('formId', e.target.value)} />
                  </Field>
                  <Field label="Phone Number (Call Tracking)">
                    <input className={inp} placeholder="+1 800 XXX XXXX" value={c.callTrackingPhone} onChange={e => set('callTrackingPhone', e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* ── 7: Call Tracking ── */}
              <div>
                <SectionHeader number="7" title="Call Tracking Setup" subtitle="For call-based campaigns" color="sky" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Tracking Number (mapped per campaign)">
                    <input className={inp} placeholder="+1 800 CAMP 001" value={c.trackingNumber} onChange={e => set('trackingNumber', e.target.value)} />
                  </Field>
                  <Field label="Call Routing Rule">
                    <select className={sel} value={c.callRoutingRule} onChange={e => set('callRoutingRule', e.target.value)}>
                      <option value="">Select Rule</option>
                      {['Round Robin','Fixed Agent','Skill-based','Priority Queue','IVR Menu'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </Field>
                  <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                    <Toggle label="Record Calls" sub="Store recordings in system" checked={c.recordCalls === 'Yes'} onChange={() => set('recordCalls', c.recordCalls === 'Yes' ? 'No' : 'Yes')} />
                    <Toggle label="RingCentral Integration" sub="Auto-sync call logs" checked={c.ringCentralIntegration === 'Yes'} onChange={() => set('ringCentralIntegration', c.ringCentralIntegration === 'Yes' ? 'No' : 'Yes')} />
                  </div>
                </div>
              </div>

              {/* ── 8: Lead Assignment ── */}
              <div>
                <SectionHeader number="8" title="Lead Assignment Rules" subtitle="What happens after a lead comes in" color="pink" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Assign To (Agent / Team)">
                    <select className={sel} value={c.assignTo} onChange={e => set('assignTo', e.target.value)}>
                      <option value="">Select Agent or Team</option>
                      {['Sarah J.','Mike R.','Tom K.','Lisa P.','Team Dubai','Team Maldives','Auto Assign'].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </Field>
                  <Field label="Assignment Type">
                    <select className={sel} value={c.assignmentType} onChange={e => set('assignmentType', e.target.value)}>
                      {['Round Robin','Fixed','Skill-based','Load Balanced','Manual'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Priority Level">
                    <select className={sel} value={c.priorityLevel} onChange={e => set('priorityLevel', e.target.value)}>
                      {['High','Medium','Low'].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              {/* ── 9: Conversion Goals ── */}
              <div>
                <SectionHeader number="9" title="Conversion Goals" subtitle="Define success metrics" color="amber" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Primary Goal">
                    <select className={sel} value={c.primaryGoal} onChange={e => set('primaryGoal', e.target.value)}>
                      {['Lead','Booking','Call','Revenue','WhatsApp Inquiry'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </Field>
                  <Field label="Target Conversions">
                    <input className={inp} type="number" placeholder="e.g. 100" value={c.targetConversions} onChange={e => set('targetConversions', e.target.value)} />
                  </Field>
                  <Field label="Target Revenue">
                    <input className={inp} type="number" placeholder="0.00" value={c.targetRevenue} onChange={e => set('targetRevenue', e.target.value)} />
                  </Field>
                  <Field label="Conversion Window (days)">
                    <select className={sel} value={c.conversionWindow} onChange={e => set('conversionWindow', e.target.value)}>
                      {['1','7','14','30','60','90'].map(d => <option key={d} value={d}>{d} days</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              {/* ── 10: Performance Tracking (Auto) ── */}
              <div>
                <SectionHeader number="10" title="Performance Tracking" subtitle="Auto-filled by system — read only" color="gray" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <ReadOnlyField label="Total Leads" value="0" />
                  <ReadOnlyField label="Total Calls" value="0" />
                  <ReadOnlyField label="Total Bookings" value="0" />
                  <ReadOnlyField label="Conversion Rate" />
                  <ReadOnlyField label="Cost per Lead (CPL)" />
                  <ReadOnlyField label="Cost per Booking (CPA)" />
                  <ReadOnlyField label="ROI" />
                </div>
              </div>

              {/* ── 11: Timeline ── */}
              <div>
                <SectionHeader number="11" title="Campaign Timeline" subtitle="Duration tracking" color="teal" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Start Date" required>
                    <input className={inp} type="date" value={c.startDate} onChange={e => set('startDate', e.target.value)} />
                  </Field>
                  <Field label="End Date">
                    <input className={inp} type="date" value={c.endDate} onChange={e => set('endDate', e.target.value)} />
                  </Field>
                  {activeDays && (
                    <div className="sm:col-span-2">
                      <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-2.5 flex items-center gap-3">
                        <span className="text-sm font-semibold text-teal-600">Active Duration:</span>
                        <span className="font-black text-lg text-teal-700">{activeDays} days</span>
                        {c.dailyBudget && (
                          <span className="text-xs text-gray-500 ml-auto">
                            Est. total spend: {c.currency} {(activeDays * parseFloat(c.dailyBudget)).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── 12: Notes & Attachments ── */}
              <div>
                <SectionHeader number="12" title="Notes & Attachments" subtitle="Optional" color="gray" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Campaign Notes" span2>
                    <textarea className="input-field text-sm py-2 resize-none" rows="3"
                      placeholder="Any notes about this campaign — targeting rationale, creative brief, approvals..."
                      value={c.campaignNotes} onChange={e => set('campaignNotes', e.target.value)} />
                  </Field>
                  <Field label="Copy / Ad Text" span2>
                    <textarea className="input-field text-sm py-2 resize-none" rows="3"
                      placeholder="Paste the ad headline and description here..."
                      value={c.adCopyText} onChange={e => set('adCopyText', e.target.value)} />
                  </Field>
                  <Field label="Ad Creatives (Images / Videos)" span2>
                    <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl px-4 py-4 cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-all group">
                      <div className="w-8 h-8 bg-gray-100 group-hover:bg-primary-100 rounded-lg flex items-center justify-center transition-colors">
                        <Sv d={['M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4','M17 8l-5-5-5 5','M12 3v12']} size={16} color="#9ca3af" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 group-hover:text-primary-600 font-medium transition-colors">Click to upload creatives</div>
                        <div className="text-xs text-gray-400">PNG, JPG, MP4 up to 50MB</div>
                      </div>
                      <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.mp4,.gif" multiple />
                    </label>
                  </Field>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-gray-50 rounded-b-2xl">
              <button onClick={() => { setC(emptyCampaign); setShowModal(false); }} className="btn-outline flex-1 py-2.5 text-sm">
                Cancel
              </button>
              <button onClick={saveCampaign} disabled={!c.name}
                className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Launch Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
