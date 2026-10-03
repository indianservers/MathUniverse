# Surface AR entry point

The primary AR action previously called getUserMedia and opened a camera overlay. That did not provide the requested GeoGebra-style surface placement and walk-around behavior.

The primary AR action now:

1. Releases the camera overlay stream and cancels pending camera requests.
2. Uses the selected AR graph/solid, or generates the entered object if the scene is empty.
3. Calls the tracked WebXR entry point directly from the button interaction, preserving browser activation for `requestSession('immersive-ar')`.
4. Requires hit testing, with optional DOM overlay and native hand tracking. A surface reticle guides tap placement; the placed object uses tracked local-world coordinates as the device moves.
5. Provides reposition, display scale, rotate left/right, native hand gestures, and exit controls. DOM control taps do not trigger XR surface selection.

Camera overlay is explicitly labeled separately. Surface AR availability now reflects immersive AR capability rather than the presence of a camera API. The normal preview renderer is suspended while an immersive session is active.

## Verification and limits

The localhost:2562 page's primary AR action generated an object and attempted tracked AR without opening a camera video. Its desktop in-app browser reported unsupported immersive surface tracking and displayed compatible Android/Chrome, Google Play Services for AR, and HTTPS guidance. Screenshot: `ar-enhancement-evidence/ar-surface-mode.jpg`.

Automated AR checks, lint, and production build were run. Existing shared zoom-hook TypeScript errors remain. Physical surface detection, world placement stability, and walk-around on AR hardware are not verified here. A phone needs an address reachable from that phone served over HTTPS; this desktop's localhost link cannot be used directly from a phone.

GeoGebra's documented target behavior is placement on a surface and walking around objects:
https://help.geogebra.org/hc/en-us/articles/8493632359069-3D-Calculator

This change uses the existing web AR tracking implementation. It does not add a native Android ARCore or iOS ARKit renderer to Capacitor, and does not claim universal device compatibility.
