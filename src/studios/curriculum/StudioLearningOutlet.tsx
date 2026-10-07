import { useLayoutEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { studioForPath, curriculumStudios } from './curriculumCatalog';
import { useStudioModel } from '../phase1/StudioModelProvider';
import FocusedLab from './FocusedLab';
import { useSetTheoryStore } from '../../modules/set-theory/setTheoryStore';
import { useGraphTheoryStore } from '../../modules/graph-theory/graphTheoryStore';
import './studioLearning.css';
const dataOnly=(state:Record<string,unknown>)=>Object.fromEntries(Object.entries(state).filter(([,v])=>typeof v!=='function'));
/** Store-backed labs participate in the same figure history without duplicating their engines. */
function StoreBridge({id}:{id:string}){
  const context=useStudioModel(),initial=useRef<Record<string,unknown>|null>(null);
  useLayoutEffect(()=>{
    if(!context||!['set-theory','graph-theory'].includes(id))return;
    const store=id==='set-theory'?useSetTheoryStore:useGraphTheoryStore;
    const key=`store:${id}`,state=dataOnly(store.getState());initial.current=state;
    const restored=context.ledger.initial(key,state);
    const apply=(value:unknown)=>{if(id==='set-theory')useSetTheoryStore.setState(value as Partial<ReturnType<typeof useSetTheoryStore.getState>>);else useGraphTheoryStore.setState(value as Partial<ReturnType<typeof useGraphTheoryStore.getState>>);};
    apply(restored);
    const unregister=context.ledger.register(key,state,restored,apply);
    const unsubscribe=store.subscribe(current=>context.ledger.commit(key,dataOnly(current)));
    return ()=>{unsubscribe();unregister();};
  },[context?.ledger,id]);
  return null;
}
export default function StudioLearningOutlet(){
  const {pathname}=useLocation();
  const curriculumId=/^\/studios\/([^/]+)\/curriculum/.exec(pathname)?.[1];
  const studio=studioForPath(pathname)||curriculumStudios.find(s=>s.id===curriculumId);
  if(!studio)return <Outlet/>;
  const lab=pathname.replace(/\/$/,'')!==studio.base&&!pathname.startsWith('/studios/');
  return <div className="studio-learning-host" data-studio-home={pathname.replace(/\/$/,'') === studio.base ? studio.id : undefined}><StoreBridge id={studio.id}/><nav className="studio-learning-nav" aria-label="Studio learning and model controls"><Link to={studio.base}>Studio Home Page</Link><Link to="/">Main App Home Page</Link></nav><div className="studio-learning-content">{lab?<FocusedLab key={pathname}><Outlet/></FocusedLab>:<Outlet/>}</div></div>;
}


