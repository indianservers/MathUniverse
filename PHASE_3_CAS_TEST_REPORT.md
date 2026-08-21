# Phase 3 — CAS Test Report

Date: 2026-08-20  
Application: Math Universe Visualizations 1.0.1  
Commit: `2662c27`  
Route: `/workspace/data/cas`  
Verdict: **NOT READY FOR RELEASE**

## Scope and method

CAS testing began only after the complete 3D Graph checkpoint and a clean Vite restart. All 70 mandatory cases were attempted through the real CAS composer. Evidence records operation, input, displayed result/detail, elapsed time, history behavior, export/clipboard, persistence, responsive layout, and the 100-submission stress sequence. Results were checked independently by substitution, algebra/calculus rules, or known exact values.

Evidence: [`test-evidence/phase-3/cas/`](test-evidence/phase-3/cas/)

## Totals

| Pass | Fail | Partial | Blocked | Not Implemented | Total |
|---:|---:|---:|---:|---:|---:|
| 33 | 14 | 20 | 0 | 3 | 70 |

## Operation results

| ID | Status | Result |
|---|---|---|
| CAS-001 | Pass | Opened with composer, keyboard, object/history panes, result/step inspector, and settings. Empty Run kept the four starter cells and did not crash. |
| CAS-002 | Pass | Integer arithmetic and precedence were exact; `2+3*4 → 14`, `(2+3)*4 → 20`, with large-integer stress accepted. |
| CAS-003 | Partial | Exact fraction addition produced `5/6`; broader mixed-number/comparison support is not explicit and domain-zero diagnostics are generic. |
| CAS-004 | Fail | Exact/numeric modes exist, but the visible precision setting is local UI state and does not control CAS rounding. |
| CAS-005 | Partial | Powers, square/cube roots, and negative powers work; 0⁰ and real/complex edge semantics are not surfaced consistently. |
| CAS-006 | Partial | π, e, and i parse, but exact π can degrade to a large rational approximation and alternative constant notation is inconsistent. |
| CAS-007 | Pass | Nested brackets and precedence produced correct results; malformed input recovered without restarting. |
| CAS-008 | Pass | `2x`, explicit multiplication, and adjacent parenthesized multiplication expanded consistently in the tested expressions. |
| CAS-009 | Partial | On-screen keys inserted `sqrt()` and editing worked; it is plain-text, not cursor-aware structured fraction/root/matrix editing. |
| CAS-010 | Partial | Malformed `foo(@` was contained and later work remained usable, but the error is generic rather than localized/specific. |
| CAS-011 | Pass | Nested numerical powers/fractions/roots simplified exactly (`9/2` in the tested expression). |
| CAS-012 | Pass | `2x+3x-y+y → 5x`; unlike terms were preserved. |
| CAS-013 | Pass | `(x+1)^2 → 1+2x+x²`; sign/distribution behavior was correct in tested cases. |
| CAS-014 | Pass | `x²-5x+6 → (x-2)(x-3)`; expansion confirms equivalence. |
| CAS-015 | Fail | `(x²-1)/(x-1)` was not cleanly reduced to `x+1`, and the exclusion `x≠1` was not preserved/displayed. |
| CAS-016 | Partial | Simple `1/sqrt(2)` rationalization worked, but broad radical combination/rationalization coverage is limited. |
| CAS-017 | Partial | Tested exponent combination gave `x^8`; sign/domain-dependent transformations do not enforce assumptions. |
| CAS-018 | Fail | `log(xy)` stayed unchanged; expansion/combination, base rules, and positive-domain restrictions are not delivered. |
| CAS-019 | Partial | Core identities can be verified, but the exact box may show only `0`/`1` and domain exclusions are not carried into equivalence. |
| CAS-020 | Pass | `(x³-1)/(x-1)` returned quotient `x²+x+1`; exact/remainder workflow is available. |
| CAS-021 | Pass | `x+3=5 → [2]`; substitution verifies the root. |
| CAS-022 | Partial | Multi-step linear solve worked (`2(x+1)=8 → [3]`); no/all/infinite classification and each equality-preserving step are incomplete. |
| CAS-023 | Partial | Factored quadratic returned both roots `[2,3]`; multiplicity and real/complex explanation are incomplete. |
| CAS-024 | Fail | For `x²+1=0`, both branches were present but contaminated by tiny rational real parts instead of exact `±i`. |
| CAS-025 | Pass | `x²+6x+5 → (x+3)²-4`; expansion recovers the original. |
| CAS-026 | Pass | Factorable cubic returned `[1,2,3]`, all verified by substitution. |
| CAS-027 | Partial | Degree-5 numeric solve found the real root `1.167304`; complex roots/multiplicities and complete-set assurance are absent. |
| CAS-028 | Partial | `1/(x-1)=2 → 3/2` is correct, but excluded denominator values and original-equation checks are not displayed. |
| CAS-029 | Partial | `sqrt(x+1)=x-1 → 3` is correct, but squaring/domain/extraneous-root checks are not shown. |
| CAS-030 | Pass | `abs(x-2)=3 → [-1,5]`; both branches verify. |
| CAS-031 | Pass | `2^x=8 → 3`; exact same-base solve is correct. |
| CAS-032 | Fail | `log(x)=2` returned three different rational approximations of the same value instead of the single exact root `e²`. |
| CAS-033 | Fail | `sin(x)=1/2` returned a long arbitrary finite list of rationalized samples instead of general periodic solutions or a stated interval. |
| CAS-034 | Pass | Negative-coefficient reversal was correct: `-2x>4 → (-∞,-2)`. |
| CAS-035 | Pass | `x²-1≤0 → [-1,1]` with correct inclusive endpoints. |
| CAS-036 | Fail | `(x-1)/(x+2)>0` returned only `(1,∞)`, omitting valid `(-∞,-2)`. |
| CAS-037 | Pass | `abs(x)<3 → (-3,3)` with correct open endpoints. |
| CAS-038 | Pass | Two-variable system returned `x=3,y=2`, correct in both equations. |
| CAS-039 | Pass | Three-variable system returned `x=3,y=2,z=1`, correct in all equations. |
| CAS-040 | Fail | `y=x²; y=x+2` returned only `(-1,1)` and omitted the valid solution `(2,4)`. |
| CAS-041 | Pass | Direct symbolic/numeric function evaluation is supported through Substitute; `x²+1, x=3 → 10`. |
| CAS-042 | Partial | Composition can be emulated by substitution, but named-function composition and domain propagation are not a dedicated workflow. |
| CAS-043 | Not Implemented | No inverse-function operation or one-to-one/domain restriction workflow. |
| CAS-044 | Fail | No domain/range operation; `domain(sqrt(x-1))` was treated as algebraic multiplication rather than rejected or answered. |
| CAS-045 | Pass | Standard exact trig test `sin(π/6)+cos(π/3) → 1` was correct. |
| CAS-046 | Fail | Radian/degree buttons are not connected to evaluation; an exact π conversion degraded to `486282493/154788525`. |
| CAS-047 | Partial | Reciprocal/quotient identity checks work, but domain exclusions and a clear true/false result are not consistently presented in the exact box. |
| CAS-048 | Not Implemented | No triangle solver; `triangle(3,4,5)` was misleadingly accepted as a symbolic tuple. |
| CAS-049 | Pass | Basic polynomial limit `x², x→2 → 4` was exact. |
| CAS-050 | Pass | Removable limit `(x²-1)/(x-1), x→1 → 2` was correct. |
| CAS-051 | Pass | Polynomial derivative `x⁵-3x²+7 → 5x⁴-6x` was correct. |
| CAS-052 | Pass | Product/quotient differentiation returned an algebraically correct derivative. |
| CAS-053 | Pass | Chain rule `d/dx sin(x²) → 2x cos(x²)` was correct. |
| CAS-054 | Pass | Circle implicit derivative returned `-x/y`, mathematically correct away from vertical-tangent points. |
| CAS-055 | Partial | Nested second derivative produced `-cos(x)`; dedicated third/nth derivative notation and cycle explanation are limited. |
| CAS-056 | Not Implemented | No combined critical-point solving/classification workflow. |
| CAS-057 | Pass | `∫(x²+sin x)dx → x³/3-cos x+C`, including the integration constant. |
| CAS-058 | Pass | Substitution example `∫2x cos(x²)dx → sin(x²)+C` was correct. |
| CAS-059 | Fail | `∫x exp(x)dx` produced a corrupted expression with huge integer/log constants rather than `(x-1)e^x+C`. |
| CAS-060 | Fail | `∫1/(x²-1)dx` omitted absolute values in logarithms, making the displayed real antiderivative domain-invalid. |
| CAS-061 | Pass | Definite integral `∫₀²x²dx → 8/3` was exact. |
| CAS-062 | Pass | Fifth-order Maclaurin polynomial for sin(x) returned `x-x³/6+x⁵/120`. |
| CAS-063 | Partial | Basic `y'=y` returned `y=Ce^x`; initial conditions and general first-order linear/separable coverage are limited. |
| CAS-064 | Fail | Complex quadratic result contains tiny spurious real terms and is not exact `±i`; polar/argument convention coverage is incomplete. |
| CAS-065 | Pass | Matrix parsing, determinant/trace/transpose/inverse/RREF functions are available; `[[1,2],[3,4]]` parsed correctly. |
| CAS-066 | Pass | RREF of the augmented system produced `[[1,0,3],[0,1,2]]`, matching x=3,y=2. |
| CAS-067 | Partial | Tested cross product returned `[0,0,1]`; no dedicated vector object/zero-vector restriction workflow spans every requested operation. |
| CAS-068 | Partial | `gcd(84,30)+lcm(6,8) → 30`; prime/factor/modular validation and invalid noninteger messaging are not a dedicated workflow. |
| CAS-069 | Partial | Copy yielded `30`, Markdown export downloaded, undo/redo worked, and a unique cell persisted across reload; no separate plain/LaTeX/MathML full-session exports or explicit named save exist. |
| CAS-070 | Fail | All 100 mixed submissions completed in 111.709 s without crash, but history silently retained only 40, discarding the oldest 60; cancellation/resource controls are absent. |

## Step-by-step explanation review

The step pane is not reliable enough to certify mathematical derivations. Every result begins with generic assumption, mode, and dependency lines. Structured rows are generated from those strings; the final row displays a check and text instructing the user to “re-run” and compare, but the UI does not perform that independent verification. Incorrect results in CAS-032, CAS-033, CAS-036, CAS-040, CAS-059, and CAS-064 can therefore still appear as successfully completed/verified calculations. Domain exclusions and extraneous-root checks are usually absent.

## Focused automated verification

Nine CAS/symbolic test files passed: **55 tests passed, 0 failed**. The suite includes notebook memory, numeric/exact separation, selected algebra/calculus/matrix operations, persistence helpers, parser/registry behavior, and symbolic functions. It does not cover the failing inputs above or validate complete general solution sets.

## Release decision

The CAS is broad and often useful, but not release-ready for unsupervised school mathematics. Wrong or incomplete solution sets, domain-invalid antiderivatives, corrupted integration output, UI modes that do not affect evaluation, non-enforced assumptions, and silent history truncation are release blockers.
