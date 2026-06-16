# Probability and Statistics — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit probability/statistics coverage and design premium data, distribution, chance, simulation, and inference visuals.
## 2. Current Status Classification
Existing — upgrade current module. Probability/statistics routes, math utilities, chart components, and visual proof categories exist.
## 3. Existing Routes and Files Found
`/probability-statistics`; `/statistics`; `/math-lab/probability`; `/workspace/data`; `src/pages/ProbabilityStatistics.tsx`; `src/pages/MathLabProbability.tsx`; `src/components/charts/*`; `src/utils/mathEngine/probabilityUtils.ts`; `src/utils/mathEngine/statisticsUtils.ts`; `src/visual-proofs/proofs/probability/*`; `src/visual-proofs/proofs/statistics/*`.
## 4. Existing Features Found
Statistics/probability pages, probability math lab, data workspace, chart components, probability/statistics utilities, solver support, and visual proof categories.
## 5. Existing Weaknesses
Needs stronger beginner simulations, raw-data-to-chart linkage, misconception correction, and accessible chart summaries.
## 6. Upgrade/Create Decision
Upgrade existing probability/statistics modules.
## 7. Student Learning Goals
Understand sample space, probability, trials, distributions, center/spread, outliers, regression, and uncertainty.
## 8. Professor-Level Teaching Strategy
Connect random variables, long-run frequency, expectation, variance, distributions, and inference intuition.
## 9. Premium Interaction Design
Include click sample outcomes, drag data points, snap bins, sliders for trials, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 10. Visual Models Required
Sample-space grid, probability tree, simulation timeline, dot plot, histogram, box plot, distribution curve, and scatter/regression scene.
## 11. Practice and Challenge Ideas
Predict probability, run trials, compare mean/median, detect outliers, match distribution, and repair chart mistakes.
## 12. Beginner Mode
Use coins, dice, small data sets, and plain chance language.
## 13. Professor Mode
Show formulas, expected value, variance, conditional probability, residuals, and sampling distributions.
## 14. Accessibility Requirements
Chart tables, screen-reader summaries, non-color marks, keyboard simulation controls, and reduced motion.
## 15. Mobile Requirements
Tabbed data/chart/simulation layout and collision-free chart labels.
## 16. Math Safety Requirements
Handle empty data, one-point data, invalid probabilities, random seeds, misleading axes, and rounding.
## 17. Component Recommendations
Refine existing pages/charts and add `ProbabilitySimulationScene`, `SampleSpaceGrid`, `DistributionExplorer`, `SummaryStatsPanel`, and `DataDragPlot`.
## 18. Testing Plan
Test empty data, one point, outliers, impossible probabilities, many trials, chart resize, and rounding.
## 19. Risks and Things Not to Touch
Do not break data workspace, chart components, math-lab probability, or statistics utilities.
## 20. Phase B Implementation Strategy
Upgrade existing routes with simulation-first and data-first panels using existing utilities.
## 21. Acceptance Criteria for Phase A
Probability/statistics are classified as existing with an upgrade-only strategy.
## 22. Suggested Codex Prompt for Phase B
Upgrade existing probability/statistics routes with simulations, charts, live summaries, checks, hints, accessibility tables, and tests.

