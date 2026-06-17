import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { arcLengthFormulaPhaseSevenConfig } from "../phase-seven/phaseSevenProofConfigs";

export default function ArcLengthFormulaProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={arcLengthFormulaPhaseSevenConfig} />;
}
