export type DiscreteWorldSnapshot = {
  automataInput: string;
  grammarTarget: string;
  turingInput: string;
  savedAt: string;
};

const storageKey = "math-universe-discrete-world-session";

export function loadDiscreteSnapshot(): DiscreteWorldSnapshot | null {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DiscreteWorldSnapshot;
  } catch {
    return null;
  }
}

export function saveDiscreteSnapshot(snapshot: Omit<DiscreteWorldSnapshot, "savedAt">) {
  localStorage.setItem(storageKey, JSON.stringify({ ...snapshot, savedAt: new Date().toISOString() }));
}
