import { ANVESHAK_STATISTICS_URL } from "./externalLinks";

export type TopicDifficulty = "Foundational" | "Intermediate" | "Advanced";

export type Topic = {
  id: string;
  title: string;
  route: string;
  isExternal?: boolean;
  iconName: string;
  description: string;
  concepts: string[];
  difficulty: TopicDifficulty;
  estimatedMinutes: number;
  colorGradient: string;
  labCount: number;
};

export const topics: Topic[] = [
  {
    id: "algebra",
    title: "Algebra Visualizations",
    route: "/algebra",
    iconName: "Calculator",
    description: "Explore equations, slopes, parabolas, roots, and transformations through live graphs.",
    concepts: ["Linear equations", "Quadratics", "Roots", "Transformations"],
    difficulty: "Foundational",
    estimatedMinutes: 35,
    colorGradient: "from-cyan-500 to-blue-600",
    labCount: 6,
  },
  {
    id: "geometry",
    title: "Geometry Universe",
    route: "/geometry",
    iconName: "Shapes",
    description: "Measure shapes, angles, areas, circles, and spatial relationships visually.",
    concepts: ["Triangles", "Circles", "Area", "Coordinate geometry"],
    difficulty: "Foundational",
    estimatedMinutes: 40,
    colorGradient: "from-emerald-400 to-cyan-600",
    labCount: 7,
  },
  {
    id: "trigonometry",
    title: "Trigonometry & Waves",
    route: "/trigonometry",
    iconName: "Waves",
    description: "Connect unit circles, sine waves, phase, amplitude, and real signals.",
    concepts: ["Unit circle", "Sine", "Cosine", "Wave motion"],
    difficulty: "Intermediate",
    estimatedMinutes: 45,
    colorGradient: "from-violet-500 to-fuchsia-600",
    labCount: 7,
  },
  {
    id: "calculus",
    title: "Calculus Explorer",
    route: "/calculus",
    iconName: "Sigma",
    description: "Build intuition for limits, slopes, derivatives, integrals, and accumulation.",
    concepts: ["Limits", "Derivatives", "Integrals", "Motion"],
    difficulty: "Advanced",
    estimatedMinutes: 55,
    colorGradient: "from-orange-400 to-rose-600",
    labCount: 8,
  },
  {
    id: "complex",
    title: "Complex Numbers & Euler's Formula",
    route: "/complex-numbers",
    iconName: "Atom",
    description: "Move between rectangular and polar form and see Euler's identity on the plane.",
    concepts: ["Complex plane", "Polar form", "Euler formula", "Rotation"],
    difficulty: "Advanced",
    estimatedMinutes: 50,
    colorGradient: "from-indigo-500 to-cyan-500",
    labCount: 6,
  },
  {
    id: "statistics",
    title: "Statistics with Anveshak",
    route: ANVESHAK_STATISTICS_URL,
    isExternal: true,
    iconName: "BarChart3",
    description: "Open the dedicated Anveshak statistics app for distributions, variation, regression, and uncertainty.",
    concepts: ["Anveshak", "Statistics", "Probability", "External app"],
    difficulty: "Intermediate",
    estimatedMinutes: 45,
    colorGradient: "from-teal-400 to-lime-500",
    labCount: 0,
  },
  {
    id: "linear-algebra",
    title: "Linear Algebra Lab",
    route: "/linear-algebra",
    iconName: "Grid3X3",
    description: "Visualize vectors, matrices, transformations, rotations, scaling, and shearing.",
    concepts: ["Vectors", "Matrices", "Transforms", "Basis"],
    difficulty: "Advanced",
    estimatedMinutes: 60,
    colorGradient: "from-sky-500 to-violet-600",
    labCount: 8,
  },
  {
    id: "matrices",
    title: "Matrices and Linear Algebra",
    route: "/matrices",
    iconName: "Grid3X3",
    description: "Master matrix basics, arithmetic, determinants, inverse, rank, row operations, systems, eigenvectors, and transformations.",
    concepts: ["Matrix basics", "Operations", "Determinants", "Linear systems"],
    difficulty: "Advanced",
    estimatedMinutes: 75,
    colorGradient: "from-cyan-500 to-violet-600",
    labCount: 14,
  },
  {
    id: "ai",
    title: "Math in AI & Real Life",
    route: "/ai-applications",
    iconName: "BrainCircuit",
    description: "See how mathematical structures power AI, robotics, graphics, security, and signals.",
    concepts: ["Neural networks", "Optimization", "Signals", "Robotics"],
    difficulty: "Intermediate",
    estimatedMinutes: 40,
    colorGradient: "from-purple-500 to-pink-500",
    labCount: 6,
  },
  {
    id: "quiz",
    title: "Quiz Zone",
    route: "/quiz",
    iconName: "CircleHelp",
    description: "Practice core ideas and store your local score history as the course grows.",
    concepts: ["Concept checks", "Feedback", "Review", "Progress"],
    difficulty: "Foundational",
    estimatedMinutes: 20,
    colorGradient: "from-amber-400 to-orange-600",
    labCount: 4,
  },
];
