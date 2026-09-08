# Cramer's Rule — pilot review

Lesson 10198, `/lessons/school/class-12/class-12-matrices-and-determinants-cramer-s-rule`.

## Baseline and changes

Baseline CSS and TSX are retained as `baseline.css` and `baseline.tsx.txt`. Eight `baseline-{width}.png` files show the original page. The browser measured 8px body type on desktop, 59 instructional/control elements below 13px, and 24 controls below 44px. A global full-width rule defeated the original 735px artboard width, spreading this tiny content over 1880px on a 1920px screen.

The opt-in LessonStudioFrame / LessonStudioPanel / LessonStudioGrid layer now provides a centred 1280px workspace, 16px text, 44px controls, focus outlines and theme tokens. Container queries stack the system, determinant work and practice cards based on available space. Artificial minimum heights and negative offsets were removed. The duplicate determinant matrix was removed; each remaining matrix sits beside its calculation. Replaced columns are highlighted and still explained in text. Results are prominent and the current solution is repeated near the controls. The original SVG coordinates, scaling and equations remain intact; tick labels, an accessible description and a dashed second line improve reading. Navigation previously hidden by CSS is now omitted for this dedicated route in JSX, avoiding conflicting mobile !important rules.

All educational explanations and practice problems remain. Larger readable text makes the complete page taller than the tiny-text baseline; this is not reported as a reduction in total page height. Empty fixed-height cards have been removed.

## Mathematical preservation

Exact source comparison confirms the constants, default values, task arrays, `calc`, formatting, state initialization, reset/random/swap handlers and practice validation are unchanged. Default system `[2,1,5,1,-1,1]` produces Δ=−3, Δx=−6, Δy=−3, x=2, y=1. Graph mapping and axis range are unchanged.

## Browser evidence

`final.json` records all requested dimensions: 1920×1080, 1536×864, 1440×900, 1366×768, 1024×768, 768×1024, 390×844 and 360×800. All have zero document overflow, zero instructional/control elements below 13px, and zero controls below the 44px target (1px measurement tolerance). `clipping.json` additionally checks internal overflow in headings, paragraphs, inputs, buttons, matrices and calculations at every width: none detected.

`final-{width}.png` records the default state. `tested-{width}-{light|dark}.png` records populated and graded practice in both palettes. `detail-*` screenshots aid visual inspection; fixed app chrome can appear over a scrolled element screenshot. Full-page captures and browser interaction tests establish reachability.

`tests/lessons/cramerLessonUI.e2e.ts` checks all six system inputs; random, swap and reset; infinite and inconsistent systems; vertical/horizontal lines; decimal and negative coefficients; expansion/collapse of the concept note; hint toggling; all eight practice inputs; wrong then correct answers; all four Check buttons and Check all; both palettes; tab focus and focus styling; accessible graph description; console and page errors. This lesson has no sliders, simulation, animation, graph pan/zoom controls, or checkboxes to test.

## Remaining blockers — do not mark the lesson fully Verified

- The two pre-existing adjacent navigation hrefs are absent from the school catalog. They remain unchanged under the request to preserve routes/navigation. They require a separate routing/content decision; the browser tests currently assert preservation of the hrefs, not successful destination lessons.
- The repository production build fails with 140 TypeScript diagnostics in files outside this pilot's changed code. See `../build.log`. No diagnostics mention LessonStudio, CramersRuleTargetLesson10198 or SchoolLessonPage.
- The repository suite has 2397 passing and 19 failing tests across 333 files. The existing Cramer renderer assertion passes. Failures include unrelated lesson adapters, graph/workspace pages, theorem pages and visual-proof metadata; see `../tests.log`.
- The last repository lint run reported 49,999 errors and 2 warnings, mostly generated Android / temporary artifacts plus existing source issues; see `../lint.log`. That run included five browser-global declarations in the new capture script, subsequently corrected using `globalThis`. Targeted lint on all code files changed in this pilot now passes (`../changed-files-lint.log`). The full run has not been repeated after that correction. No lint or TypeScript checks were disabled.
- Global teacher-mode workflows and a complete accessibility audit are not certified by the pilot tests. The shared application controls were not changed.
- No other lesson has been browser-verified in this redesign pass. The 918 remaining routes are still Not started in the report.

## Reproduction

With the existing development server at port 2266:

```powershell
$env:PLAYWRIGHT_TEST_BASE_URL='http://127.0.0.1:2266'
npx playwright test tests/lessons/cramerLessonUI.e2e.ts
node scripts/capture-cramer-ui.mjs final
node scripts/inspect-cramer-ui.mjs
```

`node scripts/audit-lesson-ui.mjs` refreshes the source inventory and only creates the main tracking document if absent, protecting accumulated review results. Do not recapture a baseline after changing its lesson.
