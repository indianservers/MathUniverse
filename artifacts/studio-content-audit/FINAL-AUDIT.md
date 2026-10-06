# Studio content, interaction and UI audit

Audit date: 6 October 2026. Scope: the 14 requested main studios and the five advanced collection entries. The advanced Differential Equations lab is assessed separately as a companion demonstration.

## Implemented improvements

- Eighteen connected learning paths with searchable chapters, prerequisites, definitions, methods, worked examples, assumptions, practice and links to labs. More than sixty supplemental chapters extend previously missing topics.
- Eighteen supplemental mathematical workbenches. Four additional pages: Groups/Rings/Fields, Laplace transforms, heat/wave equations, boundary-value eigenfunctions.
- Shared Undo, Redo, Reset and Share use registered model state. Existing Algebra histories and geometric figure states participate in that ledger. Shared links preserve the selected route, mode and model inputs. Exact formatting is supported where recognizable.
- Residue-table challenges select elements from the current carrier set, and a modular-addition banner checks the table rather than assuming every abelian group is cyclic.
- Concept questions are explicitly distinguished from current-model challenges. Changing a live problem clears its answer; malformed fractions and repeated XP rewards are rejected.
- Statistics rebuilt around actual data, six distinct distributions, six experiment types, Student/Wilson/Welch/bootstrap intervals, computed hypothesis tests, signed data-coordinate regression, and observed-data ANOVA. Original data indices survive paired filtering. CLT modes display distinct stages.
- Repaired header action interception, nested scroll blank space, responsive panels, multiline outputs, and an inverse-trig interaction that reset its own state. Advanced navigation reaches its existing workbenches.

## Rating method and limits

Scores are **provisional editorial judgments**, not externally certified measurements or claims of exhaustive A-to-Z coverage. Content rates breadth, explanation, examples and assumptions; tools rate relevant live models and exploration; mathematical confidence rates validated calculations and stated limitations; UI rates navigation, layout and controls. Overall is their equally weighted mean. A perfect score would require comprehensive instruction and independent validation throughout.

Individual lab scores inherit their studio's editorial band, adjusted downward where the browser audit finds little content, no editable controls, no visualization, runtime errors or overflow. They are useful prioritization estimates, not independent expert mathematical reviews. Runtime checks do not establish mathematical correctness or teaching effectiveness. Mobile checks cover selected repaired pages; other mobile layouts remain unverified individually.

## Studio rankings

| Rank | Studio or lab | Content | Tools | Math | UI | Overall |
|---:|---|---:|---:|---:|---:|---:|
| 1 | Statistics & Probability Studio | 90 | 90 | 91 | 86 | 89.3 |
| 2 | Trigonometry Studio | 87 | 89 | 86 | 86 | 87 |
| 3 | Differential Equations Studio | 87 | 89 | 87 | 85 | 87 |
| 4 | Linear Algebra Studio | 87 | 89 | 86 | 85 | 86.8 |
| 5 | Algebra Studio | 86 | 87 | 85 | 86 | 86 |
| 6 | Geometry Studio | 86 | 88 | 84 | 84 | 85.5 |
| 7 | Calculus Studio | 86 | 87 | 84 | 83 | 85 |
| 8 | Number & Discrete Mathematics Studio | 86 | 87 | 84 | 83 | 85 |
| 9 | Complex Numbers Studio | 84 | 86 | 84 | 83 | 84.3 |
| 10 | Mathematical Modelling Studio | 84 | 88 | 81 | 83 | 84 |
| 11 | Graph Theory | 83 | 85 | 85 | 82 | 83.8 |
| 12 | Statistics Inference Studio | 83 | 81 | 88 | 83 | 83.8 |
| 13 | Number Systems Studio | 81 | 80 | 83 | 83 | 81.8 |
| 14 | Continued Fractions Lab | 80 | 79 | 85 | 82 | 81.5 |
| 15 | Algebraic Structures Studio | 80 | 80 | 83 | 82 | 81.3 |
| 16 | Set Theory and Relations | 80 | 80 | 83 | 82 | 81.3 |
| 17 | Advanced Differential Equations Lab | 79 | 78 | 84 | 82 | 80.8 |
| 18 | Special Functions Gallery | 79 | 76 | 82 | 82 | 79.8 |
| 19 | Famous Problems Atlas | 77 | 69 | 81 | 82 | 77.3 |

## Remaining depth gaps

- **Algebra Studio:** Broaden parameterized inequality and rational-function practice.
- **Algebraic Structures Studio:** Residue-ring tools cover a family; permutation groups and extension fields need dedicated models.
- **Geometry Studio:** More formal proofs and constrained conic constructions remain.
- **Trigonometry Studio:** Expand Fourier convergence and polar-curve exercises.
- **Calculus Studio:** Add general symbolic convergence and vector-calculus proof practice.
- **Number Systems Studio:** Add arbitrary-precision representation and rounding exercises.
- **Linear Algebra Studio:** Advanced workbenches need richer graphical feedback.
- **Complex Numbers Studio:** Complex integration and analytic continuation need dedicated contour models.
- **Mathematical Modelling Studio:** Add external-data fitting and out-of-sample validation workflows.
- **Number & Discrete Mathematics Studio:** More algorithm traces and graded proof exercises remain.
- **Set Theory and Relations:** Infinite cardinality and axiomatic set theory remain introductory.
- **Graph Theory:** Add a dedicated flow/matching visualization in this studio.
- **Statistics & Probability Studio:** Advanced inference assumptions need more automated diagnostics and power tools.
- **Differential Equations Studio:** PDE and boundary-value tools cover separated modes rather than general solvers.
- **Continued Fractions Lab:** Expand quadratic irrational and Pell equation solvers.
- **Famous Problems Atlas:** Atlas and finite experiments cannot establish open conjectures.
- **Statistics Inference Studio:** Focused companion; richer procedures are in Statistics & Probability.
- **Special Functions Gallery:** More recurrence, orthogonality and numerical error tools remain.
- **Advanced Differential Equations Lab:** Companion demonstration; full methods live in the main Differential Equations Studio.

## Every lab and subpage

The accompanying [lab-rankings.csv](lab-rankings.csv) contains 290 scored route entries, including aliases and standalone concept subpages. Aliases do not count as distinct mathematical models.

| Rank | Studio | Lab / subpage | Content | Tools | Math | UI | Overall | Check |
|---:|---|---|---:|---:|---:|---:|---:|---|
| 1 | Statistics & Probability Studio | Data Explorer (/probability-statistics/data-explorer) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 2 | Statistics & Probability Studio | Descriptive Statistics Lab (/probability-statistics/descriptive) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 3 | Statistics & Probability Studio | Interactive Distributions Lab (/probability-statistics/interactive-distributions) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 4 | Statistics & Probability Studio | Probability Experiments Lab (/probability-statistics/experiments) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 5 | Statistics & Probability Studio | Sampling & Central Limit Theorem Lab (/probability-statistics/clt) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 6 | Statistics & Probability Studio | Confidence Intervals Lab (/probability-statistics/confidence-intervals) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 7 | Statistics & Probability Studio | Correlation & Regression Lab (/probability-statistics/correlation) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 8 | Statistics & Probability Studio | ANOVA & Experimental Design Lab (/probability-statistics/anova) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 9 | Statistics & Probability Studio | Distribution Atlas (/probability-statistics/distributions) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 10 | Statistics & Probability Studio | Sampling Distributions Studio (/probability-statistics/sampling) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 11 | Statistics & Probability Studio | Inference & Hypothesis Testing Studio (/probability-statistics/inference) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 12 | Statistics & Probability Studio | Regression Diagnostics Studio (/probability-statistics/regression) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 13 | Statistics & Probability Studio | Bayesian Reasoning Studio (/probability-statistics/bayesian) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 14 | Statistics & Probability Studio | Stochastic Processes Studio (/probability-statistics/stochastic) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 15 | Statistics & Probability Studio | Advanced Statistical Models Studio (/probability-statistics/advanced-models) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 16 | Statistics & Probability Studio | Survey Sampling Studio (/probability-statistics/survey-sampling) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 17 | Statistics & Probability Studio | Design of Experiments Studio (/probability-statistics/design-of-experiments) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 18 | Statistics & Probability Studio | Statistical Quality Control Studio (/probability-statistics/quality-control) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 19 | Statistics & Probability Studio | Time Series Studio (/probability-statistics/time-series) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 20 | Statistics & Probability Studio | Nonparametric Tests Studio (/probability-statistics/nonparametric) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 21 | Statistics & Probability Studio | Multivariate Analysis Expansion (/probability-statistics/multivariate-analysis) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 22 | Statistics & Probability Studio | Advanced Inference Expansion (/probability-statistics/advanced-inference) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 23 | Statistics & Probability Studio | Survey and Official Statistics Studio (/probability-statistics/official-statistics) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 24 | Statistics & Probability Studio | Biostatistics and Survival Analysis Studio (/probability-statistics/survival-analysis) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 25 | Statistics & Probability Studio | Actuarial and Reliability Statistics Studio (/probability-statistics/actuarial-reliability) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 26 | Statistics & Probability Studio | Statistical Computing Lab (/probability-statistics/statistical-computing) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 27 | Statistics & Probability Studio | Applied Modelling Workflows Studio (/probability-statistics/applied-modelling) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 28 | Statistics & Probability Studio | School-Level Statistics Polish (/probability-statistics/school-statistics) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 29 | Statistics & Probability Studio | Bernoulli Distribution (/probability-statistics/distributions/bernoulli) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 30 | Statistics & Probability Studio | Categorical Distribution (/probability-statistics/distributions/categorical) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 31 | Statistics & Probability Studio | Discrete Uniform Distribution (/probability-statistics/distributions/discrete-uniform) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 32 | Statistics & Probability Studio | Binomial Distribution (/probability-statistics/distributions/binomial) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 33 | Statistics & Probability Studio | Geometric Distribution (/probability-statistics/distributions/geometric) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 34 | Statistics & Probability Studio | Negative Binomial Distribution (/probability-statistics/distributions/negative-binomial) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 35 | Statistics & Probability Studio | Hypergeometric Distribution (/probability-statistics/distributions/hypergeometric) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 36 | Statistics & Probability Studio | Poisson Distribution (/probability-statistics/distributions/poisson) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 37 | Statistics & Probability Studio | Poisson-Binomial Distribution (/probability-statistics/distributions/poisson-binomial) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 38 | Statistics & Probability Studio | Beta-Binomial Distribution (/probability-statistics/distributions/beta-binomial) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 39 | Statistics & Probability Studio | Zipf Distribution (/probability-statistics/distributions/zipf) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 40 | Statistics & Probability Studio | Continuous Uniform Distribution (/probability-statistics/distributions/continuous-uniform) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 41 | Statistics & Probability Studio | Normal Distribution (/probability-statistics/distributions/normal) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 42 | Statistics & Probability Studio | Exponential Distribution (/probability-statistics/distributions/exponential) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 43 | Statistics & Probability Studio | Gamma Distribution (/probability-statistics/distributions/gamma) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 44 | Statistics & Probability Studio | Beta Distribution (/probability-statistics/distributions/beta) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 45 | Statistics & Probability Studio | Chi-Square Distribution (/probability-statistics/distributions/chi-square) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 46 | Statistics & Probability Studio | Student t Distribution (/probability-statistics/distributions/student-t) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 47 | Statistics & Probability Studio | F Distribution (/probability-statistics/distributions/f) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 48 | Statistics & Probability Studio | Lognormal Distribution (/probability-statistics/distributions/lognormal) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 49 | Statistics & Probability Studio | Weibull Distribution (/probability-statistics/distributions/weibull) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 50 | Statistics & Probability Studio | Cauchy Distribution (/probability-statistics/distributions/cauchy) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 51 | Statistics & Probability Studio | Laplace Distribution (/probability-statistics/distributions/laplace) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 52 | Statistics & Probability Studio | Logistic Distribution (/probability-statistics/distributions/logistic) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 53 | Statistics & Probability Studio | Pareto Distribution (/probability-statistics/distributions/pareto) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 54 | Statistics & Probability Studio | Rayleigh Distribution (/probability-statistics/distributions/rayleigh) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 55 | Statistics & Probability Studio | Triangular Distribution (/probability-statistics/distributions/triangular) | 90 | 90 | 91 | 86 | 89.3 | Desktop smoke checked |
| 56 | Statistics & Probability Studio | Combinatorics Lab (/probability-statistics/counting) | 90 | 85 | 91 | 86 | 88 | Desktop smoke checked |
| 57 | Statistics & Probability Studio | Hypothesis Testing Lab (/probability-statistics/hypothesis) | 90 | 85 | 91 | 86 | 88 | Desktop smoke checked |
| 58 | Statistics & Probability Studio | Statistics & Probability Studio (/probability-statistics?tab=advanced) | 90 | 85 | 91 | 86 | 88 | Desktop smoke checked |
| 59 | Differential Equations Studio | Laplace Transforms & Step Responses (/differential-equations/laplace) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 60 | Differential Equations Studio | Heat & Wave Equation Modes (/differential-equations/pde) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 61 | Differential Equations Studio | Boundary-Value Eigenfunctions (/differential-equations/boundary-values) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 62 | Differential Equations Studio | Differential Equation Explorer (/differential-equations/explorer) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 63 | Differential Equations Studio | Direction Fields & Solution Curves (/differential-equations/slope-fields) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 64 | Differential Equations Studio | Initial Value Problems (/differential-equations/initial-value) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 65 | Differential Equations Studio | Separable Equations (/differential-equations/separable) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 66 | Differential Equations Studio | Homogeneous First-Order Equations (/differential-equations/homogeneous-first-order) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 67 | Differential Equations Studio | Exact Differential Equations (/differential-equations/exact) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 68 | Differential Equations Studio | Linear Equations & Integrating Factor (/differential-equations/linear-first-order) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 69 | Differential Equations Studio | Bernoulli Equations (/differential-equations/bernoulli) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 70 | Differential Equations Studio | Euler Method (/differential-equations/euler) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 71 | Differential Equations Studio | Improved Euler / Heun (/differential-equations/heun) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 72 | Differential Equations Studio | Runge–Kutta RK4 (/differential-equations/rk4) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 73 | Differential Equations Studio | Growth and Decay (/differential-equations/growth-models) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 74 | Differential Equations Studio | Higher-Order Linear ODEs (/differential-equations/higher-order-linear) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 75 | Differential Equations Studio | Method of Undetermined Coefficients (/differential-equations/undetermined-coefficients) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 76 | Differential Equations Studio | Variation of Parameters (/differential-equations/variation-of-parameters) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 77 | Differential Equations Studio | Cauchy–Euler Equations (/differential-equations/cauchy-euler) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 78 | Differential Equations Studio | Systems of First-Order ODEs (/differential-equations/systems) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 79 | Differential Equations Studio | Phase Plane Explorer (/differential-equations/phase-plane) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 80 | Differential Equations Studio | Mechanical Oscillations (/differential-equations/mechanical-oscillations) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 81 | Differential Equations Studio | LCR Circuits (/differential-equations/lcr-circuit) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 82 | Differential Equations Studio | Newton Cooling (/differential-equations/newton-cooling) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 83 | Differential Equations Studio | Equation Explorer (/differential-equations/equation-explorer) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 84 | Differential Equations Studio | Direction Fields (/differential-equations/direction-fields) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 85 | Differential Equations Studio | Homogeneous (/differential-equations/homogeneous) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 86 | Differential Equations Studio | Growth (/differential-equations/growth) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 87 | Differential Equations Studio | Oscillations (/differential-equations/oscillations) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 88 | Differential Equations Studio | Advanced Concept Studios (/math-lab/differential-equations) | 87 | 89 | 87 | 85 | 87 | Desktop smoke checked |
| 89 | Trigonometry Studio | Unit Circle & Angle Studio (/trigonometry/unit-circle) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 90 | Trigonometry Studio | Right Triangle Studio (/trigonometry/right-triangle) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 91 | Trigonometry Studio | Trigonometric Functions & Graphs Studio (/trigonometry/graphs) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 92 | Trigonometry Studio | Identities & Visual Proofs Studio (/trigonometry/identities) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 93 | Trigonometry Studio | Inverse Trigonometry Studio (/trigonometry/inverse) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 94 | Trigonometry Studio | Oblique Triangle Studio (/trigonometry/oblique) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 95 | Trigonometry Studio | Waves & Harmonics Studio (/trigonometry/waves) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 96 | Trigonometry Studio | Trigonometry Applications Studio (/trigonometry/applications) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 97 | Trigonometry Studio | Trigonometry AR Lab (/trigonometry/ar) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 98 | Trigonometry Studio | Trigonometric Formula Visualizer (/trigonometry/formula-visualizer) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 99 | Trigonometry Studio | Degrees and Radians (/trigonometry/degree-radian) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 100 | Trigonometry Studio | Special Angles (/trigonometry/special-angles) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 101 | Trigonometry Studio | Quadrant Sign Rules (/trigonometry/quadrant-signs) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 102 | Trigonometry Studio | Sine Graph (/trigonometry/sine-graph) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 103 | Trigonometry Studio | Cosine Graph (/trigonometry/cosine-graph) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 104 | Trigonometry Studio | Tangent Graph (/trigonometry/tangent-graph) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 105 | Trigonometry Studio | Reciprocal Graphs (/trigonometry/reciprocal-graphs) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 106 | Trigonometry Studio | Sec, Cosec, Cot (/trigonometry/reciprocal-ratios) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 107 | Trigonometry Studio | Pythagorean Identity (/trigonometry/pythagorean-identity) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 108 | Trigonometry Studio | Complementary Angles (/trigonometry/complementary-angles) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 109 | Trigonometry Studio | Sum and Difference Formulas (/trigonometry/sum-difference) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 110 | Trigonometry Studio | Double Angle Formulas (/trigonometry/double-angle) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 111 | Trigonometry Studio | Half-Angle Formulas (/trigonometry/half-angle) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 112 | Trigonometry Studio | Product-to-Sum (/trigonometry/product-to-sum) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 113 | Trigonometry Studio | Triple-Angle Formulas (/trigonometry/triple-angle) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 114 | Trigonometry Studio | Inverse Trigonometry (/trigonometry/inverse-trig) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 115 | Trigonometry Studio | Inverse Principal Values (/trigonometry/inverse-principal-values) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 116 | Trigonometry Studio | Trigonometric Equations (/trigonometry/trig-equations) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 117 | Trigonometry Studio | General Solutions (/trigonometry/general-solutions) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 118 | Trigonometry Studio | Trigonometric Inequalities (/trigonometry/trig-inequalities) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 119 | Trigonometry Studio | Heights and Distances (/trigonometry/height-distance) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 120 | Trigonometry Studio | Bearings and Navigation (/trigonometry/bearings-navigation) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 121 | Trigonometry Studio | Law of Sines (/trigonometry/law-of-sines) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 122 | Trigonometry Studio | Law of Cosines (/trigonometry/law-of-cosines) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 123 | Trigonometry Studio | SSA Ambiguous Case (/trigonometry/ambiguous-case) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 124 | Trigonometry Studio | Triangle Area Formula (/trigonometry/trig-triangle-area) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 125 | Trigonometry Studio | Polar Coordinates (/trigonometry/polar-coordinates) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 126 | Trigonometry Studio | Polar Rose Curves (/trigonometry/polar-roses) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 127 | Trigonometry Studio | De Moivre's Theorem (/trigonometry/complex-de-moivre) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 128 | Trigonometry Studio | Trigonometric Limits (/trigonometry/trig-limits) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 129 | Trigonometry Studio | Trig Derivatives (/trigonometry/trig-derivatives) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 130 | Trigonometry Studio | Trig Integrals (/trigonometry/trig-integrals) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 131 | Trigonometry Studio | Orthogonality of Sine and Cosine (/trigonometry/orthogonality) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 132 | Trigonometry Studio | Fourier Trigonometric Series (/trigonometry/fourier-trig-series) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 133 | Trigonometry Studio | Spherical Trigonometry (/trigonometry/spherical-trigonometry) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 134 | Trigonometry Studio | Hyperbolic Functions (/trigonometry/hyperbolic-functions) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 135 | Trigonometry Studio | Amplitude (/trigonometry/wave-amplitude) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 136 | Trigonometry Studio | Period and Frequency (/trigonometry/wave-period-frequency) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 137 | Trigonometry Studio | Phase Shift (/trigonometry/phase-shift) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 138 | Trigonometry Studio | 50+ Trigonometry Experiments (/trigonometry/inquiry-experiments) | 87 | 89 | 86 | 86 | 87 | Desktop smoke checked |
| 139 | Linear Algebra Studio | Vectors Lab (/linear-algebra/vectors) | 87 | 89 | 86 | 85 | 86.8 | Desktop smoke checked |
| 140 | Linear Algebra Studio | Matrices & Operations Lab (/linear-algebra/matrices) | 87 | 89 | 86 | 85 | 86.8 | Desktop smoke checked |
| 141 | Linear Algebra Studio | Systems & Row Reduction Lab (/linear-algebra/row-reduction) | 87 | 89 | 86 | 85 | 86.8 | Desktop smoke checked |
| 142 | Linear Algebra Studio | Linear Transformations Lab (/linear-algebra/linear-transforms) | 87 | 89 | 86 | 85 | 86.8 | Desktop smoke checked |
| 143 | Linear Algebra Studio | Determinants Lab (/linear-algebra/determinants) | 87 | 89 | 86 | 85 | 86.8 | Desktop smoke checked |
| 144 | Linear Algebra Studio | Vector Spaces & Basis Lab (/linear-algebra/vector-spaces) | 87 | 89 | 86 | 85 | 86.8 | Desktop smoke checked |
| 145 | Linear Algebra Studio | Eigenvalues & Eigenvectors Lab (/linear-algebra/eigenvectors) | 87 | 89 | 86 | 85 | 86.8 | Desktop smoke checked |
| 146 | Linear Algebra Studio | Orthogonality & Projections Lab (/linear-algebra/orthogonality) | 87 | 89 | 86 | 85 | 86.8 | Desktop smoke checked |
| 147 | Linear Algebra Studio | Least Squares Lab (/linear-algebra/least-squares) | 87 | 89 | 86 | 85 | 86.8 | Desktop smoke checked |
| 148 | Linear Algebra Studio | 2D & 3D Transformation Playground (/linear-algebra/playground) | 87 | 89 | 86 | 85 | 86.8 | Desktop smoke checked |
| 149 | Linear Algebra Studio | Quadratic Forms Lab (/linear-algebra/quadratic-forms) | 87 | 89 | 86 | 85 | 86.8 | Desktop smoke checked |
| 150 | Linear Algebra Studio | Principal Axes Lab (/linear-algebra/principal-axes) | 87 | 89 | 86 | 85 | 86.8 | Desktop smoke checked |
| 151 | Linear Algebra Studio | Linear Algebra Studio (/linear-algebra?mode=advanced) | 87 | 89 | 86 | 85 | 86.8 | Desktop smoke checked |
| 152 | Algebra Studio | Functions & Transformations Lab (/algebra/functions) | 86 | 87 | 85 | 86 | 86 | Desktop smoke checked |
| 153 | Algebra Studio | Polynomials Lab (/algebra/polynomials) | 86 | 87 | 85 | 86 | 86 | Desktop smoke checked |
| 154 | Algebra Studio | Systems of Equations Lab (/algebra/systems) | 86 | 87 | 85 | 86 | 86 | Desktop smoke checked |
| 155 | Algebra Studio | Sequences & Progressions Lab (/algebra/sequences) | 86 | 87 | 85 | 86 | 86 | Desktop smoke checked |
| 156 | Algebra Studio | CAS Step Explorer — candidate verification (/algebra/cas) | 86 | 87 | 85 | 86 | 86 | Desktop smoke checked |
| 157 | Algebra Studio | Algebraic Proof Lab (/algebra/classic) | 86 | 87 | 85 | 86 | 86 | Desktop smoke checked |
| 158 | Differential Equations Studio | First-Order Method Selector (/differential-equations/method-selector) | 87 | 84 | 87 | 85 | 85.8 | Desktop smoke checked |
| 159 | Trigonometry Studio | Trigonometric Functions (/trigonometry/trigonometric-functions) | 87 | 84 | 86 | 86 | 85.8 | Desktop smoke checked |
| 160 | Trigonometry Studio | Right Triangle Ratios (/trigonometry/right-triangle-ratios) | 87 | 84 | 86 | 86 | 85.8 | Desktop smoke checked |
| 161 | Trigonometry Studio | Eclipse Trigonometry (/trigonometry/eclipse-trigonometry) | 87 | 84 | 86 | 86 | 85.8 | Desktop smoke checked |
| 162 | Trigonometry Studio | Trigonometry Studio (/trigonometry?tab=advanced) | 87 | 84 | 86 | 86 | 85.8 | Desktop smoke checked |
| 163 | Geometry Studio | Construction Workspace (/geometry/construction) | 86 | 88 | 84 | 84 | 85.5 | Desktop smoke checked |
| 164 | Geometry Studio | Triangles Lab (/geometry/triangles) | 86 | 88 | 84 | 84 | 85.5 | Desktop smoke checked |
| 165 | Geometry Studio | Polygons Lab (/geometry/polygons) | 86 | 88 | 84 | 84 | 85.5 | Desktop smoke checked |
| 166 | Geometry Studio | Transformations Lab (/geometry/transformations) | 86 | 88 | 84 | 84 | 85.5 | Desktop smoke checked |
| 167 | Geometry Studio | Coordinate Geometry Lab (/geometry/coordinate) | 86 | 88 | 84 | 84 | 85.5 | Desktop smoke checked |
| 168 | Geometry Studio | Measurement Lab (/geometry/measurement) | 86 | 88 | 84 | 84 | 85.5 | Desktop smoke checked |
| 169 | Geometry Studio | Theorem & Visual Proof (/geometry/proofs) | 86 | 88 | 84 | 84 | 85.5 | Desktop smoke checked |
| 170 | Geometry Studio | Geometry AR Lab (/geometry/ar) | 86 | 88 | 84 | 84 | 85.5 | Desktop smoke checked |
| 171 | Linear Algebra Studio | Cayley–Hamilton Lab (/linear-algebra/cayley-hamilton) | 87 | 84 | 86 | 85 | 85.5 | Desktop smoke checked |
| 172 | Linear Algebra Studio | Diagonalization Lab (/linear-algebra/diagonalization) | 87 | 84 | 86 | 85 | 85.5 | Desktop smoke checked |
| 173 | Linear Algebra Studio | Matrix Factorizations Lab (/linear-algebra/matrix-factorizations) | 87 | 84 | 86 | 85 | 85.5 | Desktop smoke checked |
| 174 | Linear Algebra Studio | Similar Matrices Lab (/linear-algebra/similarity) | 87 | 84 | 86 | 85 | 85.5 | Desktop smoke checked |
| 175 | Calculus Studio | Limits & Continuity Studio (/calculus/limits) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 176 | Calculus Studio | Derivatives Studio (/calculus/derivatives) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 177 | Calculus Studio | Derivative Applications Studio (/calculus/derivative-applications) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 178 | Calculus Studio | Integration & Accumulation Studio (/calculus/integration) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 179 | Calculus Studio | Integration Techniques Studio (/calculus/integration-techniques) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 180 | Calculus Studio | Integral Applications Studio (/calculus/integral-applications) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 181 | Calculus Studio | Differential Equations Studio (/calculus/differential-equations) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 182 | Calculus Studio | Series, Parametric & Polar Studio (/calculus/series-parametric-polar) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 183 | Calculus Studio | Multivariable & Vector Calculus Studio (/calculus/multivariable-vector) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 184 | Calculus Studio | Jacobians & Coordinate Transformations (/calculus/jacobians-coordinate-transformations) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 185 | Calculus Studio | Beta & Gamma Functions (/calculus/beta-gamma) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 186 | Calculus Studio | Named Convergence Tests (/calculus/series-tests) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 187 | Calculus Studio | Engineering Curve Tracing (/calculus/curve-tracing) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 188 | Calculus Studio | Lagrange Multipliers (/calculus/lagrange-multipliers) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 189 | Calculus Studio | Change of Order (/calculus/change-order-integration) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 190 | Calculus Studio | Advanced Calculus Workbench (/calculus/advanced) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 191 | Calculus Studio | Integration & Accumulation Studio (/calculus/integrals) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 192 | Calculus Studio | Derivative Applications Studio (/calculus/motion) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 193 | Calculus Studio | Welcome to Calculus Studio (/calculus/practice) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 194 | Calculus Studio | Integration & Accumulation Studio (/calculus/proof-problems) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 195 | Calculus Studio | Series, Parametric & Polar Studio (/calculus/series-blocks) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 196 | Calculus Studio | Welcome to Calculus Studio (/calculus/atlas) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 197 | Calculus Studio | Integration Techniques Studio (/calculus/formulas) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 198 | Calculus Studio | Derivative Applications Studio (/calculus/applications) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 199 | Number & Discrete Mathematics Studio | Number Sense & Number Lines Lab (/discrete-world/number-sense) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 200 | Number & Discrete Mathematics Studio | Modular Arithmetic Lab (/discrete-world/modular-arithmetic) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 201 | Number & Discrete Mathematics Studio | Number Patterns Lab (/discrete-world/number-patterns) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 202 | Number & Discrete Mathematics Studio | Mathematical Logic Lab (/discrete-world/logic) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 203 | Number & Discrete Mathematics Studio | Sets & Relations Lab (/discrete-world/sets) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 204 | Number & Discrete Mathematics Studio | Graph Theory & Networks Lab (/discrete-world/graphs) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 205 | Number & Discrete Mathematics Studio | Algorithms Lab (/discrete-world/algorithms) | 86 | 87 | 84 | 83 | 85 | Desktop smoke checked |
| 206 | Algebra Studio | 2D & 3D Shapes Explorer (/shapes) | 86 | 82 | 85 | 86 | 84.8 | Desktop smoke checked |
| 207 | Algebra Studio | Expressions & Algebra Tiles Lab (/algebra/expressions) | 86 | 82 | 85 | 86 | 84.8 | Desktop smoke checked |
| 208 | Algebra Studio | Equations & Inequalities Lab (/algebra/equations) | 86 | 82 | 85 | 86 | 84.8 | Desktop smoke checked |
| 209 | Algebra Studio | Exponents Radicals & Logarithms Lab (/algebra/exponents-logs) | 86 | 82 | 85 | 86 | 84.8 | Desktop smoke checked |
| 210 | Algebra Studio | Algebraic Proof Lab (/algebra/proof) | 86 | 82 | 85 | 86 | 84.8 | Desktop smoke checked |
| 211 | Algebra Studio | Advanced Algebra Workbench (/algebra/advanced) | 86 | 82 | 85 | 86 | 84.8 | Desktop smoke checked |
| 212 | Complex Numbers Studio | Argand Plane Lab (/complex-numbers/argand-plane) | 84 | 86 | 84 | 83 | 84.3 | Desktop smoke checked |
| 213 | Complex Numbers Studio | Complex Arithmetic & Geometry Lab (/complex-numbers/arithmetic) | 84 | 86 | 84 | 83 | 84.3 | Desktop smoke checked |
| 214 | Complex Numbers Studio | Polar & Exponential Forms Lab (/complex-numbers/polar-forms) | 84 | 86 | 84 | 83 | 84.3 | Desktop smoke checked |
| 215 | Complex Numbers Studio | Multiplication as Rotation Lab (/complex-numbers/rotation) | 84 | 86 | 84 | 83 | 84.3 | Desktop smoke checked |
| 216 | Complex Numbers Studio | Roots of Complex Numbers Lab (/complex-numbers/roots) | 84 | 86 | 84 | 83 | 84.3 | Desktop smoke checked |
| 217 | Complex Numbers Studio | Euler's Formula Lab (/complex-numbers/euler) | 84 | 86 | 84 | 83 | 84.3 | Desktop smoke checked |
| 218 | Complex Numbers Studio | Loci & Transformations Lab (/complex-numbers/loci) | 84 | 86 | 84 | 83 | 84.3 | Desktop smoke checked |
| 219 | Complex Numbers Studio | Mandelbrot & Julia Sets Lab (/complex-numbers/fractals) | 84 | 86 | 84 | 83 | 84.3 | Desktop smoke checked |
| 220 | Complex Numbers Studio | Applications to Waves & Circuits Lab (/complex-numbers/waves-circuits) | 84 | 86 | 84 | 83 | 84.3 | Desktop smoke checked |
| 221 | Geometry Studio | Circles Lab (/geometry/circles) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 222 | Geometry Studio | 2D & 3D Shapes Explorer (/geometry/solids) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 223 | Geometry Studio | Points, Lines, and Rays (/geometry/points-lines-rays) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 224 | Geometry Studio | Angles and Rotation (/geometry/angles) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 225 | Geometry Studio | Parallel Lines and Transversals (/geometry/parallel-lines) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 226 | Geometry Studio | Pythagorean Theorem (/geometry/pythagorean-theorem) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 227 | Geometry Studio | Triangle Congruence (/geometry/triangle-congruence) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 228 | Geometry Studio | Similar Triangles (/geometry/similar-triangles) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 229 | Geometry Studio | Quadrilaterals (/geometry/quadrilaterals) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 230 | Geometry Studio | Arcs and Sectors (/geometry/arcs-sectors) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 231 | Geometry Studio | Chords and Secants (/geometry/chords-secants) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 232 | Geometry Studio | Tangents (/geometry/tangents) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 233 | Geometry Studio | Coordinate Geometry (/geometry/coordinate-geometry) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 234 | Geometry Studio | Symmetry (/geometry/symmetry) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 235 | Geometry Studio | Area and Perimeter (/geometry/area-perimeter) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 236 | Geometry Studio | 3D Mensuration (/geometry/mensuration-3d) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 237 | Geometry Studio | Surface Area and Volume (/geometry/surface-area-volume) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 238 | Geometry Studio | Geometric Constructions (/geometry/geometric-constructions) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 239 | Geometry Studio | Loci (/geometry/loci) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 240 | Geometry Studio | Trigonometry in Geometry (/geometry/trig-in-geometry) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 241 | Geometry Studio | Geometry Studio (/geometry?tab=advanced) | 86 | 83 | 84 | 84 | 84.3 | Desktop smoke checked |
| 242 | Statistics & Probability Studio | Probability & Statistics Module (/probability-statistics/module) | 90 | 70 | 91 | 86 | 84.3 | Desktop smoke checked |
| 243 | Mathematical Modelling Studio | Motion Modelling Lab (/mathematical-modelling/motion) | 84 | 88 | 81 | 83 | 84 | Desktop smoke checked |
| 244 | Mathematical Modelling Studio | Population Growth Lab (/mathematical-modelling/population) | 84 | 88 | 81 | 83 | 84 | Desktop smoke checked |
| 245 | Mathematical Modelling Studio | Epidemic Modelling Lab (/mathematical-modelling/epidemics) | 84 | 88 | 81 | 83 | 84 | Desktop smoke checked |
| 246 | Mathematical Modelling Studio | Finance & Compound Interest Lab (/mathematical-modelling/finance) | 84 | 88 | 81 | 83 | 84 | Desktop smoke checked |
| 247 | Mathematical Modelling Studio | Optimization Modelling Lab (/mathematical-modelling/optimization) | 84 | 88 | 81 | 83 | 84 | Desktop smoke checked |
| 248 | Mathematical Modelling Studio | Networks & Routing Lab (/mathematical-modelling/networks) | 84 | 88 | 81 | 83 | 84 | Desktop smoke checked |
| 249 | Mathematical Modelling Studio | Regression & Prediction Lab (/mathematical-modelling/regression) | 84 | 88 | 81 | 83 | 84 | Desktop smoke checked |
| 250 | Mathematical Modelling Studio | Periodic Phenomena Lab (/mathematical-modelling/periodic) | 84 | 88 | 81 | 83 | 84 | Desktop smoke checked |
| 251 | Mathematical Modelling Studio | Numerical Experiments Lab (/mathematical-modelling/numerical) | 84 | 88 | 81 | 83 | 84 | Desktop smoke checked |
| 252 | Mathematical Modelling Studio | Model Comparison & Error Lab (/mathematical-modelling/comparison) | 84 | 88 | 81 | 83 | 84 | Desktop smoke checked |
| 253 | Calculus Studio | Taylor Expansion in Two Variables (/calculus/taylor-two-variables) | 86 | 82 | 84 | 83 | 83.8 | Desktop smoke checked |
| 254 | Calculus Studio | Multiple Integral Applications (/calculus/multiple-integral-applications) | 86 | 82 | 84 | 83 | 83.8 | Desktop smoke checked |
| 255 | Number & Discrete Mathematics Studio | Factors, Primes & Divisibility Lab (/discrete-world/primes) | 86 | 82 | 84 | 83 | 83.8 | Desktop smoke checked |
| 256 | Number & Discrete Mathematics Studio | Combinatorics Lab (/discrete-world/combinatorics) | 86 | 82 | 84 | 83 | 83.8 | Desktop smoke checked |
| 257 | Number & Discrete Mathematics Studio | Cryptography Playground (/discrete-world/cryptography) | 86 | 82 | 84 | 83 | 83.8 | Desktop smoke checked |
| 258 | Number & Discrete Mathematics Studio | Number & Discrete Mathematics Studio (/discrete-world?workbench=advanced) | 86 | 82 | 84 | 83 | 83.8 | Desktop smoke checked |
| 259 | Statistics Inference Studio | Advanced Concept Studios (/math-lab/stats-inference) | 83 | 81 | 88 | 83 | 83.8 | Desktop smoke checked |
| 260 | Complex Numbers Studio | Advanced Complex Numbers Workbench (/complex-numbers?tab=advanced) | 84 | 81 | 84 | 83 | 83 | Desktop smoke checked |
| 261 | Mathematical Modelling Studio | Advanced Mathematical Modelling (/mathematical-modelling/advanced) | 84 | 83 | 81 | 83 | 82.8 | Desktop smoke checked |
| 262 | Calculus Studio | Centroid and Center of Mass (/calculus/centroid-center-of-mass) | 76 | 87 | 84 | 83 | 82.5 | Desktop smoke checked |
| 263 | Trigonometry Studio | Real-World Waves (/trigonometry/real-world-waves) | 87 | 69 | 86 | 86 | 82 | Desktop smoke checked |
| 264 | Linear Algebra Studio | Jordan Form Lab (/linear-algebra/jordan-form) | 87 | 69 | 86 | 85 | 81.8 | Desktop smoke checked |
| 265 | Number Systems Studio | Irrational numbers (/number-systems/irrational) | 81 | 80 | 83 | 83 | 81.8 | Desktop smoke checked |
| 266 | Number Systems Studio | Real number line (/number-systems/real-line) | 81 | 80 | 83 | 83 | 81.8 | Desktop smoke checked |
| 267 | Number Systems Studio | Number hierarchy (/number-systems/hierarchy) | 81 | 80 | 83 | 83 | 81.8 | Desktop smoke checked |
| 268 | Number Systems Studio | Number hierarchy (/number-systems/space) | 81 | 80 | 83 | 83 | 81.8 | Desktop smoke checked |
| 269 | Continued Fractions Lab | Advanced Concept Studios (/math-lab/continued-fractions) | 80 | 79 | 85 | 82 | 81.5 | Desktop smoke checked |
| 270 | Algebraic Structures Studio | Algebraic Structures Lab (/algebraic-structures/structure-test) | 80 | 80 | 83 | 82 | 81.3 | Desktop smoke checked |
| 271 | Algebraic Structures Studio | Algebraic Structures Lab — Cayley Tables (/algebraic-structures/cayley-tables) | 80 | 80 | 83 | 82 | 81.3 | Desktop smoke checked |
| 272 | Algebraic Structures Studio | Algebraic Structures Lab — Semigroups & Monoids (/algebraic-structures/semigroups-monoids) | 80 | 80 | 83 | 82 | 81.3 | Desktop smoke checked |
| 273 | Set Theory and Relations | Set Theory Studio (/set-theory/set-builder) | 80 | 80 | 83 | 82 | 81.3 | Desktop smoke checked |
| 274 | Set Theory and Relations | Set Theory Studio (/set-theory/venn-diagram-engine) | 80 | 80 | 83 | 82 | 81.3 | Desktop smoke checked |
| 275 | Set Theory and Relations | Set Theory Studio (/set-theory/relations) | 80 | 80 | 83 | 82 | 81.3 | Desktop smoke checked |
| 276 | Set Theory and Relations | Set Theory Studio (/set-theory/hasse-diagram) | 80 | 80 | 83 | 82 | 81.3 | Desktop smoke checked |
| 277 | Set Theory and Relations | Set Theory Studio (/set-theory/functions) | 80 | 80 | 83 | 82 | 81.3 | Desktop smoke checked |
| 278 | Algebra Studio | Algebraic Structures Studio (/algebra/algebraic-structures) | 86 | 67 | 85 | 86 | 81 | Desktop smoke checked |
| 279 | Number Systems Studio | Rational numbers (/number-systems/rational) | 81 | 75 | 83 | 83 | 80.5 | Desktop smoke checked |
| 280 | Number Systems Studio | Concept cards (/number-systems/concepts) | 81 | 75 | 83 | 83 | 80.5 | Desktop smoke checked |
| 281 | Number Systems Studio | Practice & accuracy (/number-systems/practice) | 81 | 75 | 83 | 83 | 80.5 | Desktop smoke checked |
| 282 | Number Systems Studio | Practice & accuracy (/number-systems/accuracy) | 81 | 75 | 83 | 83 | 80.5 | Desktop smoke checked |
| 283 | Algebraic Structures Studio | Algebraic Structures Lab — Posets & Lattices (/algebraic-structures/posets-lattices) | 80 | 75 | 83 | 82 | 80 | Desktop smoke checked |
| 284 | Algebraic Structures Studio | Boolean Algebra (/algebraic-structures/boolean-algebra) | 80 | 75 | 83 | 82 | 80 | Desktop smoke checked |
| 285 | Algebraic Structures Studio | Groups, Rings & Fields Lab (/algebraic-structures/groups-rings-fields) | 80 | 75 | 83 | 82 | 80 | Desktop smoke checked |
| 286 | Calculus Studio | Moments of Inertia (/calculus/moments-of-inertia) | 86 | 67 | 84 | 83 | 80 | Desktop smoke checked |
| 287 | Set Theory and Relations | Set Theory Studio (/set-theory/representations) | 80 | 75 | 83 | 82 | 80 | Desktop smoke checked |
| 288 | Set Theory and Relations | Set Theory Studio (/set-theory/practice) | 80 | 75 | 83 | 82 | 80 | Desktop smoke checked |
| 289 | Special Functions Gallery | Advanced Concept Studios (/math-lab/special-functions) | 79 | 76 | 82 | 82 | 79.8 | Desktop smoke checked |
| 290 | Famous Problems Atlas | Advanced Concept Studios (/math-lab/famous-problems) | 77 | 54 | 81 | 82 | 73.5 | Desktop smoke checked |

## Verification evidence

- final-browser-results.json: current route sweep and visible controls/graphs. 322 entries currently recorded; 0 failures/errors.
- final-contracts.json, main-model-contracts-final.json: representative model history, share/reload, focused-field gestures, store-backed graph/set models and mobile checks.
- repair-verification.json: 54-route earlier repair review, including eighteen curriculum workbenches and seven advanced collections.
- statisticsCore.test.ts, curriculum.test.ts, modelLedger.test.ts, EnrichmentLabs.test.ts and GroupsRingsFieldsLab.test.ts verify the new numerical/model families.
- studio-tests-final.log: 331 tests passed across 99 studio-related test files.
- build-final.log: final production build.
- Full-repository type checking has existing errors documented in typecheck-after-content.log. The last combined run was stopped during resource contention; it is not a clean type-check result.

These changes expand core school/undergraduate coverage and advanced introductions. Dedicated general solvers, additional proof exercises, complete mobile review, accessibility review and external mathematical review remain before claiming exhaustive coverage or best-in-class status.
