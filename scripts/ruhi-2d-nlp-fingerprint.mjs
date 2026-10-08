import fs from 'node:fs';
import crypto from 'node:crypto';
export function fingerprint(){
 const paths=[];function visit(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const path=`${dir}/${entry.name}`;if(entry.isDirectory())visit(path);else if(/\.(?:ts|tsx)$/.test(path)&&!path.includes('.test.'))paths.push(path);}}
 for(const dir of ['src/math-robo/intelligence','src/math-robo/kernel','src/offline-intelligence'])visit(dir);
 paths.push('src/pages/MathLabGraphingCalculator.tsx','src/components/math-lab/FunctionGraphCanvas.tsx','public/models/math-robo-intelligence-v4/model.json','public/models/math-robo-intelligence-v4/weights.bin');
 return crypto.createHash('sha256').update(paths.sort().map(path=>`${path}:${crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')}`).join('\n')).digest('hex');
}
