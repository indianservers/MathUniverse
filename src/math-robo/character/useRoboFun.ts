import {useEffect,useRef,useState,type RefObject} from 'react';
import type {RoboCharacterHandle} from './RoboCharacter';
import type {useRoboPosition} from './useRoboPosition';
import {describeAwareness,robotAnchor,type AwarenessSnapshot} from './spatialAwareness';
import {funTargets,landingPoint,type FunTravel} from './funTargets';
export type FunAction=FunTravel|'dance'|'wave'|'wink'|'where'|'surprise'|'stop';
type Transport=Pick<ReturnType<typeof useRoboPosition>,'moveTo'|'jumpTo'|'stop'>;
// Instant reduced-motion steps need a painted frame before browser hit testing catches up.
const painted=()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(resolve,60))));
export function useRoboFun(launcher:RefObject<HTMLButtonElement>,character:RefObject<RoboCharacterHandle>,position:Transport,refresh:()=>AwarenessSnapshot|undefined,route:string){
 const [active,setActive]=useState(false),[message,setMessage]=useState('');
 const token=useRef(0),playing=useRef(false),mounted=useRef(true);
 const latest=useRef({position,refresh});latest.current={position,refresh};
 function stop(){token.current++;if(playing.current){playing.current=false;latest.current.position.stop();if(mounted.current){setActive(false);setMessage('Adventure stopped.');}}}
 const stopRef=useRef(stop);stopRef.current=stop;
 useEffect(()=>{mounted.current=true;setMessage('');const cancel=()=>stopRef.current();window.addEventListener('scroll',cancel,true);window.addEventListener('resize',cancel);return()=>{mounted.current=false;stopRef.current();window.removeEventListener('scroll',cancel,true);window.removeEventListener('resize',cancel);};},[route]);
 async function run(action:FunAction){
  stop();if(action==='stop'){position.stop();setMessage('I stopped moving.');return;}
  if(action==='where'){const snapshot=refresh();setMessage(snapshot?describeAwareness(snapshot):'Checking my surroundings…');return;}
  if(action==='surprise'){
   const choices:Array<Exclude<FunAction,'stop'|'where'|'surprise'>>=['dance','wave','wink'],actor=launcher.current;
   if(actor){const anchor=robotAnchor(actor);if(funTargets(anchor,'buttons',actor.offsetWidth,actor.offsetHeight).length>1)choices.push('buttons','jump');if(funTargets(anchor,'text',actor.offsetWidth,actor.offsetHeight).length)choices.push('text');}
   action=choices[Math.floor(Math.random()*choices.length)];
  }
  if(action==='dance'||action==='wave'||action==='wink'){
   position.stop();character.current?.setExpression(action==='wink'?'winking':'excited');character.current?.playAction(action==='wink'?'nod':action);setMessage(action==='dance'?'A little victory dance!':action==='wave'?'Hello from your maths companion!':'A wink for a curious mind.');return;
  }
  const actor=launcher.current,snapshot=refresh();if(!actor||!snapshot)return;
  const runId=++token.current;playing.current=true;setActive(true);
  let destinations:Array<{label:string;kind:string;element?:Element;target:{x:number;y:number}}>=[];
  if(action==='graph'){
   const object=snapshot.nearbyObjects.find(item=>item.screenDistancePx>12)??snapshot.nearbyObjects[0];
   if(object)destinations=[{label:object.label,kind:object.kind,target:object.closest}];
  }else{
   const targets=funTargets(robotAnchor(actor),action,actor.offsetWidth,actor.offsetHeight),away=targets.filter(item=>item.distancePx>12);
   destinations=(away.length?away:targets).slice(0,action==='heading'?1:3);
  }
  try{
   if(!destinations.length){setMessage(action==='graph'?'Bring a graph object into view for me to visit.':action==='text'?'Bring some heading or paragraph text into view for me to crawl over.':'I need a visible, reachable landing spot. Scroll to some buttons or text and try again.');return;}
   for(let i=0;i<destinations.length;i++){
    if(token.current!==runId||!mounted.current)return;
    const destination=destinations[i];
    // Layout, visibility and occlusion can change between steps. Never activate a target.
    if(destination.element){const current=funTargets(robotAnchor(actor),action as Exclude<FunTravel,'graph'>,actor.offsetWidth,actor.offsetHeight).find(item=>item.element===destination.element);if(!current){setMessage('That landing spot is no longer visible. Adventure finished.');return;}destination.target=landingPoint(destination.element.getBoundingClientRect(),innerWidth,innerHeight,actor.offsetWidth,actor.offsetHeight)!;}
    setMessage(`${action==='jump'?'Jumping':action==='text'?'Crawling':'Walking'} to ${destination.kind} “${destination.label}” · ${i+1}/${destinations.length}`);
    const movement=action==='jump'?position.jumpTo(destination.target):position.moveTo(destination.target,action==='text');
    if(!movement.started){setMessage('I need to finish my current activity first.');return;}
    const result=await movement.completion;await painted();
    if(token.current!==runId||!mounted.current)return;
    if(!result.completed){setMessage('Adventure interrupted.');return;}
    if(result.limited){setMessage('That spot is beyond my reachable area. I stopped at the edge.');return;}
    latest.current.refresh();
   }
   const after=latest.current.refresh();setMessage(`Adventure complete! ${after?describeAwareness(after):''}`);
  }catch{if(token.current===runId&&mounted.current)setMessage('That landing spot changed. Try another adventure.');}
  finally{if(token.current===runId&&mounted.current){playing.current=false;setActive(false);}}
 }
 return {active,message,run,stop,clear:()=>setMessage('')};
}
