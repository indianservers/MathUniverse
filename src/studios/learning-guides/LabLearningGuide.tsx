import { useId, useState } from 'react';
import { labLearningGuides } from './labLearningGuides';
import './labLearningGuide.css';

export default function LabLearningGuide({ route }: { route: string }) {
 const guide = labLearningGuides[route];
 return guide ? <Guide key={route} guide={guide} /> : null;
}
function Guide({ guide }: { guide: (typeof labLearningGuides)[string] }) {
 const id = useId(), [choice, setChoice] = useState<number | null>(null), [checked, setChecked] = useState(false);
 const [prediction, setPrediction] = useState('');
 return <details className="lab-learning-guide" data-lab-pane="workspace">
  <summary>Explore with a worked example <span>Prediction · experiment · reasoning</span></summary>
  <div className="lab-learning-guide__body">
   <p className="lab-learning-guide__objective"><strong>Your goal:</strong> {guide.objective}</p>
   <div className="lab-learning-guide__columns"><div><h3>The idea</h3><p>{guide.theory}</p><h3>Worked example</h3><ol>{guide.example.map(step => <li key={step}>{step}</li>)}</ol></div>
   <div><h3>Try it in the tool</h3><p>{guide.experiment}</p><label htmlFor={`${id}-prediction`}>Your prediction and reason</label><textarea id={`${id}-prediction`} value={prediction} onChange={event => setPrediction(event.target.value)} placeholder="I expect… because…" /><p className="lab-learning-guide__note">Use the existing tool, then compare the result with your prediction. This note stays here while you explore; it is not graded.</p></div></div>
   <fieldset><legend>Check your reasoning</legend><p>{guide.question}</p>{guide.choices.map((answer, index) => <label className="lab-learning-guide__choice" key={answer}><input type="radio" name={`${id}-answer`} checked={choice === index} onChange={() => { setChoice(index); setChecked(false); }} />{answer}</label>)}</fieldset>
   <button type="button" disabled={choice === null} onClick={() => setChecked(true)}>Check reasoning</button>
   {checked && choice !== null ? <p className="lab-learning-guide__feedback" role="status"><strong>{choice === guide.correct ? 'Correct. ' : 'Reconsider. '}</strong>{guide.feedback[choice]}</p> : null}
  </div>
 </details>;
}
