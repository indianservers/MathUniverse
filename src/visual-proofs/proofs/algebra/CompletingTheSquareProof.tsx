import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { completingSquarePhaseTwelveConfig } from "../phase-twelve/phaseTwelveProofConfigs";

export default function CompletingTheSquareProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={completingSquarePhaseTwelveConfig} />;
}
