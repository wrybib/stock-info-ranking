import type { CustomLanguage, DisplayMode, RiskLevel } from '../types';

/** Shape of the app-settings blob persisted under 'sp.settings'. */
export interface AppSettings {
  language?: string;
  customLanguages?: Record<string, CustomLanguage>;
  currencyCode?: string;
  displayMode?: DisplayMode;
  riskLevel?: RiskLevel;
}

/** Read + parse JSON from localStorage; returns the fallback on any failure
 *  (missing key, private browsing, corrupted data). Never throws. */
export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Serialize + write JSON to localStorage; silently ignores failures
 *  (quota exceeded, storage disabled). Never throws. */
export function saveJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — app still works, just without persistence */
  }
}
