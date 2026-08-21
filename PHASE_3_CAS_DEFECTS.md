# Phase 3 — CAS Defects

Date: 2026-08-20  
Open defects: 19  
Severity totals: **S0 0 · S1 9 · S2 8 · S3 2 · S4 0**

| ID | Severity | Defect | Evidence / impact |
|---|---|---|---|
| BUG-P3-CAS-001 | S1 | Logarithmic solve emits duplicate approximate roots | `log(x)=2` returns three rational approximations near e² instead of one exact root. |
| BUG-P3-CAS-002 | S1 | Trigonometric solve presents an arbitrary finite sample as the solution | `sin(x)=1/2` returns a long rationalized list without interval or general periodic form. |
| BUG-P3-CAS-003 | S1 | Rational inequality drops a valid interval | `(x-1)/(x+2)>0` omits `(-∞,-2)` and returns only `(1,∞)`. |
| BUG-P3-CAS-004 | S1 | Nonlinear system omits a valid solution pair | `y=x²; y=x+2` returns `(-1,1)` but omits `(2,4)`. |
| BUG-P3-CAS-005 | S1 | Integration by parts output is mathematically corrupted | `∫x exp(x)dx` contains huge unrelated integer/log constants instead of `(x-1)e^x+C`. |
| BUG-P3-CAS-006 | S1 | Rational antiderivative omits required absolute values | `∫1/(x²-1)dx` displays logs of signed factors without `|·|`, invalid over parts of the real domain. |
| BUG-P3-CAS-007 | S1 | Complex quadratic roots are not exact | `x²+1=0` includes tiny rational real parts instead of exact `±i`. |
| BUG-P3-CAS-008 | S1 | Unsupported triangle syntax is accepted as a symbolic tuple | `triangle(3,4,5)` looks processed rather than producing an unsupported-operation error, inviting false confidence. |
| BUG-P3-CAS-009 | S1 | Canned step verification marks incorrect results as successful | The final checked row merely instructs re-running/comparing; it does not independently verify, yet incorrect outputs display completed status. |
| BUG-P3-CAS-010 | S2 | Precision control is disconnected from evaluation | Changing the visible 3–16 precision value does not affect `numericCheck` or displayed rounding. |
| BUG-P3-CAS-011 | S2 | Angle mode is disconnected from evaluation | Radians/Degrees changes local state only; submitted trig expressions are evaluated identically. |
| BUG-P3-CAS-012 | S2 | Assumptions/domain controls are not enforced | Engine detail explicitly says assumptions are recorded but not automatically enforced; domain mode is therefore advisory. |
| BUG-P3-CAS-013 | S2 | Exact constants can degrade into rational approximations | A π conversion displayed `486282493/154788525` rather than exact π. |
| BUG-P3-CAS-014 | S2 | Rational simplification loses required mathematical context | `(x²-1)/(x-1)` is not cleanly canceled and does not preserve `x≠1`. |
| BUG-P3-CAS-015 | S2 | Core school workflows are absent | Inverse functions, domain/range, triangle solving, and critical-point classification have no CAS operations. |
| BUG-P3-CAS-016 | S2 | History silently discards work beyond 40 objects | All 100 submissions ran, but only 40 remained, with no warning/export-before-truncate prompt. |
| BUG-P3-CAS-017 | S2 | Long-calculation cancellation/resource limits are absent | The 111.709-second stress sequence offered no cancellation, timeout, or resource feedback. |
| BUG-P3-CAS-018 | S3 | Mathematical keyboard is plain-text only | Keys append templates at the end; no structured cursor navigation, fractional layout editing, or matrix structure editing. |
| BUG-P3-CAS-019 | S3 | Full-session export formats are limited | Notebook export is Markdown; distinct plain, LaTeX, MathML, and reusable project-session formats are not all offered. |

## Exit criteria

Block release until every S1 result/verification defect is fixed with independent substitution/domain tests. Wire or remove nonfunctional modes, warn before history truncation, add resource controls, and expand regression coverage to every failing expression in this report.
