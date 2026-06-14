import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import SequenceSeriesProofTemplate from "./SequenceSeriesProofTemplate";
import { sequenceSeriesProofConfigs } from "./sequenceSeriesProofConfigs";

export default function SquareNumbersOddLayersProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <SequenceSeriesProofTemplate category={category} proof={proof} config={sequenceSeriesProofConfigs.SquareNumbersOddLayersProof} />;
}
