export type RecurrenceScenario =
  | "City population model"
  | "Savings with deposits"
  | "Bacteria culture"
  | "Medication decay";

export type RecurrencePreset = {
  r: number;
  k: number;
  initial: number;
  units: string;
  description: string;
};

export const RECURRENCE_PRESETS: Record<RecurrenceScenario, RecurrencePreset> =
  {
    "City population model": {
      r: 1.1,
      k: 0,
      initial: 50000,
      units: "people",
      description:
        "A city's population grows by a constant rate each year due to natural increase and net migration.",
    },
    "Savings with deposits": {
      r: 1.05,
      k: 1000,
      initial: 10000,
      units: "currency",
      description:
        "A savings balance earns interest and receives the same deposit each year.",
    },
    "Bacteria culture": {
      r: 1.4,
      k: 0,
      initial: 1200,
      units: "cells",
      description:
        "A culture multiplies by a constant factor during each observation interval.",
    },
    "Medication decay": {
      r: 0.72,
      k: 20,
      initial: 200,
      units: "mg",
      description:
        "Medication decays between doses and receives a fixed replenishment.",
    },
  };

const clean = (value: number) => {
  const rounded = Number(value.toFixed(6));
  return Object.is(rounded, -0) ? 0 : rounded;
};

export function recurrenceClosedForm(
  initial: number,
  r: number,
  k: number,
  n: number,
) {
  const index = Math.max(0, Math.round(n));
  return clean(
    Math.abs(r - 1) < 1e-10
      ? initial + index * k
      : r ** index * initial + (k * (1 - r ** index)) / (1 - r),
  );
}

export function recurrenceInitialForState(
  desired: number,
  r: number,
  k: number,
  n: number,
) {
  const index = Math.max(0, Math.round(n));
  if (index === 0) return clean(desired);
  if (Math.abs(r) < 1e-10) return null;
  const additive =
    Math.abs(r - 1) < 1e-10 ? index * k : (k * (1 - r ** index)) / (1 - r);
  const initial = (desired - additive) / r ** index;
  return Number.isFinite(initial) ? clean(Math.max(0, initial)) : null;
}

export function recurrenceModellingAnalysis(
  rValue: number,
  kValue: number,
  initialValue: number,
  selectedNValue: number,
  count = 10,
) {
  const r = clean(
      Math.max(-2, Math.min(2, Number.isFinite(rValue) ? rValue : 1)),
    ),
    k = clean(
      Math.max(-1e9, Math.min(1e9, Number.isFinite(kValue) ? kValue : 0)),
    ),
    initial = clean(
      Math.max(
        0,
        Math.min(1e12, Number.isFinite(initialValue) ? initialValue : 0),
      ),
    ),
    steps = Math.max(1, Math.min(30, Math.round(count))),
    selectedN = Math.max(0, Math.min(steps, Math.round(selectedNValue))),
    rawValues = Array.from({ length: steps + 1 }).reduce<number[]>(
      (states, _, index) =>
        index === 0 ? [initial] : [...states, r * states[index - 1] + k],
      [],
    ),
    values = rawValues.map(clean),
    changes = values.map((value, index) =>
      index === 0 ? 0 : clean(value - values[index - 1]),
    ),
    selectedRecursive = clean(rawValues[selectedN]),
    selectedClosed = recurrenceClosedForm(initial, r, k, selectedN),
    difference = clean(Math.abs(selectedRecursive - selectedClosed)),
    equilibrium = Math.abs(1 - r) < 1e-10 ? null : clean(k / (1 - r)),
    stable = Math.abs(r) < 1,
    oscillatory = r < 0,
    minimum = Math.min(0, ...values),
    maximum = Math.max(1, ...values),
    padding = Math.max(1, (maximum - minimum) * 0.08);

  return {
    r,
    k,
    initial,
    selectedN,
    values,
    changes,
    selectedRecursive,
    selectedClosed,
    difference,
    exactMatch: difference < 1e-5,
    equilibrium,
    stable,
    oscillatory,
    plotMin: minimum - padding,
    plotMax: maximum + padding,
  };
}
