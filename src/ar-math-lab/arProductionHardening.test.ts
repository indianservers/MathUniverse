import * as THREE from "three";
import { describe, expect, it, vi } from "vitest";
import { applyPerformanceModeToGraphSettings, disposeObject3D, hasHighResolutionRisk } from "./arProductionHardening";
import { defaultGraphSettings } from "./arGraphGenerator";

describe("AR Math Lab production hardening", () => {
  it("caps graph settings in performance mode", () => {
    const settings = { ...defaultGraphSettings, resolutionX: 120, resolutionY: 110, resolutionU: 100, resolutionV: 80, samples: 900 };
    const optimized = applyPerformanceModeToGraphSettings(settings, true);

    expect(optimized.resolutionX).toBeLessThanOrEqual(40);
    expect(optimized.resolutionY).toBeLessThanOrEqual(40);
    expect(optimized.resolutionU).toBeLessThanOrEqual(40);
    expect(optimized.resolutionV).toBeLessThanOrEqual(20);
    expect(optimized.samples).toBeLessThanOrEqual(220);
    expect(optimized.wireframe).toBe(true);
  });

  it("detects high-resolution risk", () => {
    expect(hasHighResolutionRisk({ ...defaultGraphSettings, resolutionX: 90 })).toBe(true);
    expect(hasHighResolutionRisk({ ...defaultGraphSettings, resolutionX: 60, samples: 300 })).toBe(false);
  });

  it("disposes geometries, materials, and textures", () => {
    const geometry = new THREE.BoxGeometry();
    const texture = new THREE.Texture();
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const disposeGeometry = vi.spyOn(geometry, "dispose");
    const disposeMaterial = vi.spyOn(material, "dispose");
    const disposeTexture = vi.spyOn(texture, "dispose");
    const mesh = new THREE.Mesh(geometry, material);

    disposeObject3D(mesh);

    expect(disposeGeometry).toHaveBeenCalled();
    expect(disposeMaterial).toHaveBeenCalled();
    expect(disposeTexture).toHaveBeenCalled();
  });
});
