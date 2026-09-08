# Lesson 40 baseline audit

Baseline: GraphLessonAdapter.tsx, twoDGraphSpecFor(40), TwoDGraphCanvas, renderTwoDGraphShape, canvasY and MiniValuesTable. Three baseline viewport screenshots and console/overflow results are in this directory.

Existing lesson formulas: f(x)=x²−2, g(x)=0.8x+1, h(x)=sin(x). Trace default 1.5, range [-5,5], step 0.5. Default outputs 0.250, 2.200 and 0.997 are correct. Existing preset view x=[-6,6], y=[-8,8] supplies a coherent view, but its unrelated linear preset formula must not replace the displayed three rules.

Confirmed defects: fixed Bezier paths do not plot the declared rules; trace y is 255−58*sin(trace)−18*trace in screen pixels, unrelated to any declared function; numeric output labels never update; intersections in the sidebar fail substitution into the named equations. Sample table evaluates only the original f formula. Old x/y ticks and axes use different origins and scales.

Unresolved control semantics: primary=2 and secondary=3 sliders are labeled f(x) and g(x) but do not influence any calculation. No formula parameter relationship can be inferred from source. User preference requested before changing these controls. The original renderer is retained for later lessons.

Connected for lesson 40 only: SharedFunctionGraph40 draws the exact existing rules using lesson-owned samples and the shared Cartesian projection, and places all three trace points using those same rules. No lesson is marked Verified until it is connected and all required browser/control checks pass.

The two unexplained sliders retain their original numeric defaults, bounds, steps and lack of formula effect. No answer to the optional control preference has been received; preserve existing behavior as the conservative assumption. The new renderer samples 601 points across the current view for each exact rule (the previous renderer had no mathematical samples). Pairwise intersections are computed by sign bracketing and bisection over the existing [-6,6] view. Share, fit, move and inspector now have real targets, and output cards evaluate the original rules at the current trace.


Control correction: the request explicitly forbids controls that do nothing. The unused f/g numeric sliders are therefore replaced with Show f(x)/Show g(x) visibility toggles, initially checked to preserve the existing visible curves. No mathematical coefficient is inferred from the old unused 2 and 3 states. Table visibility statuses follow the toggles, reset restores both curves, and Inspector restores guides/view and focuses an available visible trace point. This resolves the earlier documented limitation; final verification is in visibility-controls.log.
