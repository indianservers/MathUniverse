export type ComplexityClass = {
  name: string;
  intuition: string;
  examples: string[];
};

export const complexityClasses: ComplexityClass[] = [
  { name: "Decidable", intuition: "A machine always halts with yes or no.", examples: ["DFA acceptance", "CFG membership for bounded grammar"] },
  { name: "Undecidable", intuition: "No general algorithm can decide every instance.", examples: ["Halting problem", "Program equivalence"] },
  { name: "P", intuition: "Problems solvable in polynomial time.", examples: ["Shortest path", "MST", "Bipartite matching"] },
  { name: "NP", intuition: "Yes answers have certificates checkable in polynomial time.", examples: ["Hamiltonian cycle", "SAT", "Graph coloring decision"] },
  { name: "NP-complete", intuition: "Hardest problems in NP under polynomial reductions.", examples: ["SAT", "3-coloring", "Hamiltonian cycle"] },
];

export function haltingDiagonalDemo(programSaysHalts: boolean) {
  return {
    assumedPrediction: programSaysHalts ? "HALTS" : "LOOPS",
    diagonalAction: programSaysHalts ? "Loop forever" : "Halt immediately",
    contradiction: programSaysHalts
      ? "If the predictor says this program halts, the diagonal program loops."
      : "If the predictor says this program loops, the diagonal program halts.",
  };
}

export function certificateCheck(kind: "hamiltonian" | "coloring", certificate: string[]) {
  if (kind === "hamiltonian") {
    return {
      validShape: new Set(certificate).size + 1 === certificate.length && certificate[0] === certificate[certificate.length - 1],
      explanation: "A Hamiltonian certificate is checked by verifying every vertex appears once and every consecutive pair is an edge.",
    };
  }
  return {
    validShape: certificate.every((item) => /^\w+:\d+$/.test(item)),
    explanation: "A coloring certificate is checked by verifying adjacent vertices never share a color.",
  };
}
