import { useEffect, useState, type RefObject } from 'react';
/** Compact AR access to existing controls; every action runs the source control's handler. */
export default function ImmersiveWorkspaceControls({root}:{root:RefObject<HTMLDivElement>}){
 const [actionIndex,setActionIndex]=useState(0),[fieldIndex,setFieldIndex]=useState(0);
 const source=root.current?.firstElementChild;
 const [,refresh]=useState(0);
 useEffect(()=>{if(!source)return;let timer=0;const observer=new MutationObserver(()=>{clearTimeout(timer);timer=window.setTimeout(()=>refresh(v=>v+1),80);});observer.observe(source,{subtree:true,childList:true,characterData:true,attributes:true});return()=>{clearTimeout(timer);observer.disconnect();};},[source]);
 const controls=source?[...source.querySelectorAll('button,input,select')].filter((element):element is HTMLInputElement|HTMLButtonElement|HTMLSelectElement=>element instanceof HTMLInputElement||element instanceof HTMLButtonElement||element instanceof HTMLSelectElement):[];
 const name=(element:HTMLElement,index:number)=>(element.getAttribute('aria-label')||element.title||(element instanceof HTMLInputElement||element instanceof HTMLSelectElement?element.closest('label')?.textContent:element.textContent)||`Control ${index+1}`).trim().replace(/\s+/g,' ').slice(0,80);
 const actions=controls.filter((e):e is HTMLButtonElement=>e instanceof HTMLButtonElement&&!e.disabled&&!!name(e,0));
 const fields=controls.filter((e):e is HTMLInputElement|HTMLSelectElement=>!e.disabled&&(e instanceof HTMLSelectElement||e instanceof HTMLInputElement&&['range','number','checkbox'].includes(e.type)));
 const action=actions[Math.min(actionIndex,actions.length-1)],field=fields[Math.min(fieldIndex,fields.length-1)];
 const update=(value:string|boolean)=>{if(!field)return;
  if(field instanceof HTMLInputElement&&field.type==='checkbox'){if(field.checked!==value)field.click();window.setTimeout(()=>refresh(v=>v+1),0);return;}
  const prototype=field instanceof HTMLSelectElement?HTMLSelectElement.prototype:HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype,'value')?.set?.call(field,String(value));field.dispatchEvent(new Event('input',{bubbles:true}));field.dispatchEvent(new Event('change',{bubbles:true}));window.setTimeout(()=>refresh(v=>v+1),0);
 };
 const choose=(direction:number)=>{if(!(field instanceof HTMLSelectElement))return;const index=Math.max(0,Math.min(field.options.length-1,field.selectedIndex+direction));update(field.options[index].value);};
 return <details><summary>Workspace controls</summary><p>These controls edit the current workspace and use its existing validation.</p>
  {!!actions.length&&<><label>Action<select aria-label="AR workspace action" value={Math.min(actionIndex,actions.length-1)} onChange={e=>setActionIndex(Number(e.target.value))}>{actions.map((button,i)=><option key={i} value={i}>{name(button,i)}</option>)}</select></label><button onClick={()=>{if(action&&(!/delete|clear all|remove|reset all/i.test(name(action,0))||window.confirm('Confirm this destructive workspace action?')))action.click();}}>Run workspace action</button></>}
  {!!fields.length&&<><label>Parameter<select aria-label="AR workspace parameter" value={Math.min(fieldIndex,fields.length-1)} onChange={e=>setFieldIndex(Number(e.target.value))}>{fields.map((element,i)=><option key={i} value={i}>{name(element,i)}</option>)}</select></label>
  {field instanceof HTMLInputElement&&<label>{name(field,fieldIndex)}{field.type==='checkbox'?<input key={fieldIndex} type="checkbox" checked={field.checked} onChange={e=>update(e.target.checked)}/>:<input key={fieldIndex} aria-label="AR selected parameter value" type={field.type} value={field.value} min={field.min} max={field.max} step={field.step} onChange={e=>update(e.target.value)}/>}</label>}
  {field instanceof HTMLSelectElement&&<><label>{name(field,fieldIndex)}<select value={field.value} onChange={e=>update(e.target.value)}>{[...field.options].map(option=><option key={option.value} value={option.value}>{option.text}</option>)}</select></label><button onClick={()=>choose(-1)}>Previous option</button><button onClick={()=>choose(1)}>Next option</button></>}
  </>}
 </details>;
}
