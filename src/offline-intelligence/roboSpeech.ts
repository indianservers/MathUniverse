import {roboEvents} from '../math-robo/character/engine';
import { useEffect, useRef, useState } from 'react';
import { browserSpeechRecognitionConstructor, normalizeSpokenMath, type BrowserSpeechRecognition } from '../workspace/browserSpeechInput';

type Availability = 'available' | 'downloadable' | 'downloading' | 'unavailable';
type LocalRecognition = BrowserSpeechRecognition & { processLocally: boolean };
type LocalConstructor = (new () => LocalRecognition) & {
  available?: (options: { langs: string[]; processLocally: boolean }) => Promise<Availability>;
  install?: (options: { langs: string[]; processLocally: boolean }) => Promise<boolean>;
};
const options = { langs: ['en-US'], processLocally: true };
const numbers: Record<string, number> = { zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10, eleven:11, twelve:12, thirteen:13, fourteen:14, fifteen:15, sixteen:16, seventeen:17, eighteen:18, nineteen:19, twenty:20, thirty:30, forty:40, fifty:50, sixty:60, seventy:70, eighty:80, ninety:90 };
const numberWords = `${Object.keys(numbers).join('|')}|hundred|thousand`;

export function normalizeRoboDictation(text: string): string {
  const digits = 'zero|one|two|three|four|five|six|seven|eight|nine';
  const prepared = text.toLowerCase()
    .replace(new RegExp(`\\bpoint ((?:${digits})(?:[ -]+(?:${digits}))*)\\b`, 'g'), (_, fraction: string) => `point ${fraction.split(/[ -]+/).map(word=>numbers[word]).join('')}`)
    .replace(/\b(hundred|thousand) and (?=\w)/g, '$1 ')
    .replace(/\bnegative (?=\w)/g, 'minus ')
    .replace(/\bcomma\b/g, ',')
    .replace(/\b(sine|cosine|tangent) of ([a-z])\b/g, (_, name: string, variable: string) => `${({sine:'sin',cosine:'cos',tangent:'tan'} as Record<string,string>)[name]}(${variable})`);
  const converted = prepared.replace(new RegExp(`\\b(?:${numberWords})(?:[ -]+(?:${numberWords}))*\\b`, 'g'), phrase => {
    let total = 0, part = 0;
    for (const word of phrase.split(/[ -]+/)) {
      if (word === 'hundred') part = (part || 1) * 100;
      else if (word === 'thousand') { total += (part || 1) * 1000; part = 0; }
      else part += numbers[word];
    }
    return String(total + part);
  }).replace(/(\d+) point (\d+)/g, '$1.$2');
  return normalizeSpokenMath(converted).replace(/-\s+(?=\d)/g, '-').replace(/\s*,\s*/g, ', ').replace(/\s*\(\s*/g, '(').replace(/\s*\)/g, ')');
}

export function englishLocalVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  return voices.filter(voice => voice.localService && /^en(?:-|$)/i.test(voice.lang));
}

export function useRoboSpeech(active: boolean, route: string, onTranscript: (text: string) => void) {
  const [message, setMessage] = useState('English voice: check microphone support to begin.');
  const [availability, setAvailability] = useState<Availability>('unavailable');
  const [listening, setListening] = useState(false);
  const [checking, setChecking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState('');
  const recognition = useRef<LocalRecognition>();
  const utterance = useRef<SpeechSynthesisUtterance>();
  const generation = useRef(0);
  const transcript = useRef(onTranscript);
  transcript.current = onTranscript;

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const refresh = () => setVoices(englishLocalVoices(synth.getVoices()));
    refresh(); synth.addEventListener('voiceschanged', refresh);
    return () => synth.removeEventListener('voiceschanged', refresh);
  }, []);

  useEffect(() => {
    const session = generation;
    return () => {
      session.current++;
      const mic = recognition.current;
      if (mic) { mic.onresult = null; mic.onerror = null; mic.onend = null; mic.abort(); recognition.current = undefined; }
      if (utterance.current) { utterance.current.onstart=null; utterance.current.onpause=null; utterance.current.onresume=null; utterance.current.onend = null; utterance.current.onerror = null; window.speechSynthesis?.cancel(); utterance.current = undefined; roboEvents.emit({type:'speechEnd'}); }
      setListening(false); setSpeaking(false); setChecking(false);
    };
  }, [active, route]);

  async function microphone(install = false) {
    if (listening) { recognition.current?.stop(); return; }
    const token = ++generation.current;
    setChecking(true);
    try {
      const Constructor = browserSpeechRecognitionConstructor() as LocalConstructor | undefined;
      if (!Constructor?.available) throw new Error('Offline English dictation is unavailable in this browser. You can still type requests.');
      let status = await Constructor.available(options);
      if (token !== generation.current) return;
      if (install && status === 'downloadable' && Constructor.install) {
        setMessage('Downloading the English language pack. Internet is needed for this one-time setup.');
        if (!await Constructor.install(options)) throw new Error('English language pack installation failed. Try again when connected.');
        status = await Constructor.available(options);
      }
      if (token !== generation.current) return;
      setAvailability(status);
      if (status !== 'available') {
        setMessage(status === 'downloadable' ? 'Install the English language pack once to dictate offline.' : status === 'downloading' ? 'English language pack is downloading. Check again after it finishes.' : 'Offline English dictation is unavailable in this browser. You can still type requests.');
        return;
      }
      const mic = new Constructor();
      if (!('processLocally' in mic)) throw new Error('This browser cannot guarantee local dictation. You can still type requests.');
      mic.processLocally = true; mic.lang = 'en-US'; mic.continuous = false; mic.interimResults = false;
      mic.onresult = event => {
        if (token !== generation.current) return;
        const words = Array.from(event.results).map(result => result[0].transcript).join(' ');
        transcript.current(normalizeRoboDictation(words));
        setMessage('Dictation added. Review your request, then choose Run request.');
      };
      mic.onerror = event => {
        if (token !== generation.current) return;
        setListening(false);
        setMessage(event.error === 'not-allowed' ? 'Microphone permission was denied. Allow it in your browser, or type your request.' : `Dictation stopped: ${event.error || 'microphone unavailable'}. Try again or type your request.`);
      };
      mic.onend = () => { if (token === generation.current) { setListening(false); recognition.current = undefined; } };
      recognition.current = mic;
      stopSpeaking();
      mic.start(); roboEvents.emit({type:'listening'}); setListening(true); setMessage('Listening in English on your device…');
    } catch (error) {
      if (token === generation.current) { setListening(false); setMessage(error instanceof Error ? error.message : 'Unable to start offline dictation.'); }
    } finally { if (token === generation.current) setChecking(false); }
  }

  function stopSpeaking() {
    if (utterance.current) { utterance.current.onstart=null; utterance.current.onpause=null; utterance.current.onresume=null; utterance.current.onend = null; utterance.current.onerror = null; window.speechSynthesis.cancel(); utterance.current = undefined; }
    setSpeaking(false); roboEvents.emit({type:'speechEnd'});
  }

  function speak(text: string) {
    const voice = voices.find(item => item.voiceURI === voiceURI) ?? voices[0];
    if (!voice) { setMessage('No local English voice is installed. Add an English voice in your device speech settings.'); return; }
    stopSpeaking();
    const speech = new SpeechSynthesisUtterance(text.replace(/\^2\b/g, ' squared ').replace(/\^3\b/g, ' cubed ').replace(/\^/g, ' to the power of ').replace(/°/g, ' degrees ').replace(/×/g, ' times '));
    speech.voice = voice; speech.lang = voice.lang;
    speech.onstart = () => {setSpeaking(true);roboEvents.emit({type:'speechStart'});};
    speech.onpause = () => roboEvents.emit({type:'speechPause'});
    speech.onresume = () => roboEvents.emit({type:'speechResume'});
    speech.onend = () => {if(utterance.current!==speech)return;roboEvents.emit({type:'speechEnd'}); utterance.current = undefined; setSpeaking(false); };
    speech.onerror = () => {if(utterance.current!==speech)return;roboEvents.emit({type:'speechEnd'}); utterance.current = undefined; setSpeaking(false); setMessage('Read-aloud stopped. Try again.'); };
    utterance.current = speech; setSpeaking(true); window.speechSynthesis.speak(speech);
  }
  return { message, availability, listening, checking, speaking, voices, voiceURI, setVoiceURI, microphone, speak, stopSpeaking };
}
