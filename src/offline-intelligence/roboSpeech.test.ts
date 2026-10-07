import { describe, expect, it } from 'vitest';
import { englishLocalVoices, normalizeRoboDictation } from './roboSpeech';
import { interpretVisualRequest } from './commands';

describe('English Robo voice skills', () => {
  it.each([
    ['create triangle base six height four', 'create triangle base 6 height 4'],
    ['rotate it forty five degrees', 'rotate it 45 degrees'],
    ['create sphere radius two point five', 'create sphere radius 2.5'],
    ['plot y equals x squared plus five', 'plot y = x^2 + 5'],
    ['create point at zero comma two', 'create point at 0, 2'],
    ['create sphere radius two point five six', 'create sphere radius 2.56'],
    ['rotate it one hundred and twenty degrees', 'rotate it 120 degrees'],
    ['plot y equals sine of x', 'plot y = sin(x)'],
    ['draw line from open parenthesis negative two comma zero close parenthesis to open parenthesis three comma four close parenthesis', 'draw line from(-2, 0) to(3, 4)'],
    ['resize width one hundred twenty height thirty', 'resize width 120 height 30'],
  ])('normalizes %s', (spoken, expected) => expect(normalizeRoboDictation(spoken)).toBe(expected));
  it('routes a spoken triangle into the existing drawing engine', () => {
    const result = interpretVisualRequest(normalizeRoboDictation('create triangle base six height four'), 'geometry2d');
    expect(result.command).toMatchObject({kind:'triangle', width:6, height:4});
  });
  it('excludes remote and non-English voices', () => {
    const voices = [{lang:'en-IN',localService:true,voiceURI:'local'}, {lang:'en-US',localService:false,voiceURI:'remote'}, {lang:'fr-FR',localService:true,voiceURI:'french'}] as SpeechSynthesisVoice[];
    expect(englishLocalVoices(voices).map(voice=>voice.voiceURI)).toEqual(['local']);
  });
});
