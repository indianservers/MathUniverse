// This is a build boundary, not client-side authentication. Public builds disable
// developer tools entirely; an enabled build must be distributed only to admins.
export const MODEL_TRAINING_ENABLED = import.meta.env.VITE_ENABLE_MODEL_TRAINING === 'true' || (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MODEL_TRAINING !== 'false');
export const CANDIDATE_MODEL = 'indexeddb://math-robo-intelligence-v4.1-candidate';
export function assertTrainingAllowed(){if(!MODEL_TRAINING_ENABLED)throw new Error('Training and model publication are disabled in this student build.');}
