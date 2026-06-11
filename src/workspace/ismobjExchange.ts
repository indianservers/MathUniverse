import { buildConstructionProtocol, type ConstructionProtocol } from "./constructionProtocol";
import { buildCanonicalAlgebra, evaluateDynamicWorkspace } from "./dynamicWorkspaceEngine";
import { buildSharedWorkspaceModel } from "./workspaceEngineBridge";
import type { AlgebraObjectModel, MathObject, WorkspaceProjectMeta, WorkspaceSnapshot } from "./types";

export const ISMOBJ_SCHEMA = "IndianServersMathObject";
export const ISMOBJ_MIME = "application/vnd.indianservers.mathobject+json";

export type IsmobjPackage = {
  schema: typeof ISMOBJ_SCHEMA;
  extension: ".ismobj";
  version: 1;
  exportedAt: string;
  manifest: {
    id: string;
    title: string;
    description?: string;
    generator: "Math Universe";
    compatibility: {
      minSchemaVersion: number;
      features: string[];
    };
    integrity: {
      objectCount: number;
      dependencyCount: number;
      checksum: string;
    };
  };
  project: WorkspaceProjectMeta;
  objects: MathObject[];
  algebra: AlgebraObjectModel[];
  protocol: ConstructionProtocol;
  engine?: {
    geometry2dObjectCount: number;
    geometry3dObjectCount: number;
    measurementObjects: MathObject[];
  };
};

export function exportIsmobj(snapshot: WorkspaceSnapshot): string {
  const evaluated = evaluateDynamicWorkspace(snapshot.objects);
  const protocol = buildConstructionProtocol(evaluated.objects);
  const engine = buildSharedWorkspaceModel(evaluated.objects);
  const pkg: IsmobjPackage = {
    schema: ISMOBJ_SCHEMA,
    extension: ".ismobj",
    version: 1,
    exportedAt: new Date().toISOString(),
    manifest: {
      id: snapshot.project.id,
      title: snapshot.project.title,
      description: snapshot.project.description,
      generator: "Math Universe",
      compatibility: {
        minSchemaVersion: snapshot.project.schemaVersion,
        features: featureList(evaluated.objects, engine.measurements),
      },
      integrity: {
        objectCount: evaluated.objects.length,
        dependencyCount: evaluated.objects.reduce((sum, object) => sum + (object.dependencies?.length ?? 0), 0),
        checksum: checksum(JSON.stringify(evaluated.objects.map((object) => [object.id, object.value, object.dependencies?.map((dependency) => dependency.id)]))),
      },
    },
    project: snapshot.project,
    objects: evaluated.objects,
    algebra: evaluated.algebra,
    protocol,
    engine: {
      geometry2dObjectCount: engine.geometry2d.objects.length,
      geometry3dObjectCount: engine.geometry3d.objects.length,
      measurementObjects: engine.measurements,
    },
  };
  return JSON.stringify(pkg, null, 2);
}

export function importIsmobj(json: string): WorkspaceSnapshot {
  const pkg = parseIsmobj(json);
  const evaluated = evaluateDynamicWorkspace(pkg.objects);
  return {
    project: {
      ...pkg.project,
      title: pkg.project.title || pkg.manifest.title,
      description: pkg.project.description ?? pkg.manifest.description,
      updatedAt: Date.now(),
    },
    objects: evaluated.objects,
    scenes: [],
    selectedObjectId: null,
    selectedObjectIds: [],
  };
}

export function parseIsmobj(json: string): IsmobjPackage {
  const parsed = JSON.parse(json) as IsmobjPackage;
  if (parsed.schema !== ISMOBJ_SCHEMA || parsed.extension !== ".ismobj" || parsed.version !== 1) {
    throw new Error("Unsupported .ismobj file.");
  }
  if (!Array.isArray(parsed.objects) || !parsed.project || !parsed.manifest) {
    throw new Error("Invalid IndianServersMathObject package.");
  }
  const algebra = parsed.algebra?.length ? parsed.algebra : buildCanonicalAlgebra(parsed.objects);
  const protocol = parsed.protocol?.schema === "math-universe.construction-protocol" ? parsed.protocol : buildConstructionProtocol(parsed.objects);
  const fallbackEngine = buildSharedWorkspaceModel(parsed.objects);
  const engine = parsed.engine ?? {
    geometry2dObjectCount: fallbackEngine.geometry2d.objects.length,
    geometry3dObjectCount: fallbackEngine.geometry3d.objects.length,
    measurementObjects: fallbackEngine.measurements,
  };
  return { ...parsed, algebra, protocol, engine };
}

export function ismobjFilename(title: string) {
  return `${title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "math-universe"}.ismobj`;
}

function featureList(objects: MathObject[], measurements: MathObject[] = []) {
  const features = new Set<string>();
  objects.forEach((object) => {
    features.add(object.dimension === "3d" ? "geometry3d" : object.dimension === "2d" ? "geometry2d" : "algebra");
    if (object.definition?.category) features.add(object.definition.category);
    if (object.properties?.conditionalVisibility) features.add("conditional-visibility");
    if (object.properties?.dynamicColor) features.add("dynamic-color");
    if (object.kind === "table" || object.kind === "dataset") features.add("data");
  });
  if (measurements.length) features.add("engine-measurements");
  return Array.from(features).sort();
}

function checksum(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
