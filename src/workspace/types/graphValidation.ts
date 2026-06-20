export type GraphValidationStatus =
  | "valid"
  | "invalid"
  | "unsupported"
  | "warning";

export interface GraphValidationResult {
  status: GraphValidationStatus;
  input: string;
  message: string;
  suggestions?: string[];
}
