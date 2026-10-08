# Ruhi conversational context upgrade

The local app remains on port 9867. This upgrade uses deterministic canonical commands and workspace state; it does not retrain or replace the TensorFlow.js model weights.

## Implemented behavior

- Dedicated follow-up storage preserves the complete canonical plan, known arguments, object IDs, missing slot, question and stable choices. Incomplete multi-step plans commit only after their missing arguments are supplied.
- Move distance/direction/destination, rotation angle, scale factor, 2D reflection axis or 3D reflection plane, line endpoints, construction reference/through-point, plural-circle radius and selected construction choices can continue across turns. There is no implicit one-unit move. An unknown destination such as "point 4" asks for full coordinates while retaining the original moving object.
- Working memory retains at most 25 turns, canonical commands, active/selected objects, recent references, pending construction and mathematical results. Numeric results remain separate from workspace object targets.
- Short answers support numbers, word numbers, units, degrees/radians, movement direction, clockwise/anticlockwise, object labels, numbered/ordinal choices, both/all and proposal yes/no. Invalid values and mismatched units cannot execute a pending action.
- Radius corrections update existing circles; direction/angle corrections revise the resulting transformation; supported target corrections restore the previous target and apply the action to the intended target. Pending corrections update the pending command before any execution. Corrections refuse stale workspace state.
- Repeat/another/other/new/old references, named triangle vertices/edges and named lines are handled through existing scene descriptors. Object labels stay unique after deletion and duplication; ordinal references use creation order.
- Canvas updates synchronize scene references and selection. Deleted targets invalidate pending commands; undo/redo restore saved scene context. Conversation reset preserves workspace geometry.
- Mathematical result explanations are saved independently of later mutations. Default replies are compact; why/how/show-steps replies use those saved explanations. Small geometry definitions are deterministic and do not alter geometry.
- Inscribed-square circles ask for confirmation; rectangle diagonals ask which diagonal; lines through queried points ask for direction. Parallel-line distance uses perpendicular distance, rather than line length or center distance.
- The Training Lab has a Conversation Debugger with canonical plans, subjects before/after, resolved references, missing slots, questions, execution outcomes and separate heuristic confidence diagnostics. The debugger is excluded from the student production bundle.

## Validation

- **4,777/4,777 tests passed** across Ruhi and offline intelligence, including **457 multi-turn conversation cases**. Of those 457, 320 are distance/angle/reset/replacement numeric variants across four workspace modes; 137 are authored replay and scenario instances, also including cross-workspace cases. These counts are controlled tests, not an estimate of unrestricted-language accuracy.
- **8/8 real-browser workspace checks passed**, covering the previous v4.1 conversations and the new pending-command/result-memory sequence in 2D geometry, 2D graphs, 3D geometry and 3D graphs. Software rendering avoids a reproducible Chromium GPU stall.
- The final four-workspace browser sequence additionally checks native reflection coordinates, correction of a pending direction and completion of an incomplete absolute destination. All four pass.
- **12/12 admin dataset replays passed**, with final scene assertions. See `admin-replay.json` and `/datasets/math-robo-conversations.json`.
- Scoped intelligence TypeScript checking passed. Student and explicitly enabled admin production builds passed; the student assets contain neither the Conversation Debugger nor Training Lab markers.
- Full-project TypeScript checking still reports existing geometry/workspace/mobile errors. The build-configuration `replaceAll` compatibility error was fixed and its separate TypeScript check passes.
- Existing bundled model files have no Git changes.

## Scope and defaults

The assistant remains mathematical and uses the existing operation registry. Existing unsupported operations remain unsupported, including specialized 3D constructions already excluded by that registry. Existing default creation placement and dimensions are retained; plural circles can initially share the default center. Direction-only lines through a result point use the existing six-unit display span. Numeric graph searches retain their existing bounded domain.

The supplied target transcript places a vertical line through a rectangle's center and then through its left edge, but states their distance is four units. For a rectangle four units wide, that distance is **two units**. The implementation and test assert the actual geometry.

Confidence fields are deterministic diagnostic scores, not calibrated statistical probabilities. No model publication or Git push is part of this phase.
