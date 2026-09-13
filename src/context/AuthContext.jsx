import { createContext, useContext, useState, useEffect } from 'react';
import { isSheetConfigured } from '../lib/scriptUrl';
import { loginRequest, fetchMe, TOKEN_KEY, USER_KEY } from '../lib/auth';
import { clearLocalRegisters } from '../lib/sync';

const AuthContext = createContext(null);

// Only used when scriptUrl.js has no backend yet, so the UI can still be
// explored. Real logins live in the sheet's Users tab (see google-apps-script.gs).
const DEMO_USERS = [
  { id: 'demo_admin', name: 'Admin User', email: 'admin@risezonic.com', role: 'Admin', avatar: 'AU' },
  { id: 'demo_agent', name: 'Agent Demo', email: 'demo@risezonic.com', role: 'Agent', avatar: 'AD' },
];
const DEMO_PASSWORD = 'demo123';

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    return storedUser && storedToken ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

function storeSession(user, token) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Paint from the cached profile immediately, then confirm with the script:
  // a disabled login, a rotated token (signed in elsewhere) or a role change
  // takes effect on the next page load, not just the next sign-in.
  useEffect(() => {
    const cached = readStoredUser();
    setUser(cached);
    setLoading(false);
    if (!cached || !isSheetConfigured()) return;

    fetchMe().then((fresh) => {
      if (fresh === undefined) return; // offline — keep the cached session
      if (!fresh) {
        clearSession();
        setUser(null);
        return;
      }
      storeSession(fresh, localStorage.getItem(TOKEN_KEY));
      setUser(fresh);
    });
  }, []);

  const login = async (email, password) => {
    if (!isSheetConfigured()) {
      const matched = DEMO_USERS.find((u) => u.email === email.trim().toLowerCase());
      if (!matched || password !== DEMO_PASSWORD) {
        return { success: false, error: `Demo mode — use password: ${DEMO_PASSWORD}` };
      }
      storeSession(matched, `demo_token_${Date.now()}`);
      setUser(matched);
      return { success: true };
    }

    const result = await loginRequest(email.trim(), password);
    if (!result.success) return { success: false, error: result.message || 'Invalid credentials.' };

    clearLocalRegisters();
    storeSession(result.user, result.token);
    setUser(result.user);
    return { success: true };
  };

  const logout = () => {
    clearSession();
    clearLocalRegisters();
    setUser(null);
  };

  /** Called after an admin edits their own name/password so the sidebar updates. */
  const refreshUser = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
