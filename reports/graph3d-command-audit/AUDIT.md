# Ruhi 3D command execution audit

Generated Thursday, 15 October 2026 at 8:17:15 pm IST. Browser: Chromium / ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver). All command outcomes below come from executed requests; no unexecuted case is marked passed.

| Test Category | Total | Passed | Failed | Unsupported |
|---|---:|---:|---:|---:|
| Object Creation | 20 | 18 | 0 | 2 |
| Delete & Reset | 10 | 9 | 0 | 1 |
| Positioning | 15 | 9 | 0 | 6 |
| Scaling | 15 | 13 | 0 | 2 |
| Rotation | 15 | 9 | 0 | 6 |
| Appearance | 15 | 6 | 0 | 9 |
| 3D Graphing | 15 | 6 | 0 | 9 |
| Geometry Relations | 15 | 7 | 0 | 8 |
| Conversational AI | 15 | 14 | 0 | 1 |
| Error & Stress Tests | 15 | 12 | 0 | 3 |
| **Total** | **150** | **103** | **0** | **47** |

## What was exercised

The browser calls the same runSemanticAssistant entry point as student chat, including live semantic planning, context resolution, parameter validation, the mounted workspace handler, committed scene verification and the Three.js renderer. Setup objects are created through natural-language requests. Each independent case clears the workspace and resets conversation/history through the engine's existing import mechanism. Conversational cases include authored preceding turns; compound requests are submitted as one request.

The suite records original setup, expected semantic assertions, actual parser output, actual execution result, logical scene snapshots, Three.js vertex counts, finite coordinates, visibility, camera-frustum inclusion (complete bounds for native solids and points), rendered frames and draw calls. Failed cases have screenshots. Stable object IDs and semantic labels identify objects across before/after snapshots.

Rendering assertions demonstrate real geometry in the mounted renderer. They do **not** establish pixel-perfect appearance, absence of occlusion, visual distinction of overlapping duplicates, physically correct glass/metal, or a stress benchmark on student hardware. Screenshots require human visual review. Production neural weights are not trained or altered by this audit. Existing learning tests use isolated test models.

## Metrics

- Recorded: 150/150; skipped/unrecorded: 0. Passed checks comprise 92 successful operations/queries, 7 safe clarifications, and 4 invalid-input rejections. Unsupported requests are separate.
- Parser action-family agreement: 100.0% (150/150 assertions). This is agreement with authored action-family expectations, not an NLP benchmark across unseen paraphrases.
- Execution/state assertion accuracy: 100.0% (532/532 assertions).
- Rendering assertion accuracy: 100.0% (693/693 assertions).
- Context assertion accuracy: 100.0% (12/12 assertions).
- Average command time including the bounded rendering settle window: 286.9ms.
- Regression failures against the recorded 23-case exploratory baseline: none. The baseline was interrupted to repair the native-mesh bottleneck; it is not a complete pre-change run.
- Verified before/after fixes against that baseline: 9, 17. Other changes have regression coverage, but no fabricated before/after result.
- Safe clarifications counted as passed: 14, 16, 41, 71, 138, 142, 143. These requested missing or replacement parameters and did not mutate geometry. Cases 138, 142 and 143 were clarified rather than rejected with invalid status; this is recorded explicitly rather than counted as successful geometry execution.
- Invalid-input/performance-budget cases counted as passed only when rejected without scene mutation.

## Implementation changes

- Use native local Three.js geometry for assistant solids and points; preserve mathematical transforms, semantic IDs, graph-layer editing and resource disposal. A cube uses one 24-vertex mesh instead of twelve sampled surface patches.
- Automatically fit complete commanded mesh bounds into the camera frustum while preserving an already useful view.
- Separate plural mutation targets from two-object geometry queries; preserve unrelated objects on typed deletion.
- Extend spatial grammar for rectangular prisms, absolute origins, upward/higher movement, half-size scaling, independent dimensions, side lengths, cylinder radius, rotation reset, upside-down orientation, selected-point constructions, compound creation ellipsis and counted undo/redo.
- Normalize large number words before validation so a thousand-object request cannot silently create one object. Reject malformed numeric tuples and unspecified negative/infinite dimensions.
- Explicitly reject unavailable qualifiers before generic shape inference so partial interpretation cannot report success.

## Coordinates and defaults

Stored positions and XYZ Euler angles remain mathematical coordinates. The existing language convention uses +Y for up and -Z for backward; the graph display maps (x,y,z) to Three.js (x,z,y), independently of camera orbit. Larger/smaller solid defaults are factors 2/0.5; taller uses 1.5 and Z stretching uses 2. Directed lengths still ask for an explicit scale factor. Coordinate tuples retain their stated XYZ values. Explicit graph surfaces retain the studio’s existing display height compression when sampled absolute z exceeds 8. The audit does not establish uniform world units across mixtures of those normalized surfaces and native objects.

## Failures

No failing recorded cases.

## Unsupported commands

- 19. Generate 10 random spheres.
- 20. Place a cube and a sphere side by side.
- 29. Delete objects inside the selected group.
- 37. Position the sphere above the cube.
- 38. Put the cone next to the cylinder.
- 42. Align all objects along the Y-axis.
- 43. Place three cubes in a row.
- 44. Distribute five spheres evenly.
- 45. Move all objects to the positive X region.
- 58. Make all cubes the same size.
- 59. Restore the selected object's original size.
- 65. Spin the selected object continuously.
- 66. Stop the rotation.
- 69. Align the cylinder with the Z-axis.
- 72. Rotate the cube around the world origin.
- 73. Animate one complete rotation.
- 75. Rotate the grouped objects together.
- 78. Make the cylinder transparent.
- 79. Set the cone opacity to 50%.
- 80. Give the cube a metallic finish.
- 81. Make the sphere look like glass.
- 83. Apply different colors to all five cubes.
- 84. Display the cube in wireframe mode.
- 88. Highlight the selected object.
- 89. Remove the highlight.
- 90. Restore the default material.
- 94. Graph x² + y² + z² = 25.
- 96. Draw a 3D helix.
- 99. Plot the parametric curve x = cos(t), y = sin(t), z = t for 0 ≤ t ≤ 10.
- 100. Plot 100 random points in 3D.
- 101. Display the X, Y and Z axes.
- 102. Hide the coordinate grid.
- 103. Show the coordinate grid again.
- 104. Label the coordinate axes.
- 105. Change the graph range to −10 through 10 on all three axes.
- 106. Place a sphere inside a cube.
- 107. Put a cube on top of a cylinder.
- 108. Stack three cubes vertically.
- 109. Arrange six spheres in a circle.
- 110. Create a pyramid using four points.
- 116. Find the intersection of two planes.
- 117. Group the selected cubes.
- 118. Ungroup the selected objects.
- 135. Restore the scene to its last saved state.
- 147. Repeat the previous command five times.
- 148. Create two cubes, delete one, then restore it.
- 150. Create five cubes, group them, rotate the group, ungroup them, and delete only the first cube.

Unsupported means the request was explicitly rejected without changing the scene; it does not mean its requested feature was implemented. Grouping/ungrouping, relative arrangements, advanced materials and other listed capabilities remain outside this implementation. This work does not claim the entire requested feature set is complete.

## Reproduce and inspect

1. Start Vite: npm run dev -- --host 127.0.0.1 --port 4317.
2. Run npm run audit:ruhi:3d, or node scripts/audit-graph3d-commands.mjs 21 64 to rerun specific IDs. GRAPH3D_AUDIT_URL overrides the development server URL.
3. Run npm run test:ruhi:3d for adapter and safety regressions.
4. Open /src/graph-studio/command-audit/dashboard.html on the development server to inspect saved evidence and rerun a case, category, failures or all commands. The dashboard is not linked from student UI or shipped as a production entry.
5. Generate this report and the verified correction candidates: node scripts/report-graph3d-command-audit.mjs.

Full evidence: results.json. Baseline: baseline.json. Developer command-to-capability mapping: corpus.json expected fields plus each result's actualParserOutput.

## Final validation

- Recorded full subsystem sweep: 7985 passed / 7989 recorded, 4 initial failures. All sweep failures cleared by recorded targeted reruns: true. In this audit, two dimension checks used an earlier cached planner and two other checks timed out. This is a sweep plus focused reruns, not a claim that the initial sweep was all green.
- Latest adapter/safety regression suite: 35 passed.
- Isolated capability/model-learning rerun: 32 passed. Test-only timeouts were 30 seconds for capability cases; the existing learning test retains its own timeout. Production command budgets were unchanged.
- Additional browser scaling compositions: 2 passed.
- Developer dashboard: 150 rows and case 121 rerun passed, no page errors. The blue-cube screenshot was manually reviewed after the complete-bounds camera fix.
- Production build: passed.
- Project-wide typecheck: failed with 123 diagnostics in untouched files; no clean typecheck is claimed. The two initial harness diagnostics were repaired.

Logs and validation.json accompany this report. Test-generated unrelated tracked artifacts were preserved under regression-artifacts and restored to their original repository contents.
