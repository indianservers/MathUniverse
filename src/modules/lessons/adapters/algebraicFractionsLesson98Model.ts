export type AlgebraicFractionPreset98 = {
  id: string;
  variable: string;
  cancelledRoot: number;
  retainedRoot: number;
};

export type AlgebraicFractionPractice98 = Omit<AlgebraicFractionPreset98, "id">;

export const ALGEBRAIC_FRACTION_PRESETS_98: AlgebraicFractionPreset98[] = [
  { id: "difference-one", variable: "x", cancelledRoot: 1, retainedRoot: -1 },
  { id: "difference-four", variable: "x", cancelledRoot: 2, retainedRoot: -2 },
  { id: "quadratic-six", variable: "x", cancelledRoot: -2, retainedRoot: -3 },
  { id: "difference-nine", variable: "x", cancelledRoot: -3, retainedRoot: 3 },
];

export const ALGEBRAIC_FRACTION_PRACTICES_98: AlgebraicFractionPractice98[] = [
  { variable: "y", cancelledRoot: 3, retainedRoot: -3 },
  { variable: "a", cancelledRoot: 2, retainedRoot: -2 },
  { variable: "m", cancelledRoot: -2, retainedRoot: -4 },
];

const minus98 = "−";

export const linearFactor98 = (variable: string, root: number) =>
  `${variable} ${root < 0 ? "+" : minus98} ${Math.abs(root)}`;

const signedTerm98 = (coefficient: number, suffix = "") => {
  if (coefficient === 0) return "";
  const magnitude =
    Math.abs(coefficient) === 1 && suffix ? "" : Math.abs(coefficient);
  return ` ${coefficient < 0 ? minus98 : "+"} ${magnitude}${suffix}`;
};

export const quadraticFromRoots98 = (
  variable: string,
  firstRoot: number,
  secondRoot: number,
) =>
  `${variable}²${signedTerm98(-(firstRoot + secondRoot), variable)}${signedTerm98(firstRoot * secondRoot)}`;

export const algebraicFractionLabel98 = (
  item: AlgebraicFractionPreset98 | AlgebraicFractionPractice98,
) =>
  `${quadraticFromRoots98(item.variable, item.cancelledRoot, item.retainedRoot)} / ${linearFactor98(item.variable, item.cancelledRoot)}`;

export const simplifiedFractionAnswer98 = (
  item: AlgebraicFractionPreset98 | AlgebraicFractionPractice98,
) =>
  `${linearFactor98(item.variable, item.retainedRoot)}, ${item.variable} ≠ ${item.cancelledRoot}`;

export function algebraicFractionValues98(
  item: AlgebraicFractionPreset98 | AlgebraicFractionPractice98,
  value: number,
) {
  const numerator = (value - item.cancelledRoot) * (value - item.retainedRoot);
  const denominator = value - item.cancelledRoot;
  const valid = denominator !== 0;
  const original = valid ? numerator / denominator : null;
  const simplified = value - item.retainedRoot;
  return {
    numerator,
    denominator,
    valid,
    original,
    simplified,
    equivalent: valid && original === simplified,
  };
}

export function isAlgebraicFractionAnswer98(
  answer: string,
  item: AlgebraicFractionPreset98 | AlgebraicFractionPractice98,
) {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/-/g, minus98)
      .replace("!=", "≠");
  return normalize(answer) === normalize(simplifiedFractionAnswer98(item));
}

export const isCommonFactorSource98 = (source: string) =>
  source === "numerator" || source === "denominator";
