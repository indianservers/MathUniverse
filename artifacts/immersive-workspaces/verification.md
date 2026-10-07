# Immersive workspace integration

The enhancement is scoped to `/math-lab/3d-graphing`, `/workspace/graph`, `/workspace/3d`, and `/workspace/geometry`. The existing renderers, project stores, mathematical solvers, object selection, and inspectors remain in use.

## Implemented

- Shared NORMAL / AR / HAND_GESTURE / AR_HAND_GESTURE controller and compact top-right buttons.
- Reuses the existing MediaPipe worker, camera-request lifecycle, temporal HandIntelligenceEngine, SpatialHandEngine, and TrackedPlacement / ARSpatialIntelligence.
- One camera stream and worker for desktop hands. Native XR hands use the existing renderer's frame loop, with the device XR camera for projection.
- AR uses the live Three.js scene on its existing renderer. SVG workspaces are drawn as a live mathematical board in XR; source SVG appearance and model edits are synchronized.
- Tracked hit-test placement with a reticle, horizontal / vertical surface filtering, explicitly chosen free-space placement, optional spatial anchors, re-anchoring, physical scale presets, position lock, and pose controls.
- Existing workspace buttons, sliders, checkboxes and numeric inspector controls also accept deliberate hand input. AR includes a compact panel that runs the original workspace controls. Destructive actions require confirmation.
- Deliberate pinch selection and grabs, movement, wrist rotation, two-hand scale / rotation, palm navigation, hover feedback, confidence HUD, guide, detected-hand readiness calibration, mirror control, response profiles, and cursor settings.
- 2D graph curves remain mathematically defined. Curve selection and tracing, view navigation, and existing linked / parameter point manipulation delegate to existing callbacks.
- 3D graph display transforms are persisted with surface layers. Labels and differential/slice markers follow the transformed layer. Probe samples delegate to the existing analysis callback.
- Geometry points and whole constructions are edited through `solveConstruction`; constraints and trace paths remain active.
- 3D object transforms and face dimensions delegate to the existing inspector/model setters. Sphere and cylinder dimension rules remain valid. Locked models are rejected.
- One existing undo transaction per grab; snapping accumulates small deltas before snapping.
- Camera cancellation, late-stream cleanup, mode exit, resize, and unsupported-device messaging.

## Verification

- Production build passes (large-chunk warning remains).
- 76 targeted tests pass, including grab transactions, locks, rotation, two-hand scale, camera cancellation, and existing mathematical/AR foundation tests.
- Changed files have no ESLint errors. Existing hook warnings were not treated as a clean global lint result.
- Browser audit on all four routes at desktop and 390px mobile: buttons visible; no document overflow; no JavaScript errors.
- Browser fake-camera checks: exactly one live camera track, camera stops on exit, and numerical workspace state is retained. Minimize/restore keeps the video connected.
- Browser replay of deliberate hand input through the real controller and adapters: geometry point moved, 3D object position changed, 3D surface display transform changed, and 2D graph selection/tracing/navigation changed. These are synthetic input tests, not real-camera hand detection claims.
- Browser inspector gesture check: uniform scale changed from 1 to 1.4 through the original input handler; one Undo restored 1.
- Scoped TypeScript compilation reaches existing errors in geometry/workspace foundation modules. No diagnostics in the new immersive modules or graph adapters. This is not a passing repository-wide typecheck.

## Practical limits

Real hands, physical wall/table placement, native XR depth manipulation, anchors, simultaneous AR/native hands, and device frame rate require compatible hardware and remain unverified here. Desktop camera tracking supplies image-plane gestures rather than claiming metric room depth. Native XR supports depth through real joint poses.

The current 3D geometry models are parameter based. Faces change dimensions; arbitrary free-mesh vertex deformation is not implemented. Analysis, inspection and parameter actions remain available through the original workspace controls and their compact AR access panel. Text/expression entry retains the existing keyboard and touch tools. Dedicated gestures for destructive deletion were intentionally not introduced.

The implementation provides the shared immersive integration and model interactions. Hardware-specific behavior is not claimed to have passed device testing.
