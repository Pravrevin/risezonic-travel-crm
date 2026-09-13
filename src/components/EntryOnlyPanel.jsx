import { useAuth } from '../context/AuthContext';

const Sv = ({ d, size = 16, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icCheck = 'M20 6L9 17l-5-5';
const icWarn = ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z', 'M12 9v4', 'M12 17h.01'];
const icLock = ['M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z', 'M7 11V7a5 5 0 0110 0v4'];

const RESULT_TEXT = {
  sent: { text: 'Saved to the register.', cls: 'bg-green-50 border-green-200 text-green-800', icon: icCheck, c: '#15803d' },
  'not-configured': { text: 'Saved on this device only — the backend is not configured yet.', cls: 'bg-yellow-50 border-yellow-200 text-yellow-800', icon: icWarn, c: '#a16207' },
  failed: { text: 'Could not reach the register — kept on this device and will need to be re-sent.', cls: 'bg-red-50 border-red-200 text-red-700', icon: icWarn, c: '#b91c1c' },
};

/**
 * What an Agent login sees on the Leads / Calls / Bookings pages instead of
 * the stats and the table: a button to open the entry form, a running count
 * of what they've filed this session, and the result of the last save.
 */
export default function EntryOnlyPanel({ icon, title, description, buttonLabel, onNew, savedCount, lastResult }) {
  const { user } = useAuth();
  const result = lastResult ? RESULT_TEXT[lastResult] : null;

  return (
    <div className="max-w-2xl mx-auto">
      {result && (
        <div className={`px-4 py-3 rounded-xl mb-6 text-sm border flex items-center gap-2 ${result.cls}`}>
          <Sv d={result.icon} size={16} color={result.c} sw={2} /> {result.text}
        </div>
      )}

      <div className="card p-8 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)' }}>
          <Sv d={icon} size={28} color="white" sw={1.6} />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-500 text-sm mb-6">{description}</p>
        <button onClick={onNew} className="btn-primary py-3 px-8 text-base inline-flex items-center gap-2">
          <span>+</span> {buttonLabel}
        </button>
        <div className="mt-6 text-xs text-gray-400">
          Filed as <span className="font-semibold text-gray-600">{user?.name}</span>
          {savedCount > 0 && <> · <span className="font-semibold text-gray-600">{savedCount}</span> saved this session</>}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400 flex items-center justify-center gap-2">
        <Sv d={icLock} size={13} color="#9ca3af" /> Records are visible to admins only.
      </div>
    </div>
  );
}
