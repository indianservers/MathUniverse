import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { radiansArcRadiusPhaseFiveConfig } from "../phase-five/phaseFiveProofConfigs";

export default function RadiansArcRadiusProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={radiansArcRadiusPhaseFiveConfig} />;
}
