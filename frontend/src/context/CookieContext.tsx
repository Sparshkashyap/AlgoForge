import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

type CookieContextType = {
  preferences: CookiePreferences | null;
  setPreferences: (prefs: CookiePreferences) => void;
  savePreferences: (prefs: CookiePreferences) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  resetPreferences: () => void;
};

const CookieContext = createContext<CookieContextType | null>(null);

const STORAGE_KEY = "cookie_preferences_v1";

const safeParsePreferences = (value: string | null): CookiePreferences | null => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);

    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferencesState] =
    useState<CookiePreferences | null>(null);

  useEffect(() => {
    const stored = safeParsePreferences(localStorage.getItem(STORAGE_KEY));
    setPreferencesState(stored);
  }, []);

  const setPreferences = (prefs: CookiePreferences) => {
    const nextPrefs: CookiePreferences = {
      necessary: true,
      analytics: Boolean(prefs.analytics),
      marketing: Boolean(prefs.marketing),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPrefs));
    setPreferencesState(nextPrefs);
  };

  const acceptAll = () => {
    setPreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectAll = () => {
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const resetPreferences = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPreferencesState(null);
  };

  const value = useMemo(
    () => ({
      preferences,
      setPreferences,
      savePreferences: setPreferences,
      acceptAll,
      rejectAll,
      resetPreferences,
    }),
    [preferences]
  );

  return (
    <CookieContext.Provider value={value}>
      {children}
    </CookieContext.Provider>
  );
}

export const useCookies = () => {
  const ctx = useContext(CookieContext);

  if (!ctx) {
    throw new Error("useCookies must be used inside CookieProvider");
  }

  return ctx;
};