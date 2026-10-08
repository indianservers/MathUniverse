import type {MathRoboCommand,RoboSceneContext} from './types';
const WINDOW=25;
export function remember(scene:RoboSceneContext,commands:MathRoboCommand[],explanation:string){
  scene.previousCommands=[...(scene.previousCommands??[]),...commands.map(c=>({...c,parameters:{...c.parameters,legacy:undefined}}))].slice(-WINDOW);
  scene.previousResults=[...(scene.previousResults??[]),{action:commands.at(-1)?.action??'',value:scene.previousResult,explanation}].slice(-WINDOW);
  const ids=scene.previousResultTargets??[scene.lastReferenced].filter((id):id is string=>!!id);
  scene.recentlyReferencedObjectIds=[...new Set([...ids,...(scene.recentlyReferencedObjectIds??[])])].filter(id=>scene.objects.some(o=>o.id===id)).slice(0,WINDOW);
}
export function referenceScores(scene:RoboSceneContext,ids:string[]){return ids.map(id=>({id,score:scene.selectedIds.includes(id)?90:scene.activeObjectIds?.includes(id)?85:scene.lastReferenced===id?80:scene.lastCreated===id?70:ids.length===1?60:scene.lastModified===id?40:0})).sort((a,b)=>b.score-a.score);}
