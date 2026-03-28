import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('travel_crm_user');
    const storedToken = localStorage.getItem('travel_crm_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Demo credentials
    const demoUsers = [
      { id: 1, name: 'Admin User', email: 'admin@travelcrm.com', role: 'Admin', avatar: 'AU' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@travelcrm.com', role: 'Manager', avatar: 'SJ' },
      { id: 3, name: 'Agent Demo', email: 'demo@travelcrm.com', role: 'Agent', avatar: 'AD' },
    ];

    if (password === 'demo123') {
      const matchedUser = demoUsers.find(u => u.email === email) || demoUsers[0];
      const token = 'demo_token_' + Date.now();
      localStorage.setItem('travel_crm_token', token);
      localStorage.setItem('travel_crm_user', JSON.stringify(matchedUser));
      setUser(matchedUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Use password: demo123' };
  };

  const logout = () => {
    localStorage.removeItem('travel_crm_token');
    localStorage.removeItem('travel_crm_user');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
