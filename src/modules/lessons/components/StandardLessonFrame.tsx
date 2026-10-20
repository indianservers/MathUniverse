import {useEffect,useRef,useState,type ReactNode} from 'react';
import {Link,useLocation} from 'react-router-dom';
import {lessonById,lessonByRoute,adjacentUnifiedLessons} from '../catalog/unified/unifiedLessons';
import {LessonSectionNav,type LessonSection} from './LessonSectionJourney';
import {normalizeLessonTab,applyDedicatedTabVisibility} from './dedicatedLessonTabs';
import './StandardLessonFrame.css';
import {publicLessonLevel} from '../lessonPresentation';
const tabKeys:Record<LessonSection,string>={interaction:'interact',learn:'learn',examples:'example',formulas:'formula',practice:'practice'};
function hideLegacyChrome(root:HTMLElement){
 const hide=(element:HTMLElement)=>{element.setAttribute('data-legacy-lesson-chrome','true');element.setAttribute('aria-hidden','true');element.style.setProperty('display','none','important');};
 for(const nav of root.querySelectorAll<HTMLElement>('nav,[role="tablist"]')){
  const buttons=[...nav.querySelectorAll<HTMLButtonElement>('button')];
  if(buttons.filter(b=>normalizeLessonTab(b.textContent??'')).length>=3||/adjacent/.test(nav.className))hide(nav);
 }
 for(const badge of root.querySelectorAll<HTMLElement>('[data-testid="lesson-id-badge"]'))hide(badge);
 for(const anchor of root.querySelectorAll<HTMLAnchorElement>('a[href^="/lessons/"]')){
  const text=(anchor.textContent??'').trim().replace(/^[^a-z]+/i,'');
  if(/^(previous|prev|next)(\b|:)/i.test(text)||anchor.closest('[class*="adjacent"]'))hide(anchor);
 }
}
export default function StandardLessonFrame({children}:{children:ReactNode}){
 const {pathname}=useLocation();
 const slug=pathname.split('/').at(-1)??'',lesson=lessonByRoute(pathname)??lessonById(Number(slug.split('-')[0]));
 if(!lesson || (lesson.id>=30001 && lesson.id<=30040))return <>{children}</>;
 return <FrameContent key={pathname} id={lesson.id}>{children}</FrameContent>;
}
function FrameContent({children,id}:{children:ReactNode;id:number}){
 const root=useRef<HTMLDivElement>(null),[active,setActive]=useState<LessonSection>('interaction');
 const lesson=lessonById(id)!,adjacent=adjacentUnifiedLessons(id);
 useEffect(()=>{
  if(!root.current)return;
  const node=root.current;hideLegacyChrome(node);
  const observer=new MutationObserver(()=>hideLegacyChrome(node));
  observer.observe(node,{childList:true,subtree:true});
  return ()=>observer.disconnect();
 },[id]);
 function select(tab:LessonSection){
  const node=root.current;if(!node)return;
  const buttons=[...node.querySelectorAll<HTMLButtonElement>('nav button,[role="tablist"] button')];
  const targets=buttons.filter(button=>normalizeLessonTab(button.textContent??'')===tabKeys[tab]);
  if(targets[0])targets[0].click();
  else applyDedicatedTabVisibility((node.firstElementChild as HTMLElement)??node,tab==='interaction'?'Interaction':tab==='practice'?'Know more':tab);
  setActive(tab);
 }
 return <div className="standard-lesson-frame space-y-4" data-standard-lesson-id={id} data-standard-active-tab={active}>
  <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950"><Link to={`/lessons?category=${lesson.categorySlug}`} className="font-bold text-cyan-700 dark:text-cyan-300">{lesson.category}</Link><span className="text-sm font-bold">{publicLessonLevel(lesson.level)}</span></header>
  <LessonSectionNav active={active} onChange={select} lessonId={id}/>
  <div ref={root} className="standard-lesson-content">{children}</div>
  <nav aria-label="Previous and next lessons" className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 dark:border-white/10 dark:bg-slate-950" data-standard-lesson-navigation>
   {adjacent.previous?<Link to={adjacent.previous.route} className="rounded-xl border p-3"><span className="block text-sm font-black">Previous</span><span className="block">{adjacent.previous.title}</span><small>Lesson {adjacent.previous.id}</small></Link>:<span className="rounded-xl p-3 text-sm">First lesson in {lesson.category}</span>}
   {adjacent.next?<Link to={adjacent.next.route} className="rounded-xl border p-3 sm:text-right"><span className="block text-sm font-black">Next</span><span className="block">{adjacent.next.title}</span><small>Lesson {adjacent.next.id}</small></Link>:<span className="rounded-xl p-3 text-sm">Last lesson in {lesson.category}</span>}
  </nav>
 </div>;
}
