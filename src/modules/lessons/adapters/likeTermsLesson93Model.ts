export type LikeTermsProblem93 = {
  variable: string;
  positive: number;
  negative: number;
  constant: number;
};
export type LikeTermKind93 = "positive" | "negative" | "constant";

export const LIKE_TERMS_PROBLEMS_93: LikeTermsProblem93[] = [
  { variable: "x", positive: 7, negative: 2, constant: 4 },
  { variable: "y", positive: 4, negative: 1, constant: -3 },
  { variable: "a", positive: 3, negative: 1, constant: 6 },
];

export const signedLikeConstant93 = (value: number) =>
  value < 0 ? `− ${Math.abs(value)}` : `+ ${value}`;

export const originalLikeExpression93 = (problem: LikeTermsProblem93) =>
  `${problem.positive}${problem.variable} − ${problem.negative}${problem.variable} ${signedLikeConstant93(problem.constant)}`;

export const likeCoefficient93 = (problem: LikeTermsProblem93) =>
  problem.positive - problem.negative;

export const simplifiedLikeExpression93 = (problem: LikeTermsProblem93) =>
  `${likeCoefficient93(problem)}${problem.variable} ${signedLikeConstant93(problem.constant)}`;

export const evaluateLikeTerms93 = (
  problem: LikeTermsProblem93,
  value: number,
) => likeCoefficient93(problem) * value + problem.constant;

export function addLikeTerm93(
  problem: LikeTermsProblem93,
  kind: LikeTermKind93,
) {
  if (kind === "positive")
    return { ...problem, positive: problem.positive + 1 };
  if (kind === "negative")
    return { ...problem, negative: problem.negative + 1 };
  return { ...problem, constant: problem.constant + 1 };
}

export const isLikePracticeCorrect93 = (value: string) =>
  value.replace(/\s/g, "").replace(/-/g, "−").toLowerCase() === "2a+6";
