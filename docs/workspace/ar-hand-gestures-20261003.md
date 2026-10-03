# AR hand gestures

Dedicated AR implementation; regular 2D/3D workspaces are unchanged by this feature.

## Camera AR: 2D, 3D, and geometry

Select a generated object, start Camera or AR, then enable **Hand gestures**. Pinch thumb and index finger and move the hand to translate the selected object. Pinch with both hands and change their separation to resize; twist the line between the hands to rotate in the camera plane. Open fingers to release. Depth remains controlled by Near/Far because image landmarks do not provide absolute camera depth. This manipulates whole objects, not individual triangle vertices.

Google MediaPipe Hand Landmarker runs locally in a worker at up to 10 frames per second, with one frame in flight. Model and WASM are bundled locally. No camera frames are uploaded. Turning gestures off, switching objects, or leaving camera mode terminates the worker. Hidden-page and lost-hand input release the gesture baseline. Tracking failure leaves touch controls available.

## Tracked WebXR AR

The session requests optional `hand-tracking`. Enable **Native hand gestures** after placing an object. WebXR joint poses drive one-hand translation in world space and two-hand scaling/yaw. Grab acquisition is limited to 45 cm from the object's origin. Optional hand input does not prevent surface placement on devices without tracked hands. Phone users without native hand joints can use the camera-overlay tracker; it is not run concurrently with an immersive XR camera session.

ARCore's documented fundamental APIs concern device/environment tracking and placement; this web implementation uses WebXR hands where exposed and MediaPipe for camera-hand landmarks:
- https://developers.google.com/ar/develop/fundamentals
- https://developer.mozilla.org/en-US/docs/Web/API/XRHand
- https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker/web_js

## Verification

- AR gesture tests cover grab/release, hysteresis, tracking loss, hand count/order changes, jumps, two-hand resize/rotation, scale bounds, invalid coordinates, landmark validation, and depth preservation.
- All 135 AR tests passed across 11 files. Scoped lint passed. Production build passed with existing CSS/bundle warnings. Scoped TypeScript validation found only the pre-existing `useCanvasZoomLock.ts` WheelEvent listener errors at lines 24 and 28.
- Browser worker initialization exposed a `ModuleFactory not set` error; switching to MediaPipe's module WASM loader fixed it. Local model loaded and a blank frame returned `hands` with empty landmark arrays, as expected.
- Browser UI verified gesture guidance and disabled toggle while camera permission/stream was unavailable. Screenshot: `ar-enhancement-evidence/ar-hand-controls.jpg`.
- Physical phone hand recognition, occlusion/lighting behavior, sustained mobile performance, and native XR hands require hardware validation. No 100% physical-device success claim is made.
