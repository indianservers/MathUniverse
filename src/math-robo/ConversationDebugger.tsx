import {useState} from 'react';
import {SemanticEngine} from './intelligence/semanticEngine';
import {liveEngine} from './intelligence/liveAssistant';
import type {RoboMode} from './intelligence/types';
type Replay={name:string;mode:RoboMode;turns:string[];expected:{count:number;position?:number[];radius?:number}};
export default function ConversationDebugger(){
  const [mode,setMode]=useState<RoboMode>('geometry2d'),[output,setOutput]=useState<unknown>(),[busy,setBusy]=useState(false);
  async function replay(){setBusy(true);try{
    const response=await fetch('/datasets/math-robo-conversations.json');if(!response.ok)throw new Error('Cannot load conversation dataset');
    const cases=await response.json() as Replay[],results=[];
    for(const test of cases){const engine=new SemanticEngine(test.mode);for(const text of test.turns)await engine.execute(text,async()=>undefined);
      const scene=engine.snapshot(),object=scene.objects[0],expected=test.expected;
      const passed=scene.objects.length===expected.count&&(!expected.position||expected.position.every((n,i)=>Math.abs(n-(object?.position[i]??NaN))<1e-8))&&(expected.radius===undefined||object?.radius===expected.radius);
      results.push({name:test.name,passed,expected,actual:scene.objects.map(o=>({id:o.id,type:o.type,position:o.position,radius:o.radius})),memory:engine.workingMemory()});
    }setOutput({passed:results.filter(r=>r.passed).length,total:results.length,results});
  }catch(error){setOutput({error:String(error)});}finally{setBusy(false);}}
  return <section><h2>Conversation debugger</h2><p>Inspect the latest 25 turns, canonical commands, active objects, pending questions and resolved choices. Replay uses an isolated scene and checks final geometry.</p><label>Workspace<select value={mode} onChange={e=>setMode(e.target.value as RoboMode)}>{['geometry2d','geometry3d','graph2d','graph3d'].map(mode=><option key={mode}>{mode}</option>)}</select></label><div className="mt-actions"><button onClick={()=>setOutput(liveEngine(mode).workingMemory())}>Inspect live working memory</button><button disabled={busy} onClick={()=>void replay()}>Replay conversation dataset</button><a href="/datasets/math-robo-conversations.json">Download conversation dataset</a></div>{output!==undefined&&<pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',maxHeight:700,overflow:'auto'}}>{JSON.stringify(output,null,2)}</pre>}</section>;
}
