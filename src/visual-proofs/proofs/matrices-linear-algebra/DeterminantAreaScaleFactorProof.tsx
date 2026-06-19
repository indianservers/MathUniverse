import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { determinantPhaseNineteenConfig } from "../phase-nineteen/phaseNineteenProofConfigs";

export default function DeterminantAreaScaleFactorProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={determinantPhaseNineteenConfig} />;
}
