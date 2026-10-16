import { sampleAdaptiveExplicitSurface, sampleCoordinateSurface, sampleImplicitSurface, sampleParametricCurve, sampleParametricSurface, sampleVectorField, type Graph3DMesh, type Graph3DPoint, type Graph3DVectorField } from "../../graph-studio/graph3dAdvanced";
import { implicitLodResolution, evaluateDomainPredicate } from "../../graph-studio/graph3dEnhancements";
import { substituteGraphVariables } from "../../graph-studio/expressionEngine";
import type { GraphStudioVariable } from "../../graph-studio/types";
import type { Graph3DSurface } from "../../graph-studio/graph3dSurfaceModel";
import { sampleSurface, type SurfaceSampleResult } from "../../utils/mathEngine/graph3dUtils";
export type AdvancedLayerResult = { mesh?: Graph3DMesh; curve?: Graph3DPoint[]; field?: Graph3DVectorField; error?: string };
export type MobileSamplingInput = { surfaces: Graph3DSurface[]; variables: GraphStudioVariable[]; xRange: number; yRange: number; resolution: number };
export type MobileSamplingResult = { sampled: Array<{ item: Graph3DSurface; samples: SurfaceSampleResult }>; advanced: Record<string, AdvancedLayerResult> };
function buildAdvancedLayer(surface: Graph3DSurface, variables: GraphStudioVariable[], xRange: number, yRange: number, resolution: number): AdvancedLayerResult {
  if(surface.roboMesh||surface.roboCommand)return {};
  const intrinsic = surface.kind === "parametric" ? new Set(["u", "v"]) : surface.kind === "curve" ? new Set(["t"]) : new Set<string>();
  const activeVariables = variables.filter((variable) => !intrinsic.has(variable.name.toLowerCase()));
  const resolve = (value: string) => substituteGraphVariables(value, activeVariables);
  if (surface.kind === "explicit") {
    const expression = resolve(surface.expression);
    if (surface.coordinateMode === "cartesian") {
      if (!surface.adaptive) return {};
      const mesh = sampleAdaptiveExplicitSurface(expression, xRange, yRange, Math.max(8, Math.round(resolution / 3)), 2);
      return { mesh, error: mesh.error };
    }
    const coordinateExpression = surface.coordinateMode === "cylindrical"
      ? expression.replace(/(?<![a-z])r\b/gi, "u").replace(/(?<![a-z])theta\b/gi, "v")
      : expression.replace(/(?<![a-z])theta\b/gi, "u").replace(/(?<![a-z])phi\b/gi, "v");
    try {
      const mesh = sampleCoordinateSurface(coordinateExpression, surface.coordinateMode, { uMin: surface.uMin, uMax: surface.uMax, vMin: surface.vMin, vMax: surface.vMax }, resolution);
      return { mesh, error: mesh.error };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Coordinate surface could not be sampled." };
    }
  }
  if (surface.kind === "implicit") {
    const mesh = sampleImplicitSurface(resolve(surface.expression), Math.max(Math.abs(surface.xMax - surface.xMin), Math.abs(surface.yMax - surface.yMin), xRange, yRange) / 2, implicitLodResolution(resolution, surface.lod ?? 2));
    return { mesh, error: mesh.error };
  }
  if (surface.kind === "parametric") {
    const mesh = sampleParametricSurface({ x: resolve(surface.components.x), y: resolve(surface.components.y), z: resolve(surface.components.z) }, { uMin: surface.uMin, uMax: surface.uMax, vMin: surface.vMin, vMax: surface.vMax }, resolution);
    return { mesh, error: mesh.error };
  }
  if (surface.kind === "curve") {
    const curve = sampleParametricCurve({ x: resolve(surface.components.x), y: resolve(surface.components.y), z: resolve(surface.components.z) }, surface.tMin, surface.tMax, Math.max(120, resolution * 6));
    return { curve: curve.points, error: curve.error };
  }
  const field = sampleVectorField({ x: resolve(surface.components.x), y: resolve(surface.components.y), z: resolve(surface.components.z) }, Math.max(xRange, yRange), 4, surface.streamlines);
  return { field, error: field.error };
}

function restrictDomain(samples: SurfaceSampleResult, predicate: string) {
  if (!predicate) return samples;
  return {
    ...samples,
    grid: samples.grid.map((row) => row.map((point) => evaluateDomainPredicate(predicate, point.x, point.y, point.z ?? 0) ? point : { ...point, valid: false, z: null })),
  };
}

export function sampleMobileLayer(item: Graph3DSurface, input: MobileSamplingInput) {
  const samples = item.kind === "explicit" && item.coordinateMode === "cartesian"
    ? restrictDomain(sampleSurface(substituteGraphVariables(item.expression, input.variables), item.xMin ?? -input.xRange, item.xMax ?? input.xRange, item.yMin ?? -input.yRange, item.yMax ?? input.yRange, input.resolution), item.domainPredicate)
    : { grid: [], minZ: null, maxZ: null } as SurfaceSampleResult;
  return { samples, advanced: buildAdvancedLayer(item,input.variables,input.xRange,input.yRange,input.resolution) };
}
