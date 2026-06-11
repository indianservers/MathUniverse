export type WorkspaceBundle<TWorkspace, TLesson> = {
  schema: "math-universe.workspace-bundle";
  version: 1;
  exportedAt: string;
  workspace: TWorkspace;
  lesson: TLesson;
};

export type WorkspaceExchangeFormat = "json" | "csv" | "png" | "svg" | "pdf" | "url" | "lesson-pack" | "ismobj";

export const workspaceExchangeFormats: Array<{ id: WorkspaceExchangeFormat; label: string; extension: string; mime: string }> = [
  { id: "json", label: "Math Universe JSON", extension: ".json", mime: "application/json" },
  { id: "ismobj", label: "IndianServersMathObject", extension: ".ismobj", mime: "application/vnd.indianservers.mathobject+json" },
  { id: "csv", label: "CSV", extension: ".csv", mime: "text/csv" },
  { id: "png", label: "PNG", extension: ".png", mime: "image/png" },
  { id: "svg", label: "SVG", extension: ".svg", mime: "image/svg+xml" },
  { id: "pdf", label: "PDF worksheet", extension: ".pdf", mime: "application/pdf" },
  { id: "url", label: "Share URL", extension: ".url", mime: "text/uri-list" },
  { id: "lesson-pack", label: "Lesson pack", extension: ".json", mime: "application/json" },
];

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

export function exchangeFormatByExtension(filename: string) {
  const lower = filename.toLowerCase();
  return workspaceExchangeFormats.find((format) => lower.endsWith(format.extension));
}
