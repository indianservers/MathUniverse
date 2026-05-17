export type ApplicationCard = {
  title: string;
  domain: string;
  description: string;
  math: string[];
};

export const applicationCards: ApplicationCard[] = [
  { title: "GPS", domain: "Navigation", description: "Triangulates position from satellite distances and timing.", math: ["Geometry", "Linear algebra", "Optimization"] },
  { title: "Radar systems", domain: "Sensing", description: "Measures distance and velocity from reflected waves.", math: ["Trigonometry", "Calculus", "Signals"] },
  { title: "Sound waves", domain: "Audio", description: "Models pitch, resonance, and interference patterns.", math: ["Sine waves", "Fourier analysis", "Statistics"] },
  { title: "Electrical engineering", domain: "Circuits", description: "Uses complex numbers to represent alternating current.", math: ["Complex numbers", "Differential equations", "Vectors"] },
  { title: "Computer graphics", domain: "Rendering", description: "Transforms 3D objects into pixels with matrices.", math: ["Linear algebra", "Geometry", "Calculus"] },
  { title: "Cryptography", domain: "Security", description: "Protects data using number theory and algebraic structures.", math: ["Modular arithmetic", "Probability", "Algebra"] },
  { title: "Neural networks", domain: "AI", description: "Learns patterns through matrix operations and gradients.", math: ["Linear algebra", "Calculus", "Statistics"] },
  { title: "Robotics", domain: "Automation", description: "Plans motion using transformations, sensors, and optimization.", math: ["Geometry", "Matrices", "Control"] },
  { title: "Image compression", domain: "Media", description: "Reduces visual data by transforming and quantizing signals.", math: ["Transforms", "Statistics", "Linear algebra"] },
  { title: "Signal processing", domain: "Communication", description: "Filters, analyzes, and reconstructs signals from samples.", math: ["Trigonometry", "Complex numbers", "Probability"] },
];
