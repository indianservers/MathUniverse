import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { congruenceRigidMotionsPhaseTwentySixConfig } from "../phase-twenty-six/phaseTwentySixProofConfigs";

export default function CongruenceRigidMotionsProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={congruenceRigidMotionsPhaseTwentySixConfig} />;
}
