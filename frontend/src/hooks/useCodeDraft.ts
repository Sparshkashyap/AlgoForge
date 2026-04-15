import { useEffect } from "react";

type Params = {
  storageKey: string;
  code: string;
};

export const useCodeDraft = ({ storageKey, code }: Params) => {
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, code);
  }, [storageKey, code]);

  const clearDraft = () => {
    if (!storageKey) return;
    localStorage.removeItem(storageKey);
  };

  const getDraft = () => {
    if (!storageKey) return null;
    return localStorage.getItem(storageKey);
  };

  return { clearDraft, getDraft };
};