# Target 0519 / Lesson 334: Sequence Generator

Status: dedicated implementation strengthened and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0519-interactive-intermediate-advanced-sequences-and-series-sequence-generator-redesigned.png`

Route: `/lessons/advanced-mathematics/334-sequence-generator`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Definitions | Explicit quadratic parser plus recursive start/difference mode, each backed by a dedicated sequence model | Browser mode-switch validation |
| Range and generation | Editable first/last/step controls, 20-term safety limit, and functional generation revision | Browser input validation |
| Plot | Live line/point modes with draggable points that change the polynomial constant and all linked representations | Browser drag and pixel comparison |
| Representations | Shared model drives terms, first/second differences, ratios, cumulative sums, graph, and table | Browser layout comparison |
| Pattern detector | Data-driven arithmetic, quadratic, geometric, or general classification and constant-pattern indicators | Browser scenario validation |
| Commands/navigation | Real CSV export, clipboard share, reset, generation, and section-scrolling tabs | Browser API and navigation validation |
| Practice | Selectable quick check plus editable two-answer practice with computed feedback | Browser keyboard validation |

## Mathematical Notes

For `a_n = 3n^2 + 2n + 1`, the correct first ten terms are `6, 17, 34, 57, 86, 121, 162, 209, 262, 321`, with constant second difference `6`. The target image instead shows `119, 158, 203, 254, 311` from term 6 onward, which do not satisfy the displayed formula.

The same formula gives `a_12 = 457`, `a_15 = 706`, and `a_20 = 1241`; the target displays `462`, `721`, and `1281`. The implementation preserves the target formula and design while using mathematically correct generated values and checks.

## Checks Executed

- Vitest: `7 tests passed across 3 files` (dedicated model, target surface, complete sequence adapter routing).
- Formula parsing, explicit generation, recursive generation, differences, and classification covered by focused model tests.
- Targeted TypeScript scan: no errors in the sequence model, surface, or adapter.
- ESLint passed before the final tab-navigation edit; focused tests passed again afterward. Final targeted lint follows in the sequence batch check.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0520 / lesson 335 Arithmetic Sequences.
