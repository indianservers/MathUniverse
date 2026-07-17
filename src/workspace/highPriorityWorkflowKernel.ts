export type WorkflowObjectType = "point" | "line" | "circle" | "polygon" | "arc" | "locus" | "algebra" | "3d" | "image" | "slider";

export type ProtocolStepModel = {
  id: string;
  label: string;
  detail: string;
  dependencies?: string[];
  visible?: boolean;
  pinned?: boolean;
  createdAt: number;
};

export type ProtocolColumn = "index" | "label" | "detail" | "dependencies" | "createdAt" | "visibility";

export type ProtocolPlaybackPlan = {
  steps: ProtocolStepModel[];
  columns: ProtocolColumn[];
  cursor: number;
  canReorder: boolean;
  blockedReorders: string[];
  replayLabels: string[];
};

export type StyleBarControl =
  | "color"
  | "fill"
  | "opacity"
  | "stroke"
  | "labelMode"
  | "trace"
  | "lock"
  | "layer"
  | "font"
  | "pointStyle"
  | "material";

export type ContextMenuAction =
  | "rename"
  | "edit-definition"
  | "properties"
  | "trace"
  | "animation"
  | "duplicate"
  | "delete"
  | "export-selected"
  | "create-locus"
  | "measure"
  | "attach-note"
  | "calibrate-image";

export type SliderObject = {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  playing: boolean;
  speed: number;
  easing: "linear" | "ease-in-out";
  boundObjects: string[];
};

export type SnapCandidate = {
  id: string;
  label: string;
  priority: number;
  x: number;
  y: number;
  constraint?: "grid" | "point" | "intersection" | "object" | "midpoint";
};

export type ImageWorkflowSpec = {
  actions: string[];
  canAttachToPoints: boolean;
  canExportWithWorkspace: boolean;
  calibrationModes: string[];
};

export type ExportPreset = {
  id: "png-2x" | "png-transparent" | "svg-selected" | "pdf-worksheet" | "json-project" | "ggb-lite";
  label: string;
  format: "png" | "svg" | "pdf" | "json" | "zip";
  quality: "standard" | "high" | "print";
  transparent?: boolean;
  selectedRegion?: boolean;
  answerKey?: boolean;
};

export type ProjectLibraryMetadata = {
  id: string;
  title: string;
  folder: string;
  tags: string[];
  thumbnail?: string;
  version: number;
  parentId?: string;
  savedAt: number;
};

export type TabletControlSpec = {
  toolDock: "large" | "compact";
  penMode: boolean;
  twoFingerPanZoom: boolean;
  longPressContextMenuMs: number;
  touchHandleSize: number;
};

const defaultColumns: ProtocolColumn[] = ["index", "label", "detail", "dependencies", "createdAt", "visibility"];

export function createProtocolPlaybackPlan(steps: ProtocolStepModel[], options: { cursor?: number; hiddenColumns?: ProtocolColumn[] } = {}): ProtocolPlaybackPlan {
  const normalized = dependencySafeProtocolOrder(steps);
  const hidden = new Set(options.hiddenColumns ?? []);
  const columns = defaultColumns.filter((column) => !hidden.has(column));
  const blockedReorders = invalidReorders(steps);
  const cursor = Math.max(0, Math.min(options.cursor ?? normalized.length - 1, Math.max(0, normalized.length - 1)));
  return {
    steps: normalized,
    columns,
    cursor,
    canReorder: blockedReorders.length === 0,
    blockedReorders,
    replayLabels: normalized.slice(0, cursor + 1).map((step, index) => `${index + 1}. ${step.label}`),
  };
}

export function styleBarForObject(type: WorkflowObjectType): StyleBarControl[] {
  const shared: StyleBarControl[] = ["color", "opacity", "labelMode", "trace", "lock", "layer"];
  if (type === "point") return [...shared, "pointStyle", "font"];
  if (type === "line" || type === "locus") return [...shared, "stroke", "font"];
  if (type === "circle" || type === "polygon" || type === "arc") return [...shared, "stroke", "fill", "font"];
  if (type === "3d") return ["color", "opacity", "labelMode", "trace", "lock", "layer", "material"];
  if (type === "image") return ["opacity", "lock", "layer"];
  return ["color", "labelMode", "trace", "lock", "font"];
}

export function contextMenuForObject(type: WorkflowObjectType): ContextMenuAction[] {
  const shared: ContextMenuAction[] = ["rename", "properties", "duplicate", "delete", "export-selected", "attach-note"];
  if (type === "algebra") return ["rename", "edit-definition", "properties", "trace", "animation", "duplicate", "delete", "export-selected", "attach-note"];
  if (type === "3d") return ["rename", "properties", "trace", "animation", "duplicate", "delete", "export-selected", "measure", "attach-note"];
  if (type === "image") return ["rename", "properties", "duplicate", "delete", "export-selected", "attach-note", "calibrate-image"];
  if (type === "point" || type === "locus") return [...shared, "trace", "animation", "create-locus", "measure"];
  return [...shared, "trace", "measure"];
}

export function createSliderObject(name: string, config: Partial<Omit<SliderObject, "id" | "name">> = {}): SliderObject {
  const min = config.min ?? -5;
  const max = config.max ?? 5;
  const step = Math.abs(config.step ?? 0.1) || 0.1;
  const value = clamp(config.value ?? 0, min, max);
  return {
    id: `slider-${name.trim() || "a"}`,
    name: name.trim() || "a",
    value,
    min,
    max,
    step,
    playing: config.playing ?? false,
    speed: config.speed ?? 1,
    easing: config.easing ?? "linear",
    boundObjects: config.boundObjects ?? [],
  };
}

export function advanceSlider(slider: SliderObject, deltaSeconds: number): SliderObject {
  if (!slider.playing) return slider;
  const span = slider.max - slider.min || 1;
  const raw = slider.value + slider.step * slider.speed * Math.max(0, deltaSeconds) * 10;
  const wrapped = slider.min + ((((raw - slider.min) % span) + span) % span);
  return { ...slider, value: roundToStep(wrapped, slider.step) };
}

export function rankSnapCandidates(pointer: { x: number; y: number }, candidates: SnapCandidate[]) {
  return [...candidates]
    .map((candidate) => ({ ...candidate, distance: Math.hypot(pointer.x - candidate.x, pointer.y - candidate.y) }))
    .sort((a, b) => b.priority - a.priority || a.distance - b.distance)
    .slice(0, 8);
}

export function imageWorkflowSpec(): ImageWorkflowSpec {
  return {
    actions: ["add", "drag", "resize", "opacity", "lock", "attach-to-points", "calibrate-scale", "export-with-images"],
    canAttachToPoints: true,
    canExportWithWorkspace: true,
    calibrationModes: ["two-point distance", "axis alignment", "opacity overlay"],
  };
}

export function exportPresets(): ExportPreset[] {
  return [
    { id: "png-2x", label: "High-resolution PNG", format: "png", quality: "high" },
    { id: "png-transparent", label: "Transparent PNG", format: "png", quality: "high", transparent: true },
    { id: "svg-selected", label: "Selected region SVG", format: "svg", quality: "print", selectedRegion: true },
    { id: "pdf-worksheet", label: "Worksheet PDF with answer key", format: "pdf", quality: "print", answerKey: true },
    { id: "json-project", label: "Browser JSON project", format: "json", quality: "standard" },
    { id: "ggb-lite", label: "Geometry exchange bundle", format: "zip", quality: "standard" },
  ];
}

export function createProjectMetadata(input: Partial<ProjectLibraryMetadata>): ProjectLibraryMetadata {
  return {
    id: input.id ?? `project-${Date.now()}`,
    title: input.title?.trim() || "Untitled workspace",
    folder: input.folder?.trim() || "My projects",
    tags: input.tags ?? [],
    thumbnail: input.thumbnail,
    version: Math.max(1, Math.round(input.version ?? 1)),
    parentId: input.parentId,
    savedAt: input.savedAt ?? Date.now(),
  };
}

export function searchProjectMetadata(projects: ProjectLibraryMetadata[], query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return projects;
  return projects.filter((project) => {
    const haystack = [project.title, project.folder, ...project.tags].join(" ").toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export function tabletControlSpec(pointer: "mouse" | "touch" | "pen" = "touch"): TabletControlSpec {
  return {
    toolDock: pointer === "mouse" ? "compact" : "large",
    penMode: pointer === "pen",
    twoFingerPanZoom: true,
    longPressContextMenuMs: pointer === "mouse" ? 0 : 450,
    touchHandleSize: pointer === "mouse" ? 28 : 44,
  };
}

function dependencySafeProtocolOrder(steps: ProtocolStepModel[]) {
  const byId = new Map(steps.map((step) => [step.id, step]));
  const visited = new Set<string>();
  const output: ProtocolStepModel[] = [];
  const visit = (step: ProtocolStepModel) => {
    if (visited.has(step.id)) return;
    (step.dependencies ?? []).forEach((id) => {
      const dependency = byId.get(id);
      if (dependency) visit(dependency);
    });
    visited.add(step.id);
    output.push({ ...step, visible: step.visible !== false });
  };
  steps.forEach(visit);
  return output;
}

function invalidReorders(steps: ProtocolStepModel[]) {
  const index = new Map(steps.map((step, itemIndex) => [step.id, itemIndex]));
  return steps.flatMap((step, itemIndex) => (step.dependencies ?? [])
    .filter((dependency) => (index.get(dependency) ?? -1) > itemIndex)
    .map((dependency) => `${step.label} appears before dependency ${dependency}`));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundToStep(value: number, step: number) {
  return Math.round(value / step) * step;
}
