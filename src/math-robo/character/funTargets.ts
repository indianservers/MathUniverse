import {visibleUI,type UIElement} from './spatialAwareness';
import type {Target} from './engine';
export type FunTravel='buttons'|'jump'|'text'|'heading'|'graph';
export function landingPoint(rect:{left:number;right:number;top:number;bottom:number},width:number,height:number,actorWidth=76,actorHeight=88):Target|undefined{
 const left=Math.max(rect.left+2,8+actorWidth/2),right=Math.min(rect.right-2,width-8-actorWidth/2),top=Math.max(rect.top+2,8+actorHeight*.91),bottom=Math.min(rect.bottom-2,height-8-actorHeight*.09);
 if(left>right||top>bottom)return;
 return {x:Math.max(left,Math.min(right,(rect.left+rect.right)/2)),y:Math.max(top,Math.min(bottom,(rect.top+rect.bottom)/2))};
}
function buttonLike(item:UIElement){
 if(item.kind==='button'||item.kind==='tab')return true;
 if(item.kind!=='link')return false;
 const style=getComputedStyle(item.element);
 return /button|btn|workspace/i.test(item.element.getAttribute('class')??'')||['flex','inline-flex','inline-block'].includes(style.display)&&!['transparent','rgba(0, 0, 0, 0)'].includes(style.backgroundColor);
}
export function funTargets(anchor:Target,kind:Exclude<FunTravel,'graph'>,actorWidth=76,actorHeight=88):UIElement[]{
 return visibleUI(anchor).filter(item=>kind==='buttons'||kind==='jump'?buttonLike(item):kind==='heading'?item.kind==='heading':['text','heading'].includes(item.kind)&&!item.element.closest('button,a,input,label'))
 .filter(item=>!item.element.closest('[disabled],[aria-disabled="true"]'))
 .map(item=>{const target=landingPoint(item.element.getBoundingClientRect(),innerWidth,innerHeight,actorWidth,actorHeight);return target?{...item,target}:undefined;})
 .filter((item):item is UIElement=>!!item)
 .filter(item=>{const hit=document.elementsFromPoint(item.target.x,item.target.y).find(element=>!element.closest('.offline-assistant,.robo-test-lab,.robo-target-marker,[data-robo-ignore]'));return !!hit&&item.element.contains(hit);})
 .filter((item,index,items)=>items.findIndex(other=>other.element===item.element)===index)
 .sort((a,b)=>Math.hypot(a.target.x-anchor.x,a.target.y-anchor.y)-Math.hypot(b.target.x-anchor.x,b.target.y-anchor.y));
}
