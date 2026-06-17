import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { sectorAreaPhaseElevenConfig } from "../phase-eleven/phaseElevenProofConfigs";

export default function SectorAreaFormulaProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={sectorAreaPhaseElevenConfig} />;
}
