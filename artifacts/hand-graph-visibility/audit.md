# Hand tracking graph visibility fix

The surface workspace adapter called the camera-reset callback for every open-hand navigation frame, even when zoom was unchanged. That callback increments the Canvas key, destroying and recreating the renderer repeatedly. Four-finger poses also qualified for navigation through the loose open-score fallback.

Navigation now dispatches incremental camera movement to the existing Three.js scene. OrbitControls share the updated target, and both consecutive frames must contain open palms. Hand command poses cannot initiate navigation. The status panel uses an opaque white background and sits above scene label portals.

Validation: 20 gesture/controller tests passed; production build passed. Browser regression exercises 50 incremental navigation frames plus 40 synthetic hand frames: the same canvas remains mounted, no WebGL context loss occurs, the rendered surface remains visible, and no page errors occur. See browser.json and after.png. Physical webcam recognition has not been tested.
