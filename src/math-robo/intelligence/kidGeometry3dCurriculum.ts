import questions from './kidGeometry3d300.json';
import {Kid3dBoard} from './kidGeometry3dBoard';
import {kid3dQuery} from './kidGeometry3dQueries';
import {kid3dAction} from './kidGeometry3dActions';
import type {MathRoboCommand,MathRoboPlan,RoboSceneContext} from './types';
import type {GeometrySlots} from './geometryQuestionGrammar';
const unavailable:Record<number,string>={138:'I cannot restore an individual object to an arbitrary earlier position yet. Use Undo for its last move, or give its previous coordinates.',192:'Thicker edges on solid meshes are not supported here yet. You can change the outline color or show the solid as wireframe.',204:'A single control for hiding every 3D object label is not available yet. Object names remain in the object panel.',298:'Use the workspace Save control to save this scene. I have not saved a file from this chat request.',299:'Use Load / Import to choose your saved scene. I need the actual scene file before I can restore it.',300:'Use the 3D workspace camera reset or fit-view control to see all objects. I have not moved the camera.'};
export function evaluateKidGeometry3d(command:MathRoboCommand,scene:RoboSceneContext){
 if(!scene.activeMode.endsWith('3d'))throw new Error('UNSUPPORTED: Open the 3D geometry workspace first.');
 const lesson=command.parameters.kid3d as GeometrySlots,row=questions[lesson.id-1];if(!row)throw new Error('Unknown 3D training question.');
 if(unavailable[lesson.id])throw new Error('UNSUPPORTED: '+unavailable[lesson.id]);
 const b=new Kid3dBoard(command,scene,lesson),answer=row.mutates?kid3dAction(b):kid3dQuery(b);
 if(answer&&typeof answer==='object'&&'commands' in answer)return {plan:answer as MathRoboPlan,targets:[...b.targets],effects:[]};
 const finite=(v:unknown):boolean=>typeof v==='number'?Number.isFinite(v):Array.isArray(v)?v.every(finite):v&&typeof v==='object'?Object.values(v).every(finite):true;
 if(!finite(answer))throw new Error('The current geometry does not give a finite answer.');
 const value=typeof answer==='boolean'||typeof answer==='number'||typeof answer==='string'?answer:Array.isArray(answer)?answer as number[]|number[][]:JSON.stringify(answer);
 let explanation:string|undefined;
 if(lesson.id>=91&&lesson.id<=97){const type=['cube','cuboid','sphere','cylinder','cone','pyramid','prism'][lesson.id-91],o=b.one(type),c=o.command,s=c.scale??1,r=c.radius*s,h=c.height*s;const formula=type==='cube'?`${c.width*s}³`:type==='cuboid'?b.dimensions(o).join(' × '):type==='sphere'?`4π × ${r}³ / 3`:type==='cylinder'?`π × ${r}² × ${h}`:type==='cone'?`π × ${r}² × ${h} / 3`:type==='pyramid'?`2 × ${r}² × ${h} / 3`:`(3√3 / 4) × ${r}² × ${h}`;explanation=`Volume of ${o.label??type} = ${formula} = ${answer} cubic units.`;}
 if(lesson.id===71){const a=b.point('A'),d=b.point('B');explanation=`Distance = √(${a.map((x,i)=>`(${x} - ${d[i]})²`).join(' + ')}) = ${answer} units.`;}
 return {value,message:explanation??(typeof answer==='string'?answer:`${b.effects.length?'Geometry updated':'Answer'}: ${typeof answer==='boolean'?answer?'Yes':'No':JSON.stringify(answer)}`),targets:[...b.targets],effects:b.effects};
}
