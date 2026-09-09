export type FactorPair97 = [number, number];

export type FactorisationChallenge97 = {
  variable: string;
  sum: number;
  product: number;
  pair: FactorPair97;
};

export const FACTORISATION_CHALLENGES_97: FactorisationChallenge97[] = [
  { variable: "y", sum: 7, product: 10, pair: [5, 2] },
  { variable: "a", sum: 8, product: 15, pair: [3, 5] },
  { variable: "m", sum: 9, product: 20, pair: [4, 5] },
];

export const factorSignTerm97 = (coefficient: number, suffix = "") =>
  `${coefficient < 0 ? "−" : "+"} ${Math.abs(coefficient)}${suffix}`;

export const quadraticExpression97 = (
  variable: string,
  sum: number,
  product: number,
) =>
  `${variable}² ${factorSignTerm97(sum, variable)} ${factorSignTerm97(product)}`;

export const factor97 = (variable: string, value: number) =>
  `(${variable} ${value < 0 ? "−" : "+"} ${Math.abs(value)})`;

export const factorForm97 = (variable: string, pair: FactorPair97) =>
  `${factor97(variable, pair[0])}${factor97(variable, pair[1])}`;

export const factorPairKey97 = (pair: FactorPair97) => `${pair[0]},${pair[1]}`;

export const factorPairLabel97 = (pair: FactorPair97) =>
  `(${pair[0]}, ${pair[1]})`;

export const factorPairMath97 = (
  pair: FactorPair97,
  operation: "product" | "sum",
) =>
  operation === "product"
    ? `${pair[0]} × ${pair[1]} = ${pair[0] * pair[1]}`
    : `${pair[0]} + ${pair[1]} = ${pair[0] + pair[1]}`;

export function findFactorPair97(
  product: number,
  sum: number,
): FactorPair97 | null {
  for (let first = -36; first <= 36; first += 1) {
    const second = sum - first;
    if (first <= second && first * second === product) return [first, second];
  }
  return null;
}

export function factorPairCandidates97(
  product: number,
  sum: number,
  correct: FactorPair97 | null,
): FactorPair97[] {
  const candidates: FactorPair97[] = [[1, product]];
  if (correct) candidates.push(correct);
  else candidates.push([Math.floor(sum / 2), Math.ceil(sum / 2)]);
  const last: FactorPair97 = correct
    ? correct[0] >= 0 && correct[1] >= 0
      ? [-correct[0], -correct[1]]
      : [Math.abs(correct[0]), Math.abs(correct[1])]
    : [-1, -product];
  candidates.push(last);
  return candidates
    .filter(
      (pair, index, all) =>
        all.findIndex(
          (item) => factorPairKey97(item) === factorPairKey97(pair),
        ) === index,
    )
    .slice(0, 3);
}

export const splitQuadratic97 = (
  variable: string,
  pair: FactorPair97,
  product: number,
) =>
  `${variable}² ${factorSignTerm97(pair[0], variable)} ${factorSignTerm97(pair[1], variable)} ${factorSignTerm97(product)}`;

export function factorisationValues97(
  sum: number,
  product: number,
  pair: FactorPair97,
  value: number,
) {
  const original = value ** 2 + sum * value + product;
  const factored = (value + pair[0]) * (value + pair[1]);
  const pairCorrect =
    pair[0] + pair[1] === sum && pair[0] * pair[1] === product;
  return {
    original,
    factored,
    equivalent: pairCorrect && original === factored,
  };
}

export function isFactorisationAnswer97(
  answer: string,
  variable: string,
  pair: FactorPair97,
) {
  const normalize = (value: string) =>
    value.replace(/\s/g, "").replace(/-/g, "−").toLowerCase();
  return [pair, [pair[1], pair[0]] as FactorPair97].some(
    (candidate) =>
      normalize(answer) === normalize(factorForm97(variable, candidate)),
  );
}

export const isAreaDropCorrect97 = (term: string, expected: string) =>
  term === expected;
