# Visual learning enhancements

The studio learning shell now includes a visual guide, reachable through **Compare & learn**. Each guide has twelve learning sections in four accessible tabs. The topic selector also exposes reference and guided-course topics from the same studio.

## Coverage

- 19 studios.
- 504 learning-guide entries: lab pages, investigations, reference topics and guided-course topics. This is not a count of 504 independent interactive engines.
- 12 learning enhancements per entry, with automated rendering checks for every entry.
- Exact route checks for all catalogued labs, investigations, the number-system catalog, seven Set Theory pages, five inverse-trigonometry pages and five triangle-law pages.
- Graph Theory's five workspace tabs select their corresponding guide through router navigation.
- The machine-readable inventory is `lab-enhancement-coverage.json` in this directory.

## The twelve enhancements

| Section | Student-facing support |
| --- | --- |
| 01 | Plain-language explanation and what to observe |
| 02 | Input → relationship → evidence reasoning diagram, with selectable cases |
| 03 | Formula cards linked to their inputs and interpretations |
| 04 | Concept comparison table for the studio's foundations |
| 05 | Topic-specific table comparing three worked cases |
| 06 | Conditions and boundary cases, with expandable inspection |
| 07 | Worked examples with progressive step reveals and restart |
| 08 | Prediction and observation notes, session persistence and JSON download |
| 09 | Numeric answer feedback where a validated question exists; otherwise self-assessed reasoning comparison |
| 10 | Misconception or caution with a reasoning guide |
| 11 | Method selection and verification checklist grounded in the worked case |
| 12 | Takeaway, prerequisites, related topics and the complete learning path |

Worked-case tables are labeled as worked cases, not readings of the student's current workspace. Investigation examples use the existing mathematical engine evaluated at the stated starting inputs. Written reasoning is self-assessed.

## UI components

Installed `@radix-ui/react-tabs` and `@radix-ui/react-accordion` through npm, with dependencies recorded in the lockfile. The visual layer adds a gradient hero, concept orbit, numbered cards, color-coded tabs, formula highlights, comparison tables, progressive examples, touch-sized controls and responsive layouts. Reduced-motion preferences are respected.

Component references: [Radix Tabs](https://www.radix-ui.com/primitives/docs/components/tabs) and [Radix Accordion](https://www.radix-ui.com/primitives/docs/components/accordion).

## Validation

- 27 targeted unit and rendering tests pass, including rendering all 504 guide entries and existing curriculum and graph-engine checks.
- Browser coverage checks pass for all 19 studios.
- Interaction checks cover sublab routing, Graph Theory tab synchronization, keyboard navigation, incorrect/correct answer feedback, step reveals, persisted notes and downloads.
- Mobile layout and light/dark accessibility checks pass with no violations in the new guide; all four guide tabs are scanned in dark mode.
- Desktop/mobile screenshots are saved under `artifacts/lab-enhancements-*.png`.
- The student production build passes; build diagnostics are saved in `tmp/lab-enhancements-build-final.log`.
- The new learning-guide files pass ESLint. The existing Graph Theory module has unrelated unused-code lint errors; repository-wide clean lint is not claimed.
- Repository-wide TypeScript validation reports 127 errors in existing geometry and other modules, with no diagnostics in the new learning-guide files or the two modified studio components; clean repository-wide type checking is not claimed.

The original interactive engines remain the workspaces used to perform experiments. These additions provide a consistent learning interface around them.
