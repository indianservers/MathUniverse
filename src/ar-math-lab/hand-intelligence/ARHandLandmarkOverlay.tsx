import { useEffect, useRef, type RefObject } from 'react';
import type { CameraHandRuntime } from './types';

const connections=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
/** Live tracking feedback only. Coordinates are the same cropped/mirrored points used for targeting. */
export default function ARHandLandmarkOverlay({runtime,viewport}:{runtime:RefObject<CameraHandRuntime>;viewport?:()=>{left:number;top:number;width:number;height:number}|undefined}) {
  const canvas=useRef<HTMLCanvasElement>(null),latestViewport=useRef(viewport);latestViewport.current=viewport;
  useEffect(()=>{
    const element=canvas.current,ctx=element?.getContext('2d');if(!element||!ctx)return;
    let raf=0,last=-1,drawn=false,width=0,height=0;
    const resize=()=>{const rect=element.getBoundingClientRect(),ratio=Math.min(2,window.devicePixelRatio||1);width=rect.width;height=rect.height;element.width=Math.round(width*ratio);element.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);last=-1;};
    const observer=new ResizeObserver(resize);observer.observe(element);resize();
    const draw=(now:number)=>{
      raf=requestAnimationFrame(draw);const live=runtime.current,stamp=live?.landmarksAt??-1;
      const points=now-stamp<600?live?.landmarks??[]:[];
      if(stamp===last&&points.length&&drawn&&!viewport)return;
      if(!points.length&&!drawn)return;
      last=stamp;ctx.clearRect(0,0,width,height);drawn=!!points.length;
      const rect=latestViewport.current?.();const offsetX=rect?.left??0,offsetY=rect?.top??0,w=rect?.width??width,h=rect?.height??height;
      if(rect){ctx.save();ctx.beginPath();ctx.rect(rect.left,rect.top,rect.width,rect.height);ctx.clip();}
      points.forEach((hand,index)=>{
        const color=index===0?'#38f5d1':'#fa9cff';ctx.strokeStyle=color;ctx.lineWidth=2;ctx.shadowColor='#000';ctx.shadowBlur=3;
        for(const [a,b] of connections){const p=hand[a],q=hand[b];if(!p||!q)continue;ctx.beginPath();ctx.moveTo(offsetX+p.x*w,offsetY+p.y*h);ctx.lineTo(offsetX+q.x*w,offsetY+q.y*h);ctx.stroke();}
        hand.forEach((p,i)=>{if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return;ctx.beginPath();ctx.arc(offsetX+p.x*w,offsetY+p.y*h,[4,8,12,16,20].includes(i)?5:3,0,Math.PI*2);ctx.fillStyle=[4,8,12,16,20].includes(i)?'#fff476':color;ctx.fill();ctx.strokeStyle='#152137';ctx.lineWidth=1.3;ctx.stroke();ctx.strokeStyle=color;ctx.lineWidth=2;});
        ctx.shadowBlur=0;
      });
      if(rect)ctx.restore();
    };
    raf=requestAnimationFrame(draw);return()=>{cancelAnimationFrame(raf);observer.disconnect();ctx.clearRect(0,0,width,height);};
  },[runtime,!!viewport]);
  return <canvas ref={canvas} data-testid="ar-hand-landmarks" style={viewport?{position:"fixed",inset:0,width:"100vw",height:"100vh",pointerEvents:"none",zIndex:45}:undefined} className="pointer-events-none absolute inset-0 z-30 h-full w-full" role="img" aria-label="Live detected hand joints and fingertips">Colored joints and fingertip points show detected hands. Recognition status appears below the camera.</canvas>;
}
