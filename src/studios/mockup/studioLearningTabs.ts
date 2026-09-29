import type { StudioTheoryCopy } from "./studioTheoryContent";

export type FormulaCard = { title: string; expression: string; context: string; result: string };

// These topics describe their main relationships in prose in the worked examples.
// Supply explicit notation so the Formula tab never becomes a second prose-only theory tab.
const formulaOverrides: Record<string, string[]> = {
  "trigonometry/waves": ["fbeat = |f₁ − f₂|", "y = 2A sin(kx) cos(ωt)", "fₙ = n f₁"],
  "linear-algebra/vector-spaces": ["span(v₁,v₂) = {c₁v₁ + c₂v₂}", "rank([v₁ v₂]) = number of independent columns", "v = c₁b₁ + c₂b₂"],
  "linear-algebra/playground": ["AB ≠ BA in general", "det(A) < 0 reverses orientation", "S² = S · S"],
  "modelling/comparison": ["RMSE = √(Σ(yᵢ − ŷᵢ)² / n)", "residualᵢ = yᵢ − ŷᵢ", "AIC = 2k − 2 ln(L̂)"],
  "discrete/graphs": ["cost(path) = Σ edge weights", "|E| = |V| − 1 for a tree", "χ(K₃) = 3"],
  "discrete/algorithms": ["binary-search steps ≈ ⌈log₂ n⌉", "gcd(a,b) = gcd(b, a mod b)", "BFS distance = minimum edge count from source"],
  "statistics/home": ["mean = Σxᵢ / n", "sample proportion p̂ = successes / trials", "SE(p̂) ≈ √(p̂(1−p̂)/n)"],
  "statistics/data-explorer": ["cov(x,y) = Σ(xᵢ−x̄)(yᵢ−ȳ)/(n−1)", "missing rate = missing observations / all observations", "slope b = cov(x,y)/var(x)"],
  "statistics/experiments": ["E[heads] = n/2 for a fair coin", "P(A) = favorable outcomes / equally likely outcomes", "P(D|+) = P(+|D)P(D)/P(+)"],
  "statistics/anova": ["F = MSbetween / MSwithin", "MSbetween = SSbetween / (k−1)", "MSwithin = SSwithin / (N−k)"],
  "algebraic-structures/cayley-tables": ["Tᵢⱼ = aᵢ ∘ aⱼ", "(a∘b)∘c = a∘(b∘c)", "e∘a = a∘e = a"],
  "algebraic-structures/semigroups-monoids": ["(a∘b)∘c = a∘(b∘c)", "e∘a = a∘e = a", "max(0,a) = a for a ≥ 0"],
  "algebraic-structures/boolean-algebra": ["A∧(B∨C) = (A∧B)∨(A∧C)", "¬(A∧B) = ¬A∨¬B", "A∨(A∧B) = A"],
  "statistics-phase/module": ["E[X] = np for X∼Binomial(n,p)", "E[T] = 1/λ for T∼Exponential(λ)", "SE(p̂) ≈ √(p̂(1−p̂)/n)"],
};

const preciseFormulaOverrides: Record<string, string> = {
  "geometry/home/0": "SSS: (a,b,c) fixed ⇒ all three angles fixed",
  "geometry/triangles/1": "Pnew = kPold; Anew = k²Aold (k = 3)",
  "geometry/circles/2": "radius · tangent = (3,4) · (−4,3) = 0",
  "geometry/transformations/0": "(x′,y′) = (x+a,y+b) = (2−5,3+4) = (−3,7)",
  "geometry/measurement/1": "actual distance = map distance × scale = 3.2 × 5 = 16 km",
  "geometry/ar/0": "estimated length = 1 m × (300 px / 200 px) = 1.5 m",
  "trigonometry/ar/2": "frequency = 1 / period = 1 / 2 s = 0.5 Hz",
  "linear-algebra/least-squares/1": "constant least-squares fit = (4+5+6)/3 = 5",
  "linear-algebra/playground/0": "S·R₉₀(1,0) = (0,1), but R₉₀·S(1,0) = (0,2)",
  "linear-algebra/principal-axes/1": "T = ½(I₁ω₁² + I₂ω₂²); no ω₁ω₂ term in principal axes",
  "modelling/home/2": "residual = observed − predicted = (−1,0,2)",
  "modelling/optimization/1": "route cost = 5×₹2 + 3×₹4 = ₹22",
  "modelling/networks/1": "h(n) = |Δx| + |Δy| ≤ cheapest remaining route cost",
  "modelling/periodic/1": "H(t) = 12 + 3 sin(2πt/365) hours",
  "modelling/numerical/0": "π ≈ 4 × (points inside quarter circle / total points)",
  "discrete/home/2": "tree edge count = |V| − 1 = 7 − 1 = 6",
  "discrete/number-patterns/2": "Pascal row entry C(4,k) = 4!/[k!(4−k)!]",
  "discrete/logic/1": "¬(rain ∧ cold) = ¬rain ∨ ¬cold",
  "discrete/cryptography/2": "shared key = g^(ab) mod p = 5^(2·3) mod 23 = 8",
  "statistics/descriptive/0": "median = 25; mean = (20+22+25+28+100)/5 = 39",
  "statistics/clt/2": "SE(sample mean) = σ/√n; standardized means approach N(0,1)",
  "statistics/hypothesis/2": "signal-to-noise = effect / SE; SE shrinks as sample size grows",
  "algebra/proof/2": "2 ∈ primes and 2 is even ⇒ ‘all primes are odd’ is false",
  "algebraic-structures/home/2": "A ∪ ∅ = A; A ∪ A = A",
  "algebraic-structures/structure-test/2": "a·(1/a) = 1; ab = ba for nonzero real numbers",
  "algebraic-structures/posets-lattices/2": "A ≺ C and B ≺ C, while A ∥ B (incomparable)",
  "number-systems/home/1": "3/4 = 0.75",
  "number-systems/rational/2": "distance = (3/5) × 20 km = 12 km",
  "number-systems/irrational/1": "C = 2πr = 2π when r = 1",
  "number-systems/concepts/0": "midpoint = (1/3 + 1/2)/2 = 5/12",
  "calculus/centroid/1": "G = (A+B+C)/3 = ((0,0)+(6,0)+(0,3))/3 = (2,1)",
  "advanced-concepts/famous-problems/1": "χ(G) ≤ 4 for every planar map adjacency graph G",
  "statistics-extended/design-of-experiments/0": "paired mean difference = (2+3+1)/3 = 2",
  "statistics-extended/time-series/0": "MA₃ = (100+110+120)/3 = 110",
  "statistics-extended/nonparametric/2": "number of runs in H,H,H,T,T,T = 2",
  "statistics-extended/multivariate-analysis/2": "Mahalanobis distance² = ΔᵀΣ⁻¹Δ",
  "statistics-extended/official-statistics/1": "crude birth rate = (1200/100000)×1000 = 12 per 1000",
  "statistics-extended/actuarial-reliability/1": "premium = expected claims + expenses + loading = ₹1000",
  "statistics-extended/statistical-computing/0": "bootstrap mean = (2+2+6)/3 = 10/3",
  "statistics-extended/school-statistics/1": "represented books = 6 icons × 5 books/icon = 30",
  "statistics-phase/inference/2": "SE(p̂) ≈ √[p(1−p)/n]; larger n makes 0.6−0.5 easier to detect",
  "statistics-phase/bayesian/2": "Beta(2,2) + 3 heads + 1 tail ⇒ Beta(5,3); posterior mean = 5/8",
};

const hasRelation = (text: string) => /[=≈≠∝≤≥<>→⇒+−×÷√∫∑^²³%°∈∪∥∧∨¬π]/.test(text);
const firstRelation = (source: string) => source.split(";").map((part) => part.trim()).find(hasRelation);

export function studioFormulaCards(studioId: string, pageId: string, theory: StudioTheoryCopy): FormulaCard[] {
  const overrides = formulaOverrides[`${studioId}/${pageId}`];
  return theory.examples.map((example, index) => ({
    title: example.title,
    expression: preciseFormulaOverrides[`${studioId}/${pageId}/${index}`] ?? overrides?.[index] ?? firstRelation(example.result) ?? firstRelation(example.setup) ?? example.result,
    context: example.setup,
    result: example.result,
  }));
}
