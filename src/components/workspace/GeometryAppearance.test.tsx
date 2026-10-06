import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { GeometryPaintDefs, lineDash, paintValue } from './GeometryAppearance';
describe('geometry appearance',()=>{
 it('keeps new lines continuous and honors explicit dash choices',()=>{expect(lineDash()).toBeUndefined();expect(lineDash({lineStyle:'solid',dashArray:'10 8'})).toBe('');expect(lineDash({lineStyle:'dashed'})).toBe('12 8');expect(lineDash({lineStyle:'dotted'})).toBe('2 7');});
 it('uses user-space gradients for horizontal and vertical lines',()=>{const markup=renderToStaticMarkup(<svg><GeometryPaintDefs id="test" color="#ff0000" style={{paint:'gradient',secondaryColor:'#0000ff'}}/></svg>);expect(markup).toContain('gradientUnits="userSpaceOnUse"');expect(markup).toContain('#0000ff');expect(paintValue('test','#ff0000',{paint:'gradient'})).toBe('url(#test-gradient)');});
 it('connects pattern paint to the matching SVG definition',()=>{const markup=renderToStaticMarkup(<svg><GeometryPaintDefs id="test" color="#ff0000" style={{paint:'pattern',pattern:'dots'}}/></svg>);expect(markup).toContain('id="test-pattern"');expect(markup).toContain('<circle');expect(paintValue('test','#ff0000',{paint:'pattern'})).toBe('url(#test-pattern)');});
});
