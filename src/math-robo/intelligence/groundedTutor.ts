import {computeMathLocal} from '../kernel/client';
import {measurement} from './geometryQueries';
import {geometryState} from './resultVerifier';
import type {RoboResult,RoboSceneContext} from './types';

/** One bounded, scene-grounded exercise. Geometry remains the source of truth. */
export class GroundedTutor {
  private task?:{objectId:string;fingerprint:string;width:number;height:number;expected:number;hints:number};
  reset(){this.task=undefined;}
  async respond(text:string,scene:RoboSceneContext):Promise<RoboResult|undefined>{
    const normalized=text.toLowerCase().replace(/[?.]+$/,'').trim();
    const answer=normalized.match(/^(?:i think (?:the )?area is|my answer is|answer:)\s+(.+)$/);
    const hint=/^(?:hint|give me (?:a|another) hint|help me without giving the answer)$/.test(normalized);
    const explain=/^(?:explain in detail|explain briefly|show steps|why is that correct)$/.test(normalized);
    if(!answer&&!hint&&!explain)return undefined;
    const last=scene.previousCommands?.at(-1);
    if(!this.task&&last?.action==='FIND'&&last.subAction==='AREA'){
      const ids=scene.lastQueryTargets??scene.previousResultTargets??[scene.lastReferenced];
      const object=scene.objects.find(o=>ids.includes(o.id));
      if(object&&['rectangle','square'].includes(object.type)){const width=object.command.width*(object.command.scale??1),height=object.command.height*(object.command.scale??1);this.task={objectId:object.id,fingerprint:geometryState({...scene,objects:[object]}),width,height,expected:Number(measurement(object,'AREA')),hints:0};}
    }
    const task=this.task;if(!task)return undefined;
    const object=scene.objects.find(o=>o.id===task.objectId);
    const reply=(message:string,status:RoboResult['status']='success'):RoboResult=>({status,message,plan:{rawPhrase:text,commands:[],confidence:1},effects:[],parseMs:0,executionMs:0});
    if(!object||task.fingerprint!==geometryState({...scene,objects:[object]})){this.reset();return reply('The exercise object changed or was deleted. Find its area again to start a new task.','invalid');}
    if(hint){task.hints++;return reply(task.hints===1?'For a rectangle, multiply its width by its height. Which two dimensions should you use?':`Use width ${task.width} and height ${task.height}. Multiply them; perimeter uses addition instead.`);}
    if(explain)return reply(`Rectangle area = width × height = ${task.width} × ${task.height} = ${task.expected} square units. ${normalized==='explain briefly'?'':'Each unit row contains the width in squares, and there are height rows. Rotation preserves these dimensions and area.'}`);
    // Bounded exact arithmetic, never eval or classifier confidence.
    if(answer![1].length>256||!/^[-\d\s.+*/()]+$/.test(answer![1]))return reply('Use a numeric expression, such as 36 or 72/2.','invalid');
    const evaluated=await computeMathLocal({operation:'evaluate',expression:answer![1]});
    if(evaluated.execution?.status!=='verified')return reply('I could not independently verify that numeric answer. Use finite exact arithmetic.','invalid');
    const expected=await computeMathLocal({operation:'evaluate',expression:`${task.width}*${task.height}`});
    const correct=evaluated.answer===expected.answer;
    return reply(correct?`Correct: your expression matches ${task.expected} square units.`:`That does not match the area. Use width × height: ${task.width} × ${task.height} = ${task.expected}. ${Number(evaluated.answer)===2*(task.width+task.height)?'You used the perimeter formula; perimeter measures the boundary length.':''}`);
  }
}
