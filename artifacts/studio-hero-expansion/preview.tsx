import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import CinematicHero, { heroCatalog } from '../../src/studios/heroes/CinematicHero';
function Preview(){const [id,setId]=useState('number-systems');return <MemoryRouter><main><h2>Studio home animation review · 15 additional subject-specific objects per studio</h2><nav aria-label="Studio previews">{Object.entries(heroCatalog).map(([key,info])=><button key={key} aria-pressed={id===key} onClick={()=>setId(key)}>{info[0]}</button>)}</nav><CinematicHero key={id} id={id}/></main></MemoryRouter>;}
createRoot(document.getElementById('root')!).render(<Preview/>);
