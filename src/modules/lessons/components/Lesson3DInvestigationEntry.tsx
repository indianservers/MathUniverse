import { lazy, Suspense, useState } from 'react';
import { useParams } from 'react-router-dom';
import { lessonCatalog } from '../catalog/lessonCatalog';
import { schoolLessonCatalog } from '../catalog/school/schoolSyllabusCatalog';
import { resolveStudyLessonId } from './LessonStudySession';
import { investigation3DFor, type Investigation3D } from '../three/lesson3DRegistry';
import './Lesson3DInvestigation.css';

const Investigation=lazy(()=>import('../three/Lesson3DInvestigation'));
function Entry({config,title}:{config:Investigation3D;title:string}){
  const [open,setOpen]=useState(false);
  return <section className="lesson-3d-investigation" data-lesson-3d-investigation data-lesson-3d-id={config.id} aria-label={`${title} 3D investigation`}>
    <header className="l3d-entry-header"><div><p>Spatial investigation</p><h2>Explore {title} in 3D</h2></div><button type="button" aria-expanded={open} aria-controls={`lesson-${config.id}-3d-body`} onClick={()=>setOpen(v=>!v)}>{open?'Close 3D investigation':'Open 3D investigation'}</button></header>
    {open&&<div id={`lesson-${config.id}-3d-body`}><Suspense fallback={<p role="status">Loading the 3D investigation…</p>}><Investigation config={config} title={title}/></Suspense></div>}
  </section>;
}
export default function Lesson3DInvestigationEntry(){
  const params=useParams(),id=resolveStudyLessonId(params);
  const config=id==null?null:investigation3DFor(id);
  if(!config)return null;
  const title=lessonCatalog.find(l=>l.id===id)?.title??schoolLessonCatalog.find(l=>l.numericId===id)?.title;
  return title?<Entry key={id} config={config} title={title}/>:null;
}
