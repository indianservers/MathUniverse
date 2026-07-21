import { phaseTwoAdvancedContracts as firstAdvancedContracts } from "./advancedRoadmap";
import { graphAiContracts } from "./graphAiRoadmap";
import { linearStatsContracts } from "./linearStatsRoadmap";

export const phaseTwoAdvancedContracts = [...firstAdvancedContracts, ...linearStatsContracts, ...graphAiContracts];

export function phaseTwoAdvancedById(id: string) {
  return phaseTwoAdvancedContracts.find((contract) => contract.id === id);
}
