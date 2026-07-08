export type ARPracticeActivity = {
  id: string;
  title: string;
  level: "Beginner" | "Core" | "Challenge";
  topic: "Surfaces" | "Curves" | "Solids" | "Planes" | "Measurement" | "Classroom";
  exampleId: string;
  goal: string;
  steps: string[];
  hints: string[];
  evidencePrompt: string;
  expectedActions: Array<"load" | "place" | "walk" | "measure" | "animate" | "compare" | "capture">;
};

export const arPracticeActivities: ARPracticeActivity[] = [
  {
    id: "walk-wave-surface",
    title: "Walk Around A Wave Surface",
    level: "Beginner",
    topic: "Surfaces",
    exampleId: "surface-sine-product",
    goal: "See how peaks and valleys change when you view the surface from different sides.",
    steps: ["Load the wave surface.", "Place it in 3D Preview or AR.", "Rotate or walk around it.", "Find one peak, one valley, and one zero-height line."],
    hints: ["Peaks happen when sin(x) and sin(y) have the same sign.", "Look from above to see a checkerboard pattern."],
    evidencePrompt: "Write one sentence explaining why the surface has both hills and valleys.",
    expectedActions: ["load", "place", "walk", "capture"],
  },
  {
    id: "paraboloid-contours",
    title: "Paraboloid Level Curves",
    level: "Core",
    topic: "Planes",
    exampleId: "intersection-paraboloid-plane",
    goal: "Connect a 3D bowl shape to circular cross-sections.",
    steps: ["Load the paraboloid slice.", "Turn on labels and grid.", "Imagine a horizontal plane cutting the bowl.", "Predict the shape of the slice."],
    hints: ["All points with the same z-value have the same distance from the origin.", "That equal distance makes a circle."],
    evidencePrompt: "Explain why the cross-section is circular, not square.",
    expectedActions: ["load", "place", "measure", "capture"],
  },
  {
    id: "cone-vs-cylinder",
    title: "Cone And Cylinder Volume",
    level: "Core",
    topic: "Solids",
    exampleId: "solid-small-cone",
    goal: "Compare a cone with a cylinder that has the same radius and height.",
    steps: ["Load the cone.", "Generate a cylinder with radius 5 cm and height 12 cm.", "Use Compare mode.", "Read both volume formulas."],
    hints: ["The cone volume is one-third of the matching cylinder.", "Use the same radius and height before comparing."],
    evidencePrompt: "Record the ratio of cone volume to cylinder volume.",
    expectedActions: ["load", "compare", "measure"],
  },
  {
    id: "helix-parameter",
    title: "Helix Parameter Trail",
    level: "Challenge",
    topic: "Curves",
    exampleId: "curve-helix",
    goal: "Understand how parameter t moves a point through space.",
    steps: ["Load the helix.", "Use curve point markers.", "Rotate the scene.", "Describe how x, y, and z change as t increases."],
    hints: ["x and y circle around the axis.", "z keeps increasing."],
    evidencePrompt: "Describe the motion using the words circle and height.",
    expectedActions: ["load", "walk", "animate"],
  },
  {
    id: "real-object-cylinder",
    title: "Match A Real Cylinder",
    level: "Beginner",
    topic: "Measurement",
    exampleId: "solid-cylinder",
    goal: "Measure a real cylindrical object and build a matching AR solid.",
    steps: ["Measure radius and height of a cup or can.", "Enter those values in centimeters.", "Generate the solid.", "Compare the AR object to the real object."],
    hints: ["Radius is half the diameter.", "Keep units consistent."],
    evidencePrompt: "List the measured radius, height, and calculated volume.",
    expectedActions: ["measure", "place", "capture"],
  },
  {
    id: "teacher-surface-demo",
    title: "Classroom Surface Discussion",
    level: "Core",
    topic: "Classroom",
    exampleId: "surface-saddle",
    goal: "Use Teacher Mode to guide a class discussion about saddle points.",
    steps: ["Load the saddle surface.", "Enable Teacher Mode.", "Ask students to inspect x-direction and y-direction curves.", "Compare with the paraboloid."],
    hints: ["A saddle rises in one direction and falls in another.", "The origin is not a maximum or minimum."],
    evidencePrompt: "Ask students to vote: maximum, minimum, or neither. Then justify.",
    expectedActions: ["load", "walk", "compare"],
  },
];
