import {
  Atom,
  BarChart3,
  Binary,
  BookOpen,
  BrainCircuit,
  Calculator,
  ChartSpline,
  CircleHelp,
  Cuboid,
  FileText,
  GitFork,
  Grid3X3,
  Hash,
  Home,
  Info,
  Network,
  Shapes,
  Sigma,
  Sparkles,
  Workflow,
  Waves,
  Wrench,
} from "lucide-react";
import { ANVESHAK_STATISTICS_URL } from "../../data/externalLinks";

export const iconMap = {
  Atom,
  BarChart3,
  Binary,
  BookOpen,
  BrainCircuit,
  Calculator,
  ChartSpline,
  CircleHelp,
  Cuboid,
  FileText,
  GitFork,
  Grid3X3,
  Hash,
  Home,
  Info,
  Network,
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
  children?: NavItem[];
};

export type NavSection = {
  title: string;
  icon: keyof typeof iconMap;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    title: "Home",
    icon: "Home",
    items: [
      { title: "Dashboard", route: "/", icon: "Home" },
      { title: "Syllabus", route: "/syllabus", icon: "BookOpen" },
      { title: "Visual Showcase", route: "/visual-showcase", icon: "Sparkles" },
      { title: "Learning Hub", route: "/learn", icon: "BookOpen" },
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
        children: [
          { title: "Overview", route: "/number-systems", icon: "Hash" },
          {
            title: "Rational Numbers",
            route: "/number-systems",
            icon: "Hash",
            children: [
              { title: "Class 7 Rational Lab", route: "/ncert/class-7-rational-numbers", icon: "Hash" },
              { title: "Class 8 Rational Properties", route: "/ncert/class-8-rational-numbers", icon: "Hash" },
            ],
          },
          {
            title: "Irrational & Real",
            route: "/number-systems",
            icon: "Hash",
            children: [
              { title: "Class 9 Number Systems", route: "/ncert/class-9-number-systems", icon: "Hash" },
              { title: "Class 10 Real Numbers", route: "/ncert/class-10-real-numbers", icon: "Hash" },
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
          { title: "2D/3D Shapes", route: "/shapes", icon: "Cuboid" },
          { title: "Coordinate Geometry", route: "/geometry/coordinate-geometry", icon: "Shapes" },
        ],
      },
      {
        title: "Trigonometry",
        route: "/trigonometry",
        icon: "Waves",
        children: [
          { title: "Overview", route: "/trigonometry", icon: "Waves" },
          {
            title: "Foundations",
            route: "/trigonometry",
            icon: "Waves",
            children: [
              { title: "All Trig Functions", route: "/trigonometry/trigonometric-functions", icon: "Waves" },
              { title: "Unit Circle", route: "/trigonometry/unit-circle", icon: "Waves" },
              { title: "Right Triangle Ratios", route: "/trigonometry/right-triangle-ratios", icon: "Waves" },
              { title: "Degrees & Radians", route: "/trigonometry/degree-radian", icon: "Waves" },
            ],
          },
          {
            title: "JEE",
            route: "/trigonometry",
            icon: "Waves",
            children: [
              { title: "Half Angle", route: "/trigonometry/half-angle", icon: "Waves" },
              { title: "Product to Sum", route: "/trigonometry/product-to-sum", icon: "Waves" },
              { title: "General Solutions", route: "/trigonometry/general-solutions", icon: "Waves" },
              { title: "Trig Inequalities", route: "/trigonometry/trig-inequalities", icon: "Waves" },
            ],
          },
          {
            title: "Degree & PG",
            route: "/trigonometry",
            icon: "Waves",
            children: [
              { title: "Fourier Trig Series", route: "/trigonometry/fourier-trig-series", icon: "Waves" },
              { title: "Orthogonality", route: "/trigonometry/orthogonality", icon: "Waves" },
              { title: "Spherical Trig", route: "/trigonometry/spherical-trigonometry", icon: "Waves" },
              { title: "Hyperbolic Functions", route: "/trigonometry/hyperbolic-functions", icon: "Waves" },
            ],
          },
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
      { title: "Complex Numbers", route: "/complex-numbers", icon: "Atom" },
      { title: "Linear Algebra", route: "/linear-algebra", icon: "Grid3X3" },
      { title: "Matrices", route: "/matrices", icon: "Grid3X3" },
      { title: "Discrete World", route: "/discrete-world", icon: "Workflow" },
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
          { title: "Graphing Calculator", route: "/math-lab/graphing-calculator", icon: "ChartSpline" },
          { title: "Function Explorer", route: "/math-lab/function-explorer", icon: "Waves" },
          { title: "Trigonometry Lab", route: "/math-lab/trigonometry", icon: "Waves" },
          { title: "3D Graphing Lab", route: "/math-lab/3d-graphing", icon: "Cuboid" },
          { title: "CAS Solver", route: "/math-lab/cas-solver", icon: "Sigma" },
          { title: "Probability", route: "/math-lab/probability", icon: "CircleHelp" },
        ],
      },
      { title: "Math Workspace", route: "/workspace", icon: "Calculator" },
      { title: "Scientific Calculator", route: "/calculator", icon: "Calculator" },
      { title: "Problem Solver", route: "/problem-solver", icon: "Sigma" },
      { title: "Unit Converter", route: "/unit-converter", icon: "Calculator" },
      { title: "Truth Tables", route: "/truth-table", icon: "Binary" },
      { title: "Statistics", route: ANVESHAK_STATISTICS_URL, icon: "BarChart3", isExternal: true },
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
      { title: "Documentation", route: "/documentation", icon: "FileText" },
      { title: "About", route: "/about", icon: "Info" },
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
  { title: "Combinatorics", route: "/combinatorics", icon: Grid3X3 },
  { title: "Complex Numbers", route: "/complex-numbers", icon: Atom },
  { title: "Set Theory", route: "/set-theory", icon: Network },
  { title: "Mathematical Logic", route: "/mathematical-logic", icon: Binary },
  { title: "Statistics", route: ANVESHAK_STATISTICS_URL, icon: BarChart3, isExternal: true },
  { title: "Probability Lab", route: "/probability-statistics", icon: BarChart3 },
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
