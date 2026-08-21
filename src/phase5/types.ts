import type { MathAssumption, MathAstNode, MathDiagnostic, TransformationRecord } from "../math-foundation/types";

export type Vec3 = { x: number; y: number; z: number };
export type Bounds3 = { x: [number, number]; y: [number, number]; z: [number, number] };
export type ParameterDomain = { name: string; min: number; max: number; minInclusive: boolean; maxInclusive: boolean; periodic?: boolean };
export type ComputationStatus = "IDLE" | "COMPUTING" | "COMPLETE" | "PARTIAL" | "UNSUPPORTED" | "FAILED" | "CANCELLED";
export type AccuracyProfile = "PERFORMANCE" | "BALANCED" | "HIGH_ACCURACY" | "DETERMINISTIC_EXPORT";
export type Math3DKind = "POINT_3D"|"VECTOR_3D"|"LINE_3D"|"RAY_3D"|"SEGMENT_3D"|"PLANE_3D"|"SPACE_CURVE"|"EXPLICIT_SURFACE"|"PARAMETRIC_SURFACE"|"IMPLICIT_SURFACE"|"MESH"|"SOLID_REGION"|"SCALAR_FIELD"|"VECTOR_FIELD"|"SLICE"|"CONTOUR"|"INTERSECTION"|"MEASUREMENT_3D"|"COORDINATE_SYSTEM"|"TRANSFORMATION_3D";

export type Math3DBase = {
  id: string;
  kind: Math3DKind;
  label: string;
  definition: string;
  astReferences: MathAstNode[];
  parameters: ParameterDomain[];
  assumptions: MathAssumption[];
  units: { coordinate?: string; value?: string };
  dependencies: string[];
  exactRepresentation?: string;
  numericalRepresentation?: unknown;
  precision: number;
  tolerance: number;
  rendering: { visible: boolean; opacity: number; mode: "SOLID" | "WIREFRAME" | "SOLID_MESH" | "POINTS" | "CONTOURS"; color: string };
  accessibilityDescription: string;
  computationStatus: ComputationStatus;
  diagnostics: MathDiagnostic[];
  provenance: TransformationRecord[];
  serializationVersion: 1;
};

export type Point3DNode = Math3DBase & { kind: "POINT_3D"; point: Vec3 };
export type Vector3DNode = Math3DBase & { kind: "VECTOR_3D"; vector: Vec3; origin?: Vec3 };
export type Line3DNode = Math3DBase & { kind: "LINE_3D" | "RAY_3D" | "SEGMENT_3D"; point: Vec3; direction: Vec3 };
export type Plane3DNode = Math3DBase & { kind: "PLANE_3D"; normal: Vec3; offset: number };
export type SpaceCurveNode = Math3DBase & { kind: "SPACE_CURVE"; componentExpressions: [string, string, string] };
export type ExplicitSurfaceNode = Math3DBase & { kind: "EXPLICIT_SURFACE"; dependentAxis: "x" | "y" | "z"; expression: string };
export type ParametricSurfaceNode = Math3DBase & { kind: "PARAMETRIC_SURFACE"; componentExpressions: [string, string, string] };
export type ImplicitSurfaceNode = Math3DBase & { kind: "IMPLICIT_SURFACE"; expression: string; isoValue: number };
export type MeshNode = Math3DBase & { kind: "MESH"; mesh: Mesh3D };
export type SolidRegionNode = Math3DBase & { kind: "SOLID_REGION"; predicates: string[]; booleanOperation: "INTERSECTION" | "UNION" | "DIFFERENCE" | "COMPLEMENT"; bounds: Bounds3 };
export type ScalarFieldNode = Math3DBase & { kind: "SCALAR_FIELD"; expression: string; bounds: Bounds3 };
export type VectorFieldNode = Math3DBase & { kind: "VECTOR_FIELD"; componentExpressions: [string, string, string]; bounds: Bounds3; normalized: boolean };
export type Derived3DNode = Math3DBase & { kind: "SLICE" | "CONTOUR" | "INTERSECTION"; sourceNodeIds: string[]; points: Vec3[]; linked2DNodeId?: string; resultStatus: "EXACT" | "APPROXIMATE" | "NONE" | "TANGENTIAL" | "MULTIPLE" | "COINCIDENT" | "UNSUPPORTED" | "NON_CONVERGENT" };
export type Measurement3DNode = Math3DBase & { kind: "MEASUREMENT_3D"; measurement: Measurement3D };
export type CoordinateSystemNode = Math3DBase & { kind: "COORDINATE_SYSTEM"; system: "CARTESIAN" | "CYLINDRICAL" | "SPHERICAL" | "USER_DEFINED"; forward?: [string, string, string] };
export type Transformation3DNode = Math3DBase & { kind: "TRANSFORMATION_3D"; matrix: Matrix4; determinant: number; invertible: boolean };

export type Math3DNode = Point3DNode | Vector3DNode | Line3DNode | Plane3DNode | SpaceCurveNode | ExplicitSurfaceNode | ParametricSurfaceNode | ImplicitSurfaceNode | MeshNode | SolidRegionNode | ScalarFieldNode | VectorFieldNode | Derived3DNode | Measurement3DNode | CoordinateSystemNode | Transformation3DNode;
export type Matrix4 = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
export type Mesh3D = { vertices: Vec3[]; triangles: [number, number, number][]; normals: Vec3[]; bounds: Bounds3; algorithm: string; profile: AccuracyProfile; resolution: number; triangleCount: number; estimatedError: number; refinementState: "COARSE" | "REFINED" | "FINAL"; topologyWarnings: string[]; generation: number; deterministic: boolean };

export type Measurement3D = { quantity: "DISTANCE" | "ANGLE" | "CURVE_LENGTH" | "SURFACE_AREA" | "VOLUME" | "CENTROID" | "BOUNDING_BOX" | "CROSS_SECTION_AREA"; exact?: string; value?: number | Vec3 | Bounds3; method: string; domain: string; units: string; precision: number; tolerance: number; resolution: number; estimatedError: number; convergence: "CONVERGED" | "PARTIAL" | "FAILED"; assumptions: string[]; warnings: string[] };
export type Camera3DState = { projection: "PERSPECTIVE" | "ORTHOGRAPHIC"; preset: "FRONT" | "BACK" | "LEFT" | "RIGHT" | "TOP" | "BOTTOM" | "ISOMETRIC" | "CUSTOM"; position: Vec3; target: Vec3; zoom: number };
export type Phase5DocumentState = { schemaVersion: 1; nodes: Math3DNode[]; linkedViews: { id: string; nodeId: string; module: "GRAPH_2D" | "GRAPH_3D" | "CAS" | "TABLE"; provenance: string[] }[]; camera: Camera3DState; accuracyProfile: AccuracyProfile; generation: number };
