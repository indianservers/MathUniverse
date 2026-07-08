import { describe, expect, it } from "vitest";
import { detectARSupport } from "./arSupport";

describe("detectARSupport", () => {
  function webGLCanvas() {
    return { getContext: (name: string) => name === "webgl2" ? {} : null } as HTMLCanvasElement;
  }

  it("recommends AR when secure WebXR immersive-ar is supported", async () => {
    const status = await detectARSupport({
      isSecureContext: true,
      createCanvas: webGLCanvas,
      navigator: {
        xr: { isSessionSupported: async () => true },
        mediaDevices: { getUserMedia: async () => ({} as MediaStream), enumerateDevices: async () => [{ kind: "videoinput" }] },
      },
    });

    expect(status.hasNavigatorXR).toBe(true);
    expect(status.immersiveARSupported).toBe(true);
    expect(status.cameraAvailable).toBe(true);
    expect(status.recommendedMode).toBe("ar");
  });

  it("falls back to camera preview when WebXR AR is unavailable but camera exists", async () => {
    const status = await detectARSupport({
      isSecureContext: true,
      createCanvas: webGLCanvas,
      navigator: {
        mediaDevices: { getUserMedia: async () => ({} as MediaStream), enumerateDevices: async () => [{ kind: "videoinput" }] },
      },
    });

    expect(status.hasNavigatorXR).toBe(false);
    expect(status.recommendedMode).toBe("camera-preview");
  });

  it("falls back to 3D preview when no AR or camera support can be found", async () => {
    const status = await detectARSupport({
      isSecureContext: false,
      createCanvas: () => null,
      navigator: {},
    });

    expect(status.cameraAvailable).toBe(false);
    expect(status.recommendedMode).toBe("3d-preview");
    expect(status.notes.join(" ")).toContain("navigator.xr is not available");
  });
});
