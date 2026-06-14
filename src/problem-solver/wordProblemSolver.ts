import type { ProblemClassification, ProblemSolverResult } from "./problemTypes";

type WordProblemMatch = {
  assumptions?: string[];
  method: string;
  result: string;
  steps: string[];
  title: string;
  warnings?: string[];
};

const epsilon = 1e-9;

export function solveWordProblem(classification: ProblemClassification): ProblemSolverResult | null {
  if (classification.kind !== "word-problem") return null;
  const input = classification.rawInput.trim();
  const normalized = input.toLowerCase().replace(/\s+/g, " ");
  const match =
    solveDistanceRateTime(input, normalized) ??
    solvePercentChange(input, normalized) ??
    solveSimpleInterest(input, normalized) ??
    solveRectangle(input, normalized) ??
    solveCircle(input, normalized) ??
    solveRatio(input, normalized) ??
    solveUnitRate(input, normalized);

  if (!match) {
    return {
      kind: "word-problem",
      method: "Word-problem parser",
      title: "Word Problem",
      normalizedInput: classification.normalizedInput,
      result: "Need more structure",
      steps: [
        "Detected a natural-language math problem.",
        "I looked for supported patterns: distance-rate-time, percent change, simple interest, rectangle/circle geometry, ratios, and unit rates.",
        "No reliable pattern matched, so no calculation was made.",
        "Try writing the key values with words such as distance, time, speed, length, width, radius, ratio, principal, rate, or cost.",
      ],
      assumptions: classification.assumptions,
      warnings: [...classification.warnings, "The word-problem parser avoided guessing."],
      canCopy: false,
    };
  }

  return {
    kind: "word-problem",
    method: match.method,
    title: match.title,
    normalizedInput: classification.normalizedInput,
    result: match.result,
    steps: match.steps,
    assumptions: [...classification.assumptions, ...(match.assumptions ?? [])],
    warnings: [...classification.warnings, ...(match.warnings ?? [])],
    canCopy: true,
  };
}

function solveDistanceRateTime(input: string, normalized: string): WordProblemMatch | null {
  let distance = valueWithUnit(normalized, ["km", "kilometer", "kilometers", "m", "meter", "meters", "mile", "miles"]);
  const time = valueWithUnit(normalized, ["hour", "hours", "hr", "hrs", "minute", "minutes", "min", "mins", "second", "seconds", "sec", "secs"]);
  const speed = valueWithUnit(normalized, ["km/h", "kmph", "m/s", "mph"]);
  if (speed && distance && isZero(speed.value - distance.value)) distance = null;

  if (distance && time && !speed) {
    const convertedTime = timeToBaseHours(time.value, time.unit);
    if (!convertedTime) return null;
    const rate = distance.value / convertedTime;
    return {
      title: "Speed / Unit Rate",
      method: "Distance divided by time",
      result: `${formatNumber(rate)} ${distance.unit}/hour`,
      assumptions: ["Speed is computed as distance divided by time."],
      steps: [
        `Problem: ${input}.`,
        `Distance = ${formatNumber(distance.value)} ${distance.unit}.`,
        `Time = ${formatNumber(time.value)} ${time.unit} = ${formatNumber(convertedTime)} hours.`,
        `Speed = distance / time = ${formatNumber(distance.value)} / ${formatNumber(convertedTime)}.`,
        `Final answer: ${formatNumber(rate)} ${distance.unit}/hour.`,
      ],
    };
  }

  if (speed && time && !distance) {
    const convertedTime = timeToBaseHours(time.value, time.unit);
    if (!convertedTime) return null;
    const distanceValue = speed.value * convertedTime;
    const distanceUnit = speed.unit.includes("km") ? "km" : speed.unit.includes("mph") ? "miles" : "meters";
    return {
      title: "Distance",
      method: "Speed multiplied by time",
      result: `${formatNumber(distanceValue)} ${distanceUnit}`,
      assumptions: ["Distance is computed as speed times time."],
      steps: [
        `Problem: ${input}.`,
        `Speed = ${formatNumber(speed.value)} ${speed.unit}.`,
        `Time = ${formatNumber(time.value)} ${time.unit} = ${formatNumber(convertedTime)} hours.`,
        `Distance = speed x time = ${formatNumber(speed.value)} x ${formatNumber(convertedTime)}.`,
        `Final answer: ${formatNumber(distanceValue)} ${distanceUnit}.`,
      ],
    };
  }

  if (distance && speed && !time) {
    const timeValue = distance.value / speed.value;
    return {
      title: "Time",
      method: "Distance divided by speed",
      result: `${formatNumber(timeValue)} hours`,
      assumptions: ["Time is computed as distance divided by speed."],
      steps: [
        `Problem: ${input}.`,
        `Distance = ${formatNumber(distance.value)} ${distance.unit}.`,
        `Speed = ${formatNumber(speed.value)} ${speed.unit}.`,
        `Time = distance / speed = ${formatNumber(distance.value)} / ${formatNumber(speed.value)}.`,
        `Final answer: ${formatNumber(timeValue)} hours.`,
      ],
    };
  }

  return null;
}

function solvePercentChange(input: string, normalized: string): WordProblemMatch | null {
  const match = normalized.match(/(?:from|old|original|initial)\s+(-?\d+(?:\.\d+)?)\s+(?:to|new|final)\s+(-?\d+(?:\.\d+)?)/i)
    ?? normalized.match(/(-?\d+(?:\.\d+)?)\s+(?:to|increased to|decreased to)\s+(-?\d+(?:\.\d+)?)/i);
  if (!match || !/(percent|percentage|increase|decrease|change)/i.test(normalized)) return null;
  const oldValue = Number(match[1]);
  const newValue = Number(match[2]);
  if (isZero(oldValue)) return null;
  const change = newValue - oldValue;
  const percent = (change / oldValue) * 100;
  const direction = percent >= 0 ? "increase" : "decrease";
  return {
    title: "Percent Change",
    method: "Percent change",
    result: `${formatNumber(Math.abs(percent))}% ${direction}`,
    steps: [
      `Problem: ${input}.`,
      `Original value = ${formatNumber(oldValue)}; new value = ${formatNumber(newValue)}.`,
      `Change = new - original = ${formatNumber(newValue)} - ${formatNumber(oldValue)} = ${formatNumber(change)}.`,
      `Percent change = change / original x 100.`,
      `Final answer: ${formatNumber(Math.abs(percent))}% ${direction}.`,
    ],
  };
}

function solveSimpleInterest(input: string, normalized: string): WordProblemMatch | null {
  if (!/(simple interest|principal|interest)/i.test(normalized)) return null;
  const principal = namedNumber(normalized, ["principal", "p"]);
  const rate = namedNumber(normalized, ["rate", "r"]);
  const namedTime = namedNumber(normalized, ["time", "years", "year", "t"]);
  const unitTime = valueWithUnit(normalized, ["year", "years"]);
  const time = namedTime ?? unitTime?.value;
  if (!principal || !rate || !time) return null;
  const interest = (principal * rate * time) / 100;
  const amount = principal + interest;
  return {
    title: "Simple Interest",
    method: "Simple interest formula",
    result: `Interest = ${formatNumber(interest)}, Amount = ${formatNumber(amount)}`,
    assumptions: ["Rate is interpreted as percent per year."],
    steps: [
      `Problem: ${input}.`,
      `Principal P = ${formatNumber(principal)}, rate R = ${formatNumber(rate)}%, time T = ${formatNumber(time)} years.`,
      "Simple interest formula: I = PRT / 100.",
      `I = ${formatNumber(principal)} x ${formatNumber(rate)} x ${formatNumber(time)} / 100 = ${formatNumber(interest)}.`,
      `Amount = P + I = ${formatNumber(principal)} + ${formatNumber(interest)} = ${formatNumber(amount)}.`,
    ],
  };
}

function solveRectangle(input: string, normalized: string): WordProblemMatch | null {
  if (!/(rectangle|rectangular|length|width|breadth|perimeter|area)/i.test(normalized)) return null;
  const length = namedNumber(normalized, ["length", "l"]);
  const width = namedNumber(normalized, ["width", "breadth", "w", "b"]);
  if (!length || !width) return null;
  const area = length * width;
  const perimeter = 2 * (length + width);
  const wantsPerimeter = /perimeter/i.test(normalized) && !/area/i.test(normalized);
  return {
    title: wantsPerimeter ? "Rectangle Perimeter" : "Rectangle Area and Perimeter",
    method: "Rectangle formula",
    result: wantsPerimeter ? `Perimeter = ${formatNumber(perimeter)}` : `Area = ${formatNumber(area)}, Perimeter = ${formatNumber(perimeter)}`,
    steps: [
      `Problem: ${input}.`,
      `Length = ${formatNumber(length)}, width = ${formatNumber(width)}.`,
      `Area = length x width = ${formatNumber(length)} x ${formatNumber(width)} = ${formatNumber(area)}.`,
      `Perimeter = 2(length + width) = 2(${formatNumber(length)} + ${formatNumber(width)}) = ${formatNumber(perimeter)}.`,
      `Final answer: ${wantsPerimeter ? `Perimeter = ${formatNumber(perimeter)}` : `Area = ${formatNumber(area)}, Perimeter = ${formatNumber(perimeter)}`}.`,
    ],
  };
}

function solveCircle(input: string, normalized: string): WordProblemMatch | null {
  if (!/(circle|radius|diameter|circumference|area)/i.test(normalized)) return null;
  const radius = namedNumber(normalized, ["radius", "r"]);
  const diameter = namedNumber(normalized, ["diameter", "d"]);
  const r = radius ?? (diameter ? diameter / 2 : null);
  if (!r) return null;
  const area = Math.PI * r ** 2;
  const circumference = 2 * Math.PI * r;
  const wantsCircumference = /circumference/i.test(normalized) && !/area/i.test(normalized);
  return {
    title: wantsCircumference ? "Circle Circumference" : "Circle Area and Circumference",
    method: "Circle formula",
    result: wantsCircumference ? `Circumference = ${formatNumber(circumference)}` : `Area = ${formatNumber(area)}, Circumference = ${formatNumber(circumference)}`,
    assumptions: ["pi is approximated as Math.PI."],
    steps: [
      `Problem: ${input}.`,
      `Radius r = ${formatNumber(r)}${diameter && !radius ? " because radius = diameter / 2" : ""}.`,
      `Area = pi r^2 = pi x ${formatNumber(r)}^2 = ${formatNumber(area)}.`,
      `Circumference = 2 pi r = 2 x pi x ${formatNumber(r)} = ${formatNumber(circumference)}.`,
      `Final answer: ${wantsCircumference ? `Circumference = ${formatNumber(circumference)}` : `Area = ${formatNumber(area)}, Circumference = ${formatNumber(circumference)}`}.`,
    ],
  };
}

function solveRatio(input: string, normalized: string): WordProblemMatch | null {
  const match = normalized.match(/ratio\s+(?:of\s+)?(-?\d+(?:\.\d+)?)\s+(?:to|:)\s+(-?\d+(?:\.\d+)?)/i)
    ?? normalized.match(/(-?\d+(?:\.\d+)?)\s*:\s*(-?\d+(?:\.\d+)?)/i);
  if (!match) return null;
  const left = Number(match[1]);
  const right = Number(match[2]);
  if (!Number.isInteger(left) || !Number.isInteger(right) || isZero(right)) return null;
  const divisor = gcd(Math.abs(left), Math.abs(right));
  return {
    title: "Ratio",
    method: "Simplify ratio",
    result: `${left / divisor}:${right / divisor}`,
    steps: [
      `Problem: ${input}.`,
      `Original ratio = ${left}:${right}.`,
      `Greatest common divisor = ${divisor}.`,
      `Divide both parts by ${divisor}.`,
      `Final answer: ${left / divisor}:${right / divisor}.`,
    ],
  };
}

function solveUnitRate(input: string, normalized: string): WordProblemMatch | null {
  const match = normalized.match(/(-?\d+(?:\.\d+)?)\s+(?:for|per)\s+(-?\d+(?:\.\d+)?)/i);
  if (!match || /(percent|ratio|from|to)/i.test(normalized)) return null;
  const total = Number(match[1]);
  const count = Number(match[2]);
  if (isZero(count)) return null;
  const rate = total / count;
  return {
    title: "Unit Rate",
    method: "Divide total by number of units",
    result: `${formatNumber(rate)} per 1 unit`,
    steps: [
      `Problem: ${input}.`,
      `Total amount = ${formatNumber(total)} for ${formatNumber(count)} units.`,
      `Unit rate = total / units = ${formatNumber(total)} / ${formatNumber(count)}.`,
      `Final answer: ${formatNumber(rate)} per 1 unit.`,
    ],
  };
}

function namedNumber(text: string, names: string[]): number | null {
  for (const name of names) {
    const escaped = escapeRegExp(name);
    const after = text.match(new RegExp(`\\b${escaped}\\b\\s*(?:is|=|:)?\\s*(-?\\d+(?:\\.\\d+)?)`, "i"));
    if (after) return Number(after[1]);
    const before = text.match(new RegExp(`(-?\\d+(?:\\.\\d+)?)\\s*(?:as\\s+)?\\b${escaped}\\b`, "i"));
    if (before) return Number(before[1]);
  }
  return null;
}

function valueWithUnit(text: string, units: string[]) {
  for (const unit of units) {
    const escaped = escapeRegExp(unit);
    const match = text.match(new RegExp(`(-?\\d+(?:\\.\\d+)?)\\s*${escaped}\\b`, "i"));
    if (match) return { value: Number(match[1]), unit };
  }
  return null;
}

function timeToBaseHours(value: number, unit: string) {
  if (/min/.test(unit)) return value / 60;
  if (/sec/.test(unit)) return value / 3600;
  return value;
}

function gcd(left: number, right: number): number {
  let a = Math.trunc(Math.abs(left));
  let b = Math.trunc(Math.abs(right));
  while (b !== 0) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a || 1;
}

function formatNumber(value: number) {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
}

function isZero(value: number) {
  return Math.abs(value) < epsilon;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
