export type MatrixLessonMode =
  | "builder"
  | "addition-subtraction"
  | "scalar-multiplication"
  | "matrix-multiplication"
  | "identity"
  | "transpose"
  | "determinant"
  | "inverse"
  | "row-operations"
  | "rref"
  | "augmented"
  | "linear-transformations"
  | "eigen-directions"
  | "basis-dimension"
  | "linear-independence"
  | "vector-spaces"
  | "gram-schmidt"
  | "least-squares";

export type MatrixLessonPreset = {
  lessonId: number;
  id: `matrix.${MatrixLessonMode}`;
  mode: MatrixLessonMode;
};

const modeByLessonId = {
  347: "builder",
  348: "addition-subtraction",
  349: "scalar-multiplication",
  350: "matrix-multiplication",
  351: "identity",
  352: "transpose",
  353: "determinant",
  354: "inverse",
  355: "row-operations",
  356: "rref",
  357: "augmented",
  358: "linear-transformations",
  359: "eigen-directions",
  360: "basis-dimension",
  361: "linear-independence",
  362: "vector-spaces",
  363: "gram-schmidt",
  364: "least-squares",
} as const satisfies Record<number, MatrixLessonMode>;

export const matrixLessonPresets: readonly MatrixLessonPreset[] = Object.freeze(
  Object.entries(modeByLessonId).map(([lessonId, mode]) => ({
    lessonId: Number(lessonId),
    id: `matrix.${mode}` as MatrixLessonPreset["id"],
    mode,
  })),
);

const byLessonId = new Map(
  matrixLessonPresets.map((preset) => [preset.lessonId, preset]),
);

export function matrixLessonPreset(lessonId: number) {
  const preset = byLessonId.get(lessonId);
  if (!preset) throw new Error(`Missing matrix lesson preset for ${lessonId}`);
  return preset;
}
