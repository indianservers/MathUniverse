import {
  Atom,
  BarChart3,
  Binary,
  BookOpen,
  BrainCircuit,
  Calculator,
  ChartSpline,
  CircleHelp,
  Cone,
  Cuboid,
  FileText,
  FunctionSquare,
  GitFork,
  Grid3X3,
  Hash,
  Home,
  Info,
  LineChart,
  Network,
  Presentation,
  Shapes,
  Sigma,
  Sparkles,
  Workflow,
  Waves,
  Wrench,
} from "lucide-react";
import { advancedSyllabusLabs } from "../../data/advancedSyllabusLabs";
import { ncertConcepts, ncertRoute } from "../../data/ncertConcepts";

export const iconMap = {
  Atom,
  BarChart3,
  Binary,
  BookOpen,
  BrainCircuit,
  Calculator,
  ChartSpline,
  CircleHelp,
  Cone,
  Cuboid,
  FileText,
  FunctionSquare,
  GitFork,
  Grid3X3,
  Hash,
  Home,
  Info,
  LineChart,
  Network,
  Presentation,
  Shapes,
  Sigma,
  Sparkles,
  Workflow,
  Waves,
  Wrench,
};

export type NavItem = {
  title: string;
  route: string;
  icon: keyof typeof iconMap;
  isExternal?: boolean;
  searchTerms?: string[];
  children?: NavItem[];
};

export type NavSection = {
  title: string;
  icon: keyof typeof iconMap;
  items: NavItem[];
};

const geometryConceptMenu: NavItem[] = [
  {
    title: "Foundations",
    route: "/geometry",
    icon: "Shapes",
    children: [
      { title: "Points, Lines, and Rays", route: "/geometry/points-lines-rays", icon: "Shapes", searchTerms: ["line", "ray", "segment", "distance", "slope"] },
      { title: "Angles and Rotation", route: "/geometry/angles", icon: "Shapes", searchTerms: ["angle", "arc length", "rotation"] },
      { title: "Parallel Lines", route: "/geometry/parallel-lines", icon: "Shapes", searchTerms: ["parallel", "transversal", "corresponding angles"] },
    ],
  },
  {
    title: "Triangles",
    route: "/geometry/triangles",
    icon: "Shapes",
    children: [
      { title: "Triangle Basics", route: "/geometry/triangles", icon: "Shapes", searchTerms: ["area", "angle sum", "base height"] },
      { title: "Pythagorean Theorem", route: "/geometry/pythagorean-theorem", icon: "Workflow", searchTerms: ["pythagoras", "right triangle", "visual proof"] },
      { title: "Triangle Congruence", route: "/geometry/triangle-congruence", icon: "Workflow", searchTerms: ["sss", "sas", "asa", "rhs"] },
      { title: "Similar Triangles", route: "/geometry/similar-triangles", icon: "Workflow", searchTerms: ["similarity", "scale factor", "proportional sides"] },
      { title: "Trigonometry in Geometry", route: "/geometry/trig-in-geometry", icon: "Waves", searchTerms: ["tan", "opposite", "adjacent", "heights"] },
    ],
  },
  {
    title: "Polygons and Circles",
    route: "/geometry/quadrilaterals",
    icon: "Shapes",
    children: [
      { title: "Quadrilaterals", route: "/geometry/quadrilaterals", icon: "Shapes" },
      { title: "Regular Polygons", route: "/geometry/polygons", icon: "Shapes" },
      { title: "Circles", route: "/geometry/circles", icon: "Shapes" },
      { title: "Arcs and Sectors", route: "/geometry/arcs-sectors", icon: "Shapes" },
      { title: "Chords and Secants", route: "/geometry/chords-secants", icon: "Shapes" },
      { title: "Tangents", route: "/geometry/tangents", icon: "Shapes" },
    ],
  },
  {
    title: "Coordinate and Transform",
    route: "/geometry/coordinate-geometry",
    icon: "ChartSpline",
    children: [
      { title: "Coordinate Geometry", route: "/geometry/coordinate-geometry", icon: "ChartSpline", searchTerms: ["distance", "midpoint", "slope"] },
      { title: "Transformations", route: "/geometry/transformations", icon: "Workflow", searchTerms: ["translation", "rotation", "reflection", "dilation"] },
      { title: "Symmetry", route: "/geometry/symmetry", icon: "Workflow", searchTerms: ["reflection", "mirror", "rotational symmetry"] },
      { title: "Loci", route: "/geometry/loci", icon: "Workflow", searchTerms: ["locus", "path", "fixed distance"] },
    ],
  },
  {
    title: "Measurement and Construction",
    route: "/geometry/area-perimeter",
    icon: "Calculator",
    children: [
      { title: "Area and Perimeter", route: "/geometry/area-perimeter", icon: "Calculator" },
      { title: "3D Mensuration", route: "/geometry/mensuration-3d", icon: "Cuboid" },
      { title: "Surface Area and Volume", route: "/geometry/surface-area-volume", icon: "Cuboid" },
      { title: "Geometric Constructions", route: "/geometry/geometric-constructions", icon: "Shapes", searchTerms: ["compass", "straightedge", "construction"] },
      { title: "2D/3D Shapes Explorer", route: "/shapes", icon: "Cuboid" },
    ],
  },
];

const trigonometryConceptMenu: NavItem[] = [
  {
    title: "Foundations",
    route: "/trigonometry",
    icon: "Waves",
    children: [
      { title: "All Trig Functions", route: "/trigonometry/trigonometric-functions", icon: "Waves" },
      { title: "Unit Circle", route: "/trigonometry/unit-circle", icon: "Waves" },
      { title: "Right Triangle Ratios", route: "/trigonometry/right-triangle-ratios", icon: "Waves" },
      { title: "Degrees and Radians", route: "/trigonometry/degree-radian", icon: "Waves" },
      { title: "Special Angles", route: "/trigonometry/special-angles", icon: "Waves" },
      { title: "Quadrant Sign Rules", route: "/trigonometry/quadrant-signs", icon: "Waves" },
    ],
  },
  {
    title: "Graphs and Ratios",
    route: "/trigonometry/sine-graph",
    icon: "ChartSpline",
    children: [
      { title: "Sine Graph", route: "/trigonometry/sine-graph", icon: "ChartSpline" },
      { title: "Cosine Graph", route: "/trigonometry/cosine-graph", icon: "ChartSpline" },
      { title: "Tangent Graph", route: "/trigonometry/tangent-graph", icon: "ChartSpline" },
      { title: "Reciprocal Graphs", route: "/trigonometry/reciprocal-graphs", icon: "ChartSpline" },
      { title: "Sec, Cosec, Cot", route: "/trigonometry/reciprocal-ratios", icon: "Waves" },
    ],
  },
  {
    title: "Identities",
    route: "/trigonometry/pythagorean-identity",
    icon: "Workflow",
    children: [
      { title: "Pythagorean Identity", route: "/trigonometry/pythagorean-identity", icon: "Workflow" },
      { title: "Complementary Angles", route: "/trigonometry/complementary-angles", icon: "Workflow" },
      { title: "Sum and Difference", route: "/trigonometry/sum-difference", icon: "Workflow" },
      { title: "Double Angle", route: "/trigonometry/double-angle", icon: "Workflow" },
      { title: "Half Angle", route: "/trigonometry/half-angle", icon: "Workflow" },
      { title: "Product to Sum", route: "/trigonometry/product-to-sum", icon: "Workflow" },
      { title: "Triple Angle", route: "/trigonometry/triple-angle", icon: "Workflow" },
    ],
  },
  {
    title: "Equations",
    route: "/trigonometry/inverse-trig",
    icon: "Sigma",
    children: [
      { title: "Inverse Trigonometry", route: "/trigonometry/inverse-trig", icon: "Sigma" },
      { title: "Inverse Principal Values", route: "/trigonometry/inverse-principal-values", icon: "Sigma" },
      { title: "Trigonometric Equations", route: "/trigonometry/trig-equations", icon: "Sigma" },
      { title: "General Solutions", route: "/trigonometry/general-solutions", icon: "Sigma" },
      { title: "Trig Inequalities", route: "/trigonometry/trig-inequalities", icon: "Sigma" },
    ],
  },
  {
    title: "Applications and Triangle Solving",
    route: "/trigonometry/height-distance",
    icon: "Shapes",
    children: [
      { title: "Heights and Distances", route: "/trigonometry/height-distance", icon: "Shapes" },
      { title: "Bearings and Navigation", route: "/trigonometry/bearings-navigation", icon: "Shapes" },
      { title: "Law of Sines", route: "/trigonometry/law-of-sines", icon: "Shapes" },
      { title: "Law of Cosines", route: "/trigonometry/law-of-cosines", icon: "Shapes" },
      { title: "SSA Ambiguous Case", route: "/trigonometry/ambiguous-case", icon: "Shapes" },
      { title: "Triangle Area Formula", route: "/trigonometry/trig-triangle-area", icon: "Shapes" },
    ],
  },
  {
    title: "Advanced, Calculus, and Waves",
    route: "/trigonometry/polar-coordinates",
    icon: "BrainCircuit",
    children: [
      { title: "Polar Coordinates", route: "/trigonometry/polar-coordinates", icon: "BrainCircuit" },
      { title: "Polar Rose Curves", route: "/trigonometry/polar-roses", icon: "BrainCircuit" },
      { title: "De Moivre's Theorem", route: "/trigonometry/complex-de-moivre", icon: "Atom" },
      { title: "Trigonometric Limits", route: "/trigonometry/trig-limits", icon: "Sigma" },
      { title: "Trig Derivatives", route: "/trigonometry/trig-derivatives", icon: "Sigma" },
      { title: "Trig Integrals", route: "/trigonometry/trig-integrals", icon: "Sigma" },
      { title: "Orthogonality", route: "/trigonometry/orthogonality", icon: "Waves" },
      { title: "Fourier Trig Series", route: "/trigonometry/fourier-trig-series", icon: "Waves" },
      { title: "Spherical Trigonometry", route: "/trigonometry/spherical-trigonometry", icon: "Shapes" },
      { title: "Hyperbolic Functions", route: "/trigonometry/hyperbolic-functions", icon: "ChartSpline" },
      { title: "Amplitude", route: "/trigonometry/wave-amplitude", icon: "Waves" },
      { title: "Period and Frequency", route: "/trigonometry/wave-period-frequency", icon: "Waves" },
      { title: "Phase Shift", route: "/trigonometry/phase-shift", icon: "Waves" },
      { title: "Eclipse Trigonometry", route: "/trigonometry/eclipse-trigonometry", icon: "Waves" },
      { title: "Real-World Waves", route: "/trigonometry/real-world-waves", icon: "Waves" },
      { title: "50+ Trigonometry Experiments", route: "/trigonometry/inquiry-experiments", icon: "CircleHelp" },
    ],
  },
];

const coreVisualizationMenu: NavItem[] = [
  { title: "Functions & Graphs", route: "/math/functions-graphs", icon: "ChartSpline", searchTerms: ["function graph", "graph visualizer"] },
  { title: "Limits & Continuity", route: "/math/limits-continuity", icon: "Sigma", searchTerms: ["limits", "continuity", "epsilon delta"] },
  { title: "Derivatives & Tangents", route: "/math/derivatives", icon: "ChartSpline", searchTerms: ["derivative", "tangent", "secant"] },
  { title: "Integration Area", route: "/math/integration", icon: "Sigma", searchTerms: ["integral", "area under curve", "riemann"] },
  { title: "Matrix Transformations", route: "/math/matrix-transformations", icon: "Grid3X3", searchTerms: ["matrix", "basis vectors", "linear transformation"] },
  { title: "Eigenvectors", route: "/math/eigenvectors", icon: "Grid3X3", searchTerms: ["eigenvalue", "eigenvector", "matrix"] },
  { title: "Slope Fields", route: "/math/slope-fields", icon: "ChartSpline", searchTerms: ["differential equations", "direction fields"] },
  { title: "Fourier Series", route: "/math/fourier-series", icon: "Waves", searchTerms: ["fourier", "series", "waves"] },
  { title: "Permutations & Combinations", route: "/math/permutations-combinations", icon: "Binary", searchTerms: ["npr", "ncr", "factorial", "counting"] },
];

const standaloneVisualizationMenu: NavItem[] = [
  { title: "Graph Comparison", route: "/graph-comparison", icon: "ChartSpline" },
  { title: "Parametric Curves", route: "/parametric-curves", icon: "Waves" },
  { title: "Polar Visualizer", route: "/polar-visualizer", icon: "Waves" },
  { title: "3D Surface Plotter", route: "/surface-plotter", icon: "Cuboid" },
  { title: "Fourier Animator", route: "/fourier-animator", icon: "Waves" },
  { title: "Graph Theory", route: "/graph-theory", icon: "Network" },
  { title: "Complex Number Explorer", route: "/complex-numbers", icon: "Atom" },
  { title: "AI Applications", route: "/ai-applications", icon: "BrainCircuit" },
];

function advancedLabIcon(category: string): keyof typeof iconMap {
  if (/calculus|analysis|differential|pde/i.test(category)) return "ChartSpline";
  if (/linear|matrix|vector/i.test(category)) return "Grid3X3";
  if (/complex|number theory/i.test(category)) return "Atom";
  if (/discrete|logic|sets|graph|operations/i.test(category)) return "Network";
  if (/probability|statistics|stochastic/i.test(category)) return "BarChart3";
  if (/tech|machine|optimization/i.test(category)) return "BrainCircuit";
  return "Sigma";
}

const advancedLabMenu: NavItem[] = Array.from(
  advancedSyllabusLabs.reduce((groups, lab) => {
    const route = `/syllabus-lab/${lab.id}`;
    const item: NavItem = {
      title: lab.title,
      route,
      icon: advancedLabIcon(lab.category),
      searchTerms: [lab.category, lab.subcategory, lab.formula, ...lab.tasks],
    };
    const current = groups.get(lab.category) ?? [];
    groups.set(lab.category, [...current, item]);
    return groups;
  }, new Map<string, NavItem[]>()),
).map(([category, children]) => ({
  title: category,
  route: children[0]?.route ?? "/syllabus",
  icon: advancedLabIcon(category),
  children,
}));

const ncertVisualMenu: NavItem[] = Array.from(
  ncertConcepts.reduce((groups, concept) => {
    const item: NavItem = {
      title: concept.title,
      route: ncertRoute(concept.id),
      icon: "BookOpen",
      searchTerms: [concept.classLevel, concept.unit, concept.formula],
    };
    const current = groups.get(concept.classLevel) ?? [];
    groups.set(concept.classLevel, [...current, item]);
    return groups;
  }, new Map<string, NavItem[]>()),
).map(([classLevel, children]) => ({
  title: classLevel,
  route: children[0]?.route ?? "/syllabus",
  icon: "BookOpen",
  children,
}));

export const navSections: NavSection[] = [
  {
    title: "Home",
    icon: "Home",
    items: [
      { title: "Math Workspace", route: "/workspace", icon: "Calculator" },
      { title: "Graph & Algebra", route: "/workspace/graph", icon: "FunctionSquare" },
      { title: "Geometry Constructor", route: "/workspace/geometry", icon: "Shapes" },
      { title: "3D Calculator", route: "/workspace/3d", icon: "Cuboid" },
      { title: "CAS, Tables & Data", route: "/workspace/data", icon: "LineChart" },
      { title: "Teacher Studio", route: "/workspace/teach", icon: "Presentation" },
      { title: "Dashboard", route: "/", icon: "Home" },
      { title: "Syllabus", route: "/syllabus", icon: "BookOpen" },
      { title: "Formulas", route: "/formulas", icon: "Sigma" },
      { title: "Visual Showcase", route: "/visual-showcase", icon: "Sparkles" },
      { title: "Learning Hub", route: "/learn", icon: "BookOpen" },
    ],
  },
  {
    title: "Visualize",
    icon: "Sparkles",
    items: [
      {
        title: "Visual Showcase",
        route: "/visual-showcase",
        icon: "Sparkles",
        searchTerms: ["visual showcase", "visualize", "main visuals", "all visualizations", "visual paths"],
      },
      {
        title: "Formula Visuals",
        route: "/formulas",
        icon: "Sigma",
        searchTerms: ["formula visuals", "formula atlas", "formula visualization", "formula cards"],
        children: [
          { title: "Formula Atlas", route: "/formulas", icon: "Sigma", searchTerms: ["formula visuals", "formula list", "formula search"] },
          { title: "Algebra Formula Visuals", route: "/algebra", icon: "Calculator", searchTerms: ["linear formulas", "quadratic formulas", "identities", "polynomials"] },
          { title: "Calculus Formula Visuals", route: "/calculus", icon: "Sigma", searchTerms: ["limits", "derivatives", "integrals", "formula visuals"] },
          { title: "Geometry Formula Visuals", route: "/geometry", icon: "Shapes", searchTerms: ["area", "perimeter", "pythagoras", "circle formulas"] },
          { title: "Engineering Formula Visuals", route: "/engineering-math", icon: "Sigma", searchTerms: ["engineering formula atlas", "btech formulas", "advanced formula visuals"] },
        ],
      },
      {
        title: "Visual Proofs",
        route: "/geometry",
        icon: "Workflow",
        searchTerms: ["visual proofs", "proofs", "theorem visuals", "geometry proofs", "pythagoras proof"],
        children: [
          { title: "Geometry Theorem Visuals", route: "/geometry", icon: "Workflow", searchTerms: ["visual proofs", "geometry theorems", "theorems tab"] },
          ...geometryConceptMenu,
          { title: "Euclid Proof Cards", route: "/ncert/class-9-euclid-geometry", icon: "BookOpen", searchTerms: ["euclid", "axioms", "postulates", "proof flow"] },
        ],
      },
      {
        title: "Trigonometry Visuals",
        route: "/trigonometry",
        icon: "Waves",
        searchTerms: ["trigonometry visuals", "trig visualizations", "unit circle", "trig identities"],
        children: [
          { title: "Trig Visual Lab", route: "/trigonometry", icon: "Waves", searchTerms: ["trigonometry overview", "visualizations submenu"] },
          ...trigonometryConceptMenu,
        ],
      },
      {
        title: "Graph & Calculus Visuals",
        route: "/math/functions-graphs",
        icon: "ChartSpline",
        searchTerms: ["graph visuals", "calculus visuals", "function visualizations"],
        children: coreVisualizationMenu,
      },
      {
        title: "Standalone Visualizers",
        route: "/graph-comparison",
        icon: "Sparkles",
        searchTerms: ["standalone visualizers", "graph compare", "parametric", "polar", "surface", "fourier animator"],
        children: standaloneVisualizationMenu,
      },
      {
        title: "Advanced Visual Labs",
        route: "/syllabus",
        icon: "BrainCircuit",
        searchTerms: ["advanced visual labs", "syllabus labs", "degree", "engineering visuals"],
        children: [
          { title: "Syllabus Visual Navigator", route: "/syllabus", icon: "BookOpen", searchTerms: ["syllabus visual", "all labs"] },
          { title: "Syllabus Visual Pages", route: "/syllabus-visual-v2/class-10-real-numbers", icon: "BookOpen", searchTerms: ["board syllabus visual", "ncert visual"] },
          ...advancedLabMenu,
        ],
      },
      {
        title: "Board and NCERT Visuals",
        route: "/syllabus",
        icon: "BookOpen",
        searchTerms: ["board visuals", "ncert visuals", "class 6", "class 7", "class 8", "class 9", "class 10"],
        children: [
          { title: "Syllabus Hub", route: "/syllabus", icon: "BookOpen" },
          { title: "Board Visual Pages", route: "/syllabus-visual-v2/class-10-real-numbers", icon: "BookOpen" },
          ...ncertVisualMenu,
        ],
      },
      {
        title: "Workspace Visual Tools",
        route: "/workspace",
        icon: "Calculator",
        searchTerms: ["workspace visuals", "graphing", "geometry constructor", "3d visual"],
        children: [
          { title: "Graph & Algebra Workspace", route: "/workspace/graph", icon: "FunctionSquare", searchTerms: ["graphing workspace", "algebra visual"] },
          { title: "Geometry Constructor", route: "/workspace/geometry", icon: "Shapes", searchTerms: ["geogebra", "geometry construction", "visual proof board"] },
          { title: "3D Calculator", route: "/workspace/3d", icon: "Cuboid", searchTerms: ["3d visuals", "surface", "solid"] },
          { title: "CAS, Tables & Data", route: "/workspace/data", icon: "LineChart", searchTerms: ["data visual", "tables", "cas"] },
          { title: "Teacher Studio", route: "/workspace/teach", icon: "Presentation", searchTerms: ["teach", "lesson", "classroom"] },
        ],
      },
    ],
  },
  {
    title: "Math Topics",
    icon: "Sigma",
    items: [
      {
        title: "Algebra",
        route: "/algebra",
        icon: "Calculator",
        children: [
          { title: "Overview", route: "/algebra", icon: "Calculator" },
          {
            title: "Formula Visuals",
            route: "/algebra",
            icon: "Calculator",
            children: [
              { title: "Linear Formulas", route: "/algebra", icon: "Calculator" },
              { title: "Quadratic Formulas", route: "/algebra", icon: "Calculator" },
              { title: "Identities", route: "/ncert/class-8-algebraic-identities", icon: "Calculator" },
              { title: "Polynomials", route: "/ncert/class-10-polynomials", icon: "Calculator" },
            ],
          },
          { title: "Algebraic Structures", route: "/algebraic-structures", icon: "GitFork" },
        ],
      },
      {
        title: "Number Systems",
        route: "/number-systems",
        icon: "Hash",
        searchTerms: [
          "number theory",
          "natural numbers",
          "whole numbers",
          "integers",
          "real numbers",
          "prime numbers",
          "factors",
          "multiples",
          "common factors",
          "common multiples",
          "divisibility",
          "hcf",
          "highest common factor",
          "gcd",
          "greatest common divisor",
          "lcm",
          "least common multiple",
          "euclid",
          "euclidean algorithm",
          "prime factorization",
          "factor tree",
        ],
        children: [
          {
            title: "Overview",
            route: "/number-systems",
            icon: "Hash",
            searchTerms: [
              "number theory",
              "factors",
              "multiples",
              "hcf",
              "gcd",
              "lcm",
              "prime factorization",
              "divisibility",
            ],
          },
          {
            title: "Rational Numbers",
            route: "/number-systems",
            icon: "Hash",
            searchTerms: [
              "fractions",
              "p by q",
              "p/q",
              "terminating decimals",
              "repeating decimals",
              "equivalent fractions",
              "negative fractions",
              "rational properties",
            ],
            children: [
              {
                title: "Class 7 Rational Lab",
                route: "/ncert/class-7-rational-numbers",
                icon: "Hash",
                searchTerms: ["fractions", "integers on number line", "rational numbers", "class 7"],
              },
              {
                title: "Class 8 Rational Properties",
                route: "/ncert/class-8-rational-numbers",
                icon: "Hash",
                searchTerms: ["rational properties", "closure", "commutative", "associative", "distributive", "class 8"],
              },
            ],
          },
          {
            title: "Irrational & Real",
            route: "/number-systems",
            icon: "Hash",
            searchTerms: [
              "irrational numbers",
              "real numbers",
              "surds",
              "roots",
              "square root",
              "decimal expansion",
              "fundamental theorem of arithmetic",
              "hcf",
              "gcd",
              "lcm",
              "euclid",
              "prime factorization",
            ],
            children: [
              {
                title: "Class 9 Number Systems",
                route: "/ncert/class-9-number-systems",
                icon: "Hash",
                searchTerms: ["irrational numbers", "real numbers", "decimal expansion", "class 9"],
              },
              {
                title: "Class 10 Real Numbers",
                route: "/ncert/class-10-real-numbers",
                icon: "Hash",
                searchTerms: [
                  "class 10",
                  "real numbers",
                  "hcf",
                  "highest common factor",
                  "gcd",
                  "greatest common divisor",
                  "lcm",
                  "least common multiple",
                  "euclid",
                  "euclidean algorithm",
                  "euclid division lemma",
                  "division lemma",
                  "prime factorization",
                  "prime factors",
                  "factor tree",
                  "common factors",
                  "common multiples",
                  "fundamental theorem of arithmetic",
                  "number theory",
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Geometry",
        route: "/geometry",
        icon: "Shapes",
        children: [
          { title: "Geometry Universe", route: "/geometry", icon: "Shapes" },
          ...geometryConceptMenu,
        ],
      },
      {
        title: "Trigonometry",
        route: "/trigonometry",
        icon: "Waves",
        children: [
          { title: "Overview", route: "/trigonometry", icon: "Waves" },
          ...trigonometryConceptMenu,
        ],
      },
      {
        title: "Calculus",
        route: "/calculus",
        icon: "Sigma",
        children: [
          { title: "Overview + Formula Atlas", route: "/calculus", icon: "Sigma" },
          {
            title: "Core Calculus",
            route: "/calculus",
            icon: "Sigma",
            children: [
              { title: "Functions & Graphs", route: "/math/functions-graphs", icon: "ChartSpline" },
              { title: "Limits", route: "/math/limits-continuity", icon: "Sigma" },
              { title: "Derivatives", route: "/math/derivatives", icon: "Sigma" },
              { title: "Integration", route: "/math/integration", icon: "Sigma" },
              { title: "Slope Fields", route: "/math/slope-fields", icon: "Sigma" },
            ],
          },
          {
            title: "Degree & PG",
            route: "/calculus",
            icon: "Sigma",
            children: [
              { title: "Fourier Series", route: "/math/fourier-series", icon: "Sigma" },
              { title: "3D Surface Plotter", route: "/surface-plotter", icon: "Cuboid" },
            ],
          },
        ],
      },
      { title: "Engineering Mathematics", route: "/engineering-math", icon: "Sigma" },
      { title: "Complex Numbers", route: "/complex-numbers", icon: "Atom" },
      { title: "Combinatorics", route: "/combinatorics", icon: "Grid3X3" },
      { title: "Set Theory", route: "/set-theory", icon: "Network" },
      { title: "Mathematical Logic", route: "/mathematical-logic", icon: "Binary" },
      {
        title: "Vectors",
        route: "/linear-algebra",
        icon: "Grid3X3",
        children: [
          { title: "Vector Visualizer", route: "/linear-algebra", icon: "Grid3X3" },
          { title: "3D Vectors", route: "/linear-algebra", icon: "Cuboid" },
          { title: "Vector Algebra", route: "/linear-algebra", icon: "Sigma" },
          { title: "Dot and Cross Product", route: "/linear-algebra", icon: "Workflow" },
          { title: "Vector Projections", route: "/linear-algebra", icon: "ChartSpline" },
        ],
      },
      {
        title: "Linear Algebra",
        route: "/linear-algebra",
        icon: "Grid3X3",
        children: [
          { title: "Linear Algebra Overview", route: "/linear-algebra", icon: "Grid3X3" },
          { title: "Matrix Transformations", route: "/math/matrix-transformations", icon: "Grid3X3" },
          { title: "Eigenvectors", route: "/math/eigenvectors", icon: "Grid3X3" },
        ],
      },
      {
        title: "Matrices",
        route: "/matrices",
        icon: "Grid3X3",
        children: [
          { title: "Matrix Operations", route: "/matrices", icon: "Grid3X3" },
          { title: "Matrix Sandbox", route: "/matrix-sandbox", icon: "Grid3X3" },
          { title: "Matrix Transformations", route: "/math/matrix-transformations", icon: "Grid3X3" },
          { title: "Eigenvectors", route: "/math/eigenvectors", icon: "Grid3X3" },
        ],
      },
      {
        title: "Discrete Mathematics",
        route: "/discrete-world",
        icon: "Workflow",
        children: [
          { title: "Discrete World", route: "/discrete-world", icon: "Workflow" },
          { title: "Graph Theory", route: "/graph-theory", icon: "Network" },
          { title: "Permutations & Combinations", route: "/math/permutations-combinations", icon: "Binary" },
          { title: "Combinatorics", route: "/combinatorics", icon: "Grid3X3" },
          { title: "Set Theory", route: "/set-theory", icon: "Network" },
          { title: "Truth Tables", route: "/truth-table", icon: "Binary" },
        ],
      },
    ],
  },
  {
    title: "Tools",
    icon: "Wrench",
    items: [
      {
        title: "Math Lab",
        route: "/math-lab",
        icon: "BrainCircuit",
        children: [
          { title: "Math Lab Home", route: "/math-lab", icon: "BrainCircuit" },
          { title: "Graphing Calculator", route: "/math-lab/graphing-calculator", icon: "ChartSpline" },
          { title: "Function Explorer", route: "/math-lab/function-explorer", icon: "Waves" },
          { title: "Linear Algebra Lab", route: "/math-lab/linear-algebra", icon: "Grid3X3" },
          { title: "Trigonometry Lab", route: "/math-lab/trigonometry", icon: "Waves" },
          { title: "Conic Solver", route: "/math-lab/conics", icon: "Cone" },
          { title: "3D Graphing Lab", route: "/math-lab/3d-graphing", icon: "Cuboid" },
          { title: "CAS Solver", route: "/math-lab/cas-solver", icon: "Sigma" },
          { title: "Smart Query", route: "/math-lab/query", icon: "BrainCircuit" },
          { title: "Probability", route: "/math-lab/probability", icon: "CircleHelp" },
        ],
      },
      { title: "Formulas", route: "/formulas", icon: "Sigma" },
      { title: "Scientific Calculator", route: "/calculator", icon: "Calculator" },
      {
        title: "Problem Solver",
        route: "/problem-solver",
        icon: "Sigma",
        children: [
          { title: "Open Solver", route: "/problem-solver", icon: "Sigma" },
          { title: "Solver Documentation", route: "/problem-solver/docs", icon: "FileText", searchTerms: ["problem solver docs", "solver examples", "math keywords", "supported syntax"] },
        ],
      },
      { title: "Unit Converter", route: "/unit-converter", icon: "Calculator" },
      { title: "Truth Tables", route: "/truth-table", icon: "Binary" },
      {
        title: "Statistics",
        route: "/probability-statistics",
        icon: "BarChart3",
        children: [
          { title: "Probability & Statistics", route: "/probability-statistics", icon: "BarChart3" },
          { title: "Statistics Alias", route: "/statistics", icon: "BarChart3" },
          { title: "Probability Lab", route: "/math-lab/probability", icon: "CircleHelp" },
        ],
      },
    ],
  },
  {
    title: "Practice",
    icon: "BookOpen",
    items: [
      { title: "Quiz", route: "/quiz", icon: "CircleHelp" },
      { title: "Daily Challenge", route: "/daily-challenge", icon: "CircleHelp" },
      { title: "Spaced Repetition", route: "/spaced-repetition", icon: "CircleHelp" },
      { title: "Worked Examples", route: "/worked-examples", icon: "BookOpen" },
      { title: "Concept Graph", route: "/concept-graph", icon: "Grid3X3" },
      { title: "AI Applications", route: "/ai-applications", icon: "BrainCircuit" },
      {
        title: "Reference",
        route: "/documentation",
        icon: "FileText",
        children: [
          { title: "Documentation", route: "/documentation", icon: "FileText" },
          { title: "Sitemap", route: "/sitemap", icon: "Network" },
          { title: "About", route: "/about", icon: "Info" },
        ],
      },
    ],
  },
];

function flattenNavItems(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => [item, ...flattenNavItems(item.children ?? [])]);
}

export const navItems = navSections.flatMap((section) => flattenNavItems(section.items).map((item) => ({
  ...item,
  icon: iconMap[item.icon],
})));

export const legacyNavItems = [
  { title: "Home", route: "/", icon: Home },
  { title: "Math Lab", route: "/math-lab", icon: BrainCircuit },
  { title: "Visual Showcase", route: "/visual-showcase", icon: Sparkles },
  { title: "Math Workspace", route: "/workspace", icon: Calculator },
  { title: "Algebra", route: "/algebra", icon: Calculator },
  { title: "Algebraic Structures", route: "/algebraic-structures", icon: GitFork },
  { title: "Geometry", route: "/geometry", icon: Shapes },
  { title: "Number Systems", route: "/number-systems", icon: Hash },
  { title: "2D/3D Shapes", route: "/shapes", icon: Cuboid },
  { title: "Trigonometry", route: "/trigonometry", icon: Waves },
  { title: "Calculus", route: "/calculus", icon: Sigma },
  { title: "Engineering Mathematics", route: "/engineering-math", icon: Sigma },
  { title: "Combinatorics", route: "/combinatorics", icon: Grid3X3 },
  { title: "Complex Numbers", route: "/complex-numbers", icon: Atom },
  { title: "Set Theory", route: "/set-theory", icon: Network },
  { title: "Mathematical Logic", route: "/mathematical-logic", icon: Binary },
  { title: "Statistics", route: "/probability-statistics", icon: BarChart3 },
  { title: "Probability Lab", route: "/probability-statistics", icon: BarChart3 },
  { title: "Vectors", route: "/linear-algebra", icon: Grid3X3 },
  { title: "Vector Visualizer", route: "/linear-algebra", icon: Grid3X3 },
  { title: "3D Vectors", route: "/linear-algebra", icon: Cuboid },
  { title: "Vector Algebra", route: "/linear-algebra", icon: Sigma },
  { title: "Linear Algebra", route: "/linear-algebra", icon: Grid3X3 },
  { title: "Matrix Operations", route: "/matrices", icon: Grid3X3 },
  { title: "Matrix Sandbox", route: "/matrix-sandbox", icon: Grid3X3 },
  { title: "AI Applications", route: "/ai-applications", icon: BrainCircuit },
  { title: "Learning Hub", route: "/learn", icon: BookOpen },
  { title: "Spaced Repetition", route: "/spaced-repetition", icon: CircleHelp },
  { title: "Problem Solver", route: "/problem-solver", icon: Sigma },
  { title: "Concept Graph", route: "/concept-graph", icon: Grid3X3 },
  { title: "Daily Challenge", route: "/daily-challenge", icon: CircleHelp },
  { title: "Worked Examples", route: "/worked-examples", icon: BookOpen },
  { title: "Syllabus", route: "/syllabus", icon: BookOpen },
  { title: "Formulas", route: "/formulas", icon: Sigma },
  { title: "Scientific Calculator", route: "/calculator", icon: Calculator },
  { title: "Unit Converter", route: "/unit-converter", icon: Calculator },
  { title: "Truth Tables", route: "/truth-table", icon: Sigma },
  { title: "Graph Theory", route: "/graph-theory", icon: Network },
  { title: "Discrete World", route: "/discrete-world", icon: Workflow },
  { title: "Graph Compare", route: "/graph-comparison", icon: Waves },
  { title: "Parametric Curves", route: "/parametric-curves", icon: Waves },
  { title: "3D Surface Plotter", route: "/surface-plotter", icon: Cuboid },
  { title: "Fourier Animator", route: "/fourier-animator", icon: Waves },
  { title: "Polar Visualizer", route: "/polar-visualizer", icon: Waves },
  { title: "Quiz", route: "/quiz", icon: CircleHelp },
  { title: "Documentation", route: "/documentation", icon: FileText },
  { title: "About", route: "/about", icon: Info },
];
