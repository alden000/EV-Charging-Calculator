import { useEffect, useRef, useState } from "react";

/**
 * Like useState, but reads its initial value from localStorage (if present)
 * and writes back on every change, so the last-used value is restored the
 * next time the app loads.
 */
export function usePersistentState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return defaultValue;
      const parsed = JSON.parse(raw);
      if (typeof defaultValue === "object" && defaultValue !== null && !Array.isArray(defaultValue)) {
        return { ...defaultValue, ...parsed } as T;
      }
      return parsed as T;
    } catch {
      return defaultValue;
    }
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be unavailable (private browsing, quota exceeded) — fail silently.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
