import type { MasteryEvidence } from "./types";

export type LearnerState={version:1;currentCourseId?:string;resumeLessonId?:string;evidence:MasteryEvidence[];practiceSessions:Array<{familyId:string;seed:number;status:"IN_PROGRESS"|"COMPLETED";hintLevel:number;answer?:string;updatedAt:string}>;assessmentSessions:Array<{blueprintId:string;answers:Record<string,string>;flagged:string[];startedAt:string;updatedAt:string;submittedAt?:string}>};
export const emptyLearnerState=():LearnerState=>({version:1,evidence:[],practiceSessions:[],assessmentSessions:[]});
export function loadLearnerState(storage:Pick<Storage,"getItem">,key="math-universe-phase3-learner"){try{const raw=storage.getItem(key);if(!raw)return emptyLearnerState();const parsed=JSON.parse(raw) as LearnerState;return parsed.version===1?parsed:emptyLearnerState();}catch{return emptyLearnerState();}}
export function saveLearnerState(storage:Pick<Storage,"setItem">,state:LearnerState,key="math-universe-phase3-learner"){storage.setItem(key,JSON.stringify(state));}
export function recordMasteryEvidence(state:LearnerState,evidence:MasteryEvidence):LearnerState{return{...state,evidence:[...state.evidence,evidence]};}
export function savePracticeSession(state:LearnerState,session:LearnerState["practiceSessions"][number]){return{...state,practiceSessions:[...state.practiceSessions.filter((entry)=>!(entry.familyId===session.familyId&&entry.seed===session.seed)),session]};}
