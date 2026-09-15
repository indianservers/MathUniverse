import { useEffect, useState } from "react";

export type NumberSenseSession = {
  teacherMode: boolean;
  showAnswers: boolean;
  showMisconceptions: boolean;
  presentation: boolean;
  hintDismissed: boolean;
  xp: number;
  pauseReveal: boolean;
  simpleLanguage: boolean;
};

const KEY = "math-universe-number-sense-lab";
const EVENT = "math-universe-number-sense-session";

const fallback: NumberSenseSession = {
  teacherMode: false,
  showAnswers: true,
  showMisconceptions: true,
  presentation: false,
  hintDismissed: false,
  xp: 0,
  pauseReveal: false,
  simpleLanguage: false,
};

export function readNumberSenseSession(): NumberSenseSession {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...fallback };
    const parsed = JSON.parse(raw) as Partial<NumberSenseSession>;
    return {
      ...fallback,
      ...parsed,
      teacherMode: Boolean(parsed.teacherMode),
      showAnswers: parsed.showAnswers !== false,
      showMisconceptions: parsed.showMisconceptions !== false,
      presentation: Boolean(parsed.presentation),
      hintDismissed: Boolean(parsed.hintDismissed),
      xp: Number(parsed.xp) || 0,
      pauseReveal: Boolean(parsed.pauseReveal),
      simpleLanguage: Boolean(parsed.simpleLanguage),
    };
  } catch {
    return { ...fallback };
  }
}

export function writeNumberSenseSession(patch: Partial<NumberSenseSession>) {
  const next = { ...readNumberSenseSession(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
  return next;
}

export function awardNumberSenseXp(amount = 10) {
  const current = readNumberSenseSession();
  return writeNumberSenseSession({ xp: current.xp + amount });
}

export function onNumberSenseSession(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function useNumberSenseSession() {
  const [session, setSession] = useState(readNumberSenseSession);
  useEffect(() => onNumberSenseSession(() => setSession(readNumberSenseSession())), []);
  return session;
}
