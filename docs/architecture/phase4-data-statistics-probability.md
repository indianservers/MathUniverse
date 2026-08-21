# Phase 4 dataframe, statistics, probability and simulation

## Dataframe architecture

The local dataframe stores typed columns, rows, source kind, immutable parent dataset ID, version, dependency node ID, and transformation records. CSV/TSV parsing supports quoted fields, detects malformed quoting, limits imports to 100,000 rows and 500 columns, and never transmits local data.

Implemented transformations are rename, type change with invalid-row reporting, stable sort, filter, replace, duplicate removal, calculated columns without script execution, grouping/aggregation, and deterministic sampling. Each transformation creates a new dataset and preserves the original. CSV export prefixes formula-like fields to reduce spreadsheet formula injection risk.

Summary statistics include counts/missingness, mean, median, mode, extrema/range, sample variance/SD, quartiles/IQR, mean and median absolute deviations, skewness, and excess kurtosis.

## Models and inference

Simple linear regression is general dataset-driven and reports coefficients, approximate standard errors/statistics/p-values/intervals, R²/adjusted R², residual standard error, fitted values, standardized residuals, leverage, Cook's distance, and compact linearity/variance/normality/influence/design diagnostics. It explicitly states that association is not causation.

Welch two-group comparison reports hypotheses, statistic, degrees of freedom, approximate p-value, confidence interval, Hedges g, assumptions, decision language, practical interpretation, limitations, and randomization/non-parametric alternatives. It never says the null is proven.

The method recommender uses exposed rules based on outcome type, group count, pairing, independence, skew, sample size, and study design.

## Distributions

Eight distributions currently implement the consistent Phase 4 contract: Bernoulli, binomial, geometric, Poisson, continuous uniform, normal, exponential, and lognormal. The contract includes validation, support, PMF/PDF, CDF, survival, log probability, quantile, mean, variance, numerical method, precision, and warnings.

The other 19 existing visual distribution specifications remain available through their established routes but have not yet been upgraded to this full contract.

## Simulation reproducibility

The seeded simulation engine supports Bernoulli sample means, dice sample means, and random walks. Records retain seed, Mulberry32 generator, parameters, trials, execution version, raw results, summary, dependency node, and reproduction string. Trial and sample-size limits fail safely.
