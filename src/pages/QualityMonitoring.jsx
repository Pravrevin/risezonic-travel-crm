import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Sv = ({ d, size = 18, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ic = {
  mic:    ['M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z','M19 10v2a7 7 0 01-14 0v-2','M12 19v4','M8 23h8'],
  check:  'M20 6L9 17l-5-5',
  clock:  ['M12 2a10 10 0 100 20A10 10 0 0012 2z','M12 6v6l4 2'],
  star:   'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  cal:    ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  play:   ['M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z','M21 12a9 9 0 11-18 0 9 9 0 0118 0z'],
  phone:  'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.72 19.79 19.79 0 01.11 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  hash:   ['M4 9h16','M4 15h16','M10 3L8 21','M16 3l-2 18'],
  dollar: ['M12 2v20','M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'],
  key:    ['M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4'],
  info:   ['M12 2a10 10 0 100 20A10 10 0 0012 2z','M12 16v-4','M12 8h.01'],
  signal: ['M1 6c0 0 5-3 11-3s11 3 11 3','M5 10c0 0 3-2 7-2s7 2 7 2','M9 14c0 0 1-1 3-1s3 1 3 1','M12 18h.01'],
};

const recordings = [
  {
    id: 1, agent: 'Sarah Johnson', avatar: 'SJ', customer: 'Raj Kumar',
    duration: '4:32', date: '2026-03-27', score: 92, evaluated: true,
    feedback: 'Excellent rapport, great product knowledge. Slight improvement needed on closing.',
    tags: ['Rapport', 'Knowledge'],
    // Call Insights
    callId: 'CL-2026-00841',
    durationSecs: 272,
    durationMins: 4.53,
    startTime: '10:14:08 AM',
    disconnectTime: '10:18:40 AM',
    connectionTime: '00:00:06',
    ringDuration: '00:00:06',
    waitDuration: '00:00:00',
    answerDuration: '00:04:26',
    minutesConsumed: 5,
    charges: '$0.30',
    callType: 'Inbound',
    status: 'Answered',
    reason: 'Customer Inquiry',
    digitsPressed: '1',
    recordingUrl: 'https://example.com/recordings/CL-2026-00841.mp3',
  },
  {
    id: 2, agent: 'Mike Roberts', avatar: 'MR', customer: 'Priya Singh',
    duration: '2:18', date: '2026-03-27', score: 74, evaluated: true,
    feedback: 'Good call handling. Follow-up questions were weak. Coach on objection handling.',
    tags: ['Needs Coaching'],
    callId: 'CL-2026-00842',
    durationSecs: 138,
    durationMins: 2.30,
    startTime: '11:02:44 AM',
    disconnectTime: '11:05:02 AM',
    connectionTime: '00:00:09',
    ringDuration: '00:00:09',
    waitDuration: '00:00:02',
    answerDuration: '00:02:11',
    minutesConsumed: 3,
    charges: '$0.18',
    callType: 'Outbound',
    status: 'Answered',
    reason: 'Follow-up',
    digitsPressed: 'None',
    recordingUrl: 'https://example.com/recordings/CL-2026-00842.mp3',
  },
  {
    id: 3, agent: 'Tom Keller', avatar: 'TK', customer: 'John Davis',
    duration: '6:45', date: '2026-03-26', score: null, evaluated: false,
    feedback: '', tags: [],
    callId: 'CL-2026-00836',
    durationSecs: 405,
    durationMins: 6.75,
    startTime: '03:22:11 PM',
    disconnectTime: '03:28:56 PM',
    connectionTime: '00:00:12',
    ringDuration: '00:00:12',
    waitDuration: '00:00:04',
    answerDuration: '00:06:29',
    minutesConsumed: 7,
    charges: '$0.42',
    callType: 'Inbound',
    status: 'Answered',
    reason: 'Package Booking',
    digitsPressed: '2',
    recordingUrl: 'https://example.com/recordings/CL-2026-00836.mp3',
  },
  {
    id: 4, agent: 'Sarah Johnson', avatar: 'SJ', customer: 'Aisha Khan',
    duration: '3:12', date: '2026-03-26', score: 88, evaluated: true,
    feedback: 'Strong closing technique. Good upselling on insurance.',
    tags: ['Closing', 'Upsell'],
    callId: 'CL-2026-00835',
    durationSecs: 192,
    durationMins: 3.20,
    startTime: '01:45:33 PM',
    disconnectTime: '01:48:45 PM',
    connectionTime: '00:00:07',
    ringDuration: '00:00:07',
    waitDuration: '00:00:01',
    answerDuration: '00:03:04',
    minutesConsumed: 4,
    charges: '$0.24',
    callType: 'Outbound',
    status: 'Answered',
    reason: 'Booking Confirmation',
    digitsPressed: 'None',
    recordingUrl: 'https://example.com/recordings/CL-2026-00835.mp3',
  },
  {
    id: 5, agent: 'Emma Wilson', avatar: 'EW', customer: 'Mike Thompson',
    duration: '5:01', date: '2026-03-25', score: null, evaluated: false,
    feedback: '', tags: [],
    callId: 'CL-2026-00829',
    durationSecs: 301,
    durationMins: 5.02,
    startTime: '09:58:22 AM',
    disconnectTime: '10:03:23 AM',
    connectionTime: '00:00:15',
    ringDuration: '00:00:15',
    waitDuration: '00:00:00',
    answerDuration: '00:04:46',
    minutesConsumed: 6,
    charges: '$0.36',
    callType: 'Inbound',
    status: 'Answered',
    reason: 'Price Inquiry',
    digitsPressed: '3',
    recordingUrl: 'https://example.com/recordings/CL-2026-00829.mp3',
  },
];

const ScoreBar = ({ score }) => {
  if (!score) return <span className="text-xs text-gray-400 italic">Not rated</span>;
  const color = score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500';
  const textColor = score >= 85 ? 'text-green-700' : score >= 70 ? 'text-yellow-700' : 'text-red-700';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full w-16">
        <div className={`h-2 ${color} rounded-full`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-sm font-bold ${textColor}`}>{score}</span>
    </div>
  );
};

const InsightRow = ({ label, value, highlight }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-400">{label}</span>
    <span className={`text-xs font-semibold ${highlight ? 'text-primary-700' : 'text-gray-700'}`}>{value}</span>
  </div>
);

export default function QualityMonitoring() {
  const [selected, setSelected] = useState(null);
  const [tempScore, setTempScore] = useState(80);
  const [tempFeedback, setTempFeedback] = useState('');
  const [activePanel, setActivePanel] = useState('insights'); // 'insights' | 'evaluate'

  const evaluated = recordings.filter(r => r.evaluated).length;
  const avgScore = Math.round(recordings.filter(r => r.score).reduce((s, r) => s + r.score, 0) / evaluated);

  const handleSelect = (rec) => {
    setSelected(rec);
    setTempScore(rec.score || 80);
    setTempFeedback(rec.feedback);
    setActivePanel('insights');
  };

  const statusColor = (s) => s === 'Answered' ? 'bg-green-100 text-green-700' : s === 'Missed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500';
  const typeColor = (t) => t === 'Inbound' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700';

  return (
    <DashboardLayout title="Quality Monitoring" subtitle="Listen to call recordings, evaluate agents, and provide feedback">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Recordings', val: recordings.length, icon: ic.mic, bg: 'bg-blue-50 text-blue-700', c: '#2563eb' },
          { label: 'Evaluated', val: evaluated, icon: ic.check, bg: 'bg-green-50 text-green-700', c: '#16a34a' },
          { label: 'Pending Review', val: recordings.length - evaluated, icon: ic.clock, bg: 'bg-yellow-50 text-yellow-700', c: '#ca8a04' },
          { label: 'Avg. Score', val: `${avgScore}/100`, icon: ic.star, bg: 'bg-amber-50 text-amber-700', c: '#d97706' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0"><Sv d={s.icon} size={17} color={s.c} /></div>
            <div>
              <div className="text-2xl font-black">{s.val}</div>
              <div className="text-xs font-medium opacity-70">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Call list */}
        <div className="lg:col-span-3 space-y-3">
          {recordings.map(rec => (
            <div key={rec.id} onClick={() => handleSelect(rec)}
              className={`card p-5 cursor-pointer hover:shadow-md transition-all duration-200 ${selected?.id === rec.id ? 'border-primary-500 border-2' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gradient-to-br from-primary-600 to-accent-500 text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {rec.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-gray-800 text-sm">{rec.agent}</span>
                    <span className="text-gray-400 text-xs">→</span>
                    <span className="text-gray-600 text-sm">{rec.customer}</span>
                    {!rec.evaluated && <span className="badge bg-yellow-100 text-yellow-700 text-xs">Pending Review</span>}
                    <span className={`badge text-xs ${typeColor(rec.callType)}`}>{rec.callType}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1"><Sv d={ic.clock} size={11} color="#9ca3af" sw={2} /> {rec.duration}</span>
                    <span className="flex items-center gap-1"><Sv d={ic.cal} size={11} color="#9ca3af" sw={2} /> {rec.date}</span>
                    <span className="flex items-center gap-1"><Sv d={ic.hash} size={11} color="#9ca3af" sw={2} /> {rec.callId}</span>
                  </div>
                </div>
                <div className="text-right w-28">
                  <ScoreBar score={rec.score} />
                  <div className="flex gap-1 mt-1.5 justify-end flex-wrap">
                    {rec.tags.map(t => <span key={t} className="text-xs bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded">{t}</span>)}
                  </div>
                </div>
                <button className="text-primary-600 p-2 rounded-lg hover:bg-primary-50 transition-colors flex-shrink-0">
                  <Sv d={ic.play} size={20} color="#2563eb" sw={1.8} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="card sticky top-24 overflow-hidden">
              {/* Panel header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                    {selected.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">{selected.agent}</div>
                    <div className="text-xs text-gray-400">{selected.customer} • {selected.date}</div>
                  </div>
                  <div className="ml-auto">
                    <span className={`badge text-xs ${statusColor(selected.status)}`}>{selected.status}</span>
                  </div>
                </div>

                {/* Recording player bar */}
                <div className="bg-gray-900 rounded-xl px-4 py-3 flex items-center gap-3">
                  <button className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-primary-700 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z" /></svg>
                  </button>
                  <div className="flex-1">
                    <div className="h-1.5 bg-gray-700 rounded-full">
                      <div className="h-1.5 bg-primary-500 rounded-full w-1/3" />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{selected.duration}</span>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                  </button>
                </div>
              </div>

              {/* Tab switcher */}
              <div className="flex border-b border-gray-100">
                {['insights', 'evaluate'].map(tab => (
                  <button key={tab} onClick={() => setActivePanel(tab)}
                    className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${activePanel === tab ? 'text-primary-700 border-b-2 border-primary-600' : 'text-gray-400 hover:text-gray-600'}`}>
                    {tab === 'insights' ? 'Call Insights' : 'Evaluate'}
                  </button>
                ))}
              </div>

              {activePanel === 'insights' && (
                <div className="p-4 overflow-y-auto" style={{ maxHeight: '52vh' }}>
                  {/* IDs & Type */}
                  <div className="mb-3">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Identification</div>
                    <div className="bg-gray-50 rounded-xl px-4 py-1">
                      <InsightRow label="Call ID" value={selected.callId} highlight />
                      <InsightRow label="Call Type" value={selected.callType} />
                      <InsightRow label="Status" value={selected.status} />
                      <InsightRow label="Reason" value={selected.reason} />
                      <InsightRow label="Digits Pressed" value={selected.digitsPressed} />
                    </div>
                  </div>

                  {/* Timing */}
                  <div className="mb-3">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Timing</div>
                    <div className="bg-gray-50 rounded-xl px-4 py-1">
                      <InsightRow label="Call Date" value={selected.date} />
                      <InsightRow label="Call Start Time" value={selected.startTime} />
                      <InsightRow label="Call Disconnection Time" value={selected.disconnectTime} />
                      <InsightRow label="Call Connection Time" value={selected.connectionTime} />
                      <InsightRow label="Ring Duration" value={selected.ringDuration} />
                      <InsightRow label="Wait Duration" value={selected.waitDuration} />
                      <InsightRow label="Answer Duration" value={selected.answerDuration} />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="mb-3">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Duration</div>
                    <div className="bg-gray-50 rounded-xl px-4 py-1">
                      <InsightRow label="Call Duration (secs)" value={`${selected.durationSecs}s`} />
                      <InsightRow label="Call Duration (mins)" value={`${selected.durationMins.toFixed(2)} min`} />
                    </div>
                  </div>

                  {/* Billing */}
                  <div className="mb-3">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Billing</div>
                    <div className="bg-gray-50 rounded-xl px-4 py-1">
                      <InsightRow label="Minutes Consumed" value={`${selected.minutesConsumed} min`} />
                      <InsightRow label="Charges" value={selected.charges} highlight />
                    </div>
                  </div>

                  {/* Recording */}
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Call Recording</div>
                    <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-mono truncate flex-1 mr-2">{selected.callId}.mp3</span>
                      <button className="flex items-center gap-1.5 text-xs bg-primary-700 text-white px-3 py-1.5 rounded-lg hover:bg-primary-800 transition-colors flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'evaluate' && (
                <div className="p-4">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-700">Call Score</label>
                      <span className="text-2xl font-black text-primary-700">{tempScore}</span>
                    </div>
                    <input type="range" min="0" max="100" value={tempScore} onChange={e => setTempScore(+e.target.value)}
                      className="w-full accent-primary-600" />
                    <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0</span><span>50</span><span>100</span></div>
                  </div>
                  <div className="mb-4">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Feedback</label>
                    <textarea className="input-field resize-none h-28 text-sm" placeholder="Add coaching notes..."
                      value={tempFeedback} onChange={e => setTempFeedback(e.target.value)} />
                  </div>
                  <button className="btn-primary w-full text-sm py-2.5">Save Evaluation</button>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-6 text-center text-gray-400">
              <div className="flex justify-center mb-3"><Sv d={ic.mic} size={36} color="#d1d5db" sw={1.5} /></div>
              <div className="text-sm">Select a call to view insights</div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
