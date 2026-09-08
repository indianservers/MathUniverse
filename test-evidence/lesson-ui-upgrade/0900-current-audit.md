# Lesson 0900: Collatz Conjecture

Status: dedicated implementation; browser interaction and visual acceptance deferred under the current user-directed workflow. Exact visual match is not certified.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0900-advanced-advanced-famous-problems-collatz-conjecture-redesigned.png`.
Advanced concept ID: 2006. Route: `/lessons/advanced-concepts/2006-collatz-conjecture`.

## Implementation and Comparison

| Target area | Implemented behavior | Remaining review / deliberate difference |
| --- | --- | --- |
| Dedicated orbit model | Exact BigInt transitions, first-arrival stopping time, peak, explicit step limit | Replaces old private helper that forced starts >=2 and silently truncated at 300 values |
| Start and rule controls | Start input 1..100,000, parity-dependent rules, step/back, playback mode, speed, pause and orbit reset | Browser input/timer interactions unverified; numeric field replaces reference dropdown |
| Linking | Heatmap/leaderboard selection updates orbit when enabled; disabled mode keeps heatmap selection separate | Real browser toggle behavior unverified |
| Orbit graph | Computed full orbit, log/linear scale, parity colors, selected point and arrival/loop markers | Actual trajectory differs from reference's simplified/inaccurate plot; inspector is below plot instead of floating tooltip |
| Orbit ribbon and parity | Scrollable sequences, click selection, accessible step range and keyboard alternatives | Independent strip scrolling differs from reference's shared horizontal viewport |
| Summary | Exact n=27 stopping time 111, peak 9232; first arrival followed by displayed 1->4->2->1 loop | Corrects indexing around first arrival; appended loop does not alter initial-orbit peak (n=1 peak stays 1) |
| Heatmap | All starts 1..100 computed, labeled and selectable; color reflects actual stopping time | Grid labels replace target's inaccurate axis arrangement; pixel/color/overlap review deferred |
| Leaderboard | Actual descending stopping-time or peak ranking with parity filters | Corrects reference entries/ranking, including n=1 stopping time zero; true maximum for 1..100 is n=97 with 118 steps |
| Range search | Real asynchronous batches, frozen range/parity during run, checked/reached/unresolved counts, elapsed time and cancellation | Starts unrun rather than fabricating target's completed 100,000-case result; real browser responsiveness/cancel execution unverified |
| Search safety | Unmount token prevents stale updates; each start has a 10,000-step limit | Unresolved bounded runs are not claimed as counterexamples; cancelled runs retain honest partial counts |
| Evidence/proof | Finite evidence distinction, exact stopping-time definition and lower-orbit shortcut caveat | No claim that completed finite searches prove the conjecture |
| Practice | Computed stopping/peak checks for 6,19,97 and largest-stopping-time challenge | Answers initially empty; checked results match the model |
| Navigation and shell | Catalog-valid Periodic Square Roots and Goldbach Conjecture links | Target sidebar, app footer, exact typography and panel dimensions unverified |

## Verification

- Seven focused Vitest model/initial-markup tests passed.
- All transitions and peaks verified for starts 1..1,000.
- Full supported search range 1..100,000 tested: all 100,000 reached 1 within the configured limit. This is finite test evidence, not a general proof and not a fabricated initial UI result.
- Tests cover bounded unresolved runs, parity counts, start=1, reference/practice results, actual first-100 leaderboard and invalid inputs.
- One dedicated advanced route test passed; 215 unrelated cases were skipped.
- Targeted strict TypeScript and focused ESLint passed.
- Existing application listener verified at 127.0.0.1:2266.
- No authentic browser screenshots, pixel comparisons, responsive overlap checks or actual browser interaction tests performed. These remain required before full acceptance.

Next sequential target: 0901 / advanced concept 2007 Goldbach Conjecture, route `/lessons/advanced-concepts/2007-goldbach-conjecture`. Earlier aggregate completion counts have not been re-audited.
