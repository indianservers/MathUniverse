# AR camera startup audit — 3 October 2026

Reported failure: Camera / AR did not start even after permission was granted, at http://localhost:2562/modules/ar-math-lab.

## Defects fixed

- React StrictMode performs an effect setup/cleanup/setup cycle. ARMathLab's cleanup set `mountedRef.current=false` permanently. A successfully granted stream was then immediately stopped and startup never became active. Effect setup now restores the mounted flag.
- Five camera retries included permission denial, unavailable hardware, and timeouts. Startup now prefers the rear camera without requiring it and retries only a constraint failure with an unconstrained video request.
- Timer cleanup was missing. Resolved requests now remove their timer and cancellation listener.
- Exit, preview switches, visibility changes, and unmount did not invalidate pending startup. AbortController now invalidates requests, stops late streams, and prevents stale success/error updates.
- Startup/error messages could be hidden away from the scene. Visible cancel, retry, and preview controls now accompany camera feedback. Timeouts do not falsely mark permission denied.
- Support messages promised AR readiness before a camera was connected. They now distinguish API availability from granted/active camera access and prioritize HTTPS requirements.

## Validation

- 149 AR tests passed in 12 files, including 12 camera startup regression cases and 2 support-message/security cases. Scoped lint passed.
- Production build passed; existing CSS/bundle warnings remain. Scoped TypeScript check found only pre-existing WheelEvent listener errors in `useCanvasZoomLock.ts` lines 24 and 28.
- Browser test rendered the actual ARMathLab component under React.StrictMode with a deterministic synthetic video stream. Camera grant reached `camera-preview / active`, permission granted, track live. Preview exit stopped the track. A grant after cancellation stopped the late track and stayed in preview. AR grant reached `ar / active`; Exit stopped all tracks.
- Screenshot `ar-enhancement-evidence/ar-camera-granted-regression.jpg` shows this synthetic regression fixture, not a physical camera.
- The actual in-app browser page on port 2562 subsequently reached `camera-preview / active` and displayed `Camera is active` with permission granted after the fix. Physical phone AR tracking and hand recognition remain outside this camera-startup verification.

getUserMedia can remain pending if its permission request is not completed, and requires a secure context:
https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
