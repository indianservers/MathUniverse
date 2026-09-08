# Lesson 47: Table of Values

Baseline source and three viewport screenshots recorded before migration.

The authoritative formula is f(x)=x²−2x−3, and the table rows (−1,0), (1,−4), (3,0) are correct. Actual state is x=2, secondary=3, trace=1.5; the static x=3/output=0 captions disagree with that state. Both x and trace use [-5,5] step .5. The secondary slider is labeled output but has no mathematical role or graph effect. It is replaced by a read-only calculation f(x), preserving the equation rather than inventing an independent output.

The old trace ordinate evaluates the primary x, not the trace x, and its hand-drawn curve and row marker do not match the formula. The sample values table already evaluates the correct formula and retains its existing inputs and trace highlighting.

The preset's x range [-4,4] is retained. Its y minimum −2 excludes the true vertex −4; the corrected initial y range is [-6,12]. Fit and offscreen inspection can expand to [-6,6] × [-6,34], which contains the original slider domain and its outputs. Reset restores the corrected initial view and actual original input defaults. A selected point remains constrained to the fixed function, with horizontal drag/keyboard motion snapped to .5. No coefficient control is invented.

The unchanged root/vertex row data are now headed “Roots and vertex”; the source heading “Second differences” did not describe these rows. Initial browser checks: twelve passes across Table of Values and nine Inspector cases. The narrow graph tick fallback now uses a finer nice step when the old step leaves fewer than two labels, verified for centered and offset ranges. Nine geometry tests and scoped lint pass. Final Table of Values checks and reruns of the three network-affected lessons are ongoing.

Final verification: `final-browser.log` has twelve passes: all three Table of Values sizes plus nine follow-up checks across 31/33/42 affected by the earlier network suspension. Final title-only correction is captured in `verified-*.png` (light) and `verified-dark-*.png` (dark), with no console errors or overflow. All graph/control mathematics passed; the sparse-tick regression is explicitly asserted in the viewport tests and geometry unit tests. The full repository typecheck finished with 138 diagnostics outside GraphLessonAdapter, SharedTableGraph47 and the shared graph directory; see `typecheck.log`.
