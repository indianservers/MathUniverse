import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import katex from 'katex';
import { describe, expect, it } from 'vitest';
import { studioMockups } from '../../mockup/studioMockupCatalog';
import IdentityStudio from './IdentityStudio';
import { IdentityWaves } from './IdentityFigure';
import { colorFormula, identities } from './identityMath';
const page=studioMockups.trigonometry.pages.find(p=>p.id==='identities')!;
const render=(route:string)=>renderToString(<MemoryRouter initialEntries={[route]}><IdentityStudio page={page}/></MemoryRouter>);
describe('identities workspace integration',()=>{
  it('keeps product graphs before the circle and inside their own viewport at every phase',()=>{
    for(const item of identities.filter(i=>i.family==='Product-Sum')){
      const html=render(`/trigonometry/identities?identity=${item.id}`);
      expect(html.indexOf('Linked identity curves')).toBeLessThan(html.indexOf('Visual Proof:'));
      expect(html.match(/Linked identity curves/g)).toHaveLength(1);
      for(const phi of [0,30,90,180,270,360]){
        const waves=renderToString(<IdentityWaves identity={item} theta={339} phi={phi} units="deg"/>);
        const paths=[...waves.matchAll(/<path d="([^"]+)" fill="none"/g)];
        expect(paths).toHaveLength(4);
        for(const path of paths)for(const match of path[1].matchAll(/[ML]([\d.]+),(-?[\d.]+)/g)){
          expect(Number(match[1])).toBeGreaterThanOrEqual(0);expect(Number(match[1])).toBeLessThan(600);
          expect(Number(match[2])).toBeGreaterThanOrEqual(0);expect(Number(match[2])).toBeLessThan(205);
        }
      }
    }
  });
  it('renders every equation and proof step as valid mathematical notation',()=>{
    for(const item of identities) for(const formula of [item.latex,...item.steps.map(s=>s.equation)])expect(()=>katex.renderToString(colorFormula(formula),{throwOnError:true}),`${item.id}: ${formula}`).not.toThrow();
  });
  it('keeps at most four identity cards in live view and places the angle control before the figure',()=>{
    const html=render('/trigonometry/identities?mode=Angle+Sum');
    const cards=html.split('class="ids-identity-cards"')[1].split('class="ids-paging"')[0];
    expect((cards.match(/<button/g)||[]).length).toBe(4);
    expect(html.indexOf('Control the live diagram')).toBeLessThan(html.indexOf('Visual Proof:'));
    expect(html).toContain('Next identities');expect(html).toContain('Search identities');
  });
  it('opens the requested additional identity with its own matching explanation',()=>{
    const html=render('/trigonometry/identities?identity=negative-cos');
    expect(html).toContain('data-id-mode="Negative Angles"');
    expect(html).toContain('Reflection across the x-axis');
    expect(html).toContain('Reflect across x-axis');
  });
  it('provides identity-specific reciprocal proof and explicit domain',()=>{
    const html=render('/trigonometry/identities?identity=secant');
    expect(html).toContain('Divide by cos²θ');expect(html).toContain('cos θ ≠ 0');
    expect(html).toContain('Scale the unit triangle');
    expect(html).not.toContain('Identity verified');
  });
});
