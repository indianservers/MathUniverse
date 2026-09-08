# Lesson 46: Data Plotter

Baseline source, screenshots at three widths and console/overflow records captured before migration.

The only explicit domain data are the three table rows (hours, score) = (2,68), (4,78), (6,90). A separate fixed SVG draws eleven pixel-position dots and residuals without domain values. Its best-fit line, residual endpoints, trace rule, sample-table rule (2.8+1.2x), and static correlation 0.86 do not agree. Its axes and preset y range [-2,8] cannot display quiz scores 68–90. The hours/score controls initialize 2 and 3 and use [-5,5], step .5, but do not affect the graph; trace initializes 1.5 with the same bounds. These are confirmed inconsistencies, not a working statistics calculation.

An optional clarification asks whether to use the three existing data rows or a supplied complete dataset. No quiz scores will be inferred from unrelated pixels.

For the three known rows alone, least squares gives slope 5.5 and intercept 56 2/3. The fit predictions at hours 2,4,6 are 67 2/3,78 2/3,89 2/3; residuals are 1/3,−2/3,1/3. These facts are independent of any unresolved extra observations. A truthful graph must derive its correlation and residuals from its declared dataset.

No response was received to the optional dataset question, so the stated default uses the three explicitly recorded rows. Existing hours/score state (2,3) is a separate comparison probe excluded from regression, keeping the declared dataset unchanged when controls move. Its original bounds and .5 step remain, including negative values; negative hours are identified as outside the study context. Trace values outside the observed 2–6 hours are labeled extrapolation. x range [-6,6] is preserved; y range becomes [-10,100] to include actual scores and the original probe bounds. The old unsupported 0.86 correlation and decorative extra dots remain recorded in the baseline and legacy source, not used as invented data.

First browser run: 11 checks passed, including all three viewport control/mathematical tests and eight Inspector regressions. Final visual refinement adds point-shaped legend swatches and pointer-transparent caption connector lines. Full migrated-set regression is pending. Scoped lint passes before that refinement.

All three final Data Plotter viewport tests now pass within `../regression-after-46.log`, including new connector origins, dot legend, caption separation, full control range and unchanged dataset/fit. Final light/dark screenshots reviewed. The overall 82-check regression continues across prior lessons; it is not yet claimed complete. Nine geometry unit tests and final scoped lint pass. Repository typecheck finished with 138 diagnostics outside GraphLessonAdapter, SharedDataPlotter46 and the shared graph directory. See `typecheck.log`; the production build remains blocked by those errors.

The overall regression finished with 79 passes and three failures caused by network suspension/change errors and associated module fetch failures. The original log is preserved. All nine follow-up viewport checks across lessons 31,33,42 passed in `../47/final-browser.log`, together with three final lesson 47 checks. No console errors were filtered or ignored.
