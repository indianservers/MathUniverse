import * as THREE from "three";
import type { ARGeneratedGeometrySolid, ARGeneratedGraphObject, ARGraphSettings } from "./types";

export const arPerformanceLimits = {
  mobileSurfaceDefault: 60,
  mobileSurfaceWarning: 80,
  desktopSurfaceWarning: 120,
  curveDefaultSamples: 300,
  curveMaxSamples: 800,
  performanceSurfaceResolution: 40,
  performanceCurveSamples: 220,
};

export function applyPerformanceModeToGraphSettings(settings: ARGraphSettings, enabled: boolean): ARGraphSettings {
  if (!enabled) return settings;
  return {
    ...settings,
    resolutionX: Math.min(settings.resolutionX, arPerformanceLimits.performanceSurfaceResolution),
    resolutionY: Math.min(settings.resolutionY, arPerformanceLimits.performanceSurfaceResolution),
    resolutionU: Math.min(settings.resolutionU, arPerformanceLimits.performanceSurfaceResolution),
    resolutionV: Math.min(settings.resolutionV, Math.max(16, Math.floor(arPerformanceLimits.performanceSurfaceResolution / 2))),
    samples: Math.min(settings.samples, arPerformanceLimits.performanceCurveSamples),
    surfaceStyle: settings.surfaceStyle === "solid" ? "transparent" : settings.surfaceStyle,
    wireframe: true,
    pointMarkers: false,
  };
}

export function hasHighResolutionRisk(settings: ARGraphSettings) {
  return Math.max(settings.resolutionX, settings.resolutionY, settings.resolutionU, settings.resolutionV) > arPerformanceLimits.mobileSurfaceWarning
    || settings.samples > arPerformanceLimits.curveMaxSamples;
}

export function markHiddenGraphs(graphs: ARGeneratedGraphObject[]) {
  return graphs.map((graph) => ({ ...graph, status: graph.visible ? graph.status ?? "ready" : "hidden" as const }));
}

export function markHiddenSolids(solids: ARGeneratedGeometrySolid[]) {
  return solids.map((solid) => ({ ...solid, status: solid.visible ? solid.status ?? "ready" : "hidden" as const }));
}

export function disposeObject3D(object: THREE.Object3D | null | undefined) {
  if (!object) return;
  object.traverse((child) => {
    const maybeMesh = child as THREE.Mesh & { material?: THREE.Material | THREE.Material[]; geometry?: THREE.BufferGeometry };
    maybeMesh.geometry?.dispose();
    if (Array.isArray(maybeMesh.material)) maybeMesh.material.forEach(disposeMaterial);
    else disposeMaterial(maybeMesh.material);
  });
}

function disposeMaterial(material: THREE.Material | undefined) {
  if (!material) return;
  Object.values(material).forEach((value) => {
    if (value instanceof THREE.Texture) value.dispose();
  });
  material.dispose();
}
