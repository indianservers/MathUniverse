import type { KnownHandPose, HandCommand } from './KnownHandGestures';
import type { HandPoint, HandTransform } from '../arHandGestures';

export type Vec3 = [number, number, number];
export type HandIntent = 'idle' | 'explore' | 'point' | 'touch' | 'grab' | 'move' | 'rotate' | 'resize' | 'stretch' | 'push' | 'pull' | 'inspect' | 'release' | 'ui' | 'unknown';
export type IntelligenceProfile = 'precision' | 'balanced' | 'play';
export type InteractionPhase = 'idle' | 'approach' | 'hover' | 'contact' | 'grab-ready' | 'grabbed' | 'two-hand-ready' | 'two-hand-grab' | 'release';
export type RawHand = { landmarks?: HandPoint[]; point?: HandPoint; pinchRatio?: number; handedness?: string; confidence?: number; orientation?: number; timestamp?: number };
export type HandFeatures = {
  pose?: KnownHandPose; id: string; handedness: string; position: Vec3; predictedPosition: Vec3; fingertip: Vec3;
  velocity: Vec3; acceleration: Vec3; jerk: number; speed: number; angularVelocity: number; curvature: number;
  palmNormal: Vec3; orientation: number; curls: number[]; pinchRatio: number; pinchVelocity: number;
  openScore: number; closure: number; pointing: number; quality: number; stability: number;
  jitter: boolean; embedding: number[]; timestamp: number; missing: boolean;
};
export type GrabZone = { id: string; kind: 'body' | 'vertex' | 'edge' | 'face' | 'radius' | 'vector' | 'surface' | 'ui'; position: Vec3; radius: number; axis?: 0 | 1 | 2; direction?: Vec3; index?: number; dimension?: string; value?: number; sample?: Vec3 };
export type ObjectAffordance = {
  objectId: string; semanticType: string; position: Vec3; radius: number; depth: number;
  visible: boolean; occluded?: boolean; locked?: boolean; selected?: boolean;
  allowedInteractions: { translate?: boolean; rotate?: boolean; scale?: boolean; stretchX?: boolean; stretchY?: boolean; stretchZ?: boolean; editVertex?: boolean; editRadius?: boolean; editVector?: boolean; sampleSurface?: boolean; ui?: boolean };
  preferredGrabZones: GrabZone[]; precisionRequired: number;
};
export type SpatialTarget = { objectId: string; zone: GrabZone; score: number; contact: number; handId: string; affordance: ObjectAffordance };
export type TransformWeights = { translate: number; rotate: number; scale: number; stretch: number; depth: number };
export type HandIntelligenceState = {
  command?: HandCommand; timestamp: number; hands: HandFeatures[]; primaryIntent: HandIntent; targetObjectId?: string;
  targetConfidence: number; intentConfidence: number; interactionConfidence: number; uncertainty: number;
  phase: InteractionPhase; isStable: boolean; targetLocked: boolean; activeHandIds: string[];
  oneHandMode?: string; twoHandMode?: string; predictedNextIntent?: HandIntent; precision: boolean;
  dominantHand?: string; weights: TransformWeights; scores: Partial<Record<HandIntent, number>>;
  reasons: string[]; primaryTarget?: SpatialTarget; releaseVelocity?: Vec3; throwAllowed: boolean;
};
export type SpatialFrame = { timestamp: number; hands: HandFeatures[]; interactions: { primaryTarget?: SpatialTarget; secondaryTarget?: SpatialTarget; contactPoints: SpatialTarget[]; grabAnchors: { handId: string; objectId: string; position: Vec3 }[]; oneHandTransform?: TransformWeights; twoHandTransform?: TransformWeights } };
export type SemanticEdit = { objectId: string; kind: 'dimension' | 'vertex' | 'vector'; dimension?: string; value?: number; index?: number; delta?: Vec3 };
export type ManipulationResult = { transform: HandTransform | null; semanticEdit?: SemanticEdit; inspection?: { objectId: string; position: Vec3; index?: number }; releaseVelocity?: Vec3 };
export type IntelligenceFrameInput = { timestamp: number; hands: RawHand[]; targets: ObjectAffordance[]; camera: boolean; selectedObjectId?: string; tool?: 'auto' | 'move' | 'resize' | 'draw' | 'ui'; latencyMs?: number; physicsEnabled?: boolean };
export type IntentPrediction = { probabilities: Partial<Record<HandIntent, number>> };
export type IntentModel = { predict: (features: readonly HandFeatures[], history: readonly HandIntelligenceState[]) => IntentPrediction };
export type IntelligenceEventName = 'onIntentStart' | 'onIntentUpdate' | 'onIntentEnd' | 'onTargetPredicted' | 'onTargetLocked' | 'onTargetReleased' | 'onGrabStart' | 'onGrabUpdate' | 'onGrabEnd' | 'onTwoHandStart' | 'onTwoHandUpdate' | 'onTwoHandEnd';
export type IntelligenceEvent = { type: IntelligenceEventName; state: HandIntelligenceState };
export type CameraHandRuntime = { targets: ObjectAffordance[]; transform: HandTransform; state?: HandIntelligenceState; result?: ManipulationResult; landmarks?: HandPoint[][]; landmarksAt?: number };
