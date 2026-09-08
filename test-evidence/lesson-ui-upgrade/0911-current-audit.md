# Lesson 0911: Euler Method

Status: completed in the current one-by-one UI acceptance pass. Reference structure and proportions are visually aligned; exact pixel identity is not claimed.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0911-advanced-advanced-differential-equations-euler-method-redesigned.png`.
Advanced concept: 2017. Route: `/lessons/advanced-concepts/2017-euler-method`.

## Comparison

| Target area | Implementation | Difference / remaining verification |
| --- | --- | --- |
| Euler step walker | Dedicated y'=y, y(0)=1 model with h=0.5,0.25,0.1 | Uses existing ODE engine for Euler values, independently checked against (1+h)^n |
| Graph | Exact exponential, Euler polygon and vertices, tangent-direction arrows, same-x error guides | Corrects target's misplaced x labels/points and exact curve not passing through (0,1); exact value at x=1 is 2.7183, not the reference graph's apparent 3.25 |
| Step controls | Back/forward, play/pause at 700ms, reset to step zero, native draggable and keyboard-accessible step slider, clickable table step numbers | Actual browser events/timer behavior unverified. Playback restarts at zero from endpoint, stops at endpoint, interval cleaned on unmount |
| Step size | Segmented control and clickable comparison plots update model/table/graph together | Selecting size displays its complete walk, consistent with default target; no dummy buttons |
| Euler table | Full calculated table, current row highlighted, future rows muted, final next value absent | Selecting a row inspects its x, exact value, approximation and signed error |
| Error summary | Default Euler 2.4414, exact 2.7183, signed error -0.2769 | Summary follows current step, rather than staying at x=1 during playback |
| Recurrence and error concepts | Actual update recurrence, local one-step O(h^2), fixed-interval global O(h) | Separate extended dashed tangent preview from reference not reproduced; Euler edges already have the actual starting slope |
| Practice | Two blank numeric answers, independent checking, reset, explanatory feedback | Not prefilled with success as in target |
| Step-size comparison | Three calculated endpoint values and mini-plots, selected state, correct signed errors | All mini-plots use consistent scales |
| Studio and navigation | Working companion studio link, previous Slope Fields, next Growth and Decay IVPs | Corrects target's misleading Heun next-lesson claim; catalog route is 2018-growth-decay-ivps |
| Presentation | Dedicated responsive toolbar, chart/table, recurrence/error columns, practice and four-column comparison | Exact fonts, shell/footer, spacing, legend location, responsive rendering and pixel parity remain unverified; no generated raster needed for actual mathematical SVG |

## Verification

- Five focused Vitest model/initial-markup tests passed after final studio-link edit.
- Every supported step checked against independent closed form; recurrence, endpoint, slopes and exact exponential values checked.
- Error ordering verified for all three step sizes; blank, wrong and nonfinite practice answers rejected.
- Initial markup verifies default computed values, five selectable rows, slider and valid next catalog entry.
- One dedicated route test passed, 226 unrelated tests skipped, before final studio-link edit.
- Targeted strict TypeScript and focused ESLint passed before final studio-link-only edit.
- Captured desktop evidence: `artifacts/studio-control-audit/0911-current.png`.
- One-by-one browser acceptance: opened the advanced route, pressed Step back, and verified the current-step/table state updated.
- Focused surface test passes (1 test); `git diff --check` is clean for the lesson evidence.

Next sequential target: 0912 / 2018 Growth and Decay IVPs. Previous aggregate completion counts have not been re-audited.
