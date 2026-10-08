export type SimulationSnapshot={n:number;k:number;distribution:number[]};
export type PageCapability={knowledgeId:string;read:()=>SimulationSnapshot;apply:(n:number,k:number)=>Promise<void>};
let active:PageCapability|undefined;
export function registerPageCapability(capability:PageCapability){active=capability;return()=>{if(active===capability)active=undefined;};}
export function currentPageCapability(){return active;}
export async function executePigeonhole(n:number,k:number){
 const capability=active;if(!capability||capability.knowledgeId!=='pigeonhole')throw new Error('The Pigeonhole simulation is not mounted on this page.');
 if(!Number.isInteger(n)||!Number.isInteger(k)||n<2||n>24||k<2||k>12)throw new Error('This simulation supports 2–24 objects and 2–12 boxes.');
 await capability.apply(n,k);const state=capability.read();
 if(state.n!==n||state.k!==k||state.distribution.length!==k||state.distribution.some(v=>!Number.isInteger(v)||v<0)||state.distribution.reduce((a,b)=>a+b,0)!==n)throw new Error('Simulation state did not match the validated request.');
 return state;
}
