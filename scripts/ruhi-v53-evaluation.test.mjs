import {test} from 'node:test';
import assert from 'node:assert/strict';
import {auditPartitions} from './ruhi-v53-evaluation.mjs';
test('detects numeric-template leakage and keeps conversation crossings explicit',()=>{
 const records=[{scenarioId:'one',split:'train',userUtterance:'Please draw a circle radius 5'},
 {scenarioId:'two',split:'test',userUtterance:'Draw a circle radius 9'},
 {scenarioId:'one',split:'validation',userUtterance:'Move it right 2'}];
 const audit=auditPartitions(records);
 assert.equal(audit.templateCrossings.length,1);
 assert.deepEqual(audit.scenarioCrossings,[{key:'one',splits:['train','validation']}]);
 assert.equal(audit.identicalTextCrossings.length,0);
});
