import {describe,it,expect} from 'vitest';
import {renderToString} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import ObliqueStudio from './ObliqueStudio';
const base='/trigonometry/oblique';
const routes=[['','Sine &amp; Cosine Laws'],['sine-law','Sine Law'],['cosine-law','Cosine Law'],['area','Area of a Triangle'],['ssa-ambiguous-case','SSA Ambiguous Case'],['solve-triangle','Solve Triangle']];
describe('oblique dedicated pages',()=>{
 it.each(routes)('renders direct route %s with its full learning content',(slug,title)=>{const html=renderToString(<MemoryRouter initialEntries={[base+(slug?'/'+slug:'')]}><ObliqueStudio/></MemoryRouter>);expect(html).toContain(title);expect(html).toContain('Theory &amp; examples');expect(html).toContain('Original Concept Practice');if(slug)expect(html).toContain('Interactive oblique triangle');else{for(const [id] of routes.slice(1))expect(html).toContain(`href="${base}/${id}"`);}});
 it('SSA renders both complete solutions and correct side convention',()=>{const html=renderToString(<MemoryRouter initialEntries={[base+'/ssa-ambiguous-case']}><ObliqueStudio/></MemoryRouter>);expect(html.replace(/<!--.*?-->/g,'')).toContain('2 possible');expect(html.replace(/<!--.*?-->/g,'')).toContain('Triangle 1');expect(html.replace(/<!--.*?-->/g,'')).toContain('Triangle 2');expect(html).toContain('b = AC');expect(html).toContain('B₂');});
 it('preserves area comparison and circumcircle learning',()=>{const html=(slug:string)=>renderToString(<MemoryRouter initialEntries={[base+'/'+slug]}><ObliqueStudio/></MemoryRouter>);expect(html('area')).toContain('Heron');expect(html('sine-law')).toContain('Show circumcircle');expect(html('solve-triangle')).toContain('Known Values and Verification Workspace');});
});
