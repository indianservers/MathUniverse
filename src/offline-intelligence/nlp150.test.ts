import {describe,expect,it} from 'vitest';
import {RoboLearning} from './roboLearning';
import {nlp150Corpus} from './nlp150Corpus';
import {contextualRequest,type RoboObject} from './objectConversation';
import {outlineVertices,type IntelligenceMode} from './languageEngine';
import {graphExpressions} from './commands';
import {addIntelligenceGeometry} from './geometryAdapter';
import {intelligenceGraph3dLayers} from './graph3dAdapter';
import {createIntelligenceShapeGeometry} from './shapeGeometry3d';
import {commandTransform3d} from './solidAdapter';

describe('150 distinct NLP requests across four workspaces',()=>{
  it('understands each request, preserves geometry and rejects invalid constructions',async()=>{
    const learner=new RoboLearning();
    const failures:string[]=[];
    await learner.ready();
    try {
      for(const mode of ['graph2d','graph3d','geometry2d','geometry3d'] as IntelligenceMode[]) {
        const corpus=nlp150Corpus(mode);
        expect(corpus).toHaveLength(150);
        for(const item of corpus) {
          const objects:RoboObject[]=[];
          try {
            if(item.seed) {const seed=await learner.interpret(item.seed,mode);expect(seed.command).toBeDefined();objects.push({command:seed.command!});}
            const result=contextualRequest(item.request,mode,objects)??await learner.interpret(item.request,mode,objects.at(-1)?.command);
            if(item.reject)expect(result.command).toBeUndefined();
            if(item.kind)expect(result.command?.kind).toBe(item.kind);
            if(item.message)expect(result.message.toLowerCase()).toContain(item.message.toLowerCase());
            if(result.command) {
              const c=result.command;
              expect(c.dimension).toBe(mode.endsWith('3d')?'3d':'2d');
              if(item.category==='anchor') {
                const last=outlineVertices(objects[0].command).at(-1)!;
                outlineVertices(c)[0].forEach((n,i)=>expect(n).toBeCloseTo(last[i],5));
              }
              if(item.category==='tangent') {
                const [a,b]=c.points,center=objects[0].command.points[0]??[0,0,0];
                const touch=a.map((n,i)=>(n+b[i])/2),delta=b.map((n,i)=>n-a[i]);
                expect(Math.hypot(...touch.map((n,i)=>n-(center[i]??0)))).toBeCloseTo(3,5);
                expect(delta.reduce((sum,n,i)=>sum+n*(touch[i]-(center[i]??0)),0)).toBeCloseTo(0,5);
              }
              if(mode==='graph2d')expect(graphExpressions(c).length).toBeGreaterThan(0);
              if(mode==='geometry2d') {
                const scene=addIntelligenceGeometry({points:[],lines:[],circles:[],polygons:[],loci:[]},c);
                expect(scene.points.length+scene.loci.length).toBeGreaterThan(0);
              }
              if(mode==='graph3d')expect(intelligenceGraph3dLayers(c).length).toBeGreaterThan(0);
              if(mode==='geometry3d') {
                expect(commandTransform3d(c).position.every(Number.isFinite)).toBe(true);
                if(!['line','point'].includes(c.kind)) {const mesh=createIntelligenceShapeGeometry(c);expect(mesh.getAttribute('position').count).toBeGreaterThan(0);mesh.dispose();}
              }
            }
          } catch(error) {failures.push(`${mode} #${item.id} ${item.request}: ${error instanceof Error?error.message:String(error)}`);}
        }
      }
    } finally {await learner.dispose();}
    expect(failures).toEqual([]);
  },180000);
});
