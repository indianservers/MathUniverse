# Target 0510 / Lesson 547: One-Proportion Test

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0510-interactive-advanced-inferential-statistics-one-proportion-test-redesigned.png`

Route: `/lessons/data-and-probability/547-one-proportion-test`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Proportion-test model | Dedicated null-standardized z test with three alternatives, exact binomial alternative, p-value, decision, and null large-count checks | Cross-browser numerical validation |
| Inputs/method | Real successes, sample size, null proportion, alternative, normal/exact method, alpha, recalculate, and reset controls | Browser input validation |
| Null visualization | Tail-aware normal reference plot and draggable observed statistic that changes the success count | Browser drag and pixel comparison |
| Calculation/conditions | Live hypothesis statement, p-hat, null SE, z, p-value, conclusion, and explicit condition values | Browser rendering comparison |
| Quick check | Three selectable result questions driven by the current computed statistic, p-value, and decision | Browser interaction validation |

## Mathematical Notes

The target visibly specifies `x = 60`, `n = 200`, and `p0 = 0.30`, so `p-hat = 0.30`, `SE0 = 0.03240`, `z = 0`, and the two-sided p-value is `1.0000`. Its displayed `z = 2.19`, p-value `0.0286`, and rejection decision cannot follow from those inputs. The implementation preserves the visible defaults and target structure while showing the real fail-to-reject result. It also provides a genuine exact binomial calculation rather than treating that control as cosmetic.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (proportion model, dedicated surface, adapter routing).
- Exact-binomial check: `P(X >= 8)` for `X ~ Binomial(10, 0.5)` equals `0.0546875`.
- Strict targeted TypeScript check: passed.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0511 / lesson 548 Two-Proportion Test.
