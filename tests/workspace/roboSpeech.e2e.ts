import { test, expect, type Page } from '@playwright/test';

async function mockSpeech(page: Page, availability = 'available') {
  await page.addInitScript(({availability}) => {
    const state = { local:false, aborted:0, stopped:0, text:'', voice:'', cancelled:0, installed:0, availability };
    Object.assign(window, {roboSpeechTest:state});
    class Recognition {
      processLocally=false; lang=''; continuous=false; interimResults=false;
      onresult: ((event: {results: {0:{transcript:string}}[]})=>void)|null=null;
      onerror: ((event:{error:string})=>void)|null=null;
      onend:(()=>void)|null=null;
      static async available() {return state.availability;}
      static async install() {state.installed++;state.availability='available';return true;}
      start() {state.local=this.processLocally;Object.assign(window,{testRecognition:this});}
      stop() {state.stopped++;this.onend?.();}
      abort() {state.aborted++;}
    }
    Object.defineProperty(window,'SpeechRecognition',{value:Recognition,configurable:true});
    class Utterance { text:string; voice:unknown=null; lang=''; onend=null; onerror=null; constructor(text:string) {this.text=text;} }
    Object.defineProperty(window,'SpeechSynthesisUtterance',{value:Utterance,configurable:true});
    const voices=[{name:'Device English',lang:'en-IN',localService:true,voiceURI:'local'},{name:'Cloud English',lang:'en-US',localService:false,voiceURI:'remote'}];
    Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>voices,addEventListener:()=>{},removeEventListener:()=>{},speak:(utterance:{text:string;voice:{voiceURI:string}})=>{state.text=utterance.text;state.voice=utterance.voice.voiceURI;},cancel:()=>{state.cancelled++;}},configurable:true});
  }, {availability});
}

test('English dictation draws a triangle and local TTS stops on close',async({page})=>{
  await mockSpeech(page);await page.goto('/workspace/geometry');
  await page.getByRole('button',{name:'Ask Math · Offline'}).click();
  await page.getByRole('button',{name:'Dictate in English'}).click();
  await expect(page.getByRole('button',{name:'Stop dictation'})).toBeVisible();
  expect(await page.evaluate(()=>Reflect.get(window,'roboSpeechTest').local)).toBe(true);
  await page.evaluate(()=>{const recognition=Reflect.get(window,'testRecognition');recognition.onresult({results:[{0:{transcript:'create triangle base six height four'}}]});recognition.onend();});
  await expect(page.getByLabel('What would you like to create or solve?')).toHaveValue('create triangle base 6 height 4');
  await page.getByRole('button',{name:'Run request',exact:true}).click();
  await expect(page.getByTestId('workspace-geometry-board').locator('polygon')).toHaveCount(1);
  await page.getByRole('button',{name:'Read answer',exact:true}).click();
  expect(await page.evaluate(()=>Reflect.get(window,'roboSpeechTest').voice)).toBe('local');
  await expect(page.getByRole('button',{name:'Stop reading'})).toBeVisible();
  await page.getByRole('button',{name:'Close Ruhi',exact:true}).click();
  expect(await page.evaluate(()=>Reflect.get(window,'roboSpeechTest').cancelled)).toBe(1);
});

test('English pack installs only after the explicit install action',async({page})=>{
  await mockSpeech(page,'downloadable');await page.goto('/');
  await page.getByRole('button',{name:'Ask Math · Offline'}).click();
  await page.getByRole('button',{name:'Dictate in English'}).click();
  await expect(page.getByRole('button',{name:'Install English pack'})).toBeVisible();
  expect(await page.evaluate(()=>Reflect.get(window,'roboSpeechTest').installed)).toBe(0);
  await page.getByRole('button',{name:'Install English pack'}).click();
  await expect(page.getByRole('button',{name:'Stop dictation'})).toBeVisible();
  await page.getByRole('button',{name:'Close Ruhi',exact:true}).click();
  expect(await page.evaluate(()=>Reflect.get(window,'roboSpeechTest').aborted)).toBe(1);
});

test('unavailable local recognition never starts a microphone',async({page})=>{
  await mockSpeech(page,'unavailable');await page.goto('/');
  await page.getByRole('button',{name:'Ask Math · Offline'}).click();
  await page.getByRole('button',{name:'Dictate in English'}).click();
  await expect(page.getByText('Offline English dictation is unavailable in this browser. You can still type requests.',{exact:true})).toBeVisible();
  expect(await page.evaluate(()=>Reflect.get(window,'testRecognition'))).toBeUndefined();
});

test('microphone denial gives a usable typed fallback',async({page})=>{
  await mockSpeech(page);await page.goto('/');
  await page.getByRole('button',{name:'Ask Math · Offline'}).click();
  await page.getByRole('button',{name:'Dictate in English'}).click();
  await page.evaluate(()=>Reflect.get(window,'testRecognition').onerror({error:'not-allowed'}));
  await expect(page.getByText(/Microphone permission was denied/)).toBeVisible();
  await page.getByLabel('What would you like to create or solve?').fill('2+2');
  await expect(page.getByRole('button',{name:'Run request',exact:true})).toBeEnabled();
});
