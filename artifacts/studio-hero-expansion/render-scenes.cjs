// Render the production canvas implementation directly for composition review.
const {createCanvas,GlobalFonts}=require('C:/Users/saisa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
GlobalFonts.registerFromPath('C:/Windows/Fonts/segoeui.ttf','system-ui');
GlobalFonts.registerFromPath('C:/Windows/Fonts/georgia.ttf','Georgia');
GlobalFonts.registerFromPath('C:/Windows/Fonts/seguisym.ttf','Segoe UI Symbol');
GlobalFonts.registerFromPath('C:/Windows/Fonts/cambria.ttc','Cambria Math');
const {drawMathScene}=require('../../tmp/studio-scene.cjs');
const fs=require('node:fs');
const studios=['algebra','number-systems','calculus','differential-equations','complex-numbers','structures','geometry','linear-algebra','modelling','discrete','sets','graphs','statistics','continued-fractions','famous-problems','stats-inference','special-functions','advanced-de'];
for(const id of studios){
 const canvas=createCanvas(1140,930),ctx=canvas.getContext('2d');ctx.scale(1.5,1.5);
 const paint=()=>{const bg=ctx.createRadialGradient(420,310,0,420,310,470);bg.addColorStop(0,'#183260');bg.addColorStop(.5,'#0a1635');bg.addColorStop(1,'#040a1b');ctx.fillStyle=bg;ctx.fillRect(0,0,760,620);};
 // drawMathScene clears its own stage; use a background below the transparent layer.
 drawMathScene(ctx,id,760,620,8);ctx.globalCompositeOperation='destination-over';paint();ctx.globalCompositeOperation='source-over';
 fs.writeFileSync(`${__dirname}/${id}.png`,canvas.toBuffer('image/png'));
}
console.log(`Rendered ${studios.length} studio scenes.`);
