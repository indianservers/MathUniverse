import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { triangleAreaSineFormulaPhaseSixConfig } from "../phase-six/phaseSixProofConfigs";

export default function TriangleAreaSineFormulaProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={triangleAreaSineFormulaPhaseSixConfig} />;
}
