import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { eigenvectorsPhaseNineteenConfig } from "../phase-nineteen/phaseNineteenProofConfigs";

export default function EigenvectorsDirectionsDoNotTurnProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={eigenvectorsPhaseNineteenConfig} />;
}
