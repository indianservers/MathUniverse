import {describe,expect,it} from 'vitest';
import {intelligenceGraph3dLayers} from './graph3dAdapter';
import {interpretVisualRequest} from './languageEngine';
import {compileTwoVariableExpression} from '../utils/functionParser';

describe('compact analytic 3D graph drawings',()=>{
  it.each(['circle radius 3','ellipse width 8 height 4','semicircle radius 2','rectangle width 6 height 4','square side 5'])('draws %s as one finite patch',text=>{
    const command=interpretVisualRequest(`Create ${text}`,'graph3d').command!;
    const layers=intelligenceGraph3dLayers(command);
    expect(layers).toHaveLength(1);
    expect(layers[0].kind).toBe('parametric');
    for(const expression of Object.values(layers[0].components)) {
      const fn=compileTwoVariableExpression(expression.replace(/\bu\b/g,'x').replace(/\bv\b/g,'y'));
      expect(Number.isFinite(fn(0.5,0.5))).toBe(true);
    }
  });
  it('preserves translation, scale and rotation on a compact circle patch',()=>{
    const command=interpretVisualRequest('Create circle radius 3 at (2,4,1)','graph3d').command!;
    command.rotation=[90,0,0];command.scale=2;
    const [layer]=intelligenceGraph3dLayers(command);
    expect(layer.displayTransform).toMatchObject({position:[2,4,1],scale:2,rotation:[Math.PI/2,0,0]});
    const x=compileTwoVariableExpression(layer.components.x.replace(/\bu\b/g,'x').replace(/\bv\b/g,'y'));
    expect(x(0,1)).toBe(3);
  });
});
