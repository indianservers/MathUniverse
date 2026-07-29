export type DistributionKind = "discrete" | "continuous" | "multivariate";

export type DistributionPhase = 1 | 2 | 3;

export type DistributionParameter = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  description: string;
};

export type DistributionPoint = {
  x: number;
  y: number;
  label: string;
};

export type DistributionSummary = {
  mean: string;
  variance: string;
  support: string;
};

export type DistributionSpec = {
  id: string;
  name: string;
  kind: DistributionKind;
  phase: DistributionPhase;
  family: "Foundational discrete" | "Foundational continuous" | "Sampling and inference" | "Advanced modelling";
  route: string;
  shortUse: string;
  formula: string;
  parameters: DistributionParameter[];
  theory: string[];
  examples: string[];
  calculate: (params: Record<string, number>) => {
    points: DistributionPoint[];
    summary: DistributionSummary;
    focus: string;
  };
};

const factorialCache = new Map<number, number>([[0, 1], [1, 1]]);

export const phasePlan = [
  {
    phase: "Phase 1",
    title: "Distribution Atlas",
    scope: "Separate module pages for core discrete and continuous distributions with PMF/PDF curves, CDF/tail language, parameters, formulas, mean/variance, and usage notes.",
    routes: ["/probability-statistics/module", "/probability-statistics/distributions", "/probability-statistics/distributions/:distributionId"],
  },
  {
    phase: "Phase 2",
    title: "Inference, Sampling, and Regression",
    scope: "Dedicated pages for sampling distributions, confidence intervals, hypothesis tests, p-values, power, ANOVA, residual diagnostics, and regression model comparison.",
    routes: ["/probability-statistics/inference", "/probability-statistics/regression", "/probability-statistics/sampling"],
  },
  {
    phase: "Phase 3",
    title: "Bayesian, Stochastic, and Advanced Models",
    scope: "Bayes workflows, conjugate priors, Markov chains, Poisson processes, queues, survival/reliability, simulation, information theory, and multivariate modelling.",
    routes: ["/probability-statistics/bayesian", "/probability-statistics/stochastic", "/probability-statistics/advanced-models"],
  },
];

export const distributionSpecs: DistributionSpec[] = [
  discrete("bernoulli", "Bernoulli Distribution", "P(X=x)=p^x(1-p)^(1-x)", "A single success/failure trial.", [
    param("p", "Success probability p", 0.01, 0.99, 0.01, 0.4, "Chance of the outcome X=1."),
  ], (p) => ({
    points: [{ x: 0, y: 1 - p.p, label: "0" }, { x: 1, y: p.p, label: "1" }],
    summary: { mean: fmt(p.p), variance: fmt(p.p * (1 - p.p)), support: "{0, 1}" },
    focus: `Success has probability ${pct(p.p)} and failure has probability ${pct(1 - p.p)}.`,
  })),
  discrete("categorical", "Categorical Distribution", "P(X=i)=p_i, sum p_i=1", "One draw from several named categories.", [
    param("a", "Category A weight", 0.1, 10, 0.1, 3, "Relative weight for category A."),
    param("b", "Category B weight", 0.1, 10, 0.1, 2, "Relative weight for category B."),
    param("c", "Category C weight", 0.1, 10, 0.1, 5, "Relative weight for category C."),
  ], (p) => {
    const total = p.a + p.b + p.c;
    const probs = [p.a / total, p.b / total, p.c / total];
    return {
      points: probs.map((value, index) => ({ x: index + 1, y: value, label: ["A", "B", "C"][index] })),
      summary: { mean: "category label", variance: "not numeric unless encoded", support: "{A, B, C}" },
      focus: `The normalized probabilities are A=${pct(probs[0])}, B=${pct(probs[1])}, C=${pct(probs[2])}.`,
    };
  }),
  discrete("discrete-uniform", "Discrete Uniform Distribution", "P(X=x_i)=1/n", "Equally likely integer outcomes.", [
    param("n", "Number of outcomes n", 2, 20, 1, 6, "How many equally likely values are possible."),
  ], (p) => {
    const n = Math.round(p.n);
    return {
      points: range(1, n).map((x) => ({ x, y: 1 / n, label: String(x) })),
      summary: { mean: fmt((n + 1) / 2), variance: fmt((n ** 2 - 1) / 12), support: `1, 2, ..., ${n}` },
      focus: `Every outcome has probability ${pct(1 / n)}.`,
    };
  }),
  discrete("binomial", "Binomial Distribution", "P(X=k)=C(n,k)p^k(1-p)^(n-k)", "Count successes in fixed independent trials.", [
    param("n", "Trials n", 1, 30, 1, 12, "Number of Bernoulli trials."),
    param("p", "Success probability p", 0.01, 0.99, 0.01, 0.45, "Chance of success on each trial."),
  ], (p) => {
    const n = Math.round(p.n);
    const points = range(0, n).map((k) => ({ x: k, y: combination(n, k) * p.p ** k * (1 - p.p) ** (n - k), label: String(k) }));
    return { points, summary: { mean: fmt(n * p.p), variance: fmt(n * p.p * (1 - p.p)), support: `0, 1, ..., ${n}` }, focus: `Most mass sits near np = ${fmt(n * p.p)}.` };
  }),
  discrete("geometric", "Geometric Distribution", "P(X=k)=(1-p)^(k-1)p, k=1,2,...", "Trials until the first success.", [
    param("p", "Success probability p", 0.05, 0.95, 0.01, 0.25, "Chance of success on each trial."),
  ], (p) => {
    const maxK = Math.min(140, Math.max(24, Math.ceil(Math.log(0.001) / Math.log(1 - p.p))));
    const points = range(1, maxK).map((k) => ({ x: k, y: (1 - p.p) ** (k - 1) * p.p, label: String(k) }));
    return { points, summary: { mean: fmt(1 / p.p), variance: fmt((1 - p.p) / p.p ** 2), support: "1, 2, 3, ..." }, focus: `Waiting time shrinks as p rises; E[X] = ${fmt(1 / p.p)} trials.` };
  }),
  discrete("negative-binomial", "Negative Binomial Distribution", "P(X=k)=C(k-1,r-1)p^r(1-p)^(k-r)", "Trials until r successes.", [
    param("r", "Required successes r", 1, 10, 1, 4, "How many successes must occur."),
    param("p", "Success probability p", 0.05, 0.95, 0.01, 0.35, "Chance of success on each trial."),
  ], (p) => {
    const r = Math.round(p.r);
    const points: DistributionPoint[] = [];
    let cumulative = 0;
    for (let k = r; k <= 220; k += 1) {
      const y = combination(k - 1, r - 1) * p.p ** r * (1 - p.p) ** (k - r);
      points.push({ x: k, y, label: String(k) });
      cumulative += y;
      if (cumulative > 0.999 && k >= r + 18) break;
    }
    return { points, summary: { mean: fmt(r / p.p), variance: fmt((r * (1 - p.p)) / p.p ** 2), support: `${r}, ${r + 1}, ...` }, focus: `This models repeated attempts until success number ${r}.` };
  }),
  discrete("hypergeometric", "Hypergeometric Distribution", "P(X=k)=C(K,k)C(N-K,n-k)/C(N,n)", "Successes when sampling without replacement.", [
    param("N", "Population N", 30, 100, 1, 50, "Total population size."),
    param("K", "Successes in population K", 1, 30, 1, 14, "Number of success items in the population."),
    param("n", "Draws n", 1, 30, 1, 10, "Sample size without replacement."),
  ], (p) => {
    const N = Math.round(p.N);
    const K = Math.min(N, Math.round(p.K));
    const draws = Math.min(N, Math.round(p.n));
    const minK = Math.max(0, draws - (N - K));
    const maxK = Math.min(K, draws);
    const points = range(minK, maxK).map((k) => ({ x: k, y: combination(K, k) * combination(N - K, draws - k) / combination(N, draws), label: String(k) }));
    return { points, summary: { mean: fmt(draws * K / N), variance: fmt(draws * (K / N) * (1 - K / N) * ((N - draws) / (N - 1))), support: `${minK}, ..., ${maxK}` }, focus: "Without replacement, each draw changes the next probability." };
  }),
  discrete("poisson", "Poisson Distribution", "P(X=k)=e^(-lambda)lambda^k/k!, k=0,1,2,...", "Counts events in a fixed interval.", [
    param("lambda", "Rate lambda", 0.1, 18, 0.1, 4, "Average event count per interval."),
  ], (p) => {
    const maxK = Math.max(12, Math.ceil(p.lambda + 5 * Math.sqrt(p.lambda)));
    const points = range(0, maxK).map((k) => ({ x: k, y: Math.exp(-p.lambda) * p.lambda ** k / factorial(k), label: String(k) }));
    return { points, summary: { mean: fmt(p.lambda), variance: fmt(p.lambda), support: "0, 1, 2, ..." }, focus: `Poisson is discrete count mass at integer k only; for large lambda its envelope may look bell-shaped, but it is not a continuous normal curve.` };
  }),
  discrete("poisson-binomial", "Poisson-Binomial Distribution", "X=sum independent Bernoulli(p_i)", "Success counts with unequal trial probabilities.", [
    param("p1", "p1", 0.01, 0.99, 0.01, 0.2, "Trial 1 success chance."),
    param("p2", "p2", 0.01, 0.99, 0.01, 0.45, "Trial 2 success chance."),
    param("p3", "p3", 0.01, 0.99, 0.01, 0.7, "Trial 3 success chance."),
  ], (p) => {
    const probs = [p.p1, p.p2, p.p3];
    let pmf = [1];
    for (const prob of probs) pmf = [...pmf.map((v) => v * (1 - prob)), 0].map((v, i) => v + (i > 0 ? pmf[i - 1] * prob : 0));
    const mean = probs.reduce((sum, value) => sum + value, 0);
    const variance = probs.reduce((sum, value) => sum + value * (1 - value), 0);
    return { points: pmf.map((y, x) => ({ x, y, label: String(x) })), summary: { mean: fmt(mean), variance: fmt(variance), support: "0, 1, 2, 3" }, focus: "Unlike binomial, each trial can have a different success probability." };
  }),
  discrete("beta-binomial", "Beta-Binomial Distribution", "P(X=k)=C(n,k)B(k+a,n-k+b)/B(a,b)", "Binomial counts when p itself varies.", [
    param("n", "Trials n", 1, 30, 1, 12, "Number of trials."),
    param("alpha", "Alpha", 0.3, 8, 0.1, 2, "Prior success strength."),
    param("beta", "Beta", 0.3, 8, 0.1, 4, "Prior failure strength."),
  ], (p) => {
    const n = Math.round(p.n);
    const points = range(0, n).map((k) => ({ x: k, y: combination(n, k) * betaFn(k + p.alpha, n - k + p.beta) / betaFn(p.alpha, p.beta), label: String(k) }));
    const mean = n * p.alpha / (p.alpha + p.beta);
    const variance = n * p.alpha * p.beta * (p.alpha + p.beta + n) / ((p.alpha + p.beta) ** 2 * (p.alpha + p.beta + 1));
    return { points, summary: { mean: fmt(mean), variance: fmt(variance), support: `0, 1, ..., ${n}` }, focus: "Extra spread appears because the success probability varies between experiments." };
  }),
  discrete("zipf", "Zipf Distribution", "P(X=k) proportional to 1/k^s", "Rank-frequency data such as words and city sizes.", [
    param("s", "Exponent s", 0.6, 3, 0.05, 1.2, "How fast probability decays with rank."),
    param("n", "Ranks shown", 5, 40, 1, 20, "Finite number of displayed ranks."),
  ], (p) => {
    const n = Math.round(p.n);
    const weights = range(1, n).map((k) => 1 / k ** p.s);
    const total = weights.reduce((sum, value) => sum + value, 0);
    const probabilities = weights.map((value) => value / total);
    const mean = probabilities.reduce((sum, probability, index) => sum + (index + 1) * probability, 0);
    const variance = probabilities.reduce((sum, probability, index) => sum + (index + 1 - mean) ** 2 * probability, 0);
    return { points: probabilities.map((value, i) => ({ x: i + 1, y: value, label: String(i + 1) })), summary: { mean: fmt(mean), variance: fmt(variance), support: `1, 2, ..., ${n}` }, focus: "A few small ranks dominate when s is large." };
  }),
  continuous("continuous-uniform", "Continuous Uniform Distribution", "f(x)=1/(b-a)", "Equal density across an interval.", [
    param("a", "Left endpoint a", -5, 4, 0.1, 0, "Start of the interval."),
    param("width", "Width b-a", 0.5, 10, 0.1, 5, "Positive interval width."),
  ], (p) => {
    const b = p.a + p.width;
    return continuousPoints(p.a - p.width * 0.2, b + p.width * 0.2, (x) => (x >= p.a && x <= b ? 1 / p.width : 0), {
      mean: fmt((p.a + b) / 2),
      variance: fmt(p.width ** 2 / 12),
      support: `[${fmt(p.a)}, ${fmt(b)}]`,
    }, "Every equal-length subinterval has the same probability.");
  }),
  continuous("normal", "Normal Distribution", "f(x)=1/(sigma sqrt(2pi)) e^(-0.5((x-mu)/sigma)^2)", "Symmetric measurement and noise model.", [
    param("mu", "Mean mu", -6, 6, 0.1, 0, "Center of the bell curve."),
    param("sigma", "Standard deviation sigma", 0.2, 5, 0.1, 1, "Spread of the bell curve."),
  ], (p) => continuousPoints(p.mu - 4 * p.sigma, p.mu + 4 * p.sigma, (x) => normalPdf(x, p.mu, p.sigma), { mean: fmt(p.mu), variance: fmt(p.sigma ** 2), support: "all real numbers" }, "About 68% of mass lies within one sigma of the mean.")),
  continuous("exponential", "Exponential Distribution", "f(x)=lambda e^(-lambda x)", "Waiting time until the next event.", [
    param("lambda", "Rate lambda", 0.1, 5, 0.1, 1.2, "Average event rate."),
  ], (p) => continuousPoints(0, Math.max(6 / p.lambda, 4), (x) => p.lambda * Math.exp(-p.lambda * x), { mean: fmt(1 / p.lambda), variance: fmt(1 / p.lambda ** 2), support: "x >= 0" }, "It is memoryless: the future wait does not depend on the time already waited.")),
  continuous("gamma", "Gamma Distribution", "f(x)=beta^alpha x^(alpha-1)e^(-beta x)/Gamma(alpha)", "Waiting time for accumulated events.", [
    param("alpha", "Shape alpha", 0.5, 10, 0.1, 3, "Controls rise and skew."),
    param("beta", "Rate beta", 0.2, 5, 0.1, 1, "Controls scale through rate."),
  ], (p) => continuousPoints(0, Math.max(12, (p.alpha / p.beta) * 4), (x) => p.beta ** p.alpha * x ** (p.alpha - 1) * Math.exp(-p.beta * x) / gamma(p.alpha), { mean: fmt(p.alpha / p.beta), variance: fmt(p.alpha / p.beta ** 2), support: "x >= 0" }, "Exponential is Gamma with alpha = 1.")),
  continuous("beta", "Beta Distribution", "f(x)=x^(alpha-1)(1-x)^(beta-1)/B(alpha,beta)", "Probabilities and proportions on 0 to 1.", [
    param("alpha", "Alpha", 0.3, 8, 0.1, 2, "Success-side shape."),
    param("beta", "Beta", 0.3, 8, 0.1, 5, "Failure-side shape."),
  ], (p) => continuousPoints(0.001, 0.999, (x) => x ** (p.alpha - 1) * (1 - x) ** (p.beta - 1) / betaFn(p.alpha, p.beta), { mean: fmt(p.alpha / (p.alpha + p.beta)), variance: fmt((p.alpha * p.beta) / ((p.alpha + p.beta) ** 2 * (p.alpha + p.beta + 1))), support: "0 < x < 1" }, "Beta is the workhorse distribution for uncertain probabilities.")),
  continuous("chi-square", "Chi-Square Distribution", "f(x)=x^(k/2-1)e^(-x/2)/(2^(k/2)Gamma(k/2))", "Squared normal variation and count-table tests.", [
    param("k", "Degrees of freedom k", 1, 30, 1, 5, "Number of independent squared standard normals."),
  ], (p) => continuousPoints(0.001, Math.max(20, p.k + 5 * Math.sqrt(2 * p.k)), (x) => x ** (p.k / 2 - 1) * Math.exp(-x / 2) / (2 ** (p.k / 2) * gamma(p.k / 2)), { mean: fmt(p.k), variance: fmt(2 * p.k), support: "x >= 0" }, "It appears in variance inference and chi-square tests.")),
  continuous("student-t", "Student t Distribution", "T=Z/sqrt(V/nu), V~chi-square_nu", "Mean inference when sigma is unknown.", [
    param("nu", "Degrees of freedom nu", 1, 40, 1, 8, "Controls tail heaviness."),
  ], (p) => continuousPoints(-6, 6, (x) => gamma((p.nu + 1) / 2) / (Math.sqrt(p.nu * Math.PI) * gamma(p.nu / 2)) * (1 + x ** 2 / p.nu) ** (-(p.nu + 1) / 2), { mean: p.nu > 1 ? "0" : "undefined", variance: p.nu > 2 ? fmt(p.nu / (p.nu - 2)) : "undefined", support: "all real numbers" }, "Small degrees of freedom produce heavier tails than normal.")),
  continuous("f", "F Distribution", "F=(U/d1)/(V/d2), U~chi-square_d1, V~chi-square_d2", "Ratio of variances and ANOVA tests.", [
    param("d1", "Numerator df d1", 1, 30, 1, 5, "Degrees of freedom in numerator."),
    param("d2", "Denominator df d2", 1, 40, 1, 12, "Degrees of freedom in denominator."),
  ], (p) => continuousPoints(0.001, 6, (x) => Math.sqrt(((p.d1 * x) ** p.d1 * p.d2 ** p.d2) / ((p.d1 * x + p.d2) ** (p.d1 + p.d2))) / (x * betaFn(p.d1 / 2, p.d2 / 2)), { mean: p.d2 > 2 ? fmt(p.d2 / (p.d2 - 2)) : "undefined", variance: p.d2 > 4 ? fmt((2 * p.d2 ** 2 * (p.d1 + p.d2 - 2)) / (p.d1 * (p.d2 - 2) ** 2 * (p.d2 - 4))) : "undefined", support: "x > 0" }, "Large F values mark unusually large between-group variation.")),
  continuous("lognormal", "Lognormal Distribution", "Y=e^X, X~Normal(mu,sigma^2)", "Positive skewed quantities made by multiplicative effects.", [
    param("mu", "Log mean mu", -1, 2, 0.1, 0, "Mean of the underlying normal."),
    param("sigma", "Log sigma", 0.2, 2, 0.1, 0.6, "Spread of the underlying normal."),
  ], (p) => continuousPoints(0.001, Math.exp(p.mu + 4 * p.sigma), (x) => Math.exp(-((Math.log(x) - p.mu) ** 2) / (2 * p.sigma ** 2)) / (x * p.sigma * Math.sqrt(2 * Math.PI)), { mean: fmt(Math.exp(p.mu + p.sigma ** 2 / 2)), variance: fmt((Math.exp(p.sigma ** 2) - 1) * Math.exp(2 * p.mu + p.sigma ** 2)), support: "x > 0" }, "It models positive values with a long right tail.")),
  continuous("weibull", "Weibull Distribution", "f(x)=k/lambda (x/lambda)^(k-1)e^(-(x/lambda)^k)", "Lifetime and reliability modelling.", [
    param("k", "Shape k", 0.5, 5, 0.1, 1.6, "Failure-rate shape."),
    param("lambda", "Scale lambda", 0.5, 8, 0.1, 3, "Typical lifetime scale."),
  ], (p) => continuousPoints(0.001, p.lambda * 4, (x) => (p.k / p.lambda) * (x / p.lambda) ** (p.k - 1) * Math.exp(-((x / p.lambda) ** p.k)), { mean: fmt(p.lambda * gamma(1 + 1 / p.k)), variance: fmt(p.lambda ** 2 * (gamma(1 + 2 / p.k) - gamma(1 + 1 / p.k) ** 2)), support: "x >= 0" }, "k < 1 means decreasing hazard; k > 1 means increasing hazard.")),
  continuous("cauchy", "Cauchy Distribution", "f(x)=1/(pi gamma[1+((x-x0)/gamma)^2])", "Heavy-tailed ratio and resonance model.", [
    param("x0", "Location x0", -3, 3, 0.1, 0, "Center location."),
    param("gamma", "Scale gamma", 0.2, 3, 0.1, 1, "Half-width scale."),
  ], (p) => continuousPoints(p.x0 - 8 * p.gamma, p.x0 + 8 * p.gamma, (x) => 1 / (Math.PI * p.gamma * (1 + ((x - p.x0) / p.gamma) ** 2)), { mean: "undefined", variance: "undefined", support: "all real numbers" }, "The mean and variance do not exist because the tails are too heavy.")),
  continuous("laplace", "Laplace Distribution", "f(x)=exp(-|x-mu|/b)/(2b)", "Sharp peak with exponential tails.", [
    param("mu", "Location mu", -4, 4, 0.1, 0, "Center of symmetry."),
    param("b", "Scale b", 0.2, 4, 0.1, 1, "Tail scale."),
  ], (p) => continuousPoints(p.mu - 7 * p.b, p.mu + 7 * p.b, (x) => Math.exp(-Math.abs(x - p.mu) / p.b) / (2 * p.b), { mean: fmt(p.mu), variance: fmt(2 * p.b ** 2), support: "all real numbers" }, "Useful for absolute-error noise and robust models.")),
  continuous("logistic", "Logistic Distribution", "f(x)=e^(-(x-mu)/s)/(s(1+e^(-(x-mu)/s))^2)", "Smooth S-curve derivative model.", [
    param("mu", "Location mu", -4, 4, 0.1, 0, "Center of the curve."),
    param("s", "Scale s", 0.2, 4, 0.1, 1, "Controls spread."),
  ], (p) => continuousPoints(p.mu - 8 * p.s, p.mu + 8 * p.s, (x) => {
    const e = Math.exp(-(x - p.mu) / p.s);
    return e / (p.s * (1 + e) ** 2);
  }, { mean: fmt(p.mu), variance: fmt((Math.PI ** 2 * p.s ** 2) / 3), support: "all real numbers" }, "Its CDF is the sigmoid curve used in logistic models.")),
  continuous("pareto", "Pareto Distribution", "f(x)=alpha xm^alpha/x^(alpha+1)", "Heavy-tailed wealth, size, and risk models.", [
    param("alpha", "Shape alpha", 0.5, 6, 0.1, 2.5, "Tail heaviness."),
    param("xm", "Minimum xm", 0.5, 5, 0.1, 1, "Smallest possible value."),
  ], (p) => continuousPoints(p.xm, p.xm * 8, (x) => p.alpha * p.xm ** p.alpha / x ** (p.alpha + 1), { mean: p.alpha > 1 ? fmt((p.alpha * p.xm) / (p.alpha - 1)) : "undefined", variance: p.alpha > 2 ? fmt((p.alpha * p.xm ** 2) / ((p.alpha - 1) ** 2 * (p.alpha - 2))) : "undefined", support: `x >= ${fmt(p.xm)}` }, "Small alpha means very heavy tails.")),
  continuous("rayleigh", "Rayleigh Distribution", "f(x)=x/sigma^2 e^(-x^2/(2sigma^2))", "Magnitude from two independent normal components.", [
    param("sigma", "Scale sigma", 0.2, 5, 0.1, 1.5, "Component spread."),
  ], (p) => continuousPoints(0, p.sigma * 6, (x) => x / p.sigma ** 2 * Math.exp(-(x ** 2) / (2 * p.sigma ** 2)), { mean: fmt(p.sigma * Math.sqrt(Math.PI / 2)), variance: fmt(((4 - Math.PI) / 2) * p.sigma ** 2), support: "x >= 0" }, "It appears in radial error, wind speed, and signal magnitude models.")),
  continuous("triangular", "Triangular Distribution", "piecewise linear on [a,b] with mode c", "Simple bounded model with a most likely value.", [
    param("a", "Left a", -6, 0, 0.1, -3, "Minimum value."),
    param("b", "Right b", 1, 8, 0.1, 5, "Maximum value."),
    param("cRatio", "Mode position", 0.05, 0.95, 0.01, 0.45, "Mode as a fraction between a and b."),
  ], (p) => {
    const a = Math.min(p.a, p.b - 0.5);
    const b = Math.max(p.b, a + 0.5);
    const c = a + p.cRatio * (b - a);
    return continuousPoints(a, b, (x) => x <= c ? (2 * (x - a)) / ((b - a) * (c - a)) : (2 * (b - x)) / ((b - a) * (b - c)), { mean: fmt((a + b + c) / 3), variance: fmt((a ** 2 + b ** 2 + c ** 2 - a * b - a * c - b * c) / 18), support: `[${fmt(a)}, ${fmt(b)}]` }, "Good for quick estimates with minimum, maximum, and most likely values.");
  }),
];

export function getDistribution(id?: string) {
  return distributionSpecs.find((item) => item.id === id) ?? distributionSpecs[0];
}

function discrete(id: string, name: string, formula: string, shortUse: string, parameters: DistributionParameter[], calculate: DistributionSpec["calculate"]): DistributionSpec {
  return spec(id, name, "discrete", "Foundational discrete", formula, shortUse, parameters, calculate);
}

function continuous(id: string, name: string, formula: string, shortUse: string, parameters: DistributionParameter[], calculate: DistributionSpec["calculate"]): DistributionSpec {
  return spec(id, name, "continuous", "Foundational continuous", formula, shortUse, parameters, calculate);
}

function spec(id: string, name: string, kind: DistributionKind, family: DistributionSpec["family"], formula: string, shortUse: string, parameters: DistributionParameter[], calculate: DistributionSpec["calculate"]): DistributionSpec {
  return {
    id,
    name,
    kind,
    phase: 1,
    family,
    route: `/probability-statistics/distributions/${id}`,
    shortUse,
    formula,
    parameters,
    calculate,
    theory: [
      `${name} describes how probability mass or density is arranged across its support.`,
      "The parameters control location, spread, skew, tail weight, or trial structure.",
      "Use the chart together with mean, variance, and support; the shape alone is not the full model.",
    ],
    examples: [
      shortUse,
      kind === "discrete" ? "Counts, categories, trials, or ranked outcomes." : "Measurements, waiting times, proportions, or positive lifetimes.",
    ],
  };
}

function param(id: string, label: string, min: number, max: number, step: number, defaultValue: number, description: string): DistributionParameter {
  return { id, label, min, max, step, defaultValue, description };
}

function continuousPoints(min: number, max: number, pdf: (x: number) => number, summary: DistributionSummary, focus: string) {
  const steps = 96;
  const points = Array.from({ length: steps + 1 }, (_, index) => {
    const x = min + (index / steps) * (max - min || 1);
    const y = Math.max(0, pdf(x));
    return { x, y: Number.isFinite(y) ? y : 0, label: fmt(x) };
  });
  return { points, summary, focus };
}

function range(start: number, end: number) {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
}

function factorial(n: number): number {
  const rounded = Math.max(0, Math.round(n));
  const cached = factorialCache.get(rounded);
  if (cached !== undefined) return cached;
  let value = factorialCache.get(factorialCache.size - 1) ?? 1;
  for (let index = factorialCache.size; index <= rounded; index += 1) {
    value *= index;
    factorialCache.set(index, value);
  }
  return value;
}

function combination(n: number, k: number) {
  if (k < 0 || k > n) return 0;
  const r = Math.min(k, n - k);
  let value = 1;
  for (let i = 1; i <= r; i += 1) value = (value * (n - r + i)) / i;
  return value;
}

function gamma(z: number): number {
  const coefficients = [676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -0.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  let x = 0.9999999999998099;
  const adjusted = z - 1;
  for (let i = 0; i < coefficients.length; i += 1) x += coefficients[i] / (adjusted + i + 1);
  const t = adjusted + coefficients.length - 0.5;
  return Math.sqrt(2 * Math.PI) * t ** (adjusted + 0.5) * Math.exp(-t) * x;
}

function betaFn(alpha: number, beta: number) {
  return gamma(alpha) * gamma(beta) / gamma(alpha + beta);
}

function normalPdf(x: number, mean: number, sigma: number) {
  return Math.exp(-0.5 * ((x - mean) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function fmt(value: number) {
  return Number.isFinite(value) ? Number(value.toFixed(3)).toString() : "undefined";
}

function pct(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}
