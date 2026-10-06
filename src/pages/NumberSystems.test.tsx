import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import NumberSystems from './NumberSystems';
import {labs,route} from '../studios/number-systems/premium/catalog';
const render=(path:string)=>renderToString(<MemoryRouter initialEntries={[path]}><NumberSystems/></MemoryRouter>);
describe('Number Systems Studio',()=>{
 it.each(labs)('renders the $title lab',lab=>{const html=render(route(lab.id));expect(html).toContain('np-studio');expect(html).toContain('Theory / Learn');expect(html).toContain('Number Systems Studio navigation');expect(html).toContain('np-lab-content');});
 it('links all twelve labs from whole home cards',()=>{const html=render('/number-systems');for(const lab of labs)expect(html).toContain(`class="np-home-card${lab.id==='fundamentals'?' featured':` lab-${lab.id}`}" href="${route(lab.id)}"`);expect(html).toContain('Your Learning Path');expect(html).toContain('Progress counts only completed checks');});
 it('preserves the existing concept and practice workbenches',()=>{expect(render('/number-systems/concepts')).toContain('ns-mini-canvas');expect(render('/number-systems/practice')).toContain('Is 0.125 rational?');expect(render('/number-systems/rational?legacy=1')).toContain('Rational numbers');});
});
