import { useEffect, useState, useCallback } from 'react';
import { listUsers } from '../lib/auth';
import { isSheetConfigured } from '../lib/scriptUrl';
import { useAuth } from '../context/AuthContext';

/**
 * The user list from the sheet's Users tab, for admin screens (the Agents
 * page, the "Assign to" dropdown). Agents get an empty list — the script
 * refuses them the read — so callers should fall back to the signed-in name.
 */
export function useAgents() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!isAdmin || !isSheetConfigured()) return;
    setLoading(true);
    setUsers(await listUsers());
    setLoading(false);
  }, [isAdmin]);

  useEffect(() => { reload(); }, [reload]);

  return { users, loading, reload };
}
