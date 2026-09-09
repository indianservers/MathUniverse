export type IdentityTile106 = {
  id: string;
  label: string;
  detail: string;
  className: string;
};

export type IdentityPractice106 = {
  variable: string;
  constant: number;
  answer: string;
};

export const IDENTITY_TILES_106: IdentityTile106[] = [
  { id: "x2", label: "x²", detail: "x · x = x²", className: "blue" },
  { id: "top-2x", label: "2x", detail: "x · 2 = 2x", className: "green" },
  { id: "left-2x", label: "2x", detail: "2 · x = 2x", className: "yellow" },
  { id: "four", label: "4", detail: "2 · 2 = 4", className: "red" },
];

export const IDENTITY_PRACTICES_106: IdentityPractice106[] = [
  { variable: "y", constant: 3, answer: "y² + 6y + 9" },
  { variable: "a", constant: 4, answer: "a² + 8a + 16" },
];

export function calculateSquareIdentity106(x: number, constant = 2) {
  const xSquared = x ** 2;
  const rectangle = constant * x;
  const constantSquared = constant ** 2;
  return {
    side: x + constant,
    xSquared,
    rectangle,
    constantSquared,
    partitionTotal: xSquared + rectangle + rectangle + constantSquared,
    squareTotal: (x + constant) ** 2,
  };
}

export function sampleSquareIdentity106(values: number[], constant = 2) {
  return values.map((value) => {
    const result = calculateSquareIdentity106(value, constant);
    return {
      value,
      left: result.squareTotal,
      right: result.partitionTotal,
      matches: result.squareTotal === result.partitionTotal,
    };
  });
}

export function normalizeIdentityAnswer106(value: string) {
  return value
    .toLowerCase()
    .replaceAll("^2", "²")
    .replaceAll("−", "-")
    .replace(/\s+/g, "");
}

export function isIdentityPracticeCorrect106(
  answer: string,
  practice: IdentityPractice106,
) {
  return (
    normalizeIdentityAnswer106(answer) ===
    normalizeIdentityAnswer106(practice.answer)
  );
}

export function isIdentityTileDrop106(payload: string) {
  return (
    payload.trim() !== "" &&
    IDENTITY_TILES_106.some((tile) => tile.id === payload)
  );
}

export function identityPracticeExpansion106(practice: IdentityPractice106) {
  const middleTerm = 2 * practice.constant;
  return `${practice.variable}² + ${middleTerm}${practice.variable} + ${practice.constant ** 2}`;
}
