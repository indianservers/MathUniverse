# Inverse Trigonometry: 25 implemented enhancements per page

These are working changes connected to the existing mathematics, not proposed placeholders. Each page has the following 25 improvements, applied to its own model context.

## Overview

Route: `/trigonometry/inverse/`

Choose arcsin/arccos/arctan in the new live starter; shared experiment controls drive both graph and unit circle.

| # | Implemented enhancement | Behavior |
|---|---|---|
| 1 | Compact navigation and headings | Reduces the space above the working model while keeping the page description. |
| 2 | Custom input step | Choose the amount used by the plus/minus buttons. |
| 3 | Boundary presets | Jump to the exploration interval’s lower, middle or upper input. |
| 4 | Signed and zero presets | Negate the input or select zero through the same live-model update. |
| 5 | Random exploration | Generate a valid input in the explorer interval. |
| 6 | Undo input changes | Restore the previous model input; history includes graph, slider and numeric edits. |
| 7 | Redo input changes | Replay an undone input without losing the current model connection. |
| 8 | Reset experiment input | Restore the initial input for this page/function context. |
| 9 | Animated interval sweep | Watch inputs and linked outputs evolve instead of reading static cards. |
| 10 | Sweep speed control | Choose 0.5×, 1× or 2× exploration speed. |
| 11 | Accessible sweep lifecycle | Pause offscreen/hidden and respect reduced motion; explicit Stop remains available. |
| 12 | Save experiment inputs | Bookmark up to eight inputs for this function/order context. |
| 13 | Restore and clear bookmarks | Return to a saved input or clear this context’s saved collection. |
| 14 | Persistent experiment notes | Store observations locally, separately for each function/order context. |
| 15 | Share the live input | Copy a deep link containing the model context and unrounded input; reload restores it. |
| 16 | Copy calculated result | Copy the currently evaluated result with the selected display precision. |
| 17 | Precision selection | Choose 2, 3, 4 or 6 decimal places without rounding the underlying model. |
| 18 | Two-input comparison | Evaluate a second input with the same function and branch rules. |
| 19 | Apply comparison input | Move the displayed model to the compared input. |
| 20 | Output-difference readout | Calculate the actual difference; propagate undefined values honestly. |
| 21 | Selectable live sample table | Evaluate nine inputs; selecting a row updates the real model. |
| 22 | CSV data export | Download unrounded sample inputs and outputs; angles explicitly use radians. |
| 23 | Graph zoom and fit | Zoom around the current point, zoom out and restore the complete graph. |
| 24 | Grid and native SVG export | Toggle plot gridlines and export the actual styled SVG diagram. |
| 25 | Keyboard visual control | Focus graph/circle; arrows adjust inputs, Shift makes fine steps, Home/End choose bounds. |

## Arcsin

Route: `/trigonometry/inverse/arcsin`

Use x in [−1,1]; y=arcsin(x) is linked to the right principal semicircle and output in [−π/2,π/2].

| # | Implemented enhancement | Behavior |
|---|---|---|
| 1 | Compact navigation and headings | Reduces the space above the working model while keeping the page description. |
| 2 | Custom input step | Choose the amount used by the plus/minus buttons. |
| 3 | Boundary presets | Jump to the exploration interval’s lower, middle or upper input. |
| 4 | Signed and zero presets | Negate the input or select zero through the same live-model update. |
| 5 | Random exploration | Generate a valid input in the explorer interval. |
| 6 | Undo input changes | Restore the previous model input; history includes graph, slider and numeric edits. |
| 7 | Redo input changes | Replay an undone input without losing the current model connection. |
| 8 | Reset experiment input | Restore the initial input for this page/function context. |
| 9 | Animated interval sweep | Watch inputs and linked outputs evolve instead of reading static cards. |
| 10 | Sweep speed control | Choose 0.5×, 1× or 2× exploration speed. |
| 11 | Accessible sweep lifecycle | Pause offscreen/hidden and respect reduced motion; explicit Stop remains available. |
| 12 | Save experiment inputs | Bookmark up to eight inputs for this function/order context. |
| 13 | Restore and clear bookmarks | Return to a saved input or clear this context’s saved collection. |
| 14 | Persistent experiment notes | Store observations locally, separately for each function/order context. |
| 15 | Share the live input | Copy a deep link containing the model context and unrounded input; reload restores it. |
| 16 | Copy calculated result | Copy the currently evaluated result with the selected display precision. |
| 17 | Precision selection | Choose 2, 3, 4 or 6 decimal places without rounding the underlying model. |
| 18 | Two-input comparison | Evaluate a second input with the same function and branch rules. |
| 19 | Apply comparison input | Move the displayed model to the compared input. |
| 20 | Output-difference readout | Calculate the actual difference; propagate undefined values honestly. |
| 21 | Selectable live sample table | Evaluate nine inputs; selecting a row updates the real model. |
| 22 | CSV data export | Download unrounded sample inputs and outputs; angles explicitly use radians. |
| 23 | Graph zoom and fit | Zoom around the current point, zoom out and restore the complete graph. |
| 24 | Grid and native SVG export | Toggle plot gridlines and export the actual styled SVG diagram. |
| 25 | Keyboard visual control | Focus graph/circle; arrows adjust inputs, Shift makes fine steps, Home/End choose bounds. |

## Arccos

Route: `/trigonometry/inverse/arccos`

Use x in [−1,1]; y=arccos(x) is linked to the upper semicircle and decreasing output in [0,π].

| # | Implemented enhancement | Behavior |
|---|---|---|
| 1 | Compact navigation and headings | Reduces the space above the working model while keeping the page description. |
| 2 | Custom input step | Choose the amount used by the plus/minus buttons. |
| 3 | Boundary presets | Jump to the exploration interval’s lower, middle or upper input. |
| 4 | Signed and zero presets | Negate the input or select zero through the same live-model update. |
| 5 | Random exploration | Generate a valid input in the explorer interval. |
| 6 | Undo input changes | Restore the previous model input; history includes graph, slider and numeric edits. |
| 7 | Redo input changes | Replay an undone input without losing the current model connection. |
| 8 | Reset experiment input | Restore the initial input for this page/function context. |
| 9 | Animated interval sweep | Watch inputs and linked outputs evolve instead of reading static cards. |
| 10 | Sweep speed control | Choose 0.5×, 1× or 2× exploration speed. |
| 11 | Accessible sweep lifecycle | Pause offscreen/hidden and respect reduced motion; explicit Stop remains available. |
| 12 | Save experiment inputs | Bookmark up to eight inputs for this function/order context. |
| 13 | Restore and clear bookmarks | Return to a saved input or clear this context’s saved collection. |
| 14 | Persistent experiment notes | Store observations locally, separately for each function/order context. |
| 15 | Share the live input | Copy a deep link containing the model context and unrounded input; reload restores it. |
| 16 | Copy calculated result | Copy the currently evaluated result with the selected display precision. |
| 17 | Precision selection | Choose 2, 3, 4 or 6 decimal places without rounding the underlying model. |
| 18 | Two-input comparison | Evaluate a second input with the same function and branch rules. |
| 19 | Apply comparison input | Move the displayed model to the compared input. |
| 20 | Output-difference readout | Calculate the actual difference; propagate undefined values honestly. |
| 21 | Selectable live sample table | Evaluate nine inputs; selecting a row updates the real model. |
| 22 | CSV data export | Download unrounded sample inputs and outputs; angles explicitly use radians. |
| 23 | Graph zoom and fit | Zoom around the current point, zoom out and restore the complete graph. |
| 24 | Grid and native SVG export | Toggle plot gridlines and export the actual styled SVG diagram. |
| 25 | Keyboard visual control | Focus graph/circle; arrows adjust inputs, Shift makes fine steps, Home/End choose bounds. |

## Arctan

Route: `/trigonometry/inverse/arctan`

Sweep/sample ratios in [−10,10]; numeric input retains its wider existing interval. Angle readouts retain open ±π/2 endpoints.

| # | Implemented enhancement | Behavior |
|---|---|---|
| 1 | Compact navigation and headings | Reduces the space above the working model while keeping the page description. |
| 2 | Custom input step | Choose the amount used by the plus/minus buttons. |
| 3 | Boundary presets | Jump to the exploration interval’s lower, middle or upper input. |
| 4 | Signed and zero presets | Negate the input or select zero through the same live-model update. |
| 5 | Random exploration | Generate a valid input in the explorer interval. |
| 6 | Undo input changes | Restore the previous model input; history includes graph, slider and numeric edits. |
| 7 | Redo input changes | Replay an undone input without losing the current model connection. |
| 8 | Reset experiment input | Restore the initial input for this page/function context. |
| 9 | Animated interval sweep | Watch inputs and linked outputs evolve instead of reading static cards. |
| 10 | Sweep speed control | Choose 0.5×, 1× or 2× exploration speed. |
| 11 | Accessible sweep lifecycle | Pause offscreen/hidden and respect reduced motion; explicit Stop remains available. |
| 12 | Save experiment inputs | Bookmark up to eight inputs for this function/order context. |
| 13 | Restore and clear bookmarks | Return to a saved input or clear this context’s saved collection. |
| 14 | Persistent experiment notes | Store observations locally, separately for each function/order context. |
| 15 | Share the live input | Copy a deep link containing the model context and unrounded input; reload restores it. |
| 16 | Copy calculated result | Copy the currently evaluated result with the selected display precision. |
| 17 | Precision selection | Choose 2, 3, 4 or 6 decimal places without rounding the underlying model. |
| 18 | Two-input comparison | Evaluate a second input with the same function and branch rules. |
| 19 | Apply comparison input | Move the displayed model to the compared input. |
| 20 | Output-difference readout | Calculate the actual difference; propagate undefined values honestly. |
| 21 | Selectable live sample table | Evaluate nine inputs; selecting a row updates the real model. |
| 22 | CSV data export | Download unrounded sample inputs and outputs; angles explicitly use radians. |
| 23 | Graph zoom and fit | Zoom around the current point, zoom out and restore the complete graph. |
| 24 | Grid and native SVG export | Toggle plot gridlines and export the actual styled SVG diagram. |
| 25 | Keyboard visual control | Focus graph/circle; arrows adjust inputs, Shift makes fine steps, Home/End choose bounds. |

## Principal Values

Route: `/trigonometry/inverse/principal-values`

Explore original angles in degrees; the new folding graph uses radians and shows the selected principal branch. Tangent singularities stay undefined.

| # | Implemented enhancement | Behavior |
|---|---|---|
| 1 | Compact navigation and headings | Reduces the space above the working model while keeping the page description. |
| 2 | Custom input step | Choose the amount used by the plus/minus buttons. |
| 3 | Boundary presets | Jump to the exploration interval’s lower, middle or upper input. |
| 4 | Signed and zero presets | Negate the input or select zero through the same live-model update. |
| 5 | Random exploration | Generate a valid input in the explorer interval. |
| 6 | Undo input changes | Restore the previous model input; history includes graph, slider and numeric edits. |
| 7 | Redo input changes | Replay an undone input without losing the current model connection. |
| 8 | Reset experiment input | Restore the initial input for this page/function context. |
| 9 | Animated interval sweep | Watch inputs and linked outputs evolve instead of reading static cards. |
| 10 | Sweep speed control | Choose 0.5×, 1× or 2× exploration speed. |
| 11 | Accessible sweep lifecycle | Pause offscreen/hidden and respect reduced motion; explicit Stop remains available. |
| 12 | Save experiment inputs | Bookmark up to eight inputs for this function/order context. |
| 13 | Restore and clear bookmarks | Return to a saved input or clear this context’s saved collection. |
| 14 | Persistent experiment notes | Store observations locally, separately for each function/order context. |
| 15 | Share the live input | Copy a deep link containing the model context and unrounded input; reload restores it. |
| 16 | Copy calculated result | Copy the currently evaluated result with the selected display precision. |
| 17 | Precision selection | Choose 2, 3, 4 or 6 decimal places without rounding the underlying model. |
| 18 | Two-input comparison | Evaluate a second input with the same function and branch rules. |
| 19 | Apply comparison input | Move the displayed model to the compared input. |
| 20 | Output-difference readout | Calculate the actual difference; propagate undefined values honestly. |
| 21 | Selectable live sample table | Evaluate nine inputs; selecting a row updates the real model. |
| 22 | CSV data export | Download unrounded sample inputs and outputs; angles explicitly use radians. |
| 23 | Graph zoom and fit | Zoom around the current point, zoom out and restore the complete graph. |
| 24 | Grid and native SVG export | Toggle plot gridlines and export the actual styled SVG diagram. |
| 25 | Keyboard visual control | Focus graph/circle; arrows adjust inputs, Shift makes fine steps, Home/End choose bounds. |

## Compositions

Route: `/trigonometry/inverse/compositions`

Compare both orders of each function pair. Shared links restore function, order, input unit and value. Direct outputs are numbers; reverse outputs are angles.

| # | Implemented enhancement | Behavior |
|---|---|---|
| 1 | Compact navigation and headings | Reduces the space above the working model while keeping the page description. |
| 2 | Custom input step | Choose the amount used by the plus/minus buttons. |
| 3 | Boundary presets | Jump to the exploration interval’s lower, middle or upper input. |
| 4 | Signed and zero presets | Negate the input or select zero through the same live-model update. |
| 5 | Random exploration | Generate a valid input in the explorer interval. |
| 6 | Undo input changes | Restore the previous model input; history includes graph, slider and numeric edits. |
| 7 | Redo input changes | Replay an undone input without losing the current model connection. |
| 8 | Reset experiment input | Restore the initial input for this page/function context. |
| 9 | Animated interval sweep | Watch inputs and linked outputs evolve instead of reading static cards. |
| 10 | Sweep speed control | Choose 0.5×, 1× or 2× exploration speed. |
| 11 | Accessible sweep lifecycle | Pause offscreen/hidden and respect reduced motion; explicit Stop remains available. |
| 12 | Save experiment inputs | Bookmark up to eight inputs for this function/order context. |
| 13 | Restore and clear bookmarks | Return to a saved input or clear this context’s saved collection. |
| 14 | Persistent experiment notes | Store observations locally, separately for each function/order context. |
| 15 | Share the live input | Copy a deep link containing the model context and unrounded input; reload restores it. |
| 16 | Copy calculated result | Copy the currently evaluated result with the selected display precision. |
| 17 | Precision selection | Choose 2, 3, 4 or 6 decimal places without rounding the underlying model. |
| 18 | Two-input comparison | Evaluate a second input with the same function and branch rules. |
| 19 | Apply comparison input | Move the displayed model to the compared input. |
| 20 | Output-difference readout | Calculate the actual difference; propagate undefined values honestly. |
| 21 | Selectable live sample table | Evaluate nine inputs; selecting a row updates the real model. |
| 22 | CSV data export | Download unrounded sample inputs and outputs; angles explicitly use radians. |
| 23 | Graph zoom and fit | Zoom around the current point, zoom out and restore the complete graph. |
| 24 | Grid and native SVG export | Toggle plot gridlines and export the actual styled SVG diagram. |
| 25 | Keyboard visual control | Focus graph/circle; arrows adjust inputs, Shift makes fine steps, Home/End choose bounds. |

Additional improvements: degree/radian experiment output selection wherever output is an angle; clear undefined-result messaging; live challenge invalid-input feedback and an explicit reveal action that expires when its expected result changes; compact expandable advanced tools; keyboard focus rings; mobile layout and touch targets; contextual quick links. The original “Inverse Trig: learn and explore” theory panel remains mounted unchanged.

Validation evidence: check.json covers all six routes and exercises real model changes, undo, bookmarks, CSV downloads, keyboard graph control, zoom/fit, mobile overflow and a reverse-composition deep link. final-check.json covers persisted notes, sweeping, SVG export and invalid quiz feedback. Screenshots cover all six pages at desktop and mobile sizes. Existing inverse-math tests pass (19 tests). Scoped lint and component type checking pass; production build is recorded in build-verified.log.

Persistence regression: the reload test originally found an initialization overwrite under React Strict Mode. Storage writes now wait for the current context to finish loading. Retest confirms the exact saved note survives reload. Shared URL inputs also go through the page’s existing finite/domain bounds.

Challenge precision correction: acceptance now uses half a hundredth (plus floating-point epsilon), matching the stated two-decimal rounding requirement. Browser test rejects 36.82 and accepts 36.87 for arcsin(0.6).
