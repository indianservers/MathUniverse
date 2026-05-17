export type TrigonometryVisualType =
  | "unit-circle"
  | "sine-cosine-wave"
  | "eclipse"
  | "experiment-catalog"
  | "wave-applications"
  | "right-triangle"
  | "ratio"
  | "angle-measure"
  | "identity"
  | "graph-transform"
  | "inverse"
  | "law"
  | "bearing"
  | "height-distance"
  | "polar";

export type TrigonometryConcept = {
  id: string;
  title: string;
  category: string;
  summary: string;
  formula: string;
  visual: TrigonometryVisualType;
  sliderA: string;
  sliderB: string;
  minA: number;
  maxA: number;
  stepA: number;
  minB: number;
  maxB: number;
  stepB: number;
  defaultA: number;
  defaultB: number;
  use: string;
  tasks: string[];
};

export const trigonometryConcepts: TrigonometryConcept[] = [
  { id: "unit-circle", title: "Unit Circle", category: "Foundations", summary: "Read sine and cosine as coordinates of a point rotating on a circle.", formula: "x=cos(theta), y=sin(theta)", visual: "unit-circle", sliderA: "Angle theta", sliderB: "Radius", minA: 0, maxA: 360, stepA: 1, minB: 1, maxB: 1, stepB: 1, defaultA: 45, defaultB: 1, use: "Waves, rotation, circular motion, signals.", tasks: ["Move theta through all quadrants.", "Find where sine is zero.", "Find where cosine is negative."] },
  { id: "right-triangle-ratios", title: "Right Triangle Ratios", category: "Foundations", summary: "Sine, cosine, and tangent compare opposite, adjacent, and hypotenuse sides.", formula: "sin theta=opp/hyp, cos theta=adj/hyp, tan theta=opp/adj", visual: "right-triangle", sliderA: "Angle theta", sliderB: "Hypotenuse", minA: 10, maxA: 80, stepA: 1, minB: 90, maxB: 210, stepB: 5, defaultA: 35, defaultB: 160, use: "Ramps, ladders, navigation, construction.", tasks: ["Increase theta.", "Compare opposite and adjacent.", "Estimate tan theta visually."] },
  { id: "degree-radian", title: "Degrees and Radians", category: "Foundations", summary: "Radians measure angle by arc length over radius.", formula: "radians = degrees*pi/180, theta=s/r", visual: "angle-measure", sliderA: "Degrees", sliderB: "Radius", minA: 0, maxA: 360, stepA: 1, minB: 60, maxB: 170, stepB: 5, defaultA: 90, defaultB: 120, use: "Calculus, physics, circular motion.", tasks: ["Set 180 degrees.", "Compare arc length and radius.", "Find pi/2 radians."] },
  { id: "sine-graph", title: "Sine Graph", category: "Graphs", summary: "The y-coordinate of circular motion unfolds into a sine wave.", formula: "y=A sin(fx+phi)", visual: "sine-cosine-wave", sliderA: "Amplitude", sliderB: "Frequency", minA: 0.5, maxA: 5, stepA: 0.1, minB: 0.5, maxB: 5, stepB: 0.1, defaultA: 2, defaultB: 1, use: "Sound, tides, AC current, vibration.", tasks: ["Double amplitude.", "Increase frequency.", "Move phase in the full visualizer."] },
  { id: "cosine-graph", title: "Cosine Graph", category: "Graphs", summary: "The x-coordinate of circular motion unfolds into a cosine wave.", formula: "y=A cos(fx+phi)", visual: "graph-transform", sliderA: "Amplitude A", sliderB: "Frequency f", minA: 0.5, maxA: 5, stepA: 0.1, minB: 0.5, maxB: 4, stepB: 0.1, defaultA: 2, defaultB: 1, use: "Oscillation, projection, wave models.", tasks: ["Compare cosine start value.", "Change amplitude.", "Change frequency."] },
  { id: "tangent-graph", title: "Tangent Graph", category: "Graphs", summary: "Tangent grows from sine divided by cosine and has vertical asymptotes.", formula: "tan theta=sin theta/cos theta", visual: "graph-transform", sliderA: "Scale", sliderB: "Horizontal stretch", minA: 0.5, maxA: 3, stepA: 0.1, minB: 0.5, maxB: 3, stepB: 0.1, defaultA: 1, defaultB: 1, use: "Slope, angles, optics.", tasks: ["Find where cosine is zero.", "Observe steep growth.", "Compare with sine."] },
  { id: "reciprocal-ratios", title: "Sec, Cosec, Cot", category: "Ratios", summary: "Secant, cosecant, and cotangent are reciprocal trigonometric ratios.", formula: "sec=1/cos, cosec=1/sin, cot=1/tan", visual: "ratio", sliderA: "Angle theta", sliderB: "Scale", minA: 10, maxA: 80, stepA: 1, minB: 1, maxB: 4, stepB: 0.1, defaultA: 40, defaultB: 2, use: "Advanced identities, calculus, triangle solving.", tasks: ["Find reciprocal pairs.", "Avoid zero denominators.", "Compare cot and tan."] },
  { id: "pythagorean-identity", title: "Pythagorean Identity", category: "Identities", summary: "The unit circle proves sin squared plus cos squared equals one.", formula: "sin^2(theta)+cos^2(theta)=1", visual: "identity", sliderA: "Angle theta", sliderB: "Radius", minA: 0, maxA: 360, stepA: 1, minB: 1, maxB: 1, stepB: 1, defaultA: 35, defaultB: 1, use: "Equation solving, simplification, calculus.", tasks: ["Check different quadrants.", "Square coordinates.", "Add the squares."] },
  { id: "complementary-angles", title: "Complementary Angles", category: "Identities", summary: "Sine of an angle equals cosine of its complement.", formula: "sin(theta)=cos(90deg-theta)", visual: "identity", sliderA: "Angle theta", sliderB: "Reference size", minA: 0, maxA: 90, stepA: 1, minB: 80, maxB: 180, stepB: 5, defaultA: 35, defaultB: 130, use: "Triangle shortcuts and proofs.", tasks: ["Move theta.", "Read 90-theta.", "Compare ratios."] },
  { id: "sum-difference", title: "Sum and Difference Formulas", category: "Identities", summary: "Trig values of combined angles can be built from simpler angles.", formula: "sin(a+b)=sin a cos b + cos a sin b", visual: "identity", sliderA: "Angle a", sliderB: "Angle b", minA: 0, maxA: 180, stepA: 1, minB: 0, maxB: 180, stepB: 1, defaultA: 30, defaultB: 45, use: "Proofs, exact values, rotations.", tasks: ["Set 30 and 45.", "Compare a+b.", "Check exact angle patterns."] },
  { id: "double-angle", title: "Double Angle Formulas", category: "Identities", summary: "Double-angle identities express trig values at 2 theta.", formula: "sin 2theta=2 sin theta cos theta", visual: "identity", sliderA: "Angle theta", sliderB: "Scale", minA: 0, maxA: 180, stepA: 1, minB: 1, maxB: 3, stepB: 0.1, defaultA: 45, defaultB: 1, use: "Equation solving and wave transformations.", tasks: ["Double theta.", "Compare sin theta and sin 2theta.", "Try theta=45."] },
  { id: "inverse-trig", title: "Inverse Trigonometry", category: "Equations", summary: "Inverse trig functions recover an angle from a ratio.", formula: "theta=sin^-1(opposite/hypotenuse)", visual: "inverse", sliderA: "Ratio", sliderB: "Hypotenuse", minA: -1, maxA: 1, stepA: 0.01, minB: 80, maxB: 180, stepB: 5, defaultA: 0.5, defaultB: 150, use: "Finding angles from measurements.", tasks: ["Set ratio to 0.5.", "Read theta.", "Discuss valid ratio range."] },
  { id: "trig-equations", title: "Trigonometric Equations", category: "Equations", summary: "Trig equations usually have repeating solutions because waves repeat.", formula: "sin theta = k", visual: "inverse", sliderA: "Value k", sliderB: "Period count", minA: -1, maxA: 1, stepA: 0.01, minB: 1, maxB: 4, stepB: 1, defaultA: 0.5, defaultB: 2, use: "Modeling periodic events and solving exams.", tasks: ["Find two solutions in 0-360.", "Change k.", "Observe repeated solutions."] },
  { id: "height-distance", title: "Heights and Distances", category: "Applications", summary: "Use tangent to estimate height from distance and angle of elevation.", formula: "height = distance * tan(theta)", visual: "height-distance", sliderA: "Angle of elevation", sliderB: "Distance", minA: 5, maxA: 80, stepA: 1, minB: 60, maxB: 260, stepB: 5, defaultA: 35, defaultB: 170, use: "Trees, buildings, towers, surveying.", tasks: ["Increase distance.", "Increase angle.", "Estimate height."] },
  { id: "bearings-navigation", title: "Bearings and Navigation", category: "Applications", summary: "Bearings use angles from north to describe direction.", formula: "bearing angle measured clockwise from north", visual: "bearing", sliderA: "Bearing", sliderB: "Distance", minA: 0, maxA: 360, stepA: 1, minB: 60, maxB: 190, stepB: 5, defaultA: 60, defaultB: 140, use: "Maps, aviation, ships, robotics.", tasks: ["Set east bearing.", "Set southwest bearing.", "Resolve into x and y movement."] },
  { id: "law-of-sines", title: "Law of Sines", category: "Triangle Solving", summary: "Sides and opposite angles in any triangle follow a constant ratio.", formula: "a/sin A = b/sin B = c/sin C", visual: "law", sliderA: "Angle A", sliderB: "Angle B", minA: 20, maxA: 120, stepA: 1, minB: 20, maxB: 120, stepB: 1, defaultA: 45, defaultB: 65, use: "Surveying, navigation, triangulation.", tasks: ["Change angle A.", "Keep total below 180.", "Compare opposite sides."] },
  { id: "law-of-cosines", title: "Law of Cosines", category: "Triangle Solving", summary: "A generalized Pythagoras formula for any triangle.", formula: "c^2=a^2+b^2-2ab cos C", visual: "law", sliderA: "Included angle C", sliderB: "Side scale", minA: 20, maxA: 150, stepA: 1, minB: 80, maxB: 180, stepB: 5, defaultA: 70, defaultB: 130, use: "Unknown side lengths, vectors, physics.", tasks: ["Set C=90.", "Compare with Pythagoras.", "Increase C."] },
  { id: "polar-coordinates", title: "Polar Coordinates", category: "Advanced", summary: "A point can be described by distance r and angle theta.", formula: "x=r cos theta, y=r sin theta", visual: "polar", sliderA: "Angle theta", sliderB: "Radius r", minA: 0, maxA: 360, stepA: 1, minB: 40, maxB: 180, stepB: 5, defaultA: 45, defaultB: 120, use: "Robotics, radar, complex numbers.", tasks: ["Move radius.", "Rotate theta.", "Convert to x and y."] },
  { id: "wave-amplitude", title: "Amplitude", category: "Wave Parameters", summary: "Amplitude controls wave height from the middle line.", formula: "y=A sin x", visual: "graph-transform", sliderA: "Amplitude A", sliderB: "Frequency", minA: 0.5, maxA: 5, stepA: 0.1, minB: 1, maxB: 1, stepB: 1, defaultA: 2, defaultB: 1, use: "Sound loudness, vibration strength.", tasks: ["Double amplitude.", "Watch max/min.", "Keep period unchanged."] },
  { id: "wave-period-frequency", title: "Period and Frequency", category: "Wave Parameters", summary: "Frequency controls how many cycles happen; period is one cycle length.", formula: "period = 2pi/f", visual: "graph-transform", sliderA: "Amplitude", sliderB: "Frequency f", minA: 1, maxA: 1, stepA: 1, minB: 0.5, maxB: 5, stepB: 0.1, defaultA: 1, defaultB: 2, use: "Music, radio, rotating machines.", tasks: ["Increase f.", "Count cycles.", "Compare period."] },
  { id: "phase-shift", title: "Phase Shift", category: "Wave Parameters", summary: "Phase moves a wave left or right without changing its height.", formula: "y=sin(x+phi)", visual: "graph-transform", sliderA: "Phase phi", sliderB: "Amplitude", minA: -180, maxA: 180, stepA: 1, minB: 1, maxB: 4, stepB: 0.1, defaultA: 45, defaultB: 1, use: "Signal delay and synchronization.", tasks: ["Shift left.", "Shift right.", "Compare start point."] },
  { id: "eclipse-trigonometry", title: "Eclipse Trigonometry", category: "Applications", summary: "Apparent angle, alignment, and light cones decide eclipse type.", formula: "angular size approx diameter/distance", visual: "eclipse", sliderA: "Alignment", sliderB: "Light cone", minA: -1, maxA: 1, stepA: 0.01, minB: 0.35, maxB: 0.7, stepB: 0.01, defaultA: 0, defaultB: 0.53, use: "Astronomy, shadows, angular measurement.", tasks: ["Align centers.", "Change Moon size.", "Classify eclipse."] },
  { id: "real-world-waves", title: "Real-World Waves", category: "Applications", summary: "Trigonometric waves describe sound, electricity, light, tides, and signals.", formula: "wave = A sin(omega t + phi)", visual: "wave-applications", sliderA: "Amplitude", sliderB: "Frequency", minA: 1, maxA: 5, stepA: 0.1, minB: 1, maxB: 5, stepB: 0.1, defaultA: 2, defaultB: 2, use: "Engineering, communication, physics.", tasks: ["Compare applications.", "Find repeating patterns.", "Connect graph to signal."] },
  { id: "inquiry-experiments", title: "50+ Trigonometry Experiments", category: "Practice", summary: "A categorized catalog of quick experiments for class activities and exploration.", formula: "predict -> test -> explain", visual: "experiment-catalog", sliderA: "Experiment", sliderB: "Level", minA: 1, maxA: 50, stepA: 1, minB: 1, maxB: 5, stepB: 1, defaultA: 1, defaultB: 1, use: "Classroom inquiry and revision.", tasks: ["Pick an experiment.", "Predict first.", "Record evidence."] },
];

export function getTrigonometryConcept(id?: string) {
  return trigonometryConcepts.find((concept) => concept.id === id);
}
