import { useEffect, useState } from "react";

export type PrimesSession = {
  teacherMode: boolean;
  presentation: boolean;
  showAnswers: boolean;
  showAlgorithm: boolean;
  showNotation: boolean;
  showMisconceptions: boolean;
  pauseEachStep: boolean;
};

const KEY = "math-universe-primes-lab";
const EVENT = "math-universe-primes-session";

const fallback: PrimesSession = {
  teacherMode: false,
  presentation: false,
  showAnswers: true,
  showAlgorithm: true,
  showNotation: true,
  showMisconceptions: true,
  pauseEachStep: false,
};

export function readPrimesSession(): PrimesSession {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...fallback };
    const parsed = JSON.parse(raw) as Partial<PrimesSession>;
    return {
      ...fallback,
      ...parsed,
      teacherMode: Boolean(parsed.teacherMode),
      presentation: Boolean(parsed.presentation),
      showAnswers: parsed.showAnswers !== false,
      showAlgorithm: parsed.showAlgorithm !== false,
      showNotation: parsed.showNotation !== false,
      showMisconceptions: parsed.showMisconceptions !== false,
      pauseEachStep: Boolean(parsed.pauseEachStep),
    };
  } catch {
    return { ...fallback };
  }
}

export function writePrimesSession(patch: Partial<PrimesSession>) {
  const next = { ...readPrimesSession(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
  return next;
}

export function onPrimesSession(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function usePrimesSession() {
  const [session, setSession] = useState(readPrimesSession);
  useEffect(() => onPrimesSession(() => setSession(readPrimesSession())), []);
  return session;
}
