import type { HandIntelligenceState, ObjectAffordance } from '../../ar-math-lab/hand-intelligence/types';
import { screenTarget } from './types';
/** Hand input delegates to the existing DOM controls and their model validation. */
export class ImmersiveUIControls {
 private ids=new WeakMap<Element,string>();private controls=new Map<string,HTMLInputElement|HTMLButtonElement>();private sequence=0;
 private held?:{id:string;x:number;value:number};private pressed=false;
 target(x:number,y:number,viewport:DOMRect|{left:number;top:number;width:number;height:number}):ObjectAffordance|null{
  const hit=document.elementFromPoint(x,y)?.closest('button,input');
  if(!(hit instanceof HTMLButtonElement||hit instanceof HTMLInputElement)||hit.disabled||hit.closest('.immersive-hud video'))return null;
  if(hit instanceof HTMLInputElement&&!['range','number','checkbox'].includes(hit.type))return null;
  const rect=hit.getBoundingClientRect();if(!rect.width||!rect.height)return null;
  let id=this.ids.get(hit);if(!id){id=`workspace-ui:${++this.sequence}`;this.ids.set(hit,id);}this.controls.set(id,hit);
  const target=screenTarget(id,(rect.left+rect.width/2-viewport.left)/viewport.width,(rect.top+rect.height/2-viewport.top)/viewport.height,Math.max(.025,Math.min(.09,Math.max(rect.width,rect.height)/viewport.width/2)),false,'ui');
  target.allowedInteractions={ui:true};return target;
 }
 update(state:HandIntelligenceState,beforeChange?:()=>void):'begin'|'end'|null{
  const control=state.targetObjectId?this.controls.get(state.targetObjectId):undefined,hand=state.hands.find(h=>state.activeHandIds.includes(h.id));
  if(!state.targetLocked||!control||!hand||control.disabled||!control.isConnected){const ended=!!this.held;this.held=undefined;this.pressed=false;return ended?'end':null;}
  if(control instanceof HTMLButtonElement||control.type==='checkbox'){
   if(!this.pressed){this.pressed=true;const label=`${control.getAttribute('aria-label')??''} ${control.title} ${control.textContent}`;
    if(!/delete|clear all|remove|reset all/i.test(label)||window.confirm('Confirm this destructive workspace action?'))control.click();}
   return null;
  }
  let began=false;if(!this.held||this.held.id!==state.targetObjectId){this.held={id:state.targetObjectId!,x:hand.position[0],value:Number(control.value)};began=true;}
  if(began)beforeChange?.();
  const min=control.min===''?(control.type==='range'?0:-100000):Number(control.min),max=control.max===''?(control.type==='range'?100:100000):Number(control.max),step=control.step==='any'?.01:Number(control.step)||1;
  const value=Math.max(min,Math.min(max,this.held.value+(hand.position[0]-this.held.x)*(control.type==='range'?(max-min)*3:step*200)));
  const next=control.step==='any'?value:Math.round(value/step)*step;
  const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set;
  if(next!==Number(control.value)){setter?.call(control,String(next));control.dispatchEvent(new Event('input',{bubbles:true}));control.dispatchEvent(new Event('change',{bubbles:true}));}
  return began?'begin':null;
 }
 activate(id:string){const control=this.controls.get(id);if(!control||control.disabled||!control.isConnected)return false;if(control instanceof HTMLButtonElement||control.type==='checkbox'){const label=`${control.getAttribute('aria-label')??''} ${control.title} ${control.textContent}`;if(!/delete|clear all|remove|reset all/i.test(label)||window.confirm('Confirm this destructive workspace action?'))control.click();}else control.focus();return true;}
 reset(){this.held=undefined;this.pressed=false;this.controls.clear();}
}
