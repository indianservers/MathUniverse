# Hand interaction correction

The reported screenshot showed **Hand gestures off**. The controller previously defaulted to disabled and displayed setup guidance even with an active camera and selected graph.

## Changes

- Hand tracking defaults to on when camera view mounts, and runs whenever a camera stream is available. It can detect hands before an object is selected; gestures require a selected displayed object. Users can pause tracking explicitly.
- Every recognized hand shows 21 landmark dots. Status distinguishes loading, no hands, detected hands, pinch-selected object, two-hand resize, and failures. A failed tracker offers Retry.
- Pinch selects/grabs the displayed object. Move mode translates it; two pinched hands spread to expand, move together to shrink, and twist to rotate. Open fingers release.
- Resize mode supports one pinched hand moving up to enlarge and down to shrink without translating the object. Scale bounds and lost-tracking safeguards remain.
- Inference prefers GPU with CPU fallback, uses reusable OffscreenCanvas frame conversion, and uses detection/presence thresholds of 0.4. Frames remain on-device.

## Verification

- 154 AR tests passed across 12 files. Five new gesture cases cover selection feedback, one-hand expansion/shrinking, two-hand resize without translation, and release. Scoped lint and production build passed. Scoped TypeScript validation retains only existing shared WheelEvent listener errors in `useCanvasZoomLock.ts`.
- A browser integration fixture ran the actual controller under React.StrictMode with synthetic video and simulated landmark results. Without pressing the hand toggle it detected one hand. Pinch selected; Resize + upward hand motion increased scale from 1.000 to 1.221. Two pinches spreading increased it to 1.405; bringing them together reduced it to 1.194. Object depth/position remained [0,0,-2]; opening fingers released the selection. Evidence: `ar-enhancement-evidence/ar-hand-expand-regression.jpg` (explicitly synthetic).
- The supplied screenshot was tested locally, both whole and hand-focused. The detector returned zero hands for those rendered images, which contain graph/control overlays. This does not establish recognition on raw camera frames. No positive live recognition claim is made; phone/webcam lighting, hand pose, and continuous tracking still require live validation.
- The supplied personal image and temporary browser fixtures were removed from the project after testing. No camera frames or supplied image were uploaded to a remote inference service.

## Use

Reload the AR Math Lab to load the updated controller. Open Camera overlay with a graph/geometry object. Hand gestures should show On automatically. Look for landmark dots and a detected-hand count. Pinch thumb/index to select and move; use two pinched hands to expand/shrink, or select Resize and move one pinched hand up/down. Keep the whole hand inside the raw camera frame.
