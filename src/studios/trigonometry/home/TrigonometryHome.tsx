import { Link } from 'react-router-dom';
import { ArrowRight, Grid3X3, Home, Play } from 'lucide-react';
import TrigCinematicScene from './TrigCinematicScene';
import TrigArtwork, { TrigSymbol } from './TrigArtwork';
import StudioTheoryPanel from '../../mockup/StudioTheoryPanel';
import { studioMockups } from '../../mockup/studioMockupCatalog';
import './trigonometryHome.css';
const topics = [
  ['unit-circle','Unit Circle','Read sin, cos, and tan from the circle.'],
  ['right-triangle','Right Triangle','Solve a right triangle with SOH-CAH-TOA.'],
  ['graphs','Functions & Graphs','See how A, B, C, and D reshape a wave.'],
  ['identities','Identities','Watch Pythagorean and angle-sum identities hold.'],
  ['inverse','Inverse Trig','Read principal values of arcsin, arccos, and arctan.'],
  ['oblique','Sine & Cosine Laws','Apply the sine and cosine laws to any triangle.'],
  ['waves','Waves & Harmonics','Build beats and harmonics from two sines.'],
  ['applications','Applications','Find a height from distance and elevation.'],
];
const principles=[['eye','OBSERVE','See how the point moves on the unit circle as θ changes.','Angles'],['bulb','UNDERSTAND','Understand projections, signs, and exact values.','Exact Values'],['why','WHY','Discover the meaning behind the relationships.','Unit Circle'],['trophy','CHALLENGE','Solve problems and apply trig concepts.','Quadrants']];
export default function TrigonometryHome(){
  return <div className="tgh-home">
    <header className="tgh-header"><Link to="/trigonometry" className="tgh-brand"><TrigSymbol kind="logo"/><span>TRIGONOMETRY<small>STUDIO</small></span></Link><nav aria-label="Studio navigation"><Link to="/trigonometry" aria-current="page"><Home/>Studio Home</Link><Link to="/"><Grid3X3/>Main App Home</Link></nav><div className="tgh-badge"><span>▥</span><div>Learn • Visualize • Practice<small>Math. Anywhere. For a Brighter Tomorrow.</small></div></div></header>
    <section className="tgh-hero"><TrigCinematicScene/><div className="tgh-hero-copy"><h1>Triangles Connect<br/><span>Math to the Real World</span></h1><p>Visualize. Explore. Experiment. Build intuition with interactive simulations, real-world applications and step-by-step labs.</p><div className="tgh-features">{[['target','Interactive','Visualizations'],['bulb','Real-world','Examples'],['gear','Hands-on','Practice']].map(([icon,a,b])=><div key={icon}><span><TrigSymbol kind={icon}/></span><strong>{a}<br/>{b}</strong></div>)}</div><div className="tgh-actions"><Link to="/trigonometry/unit-circle"><Play fill="currentColor"/>Start Learning<ArrowRight/></Link><button onClick={()=>document.getElementById('tgh-topics')?.scrollIntoView({behavior:'smooth',block:'start'})}><TrigSymbol kind="book"/>View All Topics</button></div></div></section>
    <section className="tgh-topics" id="tgh-topics"><div className="tgh-section-title"><h2>Explore Key Topics</h2><p>“Mathematics is not just about numbers, it’s about seeing patterns in the world.”</p></div><div className="tgh-topic-grid">{topics.map(([id,title,description],i)=><Link key={id} className="msk-trig-topic-tile" data-lab-id={id} to={`/trigonometry/${id}`}><span className="tgh-number">{String(i+1).padStart(2,'0')}</span><TrigArtwork kind={id}/><div><strong>{title}</strong><p>{description}</p></div><span className="tgh-arrow"><ArrowRight/></span></Link>)}</div><div className="tgh-principles">{principles.map(([icon,title,description,mode])=><Link key={title} to={`/trigonometry/unit-circle?mode=${mode}`}><span className="tgh-principle-icon"><TrigSymbol kind={icon}/></span><div><strong>{title}</strong><p>{description}</p></div><span className="tgh-small-arrow"><ArrowRight/></span></Link>)}</div></section>
    <footer className="tgh-footer">TRIGONOMETRY STUDIO  |  VISUALIZE  •  EXPLORE  •  LEARN  •  APPLY <span>Angles shape a smarter tomorrow</span></footer>
    <div className="tgh-learning"><StudioTheoryPanel studioId="trigonometry" page={studioMockups.trigonometry.pages[0]}/></div>
  </div>;
}
