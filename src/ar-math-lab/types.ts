export type ARObjectType =
  | "explicit_surface"
  | "parametric_surface"
  | "parametric_curve"
  | "implicit_surface"
  | "recognized_implicit_shape"
  | "implicit_surface_unsupported"
  | "geometry_solid"
  | "coordinate_axes"
  | "measurement_demo"
  | "unknown";

export type ARRenderMode = "ar" | "camera-preview" | "3d-preview";
export type ARSessionMode = "none" | ARRenderMode;
export type ARSessionStatus = "idle" | "checking" | "ready" | "starting" | "active" | "stopping" | "error" | "unsupported";
export type ARCameraPermission = "unknown" | "granted" | "denied" | "prompt";

export type ARUnit = "mm" | "cm" | "m" | "inch" | "ft";
export type ARSolidType = "cube" | "cuboid" | "cylinder" | "cone" | "sphere" | "hemisphere" | "prism" | "pyramid" | "frustum" | "torus";
export type ARScaleMode = "real-scale" | "fit-to-view" | "classroom-scale" | "miniature" | "custom";
export type ARCrossSectionMode = "off" | "horizontal" | "vertical";
export type ARGeometryQuality = "low" | "medium" | "high";
export type ARMeasurementType =
  | "distance"
  | "height"
  | "radius"
  | "diameter"
  | "slant_height"
  | "edge_length"
  | "angle"
  | "point_coordinate"
  | "surface_value"
  | "cross_section_dimension";
export type ARAnimationTarget = "parameter" | "dimension" | "rotation" | "scale" | "cross_section" | "curve_trace";
export type ARAnimationStatus = "idle" | "playing" | "paused" | "stopped";
export type ARAdvancedToolTab = "build" | "graph" | "geometry" | "measure" | "animate" | "formula" | "learn" | "practice" | "compare" | "scene" | "settings";
export type ARObjectStatus = "ready" | "generating" | "active" | "warning" | "error" | "hidden";

export type ARDimension = {
  name: string;
  value: number;
  unit: ARUnit;
  meters: number;
};

export type EquationClassificationResult = {
  type: ARObjectType;
  originalInput?: string;
  normalizedInput: string;
  confidence: "high" | "medium" | "low";
  objectName?: string;
  solidType?: ARSolidType;
  solidDimensions?: Record<string, { value: number; unit: ARUnit; meters: number }>;
  missingInputs?: string[];
  suggestedScaleMode?: ARScaleMode;
  dimensions: ARDimension[];
  variables: string[];
  independentVariables?: string[];
  dependentVariables?: string[];
  parameters?: string[];
  suggestedRenderer?:
    | "surface_mesh"
    | "parametric_surface_mesh"
    | "curve_3d"
    | "predefined_sphere"
    | "predefined_cylinder"
    | "predefined_cone"
    | "unsupported";
  suggestedRanges?: Partial<Record<"x" | "y" | "z" | "t" | "u" | "v", [number, number]>>;
  suggestedResolution?: Partial<Record<"x" | "y" | "t" | "u" | "v", number>>;
  suggestedParameters?: Record<string, number>;
  warnings?: string[];
  errors?: string[];
  educationalHint?: string;
  recommendedMode: ARRenderMode;
  message: string;
};

export type ARSupportStatus = {
  webXRAvailable: boolean;
  immersiveARSupported: boolean;
  cameraAvailable: boolean;
  webGLAvailable: boolean;
  isSecureContext: boolean;
  recommendedMode: ARRenderMode;
  warnings: string[];
  message: string;
  hasNavigatorXR: boolean;
  secureContext: boolean;
  notes: string[];
};

export type ARSessionState = {
  mode: ARSessionMode;
  status: ARSessionStatus;
  webXRAvailable: boolean;
  immersiveARSupported: boolean;
  cameraAvailable: boolean;
  cameraPermission: ARCameraPermission;
  isSecureContext: boolean;
  errorMessage?: string;
  infoMessage?: string;
};

export type ARSceneState = {
  showGrid: boolean;
  showAxes: boolean;
  showLabels: boolean;
  placementReady: boolean;
  selectedObjectId?: string;
  objectScale: number;
  objectRotation: [number, number, number];
  objectPosition: [number, number, number];
  objectColor: string;
  objectOpacity: number;
  objectContrast: number;
  phoneOrbitEnabled: boolean;
};

export type ARMathObject = {
  id: string;
  label: string;
  input: string;
  type: ARObjectType;
  classification: EquationClassificationResult;
  renderMode: ARRenderMode;
};

export type ARSurfaceStyle = "solid" | "transparent" | "wireframe" | "solid-wireframe" | "points";
export type ARCurveStyle = "line" | "tube" | "line-points";

export type ARGraphSettings = {
  xRange: [number, number];
  yRange: [number, number];
  tRange: [number, number];
  uRange: [number, number];
  vRange: [number, number];
  resolutionX: number;
  resolutionY: number;
  resolutionU: number;
  resolutionV: number;
  samples: number;
  zScale: number | "auto";
  graphScale: number;
  curveThickness: number;
  surfaceStyle: ARSurfaceStyle;
  curveStyle: ARCurveStyle;
  transparent: boolean;
  wireframe: boolean;
  pointMarkers: boolean;
  autoCenter: boolean;
};

export type ARGraphGeometry =
  | {
      kind: "surface";
      vertices: number[];
      indices: number[];
      colors?: number[];
      valueStats: { minZ: number; maxZ: number; invalidPointCount: number };
      warnings: string[];
    }
  | {
      kind: "curve";
      points: [number, number, number][];
      valueStats: { invalidPointCount: number };
      warnings: string[];
    };

export type ARGeneratedGraphObject = {
  id: string;
  name: string;
  equation: string;
  type: ARObjectType;
  visible: boolean;
  locked: boolean;
  transform: {
    scale: number;
    rotation: [number, number, number];
    position: [number, number, number];
  };
  settings: ARGraphSettings;
  geometry: ARGraphGeometry;
  parameterValues: Record<string, number>;
  explanation: string;
  classification: EquationClassificationResult;
  status?: ARObjectStatus;
  errorMessage?: string;
};

export type ARGeometryFormulaLine = {
  label: string;
  formula: string;
  substitution: string;
  result: string;
};

export type ARGeometryCalculatedValues = {
  formulas: ARGeometryFormulaLine[];
  values: Record<string, number>;
  unit: ARUnit;
  internalMeters: Record<string, number>;
};

export type ARGeneratedGeometrySolid = {
  id: string;
  name: string;
  type: "geometry_solid";
  solidType: ARSolidType;
  dimensions: Record<string, { value: number; unit: ARUnit; meters: number }>;
  unit: ARUnit;
  calculatedValues: ARGeometryCalculatedValues;
  visible: boolean;
  locked: boolean;
  transform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
  displayScaleMode: ARScaleMode;
  customScale: number;
  maxDimensionMeters: number;
  settings: {
    showLabels: boolean;
    showFormula: boolean;
    showWireframe: boolean;
    transparent: boolean;
    showCrossSection: boolean;
    crossSectionMode: ARCrossSectionMode;
    crossSectionPosition: number;
    showDimensionLines: boolean;
    quality: ARGeometryQuality;
  };
  warnings: string[];
  explanation: string;
  createdFromInput: string;
  status?: ARObjectStatus;
  errorMessage?: string;
};

export type ARMeasurement = {
  id: string;
  type: ARMeasurementType;
  objectId?: string;
  points: [number, number, number][];
  value: number;
  unit: string;
  label: string;
  locked: boolean;
  visible: boolean;
};

export type ARAnimation = {
  id: string;
  objectId: string;
  target: ARAnimationTarget;
  property: string;
  from: number;
  to: number;
  durationMs: number;
  loop: boolean;
  pingPong: boolean;
  status: ARAnimationStatus;
};

export type ARLessonCard = {
  id: string;
  objectType: string;
  title: string;
  concept: string;
  keyObservations: string[];
  tryThis: string[];
  questions?: string[];
};

export type ARComparison = {
  enabled: boolean;
  objectAId?: string;
  objectBId?: string;
  mode: "side-by-side" | "overlay" | "difference";
  syncScale: boolean;
  summary?: string;
};

export type ARSceneSaveData = {
  version: string;
  module: "ARMathLab";
  graphs: ARGeneratedGraphObject[];
  solids: ARGeneratedGeometrySolid[];
  measurements: ARMeasurement[];
  animations: ARAnimation[];
  comparison: ARComparison;
  settings: {
    showGrid: boolean;
    showAxes: boolean;
    showLabels: boolean;
  };
  learning?: {
    activeConcept?: string;
    completedStepIds?: string[];
    quizResults?: Record<string, boolean>;
    lastEvent?: {
      id: string;
      type: string;
      timestamp: number;
      objectId?: string;
      payload?: Record<string, unknown>;
    };
  };
  savedAt: string;
};

export type ARExampleGroup =
  | "3D Surfaces"
  | "3D Curves"
  | "Parametric Surfaces"
  | "Geometry Solids"
  | "Planes and Intersections"
  | "Coordinate Systems"
  | "Measurement Demos";

export type ARExample = {
  id: string;
  title: string;
  group: ARExampleGroup;
  input: string;
  objectType: ARObjectType;
  description: string;
  recommended?: Partial<ARGraphSettings>;
  parameters?: Record<string, number>;
  solidType?: ARSolidType;
  unit?: ARUnit;
  recommendedScaleMode?: ARScaleMode;
};
