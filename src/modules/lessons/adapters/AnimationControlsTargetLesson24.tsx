import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import type { LessonAdapterProps } from "../types";
import { LessonCartesianGraph } from "../graphs/LessonCartesianGraph";
import "./AnimationControlsTargetLesson24.css";

const FRAMES = [0, 0.5, 1, 1.5, 2, 2];
const SPEEDS = { "0.5x": 2800, "1x": 1800, "2x": 900 } as const;
const GRAPH_VIEW = {xMin:-302/55,xMax:(640-302)/55,yMin:(349-560)/55,yMax:349/55};

export default function AnimationControlsTargetLesson24({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [frame, setFrame] = useState(3);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<keyof typeof SPEEDS>("1x");
  const [loop, setLoop] = useState(true);
  const [actions, setActions] = useState(0);
  const a = FRAMES[frame],
    output = 2 * a + 1;
  const touch = () => {
    setActions((count) => count + 1);
    onInteraction();
  };
  const seek = (next: number) => {
    setFrame(Math.max(0, Math.min(FRAMES.length - 1, next)));
    touch();
  };
  useEffect(() => {
    setFrame(3);
    setPlaying(true);
    setSpeed("1x");
    setLoop(true);
    setActions(0);
  }, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () =>
        setFrame((current) => {
          if (current < FRAMES.length - 1) return current + 1;
          if (loop) return 0;
          setPlaying(false);
          return current;
        }),
      SPEEDS[speed],
    );
    return () => window.clearInterval(timer);
  }, [playing, speed, loop]);
  const togglePlaying = () => {
    setPlaying((value) => !value);
    touch();
  };

  return (
    <div
      className="animation-page"
      data-testid="algebra-mockup-0024"
      data-dedicated-lesson="24"
      data-object-model="timed-six-frame-affine-parameter-trace-playback-speed-loop-seek-output-model"
      data-frame={frame}
      data-a={a}
      data-output={output}
      data-playing={playing}
      data-speed={speed}
      data-loop={loop}
      data-actions={actions}
    >
      <nav className="animation-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>24 Animation Controls</b>
      </nav>
      <header className="animation-header">
        <h1>Animation Controls</h1>
        <p>Observe continuous mathematical change.</p>
        <nav>
          <b>♙ Foundational-Advanced</b>
          <b>ϟ Exploration Lab</b>
          <b>▣ Algebra View / Graph</b>
          <b>◴ 8-10 min</b>
        </nav>
      </header>
      <main className="animation-main">
        <section className="animation-left">
          <AnimationGraph frame={frame} resetToken={resetToken} />
          <section className="animation-timeline">
            <h2>Timeline</h2>
            <div
              className="animation-track"
              style={{ "--progress": frame / 5 } as CSSProperties}
            >
              {FRAMES.map((_, index) => (
                <button
                  type="button"
                  aria-label={`Seek frame ${index}`}
                  className={
                    index === frame ? "active" : index < frame ? "past" : ""
                  }
                  key={index}
                  onClick={() => seek(index)}
                >
                  <span>{index}</span>
                  <i />
                </button>
              ))}
            </div>
            <nav>
              <button type="button" className="play" onClick={togglePlaying}>
                {playing ? <Pause /> : <Play />}
                {playing ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={() => seek(frame - 1)}
                disabled={frame === 0}
              >
                <SkipBack />
                Step back
              </button>
              <button
                type="button"
                onClick={() => seek(frame + 1)}
                disabled={frame === FRAMES.length - 1}
              >
                <SkipForward />
                Step forward
              </button>
              <button
                type="button"
                className={loop ? "active" : ""}
                onClick={() => {
                  setLoop((value) => !value);
                  touch();
                }}
              >
                <RotateCcw />
                Loop
              </button>
            </nav>
          </section>
        </section>
        <aside className="animation-side">
          <section className="animation-rule">
            <Play />
            <span>
              <small>Animation rule</small>
              <b>
                Animate parameter <i>a</i> from 0 to 2
              </b>
              <em>Pause to inspect exact values.</em>
            </span>
          </section>
          <section className="animation-settings">
            <h2>Playback settings</h2>
            <label>
              Speed
              <select
                aria-label="Animation speed"
                value={speed}
                onChange={(event) => {
                  setSpeed(event.target.value as keyof typeof SPEEDS);
                  touch();
                }}
              >
                {Object.keys(SPEEDS).map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              Loop
              <button
                type="button"
                role="switch"
                aria-label="Loop animation"
                aria-checked={loop}
                className={loop ? "active" : ""}
                onClick={() => {
                  setLoop((value) => !value);
                  touch();
                }}
              >
                <i />
              </button>
            </label>
          </section>
          <section className="animation-current">
            <small>Current frame {frame}</small>
            <b>
              <i />a = {a.toFixed(1)}
            </b>
          </section>
          <section className="animation-output">
            <h2>Exact output at x = 2</h2>
            <b>y(2)={output}</b>
          </section>
          <section className="animation-table">
            <h2>Frame table</h2>
            <div>
              <b>Frame</b>
              <b>a</b>
              <b>y = ax + 1</b>
              <b>y(2)</b>
              {FRAMES.map((value, index) => (
                <button
                  type="button"
                  className={frame === index ? "active" : ""}
                  key={index}
                  onClick={() => seek(index)}
                >
                  <span>{index}</span>
                  <span>{value.toFixed(1)}</span>
                  <span>y = {value.toFixed(1)}x + 1</span>
                  <span>{2 * value + 1}</span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </main>
      <nav className="animation-neighbors">
        <a href="/lessons/core-workspaces/23-angle-sliders">
          ←
          <span>
            <small>Previous</small>
            <b>Angle Sliders</b>
          </span>
        </a>
        <a href="/lessons/core-workspaces/25-dependent-and-independent-objects">
          <span>
            <small>Next</small>
            <b>Dependent and Independent Objects</b>
          </span>
          →
        </a>
      </nav>
    </div>
  );
}

function AnimationGraph({frame,resetToken}:{frame:number;resetToken:number}) {
  const [view,setView]=useState(GRAPH_VIEW);
  useEffect(()=>setView(GRAPH_VIEW),[resetToken]);
  const active=FRAMES[frame];
  const traces=[active,...FRAMES.slice(Math.max(0,frame-2),frame).reverse()]
    .filter((value,index,array)=>array.indexOf(value)===index).slice(0,3);
  const colors=['#087cf0','#8dc5fc','#acd7ff'];
  return <LessonCartesianGraph title="y = ax + 1" description={`Current frame ${frame}: a = ${active.toFixed(1)}`}
    view={view} onViewChange={setView} onResetView={()=>setView(GRAPH_VIEW)} aspectRatio={640/560}
    legend={traces.map((slope,index)=>({id:`trace-${index}`,label:`${index===0?'Current':'Previous'}: a = ${slope.toFixed(1)}`,color:colors[index],dashed:index>0}))}
    series={traces.map((slope,index)=>({id:`trace-${index}`,label:`y = ${slope}x + 1`,color:colors[index],dashed:index>0,dashPattern:index===1?'8 5':index===2?'3 4':undefined,points:[{x:-5,y:-5*slope+1},{x:5,y:5*slope+1}]}))}
    annotations={[{id:'intercept',x:0,y:1,label:'(0, 1)',color:'#087cf0'},{id:'output',x:2,y:2*active+1,label:`(2, ${2*active+1})`,color:'#087cf0'}]}/>;
}


