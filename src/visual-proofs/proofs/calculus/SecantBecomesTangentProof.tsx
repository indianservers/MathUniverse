import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { secantBecomesTangentPhaseFourteenConfig } from "../phase-fourteen/phaseFourteenProofConfigs";

export default function SecantBecomesTangentProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={secantBecomesTangentPhaseFourteenConfig} />;
}
