import { phaseTwoAdvancedContracts } from "./registry";
import { phaseTwoSystemContracts } from "./systemContracts";
import type { CertificationEvidence } from "./types";
import { deriveCertificationStatus } from "./validatePhaseTwo";

export const phaseTwoCertificationEvidence: CertificationEvidence[] = [
  ...phaseTwoAdvancedContracts.map((contract) => ({ contractId: contract.id, mathematical: "passed", content: "passed", assessment: "passed", accessibility: "partial", browser: "missing", reviewer: null, reviewedAt: null } as const)),
  ...phaseTwoSystemContracts.map((contract) => ({ contractId: contract.id, mathematical: contract.area === "curriculum" || contract.area === "certification" ? "partial" : "missing", content: "partial", assessment: contract.area === "practice" ? "partial" : "missing", accessibility: "partial", browser: "missing", reviewer: null, reviewedAt: null } as const)),
];

export function phaseTwoCertificationSummary() {
  const statuses = phaseTwoCertificationEvidence.map(deriveCertificationStatus);
  return {
    total: statuses.length,
    inventory: statuses.filter((status) => status === "inventory").length,
    inProgress: statuses.filter((status) => status === "in-progress").length,
    certified: statuses.filter((status) => status === "certified").length,
  };
}
