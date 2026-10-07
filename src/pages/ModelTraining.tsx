import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LayersModel } from '@tensorflow/tfjs';
import { BULK_MODEL, disposeClassifier, predictIntent, restoreClassifier, trainClassifier, type EpochResult, type TrainingReport } from '../offline-intelligence/bulkTraining';
import { SAMPLE_ROWS, TRAINING_LABELS, phraseGroup, readDataset, splitRows, type TrainingRow } from '../offline-intelligence/trainingDataset';
import './ModelTraining.css';
import SemanticTrainingLab from '../math-robo/SemanticTrainingLab';

function download(name: string, data: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const percent = (value: number) => `${(value * 100).toFixed(1)}%`;

export default function ModelTraining() {
  const [rows, setRows] = useState<TrainingRow[]>([]);
  const [fileName, setFileName] = useState('No dataset loaded');
  const [epochs, setEpochs] = useState(10), [batchSize, setBatchSize] = useState(256);
  const [busy, setBusy] = useState(false), [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Checking this browser for saved weights…');
  const [error, setError] = useState(''), [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<EpochResult[]>([]);
  const [report, setReport] = useState<TrainingReport>();
  const [saved, setSaved] = useState(false);
  const [phrase, setPhrase] = useState('Draw a rectangle 4 by 6');
  const [predictions, setPredictions] = useState<{ label: string; score: number }[]>([]);
  const model = useRef<LayersModel>();
  const cancelled = useRef(false), mounted = useRef(true);
  const summary = useMemo(() => {
    const split = splitRows(rows);
    return { ...split, unique: new Set(rows.map(row => phraseGroup(row.phrase))).size, classes: new Set(rows.map(row => row.label)).size };
  }, [rows]);
  useEffect(() => {
    let active = true;
    mounted.current = true;
    void restoreClassifier().then(result => {
      if (!active) { if (result) disposeClassifier(result.model); return; }
      if (result) { model.current = result.model; setReport(result.report); setHistory(result.report.history); setSaved(true); setStatus('Saved model restored. Test a phrase or download its weights.'); }
      else setStatus('Ready for a dataset. No bulk-trained model saved in this browser yet.');
    }).catch(reason => { if (active) setError(String(reason)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; mounted.current = false; cancelled.current = true; if (model.current) { disposeClassifier(model.current); model.current = undefined; } };
  }, []);

  async function upload(file?: File) {
    if (!file) return;
    setBusy(true); setError(''); setStatus('Reading and validating JSONL…');
    try { const parsed = await readDataset(file); if (mounted.current) { setRows(parsed); setFileName(file.name); setStatus(`${parsed.length.toLocaleString()} valid rows loaded.`); } }
    catch (reason) { if (mounted.current) setError(reason instanceof Error ? reason.message : String(reason)); }
    finally { if (mounted.current) setBusy(false); }
  }
  async function train() {
    setBusy(true); setError(''); setProgress(0); setHistory([]); cancelled.current = false;
    try {
      const result = await trainClassifier(rows, epochs, batchSize, () => cancelled.current, (fraction, message, epoch) => {
        if (mounted.current) { setProgress(fraction); setStatus(message); if (epoch) setHistory(previous => [...previous, epoch]); }
      });
      if (!mounted.current || cancelled.current) { disposeClassifier(result.model); return; }
      if (model.current) disposeClassifier(model.current);
      model.current = result.model; setReport(result.report); setPredictions([]); setSaved(false);
      try {
        await result.model.save(BULK_MODEL);
        if (mounted.current) { setSaved(true); setStatus('Training complete. Weights and training report saved in this browser.'); }
      } catch { if (mounted.current) setStatus('Training complete, but browser storage failed. Download the model files to keep your weights.'); }
      if (mounted.current) setProgress(1);
    } catch (reason) { if (mounted.current) setError(reason instanceof Error ? reason.message : String(reason)); }
    finally { if (mounted.current) setBusy(false); }
  }
  async function exportWeights() {
    setError('');
    try { await model.current!.save('downloads://math-robo-trained'); }
    catch (reason) { setError(`Download failed: ${String(reason)}`); }
  }

  return <main className="model-training">
    <SemanticTrainingLab/>
    <details><summary>Legacy intent classifier · existing Training Lab</summary>
    <header className="mt-hero"><div><span className="mt-eyebrow">MATH ROBO · TRAINING LAB</span><h1>Teach language for your math workspace.</h1><p>Train an intent classifier for 2D and 3D graphs, geometry objects, transformations, and questions about drawn objects.</p><div className="mt-tags"><span>Up to 100,000 rows</span><span>Local TensorFlow.js</span><span>Export real weights</span></div></div><div className="mt-model-card"><span>MODEL STATUS</span><strong>{report ? 'Trained model available' : 'Awaiting training'}</strong><p>{report ? `${report.rows.toLocaleString()} rows · ${percent(report.testAccuracy)} test accuracy` : 'Upload reviewed examples to build your model.'}</p><small>{report ? saved ? 'Saved on this browser and origin' : 'In memory · download to preserve' : 'No bulk weights created yet'}</small></div></header>
    <nav className="mt-links" aria-label="Training sections"><a href="#dataset">01 Dataset</a><a href="#train">02 Train</a><a href="#model">03 Model & weights</a><Link to="/workspace/graph">Open 2D graph ↗</Link><Link to="/workspace/3d">Open 3D geometry ↗</Link></nav>
    <div className="mt-notice"><strong>What is being trained?</strong> A small 512 → 64 → {TRAINING_LABELS.length} neural network predicts the operation label from the phrase. Numeric values, object references, geometry calculations, and interactive drawing are handled by workspace code. This lab model can be tested here; it does not automatically replace the live assistant. Reflection, perpendiculars, intersections, comparison, and containment labels need corresponding workspace handlers before deployment. The context field documents the scene but is not an input to this baseline classifier.</div>
    <section id="dataset" className="mt-panel"><div className="mt-section-heading"><div><span className="mt-eyebrow">01 / DATASET</span><h2>One request per JSONL row</h2><p>UTF-8 file, one JSON object per line. Keep examples human-reviewed and varied.</p></div><button onClick={() => download('math-robo-15-samples.jsonl', SAMPLE_ROWS.map(row => JSON.stringify(row)).join('\n') + '\n', 'application/x-ndjson')}>Download 15 sample rows</button></div>
      <div className="mt-schema"><div><code>phrase</code><p>What the person says, including dimensions and references.</p></div><div><code>mode</code><p>graph2d, graph3d, geometry2d, geometry3d, or normal.</p></div><div><code>label</code><p>Shape name or operation: midpoint, move, rotate, reflect, etc.</p></div><div><code>canonical</code><p>The reviewed, unambiguous intended command.</p></div><div><code>context</code><p>Existing object creation commands, required for follow-up operations.</p></div></div>
      <label className="mt-upload">Upload your dataset (.jsonl, up to 100 MB)<input aria-label="Upload training dataset" type="file" accept=".jsonl,.ndjson" disabled={busy || loading} onChange={event => { void upload(event.target.files?.[0]); event.target.value = ''; }} /></label>
      <div className="mt-stats"><div><strong>{rows.length.toLocaleString()}</strong><span>Validated rows</span></div><div><strong>{summary.unique.toLocaleString()}</strong><span>Unique phrase groups</span></div><div><strong>{summary.classes}</strong><span>Labels represented</span></div><div><strong>{summary.train.length.toLocaleString()} / {summary.validation.length.toLocaleString()} / {summary.test.length.toLocaleString()}</strong><span>Train / validation / test</span></div></div><p className="mt-muted">{fileName}. Deterministic phrase-group split: approximately 80% / 10% / 10%. Repeated wording and numeric variants stay together to reduce evaluation leakage.</p>
      <details><summary>View all 15 sample rows</summary><div className="mt-table-wrap"><table><thead><tr><th>Phrase</th><th>Mode / label</th><th>Canonical command & context</th></tr></thead><tbody>{SAMPLE_ROWS.map(row => <tr key={row.phrase}><td>{row.phrase}</td><td><code>{row.mode}</code><br/><code>{row.label}</code></td><td>{row.canonical}{row.context && <small>Scene: {row.context.join(' → ')}</small>}</td></tr>)}</tbody></table></div></details>
      <details><summary>Dataset plan for 100,000 rows</summary><p>Suggested mix: 35,000 object creation examples; 20,000 graph expressions; 20,000 move, rotate, scale and reflect examples; 20,000 contextual geometry questions and constructions; 5,000 invalid or unsupported requests. Cover all four workspaces, paraphrases, units, negatives, ambiguous references, multiple objects, and boundary cases. For 3D comparisons, specify volume or surface area; for 2D comparisons, specify area or perimeter.</p><p>Use diverse reviewed phrases for every label so each split contains that label. The 15 rows are a schema template, not a sufficient training set. Repeating them to reach 100K does not add knowledge. The classifier ignores numbers, so keep numerical correctness tests separate. Label unsupported requests as <code>unsupported</code> and give the intended clarification in canonical.</p><p>More rows improve language coverage only if labels are correct. Browser training uses batches rather than a 100K × 512 tensor; duration depends on device and epochs. This is an intent model, not an LLM or a geometry reasoning model.</p></details>
      <details><summary>Allowed labels</summary><p className="mt-labels">{TRAINING_LABELS.map(label => <code key={label}>{label}</code>)}</p></details>
    </section>
    <div className="mt-columns"><section id="train" className="mt-panel"><span className="mt-eyebrow">02 / TRAIN</span><h2>Train in batches</h2><div className="mt-controls"><label>Epochs<input aria-label="Epochs" type="number" min="1" max="100" value={epochs} disabled={busy} onChange={e => setEpochs(Number(e.target.value))}/></label><label>Batch size<select aria-label="Batch size" value={batchSize} disabled={busy} onChange={e => setBatchSize(Number(e.target.value))}>{[64,128,256,512].map(size => <option key={size}>{size}</option>)}</select></label></div><div className="mt-actions"><button className="mt-primary" disabled={busy || loading || !rows.length} onClick={() => void train()}>{busy ? 'Working…' : 'Start training'}</button>{busy && <button onClick={() => { cancelled.current = true; }} disabled={status.startsWith('Reading')}>Stop training</button>}</div><progress aria-label="Training progress" max="1" value={progress}/><p role="status" aria-live="polite">{status}</p>{error && <p role="alert" className="mt-error">{error}</p>}<p className="mt-muted">Keep this page open while training. Stop is checked between batches. Completed weights are saved automatically when browser storage is available.</p>{history.length > 0 && <div className="mt-table-wrap"><table><thead><tr><th>Epoch</th><th>Training loss</th><th>Validation accuracy</th></tr></thead><tbody>{history.map(item => <tr key={item.epoch}><td>{item.epoch}</td><td>{item.loss.toFixed(4)}</td><td>{percent(item.validationAccuracy)}</td></tr>)}</tbody></table></div>}</section>
    <section id="model" className="mt-panel"><span className="mt-eyebrow">03 / MODEL & WEIGHTS</span><h2>Inspect your trained model</h2>{report ? <><div className="mt-stats"><div><strong>{percent(report.testAccuracy)}</strong><span>Held-out test accuracy</span></div><div><strong>{model.current?.countParams().toLocaleString()}</strong><span>Learned parameters</span></div></div><p>Trained {new Date(report.createdAt).toLocaleString()} · {report.backend} · {report.durationSeconds.toFixed(1)} seconds</p><p>{report.trainRows.toLocaleString()} training, {report.validationRows.toLocaleString()} validation, {report.testRows.toLocaleString()} test rows.</p><div className="mt-actions"><button disabled={busy} onClick={() => void exportWeights()}>Download model.json + weights.bin</button><button disabled={busy} onClick={() => download('training-report.json', JSON.stringify(report, null, 2))}>Download report</button></div><p className="mt-muted">Allow multiple downloads if your browser prompts. model.json includes topology, ordered labels, feature version and report; weights.bin contains learned floating-point weights. Keep both files together.</p><label>Try a request<input aria-label="Test request" value={phrase} onChange={e => setPhrase(e.target.value)} /></label><button disabled={busy || !phrase.trim()} onClick={() => { try { setPredictions(predictIntent(model.current!, phrase)); } catch (reason) { setError(String(reason)); } }}>Predict operation</button>{predictions.length > 0 && <ul className="mt-predictions">{predictions.map(item => <li key={item.label}><code>{item.label}</code><span>{percent(item.score)}</span></li>)}</ul>}<p className="mt-muted">Softmax scores are model scores, not verified probabilities of geometric correctness.</p><details><summary>Test accuracy by label</summary><table><thead><tr><th>Label</th><th>Test rows</th><th>Correct</th></tr></thead><tbody>{report.perLabel.map(item => <tr key={item.label}><td>{item.label}</td><td>{item.rows}</td><td>{percent(item.correct / item.rows)}</td></tr>)}</tbody></table></details></> : <p className="mt-empty">After training, view test accuracy, parameter count, label results and predictions here. Download buttons appear once real weights exist.</p>}<details><summary>Where are the weights stored?</summary><p>Bulk training model: <code>{BULK_MODEL}</code>. Open browser Developer Tools → Application → IndexedDB → tensorflowjs to inspect storage. This page restores the latest saved bulk model after reload, on this browser and origin (<code>localhost:9867</code>).</p><p>The existing assistant separately stores its original model at <code>indexeddb://math-robo-intents-v3</code>. Changing browser, port, or clearing site data changes available local models. Download files for a portable copy.</p></details></section></div>
    </details>
  </main>;
}

