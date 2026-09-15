/** Scored-lab bar. Each dimension is 0–100. Studio score is the mean of scored labs. */

export type LabScore = {
  id: string;
  tools: number;
  ui: number;
  ux: number;
  engine: number;
};

export type StudioScore = {
  id: string;
  name: string;
  labs: LabScore[];
};

function lab(id: string, tools: number, ui: number, ux: number, engine: number): LabScore {
  return { id, tools, ui, ux, engine };
}

export function labMean(item: LabScore) {
  return Math.round(((item.tools + item.ui + item.ux + item.engine) / 4) * 10) / 10;
}

export function studioMean(studio: StudioScore) {
  const values = studio.labs.map(labMean);
  return Math.round((values.reduce((sum, n) => sum + n, 0) / values.length) * 10) / 10;
}

export const scoredStudios: StudioScore[] = [
  {
    id: "geometry",
    name: "Geometry",
    labs: [
      lab("construction", 92, 92, 90, 92),
      lab("triangles", 92, 92, 90, 90),
      lab("circles", 90, 92, 90, 90),
      lab("polygons", 90, 92, 90, 90),
      lab("transformations", 92, 92, 90, 90),
      lab("coordinate", 92, 92, 90, 90),
      lab("measurement", 90, 92, 90, 90),
      lab("proofs", 90, 90, 90, 90),
    ],
  },
  {
    id: "trigonometry",
    name: "Trigonometry",
    labs: [
      lab("unit-circle", 94, 92, 92, 92),
      lab("right-triangle", 92, 92, 90, 90),
      lab("graphs", 92, 94, 92, 92),
      lab("identities", 90, 92, 90, 90),
      lab("inverse", 90, 92, 90, 90),
      lab("oblique", 90, 90, 90, 90),
      lab("waves", 90, 92, 90, 90),
      lab("applications", 90, 90, 90, 90),
    ],
  },
  {
    id: "algebra",
    name: "Algebra",
    labs: [
      lab("expressions", 90, 92, 92, 90),
      lab("equations", 92, 92, 92, 92),
      lab("functions", 92, 94, 92, 92),
      lab("polynomials", 90, 92, 90, 90),
      lab("systems", 90, 92, 90, 90),
      lab("exponents-logs", 90, 92, 90, 90),
      lab("sequences", 90, 90, 90, 90),
      lab("proof", 90, 90, 90, 90),
      lab("cas", 90, 90, 90, 90),
    ],
  },
  {
    id: "algebraic-structures",
    name: "Algebraic Structures",
    labs: [
      lab("structure-test", 92, 92, 90, 92),
      lab("cayley-tables", 92, 92, 90, 92),
      lab("semigroups-monoids", 90, 90, 90, 90),
      lab("posets-lattices", 92, 92, 90, 92),
      lab("boolean-algebra", 90, 90, 90, 90),
    ],
  },
  {
    id: "calculus",
    name: "Calculus",
    labs: [
      lab("limits", 92, 92, 92, 92),
      lab("derivatives", 92, 92, 90, 90),
      lab("integration", 92, 92, 92, 92),
      lab("techniques", 90, 92, 90, 90),
      lab("series", 90, 92, 90, 90),
      lab("multivariable", 90, 90, 90, 90),
    ],
  },
  {
    id: "number-systems",
    name: "Number Systems",
    labs: [
      lab("rational", 90, 92, 92, 92),
      lab("irrational", 90, 92, 90, 92),
      lab("real-line", 92, 92, 90, 90),
      lab("hierarchy", 90, 92, 90, 90),
      lab("concepts", 90, 90, 90, 90),
      lab("practice", 90, 90, 90, 92),
    ],
  },
  {
    id: "linear-algebra",
    name: "Linear Algebra",
    labs: [
      lab("vectors", 92, 92, 90, 90),
      lab("matrices", 90, 92, 90, 90),
      lab("row-reduction", 90, 92, 90, 90),
      lab("linear-transforms", 92, 92, 90, 90),
      lab("determinants", 90, 92, 90, 90),
      lab("vector-spaces", 92, 92, 90, 92),
      lab("eigenvectors", 92, 92, 90, 90),
      lab("orthogonality", 92, 92, 90, 90),
      lab("least-squares", 92, 92, 90, 92),
      lab("playground", 90, 92, 90, 90),
    ],
  },
  {
    id: "complex-numbers",
    name: "Complex Numbers",
    labs: [
      lab("argand-plane", 92, 92, 90, 90),
      lab("arithmetic", 92, 92, 90, 90),
      lab("polar-forms", 92, 92, 90, 92),
      lab("rotation", 90, 92, 90, 90),
      lab("roots", 90, 92, 90, 90),
      lab("euler", 90, 92, 90, 90),
      lab("loci", 92, 92, 90, 90),
      lab("fractals", 92, 92, 90, 92),
      lab("waves-circuits", 90, 90, 90, 90),
    ],
  },
  {
    id: "modelling",
    name: "Modelling",
    labs: [
      lab("motion", 92, 92, 90, 92),
      lab("population", 90, 92, 90, 92),
      lab("epidemics", 92, 92, 90, 92),
      lab("finance", 90, 90, 90, 90),
      lab("optimization", 90, 90, 90, 90),
      lab("networks", 90, 90, 90, 92),
      lab("regression", 90, 92, 90, 90),
      lab("periodic", 90, 92, 90, 90),
      lab("numerical", 90, 90, 90, 90),
      lab("comparison", 92, 92, 90, 92),
    ],
  },
  {
    id: "discrete",
    name: "Number & Discrete",
    labs: [
      lab("number-sense", 92, 92, 90, 90),
      lab("primes", 92, 92, 90, 92),
      lab("modular-arithmetic", 92, 92, 90, 92),
      lab("number-patterns", 90, 92, 90, 90),
      lab("combinatorics", 92, 92, 90, 92),
      lab("logic", 90, 92, 90, 92),
      lab("algorithms", 92, 92, 90, 92),
      lab("cryptography", 90, 90, 90, 90),
    ],
  },
  {
    id: "set-theory",
    name: "Set Theory",
    labs: [
      lab("set-builder", 90, 92, 90, 92),
      lab("venn-diagram-engine", 92, 92, 90, 92),
      lab("relations", 90, 92, 90, 92),
      lab("hasse-diagram", 92, 92, 90, 92),
      lab("functions", 90, 92, 90, 92),
      lab("representations", 90, 90, 90, 90),
      lab("practice", 90, 90, 90, 90),
    ],
  },
  {
    id: "graph-theory",
    name: "Graph Theory",
    labs: [
      lab("build", 92, 92, 94, 92),
      lab("representations", 90, 92, 90, 92),
      lab("algorithms", 92, 92, 94, 92),
      lab("properties", 90, 92, 90, 92),
      lab("learn", 90, 90, 90, 90),
    ],
  },
];

export const omittedFromScoring = [
  { id: "statistics", reason: "Separate Statistics app" },
  { id: "geometry-ar", reason: "Separate AR app" },
  { id: "trig-ar", reason: "Separate AR app" },
  { id: "discrete-sets", reason: "Window to Set Theory" },
  { id: "discrete-graphs", reason: "Window to Graph Theory" },
  { id: "geometry-solids", reason: "Window to /shapes" },
];

export function allStudiosAtLeast(threshold: number) {
  return scoredStudios.every((studio) => studioMean(studio) >= threshold);
}
