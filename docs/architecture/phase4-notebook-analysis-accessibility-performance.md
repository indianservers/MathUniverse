# Phase 4 notebook, analysis cards, accessibility and performance

## Reactive notebook

The versioned notebook model supports definition, CAS, assumption, graph, geometry, dataset, data transformation, statistical analysis, simulation, explanation, lesson activity, assessment, and report-section cells. Cells have stable IDs, dependency IDs, revisions, status, result, and provenance.

Reordering does not alter dependencies. Missing dependencies and cycles produce diagnostics. Frozen status preserves an explicit result. The local JSON format is deterministically key-sorted and validates its version when reopened.

## Analysis cards

Cards contain source dataset ID, full transformation pipeline, method, parameters, assumptions, structured results, diagnostics, linked chart descriptors, interpretation, limitations, engine version, optional seed, and accessible description. A screenshot is not treated as an analysis card.

## Accessibility behavior

The seven new workspaces use landmark navigation, semantic headings/tables, labelled inputs, visible textual statuses, structured result lists, live regions for CAS/simulation changes, and table/text chart alternatives. Exact/approximate state and diagnostic grouping do not rely on colour alone. Simulation output has no mandatory animation.

Full assistive-technology certification, matrix-tree navigation, sonification integration, and accessible report export remain open.

## Performance and safety

- Data import: 100,000 rows and 500 columns.
- Simulation: 1,000,000 trials; sample size 100,000.
- Bisection: default 100 iterations.
- Notebook and CAS formulas cannot execute arbitrary JavaScript.
- Malformed quoted input is rejected; CSV formula-like export cells are neutralized.
- Dataset transformations preserve parents instead of overwriting source data.

Worker/background execution, progressive parsing, large-grid virtualization, explicit cancellation controls, and memory measurement remain Phase 4 gaps and should be completed before large-data release claims.
