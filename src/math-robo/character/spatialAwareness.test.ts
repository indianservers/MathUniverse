import { describe, it, expect } from 'vitest';
import { nearestOnSegment, objectProximity, insidePolygon, type SpatialObject } from './spatialAwareness';
import { parseSpatialRequest, matchTargetNames } from './spatialCommands';
import { clampRobotPosition,robotPanelStyle, directionAction } from './useRoboPosition';
import { sampleAction } from './engine';

describe('Ruhi spatial awareness and locomotion', () => {
  it('finds actual closest points on edges rather than distances to object centers', () => {
    expect(nearestOnSegment({x:5,y:3},{x:0,y:0},{x:10,y:0})).toEqual({point:{x:5,y:0},t:.5,distance:3});
    expect(nearestOnSegment({x:5,y:3},{x:0,y:0},{x:0,y:0}).distance).toBeCloseTo(Math.sqrt(34));
  });
  it('keeps screen pixels and graph units separate under zoom', () => {
    const line:SpatialObject={id:'AB',label:'AB',kind:'line',samples:[{screen:{x:0,y:0},world:[0,0]},{screen:{x:100,y:0},world:[2,0]}]};
    const result=objectProximity({x:50,y:50},line,[1,1]);
    expect(result?.screenDistancePx).toBe(50); expect(result?.graphDistance).toBe(1); expect(result?.closest).toEqual({x:50,y:0});
    expect(objectProximity({x:50,y:50},line)?.graphDistance).toBeUndefined();
  });
  it('does not connect discontinuous function samples across gaps', () => {
    const curve:SpatialObject={id:'f',label:'f',kind:'plot',samples:[{screen:{x:0,y:0}},undefined,{screen:{x:100,y:0}}]};
    expect(objectProximity({x:50,y:0},curve)?.screenDistancePx).toBe(50);
  });
  it('distinguishes real shape interiors from approximate projected 3D bounds', () => {
    const corners=[{x:0,y:0},{x:100,y:0},{x:100,y:100},{x:0,y:100}];
    expect(insidePolygon({x:50,y:50},corners)).toBe(true);
    const square:SpatialObject={id:'s',label:'Square',kind:'square',samples:corners.map(screen=>({screen})),closed:true,filled:true};
    expect(objectProximity({x:50,y:50},square)?.onObject).toBe(true);
    expect(objectProximity({x:50,y:50},{...square,boundsOnly:true,filled:false})?.onObject).toBe(false);
    expect(objectProximity({x:50,y:50},{...square,boundsOnly:true,filled:false,hit:true})?.screenDistancePx).toBe(0);
  });
  it('recognizes self-motion and awareness without stealing mathematical commands', () => {
    expect(parseSpatialRequest('Ruhi walk top 80 pixels')).toEqual({type:'move',direction:'up',crawl:false,distance:80});
    expect(parseSpatialRequest('crawl left')).toEqual({type:'move',direction:'left',crawl:true,distance:120});
    expect(parseSpatialRequest('crawl')).toEqual({type:'move',direction:'right',crawl:true,distance:120});
    expect(parseSpatialRequest('walk to the Geometry tab')).toMatchObject({type:'target'});
    expect(parseSpatialRequest('Where are you?')).toEqual({type:'where'});
    expect(parseSpatialRequest('how far are you from circle C1')).toMatchObject({type:'distance'});
    expect(parseSpatialRequest('stop walking')).toEqual({type:'stop'});
    for(const math of ['move it left 3 units','move left','distance between A and B','draw a line','rotate the circle 45 degrees'])expect(parseSpatialRequest(math)).toBeUndefined();
  });
  it('asks about ambiguous labels and respects element kinds', () => {
    const list=[{kind:'tab',label:'Geometry'},{kind:'heading',label:'Geometry'},{kind:'button',label:'Reset'},{kind:'button',label:'Reset'}];
    expect(matchTargetNames('Geometry tab',list)).toEqual([list[0]]);
    expect(matchTargetNames('heading Geometry',list)).toEqual([list[1]]);
    expect(matchTargetNames('Reset button',list)).toHaveLength(2);
    expect(matchTargetNames('Delete button',list)).toHaveLength(0);
  });
  it('keeps the solver panel clear of the draggable character', () => {
    for(const [width,height,p] of [[1280,720,{x:577,y:267}],[390,844,{x:160,y:400}],[1280,720,{x:222,y:200}]] as const){
      const style=robotPanelStyle(p,width,height),x=Number(style.left),y=Number(style.top),w=Number(style.width),h=Number(style.maxHeight);
      expect(x+w<=p.x||x>=p.x+76||y+h<=p.y||y>=p.y+88).toBe(true);
      expect(x).toBeGreaterThanOrEqual(12);expect(y).toBeGreaterThanOrEqual(12);expect(y+h).toBeLessThanOrEqual(height-12);
    }
  });
  it('clamps real movement to the viewport and exposes independent crawl joint poses', () => {
    expect(clampRobotPosition({x:-100,y:2000},390,844,64,74)).toEqual({x:8,y:762});
    expect(clampRobotPosition({x:100,y:100},20,20)).toEqual({x:8,y:8});
    expect(directionAction('up',true)).toBe('crawlUp');
    const crawl=sampleAction('crawlLeft',.5,{inPlace:true});
    expect(crawl.body).toBeGreaterThan(50); expect(crawl.head).toBeLessThan(-50); expect(crawl.elbowL).not.toBe(0); expect(crawl.legL).not.toBe(0);
    expect(sampleAction('walkRight',.5,{inPlace:true}).x).toBe(0);
  });
});
