import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { threeTermSquarePhaseTwelveConfig } from "../phase-twelve/phaseTwelveProofConfigs";

export default function ThreeTermSquareProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={threeTermSquarePhaseTwelveConfig} />;
}
