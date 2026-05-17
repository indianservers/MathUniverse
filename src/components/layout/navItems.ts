import {
  Atom,
  BarChart3,
  BrainCircuit,
  Calculator,
  CircleHelp,
  Grid3X3,
  Home,
  Info,
  Shapes,
  Sigma,
  Waves,
} from "lucide-react";

export const iconMap = {
  Atom,
  BarChart3,
  BrainCircuit,
  Calculator,
  CircleHelp,
  Grid3X3,
  Home,
  Info,
  Shapes,
  Sigma,
  Waves,
};

export const navItems = [
  { title: "Home", route: "/", icon: Home },
  { title: "Algebra", route: "/algebra", icon: Calculator },
  { title: "Geometry", route: "/geometry", icon: Shapes },
  { title: "Trigonometry", route: "/trigonometry", icon: Waves },
  { title: "Calculus", route: "/calculus", icon: Sigma },
  { title: "Complex Numbers", route: "/complex-numbers", icon: Atom },
  { title: "Statistics", route: "/statistics", icon: BarChart3 },
  { title: "Linear Algebra", route: "/linear-algebra", icon: Grid3X3 },
  { title: "AI Applications", route: "/ai-applications", icon: BrainCircuit },
  { title: "Quiz", route: "/quiz", icon: CircleHelp },
  { title: "About", route: "/about", icon: Info },
];
