import type { PhaseOneDomain } from "./types";

export type PhaseOneRoadmapItem = {
  domain: PhaseOneDomain;
  topic: string;
  conceptId: string;
};

/** Traceability from every Phase 1 roadmap row to its executable accuracy contract. */
export const phaseOneRoadmapCoverage: PhaseOneRoadmapItem[] = [
  { domain: "algebra", topic: "Expressions and identities", conceptId: "algebra.expressions-identities" },
  { domain: "algebra", topic: "Linear equations", conceptId: "algebra.linear-equation" },
  { domain: "algebra", topic: "Inequalities", conceptId: "algebra.inequalities" },
  { domain: "algebra", topic: "Simultaneous equations", conceptId: "algebra.linear-systems" },
  { domain: "algebra", topic: "Quadratics", conceptId: "algebra.quadratic-equation" },
  { domain: "algebra", topic: "Polynomials", conceptId: "algebra.polynomials" },
  { domain: "algebra", topic: "Sequences and series", conceptId: "algebra.sequences-series" },
  { domain: "algebra", topic: "Algebraic structures", conceptId: "algebra.structures" },
  { domain: "algebra", topic: "Boolean algebra", conceptId: "algebra.boolean" },

  { domain: "number-systems", topic: "Natural, whole, integer, rational, irrational and real numbers", conceptId: "number.real-hierarchy" },
  { domain: "number-systems", topic: "Fractions and rational numbers", conceptId: "number-systems.rational-numbers" },
  { domain: "number-systems", topic: "Decimals and percentages", conceptId: "number.decimals-percentages" },
  { domain: "number-systems", topic: "Irrational numbers and surds", conceptId: "number-systems.irrational-surds" },
  { domain: "number-systems", topic: "Exponents and logarithms", conceptId: "number.exponents-logarithms" },
  { domain: "number-systems", topic: "Factors, primes, GCD and LCM", conceptId: "number.factors-primes" },
  { domain: "number-systems", topic: "Modular arithmetic", conceptId: "number.modular-arithmetic" },

  { domain: "geometry", topic: "Points, lines, rays, segments and angles", conceptId: "geometry.primitives-angles" },
  { domain: "geometry", topic: "Triangles", conceptId: "geometry.triangles" },
  { domain: "geometry", topic: "Congruence and similarity", conceptId: "geometry.congruence-similarity" },
  { domain: "geometry", topic: "Pythagoras", conceptId: "geometry.pythagoras" },
  { domain: "geometry", topic: "Circles", conceptId: "geometry.circles" },
  { domain: "geometry", topic: "Circle theorems", conceptId: "geometry.circle-theorems" },
  { domain: "geometry", topic: "Coordinate geometry", conceptId: "geometry.coordinate" },
  { domain: "geometry", topic: "Transformations and symmetry", conceptId: "geometry.transformations-symmetry" },
  { domain: "geometry", topic: "2D mensuration", conceptId: "geometry.mensuration-2d" },
  { domain: "geometry", topic: "3D solids", conceptId: "geometry.solids" },
  { domain: "geometry", topic: "Orthographic projections", conceptId: "geometry.orthographic" },
  { domain: "geometry", topic: "Fractals", conceptId: "geometry.fractals" },

  { domain: "trigonometry", topic: "Right-triangle ratios", conceptId: "trigonometry.right-triangle-ratios" },
  { domain: "trigonometry", topic: "Unit circle", conceptId: "trigonometry.unit-circle" },
  { domain: "trigonometry", topic: "Trigonometric functions", conceptId: "trigonometry.functions-waves" },
  { domain: "trigonometry", topic: "Identities", conceptId: "trigonometry.identities" },
  { domain: "trigonometry", topic: "Inverse trigonometric functions", conceptId: "trigonometry.inverse-functions" },
  { domain: "trigonometry", topic: "Sine and cosine waves", conceptId: "trigonometry.functions-waves" },
  { domain: "trigonometry", topic: "Eclipse trigonometry", conceptId: "trigonometry.eclipse-model" },

  { domain: "calculus", topic: "Limits", conceptId: "calculus.limits-continuity" },
  { domain: "calculus", topic: "Continuity", conceptId: "calculus.limits-continuity" },
  { domain: "calculus", topic: "Derivatives", conceptId: "calculus.derivative" },
  { domain: "calculus", topic: "Derivative rules", conceptId: "calculus.derivative-rules" },
  { domain: "calculus", topic: "Applications of derivatives", conceptId: "calculus.derivative-applications" },
  { domain: "calculus", topic: "Integration", conceptId: "calculus.integration" },
  { domain: "calculus", topic: "Area between curves", conceptId: "calculus.area-between-curves" },
  { domain: "calculus", topic: "Series", conceptId: "calculus.series" },
  { domain: "calculus", topic: "Differential equations and slope fields", conceptId: "calculus.differential-equations" },
];
