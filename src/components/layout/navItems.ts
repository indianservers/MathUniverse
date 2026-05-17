import {
  Atom,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Calculator,
  ChartSpline,
  CircleHelp,
  Cuboid,
  FileText,
  Grid3X3,
  Home,
  Info,
  Shapes,
  Sigma,
  Waves,
  Wrench,
} from "lucide-react";
import { ANVESHAK_STATISTICS_URL } from "../../data/externalLinks";

export const iconMap = {
  Atom,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Calculator,
  ChartSpline,
  CircleHelp,
  Cuboid,
  FileText,
  Grid3X3,
  Home,
  Info,
  Shapes,
  Sigma,
  Waves,
  Wrench,
};

export type NavItem = {
  title: string;
  route: string;
  icon: keyof typeof iconMap;
  isExternal?: boolean;
};

export type NavSection = {
  title: string;
  icon: keyof typeof iconMap;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    title: "Main",
    icon: "Home",
    items: [
      { title: "Home", route: "/", icon: "Home" },
      { title: "Math Lab", route: "/math-lab", icon: "BrainCircuit" },
      { title: "Math Workspace", route: "/workspace", icon: "Calculator" },
      { title: "Syllabus", route: "/syllabus", icon: "BookOpen" },
    ],
  },
  {
    title: "Core Topics",
    icon: "Sigma",
    items: [
      { title: "Algebra", route: "/algebra", icon: "Calculator" },
      { title: "Geometry", route: "/geometry", icon: "Shapes" },
      { title: "2D/3D Shapes", route: "/shapes", icon: "Cuboid" },
      { title: "Trigonometry", route: "/trigonometry", icon: "Waves" },
      { title: "Calculus", route: "/calculus", icon: "Sigma" },
      { title: "Complex Numbers", route: "/complex-numbers", icon: "Atom" },
    ],
  },
  {
    title: "Linear Algebra",
    icon: "Grid3X3",
    items: [
      { title: "Linear Algebra", route: "/linear-algebra", icon: "Grid3X3" },
      { title: "Matrix Operations", route: "/matrices", icon: "Grid3X3" },
      { title: "Matrix Sandbox", route: "/matrix-sandbox", icon: "Grid3X3" },
      { title: "Math Lab Linear Algebra", route: "/math-lab/linear-algebra", icon: "BrainCircuit" },
    ],
  },
  {
    title: "Graphing & Visuals",
    icon: "ChartSpline",
    items: [
      { title: "Graphing Calculator", route: "/math-lab/graphing-calculator", icon: "ChartSpline" },
      { title: "Function Explorer", route: "/math-lab/function-explorer", icon: "Waves" },
      { title: "Graph Compare", route: "/graph-comparison", icon: "Waves" },
      { title: "Parametric Curves", route: "/parametric-curves", icon: "Waves" },
      { title: "Polar Visualizer", route: "/polar-visualizer", icon: "Waves" },
      { title: "Fourier Animator", route: "/fourier-animator", icon: "Waves" },
      { title: "3D Surface Plotter", route: "/surface-plotter", icon: "Cuboid" },
      { title: "3D Graphing Lab", route: "/math-lab/3d-graphing", icon: "Cuboid" },
    ],
  },
  {
    title: "Solvers & Tools",
    icon: "Wrench",
    items: [
      { title: "Scientific Calculator", route: "/calculator", icon: "Calculator" },
      { title: "Problem Solver", route: "/problem-solver", icon: "Sigma" },
      { title: "Unit Converter", route: "/unit-converter", icon: "Calculator" },
      { title: "Truth Tables", route: "/truth-table", icon: "Sigma" },
      { title: "CAS Solver", route: "/math-lab/cas-solver", icon: "Sigma" },
      { title: "Equation Solver", route: "/math-lab/equation-solver", icon: "Calculator" },
    ],
  },
  {
    title: "Practice & Learning",
    icon: "BookOpen",
    items: [
      { title: "Learning Hub", route: "/learn", icon: "BookOpen" },
      { title: "Spaced Repetition", route: "/spaced-repetition", icon: "CircleHelp" },
      { title: "Daily Challenge", route: "/daily-challenge", icon: "CircleHelp" },
      { title: "Worked Examples", route: "/worked-examples", icon: "BookOpen" },
      { title: "Concept Graph", route: "/concept-graph", icon: "Grid3X3" },
      { title: "Quiz", route: "/quiz", icon: "CircleHelp" },
    ],
  },
  {
    title: "Data & Probability",
    icon: "BarChart3",
    items: [
      { title: "Statistics", route: ANVESHAK_STATISTICS_URL, icon: "BarChart3", isExternal: true },
      { title: "Probability Lab", route: "/probability-statistics", icon: "BarChart3" },
      { title: "Math Lab Statistics Link", route: "/math-lab/statistics", icon: "BarChart3" },
      { title: "Probability Shell", route: "/math-lab/probability", icon: "CircleHelp" },
    ],
  },
  {
    title: "Project",
    icon: "FileText",
    items: [
      { title: "AI Applications", route: "/ai-applications", icon: "BrainCircuit" },
      { title: "Smart Math Query", route: "/math-lab/query", icon: "BrainCircuit" },
      { title: "Documentation", route: "/documentation", icon: "FileText" },
      { title: "About", route: "/about", icon: "Info" },
    ],
  },
];

export const navItems = navSections.flatMap((section) => section.items.map((item) => ({
  ...item,
  icon: iconMap[item.icon],
})));

export const legacyNavItems = [
  { title: "Home", route: "/", icon: Home },
  { title: "Math Lab", route: "/math-lab", icon: BrainCircuit },
  { title: "Math Workspace", route: "/workspace", icon: Calculator },
  { title: "Algebra", route: "/algebra", icon: Calculator },
  { title: "Geometry", route: "/geometry", icon: Shapes },
  { title: "2D/3D Shapes", route: "/shapes", icon: Cuboid },
  { title: "Trigonometry", route: "/trigonometry", icon: Waves },
  { title: "Calculus", route: "/calculus", icon: Sigma },
  { title: "Complex Numbers", route: "/complex-numbers", icon: Atom },
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
  { title: "Graph Compare", route: "/graph-comparison", icon: Waves },
  { title: "Parametric Curves", route: "/parametric-curves", icon: Waves },
  { title: "3D Surface Plotter", route: "/surface-plotter", icon: Cuboid },
  { title: "Fourier Animator", route: "/fourier-animator", icon: Waves },
  { title: "Polar Visualizer", route: "/polar-visualizer", icon: Waves },
  { title: "Quiz", route: "/quiz", icon: CircleHelp },
  { title: "Documentation", route: "/documentation", icon: FileText },
  { title: "About", route: "/about", icon: Info },
];
