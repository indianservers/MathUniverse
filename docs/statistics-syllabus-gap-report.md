# Statistics Syllabus Gap Report

Date: 2026-07-29  
Scope: statistics and probability coverage from Class 6 through postgraduate syllabi, compared with the current Math Universe app.

## Sources Checked

- NCERT Class 6 mathematics: Data Handling and Presentation.
- NCERT Class 9 mathematics: Introduction to Probability.
- NCERT Class 10 mathematics: Statistics.
- NCERT Classes 11-12 mathematics syllabus: Statistics and Probability unit.
- University of Delhi B.Sc. (Hons.) Statistics LOCF/CBCS syllabus.
- Banaras Hindu University M.A./M.Sc. Statistics syllabus.
- IIT Kanpur M.Sc. Statistics program page.
- Stanford Statistics M.S. required-course page.
- MIT OCW 18.05 Introduction to Probability and Statistics.
- Harvard and Stanford undergraduate statistics/program requirements pages.

## Current App Coverage Snapshot

The app is strong for visual-first school and early university statistics:

- Foundational data handling: data collection, tables, pictographs/bar charts, mean, median, mode, range, variance, standard deviation.
- Probability foundations: sample spaces, events, complement/addition/multiplication rules, conditional probability, Bayes, tree diagrams, expected value.
- Distribution atlas: Bernoulli, categorical, discrete uniform, binomial, geometric, negative binomial, hypergeometric, Poisson, Poisson-binomial, beta-binomial, Zipf, continuous uniform, normal, exponential, gamma, beta, chi-square, Student t, F, lognormal, Weibull, Cauchy, Laplace, logistic, Pareto, Rayleigh, triangular.
- Sampling and inference: sampling distributions, standard error, CLT, confidence intervals, p-values, hypothesis testing, Type I/II errors, power.
- Regression: least squares, residuals, R squared, simple model comparison, outliers, curvature stress tests.
- Advanced studios: Bayesian updating, beta conjugacy intuition, Markov chains, queues, reliability, multivariate normal geometry, entropy, KL divergence, mixture intuition.
- Core lesson system includes a large Data and Probability category, school remediation lessons, advanced concept lessons, visual proofs, and probability/statistics module routes.

## Main Finding

The app now covers most school through first-course university statistics concepts. The remaining gaps are not basic topic presence; they are depth, exactness, and professional workflows expected in B.Sc./M.Sc./MS Statistics syllabi.

## Coverage by Level

| Level | External syllabus expectation | Current app status | Gap level |
| --- | --- | --- | --- |
| Class 6-8 | Data collection, organization, pictographs, bar charts, basic probability/chance, simple comparisons | Covered through concept map, probability-statistics pages, visual proofs, lessons | Low |
| Class 9-10 | Sample space, events, tree-style probability, grouped data, cumulative frequency, median/mode for grouped data | Mostly covered; grouped-data median/ogive workflow is not prominent | Low-Medium |
| Class 11-12 | Dispersion, variance/standard deviation, random experiments, events, conditional probability, Bayes, random variables, distributions | Covered or partially covered; formal axiomatic probability and random-variable transformations are light | Medium |
| UG Statistics | Descriptive stats, probability distributions, sampling distributions, survey sampling, official statistics, inference, linear models, SQC, stochastic processes, computing, DOE, multivariate, nonparametric, time series, econometrics, actuarial, biostatistics/survival | Strong in distributions/inference/regression/stochastic basics; missing several full-course applied and theory units | High for full B.Sc. parity |
| PG Statistics/MS | Distribution theory, advanced inference, multivariate theory, DOE, stochastic processes, reliability, sequential analysis, asymptotics, Bayesian analysis, simulation, programming, consulting/electives | Good visual introductions; not yet PG-level derivation, proof, or workflow depth | High |

## Priority Gaps

### P0: Add these first

1. Survey Sampling Studio
   - Stratified, systematic, cluster, multistage sampling.
   - Finite population correction.
   - Neyman allocation.
   - Sampling vs census tradeoffs.

2. Design of Experiments Studio
   - CRD, RBD, Latin square.
   - Factorial designs, interactions, blocking, replication, randomization.
   - ANOVA table construction from experiment layout.

3. Statistical Quality Control Studio
   - X-bar, R, p, np, c, u charts.
   - Control limits vs specification limits.
   - Process capability, Cp/Cpk.

4. Time Series Studio
   - Trend, seasonal, cyclic, irregular components.
   - Moving averages, exponential smoothing.
   - ACF/PACF, AR, MA, ARMA/ARIMA intuition.
   - Forecast error metrics.

5. Nonparametric Tests Studio
   - Sign test, Wilcoxon signed-rank, Mann-Whitney U, Kruskal-Wallis, runs test.
   - Rank transformations and when nonparametric methods are useful.

### P1: University-depth upgrades

6. Multivariate Analysis Expansion
   - Wishart distribution, Hotelling's T2, MANOVA intuition.
   - PCA, canonical correlation, classification boundaries.

7. Advanced Inference Expansion
   - MLE workflows, likelihood curves, Fisher information.
   - Neyman-Pearson lemma, likelihood ratio tests.
   - Asymptotic normality and delta method.
   - Sequential probability ratio test.

8. Survey and Official Statistics
   - Index numbers, CPI/WPI, demography basics, vital statistics.
   - Indian official statistical system and data-source literacy.

9. Biostatistics and Survival Analysis
   - Kaplan-Meier curves, hazard, censoring, log-rank test.
   - Clinical trial language and treatment-control designs.

10. Actuarial and Reliability Statistics
   - Life tables, survival functions, hazard rates.
   - Risk models, premium basics, ruin intuition.

### P2: Professional/statistical computing polish

11. Statistical Computing Lab
   - Monte Carlo integration, random number generation, bootstrap, permutation tests.
   - Import/export CSV, reproducible notebooks, code snippets in R/Python style.

12. Applied Modelling Workflows
   - GLMs beyond logistic curve intuition: Poisson regression, logistic regression diagnostics, deviance.
   - Model selection: AIC/BIC, cross-validation, train/test split.
   - Causal inference basics: confounding, matching, treatment effect estimation.

13. School-Level Polish
   - Dedicated grouped-data median/mode/ogive mini-tool.
   - Explicit pictograph/bar-graph lessons for Class 6.
   - Tree diagram builder for without-replacement probability.

## Suggested Implementation Roadmap

### Phase A: Syllabus Completion Pack

- Add 30-40 additive lessons under a new Statistics Syllabus pack.
- Prioritize Survey Sampling, DOE, SQC, Time Series, Nonparametric Tests, Multivariate, Advanced Inference, Survival, Official Statistics.
- Do not mutate the frozen 674 core catalog; follow the additive lesson-pack pattern.

### Phase B: Five New Studios

- `/probability-statistics/survey-sampling`
- `/probability-statistics/design-of-experiments`
- `/probability-statistics/quality-control`
- `/probability-statistics/time-series`
- `/probability-statistics/nonparametric`

### Phase C: PG Depth Layer

- Add derivation/theory panels, formula maps, downloadable worked examples, and simulation-backed checks.
- Add a “UG/PG syllabus map” view showing which routes satisfy each syllabus unit.

## Bottom Line

For Class 6-12, the app is already close, with small gaps around exact grouped-data and school graphing workflows. For UG/PG statistics, the app has the right spine but needs specialized applied-statistics courses: survey sampling, DOE, SQC, time series, nonparametrics, multivariate theory, advanced inference, survival/actuarial, official statistics, and statistical computing.
