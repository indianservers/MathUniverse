export type WorkspaceBundle<TWorkspace, TLesson> = {
  schema: "math-universe.workspace-bundle";
  version: 1;
  exportedAt: string;
  workspace: TWorkspace;
  lesson: TLesson;
};

export type ConstructionTemplate = "triangle" | "circle-theorem" | "parabola-locus";

export function createWorkspaceBundle<TWorkspace, TLesson>(workspace: TWorkspace, lesson: TLesson): WorkspaceBundle<TWorkspace, TLesson> {
  return {
    schema: "math-universe.workspace-bundle",
    version: 1,
    exportedAt: new Date().toISOString(),
    workspace,
    lesson,
  };
}

export function isWorkspaceBundle(value: unknown): value is WorkspaceBundle<unknown, unknown> {
  return Boolean(value && typeof value === "object" && "schema" in value && (value as { schema?: unknown }).schema === "math-universe.workspace-bundle");
}

export function templateLabel(template: ConstructionTemplate) {
  if (template === "triangle") return "Triangle investigation";
  if (template === "circle-theorem") return "Circle theorem setup";
  return "Parabola locus setup";
}
