export type MathObjectKind =
  | "expression"
  | "equation"
  | "function"
  | "point"
  | "line"
  | "segment"
  | "ray"
  | "polygon"
  | "circle"
  | "arc"
  | "angle"
  | "conic"
  | "vector"
  | "text"
  | "matrix"
  | "table"
  | "geometry"
  | "space3d"
  | "plane"
  | "surface"
  | "solid"
  | "transform-helper"
  | "result"
  | "slider"
  | "dataset";

export type MathObjectStatus = "ready" | "warning" | "error" | "hidden";

export type MathObjectDimension = "2d" | "3d" | "abstract";

export type MathObjectRole = "construction" | "measurement" | "algebra" | "annotation" | "helper" | "result";

export type MathObjectStyle = {
  color?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  lineStyle?: "solid" | "dashed" | "dotted";
  opacity?: number;
  labelVisible?: boolean;
  labelColor?: string;
  pointShape?: "circle" | "square" | "diamond" | "cross";
  material?: "matte" | "glossy" | "glass" | "wireframe";
};

export type MathObjectDependency = {
  id: string;
  label: string;
  role?: "parent" | "child" | "source" | "constraint" | "measurement" | string;
};

export type MathVec2 = {
  x: number;
  y: number;
};

export type MathVec3 = {
  x: number;
  y: number;
  z: number;
};

export type MathTransform = {
  position: MathVec3;
  rotation: MathVec3;
  scale: MathVec3;
  origin?: MathVec3;
};

export type MathConstraint =
  | {
      id: string;
      type: "fixed" | "locked";
      targetId: string;
      enabled: boolean;
    }
  | {
      id: string;
      type: "coincident" | "parallel" | "perpendicular" | "equal-length" | "tangent" | "midpoint" | "on-object";
      targetId: string;
      referenceIds: string[];
      enabled: boolean;
      tolerance?: number;
    }
  | {
      id: string;
      type: "custom";
      targetId: string;
      expression: string;
      referenceIds: string[];
      enabled: boolean;
    };

export type MathObjectGeometry =
  | { type: "none" }
  | { type: "point"; position: MathVec3 }
  | { type: "line" | "segment" | "ray"; start: MathVec3; end: MathVec3 }
  | { type: "polygon"; vertices: MathVec3[] }
  | { type: "circle" | "sphere"; center: MathVec3; radius: number }
  | { type: "arc"; center: MathVec3; radius: number; startAngle: number; endAngle: number }
  | { type: "angle"; vertex: MathVec3; armA: MathVec3; armB: MathVec3 }
  | { type: "plane"; point: MathVec3; normal: MathVec3; width?: number; height?: number }
  | { type: "solid"; solid: "cube" | "cuboid" | "sphere" | "cylinder" | "cone" | "prism" | "pyramid" | "torus"; dimensions: MathVec3; radius?: number }
  | { type: "surface"; expression: string; domain?: { u: [number, number]; v: [number, number] } };

export type MathObjectInteractivity = {
  selectable: boolean;
  draggable: boolean;
  editable: boolean;
  resizable: boolean;
  rotatable: boolean;
  snapToGrid?: boolean;
  snapToObjects?: boolean;
  allowedHandles?: Array<"move-x" | "move-y" | "move-z" | "rotate-x" | "rotate-y" | "rotate-z" | "scale" | "scale-x" | "scale-y" | "scale-z">;
};

export type MathObjectAnimation = {
  enabled: boolean;
  playing?: boolean;
  property?: string;
  from?: number;
  to?: number;
  durationMs?: number;
  loop?: boolean;
};

export type MathSceneNode = {
  id: string;
  objectId: string;
  parentId: string | null;
  children: string[];
  order: number;
  visible: boolean;
  locked: boolean;
};

export type MathScene = {
  id: string;
  title: string;
  dimension: Exclude<MathObjectDimension, "abstract">;
  rootNodeId: string;
  nodes: MathSceneNode[];
  selectedIds: string[];
  activeTool: string | null;
  settings: {
    gridVisible: boolean;
    snapEnabled: boolean;
    units: "unit" | "px" | "cm" | "degree" | "radian";
    camera?: {
      position: MathVec3;
      target: MathVec3;
      orthographic: boolean;
      autoRotate: boolean;
    };
  };
};

export type MathObject = {
  id: string;
  kind: MathObjectKind;
  dimension?: MathObjectDimension;
  role?: MathObjectRole;
  label: string;
  value: string;
  summary?: string;
  visible: boolean;
  locked?: boolean;
  selectable?: boolean;
  status: MathObjectStatus;
  style?: MathObjectStyle;
  transform?: MathTransform;
  geometry?: MathObjectGeometry;
  constraints?: MathConstraint[];
  dependencies?: MathObjectDependency[];
  interactivity?: MathObjectInteractivity;
  animation?: MathObjectAnimation;
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
  | "snapshot"
  | "scene"
  | "project";

export type WorkspaceHistoryEntry = {
  id: string;
  objectId?: string;
  objectIds?: string[];
  action: WorkspaceHistoryAction;
  label: string;
  timestamp: number;
  before?: WorkspaceSnapshot;
  after?: WorkspaceSnapshot;
};

export type WorkspaceProjectMeta = {
  id: string;
  title: string;
  description?: string;
  updatedAt: number;
  schemaVersion: number;
};

export type WorkspaceSnapshot = {
  project: WorkspaceProjectMeta;
  objects: MathObject[];
  scenes: MathScene[];
  selectedObjectId: string | null;
  selectedObjectIds: string[];
};

export type WorkspaceViewId = "solve" | "geometry" | "space3d" | "tools" | string;

export type WorkspaceView = {
  id: WorkspaceViewId;
  label: string;
  summary: string;
};
