import type { IntelligenceMode, VisualCommand } from '../../offline-intelligence/commands';
export type RoboMode = IntelligenceMode;
export type RoboTarget = string | { id?: string; name?: string; type?: string; color?: string; index?: number; relation?: 'nearest'|'largest'|'smallest'|'longest'|'leftmost'|'horizontal'|'vertical'|'above'|'below'|'through'|'inside'; to?: string; reference?:'lastReferenced' };
export type RoboParameters = {
  preserveTargets?: RoboTarget[];
  width?: number; height?: number; depth?: number; radius?: number; diameter?: number; sides?: number;
  position?: number[]; points?: number[][]; vector?: number[]; dx?: number; dy?: number; dz?: number;
  angle?: number; axis?: string; plane?: string; factor?: number; expression?: string;
  color?: string; label?: string; count?: number; reference?: RoboTarget; legacy?: VisualCommand;
  [key: string]: unknown;
};
export type MathRoboCommand = {
  id: string; rawPhrase: string; normalizedPhrase: string; detectedAction: string; action: string; subAction: string;
  mode: RoboMode; target?: RoboTarget; targets?: RoboTarget[]; parameters: RoboParameters;
  confidence: { overall: number; action: number; subAction: number; target?: number; parameters?: number };
  source: { action: 'model'|'rule'|'correction'|'context'; subAction: 'model'|'rule'|'correction'|'context' };
  requiresExecution: boolean;
};
export type MathRoboPlan = { actionGraph?:import('./actionGraph').ActionGraph; ir?:import('./commandIR').CommandIR[]; atomicity?:'all-or-nothing'; rawPhrase: string; commands: MathRoboCommand[]; contextSnapshotId?: string; confidence: number };
export type RoboObjectDescriptor = {
  id: string; type: string; mode: RoboMode; label?: string; position: number[]; radius?: number;
  style: { color: string; visible?: boolean }; command: VisualCommand; vertices?: number[][]; originalId?: string;
  parameters?: RoboParameters;
  locked?:boolean;creationOrder?:number;derivedFrom?:string[];
};
export type RoboSceneContext = {
  activeAngle?:{objectId:string;vertex:number};
  activePagePath?:string; snapshotId: string; objects: RoboObjectDescriptor[]; selectedIds: string[]; lastCreated?: string;
  lastModified?: string; lastReferenced?: string; lastQueryTargets?: string[]; activeMode: RoboMode;
  previousResult?: number | number[] | number[][] | string | boolean; previousResultTargets?: string[];
  activeObjectIds?:string[];previousSelectedIds?:string[];recentlyReferencedObjectIds?:string[];
  previousCommands?:MathRoboCommand[];previousResults?:{action:string;value?:RoboSceneContext['previousResult'];explanation:string}[];
  activeTool?:string;viewport?:unknown;responseDepth?:'compact'|'standard'|'detailed';
};
export type RoboResult = {
  navigation?:{path:string;title:string;requiresConfirmation:boolean};
  execution?:import('../../math-foundation/executionOutcome').ExecutionOutcome;
  clarification?:import('../../math-foundation/executionOutcome').ClarificationRequirement;
  engineExecution?:import('./engineRegistry').EngineResult;
  status: 'success'|'invalid'|'unsupported'|'ambiguous'|'unhandled'; message: string;
  value?: RoboSceneContext['previousResult']; candidates?: string[]; plan: MathRoboPlan;
  effects: VisualCommand[]; parseMs: number; executionMs: number;
  errorCode?:import('./executionErrors').RoboErrorCode;verification?:{passed:boolean;checks:string[];status?:import('../kernel/types').VerificationStatus};explanation?:string;requestKind?:import('./requestClassifier').RequestKind;
};
export type SemanticRow = {
  phrase: string; action: string; subAction: string; mode: RoboMode; parameters: RoboParameters;
  target?: RoboTarget; targets?: RoboTarget[]; context?: { objects: Omit<RoboObjectDescriptor, 'command'>[]; selected?: string[]; lastReferenced?: string; previousResult?:RoboSceneContext['previousResult'];previousResults?:RoboSceneContext['previousResults'];activeObjectIds?:string[] };
  group?: string; source?: string;
};
