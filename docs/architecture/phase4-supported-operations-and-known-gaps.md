# Phase 4 supported operations and known gaps

## Implemented and tested

- Certified result contract and versioned verified steps.
- Assumption-sensitive square-root simplification, parameter branches, and radical candidate rejection.
- Certified bisection and Simpson services.
- Dimension-aware conversion/addition/multiplication for the initial unit registry.
- General local CSV/TSV dataframe, typed columns, immutable transformations, summaries, simple regression, Welch comparison, and transparent method rules.
- Consistent Phase 4 API for eight distributions, including stable normal tails.
- Reproducible Bernoulli/dice/random-walk simulation.
- Stable-ID notebook, deterministic persistence, dependency diagnostics, and structured analysis cards.
- 525 versioned benchmarks across all requested benchmark categories.

## Partial

- The established CAS still provides broad algebra, calculus, matrices, number theory, statistics, and probability commands, but most of its 154 commands do not yet have operation-specific formal Phase 4 rules and complete branch/domain metadata.
- The existing graph and geometry systems share the dependency foundation, but the new Phase 4 UI does not yet author every cross-workspace link in one workflow.
- Eight of 27 distributions use the full consistent contract.

## Unsupported or deferred

- Research-level simplification, complete transcendental/trigonometric solving, general inequality regions, symbolic series convergence proofs, general ODE systems, arbitrary-precision fallback, nonlinear systems and optimization.
- General exact null/column spaces, conditioning, full SVD/Jordan reliability, and advanced numerical-stability certification.
- Join, append, wide/long reshape, date extraction, large-grid virtualization, and worker cancellation UI.
- Multiple/polynomial/logistic/nonlinear/WLS modelling; ANOVA, chi-square, non-parametric, bootstrap and permutation inference; time-series/index-number workspaces.
- Distribution estimation, goodness-of-fit and Q-Q integration for the full 27-distribution atlas.
- Full causality tooling, advanced experimental-design validators, and every required report/export surface.
- Full automated WCAG and assistive-technology certification.
