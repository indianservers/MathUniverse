# Known hand gestures

The shared camera and native-hand intelligence pipeline now recognizes open palm, fist, pointing, V, three fingers, four fingers, thumbs up/down, and shaka from actual 21-point landmarks. Pinch remains an optional fallback for unclassified poses. Command poses cannot accidentally begin a grab.

The fist uses a palm anchor, rather than the moving thumb/index midpoint. Open-palm release commits the existing transaction. Pointing uses the index tip. Timed commands require 650ms (pointing selection 800ms), fire once, and rearm after a 300ms neutral/release interval. Commands are suppressed during a grab. Poor-quality, missing or fast-moving hands do not issue commands.

The in-app guide lists 19 actions and descriptions. Workspace commands call existing selection, buttons and validation. A tool that is not present reports that it is unavailable. Camera AR undo/redo applies to hand transforms; tracked AR undo/redo applies to its manipulation transform, rather than claiming to undo unrelated mathematical edits. Native hardware behavior remains unverified.

Working-area feedback shows the 21 joints, bone connections, highlighted fingertips, and recognized pose. The workspace overlay uses the exact mirrored/projected tracking coordinates, clips to the active working graph, passes pointer events through, and clears stale landmarks. Camera AR retains its existing visible hand points. Native tracked AR retains real joint markers.

Validation:
- 41 targeted tests pass, including all nine poses, mirrored thumbs, non-pinch fist acquisition, open-palm release, command timing, suppression while holding, and rearm.
- Synthetic landmark browser replay moves real workspace models, selects/traces the graph, and confirms the working-area landmark overlay on all four integrated workspace routes. These are synthetic input checks, not a real-user camera recognition claim.
- Fake-camera browser checks on all four workspace routes pass with no JavaScript errors: camera track cleanup, minimize/restore and mobile layout remain functional.
- Production build passes with the existing large-chunk warning.
- Scoped typechecking retains existing geometry/workspace foundation errors; the final log has no diagnostics in the changed gesture, camera, tracked-AR or immersive-manager modules.
- Physical camera gestures and native XR tracking require real-device testing.

The complete gesture-to-action list is rendered by GestureActionTable from the shared gestureActions catalog.
