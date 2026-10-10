import { useLayoutEffect, useState, type RefObject } from 'react';

/** Keep the live figure close on phones; parameters remain one tap away. */
export default function CompactLabControls({container,active}:{container:RefObject<HTMLDivElement|null>;active:string}) {
  const [expanded,setExpanded]=useState(false),[count,setCount]=useState(0);
  useLayoutEffect(()=>{
    const root=container.current;
    if(!root)return;
    const classify=()=>{
      const candidates=[...root.querySelectorAll<HTMLElement>('.msk-controls,.cs-controls,.cds-controls,.cls-controls,.ci-controls,.mvc-controls,.de-controls,.its-left,.la-rail,.np-live-inputs,[data-lab-pane="workspace"]')];
      const eligible=candidates.filter(panel=>{
        if(panel.matches('.ids-controller')||!panel.querySelector('input:not([type="hidden"]),select,textarea'))return false;
        if(panel.querySelector('canvas,.studio-graph-widget,.studio-math-3d,[data-studio-graph]'))return false;
        if([...panel.querySelectorAll('svg[viewBox]')].some(plot=>{const box=(plot.getAttribute('viewBox')||'').split(/[ ,]+/).map(Number);return !plot.closest('.katex')&&(plot.getAttribute('role')==='img'||box[2]>80&&box[3]>100);} ))return false;
        return panel.matches('aside,.msk-panel,.msk-card,.alg-card,.cs-card,.cxs-card,.de-panel,.np-card,.np-live-inputs,.its-left,.la-rail,.la-card') || /controls/.test(panel.className);
      });
      const panels=eligible.filter(panel=>!eligible.some(parent=>parent!==panel&&parent.contains(panel)));
      root.querySelectorAll('[data-compact-controls]').forEach(panel=>panel.removeAttribute('data-compact-controls'));
      panels.forEach(panel=>panel.dataset.compactControls='true');
      setCount(panels.length);
    };
    classify();
    const observer=new MutationObserver(classify);
    observer.observe(root,{childList:true,subtree:true});
    return()=>observer.disconnect();
  },[container,active]);
  useLayoutEffect(()=>{if(container.current)container.current.dataset.controlsExpanded=String(expanded);},[container,expanded]);
  if(active!=='workspace'||!count)return null;
  return <div className="lab-compact-controls"><button type="button" aria-expanded={expanded} aria-controls="lab-section-content" onClick={()=>setExpanded(!expanded)}>{expanded?'Hide controls':'Show controls'}<span>{count} {count===1?'panel':'panels'}</span></button></div>;
}
