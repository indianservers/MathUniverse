export type TrialOutcome = "S" | "F" | "O";
export interface TrialSettings { n: number; p: number; fatigue: boolean; depletion: boolean; third: boolean }
export interface TrialProbabilities { success: number; failure: number; other: number }
export interface TrialRecord extends TrialProbabilities { outcome: TrialOutcome }
export function validateTrials(settings: TrialSettings) {
  if (!Number.isInteger(settings.n) || settings.n < 1 || settings.n > 12 || !Number.isFinite(settings.p) || settings.p < 0 || settings.p > 1) throw new Error("Invalid trial settings");
  if (settings.depletion && (settings.fatigue || settings.third)) throw new Error("The urn experiment is separate from fatigue and foul modes");
}
export function trialProbabilities(settings: TrialSettings, history: TrialOutcome[]): TrialProbabilities {
  validateTrials(settings);
  if (history.length >= 20) throw new Error("Urn exhausted");
  const successes = history.filter(v => v === "S").length;
  const base = settings.depletion ? (Math.round(settings.p * 20) - successes) / (20 - history.length) : settings.p;
  const p = Math.max(0, Math.min(1, base - (settings.fatigue ? .05 * history.length : 0)));
  const other = settings.third ? .1 : 0;
  return { success: (1 - other) * p, failure: (1 - other) * (1 - p), other };
}
export function runTrials(settings: TrialSettings, random: () => number = Math.random): TrialRecord[] {
  validateTrials(settings);
  const records: TrialRecord[] = [];
  for (let i = 0; i < settings.n; i++) {
    const probabilities = trialProbabilities(settings, records.map(r => r.outcome));
    const u = random();
    if (!Number.isFinite(u) || u < 0 || u >= 1) throw new Error("Random sample must lie in [0,1)");
    const outcome = u < probabilities.success ? "S" : u < probabilities.success + probabilities.failure ? "F" : "O";
    records.push({ ...probabilities, outcome });
  }
  return records;
}
export function trialTree(settings: TrialSettings, depth = Math.min(3, settings.n)) {
  validateTrials(settings);
  if (!Number.isInteger(depth) || depth < 1 || depth > 3) throw new Error("Tree depth must be 1 to 3");
  const nodes: { path: TrialOutcome[]; probability: number; conditional: number }[] = [{ path: [], probability: 1, conditional: 1 }];
  for (let level = 0; level < depth; level++) {
    for (const parent of nodes.filter(node => node.path.length === level)) {
      if (parent.probability === 0) continue;
      const p = trialProbabilities(settings, parent.path);
      for (const [outcome, conditional] of [["S", p.success], ["F", p.failure], ...(settings.third ? [["O", p.other]] : [])] as [TrialOutcome, number][]) {
        nodes.push({ path: [...parent.path, outcome], probability: parent.probability * conditional, conditional });
      }
    }
  }
  return nodes;
}
