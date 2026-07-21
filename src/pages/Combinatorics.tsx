import CombinatoricsModule from "../modules/combinatorics/CombinatoricsModule";
import PhaseTwoDomainPanel from "../components/ui/PhaseTwoDomainPanel";

export default function Combinatorics() {
  return <div className="space-y-4"><CombinatoricsModule /><PhaseTwoDomainPanel domain="combinatorics" /></div>;
}
