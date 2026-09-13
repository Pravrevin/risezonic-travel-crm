import { useEffect, useState } from 'react';

/** Subscribes a component to any store created by lib/store.js and re-renders on change. */
export function useStoreList(store) {
  const [rows, setRows] = useState(() => store.all());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setRows(store.all()));
    // Pick up anything written between the initial render and this effect.
    setRows(store.all());
    return unsubscribe;
  }, [store]);

  return rows;
}
