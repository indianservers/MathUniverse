# Probability and Statistics — Phase B: Implementation + Testing + Re-audit

## 1. Implementation Objective
Upgrade existing probability/statistics routes with simulation-first and data-first visual labs.
## 2. Current Status from Phase A
Existing.
## 3. Implementation Decision
Upgrade.
## 4. Target Routes
`/probability-statistics`, `/statistics`, `/math-lab/probability`, and `/workspace/data`.
## 5. Files to Inspect Before Coding
`src/pages/ProbabilityStatistics.tsx`; `src/pages/MathLabProbability.tsx`; `src/pages/WorkspaceData.tsx`; `src/components/charts/*`; probability/statistics utilities and proof files.
## 6. Files Expected to Change
Existing probability/statistics pages, chart integrations, simulation components, helper tests, and docs.
## 7. Components to Create or Refine
`ProbabilitySimulationScene`, `SampleSpaceGrid`, `DistributionExplorer`, `SummaryStatsPanel`, `DataDragPlot`.
## 8. Interaction Requirements
Click, drag, snap, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 9. Visual Requirements
Data table, chart, summary values, sample space, and simulation results must stay connected.
## 10. Practice / Challenge Requirements
Add chance prediction, simulation, outlier effect, distribution comparison, and chart reading tasks.
## 11. Math Correctness Requirements
Handle probability bounds, empty data, sample/population distinction, rounded summaries, and random simulation limits.
## 12. Accessibility Requirements
Chart tables, ARIA summaries, keyboard controls, non-color encodings, and reduced motion.
## 13. Mobile Responsiveness Requirements
Use tabbed chart/table/simulation layout.
## 14. Performance Requirements
Batch simulation updates and cap rendered marks for large trials.
## 15. Testing Requirements
Test statistics/probability helpers, routes, chart behavior, simulation edges, and build.
## 16. Route Verification Checklist
Verify probability/statistics, math-lab probability, statistics alias, and data workspace.
## 17. Documentation Updates
Document formulas, simulation limits, chart accessibility, and preserved routes.
## 18. Final Codex Completion Report Format
Report files, probability/statistics cases, routes, accessibility checks, limitations, and next steps.
## 19. Acceptance Criteria
Existing probability/statistics modules are upgraded without route duplication.

