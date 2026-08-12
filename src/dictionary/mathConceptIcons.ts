import type { VisualDictionaryCategory, VisualDictionaryKind, VisualDictionaryTerm } from "../data/mathVisualDictionary";

const iconRoot = "/assets/math-icons";

export const mathConceptIcons = {
  dictionary: `${iconRoot}/30-math-dictionary.png`,
  Algebra: `${iconRoot}/10-algebra.png`,
  Arithmetic: `${iconRoot}/11-arithmetic.png`,
  Calculus: `${iconRoot}/12-calculus.png`,
  Geometry: `${iconRoot}/02-geometry.png`,
  "Linear Algebra": `${iconRoot}/20-matrices.png`,
  Logic: `${iconRoot}/24-sets-and-logic.png`,
  "Number Theory": `${iconRoot}/18-number-theory.png`,
  Probability: `${iconRoot}/15-probability.png`,
  "Set Theory": `${iconRoot}/24-sets-and-logic.png`,
  Statistics: `${iconRoot}/14-statistics.png`,
  Trigonometry: `${iconRoot}/13-trigonometry.png`,
} satisfies Record<VisualDictionaryCategory | "dictionary", string>;

const kindIcons: Partial<Record<VisualDictionaryKind, string>> = {
  fraction: `${iconRoot}/19-fractions.png`,
  matrix: `${iconRoot}/20-matrices.png`,
  vector: `${iconRoot}/21-vectors.png`,
  solid: `${iconRoot}/06-shapes-explorer.png`,
  set: `${iconRoot}/24-sets-and-logic.png`,
  logic: `${iconRoot}/24-sets-and-logic.png`,
};

const specialistIcons: Array<[RegExp, string]> = [
  [/differential equation|ordinary differential|partial differential/i, `${iconRoot}/23-differential-equations.png`],
  [/complex number|argand|complex conjugate|imaginary/i, `${iconRoot}/22-complex-numbers.png`],
  [/regression|residual|least squares|best.fit/i, `${iconRoot}/17-regression.png`],
  [/data analysis|data distribution|data set|scatter plot|histogram|box plot/i, `${iconRoot}/16-data-analysis.png`],
  [/transformation|translation|rotation|reflection|dilation|shear/i, `${iconRoot}/27-transformations.png`],
  [/measurement|measure|length|width|height|area|volume|perimeter|surface area/i, `${iconRoot}/26-measurement.png`],
  [/function|domain|codomain|range of function|mapping/i, `${iconRoot}/25-functions.png`],
  [/equation|solve|solution set|substitution|elimination/i, `${iconRoot}/09-equation-solver.png`],
  [/formula|identity|notation|symbol/i, `${iconRoot}/29-formula-library.png`],
  [/theorem|proof|axiom|postulate|contradiction/i, `${iconRoot}/28-proof-studio.png`],
  [/matrix|determinant|eigenvalue|eigenvector|cofactor|row space|column space/i, `${iconRoot}/20-matrices.png`],
  [/vector|magnitude|dot product|cross product|projection/i, `${iconRoot}/21-vectors.png`],
  [/fraction|numerator|denominator|rational number|ratio|proportion/i, `${iconRoot}/19-fractions.png`],
];

export function iconForDictionaryTerm(entry: VisualDictionaryTerm) {
  const searchable = [entry.term, entry.description, entry.explanation, entry.representation, ...entry.keywords].filter(Boolean).join(" ");
  const specialist = specialistIcons.find(([pattern]) => pattern.test(searchable));
  return specialist?.[1] ?? kindIcons[entry.kind] ?? mathConceptIcons[entry.category];
}
