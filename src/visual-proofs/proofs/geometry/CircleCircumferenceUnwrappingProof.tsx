import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience, type PhaseTwoProofConfig } from "../../components/PhaseTwoProofExperience";
import { CircleAreaUnrollGuide } from "../phase-eleven/PhaseElevenGeometryVisualModels";

const round = (value: number, digits = 2) => Number(value.toFixed(digits));

const circleCircumferenceTriangleConfig: PhaseTwoProofConfig = {
  steps: [
    "Show the circle and its radius",
    "Cut the circumference at one point",
    "Unwrap the boundary into a straight strip",
    "Read the outside strip as 2 pi r",
    "Stack shorter circular strips below it",
    "See the triangle with base 2 pi r and height r",
  ].map((title, index) => ({ id: `circle-unwrapping-${index}`, title, description: title, focusLabel: index < 2 ? "circle" : index < 4 ? "circumference" : "triangle" })),
  parameters: [
    { id: "radius", label: "Radius r", min: 3, max: 5, defaultValue: 5, step: 1 },
    { id: "sectors", label: "Ring samples", min: 12, max: 60, defaultValue: 40, step: 4 },
  ],
  toggles: [{ id: "labels", label: "Show labels", defaultValue: true }],
  olympyardRoute: "/olympyard/practice/circles",
  prediction: {
    question: "When the outside boundary is cut and straightened, how long is it?",
    correctFeedback: "Yes. The outside strip is the circumference, 2 pi r.",
    incorrectFeedback: "Follow the outer boundary after it unwraps into a straight strip.",
    revealAfterAnswer: true,
    options: [
      { id: "circumference", label: "2 pi r", correct: true, feedback: "Correct." },
      { id: "diameter", label: "2r", feedback: "That is the diameter, not the full boundary length." },
      { id: "area", label: "pi r^2", feedback: "That is area; this strip is a length." },
    ],
  },
  misconception: {
    question: "Is the unwrapped boundary the same length as the diameter?",
    explanation: "No. The diameter is 2r, while the full boundary unwraps to pi diameters, or 2 pi r.",
    visualHint: "Compare the straight outside strip with the radius and diameter relationships.",
    options: [
      { id: "longer", label: "No, it unwraps to 2 pi r.", correct: true, feedback: "Correct." },
      { id: "same", label: "Yes, it is just 2r.", feedback: "The diameter crosses the circle once; the boundary goes all the way around." },
    ],
  },
  formulaTokens: () => [
    { id: "r", label: "r", visualLabel: "radius" },
    { id: "circumference", label: "2 pi r", visualLabel: "unwrapped outside strip" },
    { id: "half", label: "1/2", visualLabel: "triangle comparison" },
    { id: "area", label: "triangle stack", visualLabel: "circle-to-triangle continuation" },
  ],
  formula: ({ radius }) => `C = 2 pi r = 2 pi(${radius}) ~= ${round(2 * Math.PI * radius)}`,
  explanation: ({ radius }) => `The outer boundary unwraps to one straight strip of length 2 pi r = ${round(2 * Math.PI * radius)}. The triangle continuation shows how these circular strips can also explain circle area, but this page keeps the circumference strip as the key object.`,
  liveValues: ({ radius }) => [
    { id: "radius", label: "Radius", value: radius },
    { id: "diameter", label: "Diameter", value: 2 * radius },
    { id: "circumference", label: "Circumference", value: round(2 * Math.PI * radius), exactValue: `2 pi(${radius})` },
    { id: "pi-diameters", label: "Diameter count", value: "pi diameters" },
  ],
  invariants: ({ radius }) => [
    { id: "circumference", label: "C = 2 pi r", holds: true, explanation: `The unwrapped outside strip has length 2 pi(${radius}).` },
  ],
  assumptions: ["The boundary is cut and straightened without stretching.", "Ring-strip stacking is a visual continuation of the same circle unwrapping idea.", "Decimal values use rounded pi."],
  renderVisual: CircleAreaUnrollGuide,
};

export default function CircleCircumferenceUnwrappingProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={circleCircumferenceTriangleConfig} />;
}
