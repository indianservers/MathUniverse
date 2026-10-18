# AR hand tracking assets

MediaPipe Tasks Vision 1.0.1 WASM files are copied from the pinned npm dependency `@mediapipe/tasks-vision` (Apache-2.0). Keep the runtime files aligned when upgrading that dependency.

Hand Landmarker float16 model (version 1), downloaded from Google's official model distribution:
https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task

These files are served locally. Camera frames are processed in an AR-only worker and are never sent to a server. Tracking is opt-in and reuses the AR camera stream.
