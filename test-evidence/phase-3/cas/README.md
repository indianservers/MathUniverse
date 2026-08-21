# Phase 3 CAS evidence index

Run date: 2026-08-20 (Asia/Calcutta)

## Artifacts

- `CAS-001-desktop-launch.png` — real 1440×900 browser render.
- `CAS-001-mobile-390x844.png` — real mobile viewport render; no horizontal overflow was measured.
- `CAS-069-reloaded-session.png` and `persistence-results.json` — dedicated persistence replay; 5 objects before reload, 5 after, with the unique expression restored.
- `CAS-070-100-submissions.png` — real browser state after 100 composer submissions; the UI retains 40 objects.
- `ui-audit-results.json` — raw results for all 70 case IDs, including requested operation/input, visible result/detail, timing, clipboard/export, stress count, and browser errors.
- `ui-audit.mjs` and `persistence-check.mjs` — reproducible Playwright audit programs.

## Important interpretation note

The raw CAS-069 entry in `ui-audit-results.json` reports zero objects immediately after one reload because the main audit deliberately installed `localStorage.clear()` as an init script; Playwright re-applied that script on reload and the screenshot caught the loading shell. That is a test-harness artifact, not an application persistence failure. The separate persistence replay removed that hook, used a unique expression, waited for the workspace, and demonstrated successful restore. Its result supersedes the raw main-run reload field.

## Key observed outputs

- Correct: `2+3*4 → 14`; `1/2+1/3 → 5/6`; `(x+1)^2 → 1+2x+x²`; factor quadratic → `(x-2)(x-3)`; linear/quadratic/cubic solves; negative inequality `-2x>4 → (-∞,-2)`; derivatives; implicit circle derivative `-x/y`; basic/substitution integrals; definite integral `8/3`; Taylor polynomial; basic exponential ODE; matrix and RREF; vector cross product; GCD/LCM.
- Incorrect/incomplete: `log(x)=2` returned three rational approximations of the same root; `sin(x)=1/2` returned a large arbitrary sampled list instead of a general solution; `(x-1)/(x+2)>0` omitted `(-∞,-2)`; the line/parabola system omitted `(2,4)`; `∫x exp(x)dx` produced a corrupted huge-constant expression; `∫1/(x²-1)dx` omitted real-domain absolute values; `x²+1=0` included tiny spurious real parts rather than exact `±i`.
- The UI’s precision control, angle mode, domain mode, and assumption text are present, but precision/angle are not passed into evaluation and the engine explicitly states assumptions are recorded but not enforced.
- All 100 stress submissions completed; no page or console error occurred. The notebook silently truncates to 40 objects, so the oldest 60 are lost from history.

No result or screenshot was fabricated. Visible KaTeX text contains duplicated accessibility/rendering fragments; the report uses the underlying object summary when possible.
