import fs from 'node:fs';
const pages=[
 ['home','Studio Home','Number A','Number B','distance, midpoint and comparison','Across zero / Same point / Mixed forms'],
 ['fundamentals','Fundamentals','Number A','Number B','exact membership, comparison and distance','Zero / Fraction / Irrational'],
 ['natural-whole','Natural & Whole Numbers','Count','Step size','successor, predecessor and joining collections','Empty collection / First natural / Join collections'],
 ['integers','Integers Explorer','Start A','Change B','addition, subtraction, multiplication, division, opposite and distance','Warm up 5°C / Remove a debt / Below ground / Opposite signs'],
 ['rational','Rational Numbers','Numerator','Denominator','decimal, percentage and equivalent fraction scaling','One third / Reduce 8/12 / Negative ratio'],
 ['irrational','Irrational Numbers','Radicand n','Decimal places','square roots, square area and approximation error','Unit-square diagonal / Perfect square / Fine approximation'],
 ['real-line','Real Number Line','Position A','Position B','midpoint, distance and order','Between fractions / Opposite sides / Irrational position'],
 ['hierarchy','Number Sets Hierarchy','Number A','Number B','exact membership and nested sets','Natural nested in real / Rational but not integer / Outside Q'],
 ['fractions-decimals-percentages','Fractions, Decimals & Percentages','Parts','Whole','percentages, decimals and scaling','Half full / 75% discount / More than a whole'],
 ['ordering-comparing','Ordering & Comparing','Number A','Number B','mixed-form order, equivalence, distance and midpoint','Equivalent forms / Negative fractions / Root versus decimal'],
 ['absolute-distance-intervals','Absolute Value, Distance & Intervals','Endpoint A','Endpoint B','open/closed intervals, distance, midpoint and absolute value','Straddles zero / Zero boundary / Single point'],
 ['properties-operations','Properties & Operations','Operand A','Operand B','set closure and the four arithmetic operations','Integer division fails / Cancellation in I / Product in I'],
 ['formula-visualizer','Formula Visualizer','Input A','Input B','distance, midpoint, comparison, absolute value and signed arithmetic','Midpoint / Distance / Compare mixed forms'],
];
const lines=['# Number Systems: 25 implemented interaction enhancements per page','','A shared experiment component applies 25 enhancements to the home page and each of the 12 main labs. Each instance uses its own mathematical rules, relationships, presets and feedback. Original lessons and additional lab tools remain below the new experiment.','','## Page coverage','','| Page | Enhancements | Primary live experiments |','|---|---:|---|',...pages.map(([id,title,a,b,modes])=>`| [${title}](http://127.0.0.1:5175/number-systems${id==='home'?'':'/'+id}) | 25 | ${modes} |`),'','## What changed beyond the controls','','The lab banners are shorter; the experiment appears first, with playback above the diagram. Predict mode moves its answer controls above the model. A/B handles stay labelled while using decimal display. Read-only results are distinguished from draggable inputs. Touch, keyboard, compact screens and a focus mode are supported. Integer comparison questions in the additional sandbox now use its actual points; changing its model clears stale feedback.','','Shared undo/redo and share operate on the same model that drives the new figure. Inputs that violate the mathematical domain show an error and remove the invalid figure. Score is persistent per page, awards a distinct model once, and gives no points after showing its solution. Finite approximations are not used to claim exact irrational membership or prove closure.',''];
for(const [id,title,a,b,modes,presets] of pages){
 const items=[
 `Drag **${a}** on the live line and recompute the selected relationship.`,
 `Drag **${b}** independently; the fields follow the handle.`,
 `Type the model inputs directly, with domain-specific validation and errors.`,
 `Slide **${a}** continuously, using whole steps in integer-only experiments.`,
 `Slide **${b}**; the approximation lab uses this to adjust precision.`,
 `Use accessible −/+ buttons to nudge either input.`,
 `Switch among **${modes}** while keeping the current inputs.`,
 `Load working presets: **${presets}**.`,
 `Shuffle inputs to create varied, valid experiments.`,
 `Read synchronized result and inspector cards for the current model.`,
 `Move backward or forward through three computed reasoning stages.`,
 `Play, pause and replay those stages${id==='integers'?' with a moving signed-number walker':''}.`,
 `Select 0.5×, 1× or 2× playback speed.`,
 `Scrub the reasoning timeline to inspect a particular stage.`,
 `Hide the result and make a prediction before revealing it.`,
 `Check a prediction against this page’s displayed model, rather than a fixed answer.`,
 `Request a hint matched to the active relationship.`,
 `Reveal the model’s solution with scoring disabled for that attempt.`,
 `Generate the next model-based challenge.`,
 `Choose Starter, Explorer or Stretch difficulty for generated inputs.`,
 `Track points, attempts, accuracy, current streak and best streak; repeat awards are blocked.`,
 `Save an experiment on the device and restore it later.`,
 `Undo and redo mathematical model edits, including typed and dragged changes.`,
 `Share the current model in a reloadable page URL.`,
 `Write observations, revisit their models, delete them and copy the notebook.`,
 ];
 lines.push(`## ${title}`,'',...items.map((s,i)=>`${i+1}. ${s}`),'');
}
lines.push('## Verification','','The reproducible checks and results are stored beside this report: verify.mjs, results.json, tests.txt, browser.txt and build.txt. Viewport screenshots are named by page and width. Verification results are recorded after the final run. Changes remain uncommitted.','');
fs.writeFileSync('artifacts/number-systems-interactions/ENHANCEMENTS.md',lines.join('\n'));
