import type { ARRenderMode, ARSupportStatus } from "./types";

type XRLike = {
  isSessionSupported?: (mode: "immersive-ar") => Promise<boolean>;
};

type MediaDevicesLike = {
  enumerateDevices?: () => Promise<Array<{ kind?: string }>>;
  getUserMedia?: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
};

export type ARSupportEnvironment = {
  navigator?: {
    xr?: XRLike;
    mediaDevices?: MediaDevicesLike;
  };
  isSecureContext?: boolean;
  createCanvas?: () => HTMLCanvasElement | null;
};

export async function detectARSupport(environment: ARSupportEnvironment = defaultARSupportEnvironment()): Promise<ARSupportStatus> {
  const xr = environment.navigator?.xr;
  const mediaDevices = environment.navigator?.mediaDevices;
  const isSecureContext = Boolean(environment.isSecureContext);
  const webXRAvailable = Boolean(xr);
  const immersiveARSupported = Boolean(await detectImmersiveAR(xr));
  const cameraAvailable = await detectCamera(mediaDevices);
  const webGLAvailable = detectWebGL(environment.createCanvas);
  const recommendedMode = recommendMode({ isSecureContext, immersiveARSupported, cameraAvailable, webGLAvailable });
  const warnings = buildSupportWarnings({ isSecureContext, webXRAvailable, immersiveARSupported, cameraAvailable, webGLAvailable });
  const message = buildSupportMessage({ immersiveARSupported, cameraAvailable, webGLAvailable, isSecureContext });

  return {
    webXRAvailable,
    immersiveARSupported,
    cameraAvailable,
    webGLAvailable,
    isSecureContext,
    recommendedMode,
    warnings,
    message,
    hasNavigatorXR: webXRAvailable,
    secureContext: isSecureContext,
    notes: [...warnings, message, `Recommended mode: ${recommendedMode}.`],
  };
}

function defaultARSupportEnvironment(): ARSupportEnvironment {
  if (typeof navigator === "undefined") {
    return { navigator: undefined, isSecureContext: false };
  }

  return {
    navigator: navigator as Navigator & ARSupportEnvironment["navigator"],
    isSecureContext: typeof window === "undefined" ? false : window.isSecureContext,
    createCanvas: () => document.createElement("canvas"),
  };
}

async function detectImmersiveAR(xr: XRLike | undefined) {
  if (!xr?.isSessionSupported) return null;
  try {
    return await xr.isSessionSupported("immersive-ar");
  } catch {
    return false;
  }
}

async function detectCamera(mediaDevices: MediaDevicesLike | undefined) {
  if (!mediaDevices?.getUserMedia) return false;
  if (!mediaDevices.enumerateDevices) return true;
  try {
    const devices = await mediaDevices.enumerateDevices();
    return devices.length === 0 || devices.some((device) => device.kind === "videoinput");
  } catch {
    return true;
  }
}

function detectWebGL(createCanvas: ARSupportEnvironment["createCanvas"]) {
  if (!createCanvas) return false;
  try {
    const canvas = createCanvas();
    return Boolean(canvas?.getContext("webgl2") || canvas?.getContext("webgl"));
  } catch {
    return false;
  }
}

function recommendMode(status: Pick<ARSupportStatus, "isSecureContext" | "immersiveARSupported" | "cameraAvailable" | "webGLAvailable">): ARRenderMode {
  if (status.isSecureContext && status.immersiveARSupported && status.webGLAvailable) return "ar";
  if (status.cameraAvailable) return "camera-preview";
  return "3d-preview";
}

function buildSupportWarnings(status: Pick<ARSupportStatus, "isSecureContext" | "webXRAvailable" | "immersiveARSupported" | "cameraAvailable" | "webGLAvailable">) {
  const warnings: string[] = [];
  if (!status.isSecureContext) warnings.push("WebXR AR requires HTTPS or a secure localhost context.");
  if (!status.webXRAvailable) warnings.push("navigator.xr is not available, so full AR sessions are not exposed by this browser.");
  if (status.immersiveARSupported === false) warnings.push("immersive-ar is not exposed here. Latest desktop Chrome can still lack room-anchored AR; try Chrome on an ARCore/ARKit-capable mobile device for true AR.");
  if (!status.cameraAvailable) warnings.push("Camera access is not available. 3D Preview Mode will be used.");
  if (!status.webGLAvailable) warnings.push("WebGL is not available, so 3D preview may be limited.");
  return warnings;
}

function buildSupportMessage(status: Pick<ARSupportStatus, "isSecureContext" | "immersiveARSupported" | "cameraAvailable" | "webGLAvailable">) {
  if (!status.webGLAvailable) return "WebGL is unavailable. The page will keep controls visible, but 3D rendering may not work.";
  if (status.isSecureContext && status.immersiveARSupported) return "AR is supported on this device.";
  if (!status.isSecureContext) return "WebXR AR requires HTTPS or secure context.";
  if (status.cameraAvailable) return "Camera is available. Full WebXR AR is not exposed in this browser/device, so Camera Preview Mode is used.";
  return "Camera access is not available. 3D Preview Mode will be used.";
}
