import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { rightTriangleTrigRatiosPhaseFiveConfig } from "../phase-five/phaseFiveProofConfigs";

export default function RightTriangleTrigRatiosProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={rightTriangleTrigRatiosPhaseFiveConfig} />;
}
