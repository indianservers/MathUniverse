export type RecursiveRule =
  { kind: "affine"; m: number; b: number } | { kind: "logistic"; r: number };

const clean = (value: number, precision = 6) =>
  Number(value.toFixed(precision));

export function parseRecursiveRule(source: string): RecursiveRule | null {
  const text = source
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("aₙ₋₁", "a")
    .replaceAll("a_n-1", "a")
    .replaceAll("*", "");
  const logistic = text.match(/^([+-]?\d*\.?\d+)a\(1-a\)$/);
  if (logistic) {
    const r = Number(logistic[1]);
    return Number.isFinite(r) ? { kind: "logistic", r } : null;
  }
  const affine = text.match(/^([+-]?\d*\.?\d*)a(?:([+-]\d*\.?\d+))?$/);
  if (!affine) return null;
  const m =
      affine[1] === "" || affine[1] === "+"
        ? 1
        : affine[1] === "-"
          ? -1
          : Number(affine[1]),
    b = Number(affine[2] ?? 0);
  return Number.isFinite(m) && Number.isFinite(b)
    ? { kind: "affine", m, b }
    : null;
}

export function applyRecursiveRule(rule: RecursiveRule, value: number) {
  return rule.kind === "affine"
    ? rule.m * value + rule.b
    : rule.r * value * (1 - value);
}

export function recursiveRuleLabel(rule: RecursiveRule) {
  return rule.kind === "affine"
    ? `${clean(rule.m)}aₙ₋₁ ${rule.b < 0 ? "−" : "+"} ${Math.abs(clean(rule.b))}`
    : `${clean(rule.r)}aₙ₋₁(1−aₙ₋₁)`;
}

export function recursiveSequenceAnalysis(
  rule: RecursiveRule,
  initialValue: number,
  countValue = 10,
) {
  const initial = Number.isFinite(initialValue) ? initialValue : 0,
    count = Math.max(2, Math.min(500, Math.round(countValue))),
    terms = [initial];
  for (let index = 1; index < count; index += 1)
    terms.push(applyRecursiveRule(rule, terms[index - 1]));
  let fixed: number | null = null,
    stable = false,
    behavior = "Divergent";
  if (rule.kind === "affine") {
    if (Math.abs(1 - rule.m) > 1e-10) fixed = rule.b / (1 - rule.m);
    stable = Math.abs(rule.m) < 1;
    behavior = stable
      ? "Convergent"
      : rule.m === 1 && rule.b === 0
        ? "Constant"
        : rule.m === -1
          ? "Period-2 cycle"
          : "Divergent";
  } else {
    fixed = rule.r === 0 ? 0 : 1 - 1 / rule.r;
    const probe = [initial];
    for (let index = 1; index < 120; index += 1)
      probe.push(applyRecursiveRule(rule, probe[index - 1]));
    const last = probe.at(-1)!,
      previous = probe.at(-2)!,
      twoBack = probe.at(-3)!;
    behavior =
      Math.abs(last - previous) < 1e-7
        ? "Convergent"
        : Math.abs(last - twoBack) < 1e-7
          ? "Period-2 cycle"
          : probe.some(
                (value) => !Number.isFinite(value) || Math.abs(value) > 1e12,
              )
            ? "Divergent"
            : "Bounded nonlinear";
    stable = behavior === "Convergent";
  }
  const errors = terms.map((value) =>
      fixed === null ? Number.NaN : Math.abs(value - fixed),
    ),
    monotonic = terms.every(
      (value, index) => !index || value >= terms[index - 1],
    )
      ? "Increasing"
      : terms.every((value, index) => !index || value <= terms[index - 1])
        ? "Decreasing"
        : "No";
  return {
    rule,
    initial,
    count,
    terms,
    fixed,
    stable,
    behavior,
    errors,
    monotonic,
  };
}
