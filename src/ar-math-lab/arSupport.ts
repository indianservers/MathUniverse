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

export async function detectARSupport(
  environment: ARSupportEnvironment = defaultARSupportEnvironment(),
): Promise<ARSupportStatus> {
  const xr = environment.navigator?.xr;
  const mediaDevices = environment.navigator?.mediaDevices;
  const isSecureContext = Boolean(environment.isSecureContext);
  const webXRAvailable = Boolean(xr);
  const immersiveARSupported = Boolean(await detectImmersiveAR(xr));
  const cameraAvailable = await detectCamera(mediaDevices);
  const webGLAvailable = detectWebGL(environment.createCanvas);
  const recommendedMode = recommendMode({
    isSecureContext,
    immersiveARSupported,
    cameraAvailable,
    webGLAvailable,
  });
  const warnings = buildSupportWarnings({
    isSecureContext,
    webXRAvailable,
    immersiveARSupported,
    cameraAvailable,
    webGLAvailable,
  });
  const message = buildSupportMessage({
    immersiveARSupported,
    cameraAvailable,
    webGLAvailable,
    isSecureContext,
  });

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
    notes: [
      ...buildSupportNotes({ webXRAvailable }),
      ...warnings,
      message,
      `Recommended mode: ${recommendedMode}.`,
    ],
  };
}

function defaultARSupportEnvironment(): ARSupportEnvironment {
  if (typeof navigator === "undefined") {
    return { navigator: undefined, isSecureContext: false };
  }

  return {
    navigator: navigator as Navigator & ARSupportEnvironment["navigator"],
    isSecureContext:
      typeof window === "undefined" ? false : window.isSecureContext,
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
    return (
      devices.length === 0 ||
      devices.some((device) => device.kind === "videoinput")
    );
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

function recommendMode(
  status: Pick<
    ARSupportStatus,
    | "isSecureContext"
    | "immersiveARSupported"
    | "cameraAvailable"
    | "webGLAvailable"
  >,
): ARRenderMode {
  if (!status.isSecureContext) return "3d-preview";
  if (status.immersiveARSupported) return "ar";
  if (status.cameraAvailable) return "camera-preview";
  return "3d-preview";
}

function buildSupportWarnings(
  status: Pick<
    ARSupportStatus,
    | "isSecureContext"
    | "webXRAvailable"
    | "immersiveARSupported"
    | "cameraAvailable"
    | "webGLAvailable"
  >,
) {
  const warnings: string[] = [];
  if (!status.isSecureContext)
    warnings.push(
      "Live camera AR requires HTTPS or a secure localhost context.",
    );
  if (!status.cameraAvailable && !status.immersiveARSupported)
    warnings.push(
      "Camera access is not available. 3D Preview Mode will be used.",
    );
  if (!status.webGLAvailable)
    warnings.push("WebGL is not available, so 3D preview may be limited.");
  return warnings;
}

function buildSupportNotes(status: Pick<ARSupportStatus, "webXRAvailable">) {
  return status.webXRAvailable ? [] : ["navigator.xr is not available."];
}

function buildSupportMessage(
  status: Pick<
    ARSupportStatus,
    | "isSecureContext"
    | "immersiveARSupported"
    | "cameraAvailable"
    | "webGLAvailable"
  >,
) {
  if (!status.isSecureContext)
    return "Live camera AR requires HTTPS or secure localhost. Use HTTPS when opening the page from another device.";
  if (!status.webGLAvailable)
    return "WebGL is unavailable. The page will keep controls visible, but 3D rendering may not work.";
  if (status.immersiveARSupported)
    return "Surface AR is available. Tap AR, scan a floor or table, then tap the ring to place your object and walk around it.";
  if (status.cameraAvailable)
    return "Camera overlay is available. It requests camera access and places objects on screen. Surface AR requires a compatible device/browser.";
  return "Camera access is not available. 3D Preview Mode will be used.";
}
