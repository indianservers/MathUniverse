import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { productOfBinomialsPhaseFourConfig } from "../phase-four/phaseFourProofConfigs";

export default function ProductOfBinomialsProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={productOfBinomialsPhaseFourConfig} />;
}
