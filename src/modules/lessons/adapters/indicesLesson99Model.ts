const SUPERSCRIPT_DIGITS_99: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "-": "⁻",
};

const PLAIN_DIGITS_99 = Object.fromEntries(
  Object.entries(SUPERSCRIPT_DIGITS_99).map(([plain, raised]) => [
    raised,
    plain,
  ]),
);

export const superscript99 = (value: number) =>
  String(value)
    .split("")
    .map((digit) => SUPERSCRIPT_DIGITS_99[digit] ?? digit)
    .join("");

export const power99 = (base: string, exponent: number) =>
  `${base}${superscript99(exponent)}`;

export const repeatedFactors99 = (base: string, exponent: number) =>
  Array.from({ length: Math.max(0, exponent) }, () => base).join(" × ");

export const productOfPowers99 = (
  base: string,
  firstExponent: number,
  secondExponent: number,
) => ({
  first: power99(base, firstExponent),
  second: power99(base, secondExponent),
  combinedExponent: firstExponent + secondExponent,
  result: power99(base, firstExponent + secondExponent),
});

export function exponentLawValues99(
  value: number,
  firstExponent: number,
  secondExponent: number,
) {
  const left = value ** firstExponent * value ** secondExponent;
  const right = value ** (firstExponent + secondExponent);
  return { left, right, equal: left === right };
}

export function isPowerAnswer99(
  answer: string,
  base: string,
  exponent: number,
) {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/\^/g, "")
      .split("")
      .map((character) => PLAIN_DIGITS_99[character] ?? character)
      .join("");
  return normalize(answer) === normalize(power99(base, exponent));
}

export function isIndexFactorSource99(
  source: string,
  firstExponent: number,
  secondExponent: number,
) {
  const match = /^(blue|purple)-(\d+)$/.exec(source);
  if (!match) return false;
  const index = Number(match[2]);
  const limit = match[1] === "blue" ? firstExponent : secondExponent;
  return index >= 1 && index <= limit;
}
