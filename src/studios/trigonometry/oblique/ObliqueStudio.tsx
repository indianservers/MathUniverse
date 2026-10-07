import {useEffect,useState} from 'react';
import {Link,NavLink,Navigate,useLocation,useSearchParams} from 'react-router-dom';
import {Grid2X2,Home,Mountain,Search,Share2,Undo2,Redo2,BookOpen} from 'lucide-react';
import StudioTheoryPanel from '../../mockup/StudioTheoryPanel';
import {studioMockups} from '../../mockup/studioMockupCatalog';
import {StudioModelProvider,useStudioModel} from '../../phase1/StudioModelProvider';
import {base,destinations,Panel,LivePractice} from './ObliqueShared';
import {legacyObliqueRoute} from './triangleMath';
import ObliqueLandscape from './ObliqueLandscape';
import ObliqueStudioHome from './ObliqueStudioHome';
import SineLawPage from './SineLawPage';
import CosineLawPage from './CosineLawPage';
import TriangleAreaPage from './TriangleAreaPage';
import SSAAmbiguousPage from './SSAAmbiguousPage';
import SolveTrianglePage from './SolveTrianglePage';
import './obliqueStudio.css';
const pages={'sine-law':SineLawPage,'cosine-law':CosineLawPage,area:TriangleAreaPage,'ssa-ambiguous-case':SSAAmbiguousPage,'solve-triangle':SolveTrianglePage};
const page=studioMockups.trigonometry.pages.find(p=>p.id==='oblique')!;
const descriptions=['Relates sides and opposite angles in any oblique triangle.','Find unknown sides or angles using the included-angle relationship.','Use trigonometry to find the area of any oblique triangle.','Discover when one set of measurements produces 0, 1 or 2 triangles.','Find every side and angle, choose a method, and verify the result.'];
export default function ObliqueStudio(){return <StudioModelProvider><ObliqueLayout/></StudioModelProvider>;}
function ObliqueLayout(){const location=useLocation(),[params]=useSearchParams(),slug=location.pathname.slice(base.length).replace(/^\/+|\/+$/g,''),legacy=legacyObliqueRoute(params.get('mode')),index=destinations.findIndex(([id])=>id===slug),title=index<0?'Sine & Cosine Laws':destinations[index][1],[search,setSearch]=useState(''),model=useStudioModel();
 const ledger=model?.ledger;
 useEffect(()=>{if(ledger)ledger.apply({...ledger.saved,...ledger.values});},[ledger]);
 useEffect(()=>{document.title=`${title} | Trigonometry Studio`;},[title]);
 useEffect(()=>{setSearch('');document.querySelector('.obl-header')?.scrollIntoView({block:'start'});},[slug]);
 if(!slug&&legacy){const query=new URLSearchParams(params);query.delete('mode');return <Navigate replace to={`${base}/${legacy}${query.size?'?'+query:''}${location.hash}`}/>;}
 if(slug&&index<0)return <Navigate replace to={base}/>;
 const matches=destinations.filter(([,name,desc])=>`${name} ${desc}`.toLowerCase().includes(search.toLowerCase()));
 const ActivePage=pages[slug as keyof typeof pages]??ObliqueStudioHome;
 const mode=index<0?'Sine Law':page.modes[index];
 return <><div className="obl-studio" data-oblique-page={slug||'overview'}><header className="obl-header"><Link to="/trigonometry" className="obl-brand"><Mountain/><span>Trigonometry <b>Studio</b><small>EXPLORE · VISUALIZE · MASTER</small></span></Link><div className="obl-search"><Search/><input aria-label="Search Sine and Cosine Laws topics" placeholder="Search topics, skills or examples…" value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<div className="obl-search-results" role="region" aria-label="Search results">{matches.length?matches.map(([id,name])=><Link key={id} to={`${base}/${id}`}>{name}</Link>):<p>No matching topics.</p>}</div>}</div><nav aria-label="Studio navigation"><Link to="/trigonometry"><Home/>Studio Home</Link><Link className="obl-primary" to="/"><Grid2X2/>Main App Home</Link></nav></header><nav className="obl-subnav" aria-label="Sine & Cosine Laws pages"><NavLink end to={base}>Overview</NavLink>{destinations.map(([id,name])=><NavLink key={id} to={`${base}/${id}`}>{name}</NavLink>)}<div className="obl-model-tools"><button aria-label="Undo triangle change" disabled={!model?.ledger.past.length} onClick={()=>model?.ledger.undo()}><Undo2/></button><button aria-label="Redo triangle change" disabled={!model?.ledger.future.length} onClick={()=>model?.ledger.redo()}><Redo2/></button><button onClick={()=>model?.share()}><Share2/>Share</button></div></nav>{model?.status&&<p className="obl-share-status" role="status">{model.status}</p>}<main>{index>=0&&<section className={`obl-hero ${index<0?'obl-home-hero':''}`}><ObliqueLandscape/><div><span>TRIGONOMETRY {index<0?'STUDIO':'LAB'}</span><h1>{title}</h1><p>{index<0?'Solve Any Triangle, Anywhere':descriptions[index]}</p>{index>=0&&<div className="obl-hero-tags"><span>Explore visually</span><span>Solve step by step</span><span>Build real skills</span></div>}</div><aside>Real triangles.<br/>Real world.<br/>Brighter futures.</aside></section>}<div className="obl-content"><ActivePage key={slug}/><OriginalPractice mode={mode}/></div></main><footer className="obl-footer"><Link to="/trigonometry"><BookOpen/>Trigonometry Studio</Link><span>Explore Triangles. Solve the World.</span></footer></div><div className="obl-preserved-learning"><StudioTheoryPanel studioId="trigonometry" page={page} mode={mode}/></div></>;
}
function OriginalPractice({mode}:{mode:string}){const questions:Record<string,[string,number,string]>={'Sine Law':['If A = B, what is a/b?',1,'Equal angles have equal opposite sides.'],'Cosine Law':['If C = 90° and a = b = 1, what is c²?',2,'Use Pythagoras.'],Area:['If a = b = 2 and C = 90°, what is the area?',2,'Use ½ab sin C.'],'SSA Ambiguous Case':['For acute A, if a = h = b sin A, how many triangles exist?',1,'The swinging circle is tangent to the ray.'],'Solve Triangle':['What is the angle sum of a Euclidean triangle in degrees?',180,'Add its three interior angles.']};const [prompt,answer,hint]=questions[mode];return <details className="obl-preserved-practice"><summary>Original Concept Practice & Learning Notes</summary><Panel title="Observe · Understand · Why · Try"><p>{mode==='Sine Law'?'Compare all three ratios; the circumdiameter is 2R = a/sin A.':mode==='Cosine Law'?'Set the included angle to 90° and observe Pythagoras; compare the square decomposition.':mode==='Area'?'Widen the included angle and compare the shaded area, height and Heron’s formula.':mode==='SSA Ambiguous Case'?'Lower a toward h = b sin A and watch the two solutions merge, then disappear. The acute rule does not apply to obtuse A.':'Read all three sides and angles; SAS gives a unique triangle and its angle sum is 180°.'}</p><LivePractice fixed prompt={prompt+' This is a fixed concept question, independent of the live model.'} expected={answer} signature={mode} hint={hint}/></Panel></details>;}
