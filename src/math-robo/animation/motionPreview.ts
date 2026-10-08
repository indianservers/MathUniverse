import type {VisualCommand,IntelligenceMode} from '../../offline-intelligence/commands';
export type MotionPreview={commands:VisualCommand[];progress:number;creating:string[];sources?:Record<string,VisualCommand>};
const frames=new Map<IntelligenceMode,MotionPreview>();const registered=new Map<IntelligenceMode,number>();const listeners=new Set<()=>void>();
export const subscribeMotionPreview=(fn:()=>void)=>{listeners.add(fn);return()=>{listeners.delete(fn);};};
export const getMotionPreview=(mode:IntelligenceMode)=>frames.get(mode);
export function publishMotionPreview(mode:IntelligenceMode,frame?:MotionPreview){if(frame)frames.set(mode,frame);else frames.delete(mode);for(const fn of listeners)fn();}
export function registerMotionPreview(mode:IntelligenceMode){registered.set(mode,(registered.get(mode)??0)+1);return()=>{registered.set(mode,Math.max(0,(registered.get(mode)??1)-1));};}
export const hasMotionPreview=(mode:IntelligenceMode)=>(registered.get(mode)??0)>0;
