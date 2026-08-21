# Phase 4 CAS architecture, rules, assumptions and numerical policy

## Layering

The Phase 4 certified layer uses the shared typed AST from `math-foundation`, then applies parsed assumptions, deterministic special-case canonicalization, versioned transformation rules, existing exact CAS execution, verification, disclosed numerical fallback, and structured presentation. It does not introduce `eval`, `Function`, arbitrary formulas, or a second mathematical expression parser.

`CertifiedCasResult` keeps status, input/result node IDs, conditions, excluded values, assumptions, branches, separate exact/approximate fields, numerical method, precision, tolerance, residual, convergence, verified steps, diagnostics, and provenance.

## Transformation rules

The initial registry is versioned at rule level. It covers real/non-negative square-root identities, conditional division, zero-coefficient branches, squaring with candidate verification, exact candidate substitution, derivative/antiderivative power rules, the verified existing exact engine boundary, bisection, and Simpson quadrature.

Every step displayed by the new CAS workspace carries rule ID, version, name, preconditions, assumptions used, explanation derived from the rule, and verification status. Legacy narrative steps are not forwarded as certified steps.

## Assumptions and branches

Supported declarations include real/complex/integer/natural domains; scalar `>`, `>=`, `<`, `<=`, `=`, and `!=` constraints; and matrix properties such as invertibility. Contradictory equality, exclusion, and bound declarations stop computation.

The acceptance cases are explicit:

- `sqrt(x^2)` with `x in R` gives `|x|`.
- Adding `x >= 0` gives `x` and records the enabling rule/assumption.
- `a*x=1` returns distinct `a != 0` and `a = 0` branches.
- `sqrt(x+2)=x` rejects `-1` after checking the original equation and retains `2`.

## Numerical, precision and tolerance policy

Bisection requires a finite sign-changing bracket and reports iterations, maximum iterations, tolerance, residual, history, and convergence reason. Composite Simpson requires finite sampled values and an even subdivision count; a coarse/fine Richardson estimate determines whether tolerance was met. Hitting an iteration limit is not convergence.

Normal tails use the complementary error function directly. Exponential probabilities use `expm1`/`log1p`. Approximate output never replaces an available exact field.

## Units

The initial registry covers common length, time, mass, temperature, angle, force, energy, and pressure units. It validates dimensions, handles affine Celsius/Fahrenheit/Kelvin conversion, retains significant figures where declared, rejects incompatible addition, and creates compound units under multiplication. Arbitrary compound-unit parsing remains unsupported.
