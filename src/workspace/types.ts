export type MathObjectKind =
  | "expression"
  | "equation"
  | "function"
  | "point"
  | "vector"
  | "matrix"
  | "table"
  | "geometry"
  | "space3d"
  | "result"
  | "slider"
  | "dataset";

export type MathObjectStatus = "ready" | "warning" | "error" | "hidden";

export type MathObjectStyle = {
  color?: string;
  lineStyle?: "solid" | "dashed" | "dotted";
  opacity?: number;
};

export type MathObjectDependency = {
  id: string;
  label: string;
  role?: string;
};

export type MathObject = {
  id: string;
  kind: MathObjectKind;
  label: string;
  value: string;
  summary?: string;
  visible: boolean;
  locked?: boolean;
  status: MathObjectStatus;
  style?: MathObjectStyle;
  dependencies?: MathObjectDependency[];
  linkedViews: string[];
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, string | number | boolean>;
};

export type WorkspaceHistoryAction =
  | "create"
  | "update"
  | "delete"
  | "select"
  | "visibility"
  | "command"
  | "snapshot";

export type WorkspaceHistoryEntry = {
  id: string;
  objectId?: string;
  action: WorkspaceHistoryAction;
  label: string;
  timestamp: number;
};

export type WorkspaceProjectMeta = {
  id: string;
  title: string;
  description?: string;
  updatedAt: number;
  schemaVersion: number;
};

export type WorkspaceViewId = "solve" | "geometry" | "space3d" | "tools" | string;

export type WorkspaceView = {
  id: WorkspaceViewId;
  label: string;
  summary: string;
};

