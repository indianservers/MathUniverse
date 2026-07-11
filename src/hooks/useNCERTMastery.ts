import { useCallback, useMemo, useState } from "react";

export type NCERTMasteryRecord = {
  attempted: number;
  correct: number;
  currentStreak: number;
  lastAttemptedAt?: string;
  difficultyAttempts: Record<string, { attempted: number; correct: number }>;
};

export type NCERTMasteryStore = Record<string, NCERTMasteryRecord>;

export const NCERT_MASTERY_STORAGE_KEY = "mathUniverse:ncertMastery:v1";

export function emptyMasteryRecord(): NCERTMasteryRecord {
  return { attempted: 0, correct: 0, currentStreak: 0, difficultyAttempts: {} };
}

export function masteryPercent(record: NCERTMasteryRecord) {
  if (record.attempted === 0) return 0;
  const accuracy = record.correct / record.attempted;
  const volume = Math.min(1, record.attempted / 8);
  return Math.round(100 * (accuracy * 0.75 + volume * 0.25));
}

export function masteryStatus(record: NCERTMasteryRecord) {
  const percent = masteryPercent(record);
  if (record.attempted === 0) return "Not started";
  if (percent >= 90 && record.currentStreak >= 4) return "Mastered";
  if (percent >= 75) return "Strong";
  if (percent >= 45) return "Improving";
  return "Practicing";
}

export function readNCERTMasteryStore(): NCERTMasteryStore {
  try {
    const raw = window.localStorage.getItem(NCERT_MASTERY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeNCERTMasteryStore(store: NCERTMasteryStore) {
  try {
    window.localStorage.setItem(NCERT_MASTERY_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Local storage can be unavailable in private mode or SSR-like tests.
  }
}

export function updateNCERTMasteryRecord(record: NCERTMasteryRecord, difficulty: string, correct: boolean): NCERTMasteryRecord {
  const difficultyRecord = record.difficultyAttempts[difficulty] ?? { attempted: 0, correct: 0 };
  return {
    attempted: record.attempted + 1,
    correct: record.correct + (correct ? 1 : 0),
    currentStreak: correct ? record.currentStreak + 1 : 0,
    lastAttemptedAt: new Date().toISOString(),
    difficultyAttempts: {
      ...record.difficultyAttempts,
      [difficulty]: {
        attempted: difficultyRecord.attempted + 1,
        correct: difficultyRecord.correct + (correct ? 1 : 0),
      },
    },
  };
}

export function useNCERTMastery(conceptId?: string) {
  const [store, setStore] = useState<NCERTMasteryStore>(() => {
    if (typeof window === "undefined") return {};
    return readNCERTMasteryStore();
  });
  const record = conceptId ? store[conceptId] ?? emptyMasteryRecord() : emptyMasteryRecord();

  const recordAttempt = useCallback((difficulty: string, correct: boolean) => {
    if (!conceptId) return;
    setStore((current) => {
      const next = {
        ...current,
        [conceptId]: updateNCERTMasteryRecord(current[conceptId] ?? emptyMasteryRecord(), difficulty, correct),
      };
      writeNCERTMasteryStore(next);
      return next;
    });
  }, [conceptId]);

  const reset = useCallback(() => {
    if (!conceptId) return;
    setStore((current) => {
      const next = { ...current };
      delete next[conceptId];
      writeNCERTMasteryStore(next);
      return next;
    });
  }, [conceptId]);

  return useMemo(() => ({
    record,
    percent: masteryPercent(record),
    status: masteryStatus(record),
    recordAttempt,
    reset,
    store,
  }), [record, recordAttempt, reset, store]);
}
