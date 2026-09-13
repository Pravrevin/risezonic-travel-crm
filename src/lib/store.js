/**
 * Generic localStorage-backed record store with a subscribe/notify loop and
 * "dirty" tracking for offline-safe sheet writes.
 *
 * Every entity (leads, calls, bookings, follow-ups) gets its own instance of
 * this via createStore(). The Google Sheet is the source of truth once
 * configured — localStorage is only a cache so screens paint instantly and
 * survive a sheet write that fails. See lib/sync.js for the hydrate pull and
 * lib/sheetClient.js for the wire format.
 */
export function createStore({ storageKey, dirtyKey, makeId }) {
  let cache = null;
  let dirty = null;
  const listeners = new Set();

  function read() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch {
      /* unreadable storage — start clean */
    }
    return [];
  }

  function write(rows) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(rows));
    } catch {
      /* storage may be unavailable in private mode — keep the in-memory copy */
    }
  }

  function dirtyIds() {
    if (!dirty) {
      try {
        const raw = localStorage.getItem(dirtyKey);
        dirty = new Set(raw ? JSON.parse(raw) : []);
      } catch {
        dirty = new Set();
      }
    }
    return dirty;
  }

  function writeDirty(ids) {
    try {
      localStorage.setItem(dirtyKey, JSON.stringify([...ids]));
    } catch {
      /* keep the in-memory copy */
    }
  }

  function current() {
    if (!cache) cache = read();
    return cache;
  }

  function commit(rows) {
    cache = rows;
    write(rows);
    listeners.forEach((fn) => fn());
  }

  return {
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    all() {
      return current();
    },
    get(id) {
      return current().find((row) => row.id === id);
    },
    /** `draft.id` is used verbatim when present (e.g. a booking's human-friendly RZ##### id); otherwise one is generated. */
    create(draft) {
      const row = { ...draft, id: draft.id || makeId(), createdAt: new Date().toISOString() };
      commit([row, ...current()]);
      return row;
    },
    update(id, patch) {
      commit(current().map((row) => (row.id === id ? { ...row, ...patch, id: row.id } : row)));
      return current().find((row) => row.id === id);
    },
    remove(id) {
      commit(current().filter((row) => row.id !== id));
    },
    /**
     * Replaces the register with rows loaded from the Google Sheet.
     *
     * Local-only records are kept: if a save reached localStorage but never
     * made it to the sheet, hydrating must not silently delete it. Anything
     * present in both is taken from the sheet, which is authoritative.
     */
    hydrate(rows) {
      const fromSheet = new Set(rows.map((row) => row.id));
      const unsynced = current().filter((row) => !fromSheet.has(row.id) && dirtyIds().has(row.id));
      commit([...unsynced, ...rows]);
    },
    /** Flag a record whose sheet push failed, so hydrate does not drop it. */
    markUnsynced(id) {
      const ids = dirtyIds();
      if (ids.has(id)) return;
      ids.add(id);
      writeDirty(ids);
    },
    /** Clear the flag once the record has reached the sheet. */
    markSynced(id) {
      const ids = dirtyIds();
      if (!ids.delete(id)) return;
      writeDirty(ids);
    },
    /** True while any record is still waiting to reach the sheet. */
    hasUnsynced() {
      return dirtyIds().size > 0;
    },
    reset() {
      commit([]);
    },
  };
}

export function makeId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
