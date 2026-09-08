# Lesson 45: Point Plotter

Source snapshot and baseline screenshots recorded before changes.

The displayed dataset declares A=(-2,1), B=(-1,3), C=(1,2), but the shared React state initializes x=2, y=3 and trace=1.5. All ranges are [-5,5], step .5. The x/y controls do not move the fixed C marker. The blue trace moves horizontally but has a fixed ordinate unrelated to the declared C position. The sample values table uses an unrelated sine-based fallback. These are confirmed interaction/calculation defects.

The source SVG draws two extra markers D and E without coordinate definitions, and even A/B/C do not align consistently with its ticks and axes. The preset contains a different dataset, so its point data cannot override the explicit lesson dataset. A clarification about D/E was requested; no arbitrary ordered pairs will be inferred from decorative pixel positions.

Preserved: actual control defaults 2,3,1.5, bounds and steps; declared A/B; selected C controlled by the original x/y state; coherent preset view [-6,6] on both axes; teal ordinary points, orange selected C, gray dashed connection order, blue trace. The existing lesson text and navigation remain. Shared drag and keyboard changes snap C to the original .5 step and bounds. This preserves the lesson's actual reset state while replacing stale C captions with its current coordinates.

No reply was received to the optional D/E question; the stated default uses only defined point data. D/E are not assigned invented coordinates. Their old pixels remain in the legacy renderer and source snapshot.

Verification: `browser.log` has ten passes (three viewport interaction tests plus seven Inspector checks). Every slider value, point projection, stable A/B, mouse/touch/keyboard C movement, .5 snapping, trace, all graph controls, reset/share and nonoverlapping captions pass. `legend.log` has two passes across lessons 39/45, each checking all three widths and light/dark screenshots. Custom dash patterns now propagate to the shared legend. Final screenshots and console/overflow checks pass. Scoped lint passes. The refreshed full repository typecheck has 138 diagnostics, none in GraphLessonAdapter, SharedPointPlotter45 or the shared graph directory. See `typecheck.log`; the repository build remains blocked by those errors.
