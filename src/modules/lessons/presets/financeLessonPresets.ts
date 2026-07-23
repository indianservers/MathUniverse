export type FinanceLessonMode =
  | "simple-interest"
  | "compound-interest"
  | "effective-rate"
  | "present-value"
  | "future-value"
  | "annuity"
  | "loan-emi"
  | "amortisation"
  | "depreciation"
  | "inflation"
  | "currency"
  | "profit-margin"
  | "break-even"
  | "tax-discount"
  | "investment-comparison"
  | "model-builder"
  | "linear"
  | "quadratic"
  | "exponential-logistic"
  | "periodic"
  | "piecewise"
  | "parameter-estimation"
  | "dimensional-analysis"
  | "sensitivity"
  | "residual"
  | "scenario"
  | "linear-programming";

export type FinanceLessonPreset = {
  lessonId: number;
  id: `finance.${FinanceLessonMode}`;
  mode: FinanceLessonMode;
};

const modeByLessonId = {
  591: "simple-interest",
  592: "compound-interest",
  593: "effective-rate",
  594: "present-value",
  595: "future-value",
  596: "annuity",
  597: "loan-emi",
  598: "amortisation",
  599: "depreciation",
  600: "inflation",
  601: "currency",
  602: "profit-margin",
  603: "break-even",
  604: "tax-discount",
  605: "investment-comparison",
  606: "model-builder",
  607: "linear",
  608: "quadratic",
  609: "exponential-logistic",
  610: "periodic",
  611: "piecewise",
  612: "parameter-estimation",
  613: "dimensional-analysis",
  614: "sensitivity",
  615: "residual",
  616: "scenario",
  617: "linear-programming",
} as const satisfies Record<number, FinanceLessonMode>;

export const financeLessonPresets: readonly FinanceLessonPreset[] = Object.freeze(
  Object.entries(modeByLessonId).map(([lessonId, mode]) => ({
    lessonId: Number(lessonId),
    id: `finance.${mode}` as FinanceLessonPreset["id"],
    mode,
  })),
);

const byLessonId = new Map(
  financeLessonPresets.map((preset) => [preset.lessonId, preset]),
);

export function financeLessonPreset(lessonId: number) {
  const preset = byLessonId.get(lessonId);
  if (!preset) throw new Error(`Missing finance lesson preset for ${lessonId}`);
  return preset;
}
