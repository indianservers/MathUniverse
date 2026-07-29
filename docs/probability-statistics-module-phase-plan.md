# Probability Statistics Module Phase Plan

Date: 2026-07-29

## Phase 1: Distribution Atlas

Status: implemented.

Build separate pages for probability distributions:

- Module hub: `/probability-statistics/module`
- Distribution index: `/probability-statistics/distributions`
- Distribution detail pages: `/probability-statistics/distributions/:distributionId`

Included distribution tools:

- Discrete: Bernoulli, categorical, discrete uniform, binomial, geometric, negative binomial, hypergeometric, Poisson, Poisson-binomial, beta-binomial, Zipf.
- Continuous: continuous uniform, normal, exponential, gamma, beta, chi-square, Student t, F, lognormal, Weibull, Cauchy, Laplace, logistic, Pareto, Rayleigh, triangular.

Each page includes parameter sliders, PMF/PDF chart, formula, support, mean, variance, usage notes, and theory notes.

## Phase 2: Sampling, Inference, and Regression

Status: implemented.

Build separate pages for:

- Sampling distributions and Central Limit Theorem.
- Confidence intervals for means, proportions, differences, and paired data.
- Hypothesis tests: z, t, paired t, proportions, chi-square, variance tests, ANOVA.
- p-value, rejection-region, Type I/II error, power, and sample-size tools.
- Regression pages: simple/multiple linear regression, logistic regression, polynomial models, residual diagnostics, prediction intervals, and model comparison.

Implemented routes:

- Sampling distributions studio: `/probability-statistics/sampling`
- Inference and hypothesis testing studio: `/probability-statistics/inference`
- Regression diagnostics studio: `/probability-statistics/regression`

Implemented Phase 2 tool coverage:

- Sampling distribution visual with population curve, repeated sample means, standard error, 95% interval width, and CLT theory.
- Inference visual with z statistic, two-tailed rejection regions, p-value decision, confidence interval strip, and error/power theory.
- Regression visual with fitted line, residual sticks, outlier influence, R squared, RMSE, and diagnostics theory.

## Phase 3: Bayesian, Stochastic, and Advanced Modelling

Status: implemented.

Build separate pages for:

- Bayesian workflow: prior, likelihood, posterior, posterior predictive, MAP vs MLE.
- Conjugate models: Beta-Binomial, Gamma-Poisson, Normal-Normal.
- Markov chains, Poisson processes, random walks, queueing, reliability, and survival analysis.
- Information theory: entropy, cross-entropy, KL divergence, mutual information.
- Multivariate models: multivariate normal, covariance matrices, Dirichlet, Wishart, copulas, and mixture models.

Implemented routes:

- Bayesian reasoning studio: `/probability-statistics/bayesian`
- Stochastic processes studio: `/probability-statistics/stochastic`
- Advanced statistical models studio: `/probability-statistics/advanced-models`

Implemented Phase 3 tool coverage:

- Bayesian visual with evidence tree, prior-likelihood-posterior update, base-rate sensitivity, false-positive effect, and beta posterior shape.
- Stochastic visual with Markov state probabilities, queue-length distribution, traffic intensity, overload/stable signal, and exponential reliability decay.
- Advanced models visual with covariance ellipse, correlation tilt, mixture density, entropy, KL divergence, and model-selection theory.
