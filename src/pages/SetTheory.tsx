import SetTheoryModule from "../modules/set-theory/SetTheoryModule";
import PhaseTwoDomainPanel from "../components/ui/PhaseTwoDomainPanel";

export default function SetTheory() {
  return <div className="space-y-4"><SetTheoryModule /><PhaseTwoDomainPanel domain="sets-relations-functions" /></div>;
}
