import type {MathRoboPlan,MathRoboCommand,RoboSceneContext,RoboResult} from './types';
import {normalizeLanguage,NUMBER_PATTERN,parseNumber,directionVector,coordinates} from './numberParser';
import {resolveTarget,targetFromPhrase,ResolutionError} from './targetResolver';
import {parseSemanticPlan} from './semanticParser';
import {center,vertices} from './geometryQueries';
import {FollowUpEngine} from './followUpEngine';
import {COLORS} from '../../offline-intelligence/shapeCatalog';
import {geometryState} from './resultVerifier';
export type PendingCommand={plan:MathRoboPlan;index:number;slot:string;question:string;options:string[];choices?:MathRoboPlan[];references?:string[];referenceVersions?:Record<string,string>};
export class ConversationEngine extends FollowUpEngine {
  turns:{text:string;kind:string;subjectBefore:string[];subjectAfter:string[];pending?:PendingCommand;status:string;message:string;plan:MathRoboPlan;resolvedReferences:string[];missingSlots:string[];confidence:{intent:number;reference:number;answer:number;contextContinuity:number};executed:boolean}[]=[];
  lastMathResult?:{value:RoboResult['value'];explanation:string;targets:string[];sceneVersion?:string};
  private lastMutation?:MathRoboCommand;
  private lastMutationState?:string;
  private before:string[]=[];
  private text='';
  resetContext(){this.pending=undefined;this.lastMathResult=undefined;this.lastMutation=undefined;this.lastMutationState=undefined;this.turns=[];this.invalidated=undefined;}
  private invalidated?:string;
  sync(scene:RoboSceneContext){
    if(this.pending?.referenceVersions&&Object.entries(this.pending.referenceVersions).some(([id,version])=>{const object=scene.objects.find(o=>o.id===id);return !object||geometryState({...scene,objects:[object]})!==version;})){this.pending=undefined;this.invalidated='The referenced geometry changed. Please restate the operation using its current state.';}
    if(scene.activeAngle&&!scene.objects.some(o=>o.id===scene.activeAngle!.objectId))scene.activeAngle=undefined;
    if(this.pending){const target=this.pending.plan.commands[this.pending.index].target;let missing=false;if(typeof target==='string'&&!target.startsWith('last')&&!target.startsWith('$'))try{resolveTarget(target,scene);}catch{missing=true;}if(missing||this.pending.references?.some(id=>!scene.objects.some(o=>o.id===id))){this.pending=undefined;this.invalidated='That object was removed. Please choose an existing object.';}}
    if(this.lastMathResult)this.lastMathResult.targets=this.lastMathResult.targets.filter(id=>scene.objects.some(o=>o.id===id)||id.startsWith('$edge:')&&scene.objects.some(o=>id.endsWith(':'+o.id)));
  }
  snapshot(scene:RoboSceneContext){return structuredClone({activeTopic:scene.objects.find(o=>o.id===scene.lastReferenced)?.type,currentMode:scene.activeMode,activeSubject:scene.activeObjectIds??[],selectedIds:scene.selectedIds,lastCreated:scene.lastCreated,lastModified:scene.lastModified,lastCreatedIds:scene.lastCreated?[scene.lastCreated]:[],lastModifiedIds:scene.lastModified?[scene.lastModified]:[],recentReferences:scene.recentlyReferencedObjectIds??[],recentCommands:scene.previousCommands??[],recentResults:scene.previousResults??[],lastIntent:this.turns.at(-1)?.plan.commands.at(-1)?.action,lastResponseKind:this.turns.at(-1)?.kind,activeConstruction:this.pending?.plan.commands.find(c=>c.action==='CONSTRUCT'),lastMathResult:this.lastMathResult,pending:this.pending,turns:this.turns});}
  beginExternal(text:string,scene:RoboSceneContext){this.text=text;this.before=[...(scene.activeObjectIds??[])];}
  prepare(text:string,plan:MathRoboPlan,scene:RoboSceneContext):{plan:MathRoboPlan;message?:string} {
    this.text=text;this.before=[...(scene.activeObjectIds??[])];
    let normalized=normalizeLanguage(text).replace(/[.!?]+$/,'');
    if(/^(?:make|scale|enlarge) (?:it|that) (?:a little|slightly|somewhat) (?:larger|bigger|smaller)$/.test(normalized)){const proposed=parseSemanticPlan('Scale it',scene.activeMode);proposed.commands[0].action='SCALE';proposed.commands[0].subAction='UNIFORM';proposed.commands[0].target='lastReferenced';proposed.commands[0].parameters={};return this.ask(proposed,0,'factor','What exact scale factor should I use? A phrase such as “a little larger” does not specify a number.');}
    const dimensionChange=normalized.match(/^(increase|decrease|reduce) (?:its|the) (width|height|depth|radius|diameter) by (.+)$/);
    if(dimensionChange){try{const host=resolveTarget('lastReferenced',scene),property=dimensionChange[2],base=property==='diameter'?host.command.radius*2:Number(host.command[property as 'width'|'height'|'depth'|'radius']),value=base*(host.command.scale??1)+(dimensionChange[1]==='increase'?1:-1)*parseNumber(dimensionChange[3]);plan=parseSemanticPlan(`Change its ${property} to ${value}`,scene.activeMode);plan.commands[0].target=host.id;for(const key of ['width','height','depth'] as const)if(key!==property&&host.command[key]!==undefined)plan.commands[0].parameters[key]=host.command[key]!*(host.command.scale??1);}catch{/* Normal resolution retains missing or ambiguous references. */}}
    const relative=normalized.match(/^(increase|decrease) it by (-?\d+(?:\.\d+)?)$/);
    if(relative&&this.lastMutation?.action==='CHANGE'&&this.lastMutation.subAction==='SIDE'&&this.lastMutationState===geometryState(scene)){const previous=structuredClone(this.lastMutation);previous.id=crypto.randomUUID();previous.rawPhrase=text;previous.parameters.length=Number(previous.parameters.length)+(relative[1]==='increase'?1:-1)*Number(relative[2]);plan={...plan,commands:[previous]};}
    for(const command of plan.commands){if(!command.parameters.dimensionRatio)continue;try{const target=resolveTarget(command.target,scene),visual=target.command,ratio=command.parameters.dimensionRatio as {destination:'width'|'height'|'depth';source:'width'|'height'|'depth';factor:number};if(!['rectangle','square','cube','cuboid'].includes(target.type))continue;const scale=visual.scale??1;command.parameters.width=visual.width*scale;command.parameters.height=visual.height*scale;command.parameters.depth=(visual.depth??visual.width)*scale;command.parameters[ratio.destination]=(visual[ratio.source]??visual.width)*scale*ratio.factor;}catch{/* Keep missing or ambiguous targets for normal clarification. */}}
    const relativeAngle=normalized.match(new RegExp(`^make it (?:another )?(${NUMBER_PATTERN}) degrees? (larger|smaller)$`));
    if(scene.activeAngle&&relativeAngle){const c=plan.commands[0];c.action='CHANGE';c.subAction='ANGLE';c.target=scene.activeAngle.objectId;c.parameters={angle:parseNumber(relativeAngle[1]),vertex:['A','B','C'][scene.activeAngle.vertex],angleOperation:relativeAngle[2]==='larger'?'increment':'decrement'};}
    if(scene.activeAngle&&/^(?:make|set|increase|decrease|reduce)\s+(?:it\s+)?(?:by\s+)?(?:another\s+)?[\d.-]+(?:\s*(?:degrees?|percent|%))?$/.test(normalized)){
      const amount=normalized.match(new RegExp(NUMBER_PATTERN))?.[0];if(amount){const c=plan.commands[0];c.action='CHANGE';c.subAction='ANGLE';c.target=scene.activeAngle.objectId;c.parameters={angle:parseNumber(amount),vertex:['A','B','C'][scene.activeAngle.vertex],angleOperation:/percent|%/.test(normalized)?/decrease|reduce/.test(normalized)?'decrementPercent':'incrementPercent':/increase/.test(normalized)?'increment':/decrease|reduce/.test(normalized)?'decrement':'set'};}
    }
    if(/^(?:and )?(?:now|what about now)$/.test(normalized)&&this.lastMathResult){
      const previous=[...this.turns].reverse().find(t=>t.status==='success'&&t.plan.commands.some(c=>['FIND','CHECK','COMPARE'].includes(c.action)));
      if(previous)plan=structuredClone(previous.plan);
    }
    if(/^(center|radius)\b/.test(normalized)&&scene.objects.find(o=>o.id===scene.lastCreated)?.type==='circle'){plan=parseSemanticPlan(/^center/.test(normalized)?`Change its coordinates to ${normalized.replace(/^center\s*/,'')}`:`Change its radius to ${normalized.replace(/^radius\s*/,'')}`,scene.activeMode);plan.commands[0].target=scene.lastCreated;}
    if(/^no[, ]+(?:the )?other (?:one|line|circle)$/.test(normalized)&&this.turns.at(-1)?.plan.commands.at(-1)?.action==='SELECT'){
      const active=scene.selectedIds.at(-1),type=scene.objects.find(o=>o.id===active)?.type,others=scene.objects.filter(o=>o.type===type&&o.id!==active);
      if(others.length===1){normalized='select the other object';plan=parseSemanticPlan('Select it',scene.activeMode);plan.commands[0].target=others[0].id;}
    }
    if(/\b(?:changed mathematically|stayed the same)\b/.test(normalized)&&this.lastMutation){
      const p=this.lastMutation.parameters,objects=(scene.activeObjectIds??[]).map(id=>scene.objects.find(o=>o.id===id)).filter(o=>!!o);
      if(this.lastMutation.action==='MOVE')return {plan,message:/stayed/.test(normalized)?`Translation preserves radii, shape, size, area and distances between jointly moved objects, so their tangency is unchanged. ${objects.filter(o=>o.type==='circle').map(o=>`${o.label}: radius ${o.command.radius*(o.command.scale??1)}`).join('; ')}`:`The centers and vertices changed by ${JSON.stringify(p.vector)}. Current centers: ${JSON.stringify(objects.map(o=>center(o!)))}.`};
    }
    if(this.pending&&/^no[, ]+/.test(normalized)){
      normalized=normalized.replace(/^no[, ]+(?:make (?:it )?)?/,'');
      const pending=this.pending,command=pending.plan.commands[pending.index];
      if(command.action==='MOVE'&&/^(left|right|up|down|forward|backward)$/.test(normalized)){
        command.parameters.conversationDirection=normalized;
        if(command.parameters.conversationDistance!==undefined){command.parameters.vector=directionVector(`${normalized} ${command.parameters.conversationDistance}`,scene.activeMode.endsWith('3d')?3:2);delete command.parameters.parseError;plan=structuredClone(pending.plan);this.pending=undefined;}
        else return this.ask(pending.plan,pending.index,'distance','How far should I move it?');
      }
    }
    if(/^(actually|instead)\s+/.test(normalized))plan=parseSemanticPlan(normalized.replace(/^(actually|instead)\s+/,''),scene.activeMode);
    if(this.invalidated){const reason=this.invalidated;this.invalidated=undefined;if(!/^(draw|create|move|rotate|delete|find|select|undo|redo|clear)\b/.test(normalized))return {plan,message:reason};}
    if(/^now\s+(?:rotate|move|reflect|scale|draw|create|find|delete)\b/.test(normalized))plan=parseSemanticPlan(text.replace(/^now\s+/i,''),scene.activeMode);
    if(/^(forget that|start over|clear context|reset context|new question)$/.test(normalized)){
      this.lastMutation=undefined;
      this.pending=undefined;this.lastMathResult=undefined;scene.activeObjectIds=[];scene.lastReferenced=undefined;scene.previousResult=undefined;scene.previousCommands=[];scene.previousResults=[];return {plan,message:'Conversation context cleared. Your workspace objects are still here.'};
    }
    if(/^(why|how|show me|explain|show steps|how did you get that)$/.test(normalized)&&this.lastMathResult)return {plan,message:this.lastMathResult.explanation};
    if(/\b(weather|cricket score|write an email|send an email)\b/.test(normalized))return {plan,message:'I help with mathematics, geometry, graphs and objects in your workspace.'};
    const glossary:Record<string,string>={tangent:'A tangent touches a circle at one point and is perpendicular to the radius at that point.',chord:'A chord is a line segment joining two points on a circle.',diameter:'A diameter passes through the center of a circle and equals twice its radius.',perpendicular:'Perpendicular lines meet at a right angle of 90 degrees.',parallel:'Parallel lines stay the same distance apart and do not intersect.'};
    const definition=normalized.match(/^what (?:is|does) (?:a |an )?(tangent|chord|diameter|perpendicular|parallel)(?: mean)?$/)?.[1];
    if(definition)return {plan,message:glossary[definition]};
    if(/^now (?:let'?s|let us) work (?:with|on) (?:a |the )?/.test(normalized)){
      this.pending=undefined;plan=parseSemanticPlan(normalized.replace(/^now (?:let'?s|let us) work (?:with|on) (?:a |the )?/,'Select the '),scene.activeMode);
    }
    if(this.lastMutation&&/^(no[, ]|actually |instead )/.test(normalized)){
      if(this.lastMutationState!==geometryState(scene))return {plan,message:'The workspace has changed since that action. Please specify the object and the corrected action.'};
      this.pending=undefined;
      const previous=this.lastMutation,p=previous.parameters;
      const value=normalized.match(new RegExp(NUMBER_PATTERN))?.[0];
      const object=scene.objects.find(o=>o.id===previous.target)||scene.objects.find(o=>o.id===scene.lastCreated);
      if(previous.action==='ROTATE'&&value&&/\bmake (?:it|that)\b/.test(normalized)){const revised=structuredClone(previous);revised.parameters.angle=Number(value)-Number(p.angle??0);revised.parameters.conversationLogicalAngle=Number(value);plan={...plan,commands:[revised]};}
      else if(/^no[, ]+(?:make (?:it )?)?\d/.test(normalized)&&object?.type==='circle'&&value)plan=parseSemanticPlan(`Change its radius to ${value}`,scene.activeMode);
      else if(/^no[, ]+(left|right|up|down)$/.test(normalized)&&previous.action==='MOVE'&&Array.isArray(p.vector)){
        const direction=normalized.match(/(left|right|up|down)$/)![0],distance=Math.hypot(...p.vector as number[]),desired=directionVector(`${direction} ${distance}`,scene.activeMode.endsWith('3d')?3:2);
        const revised=structuredClone(previous);revised.parameters.vector=desired.map((v,i)=>v-(p.vector as number[])[i]);revised.parameters.conversationLogicalVector=desired;plan={...plan,commands:[revised]};
      } else if(/^no[, ]+(?:the )?other (?:line|one)$/.test(normalized)&&['MOVE','ROTATE','SCALE','REFLECT'].includes(previous.action)){
        const original=scene.objects.find(o=>o.id===previous.target),alternatives=scene.objects.filter(o=>o.type===original?.type&&o.id!==original?.id);
        if(alternatives.length!==1)return {plan,message:'Please name the other object so I can correct the target.'};
        const restore=structuredClone(previous),revised=structuredClone(previous);
        if(previous.action==='MOVE')restore.parameters.vector=(p.vector as number[]).map(n=>-n);
        if(previous.action==='ROTATE')restore.parameters.angle=-Number(p.angle);
        if(previous.action==='SCALE')restore.parameters.factor=1/Number(p.factor);
        revised.target=alternatives[0].id;plan={...plan,commands:[restore,revised]};
      } else {
        const revised=parseSemanticPlan(normalized.replace(/^(?:no[, ]+|actually |instead )/,''),scene.activeMode);
        if(revised.commands[0]?.action==='ROTATE'&&previous.action==='ROTATE'&&typeof revised.commands[0].parameters.angle==='number'){revised.commands[0].parameters.conversationLogicalAngle=revised.commands[0].parameters.angle;revised.commands[0].parameters.angle-=Number(p.angle??0);}
        plan=revised;
      }
    }
    if(this.pending){
      const pending=this.pending,command=pending.plan.commands[pending.index];
      let missingTarget=false;if(typeof command.target==='string'&&!command.target.startsWith('last')&&!command.target.startsWith('$'))try{resolveTarget(command.target,scene);}catch{missingTarget=true;}
      if(missingTarget){this.pending=undefined;return {plan,message:'That object was removed. Please choose an existing object.'};}
      if(normalized==='no'){this.pending=undefined;return {plan,message:'Cancelled the pending command.'};}
      if(pending.slot==='points'&&/^(?:rotate (?:it|that)|draw a circle centered there|make its radius|color only the circle)/.test(normalized))return {plan:pending.plan,message:pending.question};
      if(['points','triangleLength','trianglePolicy','angle'].includes(pending.slot)&&/^(?:find|what|where|does|explain)\b/.test(normalized))return {plan:pending.plan,message:pending.question};
      let accepted=false;
      const numeric=normalized.match(new RegExp(`^(${NUMBER_PATTERN})(?:\\s+(?:units?|degrees|radians))?(?:\\s+(?:clockwise|anticlockwise|counterclockwise))?$`));
      if(pending.slot==='trianglePolicy'&&(command.parameters.side as string[]).join('')==='AB'&&(/keep a and c fixed.*b on (?:the )?ray ab/.test(normalized)||/preserve ac and bc/.test(normalized)&&/fix a|keep a fixed/.test(normalized)&&/ab direction|direction of ab/.test(normalized)&&/same side/.test(normalized))){command.parameters.sidePolicy=/preserve/.test(normalized)?'preserve_other_sides':'fixed_third_vertex';accepted=true;}
      else if(pending.slot==='radius'&&plan.commands.length===1&&plan.commands[0].action==='CHANGE'&&plan.commands[0].subAction==='RADIUS'&&typeof plan.commands[0].parameters.radius==='number'){command.parameters.radius=plan.commands[0].parameters.radius;command.parameters.conversationRadiusProvided=true;if(command.parameters.legacy)command.parameters.legacy.radius=command.parameters.radius;accepted=true;}
      else if(pending.slot==='triangleLength'&&numeric){const length=parseNumber(numeric[1]);if(length>0&&length<=10000){command.parameters.length=length;accepted=true;}}
      else if(pending.choices){
        const ordinal=normalized.match(/^(?:the )?(first|second)(?: (?:one|1|triangle|rectangle|square|circle|line|point|polygon|object))?$/)?.[1];
        const option=normalized==='yes'?0:ordinal?['first','second'].indexOf(ordinal):/^\d+$/.test(normalized)?Number(normalized)-1:-1;
        if(pending.choices[option]){plan=structuredClone(pending.choices[option]);this.pending=undefined;return {plan};}
      } else if(pending.slot==='target'){
        if(/^(both|all)$/.test(normalized)&&['MOVE','ROTATE','SCALE','DELETE','HIDE','SHOW','LOCK','UNLOCK'].includes(command.action)){command.targets=pending.options;command.parameters.multiple=true;accepted=true;}
        const ordinal=normalized.match(/^(?:the )?(first|second|third|fourth)(?: (?:one|1|triangle|rectangle|square|circle|line|point|polygon|object))?$/)?.[1];
        const index=ordinal?['first','second','third','fourth'].indexOf(ordinal):/^\d+$/.test(normalized)?Number(normalized)-1:-1;
        const name=normalized.replace(/^(?:the )?(?:line|point|circle|triangle|square|rectangle)\s+/,''),color=normalized.match(/^(?:the )?(\w+) one$/)?.[1];
        const id=pending.options[index]??pending.options.find(id=>{const object=scene.objects.find(o=>o.id===id);return id.toLowerCase()===name||object?.label?.toLowerCase()===name||!!color&&object?.style.color===COLORS[color];});
        if(id&&scene.objects.some(o=>o.id===id)){command.target=id;accepted=true;}
      } else if(pending.slot==='angleVertex'){
        const letters=text.toLowerCase().match(/angle\s+([abc]{3})\b/)?.[1],vertex=letters?.[1]??text.toLowerCase().match(/(?:vertex|angle)\s+([abc])\b|^([abc])$/)?.slice(1).find(Boolean);if(vertex){command.parameters.vertex=vertex.toUpperCase();const amount=normalized.match(new RegExp(`(?:set (?:it )?|to )(${NUMBER_PATTERN})`))?.[1];if(amount){command.parameters.angle=parseNumber(amount);command.parameters.angleOperation='set';}accepted=true;}
      } else if(pending.slot==='color'){
        const color=Object.keys(COLORS).sort((a,b)=>b.length-a.length).find(color=>new RegExp(`\\b${color}\\b`).test(normalized));if(color){command.parameters.color=color;if(/fill|interior/.test(normalized))command.subAction='FILL_COLOR';accepted=true;}
      } else if(pending.slot==='factor'&&/^(?:twice|double|half)(?:\b|$)/.test(normalized)){command.parameters.factor=/half/.test(normalized)?.5:2;accepted=true;}
      else if(numeric&&['distance','angle','factor','radius'].includes(pending.slot)){
        if(pending.slot!=='angle'&&/degrees|radians|clockwise/.test(normalized)||pending.slot==='angle'&&/units?/.test(normalized)||pending.slot==='factor'&&/units?/.test(normalized))return {plan:pending.plan,message:pending.question};
        let value:number;try{value=parseNumber(numeric[1]);}catch{return {plan:pending.plan,message:`Please use a finite number. ${pending.question}`};}
        if(Math.abs(value)>10000||(['factor','radius'].includes(pending.slot)&&value<=0)||pending.slot==='distance'&&value<0)return {plan:pending.plan,message:`Please use ${pending.slot==='angle'?'an angle between −10,000 and 10,000':'a positive value no greater than 10,000'}. ${pending.question}`};
        if(pending.slot==='distance'){command.parameters.vector=directionVector(`${command.parameters.conversationDirection} ${value}`,scene.activeMode.endsWith('3d')?3:2);delete command.parameters.parseError;}
        if(pending.slot==='angle'){if(/radians/.test(normalized))value*=180/Math.PI;if((/clockwise/.test(normalized)&&!/anticlockwise|counterclockwise/.test(normalized))||command.parameters.conversationRotationDirection==='clockwise'&&!/anticlockwise|counterclockwise/.test(normalized))value=-value;command.parameters.angle=value;}
        if(pending.slot==='factor')command.parameters.factor=value;
        if(pending.slot==='radius'){command.parameters.radius=value;command.parameters.conversationRadiusProvided=true;if(command.parameters.legacy)command.parameters.legacy.radius=value;}
        accepted=true;
      } else if(pending.slot==='direction'&&/^(left|right|up|down|forward|backward)$/.test(normalized)){
        command.parameters.conversationDirection=normalized;command.parameters.vector=directionVector(`${normalized} ${command.parameters.conversationDistance??''}`,scene.activeMode.endsWith('3d')?3:2);accepted=true;
      } else if(pending.slot==='axis'&&/^(?:the )?[xyz](?:[ -]axis)?$/.test(normalized)){command.parameters.axis=normalized.match(/[xyz]/)![0];command.subAction=`${command.parameters.axis.toString().toUpperCase()}_AXIS`;accepted=true;}
      else if(pending.slot==='plane'&&/^(?:the )?(xy|xz|yz)(?:[ -]plane)?$/.test(normalized)){command.parameters.plane=normalized.match(/xy|xz|yz/)![0];command.subAction=`${String(command.parameters.plane).toUpperCase()}_PLANE`;accepted=true;}
      else if(pending.slot==='planePoints'){const points=coordinates(normalized,3);if(points.length===3){command.parameters.points=points;accepted=true;}}
      else if(['points','position'].includes(pending.slot)){
        const points=coordinates(normalized,scene.activeMode.endsWith('3d')?3:2);
        const direction=normalized.match(/\bat\s+(-?\d+(?:\.\d+)?)\s+degrees?$/);
        if(pending.slot==='points'&&command.subAction==='LINE'&&command.parameters.count!==2&&!scene.activeMode.endsWith('3d')){
          const retained=command.parameters.conversationPoint as number[]|undefined;
          if(direction&&points.length===0&&retained)points.push([...retained]);
          else if(points.length===1&&!direction){
            if(retained&&!/^through\b/.test(normalized))points.unshift([...retained]);
            else{command.parameters.conversationPoint=[...points[0]];pending.question='Give another point or a direction angle, such as “at 45 degrees”.';return {plan:pending.plan,message:pending.question};}
          }
        }
        if(pending.slot==='points'&&command.subAction==='LINE'&&command.parameters.count!==2&&points.length===1&&points[0].length===2&&direction){const radians=Number(direction[1])*Math.PI/180;points.push([points[0][0]+Math.cos(radians),points[0][1]+Math.sin(radians)]);command.parameters.linearExtent='line';}
        if(points.length>=(pending.slot==='points'?(command.parameters.count===2?4:2):1)){command.parameters[pending.slot]=pending.slot==='points'?points:points[0];if(command.parameters.legacy){command.parameters.legacy.points=points;}delete command.parameters.parseError;accepted=true;}
        else if(pending.slot==='position')try{const point=resolveTarget(normalized.replace(/^through\s+/,'').replace(/^(?:the )?point\s+/,''),scene);if(point.type==='point'){command.parameters.position=point.position;accepted=true;}}catch{/* Keep asking for an actual point. */}
      }
      else if(pending.slot==='destination'){
        const points=coordinates(normalized,scene.activeMode.endsWith('3d')?3:2);let point=points[0];
        if(!point)try{const object=resolveTarget(normalized.replace(/^(?:the )?point\s+/,''),scene);if(object.type==='point')point=object.position;}catch{/* Ask for full coordinates or an existing named point. */}
        if(point){command.parameters.vector=point;command.parameters.absolute=true;delete command.parameters.parseError;accepted=true;}
      }
      else if(pending.slot==='angle'&&/^(clockwise|anticlockwise|counterclockwise)$/.test(normalized)){command.parameters.conversationRotationDirection=normalized;return {plan:pending.plan,message:pending.question};}
      else if(pending.slot==='lineDirection'&&/^(vertical|horizontal|along (?:the )?[xyz][ -]axis)$/.test(normalized)){
        const point=command.parameters.conversationPoint as number[],axis=/vertical|y[ -]axis/.test(normalized)?1:/z[ -]axis/.test(normalized)?2:0;
        if(axis<point.length){command.parameters.points=[point.map((n,i)=>n-(i===axis?3:0)),point.map((n,i)=>n+(i===axis?3:0))];delete command.parameters.parseError;accepted=true;}
      }
      else if(pending.slot==='reference'){
        try{const reference=resolveTarget(normalized.replace(/^(?:through|to)\s+/,'').replace(/^(?:the )?(?:line|point)\s+/,''),scene);
          if(reference.type==='point'&&/^through\b/.test(normalized)){command.parameters.position=reference.position;return {plan:pending.plan,message:pending.question};}
          if(reference.type==='line'){
            command.parameters.conversationReferenceProvided=true;
            const referenceTarget=scene.objects.some(o=>o.id===reference.id)?reference.id:reference.label??normalized;
            if(command.action==='CHANGE'){command.targets=[referenceTarget,command.target!];command.parameters.relation='PERPENDICULAR';delete command.parameters.parseError;}
            else command.target=referenceTarget;
            pending.references=reference.derivedFrom;
            accepted=true;
          }
        }catch{/* Keep the pending question until a real line is chosen. */}
      }
      if(accepted){plan=structuredClone(pending.plan);if(pending.slot==='points'&&command.parameters.count===2){const points=command.parameters.points!;plan.commands=[0,1].map(i=>({...structuredClone(command),id:crypto.randomUUID(),parameters:{...command.parameters,count:1,points:points.slice(i*2,i*2+2),legacy:undefined}}));}this.pending=undefined;}
      else if(/^(draw|create|make|change|set|duplicate|copy|mark|plot|graph|hide|show|move|rotate|reflect|scale|delete|find|what|where|are|is|now|select|undo|redo|actually|instead)\b/.test(normalized)){this.pending=undefined;}
      else return {plan:pending.plan,message:pending.question};
    }
    if(/^(?:put|draw|create) (?:a )?circle inside (?:it|that|the square)$/.test(normalized)){
      try{const object=resolveTarget('lastReferenced',scene);if(object.type==='square'){
        const radius=Number(object.command.width)*(object.command.scale??1)/2,point=center(object);
        const proposed=parseSemanticPlan(`Create a circle radius ${radius} at (${point.join(',')})`,scene.activeMode);
        this.pending={plan:proposed,index:0,slot:'confirmation',question:'Should I draw the inscribed circle touching all four sides?',options:['yes','no'],choices:[proposed],references:[object.id]};return {plan:proposed,message:this.pending.question};
      }}catch{/* Let normal resolution report the unavailable shape. */}
    }
    if(/^(?:draw|create) (?:the |a )?diagonal(?: of (?:it|that))?$/.test(normalized)){
      try{const object=resolveTarget('lastReferenced',scene),points=vertices(object);if(['square','rectangle'].includes(object.type)&&points.length===4){
        const choices=[[points[0],points[2]],[points[1],points[3]]].map(pair=>parseSemanticPlan(`Draw line (${pair[0].join(',')}) to (${pair[1].join(',')})`,scene.activeMode));
        this.pending={plan:choices[0],index:0,slot:'diagonal',question:'Which diagonal: 1 (first to third vertex), or 2 (second to fourth vertex)?',options:['1','2'],choices,references:[object.id]};return {plan:choices[0],message:this.pending.question};
      }}catch{/* Preserve the normal object error. */}
    }
    if(/^make another parallel to (?:that one|it) through (?:the )?left edge$/.test(normalized)){
      try{const line=resolveTarget('lastReferenced',scene),shape=scene.objects.find(o=>this.lastMathResult?.targets.includes(o.id)&&['rectangle','square'].includes(o.type));
        if(line.type==='line'&&shape){const points=vertices(shape),left=[...points].sort((a,b)=>a[0]-b[0])[0];plan=parseSemanticPlan(`Draw parallel line through (${left.join(',')})`,scene.activeMode);plan.commands[0].target=line.id;}
      }catch{/* Ambiguous shapes must be resolved normally. */}
    }
    if(/^(again|same|do it again|do (?:the )?same)(?: with .+)?$/.test(normalized)){
      const previous=this.lastMutation;if(previous&&!['DELETE','UNDO','REDO','CLEAR'].includes(previous.action)){
        const command=structuredClone(previous),name=normalized.match(/ with (.+)$/)?.[1];if(name)command.target={name};else if(scene.selectedIds.length===1)command.target=scene.selectedIds[0];plan={...plan,commands:[command]};
      }
    }
    for(let index=0;index<plan.commands.length;index++){
      const command=plan.commands[index],p=command.parameters;
      if(plan.commands.length===1&&/\bthat (circle|triangle|rectangle|square|line|point|vector)\b/.test(normalized)&&!this.pending&&typeof command.target!=='string'&&scene.selectedIds.length!==1){const type=normalized.match(/\bthat (circle|triangle|rectangle|square|line|point|vector)\b/)![1],candidates=scene.objects.filter(o=>o.type===type);if(candidates.length>1)return this.ask(plan,index,'target','Several objects match. Which object should I use?',candidates.map(o=>o.id));}
        if(command.action==='CHANGE'&&['COLOR','FILL_COLOR','STROKE_COLOR'].includes(command.subAction)&&!p.color)return this.ask(plan,index,'color','Which color should I use?');
      if(command.action==='CHANGE'&&command.subAction==='ANGLE'&&!p.impossibleAngles){
        let host;try{host=resolveTarget(command.target,scene);}catch{/* The ordinary resolver will report unavailable objects. */}
        if(!p.vertex){if(scene.activeAngle&&host?.id===scene.activeAngle.objectId)p.vertex=['A','B','C'][scene.activeAngle.vertex];else if(host?.type==='angle')p.vertex='A';else return this.ask(plan,index,'angleVertex','Which angle should I change: angle A, B or C?',['A','B','C']);}
        if(p.angle===undefined)return this.ask(plan,index,'angle','By how many degrees, or to which angle, should I change it?');
      }
      if(command.action==='CREATE'&&command.subAction==='ANGLE'&&p.angle===undefined)return this.ask(plan,index,'angle','How many degrees should the angle measure?');
      if(command.action==='CONSTRUCT'&&command.subAction==='TANGENT'&&!p.position){
        const name=command.normalizedPhrase.match(/\bat\s+(?:point\s+)?([a-z]\d*)\b/)?.[1];
        if(name){try{const point=resolveTarget(name,scene);if(point.type!=='point')return this.ask(plan,index,'position','Which point on the circle should I use?');p.position=point.position;if(scene.objects.some(o=>o.id===point.id))p.tangentPointId=point.id;}catch{return this.ask(plan,index,'position','Which point on the circle should I use? Give its coordinates.');}}
        if(!p.position&&p.angle===undefined)return this.ask(plan,index,'position','At which point on the circle should I draw the tangent? Give coordinates such as (3,4).');
      }
      if(command.action==='MOVE'&&/\bto\b/.test(command.normalizedPhrase)&&!/\bto (?:the )?(?:left|right|up|down|forward|backward)\b/.test(command.normalizedPhrase)&&!p.absolute){
        command.target=targetFromPhrase(command.normalizedPhrase.split(/\bto\b/)[0]);
        const destination=command.normalizedPhrase.match(/\bto (?:point )?([a-z0-9]+)\b/)?.[1];let point:number[]|undefined;
        if(destination)try{const object=resolveTarget(/^\d+$/.test(destination)?`P${destination}`:destination,scene);if(object.type==='point')point=object.position;}catch{/* Keep the move until its destination is supplied. */}
        if(!point&&/\bto (?:there|that point|it)\b/.test(command.normalizedPhrase)&&Array.isArray(scene.previousResult)&&scene.previousResult.every(n=>typeof n==='number'))point=scene.previousResult as number[];
        if(point){p.vector=point;p.absolute=true;delete p.parseError;}
        else {try{const target=resolveTarget(command.target,scene);if(scene.objects.some(o=>o.id===target.id))command.target=target.id;}catch{/* A multi-step plan may create its subject first. */}return this.ask(plan,index,'destination',`Provide ${scene.activeMode.endsWith('3d')?3:2} destination coordinates or an existing point name. Where should I move it?`);}
      }
      if(/\bother (?:one|line|circle|shape|object)\b/.test(command.normalizedPhrase)&&!/^no\b/.test(normalized)&&!(typeof command.target==='string'&&scene.objects.some(o=>o.id===command.target))){
        if(scene.previousCommands?.at(-1)?.action==='CREATE'&&Number(scene.previousCommands.at(-1)?.parameters.count??1)>1||scene.selectedIds.length!==1&&(scene.activeObjectIds?.length??0)>1)return this.ask(plan,index,'target','Which object should I change?',scene.activeObjectIds!);
        const active=scene.selectedIds.length===1?scene.selectedIds[0]:scene.activeObjectIds?.at(-1)??scene.lastReferenced,type=typeof command.target==='object'?command.target.type:scene.objects.find(o=>o.id===active)?.type;
        const others=scene.objects.filter(o=>o.id!==active&&(!type||o.type===type));if(others.length===1)command.target=others[0].id;else if(others.length>1)return this.ask(plan,index,'target','Which other object?',others.map(o=>o.id));
      }
      if(/\b(?:new|old) one\b/.test(command.normalizedPhrase)){const sorted=[...scene.objects].sort((a,b)=>(a.creationOrder??0)-(b.creationOrder??0)),object=/\bold one\b/.test(command.normalizedPhrase)?sorted[0]:sorted.at(-1);if(object)command.target=object.id;}
      if(command.action==='FIND'&&['ROOTS','X_INTERCEPT','Y_INTERCEPT'].includes(command.subAction)&&command.target==='lastReferenced')command.target={type:'plot',reference:'lastReferenced'};
      if(command.action==='FIND'&&['X_INTERCEPT','Y_INTERCEPT'].includes(command.subAction)&&scene.objects.find(o=>o.id===scene.lastReferenced)?.type==='line')command.target=scene.lastReferenced;
      if(command.action==='CREATE'&&command.subAction==='PLANE'&&!(p.planeParents as string[]|undefined)?.length&&p.points?.length!==3)return this.ask(plan,index,'planePoints','Which three noncollinear 3D points should determine the plane?');
      if(command.action==='CONSTRUCT'&&command.subAction==='PERP_PLANE'&&!p.position&&!p.throughPoint)return this.ask(plan,index,'position','Through which 3D point should the perpendicular line pass?');
      if(command.action==='CREATE'&&command.subAction==='LINE'&&/through (?:those|these|the) (?:2|two) points/.test(normalized)){const points=scene.objects.filter(o=>o.type==='point').slice(-2);if(points.length===2){p.points=points.map(o=>o.position);delete p.parseError;}}
      if(command.action==='CHANGE'&&command.subAction==='RELATION'&&p.multiple){const lines=scene.selectedIds.map(id=>scene.objects.find(o=>o.id===id)).filter(o=>o?.type==='line');if(lines.length!==2)return this.ask(plan,index,'reference','Choose two lines to make parallel.');}
      if(command.target==='lastReferenced'){const named=scene.objects.filter(o=>o.label&&command.normalizedPhrase.split(/[^a-z0-9]+/).includes(o.label.toLowerCase()));if(named.length===1)command.target=named[0].id;}
      if(command.action==='CHANGE'&&command.subAction==='RELATION'&&!p.multiple&&!command.targets)return this.ask(plan,index,'reference','Which reference line should it be perpendicular to? Give its name.');
      if(command.action==='CONSTRUCT'&&p.throughPoint&&!p.position){try{const point=resolveTarget(String(p.throughPoint),scene);if(point.type==='point')p.position=point.position;}catch{/* Ask for a named existing point below. */}}
        if(command.action==='CONSTRUCT'&&['PARALLEL','PERPENDICULAR','PERPENDICULAR_BISECTOR'].includes(command.subAction)){
        const edge=this.lastMathResult?.targets.find(id=>id.startsWith('$edge:'));if(edge)command.target=edge;
        if(!edge&&!p.conversationReferenceProvided&&!/\b(?:to|of|parallel to|perpendicular to) (?:the )?(?:line )?[a-z]{1,2}\d*\b/.test(command.normalizedPhrase)&&!scene.objects.some(o=>o.type==='line'&&(o.id===scene.lastReferenced||this.lastMathResult?.targets.includes(o.id))))return this.ask(plan,index,'reference','Which line should I use as the reference?');
        try{const reference=resolveTarget(command.target,scene);if(reference.type!=='line')return this.ask(plan,index,'reference','Which line should I use as the reference?');}catch{return this.ask(plan,index,'reference','Which line should I use as the reference?');}
        if(!p.position&&p.through!=='midpoint'&&command.subAction!=='PERPENDICULAR_BISECTOR'&&!(Array.isArray(scene.previousResult)&&scene.previousResult.every(n=>typeof n==='number'))&&!scene.objects.some(o=>o.id===scene.lastCreated&&o.type==='point'))return this.ask(plan,index,'position','Through which point? Give coordinates.');
      }
      if(command.action==='CREATE'&&command.subAction==='PLANE'&&!(p.planeParents as string[]|undefined)?.length&&p.points?.length!==3)return this.ask(plan,index,'planePoints','Which three noncollinear 3D points should determine the plane?');
      if(command.action==='CONSTRUCT'&&command.subAction==='PERP_PLANE'&&!p.position&&!p.throughPoint)return this.ask(plan,index,'position','Through which 3D point should the perpendicular line pass?');
      if(command.action==='CREATE'&&command.subAction==='LINE'&&/through (?:it|that point|the center|the centre)/.test(normalized)&&Array.isArray(scene.previousResult)){
        const point=(Array.isArray(scene.previousResult[0])&&scene.previousResult.length===1?scene.previousResult[0]:scene.previousResult) as number[];
        if(point.every(n=>typeof n==='number')){p.conversationPoint=point;if(/vertical|horizontal/.test(normalized)){const axis=/vertical/.test(normalized)?1:0;p.points=[point.map((n,i)=>n-(i===axis?3:0)),point.map((n,i)=>n+(i===axis?3:0))];delete p.parseError;}else return this.ask(plan,index,'lineDirection','Which direction should the line have: horizontal or vertical?');}
      }
      if(command.action==='CREATE'&&['LINE','RAY','VECTOR'].includes(command.subAction)&&!(p.points as number[][]|undefined)?.length&&!p.legacy?.points?.length)return this.ask(plan,index,'points',p.count===2?'Give four endpoints: two for each intersecting line.':'What are the two endpoints? Give coordinates such as (0,0) and (4,2).');
      if(command.action==='CREATE'&&command.subAction==='POINT'&&!p.position&&!p.legacy?.points?.length)return this.ask(plan,index,'position','Where should I place the point? Give its coordinates.');
      if(command.action==='CREATE'&&command.subAction==='CIRCLE'&&(Number(p.count)>1||/centered there|centred there/.test(command.normalizedPhrase))&&!/radius|diameter/.test(command.normalizedPhrase)&&!p.conversationRadiusProvided)return this.ask(plan,index,'radius','What radius should the circles have?');
      if(plan.commands.length===1&&!['CREATE','UNHANDLED','UNSUPPORTED','UNDO','REDO','EXPLAIN','COUNT'].includes(command.action)&&!p.multiple&&!command.targets&&command.target!=='$previousResult'){
        try{const target=resolveTarget(command.target??'lastReferenced',scene);if(scene.objects.some(o=>o.id===target.id))command.target=target.id;}
        catch(error){if(error instanceof ResolutionError&&error.candidates.length)return this.ask(plan,index,'target',`Several objects match. Which object? ${error.candidates.map((id,i)=>`${i+1}: ${scene.objects.find(o=>o.id===id)?.label??id}`).join('; ')}`,error.candidates);}
      }
      if(command.action==='MOVE'&&!p.absolute){
        const raw=normalizeLanguage(command.rawPhrase),direction=p.conversationDirection??raw.match(/\b(left|right|up|down|forward|backward)\b/)?.[1];
        const vector=p.vector as number[]|undefined;
        if(!vector?.some(v=>v!==0)&&! /\b0\b/.test(raw)){
          p.conversationDirection=direction;
          if(direction)return this.ask(plan,index,'distance','How far should I move it?');
          p.conversationDistance=raw.match(new RegExp(NUMBER_PATTERN))?.[0];
          return this.ask(plan,index,'direction','Which direction should I move it?');
        }
      }
      if(command.action==='CHANGE'&&command.subAction==='SIDE'){if(p.length===undefined)return this.ask(plan,index,'triangleLength','What should the side length be?');if(p.sidePolicy===undefined)return this.ask(plan,index,'trianglePolicy','Which constraints should I preserve? Say “keep A and C fixed and B on ray AB” or “preserve AC and BC, fix A and the AB direction, keep C on the same side”.');}
      if(command.action==='ROTATE'&&p.angle===undefined)return this.ask(plan,index,'angle','By how many degrees should I rotate it?');
      if(command.action==='SCALE'&&p.factor===undefined)return this.ask(plan,index,'factor','What scale factor should I use?');
      if(command.action==='REFLECT'&&command.subAction==='LINE'&&!p.axis&&!p.plane&&!/y\s*=/.test(command.normalizedPhrase))return scene.activeMode.endsWith('3d')?this.ask(plan,index,'plane','Across which plane: xy, xz, or yz?'):this.ask(plan,index,'axis','Across which axis: x or y?');
    }
    return {plan};
  }
  finish(result:RoboResult,scene:RoboSceneContext){
    if(result.status==='success'&&result.plan.commands.some(c=>['UNDO','REDO'].includes(c.action))){this.pending=undefined;this.lastMutation=structuredClone(scene.previousCommands?.filter(c=>!['FIND','CHECK','COMPARE','SELECT','DESELECT'].includes(c.action)).at(-1));this.lastMutationState=geometryState(scene);}
    if(result.status==='success'&&result.effects.length){const mutation=result.plan.commands.filter(c=>!['FIND','CHECK','COMPARE','SHOW','MARK','SELECT','DESELECT'].includes(c.action)).at(-1);if(mutation){this.lastMutation=structuredClone(mutation);if(['CREATE','DUPLICATE'].includes(mutation.action))this.lastMutation.target=scene.lastCreated;if(mutation.parameters.conversationLogicalVector)this.lastMutation.parameters.vector=mutation.parameters.conversationLogicalVector as number[];if(mutation.parameters.conversationLogicalAngle!==undefined)this.lastMutation.parameters.angle=Number(mutation.parameters.conversationLogicalAngle);this.lastMutationState=geometryState(scene);}}
    if(result.status==='success'&&result.plan.commands.some(c=>['FIND','CHECK','COMPARE','MARK'].includes(c.action)))this.lastMathResult={value:result.value,explanation:result.explanation||result.message,targets:[...(scene.lastQueryTargets??[])]};
    const references=result.plan.commands.flatMap(c=>[c.target,...(c.targets??[])].filter((t):t is string=>typeof t==='string'&&scene.objects.some(o=>o.id===t)));
    this.turns.push({text:this.text,kind:this.pending?'follow-up':result.plan.commands[0]?.action??'conversation',subjectBefore:this.before,subjectAfter:[...(scene.activeObjectIds??[])],pending:this.pending?structuredClone(this.pending):undefined,status:result.status,message:result.message,plan:structuredClone(result.plan),resolvedReferences:references,missingSlots:this.pending?[this.pending.slot]:[],confidence:{intent:result.plan.confidence,reference:references.length?1:this.pending?.slot==='target'?0:result.plan.commands.some(c=>c.target)?0.5:1,answer:result.status==='success'?1:0,contextContinuity:references.some(id=>this.before.includes(id))?1:0},executed:result.status==='success'&&result.effects.length>0});
    if(this.turns.length>25)this.turns.shift();
  }
}
