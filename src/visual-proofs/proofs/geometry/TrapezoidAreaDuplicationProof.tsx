import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { trapezoidAreaPhaseElevenConfig } from "../phase-eleven/phaseElevenProofConfigs";

export default function TrapezoidAreaDuplicationProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={trapezoidAreaPhaseElevenConfig} />;
}
