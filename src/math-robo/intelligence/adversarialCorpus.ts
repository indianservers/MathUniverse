import {SemanticEngine} from './semanticEngine';
import {geometryState} from './resultVerifier';
import type {RoboMode} from './types';
// Authored intent negatives; surface perturbations are kept in the same family.
// This corpus measures refusal/state safety, not positive language understanding.
const negatives=[
 'Maybe delete that circle','Perhaps remove everything','I might draw a triangle later',
 'I like circles','I love drawing triangles','I think we should discuss rectangles',
 'Tell me about drawing a circle','Tell me about deleting objects','What is geometry?',
 'Do you think I should delete it?','What happens if I draw a circle?',
 'How would I move a triangle?','Why would someone remove a circle?',
 'What does rotate a square mean?','Where can I learn to draw a sphere?',
 'Which lesson teaches how to create cubes?','Is drawing a triangle difficult?',
 'Are there instructions to delete a shape?','Explain the word rectangle',
 'Explain why people draw circles','Explain how to delete a shape',
 'Why draw a rectangle?','Show me why triangles are useful',
 'Do not delete the circle','Do not move anything','Never remove all objects',
 "Don't rotate the shape","Don't draw a cube","Don't create more objects",
 'Stop deleting things','Cancel drawing a triangle','Avoid removing the circle',
 'Help me understand drawing','Can we discuss how to move shapes?',
 'Would a circle be useful here?','Should I create a square?',
 'Yesterday I drew a circle','Tomorrow I will draw a triangle',
 'My teacher said delete everything','The worksheet says draw a circle',
 'The phrase is create a rectangle','The example is move it right',
 'I am not asking you to draw anything','I wonder whether to remove it',
 'This circle looks weird','This triangle looks incorrect',
 'Maybe rotate it','Perhaps create another circle','I might clear the canvas',
 'Tell me about the command move it right',
];
const modes:RoboMode[]=['graph2d','graph3d','geometry2d','geometry3d'];
const variants=(text:string)=>[text,text+'.',text+'?',text+'!',text.toUpperCase(),text.replaceAll(' ','  '),'Please '+text,'Kindly '+text,'  '+text+'  ',text.replaceAll(' ','\t')];
export const adversarialCorpus=negatives.flatMap((text,family)=>modes.flatMap(mode=>variants(text).map((phrase,variant)=>({id:`negative-${family}-${mode}-${variant}`,family:`negative-${family}`,phrase,mode,expected:'no-mutation' as const}))));
export async function runAdversarialSafety(){
 const errors:{id:string;phrase:string;status:string}[]=[];let falseMutations=0;
 for(const row of adversarialCorpus){const engine=new SemanticEngine(row.mode);await engine.execute('Create a circle radius 5',async()=>undefined);const before=geometryState(engine.snapshot());let effects=0;const result=await engine.execute(row.phrase,async()=>{effects++;});const changed=before!==geometryState(engine.snapshot())||effects>0;if(changed){falseMutations++;errors.push({id:row.id,phrase:row.phrase,status:result.status});}}
 return {rows:adversarialCorpus.length,families:negatives.length,scope:'Intent-negative safety with grouped speech/format perturbations; not unrestricted NLP accuracy',passed:adversarialCorpus.length-falseMutations,falseMutations,accuracy:1-falseMutations/adversarialCorpus.length,errors};
}
