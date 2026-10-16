import {coordinates,numberAfter} from './numberParser';
import {targetFromPhrase} from './targetResolver';
import {parseSelectiveClear} from './selectiveClear';
import type {MathRoboCommand} from './types';

/** Spatial language extensions run before generic shape inference. No generated code. */
export function parseGraph3dLanguage(c:MathRoboCommand):MathRoboCommand|undefined{
  if(!c.mode.endsWith('3d'))return;
  const t=c.normalizedPhrase,p=c.parameters;
  const set=(action:string,subAction:string)=>{if(!(action==='DELETE'&&subAction==='ALL'))c.target??=targetFromPhrase(t);c.action=action;c.subAction=subAction;return c;};
  if(/\b(?:infinit(?:e|ely)|negative height)\b|(?:^|\s)-\s*height\b/.test(t)){p.parseError='Use positive, finite dimensions with a numeric value.';return set('SCALE','UNIFORM');}
  if(/\bhighlight\b/i.test(c.rawPhrase))return set('UNSUPPORTED','SPATIAL_CAPABILITY');
  if(/^clear\b.*\bkeep (?:the )?(?:coordinate )?axes\b/.test(t)){p.preserveSystemAxes=true;return set('DELETE','ALL');}
  // Exception scopes must reach the existing preservation parser before plural edits.
  if(parseSelectiveClear(t))return;
  if(/\([^)]*[a-z][^)]*\)/.test(t)&&/^(?:move|create|draw|plot)\b/.test(t)&&!/[=^]|sin|cos|sqrt/.test(t)){p.parseError='Coordinates must contain three finite numbers.';return set('MOVE','OBJECT');}
  if(/\bdifferent colors\b/.test(t))return set('UNSUPPORTED','SPATIAL_CAPABILITY');
  // These capabilities have no scene executor. Do not silently drop their qualifiers.
  const unavailable=/\b(?:group(?:ed|ing)?|ungroup|continuously|stop the rotation|complete rotation|metallic|glass|transparent|opacity|wireframe|highlight|default material|original size|same size|random|evenly|side by side|next to|above the|on top of|inside a|in a (?:row|circle)|stack|positive x region|world origin|align|coordinate (?:axes|grid)|label the coordinate|graph range|last saved state|repeat the previous|restore it)\b/;
  if(unavailable.test(t)&&!/^move .*along the [xyz]-axis/.test(t))return set('UNSUPPORTED','SPATIAL_CAPABILITY');
  if(/^(?:show|hide|display)\b.*\b(?:axes|grid)\b/.test(t))return set('UNSUPPORTED','SPATIAL_CAPABILITY');
  if(/\bpyramid using\b|\bparametric curve\b|\bhelix\b/.test(t))return set('UNSUPPORTED','SPATIAL_CAPABILITY');
  if(/^(?:plot|graph|draw)\b/.test(t)&&/\bz\^2\b/.test(t)&&/=/.test(t))return set('UNSUPPORTED','IMPLICIT_GRAPH');
  if(/^(?:plot|graph|draw)\b/.test(t)&&/\bz\s*=/.test(t)){
    p.expression=t.slice(t.indexOf('=')+1).trim().replace(/×/g,'*');return set('PLOT','SURFACE_3D');
  }
  if(/\b(?:move|shift)\b.*\balong the [xyz]-axis/.test(t)){p.parseError='Specify the distance and direction along that axis.';return set('MOVE','OBJECT');}
  if(/^(?:restore|reset)\b.*\brotation\b/.test(t)){p.resetRotation=true;p.angle=0;p.axis='z';return set('ROTATE','OBJECT');}
  if(/^(?:rotate|turn)\b.*\bupside down\b/.test(t)){p.angle=180;p.axis='x';return set('ROTATE','OBJECT');}
  if(/^(?:create|place)\b.*\bat (?:the )?origin\b/.test(t)){p.vector=[0,0,0];p.absolute=true;return set('MOVE','OBJECT');}
  if(/^scale\b.*\bhalf\b/.test(t)){p.factor=.5;return set('SCALE','UNIFORM');}
  if(/\b(?:bigger|larger|smaller)\b/.test(t)){p.factor=/smaller/.test(t)?.5:2;p.defaultScale=true;return set('SCALE','UNIFORM');}
  if(/\bside length\b/.test(t)&&/^(?:set|change|resize)\b/.test(t)){p.width=numberAfter(t,'side length');p.uniformSide=true;return set('RESIZE','OBJECT');}
  if(/^resize\b/.test(t)){
    const triple=t.match(/(-?\d+(?:\.\d+)?)\s*(?:×|by)\s*(-?\d+(?:\.\d+)?)\s*(?:×|by)\s*(-?\d+(?:\.\d+)?)/);
    if(triple){[p.width,p.height,p.depth]=triple.slice(1).map(Number);p.independentDimensions=true;return set('RESIZE','OBJECT');}
  }
  if(/^(?:increase|make)\b.*\bheight\b/.test(t)){p.height=numberAfter(t,'height');return set('RESIZE','OBJECT');}
  if(/\btaller\b/.test(t)){p.heightFactor=1.5;return set('RESIZE','OBJECT');}
  if(/\bstretch\b.*\bz-axis\b/.test(t)){p.depthFactor=2;return set('RESIZE','OBJECT');}
  if(/^(?:duplicate|create another)\b/.test(t)){return set('DUPLICATE','OBJECT');}
  if(/^show all hidden/.test(t)){p.multiple=true;c.target={};return set('SHOW','OBJECT');}
  if(/^move (?:them|the spheres|both spheres) apart/.test(t)){p.apart=true;p.vector=[0,0,0];return set('MOVE','OBJECT');}
  if(/^(?:undo|redo)\b/.test(t)){p.steps=numberAfter(t,'undo|redo')??1;return set(t.startsWith('undo')?'UNDO':'REDO','LAST');}
  if(/^(?:color|change|make|set)\b.*\ball\b/.test(t)&&/\b(?:red|blue|green|yellow|purple)\b/.test(t)){
    p.multiple=true;p.color=t.match(/\b(red|blue|green|yellow|purple)\b/)![1];return set('CHANGE','COLOR');
  }
  if(/^scale all objects\b/.test(t)){c.target={};p.multiple=true;p.factor=numberAfter(t,'by');return set('SCALE','UNIFORM');}
  if(/^create\b.*\bplane z\s*=/.test(t)||/^draw\b.*\bplane z\s*=/.test(t)){p.expression=t.split('=')[1]?.trim();return set('PLOT','SURFACE_3D');}
  if(/^create\b.*\bplane through (?:3|three) non-collinear points/.test(t)){p.selectedPlane=true;return set('CREATE','PLANE');}
  if(/^connect\b.*\b2 selected points/.test(t)||/^draw a vector between the 2 points/.test(t)){p.selectedPoints=true;return set('CREATE',/vector/.test(t)?'VECTOR':'LINE');}
  if(/^(?:delete|remove) all\b/.test(t)&&/\b(?:cubes|spheres|cylinders|cones)\b/.test(t)){p.multiple=true;return set('DELETE','OBJECT');}
  if(/^(?:move|rotate|scale) all\b/.test(t)&&/\b(?:cubes|spheres|cylinders|cones)\b/.test(t)){
    // Let the existing parser extract numeric parameters; preserve the plural scope.
    p.multiple=true;
  }
  if(/^rotate\b.*\bown center\b/.test(t)){p.parseError='Specify a rotation angle.';return set('ROTATE','OBJECT');}
  if(/\bimmediately delete it\b/.test(t))return;
  // Malformed numeric tuples must not fall back to an origin-centered object.
  if(/^(?:move|create|draw)\b/.test(t)&&/\([^)]*,[^)]*\)/.test(t)&&!coordinates(t,3).length){p.parseError='Provide three finite numeric coordinates.';return set('MOVE','OBJECT');}
}
