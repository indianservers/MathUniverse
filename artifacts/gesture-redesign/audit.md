# Deterministic hand controls

The webcam, MediaPipe worker, landmark overlay, AR placement, existing mathematical models and input controls are retained. A shared `GestureController` now routes camera and native AR input through one small gesture language. The old grab/undo/grid commands are not called by these user interaction paths.

| Gesture | Action |
|---|---|
| Index only | Select next scene object, once per presentation; cycle includes None |
| Open palm | Enlarge |
| Victory | Shrink |
| Closed fist | Immediately hold / stop |
| Thumb up / down / left / right | Move in that direction |
| Index + little finger | Rotate; fresh neutral orientation reference |
| Index + middle + ring | Tilt; separate fresh neutral reference |
| OK | Reset only the selected object; edge latch and cooldown |

The registry follows renderer order, supports objects added after existing axes, preserves original transforms, and removes deleted objects safely. X/Y/Z axes are selectable in 3D; X/Y axes are selectable in 2D. Unsupported transforms produce a clear status. Pure 2D tilt is disabled. Function graphs support translation and vertical scaling through their existing mathematical transformation model; arbitrary rotation is unavailable for those functions.

Gesture entry uses recent-frame voting, 350 ms stability, 0.8 activation / 0.6 retention confidence, one active hand, bounded delta time, 4 degree angular dead zones and smooth rotation/tilt interpolation. Fists and missing hands stop writes immediately. Reappearing hands must stabilize again. Scale is clamped to 0.2–5. Continuous movement begins slowly and increases modestly after a sustained hold.

The compact HUD shows human-readable selection, gesture and operation, with angle feedback for rotation/tilt. Help contains only the new controls. Technical feedback is collapsed in development builds and absent from production builds. Landmarks use cropped display coordinates while recognition uses uncropped, mirrored camera coordinates. This separation fixes a camera-aspect-ratio bug that could classify a fist as a thumb direction.

Camera and tracked AR register individual rendered objects. The current camera module displays the selected graph or solid; its existing selection behavior is preserved. Registry tests verify isolation when multiple objects are registered. AR action buttons now invoke their zero-argument callbacks rather than passing click events into equation/solid parsers.

## Verification

- 70 tests pass across five gesture/controller test files. New scenarios cover all 11 poses, normalized near/far sizes, directional mirroring, selection holds and rearming, None, dynamic ordering, scale limits, immediate HOLD, tracking loss, one-hand ownership, mode references, dead zones, original transforms, isolated resets, and noisy frames.
- Browser regression passes on `/math-lab/3d-graphing`, `/workspace/3d`, `/workspace/graph`, and `/workspace/geometry`. Actual adapter objects move, hold and reset; selection cycles through axes and None; the same WebGL canvas stays mounted with no context loss or page errors. See `browser.json` and screenshots.
- Camera AR browser test uses a fake webcam and injected worker landmarks through the actual camera pipeline. Cube selection, movement, immediate fist HOLD and OK reset pass with no page errors. See `camera.json`.
- Production build passes. Gesture engine and AR scene scoped type checks pass. Integration/full-app type checks still report existing errors in the canvas-wheel listener, geometry panel, core object union narrowing and mobile workspace refs; no gesture implementation errors were reported. Scoped lint has no errors and retains existing hook warnings.

Physical webcam recognition under bright/moderate lighting, perspective variations, and native WebXR hardware remain unverified. Synthetic fixtures and a fake camera cannot establish real-world recognition reliability. Those acceptance conditions need an on-device check.
