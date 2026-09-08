export type TreeParameters = { pA: number; pBGivenA: number; pBGivenNotA: number; pC?: number };
export type TerminalPath = { key: string; label: string; path: string; probability: number; hasA: boolean; hasB: boolean; hasC: boolean };

export function clampProbability(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

export function buildProbabilityTree(parameters: TreeParameters): TerminalPath[] {
  const pA = clampProbability(parameters.pA);
  const first = [
    { token: "A", probability: pA, hasA: true },
    { token: "Aᶜ", probability: 1 - pA, hasA: false },
  ];
  const twoStage = first.flatMap((branch) => {
    const pB = branch.hasA ? clampProbability(parameters.pBGivenA) : clampProbability(parameters.pBGivenNotA);
    return [
      { key: `${branch.token}B`, label: `${branch.token} ∩ B`, path: `${branch.token} → B`, probability: branch.probability * pB, hasA: branch.hasA, hasB: true, hasC: false },
      { key: `${branch.token}Bc`, label: `${branch.token} ∩ Bᶜ`, path: `${branch.token} → Bᶜ`, probability: branch.probability * (1 - pB), hasA: branch.hasA, hasB: false, hasC: false },
    ];
  });
  if (parameters.pC === undefined) return twoStage;
  const pC = clampProbability(parameters.pC);
  return twoStage.flatMap((branch) => [
    { ...branch, key: `${branch.key}C`, label: `${branch.label} ∩ C`, path: `${branch.path} → C`, probability: branch.probability * pC, hasC: true },
    { ...branch, key: `${branch.key}Cc`, label: `${branch.label} ∩ Cᶜ`, path: `${branch.path} → Cᶜ`, probability: branch.probability * (1 - pC), hasC: false },
  ]);
}

export type TargetEvent = "b" | "aAndB" | "notAAndB" | "c";
export function targetProbability(paths: TerminalPath[], target: TargetEvent) {
  return paths.filter((path) => target === "b" ? path.hasB : target === "aAndB" ? path.hasA && path.hasB : target === "notAAndB" ? !path.hasA && path.hasB : path.hasC).reduce((sum, path) => sum + path.probability, 0);
}
