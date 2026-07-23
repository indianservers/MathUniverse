export type SequenceLessonMode =
  | "generator"
  | "arithmetic-sequence"
  | "geometric-sequence"
  | "recursive-sequence"
  | "fibonacci"
  | "sigma"
  | "arithmetic-series"
  | "geometric-series"
  | "convergence"
  | "power-series"
  | "taylor-maclaurin"
  | "binomial-series"
  | "recurrence-model";

export type SequenceLessonPreset = {
  lessonId: number;
  id: `sequence.${SequenceLessonMode}`;
  mode: SequenceLessonMode;
};

const modeByLessonId = {
  334: "generator",
  335: "arithmetic-sequence",
  336: "geometric-sequence",
  337: "recursive-sequence",
  338: "fibonacci",
  339: "sigma",
  340: "arithmetic-series",
  341: "geometric-series",
  342: "convergence",
  343: "power-series",
  344: "taylor-maclaurin",
  345: "binomial-series",
  346: "recurrence-model",
} as const satisfies Record<number, SequenceLessonMode>;

export const sequenceLessonPresets: readonly SequenceLessonPreset[] =
  Object.freeze(
    Object.entries(modeByLessonId).map(([lessonId, mode]) => ({
      lessonId: Number(lessonId),
      id: `sequence.${mode}` as SequenceLessonPreset["id"],
      mode,
    })),
  );

const byLessonId = new Map(
  sequenceLessonPresets.map((preset) => [preset.lessonId, preset]),
);

export function sequenceLessonPreset(lessonId: number) {
  const preset = byLessonId.get(lessonId);
  if (!preset) throw new Error(`Missing sequence lesson preset for ${lessonId}`);
  return preset;
}
