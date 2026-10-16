import curriculum from './geometryQuestions250.json';
import {geometryQuestionGrammar,type GeometrySlots} from './geometryQuestionGrammar';
import {GeometryBoard} from './geometryBoard';
import {extendedQuery} from './geometryExtendedQueries';
import {extendedAction} from './geometryExtendedActions';
import {extended3d} from './geometryExtended3d';
import type {GeometryAnswer} from './geometryCurriculum';
import type {RoboSceneContext} from './types';
export const matchExtendedGeometry=geometryQuestionGrammar(curriculum);
export function evaluateExtendedGeometry(lesson:GeometrySlots,scene:RoboSceneContext):GeometryAnswer{
  if((lesson.id>=226)!==scene.activeMode.endsWith('3d'))throw new Error(`UNSUPPORTED: Open the ${lesson.id>=226?'3D':'2D'} geometry workspace for this request.`);
  const board=new GeometryBoard(lesson,scene),answer=lesson.id>=226?extended3d(board):lesson.id<=175?extendedQuery(board):extendedAction(board);
  const finite=(v:unknown):boolean=>typeof v==='number'?Number.isFinite(v):Array.isArray(v)?v.every(finite):v&&typeof v==='object'?Object.values(v).every(finite):true;
  if(!finite(answer))throw new Error('The requested geometry has no finite, defined result.');
  const value=typeof answer==='number'||typeof answer==='string'||typeof answer==='boolean'?answer:Array.isArray(answer)&&answer.every(v=>typeof v==='number'||Array.isArray(v)&&v.every(x=>typeof x==='number'))?answer as number[]|number[][]:JSON.stringify(answer);
  return {value,message:`${curriculum[lesson.id-1].mutates?'Geometry updated':'Answer'}: ${typeof answer==='boolean'?answer?'Yes':'No':typeof answer==='string'?answer:JSON.stringify(answer)}`,targets:[...board.targets],effects:board.effects};
}
