import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { sectionFormulaPhaseNineConfig } from "../phase-nine/phaseNineProofConfigs";

export default function SectionFormulaProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={sectionFormulaPhaseNineConfig} />;
}
