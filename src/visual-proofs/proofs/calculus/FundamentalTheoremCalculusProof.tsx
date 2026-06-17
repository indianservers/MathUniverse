import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { fundamentalTheoremPhaseFifteenConfig } from "../phase-fifteen/phaseFifteenProofConfigs";

export default function FundamentalTheoremCalculusProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={fundamentalTheoremPhaseFifteenConfig} />;
}
